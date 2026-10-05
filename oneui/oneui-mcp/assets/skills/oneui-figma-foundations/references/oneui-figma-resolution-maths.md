---
name: oneui-figma-resolution-maths
description: >-
  How OneUI colours resolve through parent-step and scale maths, including direction crossover. Use to predict or debug a specific resolved colour.
---

# OneUI resolution maths

Part of the OneUI Figma foundations set. Invoke the orchestrator `the `oneui-figma-foundations` skill (get_skill "oneui-figma-foundations")` for the full workflow, or this skill when you only need this topic. Core rules live in `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-foundations-core.md")`.

# Resolution maths

What each token resolves to, given a parent step. You need this to **predict** a colour, to
**debug** one that looks wrong, or to compute the parent-step chain by hand. If you are applying
foundations in a live file, prefer `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-cascade.md")` — it reads resolution out of
Figma instead of re-deriving it, so it cannot disagree with the shipped library.

Every rule below is a port of `packages/core/src/surfaceLogic.ts`, which is what the tokenator
uses to bake the library's values. Where this file and the library disagree, the library is right
and this file is stale — say so rather than working around it.

## The two inputs everything depends on

**Step scale.** 25 steps, `100` (darkest) → `2500` (lightest), in increments of 100. Displayed
reversed (2500 on the left).

**Direction (`dir`).** Which way a token walks from its parent.

```
dir = wcagContrast(parentColour, scale[2500]) >= wcagContrast(parentColour, scale[200]) ? 1 : -1
```

- `dir === 1` → the contrasting colour is light → offsets go **up** toward 2500.
- `dir === -1` → the contrasting colour is dark → offsets go **down** toward 100.

`parentColour` is the parent step's colour **in the node's own scale** — so `dir` depends on the
appearance, not just the step number.

> There is a `step >= 1300 ? -1 : 1` shortcut in `packages/figma-migrate/src/cascade.ts`. Do not
> use it here. It is a migration-time approximation; the tokenator bakes the real WCAG comparison,
> and the two disagree on scales whose lightness crossover isn't at 1300. Using the shortcut
> produces answers that look plausible and render wrong.

**Contrast formula** (WCAG 2.x relative luminance, sRGB): linearise each channel
(`v <= 0.03928 ? v/12.92 : ((v+0.055)/1.055)^2.4`), then `L = 0.2126R + 0.7152G + 0.0722B`, then
`(Llighter + 0.05) / (Ldarker + 0.05)`.

### Direction without the colours

You do not need a scale's 25 colours to get `dir`. Lightness rises monotonically with step in
every shipped scale, so each one has a single crossover: below it `dir` is `+1`, from it onward
`dir` is `-1`. Verified across all 43 scales — none is non-monotonic.

| `dir = -1` from step | Scales |
|---:|---|
| **1100** | `emerald` `green` `lime` `mint` `olive` `positive` `sky` `teal` |
| **1200** | `cobalt` `coral` `crimson` `gold` `gold_finance` `grape` `grey` `indigo` `informative` `lotus` `marigold` `navi` `negative` `orange` `peach` `pink` `purple` `red` `reliance` `rose` `rose_gold` `saffron` `sand` `tulip` `warning` `yellow` |
| **1300** | `scarlet` `violet` |
| **1500** | `Amber` `Green` `Neutral` `Peach` `Pink` *(Tira)* |
| **1600** | `Red` `Tira` *(Tira)* |

So `dir` at parent step *s* on scale *X* is `+1` if *s* < X's crossover, else `-1`.

Note how close most crossovers sit to 1300 — near enough that a "dark parents go up, light
parents go down" instinct is usually right and occasionally, invisibly, wrong. That is why the
`>= 1300` shortcut is not safe: it is correct for 2 of 43 scales and off by one to five steps for
the rest.

Only `minimal`, `subtle`, `moderate`, the content tokens and the strokes consult `dir`. `default`,
`ghost`, `blend`, `elevated` and `bold` never do.

## Surface tokens

`clamp(s)` = `max(100, min(2500, s))`. `rootStep` = `2500` in light mode, `200` in dark.

| Token | Resolves to |
|---|---|
| `default` | `rootStep` — ignores the parent entirely. A hard reset to the page background. |
| `ghost` | `parentStep` (emitted at 0.01% alpha — see note below) |
| `blend` | `parentStep` |
| `minimal` | `clamp(parentStep + dir * 100)` |
| `subtle` | `clamp(parentStep + dir * 200)` |
| `moderate` | `clamp(parentStep + dir * 300)` |
| `elevated` | `min(parentStep + 100, 2500)` — always **up**, ignores `dir` |
| `bold` | see below |

