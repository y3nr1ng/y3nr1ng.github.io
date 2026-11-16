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

VideoEditor is a browser application for trimming and annotating recordings for
presentations. Media processing runs locally using FFmpeg compiled to WebAssembly.
The application supports operations such as trimming, cropping, speed changes,
zoom, annotations, and timestamps.

I work on the React/TypeScript editing interface, edit model, rendering, and
export workflow. FFmpeg supplies the media-processing engine.

Preview and export share a canvas renderer for annotations. Export translates timeline operations
into media-processing jobs. Verification includes tests that run the FFmpeg WASM
core and inspect output streams, dimensions, and duration with ffprobe, alongside
interface and geometry tests. Those core checks complement browser testing rather
than replacing it.

Local processing avoids uploading recordings for editing, but browser memory and
processing cost limit large or 4K inputs. Projects currently do not survive a page
reload.

[Open the editor](https://y3nr1ng.github.io/VideoEditor/) ·
[Source](https://github.com/y3nr1ng/VideoEditor)
