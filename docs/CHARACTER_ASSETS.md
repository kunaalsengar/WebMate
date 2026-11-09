# WebMate — Character Assets & Intellectual Property Guidelines

This document governs the character design specifications, animation state taxonomy, and strict intellectual property and trademark compliance requirements for WebMate.

---

## 1. Intellectual Property & Copyright Notice

### A. Third-Party Rights Notice
- **"Crayon Shin-chan"** (クレヨンしんちゃん), its character likenesses, specific visual attributes, and associated properties are the copyrighted work and registered trademarks of **Yoshito Usui**, **Futabasha Publishers Ltd.**, **Shin-ei Animation Co., Ltd.**, and **TV Asahi Corporation**.
- WebMate is an open-source educational and engineering development project.
- **Under no circumstances should copyrighted, commercial, or trademarked artwork, sprite sheets, or extracted video frames be committed, uploaded, or distributed within this repository.**

### B. Project Policy: Dual Asset Architecture
To honor intellectual property boundaries while maintaining flexibility for developers:

1. **Default Public Asset (Repository Safe)**:
   - The repository will feature an original, open-source 2D cartoon companion vector rig (an expressive cartoon avatar created under permissive license).
   - All public documentation, demos, and screenshots will feature this default asset.
2. **Local Custom Asset Support**:
   - The extension will provide a clean asset-swapping interface allowing developers to locally point to user-provided SVGs or sprite sheets stored only on their local machine.
   - Any local character asset directories are explicitly excluded in `.gitignore` (`assets/copyrighted/`, `*.psd`, `*.ai`).

---

## 2. Character SVG Layering Specification (Planned for Phase 2)

To enable fluid programmatic animation via GSAP and CSS transforms, character avatars must be structured as multi-layered, grouped SVG elements:

```
<svg id="webmate-character" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
  <!-- Layer 0: Shadow & Grounding Plane -->
  <g id="layer-ground-shadow" opacity="0.3"> ... </g>

  <!-- Layer 1: Body & Torso -->
  <g id="layer-body">
    <path id="body-torso" ... />
    <g id="body-limbs">
      <path id="arm-left" ... />
      <path id="arm-right" ... />
      <path id="leg-left" ... />
      <path id="leg-right" ... />
    </g>
  </g>

  <!-- Layer 2: Head & Hair -->
  <g id="layer-head">
    <path id="head-base" ... />
    <path id="hair" ... />

    <!-- Facial Features Subgroup -->
    <g id="face-features">
      <g id="eyebrows">
        <path id="eyebrow-left" ... />
        <path id="eyebrow-right" ... />
      </g>
      <g id="eyes">
        <ellipse id="eye-left-sclera" ... />
        <circle id="eye-left-pupil" ... />
        <ellipse id="eye-right-sclera" ... />
        <circle id="eye-right-pupil" ... />
      </g>
      <path id="mouth" ... />
      <circle id="blush-left" ... />
      <circle id="blush-right" ... />
    </g>
  </g>

  <!-- Layer 3: Interactive Overlays & Props -->
  <g id="layer-accessories" display="none">
    <path id="magnifying-glass" ... />
    <path id="pointing-glove" ... />
  </g>
</svg>
```

---

## 3. Animation State Taxonomy

The character animation controller will manage transitions across the following discrete states:

| State | Visual Behavior | Trigger Event |
| :--- | :--- | :--- |
| `idle` | Gentle breathing bounce, periodic eye blinks every 3-5 seconds. | Default state when no user action is occurring. |
| `thinking` | Head tilted, eyebrows furrowed upward, eyes looking toward top-right, subtle question mark float. | Backend LLM request sent, waiting for first token. |
| `talking` | Dynamic mouth shape cycling (lip-sync oscillation) timed to incoming SSE tokens. | Streaming response active in chat bubble. |
| `pointing` | One arm extended pointing directly toward the bounding box of a inspected element. | "Inspect Element" mode or guided tour step. |
| `happy` | Wide eyes, curved mouth, bouncing hop, celebratory particle sparkle. | User completes an action or accepts an explanation. |
| `confused` | Head tilted sideways, asymmetric eyebrows, sweat droplet graphic. | Error returned by backend or element not found. |

---

## 4. Performance Requirements

1. **Vector Efficiency**: Individual character SVG definitions must remain below 50KB in total size.
2. **GPU Acceleration**: Animations must leverage CSS transforms (`translate3d`, `rotate`, `scale`) and opacity to run on the compositor thread.
3. **Shadow DOM Encapsulation**: SVG defs, gradients, and clip-paths must be scoped inside the Shadow DOM to avoid ID collisions with host webpage SVGs.
