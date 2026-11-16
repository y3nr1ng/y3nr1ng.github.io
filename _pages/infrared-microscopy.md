---
layout: page
title: Infrared laser-scanning microscopy
permalink: /systems/infrared-microscopy/
description: Microscope control software and firmware, electrical design, and hands-on instrument work in the Bhargava Lab at UIUC.
---

Infrared microscopy uses molecular absorption to form chemical images without
adding stains or fluorescent labels. A laser-scanning microscope records these
measurements across a specimen, combining spatial information with infrared
spectral contrast.

These instruments are developed in the
[Chemical Imaging and Structures Laboratory (Bhargava Lab)](https://chemimage.illinois.edu/)
at UIUC.

The instrument brings together a tunable infrared laser, scanning optics,
positioning hardware, detectors, and synchronized data acquisition. Optical
alignment, electrical interfaces, firmware, and control software all contribute
to making those measurements possible.

## My work

My main work is control software and firmware. I also contribute to electrical
design and to building, aligning, integrating, and maintaining the instruments.

## Acquisition software

The control software includes ScopeEngine, an acquisition framework, and
ciMicroscope, a desktop application for infrared laser-scanning microscopy. It coordinates
device control, acquisition workflows, and processing of the acquired data.

The [ScopeEngine / ciMicroscope project page]({{ '/projects/scopeengine/' | relative_url }})
describes the software architecture, including the separation of acquisition
workflows from vendor drivers and the transfer of acquired data through shared
memory.

## The published instrument

The 2023 Nature Communications paper describes the team's infrared spectroscopic
laser-scanning confocal microscope for whole-slide chemical imaging. Its
[instrument layout and characterization](https://www.nature.com/articles/s41467-023-40740-w/figures/1)
show the published optical configuration, spatial-resolution measurements, and
example imaging results.

The publications below describe related instrument, detection, and software work
by the team.

{% assign system = site.data.systems | where: 'url', page.permalink | first %}
{% include project-publications.liquid publications=system.publications %}
