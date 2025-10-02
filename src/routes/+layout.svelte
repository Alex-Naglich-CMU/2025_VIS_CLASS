<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Nav from '$lib/components/nav.svelte';

	let { children } = $props();

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<Nav />
<div class="container mx-auto">
	<div class="content">
		{@render children?.()}
	</div>
</div>
