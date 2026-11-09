# Contributing to WebMate

Thank you for your interest in contributing to WebMate! We welcome community contributions, bug reports, and discussions.

To keep the development workflow smooth, secure, and respectful of third-party intellectual property, please adhere to the following guidelines.

---

## 1. Branching Strategy

We follow a GitFlow-inspired branching strategy:

- `main`: **Production / Stable Branch**. Contains tested, release-ready code. Commits are never pushed directly to `main`.
- `develop`: **Active Integration Branch**. All feature and bugfix branches are merged into `develop` via Pull Requests.
- Feature branches: Created from `develop` using the format `feat/<feature-name>`.
- Fix branches: Created from `develop` using the format `fix/<bug-name>`.
- Documentation branches: Created from `develop` using the format `docs/<topic>`.

```
main       ───────────────────────────● (v0.1.0 Release)
                 \                   /
develop   ────────●─────●─────●─────● (Integration)
                   \   /       \   /
feature             ●─●         ●─● (Feature branches)
```

---

## 2. Contribution Workflow

1. **Fork the Repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/WebMate.git
   cd WebMate
   ```
3. **Checkout the `develop` branch**:
   ```bash
   git checkout develop
   ```
4. **Create a topic branch**:
   ```bash
   git checkout -b feat/my-new-feature
   ```
5. **Install dependencies**:
   ```bash
   pnpm install
   ```
6. **Make changes** according to the coding standards below.
7. **Commit using Conventional Commits**:
   ```bash
   git commit -m "feat(extension): add shadow dom root injector"
   ```
8. **Push to your fork** and open a **Pull Request targeting `develop`**.

---

## 3. Strict Rules & Policies

### A. Zero Secrets Policy
- **NEVER** commit real API keys, tokens, session cookies, passwords, or personal credentials.
- All secrets must reside exclusively in `.env` (which is ignored by Git).
- Use `.env.example` to document required configuration variables using dummy placeholders.

### B. Copyright & Third-Party Asset Policy
- **DO NOT UPLOAD COPYRIGHTED ARTWORK**: Never commit commercial or copyrighted image assets, sprite sheets, or SVG extractions (including Crayon Shin-chan assets) to this repository.
- WebMate code is licensed under Apache 2.0, but third-party intellectual property is NOT owned by or licensed through this repository.
- Contributions containing unlicensed proprietary art will be rejected immediately.

### C. Scope Enforcement
- Check the current active phase in [DEVELOPMENT_ROADMAP.md](docs/DEVELOPMENT_ROADMAP.md) before submitting features. Work targeting future phases should be coordinated via an Issue first.

---

## 4. Coding Standards

- **TypeScript**: Strict mode is enabled (`strict: true`). Avoid using `any`; prefer typed interfaces and generics.
- **Code Clarity**: Write clean, readable code with straightforward abstractions. Add comments only where complex logic genuinely warrants explanation.
- **Formatting**: Adhere to existing code conventions (2-space indentation, consistent quotes and semicolons).
- **Chrome Extension Guidelines**:
  - Always conform to Chrome Manifest V3 guidelines.
  - Injected components must reside inside a Shadow DOM to prevent style conflicts with host webpages.
  - Never use `eval()` or dynamically load unvetted remote scripts.

---

## 5. Commit Message Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` A new feature or capability.
- `fix:` A bug fix.
- `docs:` Documentation-only changes.
- `chore:` Maintenance tasks, dependency bumps, or workspace configuration.
- `refactor:` Code restructuring that does not change external behavior.
- `test:` Adding or updating tests.

Example:
```
feat(shared): define element inspection data contracts
```
