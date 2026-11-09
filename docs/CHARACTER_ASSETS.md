# WebMate — Character Assets & Technical Specifications

This document governs the character asset architecture, expression taxonomy, animation state models, layered rig specifications, and intellectual property compliance requirements for WebMate.

---

## 1. Character Identity & Visual Persona

WebMate's interactive floating companion is an original cartoon boy mascot embodying charm, playful curiosity, and comedic expressiveness:

- **Head & Silhouette**: Rounded anime chibi head contour with cute side-swept dark hair and subtle specular sheen.
- **Eyebrows & Gaze**: Thick, expressive cartoon eyebrows that dynamically stretch, furrow, and slant; large eyes with white sclera, pupils, and dual specular catchlights.
- **Attire**: Red-orange short-sleeved t-shirt with gold-and-white chest lightning emblem, warm mustard yellow shorts, white athletic socks, and cyan/teal speed-striped sneakers.
- **Behavioral Archetype**: Playful, lively, friendly, and cheeky. It provides reassurance, comic relief, and clear interactive focus during web navigation.

---

## 2. Character Expressions Specification

WebMate defines 8 distinct facial expressions corresponding to companion interaction states:

| Expression | Visual Composition | Trigger & Context |
| :--- | :--- | :--- |
| **Normal** | Natural curved eyebrows, centered pupils, characteristic small upward smile smirk. | Default idle browsing state; attentive companion. |
| **Happy** | Arched high eyebrows, curved crescent eyes (`^ ^`) or sparkle reflection stars, wide open grin with pink tongue, blushing cheek dots. | Task completion, page summarization complete, positive user feedback. |
| **Thinking** | Left eyebrow raised high, right eyebrow furrowed downward, eyes glancing up-right, small wavy mouth line, hand under chin. | LLM processing, DOM content extraction, parsing page semantics. |
| **Surprised** | Eyebrows raised past hairline, contracted small pupils surrounded by wide white sclera, vertical oval mouth (`O`). | Unhandled error, broken link, dramatic layout shift. |
| **Confused** | Asymmetric wavy eyebrows, head tilted 15°, mouth shifted laterally, blue sweat drop on temple. | Ambiguous user prompt, target element not located in DOM. |
| **Explaining** | Focused inward-slanted eyebrows, direct forward gaze, open speaking mouth, hand extended outward in directional gesture. | Delivering element explanations, active tutorial walkthrough. |
| **Talking** | Dynamic mouth shape cycling (closed, half, open) timed to text streaming; eyes maintaining natural blinking cadence; eyebrows gently pulsing to emphasis. | Real-time text streaming from backend AI gateway. |
| **Sleeping** | Flat closed eye slits (`- -`), slightly open relaxed mouth, cyclic expanding/bursting snot bubble, floating `Zzz` particles. | User inactivity exceeding 5 minutes. |

> [!NOTE]
> **Expression vs. Behavioral States**: While listed above for visual presets, `Talking` (stream-triggered mouth oscillation) and `Sleeping` (slumped posture with snot bubble and `Zzz` FX) are composite **behavioral/display states** combining facial posture with active animation loops and particle overlays, rather than strictly static facial expressions.

---

## 3. Animation State Models & Engine

The animation pipeline combines **procedural skeletal transforms** (driven by GSAP and CSS `@keyframes`) with **modular SVG layer swaps**.

### Technical Requirements by Animation State:

1. **Idle Animation**:
   - **Method**: CSS `@keyframes` on compositor thread.
   - **Components**: Continuous sinusoidal vertical bob (4px, 2.2s period) synchronized with ground shadow contraction (`scaleX(0.95)` at apex).
2. **Eye Blinking**:
   - **Method**: SVG procedural transform.
   - **Components**: Quick squash of `#layer-eyes` (`scaleY(0.1)` on center pivot) for 120ms, opening over 80ms, occurring at random 3.5s–6.0s intervals.
3. **Greeting / Waving**:
   - **Method**: GSAP timeline.
   - **Components**: Right arm articulates to 45° from shoulder, forearm/hand cycles 3 lateral oscillations (±15° around wrist), subtle head nod.
4. **Thinking**:
   - **Method**: GSAP timeline + particle drift.
   - **Components**: Right arm rotates to touch chin; head tilts 8°; animated vector question mark drifts upward with alpha decay.
5. **Explaining**:
   - **Method**: Dynamic vector coordinate pointing.
   - **Components**: Right arm rotates toward target DOM element's viewport bounding box $(x, y)$; head turns toward target coordinate.
