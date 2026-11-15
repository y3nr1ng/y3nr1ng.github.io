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
    <p>I build software for controlling microscopes, exploring image data, and simulating optical systems.</p>
  </div>
  <div class="intro-experience">
    <h2>Background</h2>
    <p>My background spans computer science and life science, which I studied at National Taiwan University. At Academia Sinica, I worked on light-sheet microscopy acquisition and 3D image processing.</p>
  </div>
</section>
<section id="projects" class="portfolio-section" aria-labelledby="work-title">
  <h2 id="work-title">Projects</h2>
  {% assign projects = site.projects | concat: site.data.project_inventory | sort: 'importance' %}
  {% include portfolio-projects.liquid projects=projects %}
</section>
