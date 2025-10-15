<script lang="ts">
</script>

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
	<span class="text-purple-500"
		>Grey on the non-selected lines, black for the selected line for focus, as we discussed for
		highlighting attention to a datapoint. This makes it easier to process than 8 equal graphs or
		graphs of different colors. I wanted feedback for hover for a line to indicate selectability to
		the user, so I made that one blue. Making the selected and hovered lines different thicknesses
		also helped with readability and interactive intuition. Zooming from 1 to 10 was good, as you
		start with the entire screen and then zoom to a level that helps with selection of data and
		tooltips without exceeding the realistic precision of the dataset- thresholds also make it so
		the zoom snaps back to the original view instead of navigating into neverland. Adding tooltips
		was obvious, as it allowed extra information with great flexibility. Interactive, clickable
		lines was a great result- adding a second, invisible line for interaction and playing with the
		strokes to make selecting the invisible line easier than 1px thickness, and making it clickable
		to switch datasets worked great. I messed with opacity for readability and settled on what you
		see here. Adding the nearest datapoint was tricky but I think worked really well. I played with
		the thickness changing with zoom a lot, tying that to the k scale worked super well, some
		dimensions are additive and some are multiplicative by the scale and playing with that was
		interesting for making things unobstructive. I got feedback to make the start and ends of the
		datasets clear, so I added little endcap circles to the datasets to show they exist. I received
		some feedback on color similarity for the gridlines and the grey unselected lines so I adjusted
		those. I had a lot of issues with things being rendered on top of the invisible selection line,
		and I had to move things around and disable selectability for those elements. I never really
		considered alternative choices, per se, I just tried and iterated on things bit by bit. There
		wasn't really any categorical choices for this, just small tweaks from the original plan. I
		suppose I did consider making it only zoom in the x and only zoom y, switching between with
		holding shift, but that seemed clunky and I have found that unintuitive in the past except for
		MAJOR data processing tasks I have done. Similarly, I considered zoom by selecting a region
		(horizonal, vertical, or both), but I have had students get very confused by that mechanism. So
		I just did normal scroll!
	</span>
	<br />
	<li>
		A clear description of the goals of your second visualization. Describe the question that you
		are enabling a user to answer. The question should be compelling and the solution should be
		focused on helping users achieve their goals.
	</li>
	<span class="text-purple-500"
		>My goal for the second visualization was to enhance interactivity and make navigating and
		comparing the original dataset as intuitive as possible. I am enabling side-by-side comparison
		of the data by plotting them all at once but making the other views non-obtrusive but easily
		explorable and selectable with the mouse. Zooming allows for finer exploration of the raw data
		and hovering allows individual values to be extracted. Effectively, I had a lot of issues with
		the Part 1 visualization- if the question it was trying to answer was a comparison between the 8
		cities, their mean and percentiles, and exploring the raw data- I believe it was totally
		inadequate and clunky. Switching cities changes the x axis and y axis, which is... really
		difficult for comparison. It also required using the select bar which is slow. My question was
		to dramatically enhance the questions that were implicitly being asked by the original task, as
		while I was working on that I saw issues I wanted resolved for the user experience.
	</span>
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
		not sure how to describe the development process besides the answers I provided in the other
		questions as to how I came up with the idea... In this case for Part 2 I looked at the Data and
		realized it was all pretty much identical except for time, location, and AQI- the rest was
		immaterial (Top pollutant was almost always PM25 and AQI ~= 4.167 * PM25) so nothing to explore
		there. I decided then to just enhance the exploration of THAT data as much as possible, so I
		made one graph easy and intuitive to navigate. The actual process though is usually just a
		series of getting stuck and looking up documentation or Googling or asking an LLM until I
		slowly, iteratively approach my goal. Speaking of, I used AI to answer questions and to provide
		commentary on my code. For example, I would ask the LLM how svg paths work, or asking it for the
		fifth time how maps work, or what the order of events is within the function <br /><code
			>d3.bin&lt;Item, Date&gt;().value((d) =&gt;
			d.timestamp).thresholds(d3.utcMonth.range(d3.min(data, (d) =&gt; d.timestamp) ?? new
			Date(),d3.max(data, (d) =&gt; d.timestamp) ?? new Date()))(data)</code
		><br />, which, like, cmon... how is this intuitive at all. I also asked it for help on where I
		made mistakes, what d3 function could do percentile or mean or whatnot, and how promises and
		async and .then and await all work which I still do not understand at all.
	</span>
</ul>
