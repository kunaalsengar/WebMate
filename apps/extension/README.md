# @webmate/extension

The Chrome Extension client for WebMate, built with [WXT](https://wxt.dev/), React, TypeScript, Tailwind CSS, and Zustand.

## Overview

WebMate is designed to run as a Chrome Extension Manifest V3 companion. In later phases, it injects a floating cartoon character into supported webpages via an isolated Shadow DOM container, enabling website explanations, element-level inspection, and interactive AI assistance.

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
│   ├── background.ts       # Manifest V3 Background Service Worker
│   └── popup/              # Action popup UI
│       ├── index.html
│       ├── main.tsx
│       ├── App.tsx
│       └── style.css
├── package.json
├── tsconfig.json
├── wxt.config.ts           # WXT configuration & manifest definition
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
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

## Current Status (Phase 0)

Phase 0 establishes the directory structure, configuration files, and baseline entrypoints. Floating character UI, animation drivers, website content scraping, and element inspection will be developed in subsequent phases according to the project roadmap.
