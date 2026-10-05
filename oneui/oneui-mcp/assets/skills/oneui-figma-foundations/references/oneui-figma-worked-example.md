---
name: oneui-figma-worked-example
description: >-
  Worked OneUI colour-resolution example traced several levels deep with every value computed. Use to check a parent-step chain against a fully derived reference.
---

# OneUI cascade worked example

Part of the OneUI Figma foundations set. Invoke the orchestrator `the `oneui-figma-foundations` skill (get_skill "oneui-figma-foundations")` for the full workflow, or this skill when you only need this topic. Core rules live in `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-foundations-core.md")`.

# Worked example — one screen, every mode

A complete trace through a small tree, four levels deep. Every step and hex below was computed by
running the real resolution logic against the shipped colour data, not estimated. Use it to check
your understanding, or to check your own output against a known-good chain.

**Context**: brand `Jio`, theme `MyJio`, colour mode `light` → `rootStep = 2500`.
Scale anchors in play: `grey` base 200 / darkerBase 2500 · `indigo` base 600 / darkerBase 900 ·
`negative` base 1200 / darkerBase 1400.

## The tree

```
Page                    10 Colour mode = light · 15 Brand = Jio · 13.2 = MyJio
└─ Screen               surface default,  appearance —(neutral)
   └─ Card              surface minimal,  appearance —(inherits neutral)
      ├─ Title          content high
      ├─ StatusBadge    surface bold,     appearance negative
      │  ├─ Label       content high
      │  └─ Dot         surface bold,     appearance primary      ← the interesting one
      └─ Button         surface bold,     appearance primary
         ├─ StateLayer  fill = colour/interaction/stateLayer
         └─ Label       content high
```

## The chain

| Node | Parent's resolved step | `dir` | Token | Parent-step mode to write | Resolves to | Renders |
|---|---|---|---|---|---|---|
| Screen | — (root) | — | `default` | **2500** (`18`) | 2500 | `#ffffff` |
| Card | 2500 | −1 | `minimal` | **2500** (`18`) | 2400 | `#f5f5f6` |
| Title | 2400 | −1 | `high` | **2400** (`18`) | 200 @ 100% | `#0c0d10` |
| StatusBadge | 2400 | −1 | `bold` | **2400** (`18`) | 1200 | `#f50031` |
| Label | 1200 | −1 | `high` | **1200** (`17`) | 200 @ 100% | `#210102` |
| Dot | 1200 | — | `bold` | **2500** (`18`) ← *not 1200* | 600 | `#3900ad` |
| Button | 2400 | −1 | `bold` | **2400** (`18`) | 600 | `#3900ad` |
| Label | 600 | +1 | `high` | **600** (`17`) | 2500 @ 100% | `#ffffff` |
| StateLayer | 600 | −1 | — | **600** (`17`), Surface **cleared** | 200 @ 24/32% | `#0b0034` |

`18` = `18 Parent >1200` with `16 Parent range` = `2500-1300`.
`17` = `17 Parent ≤1200` with `16 Parent range` = `1200-100`.
Always write the range plus one step collection, and clear the other.

## Why each row is what it is

**Screen** — `default` ignores its parent entirely and resets to `rootStep`. At page root the two
coincide, but write it explicitly anyway: an inherited range would describe the page, and later
edits to the page would silently move the frame.

**Card** — parent (Screen) resolves to 2500. `grey[2500]` is `#ffffff`, which has contrast 1.09
against `grey[2500]` and 17.8 against `grey[200]`, so `dir = −1` and offsets walk **down**.
`minimal` = 2500 − 100 = **2400**.

**Title** — receives Card's resolved 2400. `content/high` takes the contrasting step, which at
`dir = −1` is 200. Near-black on near-white.

**StatusBadge** — `bold` anchors on the scale rather than walking. Its appearance is `negative`, so
the scale is `negative` (base 1200). Parent step 2400 ≥ 1300 → candidate = `base` = 1200. The
candidate is 12 steps from the parent, comfortably past the 7-step threshold, so it is used as-is.
**1200**.

