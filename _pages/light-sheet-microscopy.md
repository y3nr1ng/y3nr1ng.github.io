---
layout: page
title: Light-sheet microscopy
permalink: /systems/light-sheet-microscopy/
description: Imaging three-dimensional specimens with sheets of light, patterned illumination, and optical stimulation.
---

A light-sheet microscope illuminates a thin plane inside a specimen while a
camera looks at that plane from the side. Recording successive planes builds a
three-dimensional image. At Academia Sinica, I worked with axial-scan, dual-view,
and lattice light-sheet systems. The papers here describe the team's lattice
light-sheet work.

## Imaging a volume

The illumination and detection objectives approach the specimen from different
directions. In lattice light-sheet microscopy, patterned light forms the thin
illuminated region. Moving the specimen through it lets us record a volume,
and repeating that acquisition lets us follow changes over time.

<figure class="article-figure">
  <a class="article-image-link" href="{{ '/assets/img/systems/light-sheet/opto-layout-2022.webp' | relative_url }}" target="_blank" rel="noopener" aria-label="Open the published light-sheet optical layout at full size in a new tab">
    <img src="{{ '/assets/img/systems/light-sheet/opto-layout-2022.webp' | relative_url }}" width="748" height="300" alt="Published optical layout with a programmable spatial light modulator, pupil mask, and two objectives meeting at the specimen" decoding="async">
  </a>
  <figcaption>
    The 2022 instrument combines lattice light-sheet imaging with a separately positioned stimulation beam. A spatial light modulator changes the illumination pattern electronically.
    <span class="figure-credit">Panel excerpt from Tang et al. (2022), <a href="https://www.nature.com/articles/s42003-022-03835-6/figures/1">Fig. 1a</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Click the image to enlarge.</span>
  </figcaption>
</figure>

## Larger specimens and finer detail

Our [2020 Methods paper](https://doi.org/10.1016/j.ymeth.2019.04.006) looks at
expanded specimens: biological structures embedded in a gel that physically
swells, making small features easier to distinguish. The larger specimen also
means more volume to image. The team combined specimen preparation with a tiling
lattice light-sheet approach to reduce specimen translation during acquisition.

The [2020 Journal of Physics D paper](https://doi.org/10.1088/1361-6463/ab50e2)
explores structured illumination. Instead of recording one image per plane,
we record several with shifted illumination patterns and reconstruct an image
from them. The two-beam interference design uses three pattern phases for
two-dimensional structured illumination within the light-sheet microscope.
My work included implementing SIM reconstruction algorithms.

## Using light to influence living cells

The [2022 optoLLSM paper](https://doi.org/10.1038/s42003-022-03835-6) adds
optogenetic stimulation: light activates engineered, light-sensitive proteins
in a cell. The instrument positions a stimulation beam while recording
three-dimensional fluorescence images. This connects a local intervention to
the cell's response over time.

<figure class="article-figure">
  <a class="article-image-link" href="{{ '/assets/img/systems/light-sheet/cell-migration-2022.webp' | relative_url }}" target="_blank" rel="noopener" aria-label="Open the published cell-migration figure at full size in a new tab">
    <img src="{{ '/assets/img/systems/light-sheet/cell-migration-2022.webp' | relative_url }}" width="739" height="1055" alt="Published cell-migration figure with successive cell outlines, a cell-volume plot, and a sequence of three-dimensional cell renderings labeled by time" loading="lazy" decoding="async">
  </a>
  <figcaption>
    A guided cell-migration experiment from the 2022 paper. Successive outlines show the changing position and shape; the plot tracks volume, and the snapshots below show the cell in 3D. Original time labels and scale bars are retained.
    <span class="figure-credit">Tang et al. (2022), <a href="https://www.nature.com/articles/s42003-022-03835-6/figures/5">Fig. 5</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</span>
  </figcaption>
</figure>

## Building the system and handling its images

For optoLLSM, I helped design and construct the instrument with Wei-Chun Tang,
Chieh-Han Lu, and Bi-Chang Chen. The microscope's control software builds on
the SPIM program licensed from HHMI/Janelia. The published imaging experiments
and image processing were carried out by Wei-Chun Tang and Bi-Chang Chen.

Across my light-sheet work, I also developed acquisition tools and software for
volumetric processing, including fusion of multi-focus, non-gridded datasets.
The related [uToolbox](https://github.com/y3nr1ng/utoolbox) and
[DeconvLR](https://github.com/y3nr1ng/DeconvLR) repositories cover other parts
of my image-processing work.

{% assign system = site.data.systems | where: 'url', page.permalink | first %}
{% capture publications_html %}{% include project-publications.liquid publications=system.publications %}{% endcapture %}
{{ publications_html | strip }}
