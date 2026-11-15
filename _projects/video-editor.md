---
layout: page
category: Applications & utilities
title: VideoEditor
permalink: /projects/video-editor/
description: Local browser editing for experiment recordings and presentation videos.
discipline: Interactive applications
importance: 4
featured: false
language: TypeScript
technology: React / FFmpeg
---

I wanted a quick way to trim and annotate recordings for presentations without
installing a large editor or uploading the recordings to an online editing service.

I built VideoEditor, a React/TypeScript application that turns edit state into
FFmpeg commands and processes media locally in the browser with WebAssembly.
The application supports operations such as trimming, cropping, speed changes,
zoom, annotations, and timestamps.

An important engineering concern is consistency between preview and export.
Annotations share a canvas renderer, while export translates timeline operations
into media-processing jobs. Verification includes tests that run the FFmpeg WASM
core and inspect output streams, dimensions, and duration with ffprobe, alongside
interface and geometry tests. Those core checks complement browser testing rather
than replacing it.

Local processing avoids uploading recordings for editing, but browser memory and
processing cost limit large or 4K inputs. Projects currently do not survive a page
reload. FFmpeg supplies the media-processing engine; my application work connects
the editing interface, edit model, rendering, and export workflow.

[Open the editor](https://y3nr1ng.github.io/VideoEditor/) ·
[Source](https://github.com/y3nr1ng/VideoEditor)
