---
layout: page
category: Scientific software
title: not-envi
permalink: /projects/not-envi/
description: A browser-based hyperspectral viewer, from spatial images to spectra
  and quantitative measurements.
discipline: Scientific data tools
importance: 2
featured: true
technologies:
  - JavaScript
  - C / WebAssembly
  - Scientific visualization
---

A hyperspectral image contains a spectrum at each pixel. Understanding it requires
moving between spatial views, spectral bands, and quantitative measurements.

I develop not-envi, a browser-based tool for band browsing, spatial-spectral
statistics, and format conversion. It is available as a hosted viewer and a
standalone HTML application for offline use.

The interesting engineering work extends beneath the interface. A C/WebAssembly
core manages a bounded resident page pool, read demands, and leases, while a
JavaScript adapter performs asynchronous file reads. The boundary makes ownership
explicit: a consumer releases its lease when it is finished, and stale work must
not be delivered into a newer file session. This supports data access without
requiring the entire input to remain resident in memory.

Verification includes separate application, browser, and WASM checks. For example,
line-profile tests check source-coordinate sampling and ensure cancellation stops
additional work from being scheduled. Performance depends on data layout, storage,
and the requested operation; browser-based access is not a guarantee that every
dataset or analysis fits comfortably in memory.

[Open the viewer](https://chemimage.github.io/not-envi/) ·
[Source and releases](https://github.com/chemimage/not-envi)
