# WebMate — System Architecture

This document describes the architectural design of WebMate, covering the Chrome extension client, the articulated character animation subsystem, backend gateway, Shadow DOM isolation model, inter-process communication (IPC), and security perimeters.

---

## 1. System Architecture Diagram

```mermaid
flowchart TD
    subgraph Browser["Google Chrome Browser"]
        subgraph HostPage["Host Webpage Context"]
            DOM["Host DOM Tree"]
            HostCSS["Host Page Styles"]
        end

        subgraph ExtensionContext["WebMate Extension (Manifest V3)"]
            CS["Content Script Runner"]
            ShadowHost["<div id='webmate-root'>"]

            subgraph ShadowRoot["Shadow DOM Boundary"]
                UI["React App Tree (Zustand Store)"]
                Char["Character Animation Rig (GSAP/CSS)"]
                Chat["Chat Drawer & Inspector Overlay"]
                TailwindScoped["Scoped Tailwind CSS"]
            end

            BG["Background Service Worker"]
        end
    end

    subgraph BackendGateway["WebMate Backend Service"]
        Fastify["Fastify 5 Server (Node.js)"]
        Sanitizer["Context Sanitizer & Tokenizer"]
        StreamEngine["SSE Streaming Engine"]
    end

    subgraph AIProviders["External AI Services"]
        Gemini["Google Gemini API"]
        OpenAI["OpenAI API"]
    end

    DOM -.->|User Triggers Inspection| CS
    CS -->|Mounts Shadow DOM| ShadowHost
    ShadowHost --- ShadowRoot
    UI -->|Internal Event Bus| BG
    BG -->|HTTPS / SSE Request| Fastify
    Fastify --> Sanitizer
    Sanitizer --> StreamEngine
    StreamEngine -->|Secure HTTPS Proxy| AIProviders
    AIProviders -->|Raw Tokens| StreamEngine
    StreamEngine -->|SSE Stream| BG
    BG -->|chrome.runtime Messaging| UI
```

---

## 2. Chrome Extension Architecture (`@webmate/extension`)

The extension follows the Chrome Manifest V3 execution model, split into three decoupled tiers:

### A. Background Service Worker (`entrypoints/background.ts`)
- **Role**: Event-driven background orchestrator.
- **Responsibilities**:
  - Responds to extension installation, updates, and icon clicks.
  - Acts as a secure HTTP client to communicate with the `@webmate/backend` service.
  - Manages cross-tab state, persistent extension settings in `chrome.storage.local`.
  - Dispatches messages to active content scripts.

### B. Content Script & Shadow DOM Injection
- **Role**: Injected bridge living within the webpage context.
- **Responsibilities**:
  - Injects a custom container element (`#webmate-host`) into the host page `document.body`.
  - Attaches a **Shadow DOM** (`shadowRoot = host.attachShadow({ mode: 'open' })`).
  - Renders the React root into the Shadow DOM.
  - Listens to host page mouse events exclusively when "Inspect Element" mode is activated.

### C. Extension Action Popup (`entrypoints/popup/`)
- **Role**: Quick toolbar interface.
- **Responsibilities**:
  - Displays extension status, global on/off toggle, and link to options.
  - Summarizes current session activity and backend connectivity.

---

## 3. Shadow DOM Isolation Strategy

Injecting custom UI into arbitrary third-party websites presents significant styling and DOM conflict risks:
1. Host CSS rules (e.g. `* { box-sizing: border-box; font-family: ... }` or resets) can corrupt companion elements.
2. Companion CSS rules could inadvertently alter host page layout and typography.
3. Host page JavaScript could traverse and manipulate extension DOM nodes.

```
+-------------------------------------------------------+
| Host Webpage Document Body                            |
|                                                       |
|   <div class="header">...</div>                       |
|   <main class="content">...</div>                     |
|                                                       |
|   <div id="webmate-host">                             |
|     #shadow-root (open)                               |
|       +---------------------------------------------+ |
|       | <style> /* Scoped WebMate CSS */ </style>   | |
|       | <div class="webmate-container">             | |
|       |   <svg id="character-rig">...</svg>         | |
|       |   <div class="chat-drawer">...</div>        | |
|       | </div>                                      | |
|       +---------------------------------------------+ |
|   </div>                                              |
+-------------------------------------------------------+
```

### Isolation Rules:
- All extension markup lives inside `#shadow-root`.
- Tailwind CSS styles are compiled and injected directly inside the shadow root via `<style>` tag insertion or `adoptedStyleSheets`.
- Events generated inside the Shadow DOM (clicks on chat input, character drag events) stop propagation to host DOM listeners where appropriate to prevent triggering host website interactions.

