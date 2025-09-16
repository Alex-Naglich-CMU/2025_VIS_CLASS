import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'docs', // Change this to 'docs' for GitHub Pages
			assets: 'docs', // Change this to 'docs' for GitHub Pages
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		// This is the key line for GitHub Pages
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/your-repo-name' : ''
		}
	}
};

export default config;
