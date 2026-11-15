---
layout: page
category: Scientific software
title: SimScope
permalink: /projects/simscope/
description: Virtual optical benches with explicit physical models and inspectable
  simulation results.
discipline: Numerical simulation
importance: 3
featured: true
language: Python
technology: Numerical optics
---

An optical simulation needs to explain which physical setup was modeled, how light
was represented numerically, and what the resulting measurements actually mean.
A visually convincing plot is not enough to establish a correct result.

I develop SimScope, a Python toolkit for virtual microscopes and optical benches.
Experiments combine placed components with ray or field representations, then
record paths, detector measurements, and fields for browser inspection.

The library separates physical configuration from numerical sampling and execution.
That distinction makes it possible to refine a calculation without silently
changing the experiment, and to inspect a recorded result without repeating the
entire solve. Ray tracing, scalar propagation, and vector focusing have different
assumptions; the model is selected according to the question being asked.

Validation includes comparisons with independent references. A Michelson
interferometer test, for example, constructs a Gaussian propagation reference and
compares the predicted detector distribution. Such a comparison addresses a
specific configuration and model; it does not establish accuracy for arbitrary
optical systems. Sampling convergence and model limitations are reported separately.

The source repository is private. The project combines optical modeling with software for inspecting the resulting measurements and fields.
