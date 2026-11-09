# WebMate — System Requirements Specification

This document details the functional and non-functional requirements for the WebMate platform. All items are mapped to their respective delivery phases, explicitly marking which features are implemented versus planned.

---

## 1. Functional Requirements (FR)

### FR1: Floating Companion Display & Docking
- **FR1.1**: The extension shall inject a floating companion container into supported web pages without disrupting the host page's layout or styles. *(Implemented: Phase 1, Step 2)*
- **FR1.2**: The companion container must be draggable across the viewport edges and dock automatically to the closest margin. *(Planned: Phase 1, Step 3)*
- **FR1.3**: The companion must support minimize, collapse, and hide states. *(Planned: Phase 2)*

### FR2: Character States & Animation Engine
- **FR2.1**: The character shall support multiple distinct visual states: `idle`, `thinking`, `talking`, `pointing`, `happy`, and `confused`. *(Planned: Phase 2)*
- **FR2.2**: State transitions must animate smoothly at 60 FPS using CSS animations and GSAP without consuming excessive CPU. *(Planned: Phase 2)*
- **FR2.3**: The character eye/head orientation shall track the user's cursor or target element when inspection mode is active. *(Planned: Phase 2)*

### FR3: Webpage Content Extraction & Summarization
- **FR3.1**: When triggered by the user, the extension shall extract readable main content from the active tab while excluding ads, scripts, and navigational boilerplate. *(Planned: Phase 4)*
- **FR3.2**: The backend shall summarize the extracted text and stream a plain-language summary to the companion chat bubble. *(Planned: Phase 4)*

### FR4: Element Selection & Explanation (Inspector Mode)
- **FR4.1**: The user shall be able to activate an "Inspect Element" mode from the companion UI. *(Planned: Phase 4)*
- **FR4.2**: Hovering over elements on the host page shall display an overlay highlight bounding box. *(Planned: Phase 4)*
- **FR4.3**: Clicking an element shall freeze the selection, extract element metadata (tag, text, attributes, accessibility labels), and request an explanation from the AI backend. *(Planned: Phase 4)*

### FR5: Conversational AI Chat Interface
- **FR5.1**: The extension shall provide an expandable drawer interface containing a conversation history. *(Planned: Phase 3)*
- **FR5.2**: The user must be able to send follow-up questions regarding the active page or highlighted elements. *(Planned: Phase 3)*
- **FR5.3**: AI responses shall stream in real time via Server-Sent Events (SSE). *(Planned: Phase 3)*

### FR6: Guided Website Navigation
- **FR6.1**: The companion shall provide step-by-step guidance overlays directing the user to target elements on the page. *(Planned: Phase 5)*
- **FR6.2**: The guide shall advance when the user clicks or interacts with the highlighted target. *(Planned: Phase 5)*

---

## 2. Non-Functional Requirements (NFR)

### NFR1: Performance & Low Overhead
- **Memory Footprint**: The extension content script must consume less than 35MB of memory per tab.
- **Render Latency**: Character animation cycles must run on the compositor thread where possible, maintaining 60 FPS.
- **Host Non-Interference**: Script injection must not introduce page load delays exceeding 50ms.

### NFR2: Isolation & Encapsulation
- **Shadow DOM**: All companion UI, dialogs, styles, and character SVGs must be encapsulated within a closed or dedicated open Shadow DOM tree (`<webmate-root>`).
- **Style Bleed Prevention**: Global CSS styles from host websites (e.g. Bootstrap, Tailwind, custom resets) must not affect WebMate components, and WebMate styles must never bleed into the host page.

### NFR3: Security & Manifest V3 Compliance
- **Zero Remote Code**: Strictly adhere to Chrome Manifest V3 regulations. No dynamic script evaluation (`eval`, `new Function`) or loading unvetted remote scripts.
- **Content Security Policy (CSP)**: Strict CSP policy defined in extension manifests.
- **Backend Key Protection**: API keys for external LLMs (Gemini, Anthropic, OpenAI) must strictly remain on the backend server; no keys may ever exist in extension code.

### NFR4: Privacy & Data Protection
- **No Passive Tracking**: The extension must never capture user keystrokes, form entries, or background navigation passively. Data extraction is triggered strictly on explicit user action.
- **Sensitive Field Masking**: Password fields (`<input type="password">`), payment forms, and hidden security tokens must be stripped and excluded from any contextual payload.

### NFR5: Cross-Browser Portability
- **Engine Compatibility**: Built on WXT to support Chromium browsers (Chrome, Edge, Brave) with architectural compatibility for Mozilla Firefox.

---

## 3. Requirements Traceability Matrix

| Requirement ID | Description | Planned Phase | Current Status |
| :--- | :--- | :--- | :--- |
| **FR1.1** | Container & Shadow DOM Injection | Phase 1 | Implemented (Step 2) |
| **FR1.2** | Draggable Companion & Docking | Phase 1 | Planned (Step 3) |
| **FR1.3** | Minimize / Collapse States | Phase 2 | Planned |
| **FR2.1 - FR2.3** | Character Animation Engine | Phase 2 | Planned |
| **FR3.1 - FR3.2** | Webpage Summarization | Phase 4 | Planned |
| **FR4.1 - FR4.3** | Element Inspector & Explanation | Phase 4 | Planned |
| **FR5.1 - FR5.3** | Conversational AI Chat | Phase 3 | Planned |
| **FR6.1 - FR6.2** | Guided Navigation | Phase 5 | Planned |
| **NFR1 - NFR5** | Security, Privacy, Isolation Architecture | Continuous | Active (Shadow DOM Scoped) |
