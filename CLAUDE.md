# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Single-page React demo app showcasing custom hand-drawn SVG components for a sports scouting platform. This is a client-facing portfolio piece — it must look like a premium product (dark dashboard aesthetic), not a tutorial.

## Commands

```bash
npm install          # install dependencies
npm run dev          # start Vite dev server
npm run build        # production build
npm run preview      # preview production build
npx tsc --noEmit     # type-check without emitting
```

## Stack & Hard Constraints

- **React 18 + TypeScript** (strict mode) with **Vite**
- **Tailwind CSS** for styling — no inline styles
- **Zustand** for global state (player comparison)
- **ALL charts/graphics are hand-drawn SVG** — `<svg>`, `<polygon>`, `<circle>`, `<path>`, `<rect>`, `<text>`, `<line>`
- **BANNED: D3, Chart.js, Recharts, Victory, Nivo, or any charting library**
- **BANNED: Canvas** — SVG only
- **BANNED: `any` type** — strict TypeScript throughout
- No backend, no routing, no mobile layout — desktop-only single page
- Fonts: `"JetBrains Mono"` (data/numbers), `"Plus Jakarta Sans"` (text) via Google Fonts

## Architecture

```
src/
  components/       # Each SVG component in its own file
    RadarChart.tsx   # Hexagonal 8-axis radar, dual-player overlay
    Heatmap.tsx      # Football pitch + zone-based heatmap
    InteractivePitch.tsx  # Draggable 4-3-3 formation with View/Move/Draw modes
    PlayerCard.tsx   # CSS 3D flip card with mini-radar on back
  hooks/
    useMouseDrag.ts  # SVG drag-and-drop hook (onMouseDown/Move/Up)
  store/             # Zustand stores
  utils/
    geometry.ts      # Polygon point calculation, grid coordinates (with math comments)
  data/              # Hardcoded player stats, formation data, heatmap data
```

## Design System

- Dark theme: background `#0a0f1c`, cards `#111827`
- Primary accent: `#22d3ee` (cyan-400) — player 1 polygon, highlights
- Secondary accent: `#f97316` (orange-500) — player 2 polygon
- Cards: `border: 1px solid rgba(255,255,255,0.06)`, rounded corners, soft shadows
- Animations: CSS transitions/keyframes preferred over JS — radar polygons scale from center (600ms ease-out), staggered player dot appearances, heatmap zone fade-in on hover

## Key Implementation Details

**Radar Chart math:** Center (cx, cy), 8 axes, angle per axis = `(2pi * i / 8) - pi/2` (start from top). Point: `x = cx + r * (value/100) * cos(angle)`. Grid levels at 33%, 66%, 100%. ViewBox `0 0 500 500`, radius ~180.

**Football pitch:** 68x105 proportions (width x length, top-down view). Field markings (center circle, penalty areas, goals, halfway line) in white on dark green (`#1a472a`).

**Heatmap:** 6x8 grid (48 zones), color scale: transparent -> `#fbbf24` (yellow) -> `#f97316` (orange) -> `#ef4444` (red). Three data modes: Passes, Shots, Touches.

**Interactive Pitch:** Three toolbar modes — View (hover shows stats), Move (drag players), Draw (click-drag creates arrow lines with `marker-end`).

**Player Cards:** CSS 3D flip via `transform-style: preserve-3d` + `rotateY(180deg)`. Front: gradient placeholder photo, name, club, position, overall rating. Back: simplified 6-axis mini-radar + stat list. Manage Mode adds wiggle animation + delete/compare buttons.

## Page Layout

Single scrollable page with sections: Header -> Radar Chart -> Heatmap -> Interactive Pitch -> Player Cards -> Footer (tech stack icons).
