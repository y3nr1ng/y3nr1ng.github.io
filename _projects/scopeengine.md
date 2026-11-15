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
publications:
  - title: Designing software solutions for infrared chemical imaging and digital pathology
    label: SPIE 2025 proceedings
    url: https://doi.org/10.1117/12.3042353
---

Microscope acquisition combines instruments with different APIs, timing behavior,
and failure modes. The software has to coordinate them while keeping acquisition
logic, vendor integration, data handling, and the user interface understandable.

I develop ScopeEngine, an acquisition framework, and ciMicroscope, a desktop
application for a QCL-based laser-scanning microscope. The framework separates
requested work from acquisition procedures and the instrument capabilities used
to execute them. This gives hardware-specific behavior a defined place without
putting every vendor API into the application workflow.

One important boundary is the driver host. Vendor drivers run in separate processes,
with control messages over named-pipe gRPC and large acquired data transferred
through shared memory. This is intended to isolate vendor SDK dependencies and
failures from the application process. Protocol and resource-lifecycle checks are
part of the verification approach, including rejecting incompatible clients and
invalid readers without leaving active read sessions or buffer leases.

Software verification and physical-instrument validation are distinct. Simulated
tests exercise software boundaries; connected-instrument tests depend on the
specific hardware and setup. A software test result alone does not validate an
optical acquisition.

The current framework source is private. The
[earlier public microscopy software release](https://github.com/chemimage/Cisl.Qclm.Public)
provides project context and a demonstration of that earlier system.