---

## 4. Character Animation Subsystem (Planned Architecture)

> [!NOTE]
> **Implementation Status**: The articulated character rig, animation controller, dynamic pointing system, and mouth animation driver described below represent the **planned architectural design** scheduled for implementation in Phase 2. No character renderer or animation engine currently exists in the codebase.

In the planned Phase 2 implementation, the character companion will be rendered as an articulated, multi-layer vector rig rather than a static raster image. This architectural design enables independent limb movement, dynamic 360° pointing to arbitrary DOM elements, and text-stream-triggered mouth animation paced to incoming AI text tokens.

```mermaid
flowchart LR
    subgraph StateManagement["Zustand Store"]
        CS[characterState: idle | thinking | talking | pointing | ...]
        CE[characterExpression: normal | happy | confused | ...]
        TP[targetPointer: x, y coordinates]
    end

    subgraph Controller["Animation Controller (Planned)"]
        AC[GSAP Timeline Engine + CSS Keyframes]
        MD[Mouth Animation Driver / Token Stream Consumer]
    end

    subgraph Rig["Shadow DOM CharacterRig (Planned)"]
        L6[Layer 6: FX Overlays]
        L5[Layer 5: Face & Mouth Layers]
        L4[Layer 4: Head & Hair]
        L3[Layer 3: Articulated Pointing Arm]
        L2[Layer 2: Torso & Legs]
        L1[Layer 1: Support Arm]
        L0[Layer 0: Ground Shadow]
    end

    CS --> AC
    CE --> AC
    TP --> AC
    MD -->|Mouth Shape| L5
    AC -->|Rotations & Offsets| L3
    AC -->|Tilt & Nod| L4
    AC -->|Bob & Squash| L2
    AC -->|Scale| L0
    AC -->|Particles| L6
```

### Planned Component Architecture:
- **`CharacterContainer`** *(Planned)*: Will handle viewport positioning, dragging physics, edge snapping, and docking states.
- **`AnimationController`** *(Planned)*: Will subscribe to the extension Zustand store and orchestrate GSAP transitions between states (`idle`, `thinking`, `explaining`, etc.).
- **`CharacterRig`** *(Planned)*: Will assemble the hierarchical SVG groups (`#layer-shadow`, `#layer-body`, `#layer-head`, `#layer-features`) with rotational pivots.
- **`MouthAnimationDriver`** *(Planned)*: Will alternate mouth shapes (`mouth-closed`, `mouth-half`, `mouth-open`) keyed directly to incoming SSE text tokens from `@webmate/backend` to provide visual speaking pacing without re-rendering the full character rig. Note: True phoneme-level lip-sync is outside current scope and would require an audio/speech alignment engine.

---

## 5. Backend Gateway Architecture (`@webmate/backend`)

The backend is a Node.js microservice built with **Fastify**:

```mermaid
sequenceDiagram
    participant Ext as Extension (Shadow DOM)
    participant BG as Background Worker
    participant BE as Fastify Backend
    participant LLM as AI Foundation Model

    Ext->>BG: USER_PROMPT + Page Context
    BG->>BE: POST /api/v1/chat (JSON + Session Token)
    Note over BE: Rate Limit Check & Context Sanitization
    BE->>LLM: Formatted Prompt (System + User Context)
    LLM-->>BE: Stream Chunk
    BE-->>BG: SSE Event (text/event-stream)
    BG-->>Ext: STREAM_TOKEN
    Ext->>Ext: Update Character Talking State & UI
```

### Key Responsibilities:
- **API Key Secrecy**: External AI credentials never leave the backend environment.
- **Prompt Guardrails & Sanitization**: Strips HTML tags, script nodes, and masked credentials before sending prompts to the LLM.
- **Streaming Response Gateway**: Implements Server-Sent Events (SSE) so responses stream token-by-token directly to the extension.
- **Rate Limiting**: Protects downstream LLM endpoints from abuse via IP and session throttling.

---

## 6. Security & Isolation Boundaries

| Boundary | Enforcement Mechanism |
| :--- | :--- |
| **Host DOM vs Extension UI** | Shadow DOM (`attachShadow({ mode: 'open' })`) + CSS scoping |
| **Extension vs Network** | Strict Manifest V3 Content Security Policy (no remote scripts) |
| **Extension vs AI API Keys** | Proxy through `@webmate/backend`; extension holds zero credentials |
| **User Privacy vs Context** | User-triggered context ingestion only; automatic password stripping |
