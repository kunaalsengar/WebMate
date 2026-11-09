# WebMate — Security & Privacy Architecture

This document outlines the security architecture, threat models, privacy safeguards, and vulnerability disclosure policies for WebMate.

---

## 1. Core Security Principles

1. **Defense in Depth**: Isolation at the browser DOM level, extension background level, and backend network level.
2. **Zero Client Secrets**: No API keys, tokens, or private credentials are ever packaged or distributed with the Chrome Extension.
3. **Explicit User Intent**: No background or passive scraping of user data; analysis only occurs upon direct user interaction.
4. **Data Minimization & Sanitization**: Sensitive input fields (passwords, credit cards, auth tokens) are stripped before transmission to AI models.

---

## 2. Threat Modeling & Mitigations

### Threat 1: Malicious Host Webpage Attempts to Hijack Extension UI
- **Risk**: A hostile webpage scripts into the extension DOM to read AI responses, trigger unauthorized requests, or steal user sessions.
- **Mitigation**:
  - WebMate UI is encapsulated within a **Shadow DOM** boundary.
  - Injected components stop event propagation where appropriate.
  - The extension communicates with its background script via authenticated Chrome extension runtime messaging (`chrome.runtime.sendMessage`), which is inaccessible to host page scripts.

### Threat 2: Host Webpage CSS Corrupts Companion Interface
- **Risk**: Host page stylesheet overrides companion buttons, colors, or positioning (CSS bleeding).
- **Mitigation**:
  - Shadow DOM ensures styles inside the shadow root do not bleed out, and host page class selectors cannot pierce into the shadow root.
  - Base resets (`all: initial`) are applied at the root container to shield against inherited text and box-sizing properties.

### Threat 3: Exposing LLM Provider Credentials
- **Risk**: Extracting Gemini or OpenAI API keys from client extension bundles.
- **Mitigation**:
  - The Chrome extension never communicates directly with LLM provider endpoints.
  - All AI traffic is proxied through the `@webmate/backend` service.
  - Backend environment variables (`.env`) hold API keys securely on the server.

### Threat 4: Leaking Sensitive User Data (PII, Passwords, Tokens)
- **Risk**: Page context extractor captures password fields or credit card numbers.
- **Mitigation**:
  - The DOM extractor explicitly filters out:
    - `<input type="password">`
    - `<input autocomplete="cc-number">`, `<input autocomplete="cc-cvc">`
    - Elements with attributes matching `*csrf*`, `*token*`, `*session*`, or `*secret*`.
    - Content within elements marked `aria-hidden="true"` or `display: none`.

---

## 3. Chrome Manifest V3 Compliance

WebMate adheres strictly to the security standards required by Google Chrome Manifest V3:

- **No Remote Code Execution**: No code is fetched dynamically over the internet to be evaluated (`eval()`, `new Function()`, or dynamic `<script>` injection from remote CDNs is prohibited).
- **Content Security Policy (CSP)**: The extension manifest enforces:
  ```json
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
  ```
- **Permission Minimization**: The extension requests only the minimum necessary Chrome permissions:
  - `activeTab`: Access only to the currently focused tab when the user invokes WebMate.
  - `storage`: Storing user preferences (character position, theme) locally.
  - `scripting`: Injecting content scripts on supported URL patterns.

---

## 4. Vulnerability Disclosure Policy

If you discover a security vulnerability within WebMate, please do **NOT** open a public GitHub issue.

Instead, report the issue responsibly:
1. Email your findings to: `security@webmate-project.local` (or designated maintainer email).
2. Include a detailed description, reproduction steps, and proof-of-concept.
3. Allow the maintainers reasonable time to review, patch, and release a fix before public disclosure.
