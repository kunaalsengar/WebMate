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
│   └── content/
│       ├── mount.ts                # Modular Shadow DOM mounting & idempotency manager
│       ├── FloatingCompanion.tsx   # Draggable floating container with docking transitions
│       ├── CompanionPlaceholder.tsx # Minimal navy-and-white companion placeholder
│       ├── useDraggable.ts         # Pointer events, pointer capture, rAF throttling hook
│       ├── docking.ts              # Viewport clamping and horizontal edge docking algorithms
│       ├── storage.ts              # Chrome Storage API (chrome.storage.local) persistence
│       └── store.ts                # Zustand runtime state store for positioning and docking
├── assets/
│   └── character/                  # Asset manifests, schemas, and ingestion guides
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

## Current Status (Phase 1, Step 3)

Phase 1, Step 3 implements the draggable floating companion and docking system:
- **Pointer Interaction**: Full support for mouse, touch, and pen via Pointer Events with pointer capture and drag threshold.
- **Viewport Docking**: Automatic left/right edge snapping with a 20px screen margin and clamped vertical position.
- **Position Persistence**: State restoration and persistence using `chrome.storage.local` with normalized vertical coordinates for responsive window resizing.
- **Performance**: GPU-accelerated `translate3d` positioning and `requestAnimationFrame` render throttling.
- **State Architecture**: Centralized Zustand extension store (`useCompanionStore`).

**Next Steps**:
- Phase 2: Articulated character vector rig, animation state engine, and lip-sync driver.
