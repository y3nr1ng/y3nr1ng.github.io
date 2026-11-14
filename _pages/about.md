---
layout: portfolio
title: Home
permalink: /
description: Scientific software, imaging systems, and interactive tools by Yen-Ting Liu.
---

<section class="portfolio-hero" aria-labelledby="intro-title">
  <div>
    <p class="eyebrow">Yen-Ting Liu · Scientific software</p>
    <h1 id="intro-title">From instruments<br>to usable images.</h1>
    <p class="hero-summary">I build software for imaging systems, scientific data, and the people working with them.</p>
    <p class="hero-detail">My work connects instrument control, acquisition, numerical models, and interactive applications.</p>
    <div class="portfolio-actions">
      <a class="portfolio-button" href="#selected-work">Explore my work <span aria-hidden="true">↗</span></a>
      <a href="mailto:ytliu2@illinois.edu">Get in touch <span aria-hidden="true">→</span></a>
    </div>
  </div>
  <aside class="system-sketch" aria-label="My work spans instruments, acquisition, and data exploration">
    <span class="sketch-caption">Across the imaging workflow</span>
    <div class="sketch-node"><span>01</span><strong>Instruments</strong><small>Devices &amp; control</small></div>
    <div class="sketch-connector" aria-hidden="true">↓</div>
    <div class="sketch-node"><span>02</span><strong>Acquisition</strong><small>Coordination &amp; data</small></div>
    <div class="sketch-connector" aria-hidden="true">↓</div>
    <div class="sketch-node"><span>03</span><strong>Exploration</strong><small>Models &amp; interfaces</small></div>
  </aside>
</section>
<section id="selected-work" class="portfolio-section" aria-labelledby="work-title">
  <div class="section-heading"><div><p class="eyebrow">Selected projects</p><h2 id="work-title">A closer look at the work.</h2></div><a href="{{ '/projects/' | relative_url }}">All projects <span aria-hidden="true">→</span></a></div>
  {% assign featured = site.projects | where: 'featured', true | sort: 'importance' %}
  {% include portfolio-projects.liquid projects=featured %}
</section>
<section id="about" class="portfolio-section about-grid" aria-labelledby="about-title">
  <div><p class="eyebrow">About my work</p><h2 id="about-title">Engineering across<br>the boundaries.</h2></div>
  <div><p>I work where physical measurements meet software: coordinating instruments, handling image data, and building tools that make results easier to inspect.</p><p>My experience spans C#/.NET instrument software, Python scientific computing, JavaScript and TypeScript applications, and C/WebAssembly data handling.</p><p>I am looking for scientific software and imaging-systems engineering roles, and am also interested in broader software engineering opportunities.</p></div>
</section>
<section id="contact" class="portfolio-section contact-section" aria-labelledby="contact-title">
  <p class="eyebrow">Let's connect</p><h2 id="contact-title">Building tools for science?</h2>
  <p>I'd be glad to talk about imaging, instrumentation, or software engineering opportunities.</p>
  <div class="portfolio-actions"><a class="portfolio-button" href="mailto:ytliu2@illinois.edu">Email me <span aria-hidden="true">↗</span></a><a href="https://github.com/y3nr1ng">GitHub</a><a href="https://www.linkedin.com/in/y3nr1ng/">LinkedIn</a></div>
</section>
