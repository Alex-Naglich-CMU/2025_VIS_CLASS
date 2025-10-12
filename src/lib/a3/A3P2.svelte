<script lang="ts">
	import * as d3 from 'd3';
	import qualityLevels from '$lib/a3/qualityLevels.json';

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
	let mouseX = $state(0);
	let mouseY = $state(0);

	// Scales
	let xScale = $derived(
		d3
			.scaleTime()
			.domain([
				d3.min(flatData, (d) => d.timestamp) ?? new Date(),
				d3.max(flatData, (d) => d.timestamp) ?? new Date()
			])
			.range([margin.left, width - margin.right])
	);

	let yScale = $derived(
		d3
			.scaleLinear()
			.domain([0, d3.max(flatData, (d) => d.usAqi) ?? 500])
			.range([height - margin.bottom, margin.top])
	);

	// Axes
	let xAxis = $derived(d3.axisBottom(xScale));
	let yAxis = $derived(d3.axisLeft(yScale));
	let yAxisGrid = $derived(
		d3
			.axisLeft(yScale)
			.tickSize(-(width - margin.left - margin.right))
			.tickFormat(null)
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

	let selectedLine = $derived(averageLines.find((d) => d.name === selectedDataset));

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
		<select class="select h-6 w-35 select-md py-0 select-accent" bind:value={selectedDataset}>
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
		onmousemove={(e) => {
			// Update mouse coordinates relative to the SVG container
			mouseX = e.offsetX;
			mouseY = e.offsetY;
		}}
	>
		<!-- Quality Level Background Colors -->
		<g>
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

		<!-- Raw Data for Selected Dataset -->
		{#if showRaw}
			<g>
				{#each data[selectedDataset] as item}
					<circle
						cx={xScale(item.timestamp)}
						cy={yScale(item.usAqi)}
						r="1.5"
						fill="blue"
						opacity="0.7"
					/>
				{/each}
			</g>
		{/if}

		<!-- Selected Percentile Area -->
		<path d={selectedArea?.cityArea} fill="black" opacity="0.1" />

		<!-- Average Lines for All Datasets -->
		{#each averageLines as averageLine}
			{@const isHovered = averageLine.name === hoveredDataset}
			{@const isSelected = averageLine.name === selectedDataset}

			<path
				d={averageLine.cityLine}
				fill="none"
				stroke={isHovered ? 'blue' : isSelected ? 'black' : 'grey'}
				stroke-width={isSelected ? '1.5' : isHovered ? '1.5' : '1'}
				opacity={isSelected || isHovered ? '1' : '0.7'}
			/>
		{/each}

		<!-- Invisible Paths for Interaction -->
		<g>
			{#each averageLines as averageLine (averageLine.name)}
				<path
					d={averageLine.cityLine}
					fill="none"
					stroke="transparent"
					stroke-width="4"
					style="pointer-events: stroke; cursor: pointer;"
					role="button"
					tabindex="0"
					onclick={() => {
						selectedDataset = averageLine.name;
					}}
					onmouseenter={() => {
						hoveredDataset = averageLine.name;
					}}
					onmouseleave={() => {
						hoveredDataset = null;
					}}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							selectedDataset = averageLine.name;
						}
					}}
				/>
			{/each}
		</g>

		<!-- Axes and Gridlines -->
		<g class="x-axis" transform="translate(0, {height - margin.bottom})" bind:this={xAxisRef}></g>
		<g class="y-axis" transform="translate({margin.left}, 0)" bind:this={yAxisRef}></g>
		<g
			class="y-axis-grid"
			transform="translate({margin.left}, 0)"
			bind:this={yAxisGridRef}
			style="color:black; opacity:0.2;"
		></g>
	</svg>

	<!-- Tooltip -->
	{#if hoveredDataset}
		<div
			style="
			position: absolute;
			left: {mouseX + 10}px;
			top: {mouseY - 20}px;
			pointer-events: none;"
			class="rounded bg-white/90 px-1 border shadow-lg"
		>
			{hoveredDataset}
		</div>
	{/if}
</div>
