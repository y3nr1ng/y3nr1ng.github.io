---
layout: portfolio
title: Projects
permalink: /projects/
description: Selected work in scientific software, imaging, and interactive tools.
nav: false
nav_order: 1
---

<header class="work-intro"><h1>Projects</h1><p>Selected projects in instrument control, scientific computing, and browser applications.</p></header>
{% assign projects = site.projects | sort: 'importance' %}
{% include portfolio-projects.liquid projects=projects index=true %}
