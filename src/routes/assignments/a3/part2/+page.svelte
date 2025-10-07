<script lang="ts">
	import A3P2 from '$lib/a3/A3P2.svelte';
	import * as d3 from 'd3';

	const datasets = {
		'Avalon': 'https://dig.cmu.edu/datavis-fall-2025/assignments/data/%5BAvalon%5D_daily-avg.csv',
		'Glassport High Street':
			'https://dig.cmu.edu/datavis-fall-2025/assignments/data/%5BGlassport%20High%20Street%5D_daily-avg.csv',
		'Lawrenceville':
			'https://dig.cmu.edu/datavis-fall-2025/assignments/data/%5BLawrenceville%5D_daily-avg.csv',
		'Liberty (SAHS)':
			'https://dig.cmu.edu/datavis-fall-2025/assignments/data/%5BLiberty%20(SAHS)%5D_daily-avg.csv',
		'Manchester':
			'https://dig.cmu.edu/datavis-fall-2025/assignments/data/%5BManchester%5D_daily-avg.csv',
		'North Braddock':
			'https://dig.cmu.edu/datavis-fall-2025/assignments/data/%5BNorth%20Braddock%5D_daily-avg.csv',
		'Parkway East (Near Road)':
			'https://dig.cmu.edu/datavis-fall-2025/assignments/data/%5BParkway%20East%20(Near%20Road)%5D_daily-avg.csv',
		'USA-Pennsylvania-Pittsburgh':
			'https://dig.cmu.edu/datavis-fall-2025/assignments/data/%5BUSA-Pennsylvania-Pittsburgh%5D_daily-avg.csv'
	};

	let selectedDataset: keyof typeof datasets = $state('Avalon');

	const data = $derived.by(() =>
		d3.csv(datasets[selectedDataset], (d: any) => ({
			city: d.City,
			country: d.Country,
			mainPollutant: d['Main pollutant'],
			pm25: +d['PM2.5'],
			state: d.State,
			stationName: d['Station name'],
			timestamp: new Date(d['Timestamp(UTC)']),
			usAqi: +d['US AQI']
		}))
	);

	let sortedByEntryCount = $derived.by(async () => {
		// Why do I need this type here. Typescript makes no sense but the copilot said to do it...
		type DatasetKey = keyof typeof datasets;

		const keys = Object.keys(datasets) as DatasetKey[];

		// I hate promises so much. None of this makes any sense to me at all. What on earth is a then? And I'm making an array of promises? This is fake code. Fake news.
		const promises = keys.map((key) =>
			d3.csv(datasets[key]).then((data) => ({ key, length: data.length }))
		);
		const resolvedData = await Promise.all(promises);

		const sortedEntries = resolvedData.sort((a, b) => a.length - b.length);

		return sortedEntries;
	});
</script>

<div class="mb-4 flex items-center justify-center gap-4">
	<h2>Currently Displaying:</h2>

	<select class="select select-lg select-accent" bind:value={selectedDataset}>
		{#await sortedByEntryCount}
			<!-- promise is pending -->
			<option disabled selected>Loading datasets...</option>
		{:catch error}
			<!-- promise was rejected -->
			<option disabled selected>Error loading datasets: {error.message}</option>

		{:then sortedEntries}
			{#each sortedEntries as { key, length }}
				<option value={key}>{key} ({length})</option>
			{/each}
		{/await}
	</select>
</div>

{#await data}
	<!-- promise is pending -->
	<p>loading data...</p>
{:then data}
	<!-- promise was fulfilled or not a Promise -->
	<A3P2 {data} />
{:catch error}
	<!-- promise was rejected -->
	<p>Something went wrong: {error.message}</p>
{/await}

<style>
	* {
		font-family: sans-serif;
	}
</style>
