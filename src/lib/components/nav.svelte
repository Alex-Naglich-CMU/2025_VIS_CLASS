<script>
	let { color = 'blue' } = $props();
	import { base } from '$app/paths';


  let routes = [
    { name: 'Home', path: `${base}/` },
    { name: 'Contact', path: `${base}/contact` },
    { name: 'Github', path: 'https://github.com/Alex-Naglich-CMU' },
    { name: 'A1', path: `${base}/assignments/a1` },
  ];
</script>

<div class="flex items-center justify-between p-4">
	<nav style="color: {color}">
		<ul>
			{#each routes as { name, path }}
				<li>
					<a href={path} target={path.startsWith('http') ? '_blank' : '_self'}>{name}</a>
				</li>
			{/each}
		</ul>
	</nav>

	<a href={`${base}/`} class="rounded-full bg-[rgba(0,0,139,0.4)] p-0.5" aria-label="Go to Homepage">
		<div class="relative h-16 w-16 overflow-hidden rounded-full">
			<img
				src={`${base}/Alex_Naglich_Face.png`}
				alt="Home"
				class="h-full w-full scale-[1.50] object-cover object-[1px_30%]"
			/>
			<div class="absolute inset-0 rounded-full transition-all duration-200 hover:bg-white/5"></div>
		</div>
	</a>
</div>
