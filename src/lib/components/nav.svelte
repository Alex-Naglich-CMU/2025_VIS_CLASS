<script lang="ts">
	import { resolve, asset } from '$app/paths';
	import { onMount } from 'svelte';

	type NavRoute = {
		path: string; // ✅ Tell TypeScript 'path' is just a generic string
		name: string;
	};

	let colorScheme = $state('light dark');

	onMount(() => {
		const savedScheme = localStorage.getItem('colorScheme');
		if (savedScheme) {
			colorScheme = savedScheme; // Update the reactive state
		}
	});

	const navRoutes: NavRoute[] = [
		{ path: '/', name: 'Home' },
		{ path: '/contact', name: 'Contact' },
		{ path: '/projects', name: 'Projects' },
		{ path: '/assignments/a1', name: 'A1' },
		{ path: '/assignments/a3', name: 'A3' },
		{ path: 'https://github.com/Alex-Naglich-CMU', name: 'Github' }
	];

	$effect(() => { // AI suggested change, I had another way to do this but this is more robust.
		// This runs only in the browser, after onMount initializes colorScheme.
		if (typeof document !== 'undefined') {
			const root = document.documentElement;

			// Set the data-theme attribute
			root.setAttribute('data-theme', colorScheme);

			// Save to local storage
			localStorage.setItem('colorScheme', colorScheme);

			// Set the CSS color-scheme property
			root.style.setProperty('color-scheme', colorScheme);
		}
	});
</script>

<div class="flex items-center justify-between p-4">
	<nav class="flex-grow">
		<ul class="flex space-x-4">
			{#each navRoutes as { path, name }}
				<li>
					{#if path.startsWith('http')}
						<a href={path} class="btn btn-primary" target="_blank" rel="noopener noreferrer">
							{name}
						</a>
					{:else}
						<a href={resolve(path as any)} class="btn btn-primary">
							{name}
						</a>
					{/if}
				</li>
			{/each}
		</ul>
	</nav>

	<a
		href={resolve('/')}
		class="rounded-full bg-[rgba(0,0,139,0.4)] p-0.5"
		aria-label="Go to Homepage"
	>
		<div class="relative h-16 w-16 overflow-hidden rounded-full">
			<img
				src={asset('/images/Alex_Naglich_Face.png')}
				alt="Home"
				class="h-full w-full object-cover object-center"
			/>
			<div class="absolute inset-0 rounded-full transition-all duration-200 hover:bg-white/5"></div>
		</div>
	</a>

	<select class="select ml-2 w-20" aria-label="Select Theme" bind:value={colorScheme}>
		<option value="light">Light</option>
		<option value="dark">Dark</option>
	</select>
</div>
