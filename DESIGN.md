---
name: Reef Sounds
description: Kawaii underwater scrapbook soundboard — sticker pads on diary paper.
colors:
  sea-canvas: "oklch(0.96 0.025 220)"
  sea-panel: "oklch(0.99 0.015 210)"
  sea-ink: "oklch(0.28 0.05 260)"
  sea-deep: "oklch(0.42 0.09 240)"
  sea-muted: "oklch(0.48 0.04 250)"
  sea-accent: "oklch(0.68 0.16 25)"
  sea-focus: "oklch(0.55 0.14 240)"
  pad-coral: "#f4a4c0"
  pad-aqua: "#5ec8e8"
typography:
  display:
    fontFamily: "'Mochiy Pop One', system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.15
  body:
    fontFamily: "'Kosugi Maru', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.45
rounded:
  pad: "18px"
  ui: "12px"
  pill: "999px"
spacing:
  sm: "0.6rem"
  md: "1rem"
  lg: "1.5rem"
components:
  button-add:
    backgroundColor: "{colors.sea-accent}"
    textColor: "oklch(0.99 0.01 25)"
    rounded: "{rounded.pill}"
    padding: "0.85rem 1.5rem"
  sound-pad:
    backgroundColor: "{colors.pad-aqua}"
    textColor: "{colors.sea-ink}"
    rounded: "{rounded.pad}"
    padding: "1rem 0.6rem"
---

## Overview

Reef Sounds treats each audio clip as a collectible sticker on underwater diary paper. The sound grid dominates the viewport; chrome stays compact. Visual language blends kawaii aquatic motifs, Y2K sticker shadows, and scrapbook asymmetry (slight pad rotation, occasional tape strips).

## Colors

- **Canvas** (`sea-canvas`): milky aqua paper with light grain and a soft top glow.
- **Panels** (`sea-panel`): near-white for sheets and chips.
- **Ink** (`sea-ink`, `sea-deep`, `sea-muted`): body, titles, and helper copy.
- **Accent** (`sea-accent`): coral primary action (Add sound).
- **Pads**: eight saturated sticker hues (see `PAD_COLORS` in `src/types.ts`).

Semantic: error/danger uses coral-red; playing state uses aqua ring pulse, not color alone.

## Typography

- **Display / pad labels**: Mochiy Pop One — chunky, toy-like.
- **UI / forms**: Kosugi Maru — rounded Japanese UI voice.
- Fixed rem scale; no fluid display type on tool surfaces.

## Layout

- Mobile-first 2-column pad grid; 3 columns ≥480px; 4 columns ≥768px.
- Fixed bottom dock for Add sound with safe-area padding.
- Category chips horizontal scroll under header.
- Max content width ~56rem centered on large screens.

## Elevation & Depth

Sticker pads use offset shadows (`2px 4px`) and white sticker borders — intentional Y2K scrapbook depth, not generic glass. Bubbles are ambient background only (low opacity, no interaction).

## Shapes

Rounded pads (18px), pill chips and primary buttons, circular color swatches. Bottom sheets with top handle and 20px top radius.

## Components

- **Sound pad**: tap plays; playing shows pulse ring; edit via corner control.
- **Bottom sheet**: native `<dialog>` for add/edit flows.
- **Overlap toggle**: solo vs overlapping playback in header.

## Do's and Don'ts

- Do keep pads large and thumb-reachable.
- Do validate uploads and show actionable errors.
- Don't add hero marketing blocks above the grid.
- Don't use decorative motion that delays playback feedback.
- Don't store audio in localStorage — use IndexedDB blobs.
