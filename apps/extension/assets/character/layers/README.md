# Character Skeletal Layers Specification

This directory is designated for the 12 base skeletal vector layers conforming to `manifests/character.manifest.json`.

---

## 1. Layer File Naming & Stacking Order

All SVG layers share the standard viewBox of `0 0 200 250`.

| File Name | Layer ID | Z-Index | Anchor Name | Anchor Coordinates | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `00-shadow.svg` | `layer-shadow` | 0 | `shadow` | `(100, 240)` | Ground contact shadow ellipse; scales with character jump/idle bob. |
| `01-leg-left.svg` | `layer-leg-left` | 5 | `leftHip` | `(88, 200)` | Background left leg, white ankle sock, and teal sneaker. |
| `02-arm-left.svg` | `layer-arm-left` | 10 | `leftShoulder` | `(70, 135)` | Background left arm and hand. |
| `03-leg-right.svg` | `layer-leg-right` | 15 | `rightHip` | `(112, 200)` | Foreground right leg, white ankle sock, and teal sneaker. |
| `04-body.svg` | `layer-body` | 20 | `torso` | `(100, 170)` | Torso with canonical red crew-neck shirt and yellow shorts. |
| `05-arm-right.svg` | `layer-arm-right` | 30 | `rightShoulder` | `(130, 135)` | Articulated foreground right arm for pointing and waving gestures. |
| `06-head.svg` | `layer-head` | 40 | `head` | `(100, 115)` | Iconic potato-shaped head contour and black buzz-cut hairline. |
| `07-blush.svg` | `layer-blush` | 45 | `head` | `(100, 115)` | Rosy cheek blush ellipses with dynamic alpha opacity. |
| `08-eyebrows.svg` | `layer-eyebrows` | 50 | `head` | `(100, 115)` | Base thick arched eyebrows. |
| `09-eyes.svg` | `layer-eyes` | 52 | `head` | `(100, 115)` | Large white sclera and round black pupils. |
| `10-mouth.svg` | `layer-mouth` | 55 | `mouth` | `(105, 105)` | Default mouth shape slot. |
| `11-fx.svg` | `layer-fx` | 60 | `head` | `(100, 115)` | Floating emotional FX (sparkles, sweat drop, Zzz). |

---

## 2. Artwork Ingestion Rule

Do NOT commit copyrighted artwork files. Local vector assets should be added by developers in their local worktrees only. When assets are omitted, `CharacterRig.tsx` renders safely with zero runtime errors.

