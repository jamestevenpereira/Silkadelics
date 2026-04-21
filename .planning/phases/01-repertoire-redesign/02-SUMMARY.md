---
phase: 1
plan: 02
subsystem: shared/components
tags: [carousel, angular-signals, accessibility, autoplay]
key-files:
  created:
    - frontend/src/app/shared/components/carousel/carousel.component.ts
    - frontend/src/app/shared/components/carousel/carousel.component.html
---

# Plan 02 — CarouselComponent: COMPLETE

## What Was Built

Created reusable `CarouselComponent` — a premium standalone Angular carousel accepting `RepertoireImage[]` input. Features autoplay via `NgZone.runOutsideAngular`, pause-on-hover, navigation arrows, dot indicators, and scale animation on inactive slides. Full ARIA support.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 2.1 | 5cd8bee | feat(phase-1-02): create CarouselComponent with autoplay, navigation, and ARIA support |
| 2.2 | 5cd8bee | (included in same commit) |

## Self-Check: PASSED

- [x] `carousel.component.ts` and `carousel.component.html` both exist
- [x] `images` is an `input<RepertoireImage[]>` signal
- [x] Autoplay runs outside NgZone (no CD overhead)
- [x] Dots and arrows have proper ARIA attributes
- [x] `OnDestroy` clears the interval
