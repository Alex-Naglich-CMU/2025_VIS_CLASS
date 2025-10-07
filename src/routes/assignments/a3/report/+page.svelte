<script lang="ts">
</script>

<small>Ahh, that was the poisoned chalice, wasn't it?</small>
<br />
<br />
<span>
	Perhaps you were meant to choose the other path... check back here later for new adventure!
</span>

<h1>Report Deliverables:</h1>
<ul class="ml-4 list-inside list-disc text-sm">
	<br />
	<li>
		A link to the deployed project. Add a link to where the interactive visualization is hosted.
	</li>
	<span class="text-purple-500">You are already on the website. I believe this is fulfilled!</span>
	<br />
	<li>
		A rationale for your design decisions. How did you choose your particular visual encodings and
		interaction techniques? What alternatives did you consider and how did you arrive at your
		ultimate choices?
	</li>
	<span class="text-purple-500">I will revisit this once I complete Part 2!</span>
	<br />
	<li>
		A clear description of the goals of your second visualization. Describe the question that you
		are enabling a user to answer. The question should be compelling and the solution should be
		focused on helping users achieve their goals.
	</li>
	<span class="text-purple-500">I will revisit this once I complete Part 2!</span>
	<br />
	<li>
		An overview of your development process. Describe how the work was split among the team members.
		Include a commentary on the development process, including answers to the following questions:
		Roughly how much time did you spend developing your application (in people-hours)? What aspects
		took the most time? How did you use AI? Provide the prompts you used.
	</li>
	<span class="text-purple-500"
		>I completed all of the work individually for A3, aside from the feedback I received. The
		development process for Part 1 was me sitting down at a computer and reading about how to do
		things that I saw in your Part 1 until I could replicate them. For Part 2 I looked at the
		datasets and formulated a question, then considered how I could answer that question using an
		interesting UI... then I did it bit by bit. Part 1 took me around 8 hours of work once I had all
		of the other infrastructure around it working. Part 2 took me about XXXXXXXXXXXXXXXXX hours. I'm
		not sure how to describe the development process, it's usually just a series of getting stuck
		and looking up documentation or Googling or asking an LLM until I slowly, iteratively approach my goal. Speaking of, I used AI to answer
		questions and to provide commentary on my code. For example, I would ask the LLM how svg paths
		work, or asking it for the fifth time how maps work, or what the order of events is within the
		function <br /><code
			>d3.bin&lt;Item, Date&gt;().value((d) =&gt;
			d.timestamp).thresholds(d3.utcMonth.range(d3.min(data, (d) =&gt; d.timestamp) ?? new
			Date(),d3.max(data, (d) =&gt; d.timestamp) ?? new Date()))(data)</code
		><br />, which, like, cmon... how is this intuitive at all. I also asked it for help on where I
		made mistakes, what d3 function could do percentile or mean or whatnot, and how promises and
		async and .then and await all work which I still do not understand at all.
	</span>
</ul>
