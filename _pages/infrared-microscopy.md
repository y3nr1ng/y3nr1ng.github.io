---
layout: page
title: Infrared laser-scanning microscopy
permalink: /systems/infrared-microscopy/
description: Infrared light, scanning optics, and instrument control for chemical imaging.
---

Molecules absorb infrared light at characteristic wavelengths. We can use those
differences to make images with chemical contrast, without adding stains or
fluorescent labels. In the
[Chemical Imaging and Structures Laboratory (Bhargava Lab)](https://chemimage.illinois.edu/)
at UIUC, we develop laser-scanning microscopes for these measurements.

The figures here show one instrument and an example image from our team's
[2023 publication](https://doi.org/10.1038/s41467-023-40740-w).

<figure class="article-figure">
  <a class="article-image-link" href="{{ '/assets/img/systems/infrared/optical-layout-2023.webp' | relative_url }}" target="_blank" rel="noopener" aria-label="Open the published optical layout at full size in a new tab">
    <img src="{{ '/assets/img/systems/infrared/optical-layout-2023.webp' | relative_url }}" width="936" height="597" alt="Optical layout showing the infrared laser array, scanning mirrors, sample stage, and detector, connected by the beam path" decoding="async">
  </a>
  <figcaption>
    The optical path connects the laser, scanning mirrors, specimen, and detector. The diagram also shows the visible alignment beam.
    <span class="figure-credit">Panel excerpt from Yeh et al. (2023), <a href="https://www.nature.com/articles/s41467-023-40740-w/figures/1">Fig. 1a</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Click the image to enlarge.</span>
  </figcaption>
</figure>

## From light to an image

A tunable infrared laser selects the wavelength used for a measurement. Scanning
mirrors move the focused beam across the specimen, while a detector records the
signal. Matching those readings to positions builds an image.

Repeating the scan at other wavelengths adds chemical information at each
location. Selected absorption bands can become image channels; measurements
across wavelengths form a spectrum.

## Reading the chemical contrast

In this section of an adult zebrafish, false color combines selected infrared
absorption bands. The anatomical labels help connect the chemical patterns to
recognizable structures.

<figure class="article-figure">
  <a class="article-image-link" href="{{ '/assets/img/systems/infrared/zebrafish-2023.webp' | relative_url }}" target="_blank" rel="noopener" aria-label="Open the published zebrafish chemical image at full size in a new tab">
    <img src="{{ '/assets/img/systems/infrared/zebrafish-2023.webp' | relative_url }}" width="990" height="531" alt="Published infrared chemical image of an adult zebrafish section, with labels for the brain, gills, muscle, ovary, liver, intestine, and pancreas and a 2 mm scale bar" loading="lazy" decoding="async">
  </a>
  <figcaption>
    An adult zebrafish section imaged with the published microscope. The original labels and 2 mm scale bar are retained.
    <span class="figure-credit">Panel excerpt from Yeh et al. (2023), <a href="https://www.nature.com/articles/s41467-023-40740-w/figures/2">Fig. 2d</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</span>
  </figcaption>
</figure>

## Controlling the measurement

An acquisition brings together laser settings, scanner motion, detector readings,
and data storage. The software connects the requested measurement to those
individual operations and handles the resulting data.

My software work includes ScopeEngine, which organizes acquisition workflows,
and ciMicroscope, a desktop application for operating the microscope. The
[software page]({{ '/projects/scopeengine/' | relative_url }}) goes into the
acquisition framework, device interfaces, and movement of data between components.

## Building and operating the instrument

These microscopes are team projects. My main work is control software and
firmware, with additional contributions to electrical design. I also help build,
align, integrate, and maintain the instruments. That work connects the software
to the physical setup: optical alignment, electrical interfaces, and acquisition
control all need to work together for a measurement.

The publications below explore the team's instrument, detection, and software work
in more detail.

{% assign system = site.data.systems | where: 'url', page.permalink | first %}
{% include project-publications.liquid publications=system.publications %}