6. **Talking**:
   - **Method**: Text-stream-triggered mouth animation.
   - **Components**: Cycles mouth paths (`mouth-closed`, `mouth-half`, `mouth-open`) keyed to Server-Sent Event (SSE) text tokens.
   - **Audio Synchronization Note**: Paces mouth shape cycling to incoming text token bursts to convey speaking activity. This is distinct from true phoneme-level lip-sync, which would require an audio synthesis engine with phoneme timestamp alignment.
7. **Happy Reaction**:
   - **Method**: GSAP spring bounce (`bounce.out`).
   - **Components**: Character jumps 16px vertically; cheek blush opacity increases to 0.9; particle stars burst outward.
8. **Sleeping**:
   - **Method**: Low-frequency breathing cycle + particle loop.
   - **Components**: Torso sags 6px; head droops 8°; vector snot bubble expands from scale 0.2 to 1.0 before popping; floating `Zzz` letters drift up.

---

## 4. Layered Asset Requirements

### Why Flat PNG Assets Are Prohibited

Relying on pre-rendered, flattened raster PNGs fails essential technical criteria:

1. **Asset Combinatorics & Memory**:
   Multiplying 8 expressions by 8 poses, multiple arm angles, and visemes would require over 250 high-resolution PNG frames (>50MB bundle size), severely bloating extension package size and tab memory.
2. **Loss of Articulation & Dynamic Pointing**:
   WebMate points to arbitrary elements across dynamic viewports. Rotating an arm toward dynamic coordinates $(x, y)$ is trivial with an articulated vector layer, but impossible with a flattened PNG without repainting the entire figure.
3. **Responsive Display Scalability**:
   Vector SVGs remain pin-sharp at any pixel density (1x, 2x Retina, 4K displays) with a provisional optimization target of under 80KB total asset weight (subject to empirical measurement once assets are authored).
4. **Stream-Triggered Mouth Animation**:
   Layered mouths permit swapping only the mouth path within the facial group, avoiding full DOM repaints during fast LLM text streaming. True phoneme lip-sync would require dedicated audio/speech analysis, whereas the current scope focuses on stream-triggered visual pacing.

### Rig Z-Index Hierarchy & Pivot Points

```
Z-Index Layer Hierarchy (ViewBox 0 0 200 250):
  Layer 6: Overlays & FX (Zzz, Sweat Drop, Snot Bubble, Sparkles)
  Layer 5: Facial Features
           ├── 5d: Mouth (Anchor: 105, 105 - Swappable mouth shape geometries)
           ├── 5c: Eyes & Eyelids (Anchor: 85, 85 / 125, 85)
           ├── 5b: Eyebrows (Anchor: 85, 75 / 125, 75)
           └── 5a: Blush Cheeks (Anchor: 75, 95 / 135, 95)
  Layer 4: Head Contour & Hair (Pivot: 100, 115)
  Layer 3: Foreground Arm (Right) (Pivot: 130, 135)
  Layer 2: Torso, Shorts & Legs (Anchor: 100, 170)
  Layer 1: Background Arm (Left) (Pivot: 70, 135)
  Layer 0: Ground Drop Shadow (Anchor: 100, 240)
```

---

## 5. Asset Directory Architecture

The asset storage architecture within `apps/extension` enforces clear separation between manifests, source templates, modular expression fragments, motion curves, and ingestion validators:

```
apps/extension/
└── assets/
    └── character/
        ├── manifests/
        │   └── character.manifest.json    # Layer topology, anchor coordinates, bounding boxes
        ├── source/                        # Vector template blueprints
        │   ├── template-rig.svg
        │   └── layers/
        │       ├── 00-shadow.svg
        │       ├── 01-arm-left.svg
        │       ├── 02-body-torso.svg
        │       ├── 03-arm-right.svg
        │       ├── 04-head-base.svg
        │       └── 05-hair.svg
        ├── expressions/                   # Modular facial feature fragments
        │   ├── normal/
        │   ├── happy/
        │   ├── thinking/
        │   ├── surprised/
        │   ├── confused/
        │   ├── explaining/
        │   ├── talking/
        │   └── sleeping/
        ├── animations/                    # Motion curves & timing definitions
        │   ├── idle.motion.json
        │   ├── blink.motion.json
        │   ├── wave.motion.json
        │   ├── think.motion.json
        │   ├── explain.motion.json
        │   ├── talk.motion.json
        │   ├── happy.motion.json
        │   └── sleep.motion.json
        ├── sprites/                       # FX particle atlases (if raster FX are used)
        │   ├── fx-particles.png
        │   └── fx-particles.json
        ├── runtime/                       # Final assembled React SVG components
        │   └── CharacterRig.tsx
        └── ingestion/                     # Local asset validation & injection scripts
            ├── README.md
            └── validate-asset.js
```

---

## 6. Intellectual Property, Artwork Ownership & Licensing Architecture

