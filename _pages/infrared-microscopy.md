---
layout: page
title: Infrared laser-scanning microscopy
permalink: /systems/infrared-microscopy/
description: The software engine behind infrared microscope acquisition, from measurement requests to stored images.
---

The part of infrared laser-scanning microscopy that I most want to share is the
software engine I wrote. ScopeEngine connects a requested measurement to the
instruments, acquisition procedures, and data handling needed to carry it out.
ciMicroscope is the desktop application that uses it to operate a QCL-based
microscope in the [Bhargava Lab](https://chemimage.illinois.edu/) at UIUC.

A request can be simple to describe: image this section at several infrared
bands. Carrying it out means coordinating laser tuning, scanning, detector
readout, sample positioning, processing, and storage. I developed the engine
around separating those responsibilities so that the application can describe
the measurement without coordinating every device itself.

## From a measurement request to individual acquisitions

Infrared absorption provides chemical contrast because different molecular
vibrations contribute at different wavelengths. We tune the quantum cascade
laser to a band, acquire an image, then repeat at the other requested bands.
Covering a large section also requires a mosaic of stage positions.

For example, a request for 25 tiles at three bands contains 75 individual image
acquisitions. ScopeEngine represents the request as a job. Job providers expand
its dimensions, such as positions and bands, into the individual acquisitions.
A controller implements the acquisition procedure, while the runtime coordinates
its execution and device assignments.

This separation gives each part a specific responsibility. The application
specifies what to collect; providers generate the steps; the controller knows
how to acquire an image. Adding a dimension to a measurement does not require
the desktop interface to contain every combination of hardware instructions.

## Connecting acquisition logic to different instruments

A microscope brings together equipment with different vendor APIs and different
capabilities. ScopeEngine gives controllers access to operations such as tuning
a laser, moving a stage, or acquiring scanner data. Vendor drivers translate
those operations into the calls required by a particular instrument.

A device can expose the capabilities it actually supports. Similarly, one logical
scanner operation can be backed by different hardware constructions. This lets
acquisition logic use a common operation while hardware-specific behavior stays
with its implementation.

Production vendor drivers run in separate host processes. Commands pass over
named-pipe gRPC, while large acquired data uses shared memory. This keeps vendor
SDK loading and native dependencies outside the desktop application's process
and separates control messages from the transfer of image data.

## Following the data through a measurement

The controller assembles acquired samples into an image or spectrum and attaches
the result to its job. Processing can transform that data without taking over
hardware control. Dataset storage keeps results together with acquisition
settings and metadata, while the application observes updates for display.

The runtime also manages cancellation and cleanup. Stopping a measurement has
to unwind the active procedure and release its device assignments and other
resources. That lifecycle belongs in the engine alongside execution, so that
individual application workflows do not each have to coordinate it themselves.

The [ScopeEngine page]({{ '/projects/scopeengine/' | relative_url }}) provides
more software context and a link to an earlier public microscope demonstration.
The current framework source is private.

## The microscope the software serves

The optical layout below is from our team's
[2023 IR-LSM paper](https://doi.org/10.1038/s41467-023-40740-w). It shows the
measurement the software must coordinate: a tunable infrared source, scanning
mirrors, custom refractive optics, and confocal detection.

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
That connection between an experimental request, physical instruments, and a
usable dataset is the central idea behind my engine work.

The published figures document the team's earlier instrument. Kevin Yeh led its
microscope build and original control software; the 2023 paper credits me and
Manu Mehta with microscope subroutines. ScopeEngine is the current framework
described above.

Alongside the software, I work on firmware and electrical design and help build,
align, integrate, and maintain the instruments.

{% assign system = site.data.systems | where: 'url', page.permalink | first %}
{% capture publications_html %}{% include project-publications.liquid publications=system.publications %}{% endcapture %}
{{ publications_html | strip }}
