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

Microscope acquisition involves devices with different APIs, timing behavior,
and failure modes.

ScopeEngine provides the acquisition framework, while ciMicroscope is a desktop
application for a QCL-based laser-scanning microscope. I work on both in the
Bhargava Lab. The framework separates
requested work from acquisition procedures and the instrument capabilities used
to execute them. This gives hardware-specific behavior a defined place without
putting every vendor API into the application workflow.

Vendor drivers run in separate processes,
with control messages over named-pipe gRPC and large acquired data transferred
through shared memory. This is intended to isolate vendor SDK dependencies and
failures from the application process. Protocol and resource-lifecycle checks are
part of the verification approach, including rejecting incompatible clients and
invalid readers without leaving active read sessions or buffer leases.

Software verification and physical-instrument validation are distinct. Simulated
tests exercise software boundaries; connected-instrument tests depend on the
specific hardware and setup.

The current framework source is private. The
[earlier public microscopy software release](https://github.com/chemimage/Cisl.Qclm.Public)
provides project context and a demonstration of that earlier system.
