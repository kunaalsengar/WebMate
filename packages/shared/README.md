# @webmate/shared

This package contains shared TypeScript types, interfaces, validation schemas, and constants used across both the Chrome extension (`@webmate/extension`) and the backend service (`@webmate/backend`).

## Contents

- **State Taxonomy**: Definitions for character states (`idle`, `thinking`, `talking`, `pointing`, etc.).
- **Message Envelopes**: Typed definitions for Chrome runtime messaging and IPC.
- **API Contracts**: Standard request and response formats for future backend communication.

## Usage

This package is internal to the WebMate monorepo and is referenced as a workspace dependency:

```json
{
  "dependencies": {
    "@webmate/shared": "workspace:*"
  }
}
```

## Current Status (Phase 0)

Only type definitions and contract schemas are defined. Concrete business logic, validation libraries (e.g. Zod), and runtime serialization will be introduced in subsequent phases as backend and extension endpoints are implemented.
