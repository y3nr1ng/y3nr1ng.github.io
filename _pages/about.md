---
layout: portfolio
title: Home
permalink: /
description: Scientific software and imaging systems by Yen-Ting Liu.
---

<section id="about" class="portfolio-hero" aria-labelledby="intro-title">
  <div class="intro-summary">
    <div class="intro-heading">
      <h1 id="intro-title">Yen-Ting Liu</h1>
      {% include profile-links.liquid %}
    </div>
    <p class="hero-summary">Scientific software and imaging systems</p>
    <p>I develop instrument-control software, scientific data viewers, and numerical simulation tools.</p>
    <p>I am seeking scientific software and imaging-systems engineering roles, and am also interested in general software engineering positions.</p>

  </div>
  <div class="intro-experience">
    <h2>Background</h2>
    <p>My earlier work at Academia Sinica included light-sheet microscopy acquisition and volumetric image processing. I studied Computer Science and Information Engineering and Life Science at National Taiwan University.</p>
    <ul>
      <li>Instrument integration and acquisition — C#/.NET</li>
      <li>Scientific computing — Python</li>
      <li>Browser applications — JavaScript and TypeScript</li>
      <li>Data handling — C/WebAssembly</li>
    </ul>
  </div>
</section>
<section id="projects" class="portfolio-section" aria-labelledby="work-title">
  <h2 id="work-title">Projects</h2>
  {% assign projects = site.projects | sort: 'importance' %}
  {% include portfolio-projects.liquid projects=projects %}
</section>
