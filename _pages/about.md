---
layout: portfolio
title: Home
permalink: /
description: Yen-Ting Liu, a graduate student at UIUC working on microscopy systems, acquisition software, and image processing.
---

<section id="about" class="portfolio-hero" aria-labelledby="intro-title">
  <div class="intro-summary">
    <div class="intro-heading">
      <h1 id="intro-title">Yen-Ting Liu</h1>
      {% include profile-links.liquid %}
    </div>
    <p>I'm a graduate student in electrical and computer engineering at the <a href="https://illinois.edu/">University of Illinois Urbana-Champaign</a>. My work focuses on microscopy, from instrument control and acquisition to image processing and analysis.</p>
    <p>I studied computer science and life science at <a href="https://www.ntu.edu.tw/english/">National Taiwan University</a> and previously worked on light-sheet microscopy at <a href="https://www.sinica.edu.tw/en/">Academia Sinica</a>.</p>
  </div>
</section>
<section id="systems" class="portfolio-section" aria-labelledby="systems-title">
  <h2 id="systems-title">Systems</h2>
  {% include portfolio-systems.liquid %}
</section>
<section id="projects" class="portfolio-section" aria-labelledby="work-title">
  <h2 id="work-title">Software</h2>
  {% assign projects = site.projects | concat: site.data.project_inventory | sort: 'importance' %}
  {% include portfolio-projects.liquid projects=projects %}
</section>