`elevated` ignoring `dir` is deliberate: elevation means "lifted toward the light", which is a
physical metaphor, not a contrast one.

**`ghost` is 0.01% alpha, not 0%.** Figma's drop-shadow renderer skips a fill at exactly 0% alpha,
which would kill the focus ring on ghost surfaces. 0.01% is sub-perceptual but engages the
renderer. If you ever need a truly invisible surface, use a different token rather than changing
this.

### The `bold` rule

`bold` is the only surface token that anchors on the scale rather than walking from the parent —
which is why it carries the brand colour, and why it has the most special cases.

```
candidate = pinnedStep ?? (parentStep >= 1300 ? scale.base : scale.darkerBase)

1. brandBG holy-colour: if pinnedStep is set AND parentStep ∈ {2500, 2400, 300, 200, 100}
                        → return clamp(pinnedStep)                     [stop]
2. if |parentStep − candidate| / 100 >= 7   → return candidate         [stop]
3. result = parentStep − 700                        (go darker first)
4. if result < 500  → result = parentStep + 700     (too dark; reverse)
5. return clamp(result)
```

Read it as: *use the scale's brand anchor if it is far enough from the parent to be legible;
otherwise walk 700 steps away from the parent to manufacture contrast.*

`pinnedStep` is supplied **only for `brandBG`**. Step 1 exists because the contrast walk used to
pull a light-anchored brand background off its exact step on a light page (teal 2100 → 1800),
destroying the signature colour. On any nested (non-root-proximate) parent the walk still applies.

### Bold on a different appearance

When a `bold` child's appearance differs from its parent's **and** the parent's appearance is not
`neutral`, resolve the child as if its parent were `default` — i.e. use `rootStep` in place of the
parent's real step. The child then lands on its own scale's anchor instead of being contrast-pulled
away from it.

The neutral carve-out matters: neutral surfaces are scaffolding, not a competing brand, so a
coloured `bold` inside a neutral container *should* be pulled by it.

**In Figma you honour this by writing `rootStep` as the child's parent-step mode** rather than the
parent's actual resolved step. The variable tree has no parent-appearance axis, so there is nowhere
else to express it — one deliberate lie in the mode produces the correct pixel. The child's own
descendants still cascade from its real resolved step, so nothing downstream is disturbed.

## Content tokens

```
resolveContent(token, parentStep, parentColour, scale, stepMap, dir, pinnedStep)
  → { step, opacity }
```

- `contrastingStep` = `2500` if `dir === 1`, else `200`
- `anchor` = `pinnedStep ?? (parentStep >= 1300 ? scale.base : scale.darkerBase)`
- `a11yAnchor` = `pinnedStep ?? scale.base`
- `walk(from, threshold)` — step by `dir * 100` from `from`, staying within 100–2500, and return
  the first step whose contrast against `parentColour` is `>= threshold`. Falls back to `from` if
  nothing qualifies.

| Token | Step | Opacity |
|---|---|---|
| `high` | `contrastingStep` | `1` |
| `medium` | `contrastingStep` | `(lowOpacity + 1) / 2` |
| `low` | `contrastingStep` | solved so contrast against the parent is exactly `4.5` |
| `tinted` | `walk(anchor, 3.0)` | `1` |
| `tintedA11y` | `walk(anchor, 4.5)`, then if `dir === 1` and the result is more than 500 from `a11yAnchor` → `2500` | `1` |
| `stroke medium` | `dir === -1 ? max(300, parentStep − 1800) : min(2000, parentStep + 1400)` | `0.24` / `0.32` |
| `stroke low` | same step rule as `stroke medium` | `0.12` / `0.16` |

Stroke opacities are `dir === -1` first, `dir === 1` second.

**Opacity is solved, not tabulated.** CSS/Figma opacity composites in **sRGB**, not linear light,
so there is no closed form. `low` is found by binary search: blend foreground over background in
sRGB at a candidate alpha, linearise, measure contrast, converge. 24 iterations gives sub-0.00001
precision. `medium` is then the midpoint between that alpha and 1.

Note `tintedA11y` walks from `anchor` but measures its overshoot against `a11yAnchor` — those
differ when `parentStep <= 1200`. That asymmetry is intentional; don't "fix" it.

## Interaction overlay (solid)

A translucent layer painted over the surface. Hover and pressed share a colour and differ only in
opacity.

```
step    = max(200, min(2000, surfaceStep + dir * 800))
```

The 200–2000 clamp is tighter than the surface chain's 100–2500 — the absolute extremes are
reserved for surface colour, not for a state layer sitting on top of one.

