# WebMate

> **Interactive AI-Powered Browser Companion**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Phase_2-Step_2A_Completed-green.svg)](docs/DEVELOPMENT_ROADMAP.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Chrome Extension](https://img.shields.io/badge/Chrome_Extension-Manifest_V3-yellow.svg)](https://developer.chrome.com/docs/extensions/mv3/)

WebMate is a Chrome browser extension and companion backend that brings an animated cartoon character directly onto web pages to help users navigate, understand, and interact with complex web content in real time.

---

## Current Status: Phase 2 – Character & Interaction Foundation

WebMate is currently under active development.

**Completed milestones:**
- Phase 0: Project Foundation
- Phase 1: Content Script Injection, Shadow DOM Isolation & Draggable Companion
- Phase 2 – Step 1A: Original Cartoon Character Rig & Artwork
- Phase 2 – Step 1B: Character Animation System
- Phase 2 – Step 2A: Dynamic Character Pointing System

**Currently implemented:**
- Floating cartoon companion on supported websites.
- Shadow DOM-based UI isolation.
- Draggable companion with edge docking and position persistence.
- Original layered SVG character artwork.
- GSAP-powered character animations.
- Dynamic pointing toward webpage elements.
- Reduced-motion accessibility support.

**Upcoming features:**
- Element selection and explanation workflow.
- Website and page analysis.
- Conversational AI chat.
- Guided website navigation.

See [docs/DEVELOPMENT_ROADMAP.md](docs/DEVELOPMENT_ROADMAP.md) for development progress and upcoming milestones.

---

## Planned Core Features

When fully implemented across subsequent phases, WebMate will provide:

- **Floating Interactive Companion**: An animated cartoon character rendered seamlessly on supported websites via an isolated Shadow DOM.
- **Website & Page Explanations**: Contextual summaries explaining complex pages, technical documentation, or online workflows in simple terms.
- **Element Inspector & Explanation**: Click-to-inspect mode where the companion highlights specific webpage elements, buttons, or charts and explains their functionality.
- **Conversational AI Chat**: A slide-out chat interface to ask questions about the active page with streamed responses.
- **Guided Website Navigation**: Step-by-step interactive walkthroughs pointing out where to click and what to do next.

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Extension Client** | [WXT](https://wxt.dev/), React 18, TypeScript, Tailwind CSS, Zustand, GSAP |
| **Backend Gateway** | Node.js (>= 20), Fastify 5.x, TypeScript, tsx |
| **Shared Contracts** | TypeScript interfaces (`@webmate/shared`) |
| **Monorepo Tooling** | pnpm Workspaces |
| **Browser Target** | Chrome Manifest V3 (with cross-browser support via WXT) |

---

## Repository Structure

```
WebMate/
├── apps/
│   ├── extension/              # Chrome extension client (WXT + React)
│   └── backend/                # Fastify backend API gateway & LLM proxy
├── packages/
│   └── shared/                 # Shared TypeScript types and IPC contracts
├── docs/                       # Project architecture, roadmaps & specifications
│   ├── ARCHITECTURE.md
│   ├── REQUIREMENTS.md
│   ├── DEVELOPMENT_ROADMAP.md
│   ├── INSTALLATION.md
│   ├── API_DOCUMENTATION.md
│   ├── CHARACTER_ASSETS.md
│   ├── SECURITY.md
│   ├── DAILY_PROGRESS.md
│   └── CHANGELOG.md
├── screenshots/                # Visual milestones and documentation captures
├── pnpm-workspace.yaml         # Monorepo workspace configuration
├── package.json                # Root project metadata & workspace scripts
├── tsconfig.base.json          # Shared TypeScript compiler options
├── tsconfig.json               # Root TypeScript project references
├── .env.example                # Environment variable template
├── .gitignore                  # Git exclusions & secret filtering
├── LICENSE                     # Apache 2.0 license & trademark notices
├── CONTRIBUTING.md             # Contribution guidelines & branching model
└── README.md
```

---

## Quick Start & Installation

Detailed instructions can be found in [docs/INSTALLATION.md](docs/INSTALLATION.md).

### Prerequisites
- Node.js (version 20 or higher)
- pnpm (version 9 or higher)
- Google Chrome or Chromium-based browser

### Setup
```bash
# 1. Clone repository
git clone https://github.com/<your-username>/WebMate.git
cd WebMate

# 2. Install workspace dependencies
pnpm install

# 3. Create local environment configuration
cp .env.example .env
```

### Running in Development
```bash
# Start backend service (Fastify)
pnpm dev:backend

# Start extension in development mode (WXT)
pnpm dev:extension
```

To load into Chrome: Navigate to `chrome://extensions/`, enable **Developer mode**, click **Load unpacked**, and select `apps/extension/.output/chrome-mv3`.

---

## Branching & Release Model

- `main`: **Stable production branch**. Only release-ready code is merged here.
- `develop`: **Primary integration branch**. All feature and fix branches target `develop`.
- Features are developed in topic branches (`feat/<name>`) and merged via Pull Requests.

See [CONTRIBUTING.md](CONTRIBUTING.md) for full contribution guidelines.

---

## Intellectual Property, Mascot Artwork & Licensing

WebMate features a **100% original mascot companion** designed specifically for this project:

> **LEGAL & LICENSING NOTICE**:
> 1. **Open-Source Code (Apache-2.0)**: The WebMate source code, including the extension harness, 12-layer SVG character rig, procedural GSAP animation controllers, viewport docking engine, and Shadow DOM mounting container, is licensed under the **Apache License, Version 2.0**.
> 2. **Original Mascot Artwork**: The character mascot is a completely original 2D vector creation. Character designs, vector assets (`apps/extension/src/character/artwork/`), and visual palettes represent original WebMate artwork.
> 3. **Third-Party Rights Disclaimer**: WebMate is an independent open-source project. The mascot is **NOT** Crayon Shin-chan (Shinnosuke Nohara) and does not contain, reproduce, or distribute copyrighted artwork, character likenesses, broadcast frames, or trademarks owned by Yoshito Usui, Futabasha Publishers Ltd., Shin-ei Animation Co., Ltd., or TV Asahi Corporation.
> 4. For full technical details on asset architecture, vector layers, and local customization, see [docs/CHARACTER_ASSETS.md](docs/CHARACTER_ASSETS.md).
