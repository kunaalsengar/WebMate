# WebMate — Development Roadmap

This roadmap defines the sequential phased delivery plan for the WebMate project. Each phase has strict entry and exit criteria to ensure maintainability, code quality, and security.

---

## Roadmap Overview

```
┌────────────────────────┐
│  Phase 0: Foundation   │ ◄─── CURRENT STATUS (Completed)
└───────────┬────────────┘
            │
┌───────────▼────────────┐
│ Phase 1: Core Ext & DOM│ ◄─── Next Phase
└───────────┬────────────┘
            │
┌───────────▼────────────┐
│ Phase 2: Character UI  │
└───────────┬────────────┘
            │
┌───────────▼────────────┐
│  Phase 3: AI Gateway   │
└───────────┬────────────┘
            │
┌───────────▼────────────┐
│Phase 4: Page Inspector │
└───────────┬────────────┘
            │
┌───────────▼────────────┐
│ Phase 5: Guided Nav    │
└────────────────────────┘
```

---

## Phase Breakdown

### Phase 0: Project Foundation (Current Milestone)
**Goal**: Establish a scalable monorepo structure, build configurations, security guidelines, and architectural blueprints.

- [x] Configure pnpm workspace (`apps/extension`, `apps/backend`, `packages/shared`).
- [x] Root TypeScript base configuration and project references.
- [x] Clean `.gitignore` and `.env.example`.
- [x] Extension shell with WXT, React, TypeScript, Tailwind CSS, and Zustand.
- [x] Backend shell with Fastify, TypeScript, and basic `/health` endpoint.
- [x] Shared data contracts in `@webmate/shared`.
- [x] Comprehensive documentation suite and licensing notices.
- [x] Zero-secrets and third-party copyright policy enforcement.

*Exit Gate*: Foundation verified, zero lint/build errors, approved initial commit.

---

### Phase 1: Extension Core & Shadow DOM Scaffold (Planned)
**Goal**: Establish the in-page injection mechanism and Shadow DOM runtime container.

- [ ] Implement WXT content script entrypoint.
- [ ] Mount `<div id="webmate-root">` with an encapsulated Shadow DOM tree.
- [ ] Inject scoped Tailwind CSS styles into the shadow root without host page leaking.
- [ ] Implement Zustand extension state store (visibility, active tab, dock position).
- [ ] Establish two-way messaging between Content Script and Background Service Worker.

*Exit Gate*: Clean, unstyled container rendered inside Shadow DOM on test pages with zero style collision.

---

### Phase 2: Character UI & Animation Engine (Planned)
**Goal**: Render a layered vector character with dynamic state transitions and dragging/docking physics.

- [ ] Create open-source layered SVG character rig (Head, Eyes, Eyebrows, Mouth, Body).
- [ ] Implement CSS keyframe and GSAP animation controller for character states (`idle`, `thinking`, `talking`, `pointing`, `happy`).
- [ ] Add draggable container physics with viewport edge snapping and docking.
- [ ] Implement collapse/minimize states with smooth spring transitions.
- [ ] Provide character asset customization interface for local asset substitution.

*Exit Gate*: 60 FPS animation loop in docked and floating states with responsive drag-and-drop.

---

### Phase 3: Backend API & AI Gateway (Planned)
**Goal**: Build the secure AI gateway with streaming responses and session management.

- [ ] Configure Fastify CORS, rate limiting, and security headers.
- [ ] Implement LLM provider adapters (Google Gemini API, OpenAI).
- [ ] Create `POST /api/v1/chat` endpoint with Server-Sent Events (SSE) token streaming.
- [ ] Implement client-side SSE consumer inside extension background worker.
- [ ] Build conversation history UI drawer inside the extension Shadow DOM.

*Exit Gate*: End-to-end streamed chat between extension drawer and backend mock/live LLM.

---

### Phase 4: Page Understanding & Element Inspector (Planned)
**Goal**: Contextual page awareness and interactive element-level inspection.

- [ ] Content extraction module (cleaning readability text, headings, meta descriptions).
- [ ] Visual inspect overlay mode with element highlight bounding box.
- [ ] Element metadata extractor (DOM tag, attributes, semantic accessibility roles).
- [ ] Contextual summarization prompt engineering (`POST /api/v1/analyze/page`).
- [ ] Element explanation prompt engineering (`POST /api/v1/analyze/element`).

*Exit Gate*: Clicking any webpage button or paragraph highlights the element and prompts the companion to explain its purpose.

---

### Phase 5: Guided Navigation, Polish & Distribution (Planned)
**Goal**: Multi-step guided tours, accessibility audit, performance optimization, and store distribution packaging.

- [ ] Interactive step-by-step navigation guides with callout arrows.
- [ ] Sound effects / audio cues toggle (optional playful audio feedback).
- [ ] Performance profiling: ensure <35MB per-tab memory consumption.
- [ ] Chrome Web Store manifest audit and packaging automation (`wxt zip`).
- [ ] Production deployment scripts for Fastify backend.

*Exit Gate*: Public release candidate published to Chrome Web Store.
