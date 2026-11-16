---
layout: portfolio
title: Home
permalink: /
description: Yen-Ting Liu, a PhD candidate at UIUC working on microscopy systems, acquisition software, and image processing.
---

<section id="about" class="portfolio-hero" aria-labelledby="intro-title">
  <div class="intro-heading">
    <h1 id="intro-title">Yen-Ting Liu</h1>
    {% include profile-links.liquid %}
  </div>
  <div class="intro-summary">
    <p>I'm a PhD candidate in electrical and computer engineering at <a href="https://illinois.edu/">UIUC</a> in the <a href="https://chemimage.illinois.edu/">Chemical Imaging and Structures Laboratory (Bhargava Lab)</a>. My work focuses on microscopy instruments and software for acquisition and image analysis.</p>
    <ul class="background-list" aria-label="Education and research background">
      {% for entry in site.data.background %}
        <li>
          <span class="background-dates">{{ entry.dates | escape }}</span>
          <div>
            <a href="{{ entry.url }}">{{ entry.institution | escape }}</a>
            <p>{{ entry.description | escape }}</p>
            {% if entry.expected_graduation %}<p>Expected graduation: {{ entry.expected_graduation | escape }}</p>{% endif %}
          </div>
        </li>
      {% endfor %}
    </ul>
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
