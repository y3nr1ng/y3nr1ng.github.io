---
layout: page
title: Single-molecule localization microscopy
permalink: /systems/single-molecule-microscopy/
description: From blinking fluorescent molecules to three-dimensional images and distributed analysis.
---

Fluorescent molecules appear as blurred spots in a microscope image. When only
a sparse set emits at once, we can estimate their positions individually.
Combining many such observations builds a more detailed view of the labeled
structures. This is single-molecule localization microscopy, or SMLM.

Our [2019 Communications Biology paper](https://doi.org/10.1038/s42003-019-0403-9)
combines localization with light-sheet illumination to image three-dimensional
specimens.

## Illuminating one plane

A scanned Bessel beam forms a thin illuminated region, reducing fluorescence
from outside the plane being recorded. Repeated acquisitions capture blinking
molecules throughout the volume.

<figure class="article-figure">
  <a class="article-image-link" href="{{ '/assets/img/systems/smlm/optical-layout-2019.webp' | relative_url }}" target="_blank" rel="noopener" aria-label="Open the published localization microscope layout at full size in a new tab">
    <img src="{{ '/assets/img/systems/smlm/optical-layout-2019.webp' | relative_url }}" width="756" height="470" alt="Published optical layout of the Bessel light-sheet localization microscope, with an inset showing the illumination plane and specimen scanning" decoding="async">
  </a>
  <figcaption>
    The light-sheet illumination and detection paths meet at the specimen.
    <span class="figure-credit">Lu et al. (2019), <a href="https://www.nature.com/articles/s42003-019-0403-9/figures/1">Fig. 1</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Click the image to enlarge.</span>
  </figcaption>
</figure>

## Turning recordings into an image

The analysis reorganizes volumetric TIFF recordings into a time series for each
layer, corrects drift, and localizes fluorescent spots with ThunderSTORM.
Layer results are then combined into one localization list for reconstruction.

<figure class="article-figure">
  <a class="article-image-link" href="{{ '/assets/img/systems/smlm/microtubules-2019.webp' | relative_url }}" target="_blank" rel="noopener" aria-label="Open the published microtubule reconstruction figure at full size in a new tab">
    <img src="{{ '/assets/img/systems/smlm/microtubules-2019.webp' | relative_url }}" width="682" height="642" alt="Published microtubule images showing a volume projection, successive depth sections, a resolution analysis, and comparisons of light-sheet and localization reconstructions" loading="lazy" decoding="async">
  </a>
  <figcaption>
    Microtubules across multiple cells, with depth sections and reconstruction comparisons. Original panel labels and 5 micrometre scale bars are retained.
    <span class="figure-credit">Lu et al. (2019), <a href="https://www.nature.com/articles/s42003-019-0403-9/figures/2">Fig. 2</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</span>
  </figcaption>
</figure>

## Following nuclear pores in a living cell

Nuclear pore complexes regulate transport across the boundary of the nucleus.
Here, the protein Nup153 is labeled so that we can follow its distribution
through a living cell in three dimensions.

<figure class="article-figure">
  <video controls playsinline preload="none" width="620" height="558" poster="{{ '/assets/img/systems/smlm/nuclear-pores-2019.webp' | relative_url }}" aria-label="Live three-dimensional imaging and localization of Nup153 nuclear pore proteins" aria-describedby="npc-movie-caption">
    <source src="{{ '/assets/video/smlm/nuclear-pores-2019.mp4' | relative_url }}" type="video/mp4">
    <a href="{{ '/assets/video/smlm/nuclear-pores-2019.mp4' | relative_url }}">Open the nuclear pore movie.</a>
  </video>
  <figcaption id="npc-movie-caption">
    Upper left: EGFP fluorescence. Lower left: accumulated localizations from the blinking dye. Right: reconstructed localizations colored by depth, with the original depth scale and elapsed time. This silent, approximately 18-second movie summarizes about 40 minutes of two-color imaging; press Play to watch.
    <span class="figure-credit">Lu et al. (2019), <a href="https://www.nature.com/articles/s42003-019-0403-9#Sec19">Supplementary Movie 2</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Converted from AVI to MP4 for browser playback, with the full image and labels retained. <a href="{{ '/assets/video/smlm/nuclear-pores-2019.mp4' | relative_url }}" target="_blank" rel="noopener">Open the video separately.</a></span>
  </figcaption>
</figure>

## My part in the processing

I designed the data-analysis program for this work. The published workflow uses
custom ThunderSTORM macros, Lustre storage, and a four-node TORQUE cluster to
process the recordings. Bi-Chang Chen and Chieh-Han Lu constructed the microscope;
the instrument control software was licensed from HHMI/Janelia.

My related software includes
[ThunderSTORM cluster scripts](https://github.com/cbc-group/torque-thunderstorm)
and [Dask on TORQUE](https://github.com/cbc-group/pbs). These belong to my SMLM
processing work, alongside localization processing and three-dimensional geometric
analysis.

{% assign system = site.data.systems | where: 'url', page.permalink | first %}
{% capture publications_html %}{% include project-publications.liquid publications=system.publications %}{% endcapture %}
{{ publications_html | strip }}
