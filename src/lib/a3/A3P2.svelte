<script lang="ts">
	import * as d3 from 'd3';
	import qualityLevels from '$lib/a3/qualityLevels.json';
	import { derived } from 'svelte/store';

	// Data Type Definitions
	type DataByDataset = Record<string, Item[]>;

	interface Item {
		city: string;
		country: string;
		mainPollutant: string;
		pm25: number;
		state: string;
		stationName: string;
		timestamp: Date;
		usAqi: number;
	}

	interface MonthlyStat {
		dateRange: [Date, Date];
		averageAqi: number;
		percentile10: number;
		percentile90: number;
	}

	// Data Loading
	const { data }: { data: DataByDataset } = $props();
	// Flatten all datasets into a single array for global calculations
	const flatData: Item[] = Object.values(data).flat();
	let datasetNames = $derived(Object.keys(data));

	// States and simple derived
	let innerWidth = $state(0);
	let width = $state(800);
	let height = $derived(width * 0.6);
	let margin = $state({ top: 20, right: 20, bottom: 40, left: 40 });
	let showRaw = $state(false);
	let selectedDataset: keyof typeof data = $state('Avalon');
	let hoveredDataset: string | null = $state(null);
	let hoveredTooltip: string | null = $state(null);
	let mouseX = $state(0);
	let mouseY = $state(0);
	let zoomLevel = $state(1);

	// Scales
	let baseXScale = $derived(
		d3
			.scaleTime()
			.domain([
				d3.min(flatData, (d) => d.timestamp) ?? new Date(),
				d3.max(flatData, (d) => d.timestamp) ?? new Date()
			])
			.range([margin.left, width - margin.right])
	);

	let baseYScale = $derived(
		d3
			.scaleLinear()
			.domain([0, d3.max(flatData, (d) => d.usAqi) ?? 500])
			.range([height - margin.bottom, margin.top])
	);

	// This layer of abstraction fixed an issue I had where zooming would reset the base and allow infinite zoom in but no zoom out with extent [1,10].
	let xScale = $derived(baseXScale);
	let yScale = $derived(baseYScale);

	// Axes
	let xAxis = $derived(d3.axisBottom(xScale));
	let yAxis = $derived(d3.axisLeft(yScale));
	let yAxisGrid = $derived(
		d3
			.axisLeft(yScale)
			.tickSize(-(width - margin.left - margin.right))
			.tickFormat(() => '')
	);

	// References to the SVG groups for axes
	let xAxisRef: SVGGElement;
	let yAxisRef: SVGGElement;
	let yAxisGridRef: SVGGElement;

	// Update axes when data or dimensions change
	$effect(() => {
		if (xAxisRef && flatData.length > 0) {
			d3.select(xAxisRef).call(xAxis);
		}
		if (yAxisRef && flatData.length > 0) {
			d3.select(yAxisRef).call(yAxis);
		}
		if (yAxisGridRef && flatData.length > 0) {
			d3.select(yAxisGridRef).call(yAxisGrid);
		}
	});

	// The months for each month for each dataset, an array of {name, bins[]}
	let monthlyBins = $derived(
		Object.entries(data).map(([name, record]) => {
			let citybins = d3
				.bin<Item, Date>()
				.value((d) => d.timestamp)
				.thresholds(
					d3.utcMonth.range(
						d3.min(record, (d) => d.timestamp) ?? new Date(),
						d3.max(record, (d) => d.timestamp) ?? new Date()
					)
				)(record);

			return { name, bins: citybins };
		})
	);

	// The stats extracted for each bin from monthlyBins, an array of {name, monthlyStatsForEachCity[]}
	let monthlyStats = $derived(
		monthlyBins.map(({ name, bins: citybins }) => {
			let monthlyStatsForEachCity = citybins.map((bin) => {
				return {
					// @ts-ignore
					dateRange: [bin.x0, bin.x1],
					averageAqi: d3.mean(bin, (d) => d.usAqi) ?? 0,
					percentile10: d3.quantile(bin.map((d) => d.usAqi).sort(d3.ascending), 0.1) ?? 0,
					percentile90: d3.quantile(bin.map((d) => d.usAqi).sort(d3.ascending), 0.9) ?? 0
				};
			}) as MonthlyStat[];

			return { name, monthlyStatsForEachCity };
		})
	);

	// Average Lines
	let averageLines = $derived(
		monthlyStats.map(({ name, monthlyStatsForEachCity }) => {
			let cityLine = d3
				.line<MonthlyStat>()
				.x((d) => {
					const midpointTime = (d.dateRange[0].getTime() + d.dateRange[1].getTime()) / 2;
					return xScale(new Date(midpointTime));
				})
				.y((d) => yScale(d.averageAqi))
				.curve(d3.curveMonotoneX)(monthlyStatsForEachCity);

			return { name, cityLine };
		})
	);

	// Percentile Areas
	let percentileArea = $derived(
		monthlyStats.map(({ name, monthlyStatsForEachCity }) => {
			let cityArea = d3
				.area<MonthlyStat>()
				.x((d) => {
					const midpointTime = (d.dateRange[0].getTime() + d.dateRange[1].getTime()) / 2;
					return xScale(new Date(midpointTime));
				})
				.y0((d) => yScale(d.percentile10))
				.y1((d) => yScale(d.percentile90))
				.curve(d3.curveMonotoneX)(monthlyStatsForEachCity);

			return { name, cityArea };
		})
	);

	let selectedArea = $derived(percentileArea.find((d) => d.name === selectedDataset));

	// Zoom Behavior
	let svgRef: SVGSVGElement;
	$effect(() => {
		if (!svgRef) return;

		// The function to call upon zooming
		const zoomed = (event: any) => {
			yScale = event.transform.rescaleY(baseYScale);
			yAxis = d3.axisLeft(yScale);
			if (yAxisRef) {
				d3.select(yAxisRef).call(yAxis);
			}

			xScale = event.transform.rescaleX(baseXScale);
			xAxis = d3.axisBottom(xScale);
			if (xAxisRef) {
				d3.select(xAxisRef).call(xAxis);
			}

			// Update zoom level state
			zoomLevel = event.transform.k;
		};

		// Instantiating zoom behavior
		const zoomBehavior = d3
			.zoom<SVGSVGElement, unknown>()
			.scaleExtent([1, 10])
			.translateExtent([
				[0, 0],
				[width, height]
			])
			.on('zoom', zoomed); // SVG SVG Element, wild type name.

		// Applying zoom behavior to the SVG
		d3.select(svgRef).call(zoomBehavior);
	});

	// Nearest Data Point
	let nearestDataPoint = $derived(() => {
		let xPos = mouseX;
		let yPos = mouseY;

		let hoveredMonthlyStats: MonthlyStat[] =
			monthlyStats.find((d) => d.name === hoveredDataset)?.monthlyStatsForEachCity ?? [];
		let closestPoint: MonthlyStat = hoveredMonthlyStats[0];
		let closestDistance = Infinity;

		hoveredMonthlyStats.forEach((d) => {
			const midpointTime = (d.dateRange[0].getTime() + d.dateRange[1].getTime()) / 2;
			let x = xScale(new Date(midpointTime));
			let y = yScale(d.averageAqi);
			let distance = Math.hypot(x - xPos, y - yPos);
			if (closestPoint === null || distance < closestDistance) {
				closestPoint = d;
				closestDistance = distance;
			}
		});
		return closestPoint;
	});
