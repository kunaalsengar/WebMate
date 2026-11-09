# WebMate — Character Assets & Technical Specifications

This document governs the character asset architecture, expression taxonomy, animation state models, layered rig specifications, and intellectual property compliance requirements for WebMate.

---

## 1. Character Identity & Visual Persona

WebMate's interactive floating companion is modeled on the visual form and comedic expressiveness of **Crayon Shin-chan** (Shinnosuke Nohara):

- **Head & Silhouette**: Asymmetric potato-shaped head with rounded protruding cheeks and minimal nose definition.
- **Eyebrows & Gaze**: Thick, jet-black arched eyebrows that dynamically stretch, furrow, and slant; large eyes with white sclera and round black pupils.
- **Attire**: Red short-sleeved t-shirt, yellow shorts, white socks, and cyan/teal sneakers.
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

## 6. Intellectual Property & Licensing Safeguards

1. **Proprietary Character Rights**:
   - **"Crayon Shin-chan"** (クレヨンしんちゃん), character likenesses, and related names are the registered trademarks and copyrights of **Yoshito Usui**, **Futabasha Publishers Ltd.**, **Shin-ei Animation Co., Ltd.**, and **TV Asahi Corporation**.
2. **Zero-Copyright Repository Policy**:
   - No commercial artwork, copyrighted animation frames, extracted assets, or official imagery may be added or committed to this repository.
   - The `.gitignore` enforces exclusion of local proprietary asset drops (`assets/copyrighted/`, `*.psd`, `*.ai`).
3. **Code vs Asset Boundary**:
   - The WebMate source code is licensed under Apache 2.0.
   - The software provides an abstract component interface (`CharacterRig`) that consumes vector layer coordinates.
   - Users or developers wishing to load their own locally licensed or customized vector assets can inject them via the local ingestion pipeline without distributing copyrighted intellectual property.
