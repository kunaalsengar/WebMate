# Changelog

All notable changes to the WebMate project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2026-11-09 (Phase 0: Project Foundation)

### Added
- **Monorepo Architecture**:
  - Initialized pnpm monorepo workspace (`pnpm-workspace.yaml`) encompassing `apps/*` and `packages/*`.
  - Configured root `package.json` with unified workspace scripts (`dev:extension`, `dev:backend`, `build`).
  - Established shared TypeScript configurations (`tsconfig.base.json` and composite `tsconfig.json`).
  - Added `.gitignore` with strict rules preventing accidental staging of node modules, build artifacts, environment secrets, and copyrighted assets.
  - Added `.env.example` template with sanitized placeholders.

- **Shared Package (`packages/shared`)**:
  - Initialized `@webmate/shared` TypeScript package.
  - Defined character state taxonomy (`idle`, `thinking`, `talking`, `pointing`, `happy`, `confused`).
  - Defined extension IPC message envelopes and standardized API response formats.

- **Backend Application (`apps/backend`)**:
  - Scaffolded Fastify 5.x TypeScript backend service.
  - Implemented initial `GET /health` service probe endpoint.
  - Configured development server (`tsx watch`) and graceful shutdown signals.

- **Extension Application (`apps/extension`)**:
  - Configured WXT 0.19 web extension framework targeting Chrome Manifest V3.
  - Integrated React 18, Tailwind CSS, Zustand, and GSAP dependencies.
  - Implemented baseline Manifest V3 background service worker (`entrypoints/background.ts`).
  - Built initial toolbar action popup interface (`entrypoints/popup/`).

- **Visual Assets**:
  - Created `screenshots/` directory with conventions guidelines.

- **Documentation & Legal Suite**:
  - Authored comprehensive `README.md` and `CONTRIBUTING.md` guidelines.
  - Created `LICENSE` under Apache 2.0 with explicit third-party trademark and intellectual property disclaimers.
  - Published technical specifications:
    - `docs/PROJECT_OVERVIEW.md`
    - `docs/REQUIREMENTS.md`
    - `docs/ARCHITECTURE.md`
    - `docs/DEVELOPMENT_ROADMAP.md`
    - `docs/DAILY_PROGRESS.md`
    - `docs/INSTALLATION.md`
    - `docs/API_DOCUMENTATION.md`
    - `docs/CHARACTER_ASSETS.md`
    - `docs/SECURITY.md`
    - `docs/CHANGELOG.md`
