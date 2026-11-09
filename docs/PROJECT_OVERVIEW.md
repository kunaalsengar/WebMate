# WebMate — Project Overview

## 1. Executive Summary

**WebMate** is an interactive, AI-driven Chrome browser companion. It bridges the gap between static web content and human comprehension by placing an animated, conversational cartoon companion directly onto web pages.

Rather than requiring users to copy-paste text into external chatbot windows or decipher complex documentation alone, WebMate operates directly within the browser context: pointing to relevant UI elements, offering digestible summaries, and guiding users step-by-step through complex workflows.

---

## 2. Problem Statement

Modern websites, dashboards, and documentation are frequently:
- **Overwhelming & Dense**: Complex portals (AWS console, tax forms, developer documentation, financial dashboards) present high cognitive load.
- **Disconnected from Context**: Traditional AI tools require constant context-switching (opening a separate ChatGPT or Claude window, copying DOM content, and manually providing screenshots).
- **Impersonal & Static**: Users lack interactive, friendly assistance when exploring unfamiliar domains or learning new web applications.

WebMate solves this by embedding an interactive, context-aware companion natively in the webpage experience without interfering with the underlying website's operation.

---

## 3. Product Vision & Companion Persona

### The Companion Concept
- **Visual Appearance**: A cheerful, stylized 2D cartoon boy mascot rendered via scalable vector graphics (SVG) that rests docked at the viewport edge. Features a red-orange top with lightning emblem, warm mustard yellow shorts, messy dark side-swept hair, and expressive anime eyes.
- **Original Mascot Persona**: Lively, curious, playful, and expressive. The companion reacts to webpage events, "looks" at elements when asked, thinks with visual animations, and celebrates when the user completes a task.
- **Tone of Voice**: Friendly, approachable, playful, yet direct and helpful. It avoids dense academic jargon unless specifically requested.

> [!NOTE]
> WebMate features a 100% original mascot design and vector artwork package. The codebase is licensed under Apache-2.0, providing an open-source, decoupled 12-layer SVG character rig and procedural GSAP animation subsystem (see [docs/CHARACTER_ASSETS.md](CHARACTER_ASSETS.md)).

---

## 4. Key Target Use Cases

| Use Case | Description |
| :--- | :--- |
| **Technical Documentation Navigation** | Explaining unfamiliar API parameters, code snippets, or architecture diagrams on developer portals. |
| **Enterprise Tool Onboarding** | Guiding employees through multi-step forms in HR software, CRMs, or cloud infrastructure consoles. |
| **Form & Workflow Assistance** | Assisting everyday users in filling out government, banking, or travel booking forms with field-by-field tips. |
| **Language & Vocabulary Simplification** | Translating or simplifying legal terms of service, dense articles, or medical portals into accessible everyday language. |

---

## 5. System Scope & Boundaries

```
┌────────────────────────────────────────────────────────┐
│                   Chrome Browser                       │
│                                                        │
│  ┌─────────────────────────┐   ┌────────────────────┐  │
│  │ Host Webpage DOM        │   │ WebMate Extension  │  │
│  │                         │   │ (Shadow DOM)       │  │
│  │  [Button]  [Table]      │◄──┼─ Inspect & Point   │  │
│  └─────────────────────────┘   └─────────┬──────────┘  │
│                                          │ IPC         │
│                                ┌─────────▼──────────┐  │
│                                │ Background Worker  │  │
│                                └─────────┬──────────┘  │
└──────────────────────────────────────────┼─────────────┘
                                           │ HTTPS / SSE
                                 ┌─────────▼──────────┐
                                 │ Fastify Backend    │
                                 └─────────┬──────────┘
                                           │ Secure API
                                 ┌─────────▼──────────┐
                                 │ LLM Providers      │
                                 │ (Gemini / OpenAI)  │
                                 └────────────────────┘
```

- **In-Browser Extension (`@webmate/extension`)**: Responsible for non-destructive DOM rendering (via Shadow DOM), element event capture, visual character animations, and local UI state.
- **Backend Service (`@webmate/backend`)**: Responsible for API key security, rate limiting, sanitizing page contexts, prompt engineering, and streaming LLM responses.
- **External AI Providers**: Foundation models (e.g. Google Gemini, Anthropic Claude, OpenAI) that provide context reasoning and natural language synthesis.

---

## 6. Implementation Status (Phase 0)

| Area | Current Status (Phase 0) | Upcoming (Phase 1+) |
| :--- | :--- | :--- |
| **Monorepo & Tooling** | Completed | Continuous evolution |
| **Extension Shell & Config**| Completed | Content script injection (Phase 1) |
| **Shadow DOM Container** | Not Implemented | Phase 1 milestone |
| **Character Graphics & Rig**| Not Implemented | Phase 2 milestone |
| **Backend AI Gateway** | Stub / Health Probe only | Phase 3 milestone |
| **DOM Element Inspector** | Not Implemented | Phase 4 milestone |
| **Guided Tour Engine** | Not Implemented | Phase 5 milestone |
