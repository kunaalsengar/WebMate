# @webmate/backend

The backend API gateway service for the WebMate ecosystem, built with Fastify, TypeScript, and Node.js.

## Purpose

The backend acts as a secure intermediary between the Chrome extension and external AI foundation models (Gemini, OpenAI, Anthropic). It protects API keys, manages rate limiting, handles context preparation, and streams responses to the browser extension.

## Tech Stack

- **Runtime**: Node.js (>= 20)
- **Framework**: Fastify 5.x
- **Language**: TypeScript 5.x
- **Development Server**: `tsx` (TypeScript Execute with file watching)

## Available Scripts

In the monorepo root:
- `pnpm dev:backend` — Starts the backend in watch mode at `http://127.0.0.1:4000`.
- `pnpm build:backend` — Compiles TypeScript into `dist/`.

Inside `apps/backend`:
- `pnpm dev` — Run local development server.
- `pnpm build` — Build output.
- `pnpm start` — Run compiled production server.

## Current Endpoints (Phase 0)

| Endpoint | Method | Status | Description |
| :--- | :--- | :--- | :--- |
| `/health` | GET | Implemented | Basic service health probe returning JSON status. |
| `/api/v1/chat` | POST | Planned (Phase 3) | Streamed conversational AI endpoint. |
| `/api/v1/analyze/page` | POST | Planned (Phase 4) | Webpage context summarization endpoint. |
| `/api/v1/analyze/element` | POST | Planned (Phase 4) | DOM element explanation endpoint. |

## Configuration

Server settings are configured via the root `.env` file (copied from `.env.example`).
