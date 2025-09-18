<script>
  import casesByZip from "/a1/cases_by_zip.png";
  import casesByZipFentanyl from "/a1/cases_by_zip_fentanyl.png";
  import ratio_containing_fentanyl_map from "/a1/ratio_containing_fentanyl_map.png";
  import ratio_bar_chart from "/a1/ratio_bar_chart.png";
  import counts_by_pop from "/a1/counts_by_pop.png";
</script>

<svelte:head>
  <title>Data Vis Assignment 1</title>
  <link
    rel="stylesheet"
    href="https://dig.cmu.edu/datavis-fall-2024/assignments/report.css"
  />
</svelte:head>

<header>
  <h1>
    <small>Assignment 1</small>
    Exploratory Data Analysis
  </h1>

  <p><strong>Alex Naglich</strong> — <em>anaglich@andrew.cmu.edu</em></p>
</header>
<main>
  <section>
    <h2>Subtheme: Fentanyl</h2>

    <h3>Overall Analysis Questions</h3>
    <ol>
      <li>
        How many cases include fentanyl? Does the addition of fent increase case
        numbers? This data alone is insufficient for identifying if fentanyl
        usage is "deadlier", as I would need the rates of consumption, not just
        those that results in death. But it would be valuable for demonstrating
        the absolute severity of fentanyl and drive attention to it as a public
        issue- for example, it would be a powerful statement if it were found
        that 60% of overall overdoses contained fentanyl, or that 70% of cocaine
        overdoses included fentanyl.
        <br /><strong>Evidence:</strong> My bartender friend says that most cocaine
        that comes through her bar has fent these days and she is getting really
        worried about coming into contact exposure with it. Other evidence is that
        I know that it only takes an exceedingly small dose to be lethal, and that
        many drugs are cut with fent to increase addiction for the benefit of the
        dealer. So if the dosage provided isn't well calibrated, that can be lethal.
      </li>
      <li>
        I want to know what zip codes have the most fentanyl. <br /><strong
          >Evidence:</strong
        >
        I want to know this because I am EMT certified, and I want to know where
        in Allegheny the concentration of fent is. I know that there are hotspots
        for drug usage, and I am curious.
      </li>
      <li>
        Are opioid OD rates, including fentanyl, YoY improving? Simple question,
        but I am curious. With the widespread distribution of naloxone, and many
        people (me included) keeping one nearby, I wonder. It would be
        interesting if lines for distribution programs correlated with any drops
        seen? <br /><strong>Evidence:</strong> Aug 2024 Narcan vending machines
        were installed (News sites differ on number, but 7 seems the most cited
        number prevalent. I wonder if that's enough for an impact) (WESA).
        “Since 2021, Pennsylvania’s Overdose Prevention Program has provided
        free Naloxone in bulk” (PittNews). Jan 2025 Pitt campus got dispensers.
        (PittNews) This may connect in with the previous question.
        <br />
        <strong
          >https://www.wesa.fm/health-science-tech/2024-08-01/narcan-naloxone-free-vending-machines-allegheny-county
        </strong><br />
        <strong
          >https://pittnews.com/article/193311/news/pitt-installs-overdose-reversal-drug-dispensers-after-decade-long-push/
        </strong>
      </li>
      <li>
        Backup observation, not intended for final inclusion but an observation
        I wanted to share: I noticed you can OD on bupropion, which surprised me
        as I take that. It was recorded as an accident and not a suicide
        attempt. That is interesting, but I chose a subtheme of fent, not
        prescription antidepressants. I may be able to connect the combination
        of fentanyl with prescription vs prescription if I require additional
        figures! I see benadryl there as well, which I know is notoriously nasty
        to OD on
      </li>
    </ol>
  </section>

  <section>
    <h2>Discoveries & Insights</h2>
    <h3>Overdose Case</h3>
    <figure>
      <img src={casesByZip} alt="Overdose Cases Containing Fentanyl Mapped by Zip" />
      <figcaption>
        This figure shows a distribution of overdoses by ZIP. A particularly
        high concentration can be observed in certain areas, such as 15212
        comprising Millvale, Reserve Township, and Ross Township- and even
        higher in 15210 comprising Mount Oliver and Baldwin. These areas could
        be investigated more deeply by public health officials. Now, we will use
        this as a reference point for exploration into fentanyl usage.

        <br /> <br /> It took me far too long to get this map working. If you have
        tips for getting geojson and topojson to work more easily with vega-lite,
        please share them with me!
      </figcaption>
    </figure>

    <h3>Overdose Cases Containing Fentanyl</h3>
    <figure>
      <img src={casesByZipFentanyl} alt="Overdose Cases Containing Fentanyl Mapped by Zip" />
      <figcaption>
        This figure is the same as the previous, but only showing areas with
        Overdoses including fentanyl or a fentanyl analog. This shows similar
        hotspots, but with the addition of zip codes 15219(Downtown) and
        15316(Wayne Township) as standouts. Of note here is that , while the
        spread of total overdoses in the county had many medium concentration
        zip codes, the fentanyl-related overdoses were concentrated in fewer
        areas. A followup graphic showing the percentage of overdoses in a
        region that contain fentanyl could be revealing.
      </figcaption>
    </figure>

    <h3>Percentage of Overdoses Containing Fentanyl by Zip</h3>
    <figure>
      <img
        src={ratio_containing_fentanyl_map}
        alt="Percentage of Overdoses Containing Fentanyl Mapped by Zip"
      />
      <figcaption>
        This map shows the percentage of overdoses containing fentanyl by zip
        code. The homogeneity across many of the zips suggests that, contrary to
        what was suspected in the previous figures, there is no particularly
        concentration of fentanyl overdose as a percentage of overdoses by zip.
        Each zip is about as likely to have fentanyl involved in their overdose
        as any other- with standouts at 15047 in the Southeast and 15005 in the
        Northwest. These two zips, according to this representation, should be
        suspect of having large fentanyl operations of some kind. <br /> <br /> Due
        to the scaling and the two outliers, is it particularly difficult to distinguish
        between percentages. Let's try a different representation, and also explore
        the per-capita usage of fentanyl.
      </figcaption>
    </figure>

    <h3>Ratio of Fentanyl Cases and Total Counts For Each Zip</h3>
    <figure>
      <img
        src={ratio_bar_chart}
        alt="Ratio of Fentanyl Cases and Total Counts For Each Zip Bar Chart"
      />
      <figcaption>
        Here is a different representation of the ratio of overdoses containing
        fentanyl. Two lines were made to fit all 125 zips. This bar chart
        representation allows for better visual extraction of the value of the
        ratio than the map did. By adding in the total overdose counts as a
        color, a comparison can be made directly in a single representation.
        This shows that the zips with higher total overdoses tend to be on the
        higher end for fentanyl inclusion, but not exceptionally so. It also
        becomes tricky when comparisons are made against many zips with low
        population. Accordingly, for the next representation I am interested in
        including population data<br /><br /> Wherever the value for the ratio was
        zero, it was edited to .005 to allow for the color to be seen- in case there
        were any instances with high total counts but low fentanyl counts. There
        were none, but it is still good to see. Additionally, this view revealed
        to me that there are ten zip codes that I have listed as one of the 125 zips
        within allegheny county, but have they have zero overdose counts. Investigating
        this, I found that they were PO boxes and unique mailing provisions, including
        one for CMU campus(15289).
      </figcaption>
    </figure>

    <figure>
      <img
        src={Counts_By_Pop}
        alt="Counts of Overdoses and Fentanyl Overdoses by Population"
      />
      <figcaption>
        This figure shows the counts of overdoses and fentanyl overdoses by the
        population for each zip code. Both tend to trend upward in what appears
        to be a moderately correlated, linear relationship. I spent hours trying
        to get regression to filter out the datapoints below 3000 population and
        remove null entries, but I couldn't get the simple logic .filter to
        work, and I had a raging sickness headache by then. But it appears
        graphically that the overdose totals per capita increase faster than the
        fentanyl overdose rates. It is interesting to note that both the overall
        and fentanyl seem to be at their height around 25000 population, and it
        dips off after this point.

        <br /><br />The vega-lite also attached interactivity listing the
        zipcode and city name along the population and count for each data
        point, but that is not reflected here. There is some issue with the
        data. My geojson for the map contains 125 zip codes, the number I cited
        earlier. But there are 388 zip codes in the overdose data, including
        zips from West Virginia.. I suppose that the coroner's offices in West
        Virginia were better suited to handling some of the cases, for example?
        I went and found Census data that gave me 119 zips. I needed the Census
        Data because the geojson file estimates were way off from the sources I
        was checking, despite being only 3 years old... Huh, discovery is
        leading me to discover!

        <br /><br /> If you have tips for regression, or for how I can get a legend
        to show which color/symbol corresponds to which data point, please share
        them with me! It didn't work well with the encoding method I used.
      </figcaption>
    </figure>
    <!--
		<figure>
          <img src="IMAGE_FILENAME" alt="" />
          <figcaption>ENTER IMAGE CAPTION HERE.</figcaption>
        </figure>

        <figure>
          <img src="IMAGE_FILENAME" alt="" />
          <figcaption>ENTER IMAGE CAPTION HERE.</figcaption>
        </figure>

        <figure>
          <img src="IMAGE_FILENAME" alt="" />
          <figcaption>ENTER IMAGE CAPTION HERE.</figcaption>
        </figure>

        <figure>
          <img src="IMAGE_FILENAME" alt="" />
          <figcaption>ENTER IMAGE CAPTION HERE.</figcaption>
        </figure>

        <figure>
          <img src="IMAGE_FILENAME" alt="" />
          <figcaption>ENTER IMAGE CAPTION HERE.</figcaption>
        </figure>   -->
  </section>

  <section>
    <h2>Summary</h2>

    <p>WRITE FINAL SUMMARY HERE.</p>
  </section>
</main>
