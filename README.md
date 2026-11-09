# WebMate

> **Interactive AI-Powered Browser Companion**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Phase-0:_Project_Foundation-green.svg)](docs/DEVELOPMENT_ROADMAP.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Chrome Extension](https://img.shields.io/badge/Chrome_Extension-Manifest_V3-yellow.svg)](https://developer.chrome.com/docs/extensions/mv3/)

WebMate is a Chrome browser extension and companion backend that brings an animated cartoon character directly onto web pages to help users navigate, understand, and interact with complex web content in real time.

---

## Current Status: Phase 0 (Project Foundation)

This repository is currently in **Phase 0**. The foundational monorepo workspace, TypeScript baseline, configuration files, and architectural documentation are fully initialized.

Interactive features (character UI, animations, AI chat, and website analysis) are **planned for subsequent phases** and are not yet active in this build.

See [docs/DEVELOPMENT_ROADMAP.md](docs/DEVELOPMENT_ROADMAP.md) for the active schedule and delivery plan.

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

## Third-Party Intellectual Property & Trademark Disclaimer

The initial visual concept for WebMate is inspired by the character *Crayon Shin-chan*.

> **IMPORTANT LEGAL NOTICE**:
> 1. "Crayon Shin-chan" (クレヨンしんちゃん), character likenesses, and related names are the intellectual property and registered trademarks of Yoshito Usui, Futabasha Publishers Ltd., Shin-ei Animation, and TV Asahi Corporation.
> 2. This repository **does not include or distribute copyrighted character artwork**, sprite sheets, or proprietary media files.
> 3. The Apache 2.0 license applies solely to the software source code created for the WebMate project and does not convey or license any third-party intellectual property or commercial character rights.
> 4. For full details on asset handling and local customization, see [docs/CHARACTER_ASSETS.md](docs/CHARACTER_ASSETS.md).
