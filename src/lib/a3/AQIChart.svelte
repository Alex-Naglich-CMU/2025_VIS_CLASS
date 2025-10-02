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

	let showRaw = $state(false);

	// properties this component accepts
	const { data }: { data: Item[] } = $props();

	let chartContainer;

	const height = 400;
	const width = 800;
	const margin = { top: 20, right: 30, bottom: 30, left: 40 };


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

<div>To whoever is giving me feedback: Check back in in a day or two. I was unable to figure out d3 thoroughly enough in time for class Thursday. -Alex	</div>

<div bind:this={chartContainer}>
	<svg {width} {height}>
		<g transform={`translate(${margin.left},${margin.top})`}>
			{#each data as item}
				<circle
					cx={d3.scaleTime().domain(d3.extent(data, (d) => d.timestamp) as [Date, Date]).range([0, width - margin.left - margin.right])(item.timestamp)}
					cy={d3.scaleLinear().domain([0, d3.max(data, (d) => d.usAqi) ?? 500]).range([height - margin.top - margin.bottom, 0])(item.usAqi)}
					r="3"
					fill="steelblue"
					opacity="0.7"
				/>
			{/each}
			{#each qualityLevels as level}
				<rect
					x="0"
					y={d3.scaleLinear().domain([0, d3.max(data, (d) => d.usAqi) ?? 500]).range([height - margin.top - margin.bottom, 0])(level.max ?? (d3.max(data, (d) => d.usAqi) ?? 500))}
					width={width - margin.left - margin.right}
					height={d3.scaleLinear().domain([0, d3.max(data, (d) => d.usAqi) ?? 500]).range([height - margin.top - margin.bottom, 0])(level.min) - d3.scaleLinear().domain([0, d3.max(data, (d) => d.usAqi) ?? 500]).range([height - margin.top - margin.bottom, 0])(level.max ?? (d3.max(data, (d) => d.usAqi) ?? 500))}
					fill={level.color}
					opacity="0.1"
				/>
			{/each}
		</g>
	</svg>
</div>

{#if showRaw}
	<pre>
	{JSON.stringify(data, null, 2)}
	</pre>
{:else}
	test
{/if}

<style>
	/* svg {
		font-family: sans-serif;
	} */
</style>