1. **Software Engine Licensing (Apache-2.0)**:
   - The WebMate source code, including the 12-layer character rig, layer renderers, docking physics, Chrome storage persistence, Shadow DOM mounting, and GSAP procedural animation pipelines, is licensed under the open-source **Apache License, Version 2.0**.
2. **WebMate Original Mascot Artwork**:
   - The companion mascot is a **100% original creative design** created specifically for WebMate. All vector geometries, palettes (`apps/extension/src/character/artwork/palette.ts`), layer components (`ShadowArtwork` through `EffectsArtwork`), and character designs represent original WebMate artwork.
3. **Third-Party Intellectual Property Disclaimer**:
   - WebMate is an independent project. The mascot is **NOT** Crayon Shin-chan (Shinnosuke Nohara) and does not utilize, reproduce, or distribute copyrighted artwork, character likenesses, broadcast frames, or trademarks owned by Yoshito Usui, Futabasha Publishers Ltd., Shin-ei Animation Co., Ltd., or TV Asahi Corporation.
4. **Decoupled Architecture & Extensibility**:
   - The software provides an abstract component interface (`CharacterRig`) that consumes vector layer coordinates (`CharacterAssetRegistry`). Users or developers wishing to inject custom vector layers can do so via the local ingestion pipeline without distributing copyrighted intellectual property.

---

## 7. Implementation Status (Phase 2, Steps 1A & 1B Completed)

- **Implemented Architecture**:
  - `apps/extension/src/character/CharacterRig.tsx`: Transparent vector rig container supporting configurable scale, expression, and animation-state props.
  - `apps/extension/src/character/CharacterLayers.tsx`: Independent layer components for all 12 slots (shadow, left/right legs, body, left/right arms, head, blush, eyebrows, eyes, mouth, fx).
  - `apps/extension/src/character/expressions.config.ts`: Type-safe configuration for all 8 expressions (normal, happy, thinking, surprised, confused, explaining, talking, sleeping).
  - `apps/extension/assets/character/`: Complete asset directory architecture with slot specifications and manifest (`webmate-mascot-standard`).
  - **Composite Component Geometry**: Single source of truth in `@webmate/shared` establishes the 200×250 viewBox rendered at `0.65` scale (`130×163px`) stacked directly above the `232×68px` card, defining a unified `232×231px` composite (`COMPANION_WIDTH = 232`, `COMPANION_HEIGHT = 231`) for all viewport boundary clamping, relative restoration, and edge docking calculations in `docking.ts`.
  - **Small-Viewport Safety**: Viewport clamping and docking calculations in `docking.ts` explicitly handle constrained viewports where physical screen dimensions are smaller than composite companion dimensions (`viewportWidth < COMPANION_WIDTH` snaps `x = 0`; `viewportHeight < COMPANION_HEIGHT` snaps `y = 0`), preventing negative coordinates, eliminating division by zero in relative vertical calculation, and preserving 20px screen margins whenever space allows.
- **Original Artwork Status**:
  - 100% original WebMate vector mascot artwork integrated across all 12 layers (`apps/extension/src/character/artwork/`).
  - Developer wireframe guides disabled by default (`showDevRig: false`) for clean production display, with full diagnostic anchor crosshairs retained for on-demand calibration.

---

## 8. Character Animation Engine Implementation (Phase 2, Step 1B)

- **Modular Animation Architecture (`apps/extension/src/character/animation/`)**:
  - `types.ts`: Type contracts for animatable layer elements (`CharacterRigLayerElements`), anchor dictionaries (`RigAnchors`), animation build context (`AnimationBuildContext`), and the event-driven `TalkingAnimationDriver` interface.
  - `motionUtils.ts`: Anchor pivot application (`applyLayerAnchorPivots`), layer transform resets (`resetLayerTransforms`), element querying (`resolveRigElements`), standard cartoon easings (`MOTION_EASINGS`), and `isPrefersReducedMotion` accessibility detection.
  - `definitions.ts`: Procedural GSAP timeline builders for all 8 canonical states (`idle`, `blinking`, `waving`, `thinking`, `explaining`, `talking`, `happy`, `sleeping`) articulating layers around manifest pivots (`viewBox 0 0 200 250`).
  - `lifecycle.ts`: `AnimationLifecycleManager` handling GSAP context scoping, state transition interruption, duplicate timeline suppression, non-destructive secondary overlays, and complete unmount cleanup.
  - `controller.ts`: `CharacterAnimationController` and `useCharacterAnimation` hook coordinating primary state playback, random organic eye blinking intervals (3.5s–6.0s), dragging pause/resume optimization, and speech token mouth pacing.
