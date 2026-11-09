# Character Expression Fragments Specification

This directory organizes swappable vector fragments for the 8 canonical WebMate companion expressions.

---

## 1. Expression Subdirectories

Each subfolder corresponds to a `CharacterExpression` preset:

- `normal/`: Natural relaxed eyebrows, centered eyes, small smirk.
- `happy/`: Arched eyebrows, smiling crescent eyes (`^ ^`), wide open grin with tongue.
- `thinking/`: Asymmetric furrowed eyebrows, glance up-right eyes, pursed wavy mouth.
- `surprised/`: High eyebrows past hairline, contracted small pupils, vertical oval `O` mouth.
- `confused/`: Wavy asymmetrical eyebrows, lateral wavy mouth, blue sweat drop.
- `explaining/`: Focused inward-slanted eyebrows, direct forward gaze, speaking mouth gesture.
- `talking/`: Mouth shapes for stream-triggered text oscillation (`mouth_closed.svg`, `mouth_half.svg`, `mouth_open.svg`).
- `sleeping/`: Closed eye slits (`- -`), relaxed droop mouth, snot bubble and Zzz FX.

---

## 2. Standard Fragment Naming Inside Each Expression Folder

- `eyebrows.svg`: Eyebrow geometry for this expression.
- `eyes.svg`: Eye/pupil geometry for this expression.
- `mouth.svg`: Mouth contour for this expression.
- `fx.svg`: Optional emotional particle overlay (if applicable).

All fragments share the standard viewBox of `0 0 200 250` and transparent backgrounds.

