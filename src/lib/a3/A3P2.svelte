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
</script>
Wow... That's a lot of data. What should I do with it?



{JSON.stringify(data)}