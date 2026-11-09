# Character Asset Architecture & Ingestion Guide

This directory defines the modular asset architecture, SVG fragment specifications, and licensing guidelines for the **WebMate Original Mascot** character rig in WebMate.

---

## 1. Intellectual Property & Licensing Architecture

> [!IMPORTANT]
> **Mascot Ownership & Open-Source Licensing Notice**:
> - **WebMate Original Mascot Artwork**: The character mascot is a **100% original creative design** created specifically for WebMate. All vector geometries, palettes (`apps/extension/src/character/artwork/palette.ts`), layer components (`ShadowArtwork` through `EffectsArtwork`), and character designs represent original WebMate artwork.
> - **Open-Source Software Engine (Apache-2.0)**: The software implementation, including the 12-layer character rig foundation (`CharacterRig.tsx`, `CharacterLayers.tsx`), anchor manifests, and GSAP procedural animation pipelines, is licensed under the Apache License, Version 2.0.
> - **Third-Party Intellectual Property Disclaimer**: WebMate is an independent project. The mascot is **NOT** Crayon Shin-chan (Shinnosuke Nohara) and does not contain, reproduce, or distribute copyrighted artwork, character likenesses, broadcast frames, or trademarks owned by Yoshito Usui, Futabasha Publishers Ltd., Shin-ei Animation Co., Ltd., or TV Asahi Corporation.
> - Developers must not commit, push, scrape, or distribute unauthorized third-party copyrighted artwork, commercial sprite sheets, or extracted broadcast frames into this public repository.

---

## 2. Directory Structure

```
apps/extension/assets/character/
├── manifests/
│   └── character.manifest.json       # Structural layer hierarchy, z-indices, and anchor coordinates
├── layers/                           # Base skeletal layers (ViewBox: 0 0 200 250)
│   └── README.md                     # Layer naming conventions and authoring guide
├── expressions/                      # Modular expression fragments (ViewBox: 0 0 200 250)
│   ├── README.md                     # Expression fragment mapping guide
│   ├── normal/                       # Normal expression slots
│   ├── happy/                        # Happy expression slots
│   ├── thinking/                     # Thinking expression slots
│   ├── surprised/                    # Surprised expression slots
│   ├── confused/                     # Confused expression slots
│   ├── explaining/                   # Explaining expression slots
│   ├── talking/                      # Stream-triggered talking mouth shapes
│   └── sleeping/                     # Sleeping closed eyes and FX slots
└── ingestion/
    └── README.md                     # Step-by-step local asset ingestion instructions
```

---

## 3. Technical Requirements for Artwork Ingestion

1. **Standard ViewBox**:
   All vector artwork components MUST use a unified SVG coordinate space:
   ```xml
   <svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
   ```
2. **Anchor Pivot Registration**:
   Layer pivots must align exactly with the coordinates declared in `manifests/character.manifest.json`:
   - `shadow`: `(100, 240)`
   - `torso`: `(100, 170)`
   - `leftHip`: `(88, 200)`
   - `rightHip`: `(112, 200)`
   - `head`: `(100, 115)`
   - `leftShoulder`: `(70, 135)`
   - `rightShoulder`: `(130, 135)`
   - `leftEyebrow`: `(85, 75)`
   - `rightEyebrow`: `(125, 75)`
   - `mouth`: `(105, 105)`
3. **Transparent Backgrounds**:
   All layer fragments must have transparent backgrounds (`fill="none"` on root SVG) to allow clean compositing without masking artifacts.
4. **Clean Vector Topology**:
   Use clean bezier paths without raster bitmaps, embedded base64 data, inline JavaScript, or external web font references.

