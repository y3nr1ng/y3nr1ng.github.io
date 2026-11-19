---
layout: page
title: Infrared laser-scanning microscopy
permalink: /systems/infrared-microscopy/
description: Infrared laser-scanning microscopy for chemical imaging across whole tissue sections.
---

Infrared absorption provides chemical contrast without adding stains or
fluorescent labels. Different molecular vibrations contribute at different
wavelengths, so images collected across those bands reveal chemical differences
alongside tissue structure.

In the [Bhargava Lab](https://chemimage.illinois.edu/) at UIUC, we develop
infrared laser-scanning microscopes to collect these measurements over large
areas. The instrument has to preserve spatial detail and reliable spectra while
covering a whole section. My work connects the control software and firmware
to that physical measurement.

## Scanning a focused infrared beam

The optical layout below is from our team's
[2023 IR-LSM paper](https://doi.org/10.1038/s41467-023-40740-w). It combines a
tunable infrared source, scanning mirrors, custom refractive optics, and confocal
detection. The optics must maintain a focused spot across both the scan field
and the range of infrared bands being measured.

The published design records both scan directions and aligns detector samples
using scanner position feedback. It also measures a blank substrate to reference
laser power and non-uniformity. These details make image formation a coordinated
measurement, with position, wavelength, and detector readings kept in agreement.

<figure class="article-figure">
  <a class="article-image-link" href="{{ '/assets/img/systems/infrared/optical-layout-2023.webp' | relative_url }}" target="_blank" rel="noopener" aria-label="Open the published optical layout at full size in a new tab">
    <img src="{{ '/assets/img/systems/infrared/optical-layout-2023.webp' | relative_url }}" width="936" height="597" alt="Optical layout showing the infrared laser array, scanning mirrors, sample stage, and detector, connected by the beam path" decoding="async">
  </a>
  <figcaption>
    A tunable quantum cascade laser supplies the selected infrared band. Galvanometer mirrors scan the beam through custom refractive optics; a confocal pinhole filters the returning light before detection. The visible beam assists alignment.
    <span class="figure-credit">Panel excerpt from Yeh et al. (2023), <a href="https://www.nature.com/articles/s41467-023-40740-w/figures/1">Fig. 1a</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Click the image to enlarge.</span>
  </figcaption>
</figure>

## From individual scans to a chemical image

The adult zebrafish section below contains many organs within one image. It was
assembled from overlapping scan fields, with selected infrared absorption bands
assigned to false-color channels. The colors show differences in the measured
chemical contrast, without staining the section being measured.

<figure class="article-figure">
  <a class="article-image-link" href="{{ '/assets/img/systems/infrared/zebrafish-2023.webp' | relative_url }}" target="_blank" rel="noopener" aria-label="Open the published zebrafish chemical image at full size in a new tab">
    <img src="{{ '/assets/img/systems/infrared/zebrafish-2023.webp' | relative_url }}" width="990" height="531" alt="Published infrared chemical image of an adult zebrafish section, with labels for the brain, gills, muscle, ovary, liver, intestine, and pancreas and a 2 mm scale bar" loading="lazy" decoding="async">
  </a>
  <figcaption>
    A 5 micrometre-thick sagittal section of an adult female zebrafish. Selected infrared absorption bands form the false-color image, retaining anatomical context across the whole section. Original labels and the 2 mm scale bar are retained.
    <span class="figure-credit">Panel excerpt from Yeh et al. (2023), <a href="https://www.nature.com/articles/s41467-023-40740-w/figures/2">Fig. 2d</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</span>
  </figcaption>
</figure>

Collecting a section like this means repeating acquisitions across positions and
bands, then retaining the information needed to interpret the resulting channels.
A small set of bands can provide selected chemical contrast; sampling more of
the spectrum adds chemical information and acquisition time.

The published figures document the team's earlier instrument. Kevin Yeh led its
microscope build and original control software; the 2023 paper credits me and
Manu Mehta with microscope subroutines.

## My work on the instruments

My primary contribution is control software and firmware. I also work on
electrical design and help build, align, integrate, and maintain the instruments.
The [ScopeEngine article]({{ '/projects/scopeengine/' | relative_url }}) explains
the software engine I wrote, including acquisition jobs, device integration,
data handling, and the WIP survey of other acquisition software.

{% assign system = site.data.systems | where: 'url', page.permalink | first %}
{% capture publications_html %}{% include project-publications.liquid publications=system.publications %}{% endcapture %}
{{ publications_html | strip }}
