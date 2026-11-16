---
layout: page
category: Analysis & simulation
title: not-envi
permalink: /projects/not-envi/
description: A browser-based hyperspectral viewer, from spatial images to spectra
  and quantitative measurements.
discipline: Scientific data tools
importance: 2
featured: true
language: JavaScript
technology: C / WebAssembly
resource:
  label: Open the viewer
  url: https://chemimage.github.io/not-envi/
---

A hyperspectral image contains a spectrum at each pixel. not-envi is a browser
viewer for moving between those spectra and the spatial image.

I work on the viewer, analysis tools, and data-access code. The application
supports band browsing, spatial-spectral statistics, and format conversion. It is
available as a hosted viewer and a standalone HTML application for offline use.

Data access is split between a C/WebAssembly core and JavaScript file reads. The
core manages a bounded resident page pool, read demands, and leases, while the
JavaScript adapter performs asynchronous file reads. The boundary makes ownership
explicit: a consumer releases its lease when it is finished, and stale work must
not be delivered into a newer file session. This supports data access without
requiring the entire input to remain resident in memory.

Verification includes separate application, browser, and WASM checks. For example,
line-profile tests check source-coordinate sampling and ensure cancellation stops
additional work from being scheduled. Performance depends on data layout, storage,
and the requested operation.

[Open the viewer](https://chemimage.github.io/not-envi/) ·
[Source and releases](https://github.com/chemimage/not-envi)