Note the appearance changed from `neutral` to `negative` here and the bold-diff rule did **not**
fire — because the parent's appearance is `neutral`. Neutral is scaffolding, and a coloured `bold`
inside it is meant to be pulled by it.

**Badge Label** — parent step 1200. `negative[1200]` is `#f50031`, luminance 0.196: contrast 4.26
against the scale's 2500 and 4.60 against its 200. So `dir = −1` — by a margin of 0.34. This is a
genuinely near-tied case, and it is the reason not to eyeball direction from "is this colour light
or dark". Dark text on the red badge is what the system specifies.

**Dot — the bold-on-different-appearance case.** The Dot is `bold` with appearance `primary`
inside a parent whose appearance is `negative` — different, and not neutral. So the rule fires and
**`rootStep` (2500) is written as its parent-step mode instead of the parent's actual 1200.**

Follow both branches:

| | Parent-step written | Candidate | Outcome |
|---|---|---|---|
| **With the rule** | 2500 | 2500 ≥ 1300 → `base` = 600; 19 steps away, past the threshold | **600** = `#3900ad`, indigo's brand anchor |
| Without it | 1200 | 1200 < 1300 → `darkerBase` = 900; only 3 steps away, so the 700-walk runs: 1200 − 700 | **500** = `#2e008f`, a darker off-anchor indigo |

Both render as "a dark indigo dot", which is exactly why this is worth being careful about — it
does not look broken. It is simply not the brand colour, and it drifts further as nesting deepens.

The Dot's own children, if it had any, would receive **600** — its real resolved step. The rootStep
substitution applies only to the Dot's own parent-step mode; it does not propagate.

**Button** — also `bold` + `primary`, but its parent (Card) is `neutral`, so no rule. Parent step
2400 ≥ 1300 → `base` = 600, 18 steps away → **600**. It lands on the same colour as the Dot, by a
different route.

**Button Label** — parent step 600. `indigo[600]` is dark, so contrast against the scale's 2500 is
11.8 versus 1.67 against its 200: `dir = +1`, contrasting step **2500**, white text.

**StateLayer** — the one node that breaks the pattern:

- Its `03 Surface` mode is **cleared**, not set. It must inherit the Button's Surface mode so the
  chain picks the `bold` state-layer variant (24% hover / 32% pressed) rather than the standard
  16/24.
- Its parent-step modes **are** set explicitly, to the Button's resolved step (600). Inheriting
  them would pick up the Button's own parent-step modes, which describe the Card — one level off.
- Overlay colour = `600 + dir × 800` clamped to 200–2000, using the **parent's** `dir` (−1, taken
  at the Card's step) → 200 → `#0b0034`.

## What to write on the page

Page-level modes set the defaults everything else inherits:

```
10 Colour mode      = light
15 Brand            = Jio
13.1 Theme range    = A–M          (MyJio falls in the A–M half)
13.2 Theme (A–M)    = MyJio
14 Theme [Tira]     = cleared      (writing one brand's theme clears the other's)
16 Parent range     = 2500-1300
18 Parent >1200     = 2500
17 Parent ≤1200     = cleared
09 Platform, 11 Density, 12 Language = whatever the design targets
```

Setting `10 Colour mode` alone does **not** change any colour — it is a marker for handoff. The
page's parent-step modes are what actually make new root frames resolve light or dark, so the two
are always written together.

## Flipping to dark

Change `10 Colour mode` to `dark` and the page's parent-step to `17 Parent ≤1200 = 200`. Then
recascade: `rootStep` becomes 200, so Screen resolves to 200, Card's `dir` flips to +1 and
`minimal` becomes 300, and every `bold` switches from `base` to `darkerBase` as the parent steps
drop below 1300 — indigo's `bold` moves from 600 to 900.

Do not hand-patch individual nodes for a mode flip. Change the page and recascade the whole tree;
the chain is only correct as a whole.

> All steps and hex values computed from `packages/core/src/colours.ts` via the rules in
> `resolution-maths.md`.
