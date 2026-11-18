---
layout: page
title: Infrared laser-scanning microscopy
permalink: /systems/infrared-microscopy/
description: Infrared light, scanning optics, and instrument control for chemical imaging.
---

An infrared chemical image records how absorption changes across a specimen.
Different molecular vibrations contribute at different wavelengths, so the
measurement gives us chemical contrast alongside spatial structure. The challenge
is to collect those measurements over a large area while preserving both image
detail and reliable spectra.

In the
[Chemical Imaging and Structures Laboratory (Bhargava Lab)](https://chemimage.illinois.edu/)
at UIUC, we develop infrared laser-scanning microscopes for this work. The
[2023 IR-LSM paper](https://doi.org/10.1038/s41467-023-40740-w) brings together
custom infrared optics, confocal detection, and synchronized acquisition. My
contribution to that publication was programming microscope subroutines; my
broader work on these instruments includes control software, firmware, electrical
integration, and hands-on operation.

## Choosing the chemical measurements

The quantum cascade laser is tuned to one infrared band at a time. A scan forms
an image at that band; repeating the scan at selected bands adds chemical
information at the same positions. We can acquire a small set of bands for a
particular measurement or sample more of the spectrum when additional chemical
information is needed. Each added band also adds acquisition time.

The recorded signal needs a reference: the published workflow measures a blank
substrate before imaging to account for laser power and non-uniformity. This
connects a detector reading to an absorption measurement that can be compared
across positions and wavelengths.

## Scanning a focused beam across the sample

The instrument sweeps a focused beam with galvanometer mirrors. Its objectives,
tube lens, and scan lens were designed together for the broad mid-infrared range,
where common visible-microscope glasses are unsuitable. A confocal pinhole
rejects stray reflections before the signal reaches the detector.

<figure class="article-figure">
  <a class="article-image-link" href="{{ '/assets/img/systems/infrared/optical-layout-2023.webp' | relative_url }}" target="_blank" rel="noopener" aria-label="Open the published optical layout at full size in a new tab">
    <img src="{{ '/assets/img/systems/infrared/optical-layout-2023.webp' | relative_url }}" width="936" height="597" alt="Optical layout showing the infrared laser array, scanning mirrors, sample stage, and detector, connected by the beam path" decoding="async">
  </a>
  <figcaption>
    A tunable quantum cascade laser supplies the selected infrared band. Galvanometer mirrors scan the beam through custom refractive optics; a confocal pinhole filters the returning light before detection. The visible beam assists alignment.
    <span class="figure-credit">Panel excerpt from Yeh et al. (2023), <a href="https://www.nature.com/articles/s41467-023-40740-w/figures/1">Fig. 1a</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Click the image to enlarge.</span>
  </figcaption>
</figure>

The fast scan axis records in both directions, reducing time spent returning
the beam between lines. That also creates a coordination problem: detector
samples from the forward and reverse sweeps must land at the correct image
positions. The published system tracks the scanner's position signal to align
the lines, while the data-acquisition hardware synchronizes scanning, laser
triggers, and detector readout.

Sharpness is only part of the measurement. The paper evaluates spatial contrast
with test targets and modulation transfer functions (MTF), alongside noise and
spectral agreement with FT-IR measurements. Together, these checks examine whether
the instrument preserves spatial detail and usable chemical information.

## From one field of view to a whole section

The adult zebrafish image below shows why coverage matters: the same section
contains brain, gills, muscle, liver, intestine, and ovary. Selected infrared
bands produce differences in contrast across these structures without adding
stains to the section being measured. These are false colors assigned to the
measured bands, rather than the specimen's visible appearance.

<figure class="article-figure">
  <a class="article-image-link" href="{{ '/assets/img/systems/infrared/zebrafish-2023.webp' | relative_url }}" target="_blank" rel="noopener" aria-label="Open the published zebrafish chemical image at full size in a new tab">
    <img src="{{ '/assets/img/systems/infrared/zebrafish-2023.webp' | relative_url }}" width="990" height="531" alt="Published infrared chemical image of an adult zebrafish section, with labels for the brain, gills, muscle, ovary, liver, intestine, and pancreas and a 2 mm scale bar" loading="lazy" decoding="async">
  </a>
  <figcaption>
    A 5 micrometre-thick sagittal section of an adult female zebrafish. Selected infrared absorption bands form the false-color image, retaining anatomical context across the whole section. Original labels and the 2 mm scale bar are retained.
    <span class="figure-credit">Panel excerpt from Yeh et al. (2023), <a href="https://www.nature.com/articles/s41467-023-40740-w/figures/2">Fig. 2d</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</span>
  </figcaption>
</figure>

A whole section spans many scan fields. The stage moves between overlapping
tiles, and the images are blended into a mosaic. The acquisition therefore needs
to coordinate position, focus, wavelength selection, and frame collection across
the sample, rather than simply record one image repeatedly.

## Averaging without mixing measurements

Averaging repeated frames reduces noise, but only while they describe the same
measurement. In the 2023 system, software keeps a circular history of recent
frames for averaging. When the monitored stage, laser, or other equipment changes
state, that history is cleared so frames from different conditions are not mixed.
The software then collects the image channels as the laser steps through the
requested bands.

This is one example of how instrument state becomes part of image formation.
A measurement depends on the optics and detector, but also on the software
knowing which samples belong together.

## My work on the instruments

My primary work is control software and firmware, with additional contributions
to electrical design. I also help build, align, integrate, and maintain the
microscopes. These are team-built instruments: the 2023 paper credits Kevin Yeh
with the original control software and microscope build, and credits me and
Manu Mehta with microscope subroutines.

My ongoing software work includes ScopeEngine, which organizes acquisition
workflows, and ciMicroscope, a desktop application for operating the microscope.
The [software page]({{ '/projects/scopeengine/' | relative_url }}) describes that
framework and its device interfaces. The published instrument above provides
context for the measurements this broader software work supports.

{% assign system = site.data.systems | where: 'url', page.permalink | first %}
{% capture publications_html %}{% include project-publications.liquid publications=system.publications %}{% endcapture %}
{{ publications_html | strip }}
