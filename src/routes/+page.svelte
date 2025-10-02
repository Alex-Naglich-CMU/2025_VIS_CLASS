<script lang="ts">
	import { asset } from '$app/paths';

	import projects from '$lib/projects.json';
	import Project from '$lib/components/Project.svelte';

	const featuredProjects = projects.slice(0, 3);
</script>

<div style="display: flex; flex-direction: column; align-items: start">
	<h1 class="mb-4 text-center text-3xl font-bold">
		Welcome to the Alex Naglich Data-Vis 2025 Landing Page!
	</h1>

	<h2>Github Stats</h2>
	<div class="mx-auto w-full">
		{#await fetch('https://api.github.com/users/alexnaglich')}
			<p>Loading...</p>
		{:then response}
			{#await response.json()}
				<p>Decoding...</p>
			{:then data}
				<dl>
					<dt>Username:</dt>
					<dd>{data.login}</dd>
					<dt>Public Repos:</dt>
					<dd>{data.public_repos}</dd>
					<dt>Followers:</dt>
					<dd>{data.followers}</dd>
					<dt>Following:</dt>
					<dd>{data.following}</dd>
				</dl>
			{:catch error}
				<p class="error">
					Something went wrong: {error.message}
				</p>
			{/await}
		{:catch error}
			<p class="error">
				Something went wrong: {error.message}
			</p>
		{/await}
	</div>
</div>

<div class="mt-8">
	<Project data={featuredProjects} hLevel={3} />
</div>

<style>
	dl {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: auto auto;
		gap: 0.5em 1em;
	}

	dt {
		font-size: 1.2em;
		grid-row: 1;
	}

	dd {
		margin: 0;
		grid-row: 2;
		font-size: 2em;
	}

	.error {
		color: red;
	}
</style>
