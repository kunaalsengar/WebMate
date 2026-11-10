# @webmate/extension

The Chrome Extension client for WebMate, built with [WXT](https://wxt.dev/), React, TypeScript, Tailwind CSS, and Zustand.

## Overview

WebMate is designed to run as a Chrome Extension Manifest V3 companion. It injects an isolated UI container (`<webmate-root>`) into supported webpages via an open Shadow DOM tree, enabling companion UI rendering without style bleeding or layout disruption.

## Technology Stack

- **Framework**: WXT (Next-generation web extension framework)
- **UI Engine**: React 18
- **Styling**: Tailwind CSS 3.x
- **State Management**: Zustand
- **Animation Engine**: GSAP 3 & Layered SVG Rig
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
│   ├── character/                  # Character rig, animation engine & original SVG artwork
│   │   ├── CharacterRig.tsx        # Transparent SVG rig container (viewBox: 0 0 200 250)
│   │   ├── CharacterLayers.tsx     # Independent renderers for all 12 rig layer slots
│   │   ├── expressions.config.ts   # Configuration for 8 canonical facial expressions
│   │   ├── types.ts                # Rig render interfaces & asset registry contracts
│   │   ├── index.ts                # Character subsystem exports
│   │   ├── animation/              # GSAP controller, timelines, lifecycle & dynamic pointing
│   │   └── artwork/                # Original 12-layer mascot SVG artwork components & registry
│   └── content/
│       ├── mount.ts                # Modular Shadow DOM mounting & idempotency manager
│       ├── FloatingCompanion.tsx   # Draggable floating container, rig integration & runtime API
│       ├── CompanionPlaceholder.tsx # Minimal navy-and-white companion card
│       ├── useDraggable.ts         # Pointer events, pointer capture, rAF throttling hook
│       ├── docking.ts              # Viewport clamping and horizontal edge docking algorithms
│       ├── storage.ts              # Chrome Storage API (chrome.storage.local) persistence
│       └── store.ts                # Zustand runtime state store (position, docking, pointing)
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

## Current Status (Phase 2 – Steps 1A, 1B & 2A Completed)

WebMate's Chrome extension client features a 100% original, articulated mascot companion with Shadow DOM isolation, dragging/docking persistence, GSAP animation timelines, and dynamic 360° element pointing:
- **Shadow DOM UI Isolation & Draggable Companion**: Singleton `<webmate-root>` content script mount on HTTP/HTTPS pages, GPU-accelerated `translate3d` dragging (mouse, touch, pen), horizontal edge docking with viewport clamping, and `chrome.storage.local` position persistence.
- **Transparent 12-Layer SVG Rig**: `CharacterRig.tsx` renders in SVG coordinate space (`0 0 200 250`) across ground shadow, left/right legs, left/right arms, torso/body, head, blush, eyebrows, eyes, mouth, and emotional FX overlays without background cards behind the character.
- **Original Mascot Vector Artwork**: 100% original 2D vector artwork package (`apps/extension/src/character/artwork/`) adhering strictly to project IP and zero-copyright guidelines, with developer wireframe guides (`showDevRig`) disabled by default.
- **Expression Configurations**: Full typed configurations for 8 canonical expressions (`normal`, `happy`, `thinking`, `surprised`, `confused`, `explaining`, `talking`, `sleeping`).
- **GSAP Animation Subsystem**: Procedural GSAP timelines (`idle`, `blinking`, `waving`, `thinking`, `explaining`, `talking`, `happy`, `sleeping`), lifecycle management, random organic eye blinking (3.5s–6.0s), drag pause/resume optimization, event-driven `TalkingAnimationDriver` hooks, and full `prefers-reduced-motion` compliance.
- **Dynamic Character Pointing System (Step 2A)**: 360° viewport target resolution for `HTMLElement`s and `DOMRect`s (`pointingGeometry.ts`, `pointingMotion.ts`), true-pivot shoulder articulation, torso-coupled arm tracking, coordinated head/eye orientation, passive rAF-throttled scroll/resize updates, drag pause/recalibration, Zustand store controls (`pointingTarget`, `pointAt`, `stopPointing`), and isolated-world runtime API (`window.__WEBMATE__`).
- **Licensing Clarity**: Open-source Apache-2.0 license covers the extension codebase, rig architecture, and animation engine; mascot character designs and vector assets represent original WebMate artwork.

**Upcoming Features (Planned)**:
- Local character asset customization interface (Phase 2, Step 2B).
- Conversational AI chat drawer and backend SSE streaming integration (Phase 3).
- Element selection/explanation workflow and website/page analysis (Phase 4).
- Guided website navigation walkthroughs (Phase 5).
