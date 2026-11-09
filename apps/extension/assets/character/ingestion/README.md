# Character Asset Ingestion Guidelines

This directory provides developer instructions and schema validation specifications for integrating character assets into WebMate.

---

## 1. Intellectual Property & Mascot Licensing Architecture

- **WebMate Original Mascot**: The character mascot is a **100% original creative design** created specifically for WebMate. All vector geometries, palettes, layer components, and character designs represent original WebMate artwork.
- **Third-Party Intellectual Property Disclaimer**: WebMate is an independent project. The mascot is **NOT** Crayon Shin-chan (Shinnosuke Nohara) and does not contain, reproduce, or distribute copyrighted artwork, character likenesses, broadcast frames, or trademarks owned by Yoshito Usui, Futabasha Publishers Ltd., Shin-ei Animation Co., Ltd., or TV Asahi Corporation.
- WebMate software is an open-source development project licensed under the Apache License, Version 2.0.
- **Do not commit, upload, or distribute third-party copyrighted character artwork, extracted video frames, or commercial sprite sheets to this public repository.**
- Local asset paths (`assets/copyrighted/`, `*.psd`, `*.ai`) are strictly excluded in `.gitignore`.

---

## 2. Local Asset Integration Workflow

Developers who wish to locally test with custom or licensed vector assets can populate their local environment following the manifest specification:

1. **Manifest File**: Consult `../manifests/character.manifest.json` for layer IDs, z-index ordering, and anchor point coordinates.
2. **ViewBox Format**: All layer SVG components must share the standard viewBox of `0 0 200 250`.
3. **Layer File Naming**:
   - `00-shadow.svg`
   - `01-arm-left.svg`
   - `02-body-torso.svg`
   - `03-arm-right.svg`
   - `04-head-base.svg`
   - `05-hair.svg`
4. **Expression Fragments**:
   - Save modular feature SVGs in the respective expression subfolder (e.g., `expressions/happy/mouth.svg`, `expressions/thinking/eyebrows.svg`).
5. **Runtime Generation**: In Phase 2, the asset build pipeline will compile conforming vector fragments into the React `CharacterRig` component inside the extension's Shadow DOM.
