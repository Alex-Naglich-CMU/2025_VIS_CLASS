<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	let { children } = $props();

	const isAssignmentPage = $page.url.pathname.includes('/assignments');
</script>

{#if !isAssignmentPage}
	<style>
		/* This style block will only be rendered if it's NOT the assignment page */
		@import '../app.css';
	</style>
{/if}

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
