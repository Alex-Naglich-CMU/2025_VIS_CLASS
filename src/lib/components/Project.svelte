<script lang="ts">
	import { asset } from "$app/paths";

	interface Project {
		title: string;
		image: string;
		description: string;
	}

	let { data = [], hLevel = 2 } = $props<{ data: Project[]; hLevel?: number }>();
</script>

<div class="projects gap-4">
	{#each data as project}
		<article>
			<svelte:element this={'h' + hLevel}>{project.title}</svelte:element>
			<img src={asset(project.image)} alt="" />
			<p>{project.description}</p>
		</article>
	{/each}
</div>

<style>
	.projects {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15em, 1fr));
	}

	article {
		display: grid;
		grid-template-rows: subgrid;
		grid-row: span 3;
		margin: 0;
	}

	article h2 {
		margin: 0;
	}
</style>
