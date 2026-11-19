---
layout: page
category: Instrument control
title: ScopeEngine / ciMicroscope
permalink: /projects/scopeengine/
description: Acquisition software connecting microscope workflows with vendor-specific
  instruments.
discipline: Instrument control
importance: 1
featured: true
language: C#
technology: .NET / Avalonia
resource:
  label: Earlier microscope software and demonstration
  url: https://github.com/chemimage/Cisl.Qclm.Public
publications:
  - title: Designing software solutions for infrared chemical imaging and digital pathology
    label: SPIE 2025 proceedings
    date: "2025-03"
    url: https://doi.org/10.1117/12.3042353
---

I wrote ScopeEngine to connect a requested measurement to the instruments,
acquisition procedures, and data handling needed to carry it out. ciMicroscope
is the desktop application that uses the engine to operate a QCL-based
laser-scanning microscope in the Bhargava Lab at UIUC.

A request can be simple to describe: image this section at several infrared
bands. Carrying it out means coordinating laser tuning, scanning, detector
readout, sample positioning, processing, and storage. I developed the engine
around separating those responsibilities so the application can describe the
measurement without coordinating every device itself. The
[IR-LSM article]({{ '/systems/infrared-microscopy/' | relative_url }}) introduces
the instrument and its chemical images.

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

## Existing acquisition software (WIP)

Initial documentation survey, November 18, 2026. This is a working list of
relevant systems and their documented approaches, not an exhaustive inventory,
a benchmark, or a completed feature comparison with ScopeEngine.

**Microscope control and acquisition frameworks**

- [Micro-Manager](https://micro-manager.org/): microscope automation, multidimensional acquisition, and a C++ device-adapter interface shared across supported hardware.
- [Pycro-Manager](https://pycro-manager.readthedocs.io/en/latest/backends.html): Python acquisition APIs over Micro-Manager, with Java and Python backends and desktop or headless operation.
- [pymmcore-plus](https://pymmcore-plus.github.io/pymmcore-plus/): direct Python access to MMCore, a Python multidimensional acquisition engine, events, and optional Qt/napari interfaces.
- [ExEngine](https://exengine.readthedocs.io/en/latest/): an execution toolkit separating device backends, reusable acquisition events, storage, and application frontends, with explicit threading utilities.
- [Python-Microscope](https://python-microscope.org/doc/architecture/device-server.html): hardware interfaces with separate device-server processes that can also run across different computers.
- [Microscope-Cockpit](https://microscope-cockpit.org/): a bespoke-microscope interface using Python-Microscope devices and hardware signals for experiment timing.
- [ImSwitch](https://imswitch.readthedocs.io/en/stable/): modular Python microscope control using a model-view-presenter architecture across multiple imaging modalities.
- [navigate](https://thedeanlab.github.io/navigate/): light-sheet acquisition with reusable acquisition/analysis features chained into custom protocols, hardware abstraction, and plugins.
- [ScanImage](https://docs.scanimage.org/Configuration/Imaging%2BSystems.html): scanning-microscope acquisition with documented linear, resonant, SLM, and vDAQ scan systems and hardware-specific timing configurations.

**Broader experimental-control frameworks**

- [Bluesky](https://blueskyproject.io/bluesky/v1.16.0/tutorial.html): experimental plans interpreted by a RunEngine, with coordinated device execution, interruption handling, and structured data/metadata documents.
- [ScopeFoundry](https://scopefoundry.org/docs/): Python/Qt applications built from hardware-component and measurement plugins, including reusable scanning and sequencing measurements.
- [ACQ4](https://acq4.readthedocs.io/en/latest/userGuide/principles.html): modules submit synchronized device tasks to a central manager that coordinates device access, execution, and data management.
- [Bonsai](https://bonsai-rx.org/): reactive visual workflows for acquisition, processing, and coordination of sensors and hardware, with C# extension points.

**Commercial microscope applications**

- [Nikon NIS-Elements](https://www.microscope.healthcare.nikon.com/products/software/nis-elements/software-packages): acquisition, device control, analysis, and graphical JOBS workflows; features depend on the package and modules.
- [ZEISS ZEN](https://www.zeiss.com/microscopy/us/products/software/zeiss-zen.html): acquisition and analysis with automation, multidimensional experiments, and scripting options across its modules.
- [Leica LAS X](https://www.leica-microsystems.com/products/microscope-software/p/leica-las-x-ls/): an integrated microscope application covering acquisition, processing, and analysis within the Leica software ecosystem.

The comparison is still in progress. Separating workflows from hardware or placing
devices in separate processes already appears in other systems. I am comparing
how each represents acquisition requests, composes device capabilities, handles
scanner/detector timing, moves image data, manages cancellation and resource
ownership, and separates the engine from its user interface. ScopeEngine's own
job/controller/operation boundaries and driver-host/shared-memory implementation
provide concrete points to examine, rather than establishing uniqueness by
themselves.

## Software and instrument checks

Protocol and resource-lifecycle checks include rejecting incompatible clients
and invalid readers without leaving active read sessions or buffer leases.
Software verification and physical-instrument validation are distinct: simulated
tests exercise software boundaries, while connected-instrument tests depend on
the particular hardware and setup.

The current framework source is private. The
[earlier public microscopy software release](https://github.com/chemimage/Cisl.Qclm.Public)
provides project context and a demonstration of that earlier system.
