---
layout: page
category: Analysis & simulation
title: SimScope
permalink: /projects/simscope/
description: Virtual optical benches with explicit physical models and inspectable
  simulation results.
discipline: Numerical simulation
importance: 3
featured: true
language: Python
technology: NumPy
resource:
  label: Reference-comparison example
  url: /projects/simscope/#reference-comparison
---

SimScope is a Python toolkit for virtual microscopes and optical benches.
Experiments combine placed components with ray or field representations, then
record paths, detector measurements, and fields for browser inspection.

I work on the modeling code and the tools for inspecting these results.

The library separates physical configuration from numerical sampling and execution.
That distinction makes it possible to refine a calculation without silently
changing the experiment, and to inspect a recorded result without repeating the
entire solve. Ray tracing, scalar propagation, and vector focusing have different
assumptions; the model is selected according to the question being asked.

## Reference comparison

A Michelson interferometer test compares the simulated detector distribution with
an independently calculated Gaussian propagation reference.

The test specifies a relative-error tolerance of 2%. That is an acceptance
criterion in the test, not a measured result reported here. It does not establish
accuracy for arbitrary optical systems. Sampling convergence and model limitations
are separate checks.

The source repository is private.