| Surface token | Hover | Pressed |
|---|---|---|
| `bold` | 0.24 | 0.32 |
| everything else | 0.16 | 0.24 |

`idle` and `focus` return opacity `0`. Focus is drawn by the ring, not the state layer.

`bold` gets more alpha because its surface is already at an extreme step, so an identical overlay
reads as weaker there than on a mid-step surface.

**Use the parent's `dir`, never a `dir` recomputed at the resolved surface step.** Near the
1200/1300 boundary recomputing flips the direction and pushes hover/pressed back toward the parent
— the state layer then becomes invisible exactly where it is needed.

## Focus ring (solid)

Always the **informative** scale, whatever the current appearance — a focus ring is a system
affordance, not a brand one.

| Token | Rule |
|---|---|
| `focusRing` | `walk(parentStep >= 1300 ? informative.base : informative.darkerBase, 4.5)`; then if `dir === 1` and the result is more than 500 from `informative.base` → `2500` |
| `focusRingOffset` | same step and colour as the parent surface |

## Transparent material

When `04 Material` is `transparent`, colours stop resolving against a parent step and become static
lookups per media context. There is no contrast solving — the backdrop is unknown by definition.

Opacity comes from a step: `opacity = 1 − (step − 100) / 2400`. So step `100` = fully opaque,
step `2500` = fully transparent.

The base colour is the brand's neutral scale at step `2500` (light variant) or `200` (dark variant).

**Surface** — `(variant, opacityStep, contentVariant)`:

| Token | `dynamic` | `dark` | `light` |
|---|---|---|---|
| `default` | dark, 2500, light | light, 2500, light | dark, 2500, dark |
| `ghost` | dark, 2500, light | light, 2500, light | dark, 2500, dark |
| `minimal` | dark, 2000, light | light, 2200, light | dark, 2200, dark |
| `subtle` | dark, 1400, light | light, 2000, light | dark, 2000, dark |
| `moderate` | dark, 1000, light | dark, 1000, light | light, 1000, dark |
| `bold` | light, 100, dark | light, 100, dark | dark, 100, light |
| `elevated` | light, 2000, light | light, 2000, light | light, 2000, dark |
| `blend` | dark, 100, light | dark, 100, light | light, 100, dark |

`dynamic` runs more opaque than the other two at `minimal`/`subtle` because the backdrop is
unpredictable and legibility has to be guaranteed without knowing it.

**Content** opacity step, identical across light and dark variants (only the base colour changes):

| `high` | `medium` | `low` | `tinted` | `tintedA11y` | `stroke medium` | `stroke low` |
|---|---|---|---|---|---|---|
| 100 | 500 | 1000 | 100 | 100 | 1400 | 2000 |

**Interaction** — `(variant, hoverStep, pressedStep)`:

| Token | `dynamic` | `dark` | `light` |
|---|---|---|---|
| `default`, `ghost`, `minimal`, `subtle`, `elevated` | dark, 2200, 2000 | light, 2300, 2100 | dark, 2300, 2100 |
| `moderate` | light, 2300, 2100 | light, 2300, 2100 | dark, 2300, 2100 |
| `bold` | dark, 2200, 2000 | dark, 2300, 2100 | light, 2100, 1800 |
| `blend` | light, 2100, 1800 | light, 2100, 1800 | dark, 2300, 2100 |

`idle` and `focus` use opacity step `2500` (invisible).

**Focus ring**: the ring is `informative.base` in global light mode, `informative.darkerBase` in
global dark, solid. The offset is the neutral `bold` transparent surface for the current media
context. Note this is the **global colour mode**, not the media context — media only controls
surface opacity.

## darkerBase

Every scale has a computed `darkerBase` alongside its authored `base` — a lightness-adjusted
anchor used when the parent is dark (`parentStep <= 1200`).

| `base` | `darkerBase` |
|---|---|
| 1900 – 2500 | `base` (+0) |
| 1300 – 1800 | `base + 100` |
| 700 – 1200 | `base + 200` |
| 100 – 600 | `base + 300` |

A scale may override this in its source data. Two do, both deliberately: Jio `grey` and Tira
`Neutral` are both `base 200` with `darkerBase 2500`. The table would give them 500 — a near-black
anchor for a dark parent, which is exactly wrong for a neutral scale that needs to flip to white.

Per-scale `base`/`darkerBase` values are in `appearance-and-themes.md`.

> Source: `packages/core/src/surfaceLogic.ts`, `packages/core/src/parseInput.ts`,
> `packages/figma-tokenator/src/generate.ts`.