- **Talking Animation Interface**:
  - Implements `pushSpeechToken(token?)`, `startSpeaking()`, `stopSpeaking()`, and `isSpeaking()`.
  - Paces mouth shape oscillation (`scaleY`, `scaleX`) to incoming text stream token bursts rather than phoneme lip-sync.
  - Decoupled from the primary talking timeline (which drives conversational head and eyebrow rhythm) so the speech driver has exclusive control over mouth scale properties without tween competition.
- **Missing Artwork Graceful Handling**:
  - The animation engine animates SVG layer groups (`#layer-head`, `#layer-arm-right`, etc.) around manifest anchors. When asset slots are unpopulated, the rig continues to animate invisibly in production with zero errors, or visibly with pivot anchor crosshairs in developer rig mode (`showDevRig: true`).
  - Ready for seamless drop-in when authorized character assets are injected.

---

## 9. Original Mascot Vector Artwork Integration (Phase 2, Step 1B)

- **Original Character Persona**:
  - Playful, mischievous, expressive, and friendly cartoon boy mascot.
  - Distinctive dark messy side-swept hair with specular sheen, large expressive anime eyes with dual catchlights, thick tapered cartoon eyebrows, cute button nose, vibrant red-orange top with gold/white lightning emblem, contrasting warm mustard yellow shorts, white athletic ankle socks, and cyan/teal speed-striped sneakers.
  - Completely original vector illustration adhering to the project's zero-copyright policy without copying third-party copyrighted character proportions or artwork.
- **Modular 12-Layer Artwork Package (`apps/extension/src/character/artwork/`)**:
  - `palette.ts`: Shared visual design tokens (skin tones, apparel colors, stroke weights, highlight/shadow values).
  - `ShadowArtwork.tsx` (`layer-shadow`): Soft outer and inner core ground contact shadow ellipse around `(100, 240)`.
  - `LegLeftArtwork.tsx` (`layer-leg-left`): Background left leg, white sock, and cyan sneaker articulating from `leftHip` `(88, 200)`.
  - `ArmLeftArtwork.tsx` (`layer-arm-left`): Background left arm, red-orange sleeve cuff, and stylized hand articulating from `leftShoulder` `(70, 135)`.
  - `LegRightArtwork.tsx` (`layer-leg-right`): Foreground right leg, white sock, and cyan sneaker articulating from `rightHip` `(112, 200)`.
  - `BodyArtwork.tsx` (`layer-body`): Torso with red-orange crewneck t-shirt, chest lightning emblem, and mustard yellow shorts articulating from `torso` `(100, 170)`.
  - `ArmRightArtwork.tsx` (`layer-arm-right`): Articulated foreground right arm for waving, pointing, and thinking articulating from `rightShoulder` `(130, 135)`.
  - `HeadArtwork.tsx` (`layer-head`): Anime chibi face contour, neck with under-chin shadow, ears with inner helix detailing, button nose, and side-swept messy dark hair articulating from `head` `(100, 115)`.
  - `BlushArtwork.tsx` (`layer-blush`): Rosy coral-pink cheek glow ellipses with cute anime diagonal accent strokes.
  - `EyebrowsArtwork.tsx` (`layer-eyebrows`): Two thick cartoon eyebrows responding to all 8 expressions (relaxed, joyful arches, furrowed/contemplative, high surprise, asymmetric confused, focused explaining, and sleepy droop).
  - `EyesArtwork.tsx` (`layer-eyes`): Large expressive eyes with white sclera, pupils, catchlights, smiling crescents (`^ ^`), glancing pupils, shock dots, and sleepy eye slits (`- -`) with procedural GSAP blink squash.
  - `MouthArtwork.tsx` (`layer-mouth`): Expression-responsive mouth geometries (playful smirk, open grin with teeth and tongue, pursed thoughtful, vertical surprise "O", and articulate speaking mouth) supporting `TalkingAnimationDriver` organic token scaling around `(105, 105)`.
  - `EffectsArtwork.tsx` (`layer-fx`): Emotional FX overlays (sparkle stars for happy, indigo question mark for thinking, temple sweat drops for surprised/confused, and drifting "Zzz" letters with snot bubble for sleeping).
  - `registry.tsx`: `characterArtworkRegistry` mapping all 12 layer IDs to their respective artwork components and dynamic renderers.
- **Layer-to-Anchor Calibration & Diagnostics**:
  - `showDevRig` mode displays both the 2D vector artwork and the developer anchor crosshairs simultaneously for visual inspection.
  - Each layer is calibrated to articulate cleanly with GSAP timelines without disconnected limbs or facial features.
  - Developer wireframe guides are disabled by default (`showDevRig: false`) for normal production usage, keeping the original mascot illustration clean while retaining diagnostic guides for future debugging on demand.
