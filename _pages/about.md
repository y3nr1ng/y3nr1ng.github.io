---
layout: portfolio
title: Home
permalink: /
description: Scientific software and imaging systems by Yen-Ting Liu.
---

<section class="portfolio-hero" aria-labelledby="intro-title">
  <h1 id="intro-title">Yen-Ting Liu</h1>
  <p class="hero-summary">Scientific software and imaging systems</p>
  <p>I develop instrument-control software, scientific data viewers, and numerical simulation tools.</p>
  <div class="portfolio-actions">
    <a href="mailto:ytliu2@illinois.edu">Email</a>
    <a href="https://github.com/y3nr1ng">GitHub</a>
    <a href="https://www.linkedin.com/in/y3nr1ng/">LinkedIn</a>
  </div>
</section>
<section id="projects" class="portfolio-section" aria-labelledby="work-title">
  <h2 id="work-title">Projects</h2>
  {% assign projects = site.projects | sort: 'importance' %}
  {% include portfolio-projects.liquid projects=projects %}
</section>
<section id="about" class="portfolio-section" aria-labelledby="about-title">
  <h2 id="about-title">About</h2>
  <p>My work includes microscope acquisition and hardware integration in C#/.NET, scientific computing in Python, browser applications in JavaScript and TypeScript, and data handling in C/WebAssembly.</p>
  <p>I am seeking scientific software and imaging-systems engineering roles. I am also interested in general software engineering positions.</p>
</section>
<section id="contact" class="portfolio-section" aria-labelledby="contact-title">
  <h2 id="contact-title">Contact</h2>
  <a href="mailto:ytliu2@illinois.edu">ytliu2@illinois.edu</a>
</section>
