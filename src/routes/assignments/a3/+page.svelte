<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<div class="flex-col space-y-4 text-center">
	<h1>Hello Adventurer</h1>
	<h2>You have a decision to make....</h2>
	<h3>Which part of Assignment 3 would you like to view?</h3>
	<h4>Choose wisely, for your journey awaits!</h4>
	<div class="flex justify-center gap-4">
		<a class="btn btn-primary" href={resolve('/assignments/a3/1')}>Part 1</a>
		<a class="btn btn-primary text-green-600 bg-gray-600" href={resolve('/assignments/a3/2')}>Part 2</a>
	</div>
	<small style="opacity:.1;"
		>Certainly neither of the options is <i> poisoned</i> or anything...</small
	>
</div>
