---
layout: page
title: Single-molecule localization microscopy
permalink: /systems/single-molecule-microscopy/
description: Reconstructing microtubules and nuclear pore proteins, and moving the analysis onto a cluster.
---

The first question was whether we could reconstruct microtubules across multiple
cells in three dimensions. The next was how long we needed to collect blinking
molecules before the reconstruction contained enough detail. Moving to nuclear
pore proteins added another constraint: the cell could move while those
observations were accumulating.

Our [2019 Communications Biology paper](https://doi.org/10.1038/s42003-019-0403-9)
explores these questions using light-sheet illumination and single-molecule
localization microscopy (SMLM). I designed the data-analysis program. For me,
a particularly engaging part was moving the processing onto the lab's cluster
and keeping it running, including work with Dask in its early days.

## Reconstructing microtubules across cells

We began with α-tubulin, a component of microtubules, labeled in mouse MC3T3-E1
cells. Microtubules form an extended network through a cell, providing structures
we could examine across successive depths and compare with conventional
light-sheet images.

A fluorescent molecule appears as a blurred spot in an individual camera image.
When a sparse set of labeled molecules blinks, we can estimate their positions
and combine many observations into a reconstruction. Repeatedly scanning the
volume collects more of those positions throughout the cells.

<figure class="article-figure">
  <a class="article-image-link" href="{{ '/assets/img/systems/smlm/microtubules-2019.webp' | relative_url }}" target="_blank" rel="noopener" aria-label="Open the published microtubule reconstruction figure at full size in a new tab">
    <img src="{{ '/assets/img/systems/smlm/microtubules-2019.webp' | relative_url }}" width="682" height="642" alt="Published microtubule images of MC3T3-E1 cells showing a volume projection, successive depth sections, an FRC resolution analysis, and comparisons of light-sheet and localization reconstructions" decoding="async">
  </a>
  <figcaption>
    Microtubules in mouse MC3T3-E1 cells. Panel a projects the volume; b–g show successive depths; h compares FRC-estimated resolution and localization counts as more volumes accumulate. Panels i–k compare the imaging and reconstruction results. Original labels and 5 micrometre scale bars are retained.
    <span class="figure-credit">Lu et al. (2019), <a href="https://www.nature.com/articles/s42003-019-0403-9/figures/2">Fig. 2</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Click the image to enlarge.</span>
  </figcaption>
</figure>

## Collecting enough observations

A shorter recording provides fewer localizations; a longer recording can fill in
structures, but costs acquisition time and is exposed to drift and bleaching.
We needed a way to examine how much additional detail those observations actually
provided.

The graph in Fig. 2h uses Fourier ring correlation (FRC) to estimate lateral
resolution. In broad terms, FRC examines agreement between independent
reconstructions at different spatial scales. Here, the estimated resolution
improved from about 107 nm after 75 volumes to about 75 nm after 250 volumes.
The improvement eventually levels off, helping identify when further acquisition
provides diminishing returns. This measures detail supported by the reconstructed
data; it is distinct from the microscope's optical resolution or the uncertainty
of one fitted molecule position.

The paper also reconstructs microtubules in primary hippocampal neurons from rat
pups, using astigmatism to estimate molecular positions within each optical section.

## Keeping the fluorescence background low

Dense labeling helps us collect localizations, but fluorescence from outside the
plane can obscure individual spots. A scanned Bessel beam confines excitation to
a thin region. The sample moves through that region while the illumination and
detection planes remain fixed, collecting a volume without requiring the two
planes to track one another across the specimen.

<figure class="article-figure">
  <a class="article-image-link" href="{{ '/assets/img/systems/smlm/optical-layout-2019.webp' | relative_url }}" target="_blank" rel="noopener" aria-label="Open the published localization microscope layout at full size in a new tab">
    <img src="{{ '/assets/img/systems/smlm/optical-layout-2019.webp' | relative_url }}" width="756" height="470" alt="Published optical layout of the Bessel light-sheet localization microscope, with an inset showing the illumination plane and specimen scanning" loading="lazy" decoding="async">
  </a>
  <figcaption>
    The light-sheet illumination and detection paths meet at the specimen. The inset shows the sample-scanning arrangement used to record volumes.
    <span class="figure-credit">Lu et al. (2019), <a href="https://www.nature.com/articles/s42003-019-0403-9/figures/1">Fig. 1</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</span>
  </figcaption>
</figure>

## From fixed pores to living cells

Nuclear pore complexes regulate transport across the nuclear envelope. In fixed
HeLa cells, POM121 labeling let the team reconstruct pore structures; aligning
and combining selected pores gave an estimated diameter of about 100 nm
([Fig. 4](https://www.nature.com/articles/s42003-019-0403-9/figures/4)).

Living cells change the tradeoff. Accumulating more observations can improve the
sampling of a structure, while motion during that interval can smear it. For live
POM121 imaging in NIH 3T3 cells, the paper examines a single plane and reconstructs
40-second windows from frames recorded at 20 ms exposure each.

The movie below moves to three-dimensional mapping of Nup153 in live HeLa cells.
The fluorescence view provides context for the localizations. These observations
follow the protein distribution over time; they do not continuously resolve
individual pore structures during rapid nanoscale changes.

<figure class="article-figure">
  <video controls playsinline preload="none" width="620" height="558" poster="{{ '/assets/img/systems/smlm/nuclear-pores-2019.webp' | relative_url }}" aria-label="Live three-dimensional imaging and localization of Nup153 nuclear pore proteins in HeLa cells" aria-describedby="npc-movie-caption">
    <source src="{{ '/assets/video/smlm/nuclear-pores-2019.mp4' | relative_url }}" type="video/mp4">
    <a href="{{ '/assets/video/smlm/nuclear-pores-2019.mp4' | relative_url }}">Open the nuclear pore movie.</a>
  </video>
  <figcaption id="npc-movie-caption">
    Live HeLa cells expressing HaloTag-EGFP-Nup153. Upper left: EGFP fluorescence. Lower left: accumulated localizations from the blinking dye. Right: reconstructed localizations colored by depth, with the original depth scale and elapsed time. This silent, approximately 18-second movie summarizes about 40 minutes of two-color imaging; press Play to watch.
    <span class="figure-credit">Lu et al. (2019), <a href="https://www.nature.com/articles/s42003-019-0403-9#Sec19">Supplementary Movie 2</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Converted from AVI to MP4 for browser playback, with the full image and labels retained. <a href="{{ '/assets/video/smlm/nuclear-pores-2019.mp4' | relative_url }}" target="_blank" rel="noopener">Open the video separately.</a></span>
  </figcaption>
</figure>

## Moving the analysis onto the cluster

The recording arrives as a sequence of volumes, but drift correction needs to
follow the same depth over time. The analysis reorganizes the TIFF stacks into
a time series for each layer, then uses ThunderSTORM with customized macros for
localization. Results from the layers are collected into one localization list
for reconstruction and geometric analysis.

The published workflow used Lustre storage and a four-node TORQUE cluster. My
work on [ThunderSTORM cluster scripts](https://github.com/cbc-group/torque-thunderstorm)
and [Dask on TORQUE](https://github.com/cbc-group/pbs) was part of moving SMLM
analysis onto shared computing infrastructure and keeping processing running.
Acquiring enough molecular observations and computing their reconstruction are
different constraints; this software work addressed how we handled the recordings
once they had been collected.

The small in-lab cluster also supported later light-sheet work, with batched
processing across multiple nodes, dataset storage, and bookkeeping.

Bi-Chang Chen and Chieh-Han Lu constructed the microscope for the 2019 study;
the instrument control software was licensed from HHMI/Janelia.

{% assign system = site.data.systems | where: 'url', page.permalink | first %}
{% capture publications_html %}{% include project-publications.liquid publications=system.publications %}{% endcapture %}
{{ publications_html | strip }}
