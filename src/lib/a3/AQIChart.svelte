<script lang="ts">
	import * as d3 from 'd3';
	import qualityLevels from '$lib/a3/qualityLevels.json';

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

	const { data }: { data: Item[] } = $props();

	let width = $state(800);
	let height = $state(300);
	let margin = $state({ top: 80, right: 20, bottom: 20, left: 40 });
	let showRaw = $state(false);

	let xScale = $derived(
		d3
			.scaleTime()
			.domain([d3.min(data, (d) => d.timestamp), d3.max(data, (d) => d.timestamp) ?? new Date()])
			.range([margin.left, width - margin.right])
	);

	let yScale = $derived(
		d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.usAqi) ?? 500])
			.range([height - margin.bottom, margin.top])
	);

	let xAxis = $derived(d3.axisBottom(xScale));
	let yAxis = $derived(d3.axisLeft(yScale));

	let xAxisRef: SVGGElement;
	let yAxisRef: SVGGElement;

	$effect(() => {
		if (xAxisRef && data.length > 0) {
			d3.select(xAxisRef).call(xAxis);
		}
		if (yAxisRef && data.length > 0) {
			d3.select(yAxisRef).call(yAxis);
		}
	});
</script>

<div class="flex items-center gap-2">
	<label for="raw-data-toggle" class="text-xl font-semibold"> Show Raw Data </label>

	<input
		id="raw-data-toggle"
		type="checkbox"
		bind:checked={showRaw}
		class="checkbox checkbox-primary"
	/>
</div>

<div class="mb-4 text-xl font-semibold">Number of Records: {data.length}</div>

<div class="mb-4 flex gap-4 text-xs">
	{#each qualityLevels as level}
		<div
			class="flex w-40 items-center justify-between gap-1 rounded-2xl p-2 text-black"
			style="background-color: {level.color};"
		>
			<div class="flex-wrap text-center">{level.name}</div>
			<div class="whitespace-nowrap">({level.min} - {level.max ?? '∞'})</div>
		</div>
	{/each}
</div>

{data[0].timestamp}

<div>
	To whoever is giving me feedback: Check back in in a day or two. I was unable to figure out d3
	thoroughly enough in time for class Thursday. -Alex
</div>

<div>
	<svg {width} {height}>
		// Everything after this point is autofill written as of now. I nudged it and it produced what I
		wanted, but I do not understand it and will rewrite it when I have time to finish.
		<g transform={`translate(${margin.left},${margin.top})`}>
			{#each data as item}
				<circle
					cx={d3
						.scaleTime()
						.domain(d3.extent(data, (d) => d.timestamp) as [Date, Date])
						.range([0, width - margin.left - margin.right])(item.timestamp)}
					cy={d3
						.scaleLinear()
						.domain([0, d3.max(data, (d) => d.usAqi) ?? 500])
						.range([height - margin.top - margin.bottom, 0])(item.usAqi)}
					r="3"
					fill="steelblue"
					opacity="0.7"
				/>
			{/each}
		</g>
		<g>
			{#each qualityLevels as level}
				{#if yScale(level.min) > margin.top}
					<rect
						x={margin.left}
						width={width - margin.left - margin.right}
						y={yScale(level.max) > margin.top ? yScale(level.max) : margin.top}
						height={yScale(level.max) > margin.top
							? yScale(level.min) - yScale(level.max)
							: yScale(level.min) - margin.top}
						fill={level.color}
						opacity="0.2"
					/>
				{/if}
			{/each}
		</g>
		<g class="x-axis" transform="translate(0, {height - margin.bottom})" bind:this={xAxisRef}></g>
		<g class="y-axis" transform="translate({margin.left}, 0)" bind:this={yAxisRef}></g>
	</svg>
</div>

{#if showRaw}
	<pre>
	{JSON.stringify(data, null, 2)}
	</pre>
{:else}
	Click "Show Raw Data"
{/if}

<style>
	/* svg {
		font-family: sans-serif;
	} */
</style>
