---
layout: portfolio
title: Home
permalink: /
description: Software for controlling microscopes, exploring image data, and simulating optical systems, by Yen-Ting Liu.
---

<section id="about" class="portfolio-hero" aria-labelledby="intro-title">
  <div class="intro-summary">
    <div class="intro-heading">
      <h1 id="intro-title">Yen-Ting Liu</h1>
      {% include profile-links.liquid %}
    </div>
    <p>My background is in computer science and life science, which I studied at National Taiwan University. My work spans microscope control, image processing, and optical simulation, including earlier work on light-sheet microscopy at Academia Sinica.</p>
  </div>
</section>
<section id="projects" class="portfolio-section" aria-labelledby="work-title">
  <h2 id="work-title">Projects</h2>
  {% assign projects = site.projects | concat: site.data.project_inventory | sort: 'importance' %}
  {% include portfolio-projects.liquid projects=projects %}
</section>
