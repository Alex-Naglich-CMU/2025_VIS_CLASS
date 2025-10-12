<script lang="ts">
	import A3P2 from '$lib/a3/A3P2.svelte';
	import * as d3 from 'd3';

	const datasets = {
		Avalon: 'https://dig.cmu.edu/datavis-fall-2025/assignments/data/%5BAvalon%5D_daily-avg.csv',
		'Glassport High Street':
			'https://dig.cmu.edu/datavis-fall-2025/assignments/data/%5BGlassport%20High%20Street%5D_daily-avg.csv',
		Lawrenceville:
			'https://dig.cmu.edu/datavis-fall-2025/assignments/data/%5BLawrenceville%5D_daily-avg.csv',
		'Liberty (SAHS)':
			'https://dig.cmu.edu/datavis-fall-2025/assignments/data/%5BLiberty%20(SAHS)%5D_daily-avg.csv',
		Manchester:
			'https://dig.cmu.edu/datavis-fall-2025/assignments/data/%5BManchester%5D_daily-avg.csv',
		'North Braddock':
			'https://dig.cmu.edu/datavis-fall-2025/assignments/data/%5BNorth%20Braddock%5D_daily-avg.csv',
		'Parkway East (Near Road)':
			'https://dig.cmu.edu/datavis-fall-2025/assignments/data/%5BParkway%20East%20(Near%20Road)%5D_daily-avg.csv',
		'USA-Pennsylvania-Pittsburgh':
			'https://dig.cmu.edu/datavis-fall-2025/assignments/data/%5BUSA-Pennsylvania-Pittsburgh%5D_daily-avg.csv'
	};

	const dataPromise = Promise.all(
		Object.entries(datasets).map(([name, url]) =>
			d3
				.csv(url, (d: any) => ({
					city: d.City,
					country: d.Country,
					mainPollutant: d['Main pollutant'],
					pm25: +d['PM2.5'],
					state: d.State,
					stationName: d['Station name'],
					timestamp: new Date(d['Timestamp(UTC)']),
					usAqi: +d['US AQI']
				}))
				.then((records) => [name, records])
		)
	).then((entries) => Object.fromEntries(entries));
</script>

{#await dataPromise}
	<p>loading data...</p>
{:then allData}
	<A3P2 data={allData} />
{:catch error}
	<p>Something went wrong: {error.message}</p>
{/await}

<style>
	* {
		font-family: sans-serif;
	}
</style>
