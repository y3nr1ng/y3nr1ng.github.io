---
layout: page
category: Instrument control
title: ScopeEngine / ciMicroscope
permalink: /projects/scopeengine/
description: Acquisition engine for camera, laser-scanning, and spectral measurements,
  with explicit device ownership and data handling.
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

A camera delivers image frames. A laser-scanning microscope starts with detector
samples, scanner motion, and timing signals that have to be assembled into an
image. A spectral measurement repeats that work as the laser changes wavelength.
These are different acquisition procedures, even when the operator wants the
same things: preview the sample, focus, record a region, and save a dataset.

I wrote ScopeEngine to bring those procedures into one C#/.NET acquisition
engine. It supports camera capture, galvo scanning, and resonant frame or
stage-stripe acquisition through common planning, device ownership, and data
handling. ciMicroscope is the desktop application that uses it in the Bhargava
Lab at UIUC. The [IR-LSM article]({{ '/systems/infrared-microscopy/' | relative_url }})
introduces the instrument and its chemical images.

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

The controller declares the combination of operations it requires. A laser
assignment, for example, can require emission control and wavelength tuning on
the same device, with current control available as an optional capability.
Compatibility predicates can check whether that combination supports the
acquisition. This makes the required capabilities explicit before the controller
uses them.

One logical scanner operation can also be backed by different hardware
constructions. The common operation gives acquisition logic a stable interface,
while the specialized controller still handles the timing and reconstruction
that its acquisition mode needs.

Production vendor drivers run in separate host processes. Commands pass over
named-pipe gRPC, while large acquired data uses shared memory. This keeps vendor
SDK loading and native dependencies outside the desktop application's process
and separates control messages from the transfer of image data.

## Sharing devices during nested acquisition

An autofocus operation can need the same camera and positioning devices as the
acquisition that requested it. ScopeEngine manages these transitions through
controller contexts: the current context can be suspended, another activated,
and the caller resumed afterward. Device assignments and leases make ownership
explicit across those transitions.

The runtime also carries an execution fault scope through nested contexts. When a
device-operation fault is reported to that scope, the first fault is recorded before recovery
notifications propagate to dependent operations. Cleanup can report additional
failures while retaining the cause that stopped the measurement. That gives
stopping and failure handling a place in the engine alongside normal execution.

## Bounding pending writes

Acquisition, processing, display, and storage consume data at different rates.
The controller attaches acquired data to its job; processors can transform it
without taking over hardware control; storage records results with their
settings and metadata.

A slow writer should have an explicit effect on the pipeline. ScopeEngine's
storage session limits pending writes by both item count and estimated bytes.
It reserves capacity before creating the queued data snapshot, and waits when
the configured budget is occupied. This controls admission to that storage queue
instead of allowing completed snapshots to accumulate there without a limit.
The byte accounting is estimated, and one oversized output can exceed the byte
budget; it is not a hard limit on total application memory.

Different parts of the acquisition can need different policies. The resonant
queue of completed frames drops older frames when full, while the storage queue
waits for capacity. These policies make the behavior of each handoff explicit.

Production driver hosts transfer large blocks through memory-mapped buffers with
read sessions and explicit leases. This keeps their lifetime separate from the
control messages. Arrays are copied into the mappings, and the host tracks when
each transferred buffer is acknowledged, released, or expired.

## Existing acquisition software (WIP)

Documentation and targeted source review, November 18, 2026. This is a working
comparison of relevant systems, not an exhaustive inventory or a performance
ranking. Open-source implementations were examined at pinned revisions; current
commercial applications remain documentation-only. ScanImage source inspection
used a historical 5.3.1 snapshot, separate from current product documentation.

The source review puts ScopeEngine's emphasis on three concrete design choices:
required and optional operations matched to one device identity; owned controller
contexts for nested acquisition; and explicit transfer/storage lifetimes and
queue policies. The examples above explain what those choices do in this engine.
Other systems provide overlapping capabilities through different models.

Two narrower comparisons from the inspected source are worth following up:

- **Storage admission:** ScopeEngine applies item and estimated-byte budgets before queuing retained outputs. The reviewed [ExEngine data handler](https://github.com/micro-manager/ExEngine/blob/43ceac3743741edb37a719884ed80c11ce3b3fb1/src/exengine/kernel/data_handler.py) uses unbounded default queues. Applications can add their own limits; the comparison here is the policy built into these particular storage handoffs.
- **Teardown diagnostics:** ScopeEngine collects acquisition and cleanup failures so the causes remain available together. The reviewed [navigate feature-container cleanup](https://github.com/TheDeanLab/navigate/blob/b9c747a564eb32062c0a1a5e12389ae7b37c045e/src/navigate/model/features/feature_container.py#L455) discards cleanup-callback exceptions. Other navigate execution paths log errors; this is a difference at that cleanup boundary, not a general reliability ranking.

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

ExEngine is a close comparison for reusable execution events and device backends;
pymmcore-plus for a replaceable acquisition engine; ACQ4 for synchronized tasks
and device reservations; and navigate for programmable imaging and shared-memory
data. Their implementations make workflow separation, asynchronous execution,
and cleanup shared ground for comparison.

The next step is to compare equivalent acquisitions: the same device needs,
nested autofocus, a blocked read, and slow storage. That would establish how the
designs behave under the same conditions. The review so far does not establish
a speed, reliability, or image-quality advantage.

## Software and instrument checks

Protocol and resource-lifecycle checks include rejecting incompatible clients
and invalid readers without leaving active read sessions or buffer leases.
Software verification and physical-instrument validation are distinct: simulated
tests exercise software boundaries, while connected-instrument tests depend on
the particular hardware and setup.

The current framework source is private. The
[earlier public microscopy software release](https://github.com/chemimage/Cisl.Qclm.Public)
provides project context and a demonstration of that earlier system.
