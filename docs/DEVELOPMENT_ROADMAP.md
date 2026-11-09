# WebMate — Development Roadmap

This roadmap defines the sequential phased delivery plan for the WebMate project. Each phase has strict entry and exit criteria to ensure maintainability, code quality, and security.

---

## Roadmap Overview

```
┌────────────────────────┐
│  Phase 0: Foundation   │ ◄─── COMPLETED
└───────────┬────────────┘
            │
┌───────────▼────────────┐
│ Phase 1: Core Ext & DOM│ ◄─── IN PROGRESS (Step 1 Completed)
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

### Phase 0: Project Foundation (Completed)
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

### Phase 1: Extension Core & Shadow DOM Scaffold (In Progress)
**Goal**: Establish the character asset architecture, in-page injection mechanism, and Shadow DOM runtime container.

- [x] **Step 1: Character Asset Architecture**:
  - [x] Technical architecture for integrating the Shinchan visual persona.
  - [x] Specifications for 8 expressions (Normal, Happy, Thinking, Surprised, Confused, Explaining, Talking, Sleeping).
  - [x] Technical requirements for 8 animation states and motion curves.
  - [x] Layered rig breakdown (Body, Head, Eyes, Eyelids, Mouth, Arms, FX) and justification over flat PNGs.
  - [x] Asset directory architecture and manifest schema.
  - [x] Third-party copyright protection guidelines.
- [x] **Step 2: Content Script & Shadow DOM Container Mount**:
  - [x] Implement WXT content script entrypoint targeting HTTP/HTTPS websites.
  - [x] Mount `<webmate-root>` custom element with open Shadow DOM (`attachShadow({ mode: 'open' })`).
  - [x] Inject scoped Tailwind CSS and CSS resets inside the shadow root without host page leaking.
  - [x] Render React 18 application inside `#webmate-app-root` with clean unmount lifecycle.
  - [x] Render minimal navy-and-white companion placeholder UI at bottom-right (24px margin, high z-index).
  - [x] Enforce singleton mounting idempotency and safe cleanup on extension invalidation.
- [x] **Step 3: Floating Container & Positioning State**:
  - [x] Implement Zustand extension state store (`useCompanionStore`) for positioning, active tab, visibility, and dockSide.
  - [x] Build draggable floating container component (`FloatingCompanion.tsx`) with GPU-accelerated `translate3d`.
  - [x] Implement pointer interaction supporting mouse, touch, and pen via Pointer Events with pointer capture.
  - [x] Implement drag threshold (4px), accidental text selection prevention, and touch scroll suppression (`touch-action: none`).
  - [x] Implement horizontal edge docking system (left/right snapping with 20px screen margin and clamped vertical position).
  - [x] Implement position persistence with `chrome.storage.local` with normalized vertical coordinates for responsive window height adjustments.
  - [x] Handle viewport resizing and context invalidation cleanup safely.

*Exit Gate*: Fully draggable and dockable companion container isolated inside Shadow DOM with persistence across page navigation.

---

### Phase 2: Character UI & Animation Engine (Planned)
**Goal**: Render a layered vector character with dynamic state transitions and dragging/docking physics.

- [ ] Create layered SVG character rig component (`CharacterRig.tsx`).
- [ ] Implement CSS keyframe and GSAP animation controller for character states (`idle`, `thinking`, `talking`, `pointing`, `happy`, `sleeping`).
- [ ] Implement token-stream viseme lip-sync driver for real-time speech.
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