</script>

<svelte:window bind:innerWidth />

<!-- Header -->
<div class="mt-5 flex gap-4 text-[.6rem]">
	<!-- Quality Levels Key -->
	{#each qualityLevels as level}
		<div
			class="w-25 flex-col gap-1 rounded-2xl p-2 text-center text-black"
			style="background-color: {level.color};"
		>
			<div class="whitespace-nowrap">({level.min} - {level.max ?? '∞'})</div>
			<div class="flex-wrap text-center">{level.name}</div>
		</div>
	{/each}

	<div class="flex flex-col gap-2">
		<!-- Dataset Selector -->
		<select
			class="select block h-6 w-35 truncate select-md py-0 select-accent"
			bind:value={selectedDataset}
		>
			{#await datasetNames}
				<!-- promise is pending -->
				<option disabled selected>Loading datasets...</option>
			{:then datasetNames}
				{#each datasetNames as key}
					<option value={key}>{key}</option>
				{/each}
			{:catch error}
				<!-- promise was rejected -->
				<option disabled selected>Error loading datasets: {error.message}</option>
			{/await}
		</select>

		<!-- Raw Data Toggle -->
		<div class="flex items-center gap-2">
			<label for="raw-data-toggle" class="text-sm font-semibold"> Show Raw Data </label>
			<input
				id="raw-data-toggle"
				type="checkbox"
				bind:checked={showRaw}
				class="checkbox checkbox-primary"
			/>
		</div>
	</div>
</div>

<!-- SVG Container -->
<div style="position: relative;">
	<svg
		{width}
		{height}
		role="img"
		bind:this={svgRef}
		onmousemove={(e) => {
			// Update mouse coordinates relative to the SVG container
			mouseX = e.offsetX;
			mouseY = e.offsetY;
		}}
	>
		<!-- Clipping Path Definition -->
		<defs>
			<clipPath id="plot-clip">
				<rect
					x={margin.left}
					y={margin.top}
					width={width - margin.left - margin.right}
					height={height - margin.top - margin.bottom}
				/>
			</clipPath>
		</defs>

		<!-- Data Drawing Elements group to apply clipping -->
		<g clip-path="url(#plot-clip)">
			<!-- Quality Level Background Colors -->
			<g>
				<!-- White Background to ensure consistency -->
				<rect
					x={margin.left}
					y={margin.top}
					width={width - margin.left - margin.right}
					height={height - margin.top - margin.bottom}
					fill="white"
				/>
				{#each qualityLevels as level}
					{#if yScale(level.min) > margin.top}
						<rect
							x={margin.left}
							width={width - margin.left - margin.right}
							y={yScale(level.max ?? 500) > margin.top ? yScale(level.max ?? 500) : margin.top}
							height={yScale(level.max ?? 500) > margin.top
								? yScale(level.min - 1) - yScale(level.max ?? 500)
								: yScale(level.min - 1) - margin.top}
							fill={level.color}
							opacity=".7"
						/>
					{/if}
				{/each}
			</g>

			<!-- Gridlines, up here to ensure they draw below everything selectable -->
			<g
				class="y-axis-grid"
				transform="translate({margin.left}, 0)"
				bind:this={yAxisGridRef}
				style="color:black; opacity:.6;"
			></g>

			<!-- Raw Data for Selected Dataset -->
			{#if showRaw}
				<g>
					{#each data[selectedDataset] as item}
						<circle
							cx={xScale(item.timestamp)}
							cy={yScale(item.usAqi)}
							r={0.5 + zoomLevel}
							fill="blue"
							opacity="0.5"
							role="img"
							onmouseenter={() => {
								hoveredTooltip = `AQI: ${item.usAqi} <br> 
													Date: ${item.timestamp.toISOString().split('T')[0]} <br>
													Station: ${item.stationName}`;
							}}
							onmouseleave={() => {
								hoveredTooltip = null;
							}}
						/>
					{/each}
				</g>
			{/if}

			<!-- Selected Percentile Area -->
			<path d={selectedArea?.cityArea} fill="black" opacity="0.2" style="pointer-events: none;" />

			<!-- Average Lines for All Datasets -->
			{#each averageLines as averageLine}
				{@const isHovered = averageLine.name === hoveredDataset}
				{@const isSelected = averageLine.name === selectedDataset}
				{@const monthlyStat =
					monthlyStats.find((d) => d.name === averageLine.name)?.monthlyStatsForEachCity ?? []}

				<path
					d={averageLine.cityLine}
					fill="none"
					stroke={isHovered ? 'blue' : isSelected ? 'black' : 'grey'}
					stroke-width={(isSelected ? 2.5 : isHovered ? 1.5 : 1) * zoomLevel}
					opacity="1"
				/>

				<!-- Endpoint Circles -->
				<circle
					cx={xScale(
						new Date(
							(monthlyStat[0].dateRange[0].getTime() + monthlyStat[0].dateRange[1].getTime()) / 2
						)
					)}
					cy={yScale(monthlyStat[0]?.averageAqi ?? 0)}
					r={isSelected ? 2 + zoomLevel : 1 + zoomLevel}
					fill={isSelected ? 'black' : 'grey'}
					stroke="black"
					stroke-width=".5"
					opacity="0.8"
				/>
				<circle
					cx={xScale(
						new Date(
							(monthlyStat[monthlyStat.length - 1].dateRange[0].getTime() +
								monthlyStat[monthlyStat.length - 1].dateRange[1].getTime()) /
								2
						)
					)}
					cy={yScale(monthlyStat[monthlyStat.length - 1]?.averageAqi ?? 0)}
					r={isSelected ? 2 + zoomLevel : 1 + zoomLevel}
					fill={isSelected ? 'black' : 'grey'}
					stroke="black"
					stroke-width=".5"
					opacity="0.8"
				/>
			{/each}

			<!-- Closest Datapoint -->
			<!-- Below the invisible selecting lines because it was blocking their usage! -->
			<g>
				{#if hoveredDataset && nearestDataPoint}
					<circle
						cx={xScale(
							new Date(
								(nearestDataPoint().dateRange[0].getTime() +
									nearestDataPoint().dateRange[1].getTime()) /
									2
							)
						)}
						cy={yScale(nearestDataPoint().averageAqi)}
						r={5 + zoomLevel}
						fill="orange"
						stroke="red"
						stroke-width="1"
						opacity="0.8"
					/>
				{/if}
			</g>

			<!-- Invisible Paths for Interaction -->
			<g>
				{#each averageLines as averageLine (averageLine.name)}
					<path
						d={averageLine.cityLine}
						fill="none"
						stroke="transparent"
						stroke-width={10 + zoomLevel}
						style="pointer-events: stroke; cursor: pointer;"
						role="button"
						tabindex="0"
						onclick={() => {
							selectedDataset = averageLine.name;
						}}
						onmouseenter={() => {
							hoveredDataset = averageLine.name;
							hoveredTooltip = `<center>
												<span style="text-decoration: underline;">---${averageLine.name}---</span> <br> 
												Mean AQI in <strong>${d3.timeFormat('%b %Y')(nearestDataPoint().dateRange[1])}</strong>:<br>
												<span style="font-size: large;">${nearestDataPoint().averageAqi.toPrecision(3)}</span>
											</center>`;
						}}
						onmouseleave={() => {
							hoveredDataset = null;
							hoveredTooltip = null;
						}}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								selectedDataset = averageLine.name;
							}
						}}
					/>
				{/each}
			</g>
		</g>

		<!-- Axes and Gridlines -->
		<g class="x-axis" transform="translate(0, {height - margin.bottom})" bind:this={xAxisRef}></g>
		<g class="y-axis" transform="translate({margin.left}, 0)" bind:this={yAxisRef}></g>
	</svg>

	<!-- Tooltip -->
	{#if hoveredTooltip}
		<div
			style="
			position: absolute;
			left: {mouseX + 10}px;
			top: {mouseY - 20}px;
			pointer-events: none;"
			class="rounded border text-black bg-white/90 px-1 shadow-lg"
		>
			{@html hoveredTooltip}
		</div>
	{/if}
</div>
