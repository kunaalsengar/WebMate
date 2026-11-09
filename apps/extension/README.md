# @webmate/extension

The Chrome Extension client for WebMate, built with [WXT](https://wxt.dev/), React, TypeScript, Tailwind CSS, and Zustand.

## Overview

WebMate is designed to run as a Chrome Extension Manifest V3 companion. It injects an isolated UI container (`<webmate-root>`) into supported webpages via an open Shadow DOM tree, enabling companion UI rendering without style bleeding or layout disruption.

## Technology Stack

- **Framework**: WXT (Next-generation web extension framework)
- **UI Engine**: React 18
- **Styling**: Tailwind CSS 3.x
- **State Management**: Zustand
- **Animation Engine (Planned Phase 2)**: GSAP & CSS Keyframes
- **Extension Target**: Chrome Manifest V3 (Cross-browser portable via WXT)

## Project Structure

```
apps/extension/
├── entrypoints/
│   ├── background.ts               # Manifest V3 Background Service Worker
│   ├── content/                    # Content script injected into HTTP/HTTPS pages
│   │   ├── index.ts                # Content script entrypoint
│   │   └── style.css               # Scoped Tailwind CSS & Shadow DOM resets
│   └── popup/                      # Action popup UI
│       ├── index.html
│       ├── main.tsx
│       ├── App.tsx
│       └── style.css
├── src/
│   ├── character/                  # Asset-independent character rig foundation
│   │   ├── CharacterRig.tsx        # Transparent SVG rig container (viewBox: 0 0 200 250)
│   │   ├── CharacterLayers.tsx     # Independent renderers for all 12 rig layer slots
│   │   ├── expressions.config.ts   # Configuration for 8 canonical facial expressions
│   │   └── types.ts                # Rig render interfaces & asset registry contracts
│   └── content/
│       ├── mount.ts                # Modular Shadow DOM mounting & idempotency manager
│       ├── FloatingCompanion.tsx   # Draggable floating container with docking transitions
│       ├── CompanionPlaceholder.tsx # Minimal navy-and-white companion placeholder
│       ├── useDraggable.ts         # Pointer events, pointer capture, rAF throttling hook
│       ├── docking.ts              # Viewport clamping and horizontal edge docking algorithms
│       ├── storage.ts              # Chrome Storage API (chrome.storage.local) persistence
│       └── store.ts                # Zustand runtime state store for positioning and docking
├── assets/
│   └── character/                  # Manifests, layer slots, expression directories, and ingestion guides
├── package.json
├── tsconfig.json
├── wxt.config.ts                   # WXT configuration & manifest definition
├── tailwind.config.js              # Tailwind configuration
├── postcss.config.js               # PostCSS configuration
└── README.md
```

## Available Scripts

Run from repository root:
- `pnpm dev:extension` — Starts the extension in dev mode with hot reload.
- `pnpm build:extension` — Builds the production bundle into `.output/chrome-mv3`.

Inside `apps/extension`:
- `pnpm dev` — Start WXT dev mode.
- `pnpm dev:firefox` — Start WXT dev mode for Firefox.
- `pnpm build` — Build extension for Chrome MV3.
- `pnpm zip` — Package extension zip for Chrome Web Store distribution.

## Current Status (Phase 2, Steps 1A & 1B Completed)

WebMate features a 100% original, fully articulated mascot companion powered by an asset-independent 12-layer SVG rig and GSAP procedural animation engine:
- **Transparent Rig Renderer**: `CharacterRig.tsx` renders in SVG coordinate space (`0 0 200 250`) without background cards or color planes.
- **12 Layer Slots**: Ground contact shadow, left/right legs, left/right arms, torso/body, head, blush, eyebrows, eyes, mouth, and emotional FX overlays.
- **Original Mascot Artwork**: Premium original 2D vector artwork package (`apps/extension/src/character/artwork/`) adhering strictly to project IP and zero-copyright guidelines.
- **Expression Configurations**: Full typed configurations for 8 canonical expressions (`normal`, `happy`, `thinking`, `surprised`, `confused`, `explaining`, `talking`, `sleeping`).
- **GSAP Animation Subsystem**: Procedural GSAP timelines (`idle`, `blinking`, `waving`, `thinking`, `explaining`, `talking`, `happy`, `sleeping`), lifecycle management, random organic eye blinking (3.5s–6.0s), drag pause/resume optimization, and full `prefers-reduced-motion` compliance.
- **Stream-Triggered Speech Driver**: `TalkingAnimationDriver` lifecycle interface for event-driven mouth pacing on incoming tokens.
- **Developer Diagnostics**: Optional wireframe preview (`showDevRig`, disabled by default in production) for anchor and slot alignment calibration.
- **Licensing Clarity**: Open-source Apache-2.0 license covers the extension codebase, rig architecture, and animation engine; mascot character designs and vector assets represent original WebMate artwork.

**Next Steps**:
- Phase 2, Step 2: Interactive Gestures & Dynamic Pointing.
