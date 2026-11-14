---
layout: portfolio
title: Work
permalink: /projects/
description: Selected work in scientific software, imaging, and interactive tools.
nav: true
nav_order: 1
---

<header class="work-intro"><p class="eyebrow">Projects &amp; engineering</p><h1>Tools for measurements.<br>Software for people.</h1><p class="hero-summary">Acquisition systems, scientific interfaces, and practical applications. Each project starts with a workflow worth improving.</p></header>
{% assign projects = site.projects | sort: 'importance' %}
{% include portfolio-projects.liquid projects=projects %}
