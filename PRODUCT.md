# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated: Vite + React + TypeScript — fast mobile-first SPA with IndexedDB for local audio blobs.

## Users

People who want a playful, personal soundboard on their phone or browser: creators, friends sharing meme clips, tabletop GMs, or anyone collecting short audio snippets to trigger on tap.

## Product Purpose

A customizable soundboard where users upload audio, assign it to tactile pads, organize sounds, and play them instantly. Success means opening the app, adding a sound, and playing it within seconds — with choices persisting locally between sessions.

## Positioning

Sounds are collectible objects in a kawaii underwater scrapbook toy — not a DAW, music player, or SaaS dashboard.

## Operating Context

Single-page web app, used one-handed on mobile, often in quick bursts. No account required. Data stays on device unless a backend is added later.

## Capabilities and Constraints

- Upload MP3, WAV, OGG, WebM (browser-dependent).
- IndexedDB for audio blobs and pad metadata; not localStorage for audio.
- Local-only persistence with clear limitation messaging.
- No auth or cloud sync in v1.
- Max upload size: 10 MB per file (configurable).
- Overlap policy: user-toggle — play multiple sounds or stop others when a new one starts (default: restart same pad, allow overlap across different pads).

## Brand Commitments

Visual world: kawaii underwater, Y2K internet nostalgia, digital scrapbooking, playful web toys. Avoid generic SaaS, mixer consoles, and AI-slop decoration patterns.

## Evidence on Hand

Greenfield — no pre-existing brand assets. Decorative SVG illustrations authored in-repo.

## Product Principles

1. Tap a pad → hear the sound immediately.
2. Mobile-first touch targets and layout.
3. Every sound feels like a collectible sticker object.
4. Playful motion with reduced-motion respect.
5. Usability never sacrificed for decoration.

## Accessibility & Inclusion

Keyboard-triggerable pads, accessible names, non-color-only playing states, WCAG AA contrast on text and controls, `prefers-reduced-motion` support.
