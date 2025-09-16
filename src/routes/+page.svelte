<script>
	import Nav from '$lib/components/nav.svelte';
	import { base } from '$app/paths';
</script>

<Nav />

<div style="display: flex; flex-direction: column; align-items: left">
	<h1 style="text-align: center" class="text-2xl">
		Welcome to the Alex Naglich Data-Vis 2025 Landing Page! Working on moving this all to Sveltekit
	</h1>
	<div>Here is an image for your enjoyment</div>

	<img src={`${base}/BuggedSolidworksScreenshot.png`} alt="Buggy" style="width: 500px; height: auto;" />
</div>
