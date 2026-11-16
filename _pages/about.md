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
    <p>I'm a PhD candidate in electrical and computer engineering at <a href="https://illinois.edu/">UIUC</a> in the <a href="https://chemimage.illinois.edu/">Chemical Imaging and Structures Laboratory (Bhargava Lab)</a>. I work on microscopy instruments and software for acquisition and image analysis.</p>
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
{% assign projects = site.projects | concat: site.data.project_inventory | sort: 'importance' %}
{% assign jump_categories = projects | group_by: 'category' %}
{% assign jump_discovered = jump_categories | map: 'name' %}
{% assign jump_names = site.data.portfolio_categories | concat: jump_discovered | uniq %}
<nav class="portfolio-section-nav" aria-label="Jump to portfolio sections">
  <span class="portfolio-jump-label">Jump to</span>
  <ul>
    <li><a href="#systems">Systems</a></li>
    <li><a href="#projects">Software</a></li>
    {% for category_name in jump_names %}
      {% assign category = jump_categories | where: 'name', category_name | first %}
      {% if category %}
        <li><a href="#category-{{ category_name | slugify }}">{{ category_name | escape }}</a></li>
      {% endif %}
    {% endfor %}
  </ul>
</nav>
<section id="systems" class="portfolio-section" aria-labelledby="systems-title">
  <h2 id="systems-title">Systems</h2>
  {% include portfolio-systems.liquid %}
</section>
<section id="projects" class="portfolio-section" aria-labelledby="work-title">
  <h2 id="work-title">Software</h2>
  {% include portfolio-projects.liquid projects=projects %}
</section>
