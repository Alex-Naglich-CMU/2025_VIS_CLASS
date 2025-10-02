<script lang="ts">
	import projects from '$lib/projects.json';
	import Project from '$lib/components/Project.svelte';

</script>

<h1>{projects.length} Projects</h1>

<Project data={ projects } hLevel={ 2 } />
