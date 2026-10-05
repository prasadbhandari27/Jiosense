---
name: oneui-figma-appearance-and-themes
description: >-
  OneUI theme pins, per-scale anchors, brandBG carve-out, and the bold-on-different-appearance rule. Use when setting appearance/theme or debugging bold/tinted colour choice.
---

# OneUI appearance and themes

Part of the OneUI Figma foundations set. Invoke the orchestrator `the `oneui-figma-foundations` skill (get_skill "oneui-figma-foundations")` for the full workflow, or this skill when you only need this topic. Core rules live in `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-foundations-core.md")`.

# Appearance and themes

## 1. What appearance does

Appearance selects **which colour scale** a node's colour tokens resolve against. It does not pick a colour directly — it picks the palette, and the token (`bold`, `minimal`, `content/high`, …) picks the step within it.

The nine values:

| Appearance | Kind | Meaning |
|---|---|---|
| `neutral` | brand | Scaffolding. Page backgrounds, cards, dividers, chrome. Carries no brand meaning. |
| `primary` | brand | The theme's primary brand colour. |
| `secondary` | brand | The theme's secondary brand colour. |
| `sparkle` | brand | The theme's third brand accent. (Tira's spec calls this slot `tertiary`; the schema name everywhere in this codebase is `sparkle`.) |
| `brandBG` | brand | The brand's **signature background colour**. Special: its pinned step is honoured at render time — see §3. |
| `positive` | system | Success / confirmation. |
| `negative` | system | Error / destructive. |
| `warning` | system | Caution. |
| `informative` | system | Neutral-information / info. Also the scale the **focus ring always uses**, regardless of the node's appearance. |

**The key mechanic.** Only three tokens anchor on the scale's own `base` / `darkerBase`: `surface/bold`, `content/tinted`, `content/tintedA11y`. So the *same* `bold` token renders indigo 600 under `primary` (MyJio) and near-black grey 200 under `neutral` — because `indigo.base = 600` and `grey.base = 200`. Every other token (`minimal`, `subtle`, `moderate`, `elevated`, `default`, `ghost`, `content/high|medium|low`, strokes) is parent-step arithmetic and barely moves when appearance changes.

**Appearance is inherited through the scene tree.** In Figma it is a native variable mode on collection `01 Appearance`. A node with no explicit mode inherits from its nearest ancestor that has one; if nothing up the chain is explicit, the page default (`neutral`) applies. Set it explicitly only where the brand meaning actually changes — do not stamp it on every node, or you break inheritance for everything below.

## 2. Choosing the scale — `getScaleName(theme, appearance)`

```ts
if (appearance === 'neutral') return theme.brand.neutral                       // bare scale name
if (PINNED_KEYS.includes(appearance)) return theme.brand[appearance].scale     // primary|secondary|sparkle|brandBG
return theme.brand.system?.[appearance] ?? appearance                          // system: explicit map, else name identity
```

`PINNED_KEYS = ['primary', 'secondary', 'sparkle', 'brandBG']`.

- **neutral** → `theme.brand.neutral` — a bare string, no step. `grey` for every Jio theme, `Neutral` for Tira.
- **the four pinned keys** → their `.scale` field.
- **system appearances** → the theme's `system` map when it declares one, otherwise **name identity** (appearance `positive` → the scale literally named `positive`). Jio relies on name identity — it owns scales called `positive` / `negative` / `warning` / `informative`. Tira declares a map instead, so no duplicate primitives are minted.

## 3. `getScaleStep` and the brandBG carve-out

```ts
if (appearance === 'neutral') return undefined
if (PINNED_KEYS.includes(appearance)) return Number(theme.brand[appearance].step)
return undefined   // system appearances: always use scale.base
```

So `getScaleStep` returns a number for all four pinned keys — but **only `brandBG` honours it at render time.**

| Appearance | Step returned | Honoured by `bold` / `tinted` / `tintedA11y`? |
|---|---|---|
| `primary`, `secondary`, `sparkle` | yes | **No — metadata only.** Resolution uses `scale.base` / `scale.darkerBase`. |
| `brandBG` | yes | **Yes.** The pinned step replaces `scale.base` as the anchor. |
| `neutral`, system | `undefined` | n/a — always `scale.base` / `scale.darkerBase`. |

**Why the asymmetry.** `brandBG` *is* the brand's signature background colour — MyJio is indigo **300**, JioBlackRock is reliance **200**, JioSaavn is teal **2100**. Without honouring the step, every theme whose brandBG uses indigo would collapse onto `indigo.base = 600` and the library would paint the wrong background. For `primary`/`secondary`/`sparkle` the pin is preserved so future tooling can read it, but render output stays scale-consistent across themes.

Consumers gate on `appearance === 'brandBG'` **explicitly** — not on "`getScaleStep` returned something". Generalising the gate to "any pinned appearance" was tried and OOM'd Figma's wasm runtime.

### The brandBG root-proximity rule (bold only)

```ts
const BRANDBG_ROOT_PROXIMITY = new Set([2500, 2400, 300, 200, 100])
...
if (pinnedStep !== undefined && BRANDBG_ROOT_PROXIMITY.has(effectiveParent)) return clamp(pinnedStep)
```

A `brandBG` + `bold` surface sitting **on or within ±1 step of a root background** (`2500`/`2400` in light, `300`/`200`/`100` in dark) returns the pinned step **exactly**, skipping the 7-step / 700-delta contrast walk entirely. The walk still applies on all other (nested, mid-range) parent steps.

Why: the walk used to pull light-anchored pins off their step on a light page — JioSaavn's teal 2100 became 1800. Net effect of the rule: **brandBG bold = the exact pin at any root context, in both colour modes.** Not applied to `tinted` / `tintedA11y` — their contrast walk has no proximity failure mode.

## 4. The bold-on-different-appearance rule

This one silently produces wrong colours if you skip it. Give it attention.

**The rule.** When a `bold` child has an appearance **different from its parent** AND the parent's appearance is **not `neutral`**, resolve the child as if its parent were `default` — i.e. use **rootStep** (`2500` in light, `200` in dark) as the parent step:

```ts
const effectiveParent = differentAppearance ? (darkMode ? 200 : 2500) : parentStep
const candidate = pinnedStep ?? (effectiveParent >= 1300 ? scale.base : scale.darkerBase)
```

**The effect.** At rootStep the candidate is ≥ 7 steps from the parent, so the bold rule returns the candidate as-is. The child lands on **its own scale's brand anchor** (`scale.base` in light, `scale.darkerBase` in dark) instead of being contrast-pulled away from it by whatever step the parent happens to resolve to.

**The case it fixes.** A `negative`-bold indicator badge nested inside a `sparkle`-bold status badge. Without the rule, the standard 7-step / 700-delta walk drags the inner badge off `negative.base` toward contrast with sparkle's step — destroying the brand meaning of "this is an error".

**Same-appearance bold-on-bold keeps the old behaviour** (`negative`-bold inside `negative`-bold): both layers share the same brand meaning, so contrast-pulling the inner one is exactly right — it needs to be visible against its sibling.

**The neutral-parent carve-out.** When the parent's appearance is `neutral`, the rule does **not** fire even though the child's appearance differs. Neutral surfaces are scaffolding, not a competing brand: a coloured bold child inside a neutral container is *meant* to be contrast-pulled by it. Example: `primary`-bold inside a `neutral`-bold dark frame correctly resolves to primary's lighter `darkerBase`, not primary's dark `base`. The rule fires only on parents that carry brand meaning: `primary`, `secondary`, `sparkle`, `brandBG`, `positive`, `negative`, `warning`, `informative`.

The rule is **always-on**, not a toggle, and applies to `bold` only — not to `tinted` / `tintedA11y`, whose contrast walk already starts at the anchor and walks outward.

### How you honour it in Figma

**The variable tree has no parent-appearance axis.** The alias chain carries parent *step* only — collections `16 Parent range` / `17 Parent ≤1200` / `18 Parent >1200`. A lookup cannot tell "bold-on-same-appearance" from "bold-on-different-appearance".

**So the way you apply the rule is to write `rootStep` as the child's parent-step mode instead of the parent's actual resolved step.**

```
child token = bold  AND  child appearance ≠ parent appearance  AND  parent appearance ≠ neutral
  → write parent_step = 2500 (light) / 200 (dark)
otherwise
  → write parent_step = the parent's actual resolved step
```

At `parent_step = rootStep` the variable `<scale>/surface/bold` already evaluates to `scale.base` (light, via `18 Parent >1200` mode `2500`) or `scale.darkerBase` (dark, via `17 Parent ≤1200` mode `200`) — case 2 of the bold rule. **One deliberate lie in the mode produces the right pixel**, with no new multiplexing in the variable tree.

Two consequences to keep straight:

- **Cascade stays consistent.** The child's own descendants receive `parent_step` = the child's **real resolved step** (`scale.base` / `darkerBase` — the colour actually on screen), not the rootStep lie. So grandchildren resolve correctly without further intervention.
- **Content tokens on the bold child are unaffected.** A text node inside the bold frame gets `parent_step` = bold's real resolved step, so `content/high|medium|low` resolve against the surface colour that is actually rendered. Only state-layer overlays on that frame use the rootStep-relative variant — a small visual approximation, accepted deliberately.

Threading a real `parentAppearance` axis through the tree would multiply `scales × parent_appearances × tokens × parent_steps × range_collections` and OOM Figma's wasm runtime. Do not attempt it.

## 5. Brands and themes

Two brands: **`Jio`** and **`Tira`**. Brand is Figma collection `15 Brand`; theme is `13.1/13.2/13.3 Theme [Jio]` (three collections) or `14 Theme [Tira]`.

### Jio — 25 themes

Neutral scale is `grey` for **every** Jio theme. No `system` map — system appearances resolve by name identity to Jio's own `positive` / `negative` / `warning` / `informative` scales.

Bucket = which half-collection the theme lives in, split on the letter after `Jio` (`MyJio` buckets as **M**, so A–M). Order below is declaration order, which is also mode order in Figma — `MyJio` is first, so it is the default theme when no explicit mode is set.

| # | Theme | primary | secondary | sparkle | brandBG | Bucket |
|---:|---|---|---|---|---|---|
| 1 | `MyJio` | `indigo` 600 | `saffron` 1500 | `green` 1300 | `indigo` **300** | A–M |
| 2 | `JioAICloud` | `sky` 1000 | `marigold` 1800 | `mint` 1600 | `sky` **700** | A–M |
| 3 | `JioAllianz` | `gold` 1600 | `purple` 1100 | `sky` 1200 | `reliance` **300** | A–M |
| 4 | `JioBlackRock` | `gold` 1600 | `purple` 700 | `sky` 1200 | `reliance` **200** | A–M |
| 5 | `JioBusiness` | `purple` 800 | `reliance` 800 | `mint` 1600 | `reliance` **300** | A–M |
| 6 | `JioCX` | `purple` 800 | `navi` 1100 | `orange` 1600 | `navi` **400** | A–M |
| 7 | `JioFinance` | `gold` 1600 | `purple` 800 | `sky` 1200 | `reliance` **300** | A–M |
| 8 | `JioFit` | `orange` 1600 | `purple` 1500 | `mint` 1600 | `purple` **800** | A–M |
| 9 | `JioGames` | `green` 1300 | `mint` 1600 | `marigold` 1800 | `green` **900** | A–M |
| 10 | `JioHealthHub` | `mint` 1600 | `sky` 1000 | `red` 1100 | `mint` **2100** | A–M |
| 11 | `JioHome` | `sky` 1000 | `purple` 800 | `orange` 1600 | `purple` **500** | A–M |
| 12 | `JioMart` | `red` 1100 | `sky` 1700 | `green` 1500 | `sky` **1000** | A–M |
| 13 | `JioMeals` | `red` 1300 | `saffron` 1500 | `olive` 1000 | `olive` **600** | A–M |
| 14 | `JioMessages` | `purple` 800 | `yellow` 2100 | `green` 1300 | `marigold` **1800** | A–M |
| 15 | `JioMobile` | `navi` 400 | `sky` 1000 | `emerald` 2000 | `sky` **1500** | A–M |
| 16 | `JioNews` | `red` 1100 | `orange` 1600 | `sky` 1800 | `crimson` **800** | N–Z |
| 17 | `JioPC` | `purple` 800 | `mint` 2100 | `marigold` 1800 | `purple` **400** | N–Z |
| 18 | `JioSaavn` | `mint` 1600 | `sky` 800 | `indigo` 1200 | `teal` **2100** | N–Z |
| 19 | `JioSarthi` | `red` 1100 | `purple` 800 | `emerald` 1400 | `purple` **400** | N–Z |
| 20 | `JioStar` | `pink` 1100 | `purple` 1000 | `cobalt` 1100 | `reliance` **200** | N–Z |
| 21 | `JioThings` | `purple` 800 | `mint` 1600 | `orange` 1800 | `purple` **500** | N–Z |
| 22 | `JioTranslate` | `grape` 700 | `marigold` 2100 | `violet` 1200 | `marigold` **1800** | N–Z |
| 23 | `JioTV` | `red` 1100 | `crimson` 600 | `sky` 1700 | `crimson` **800** | N–Z |
| 24 | `JioWave` | `purple` 800 | `sky` 1000 | `mint` 1600 | `purple` **200** | N–Z |
| 25 | `JioWorkspace` | `purple` 800 | `reliance` 1900 | `marigold` 1800 | `reliance` **300** | N–Z |

The **brandBG** step column is bolded because it is the only one that changes rendered colour. The other three steps are metadata.

`JioAllianz`'s spec background is the raw hex `#003781`, which does not fall on any scale step; `reliance` 300 is the snap target (same hue, near-identical L/C).

### Tira — 1 theme

| Theme | neutral | primary | secondary | sparkle | brandBG |
|---|---|---|---|---|---|
| `Tira` | `Neutral` | `Tira` 1600 | `Pink` 1700 | `Peach` 1900 | `Neutral` **200** |

`sparkle` is the spec's `tertiary` slot, mapped onto the schema-wide `sparkle` name.

`brandBG` = `Neutral` 200 is an **assumed** value — the spec says "brandBG: neutral" without a step, so Neutral's own base (200, near-black) is used. Unlike the three above, this step is load-bearing: it *is* the rendered brand background.

**System map** (declared, so name identity is not used):

| Appearance | Tira scale |
|---|---|
| `positive` | `Green` |
| `negative` | `Red` |
| `warning` | `Amber` |
| `informative` | *(no entry)* → falls through to name identity → the shared **Jio `informative`** scale |

Tira has no `informative` equivalent of its own, so Jio's shared scale is carried into Tira's palette under that name. It is the only foreign scale in Tira's primitives. `positive`/`negative`/`warning` deliberately do **not** get duplicate primitives minted under those names — that would put scales in Tira's palette the brand does not own.

## 6. Scale anchors — `base` and `darkerBase`

`darkerBase` is a lightness-adjusted second anchor, used by `bold` / `tinted` / `tintedA11y` when the parent step is ≤ 1200 (i.e. on a dark surface). Derivation, from `parseInput.ts`:

```ts
const darkerBaseOffset = base >= 1900 ? 0 : base >= 1300 ? 1 : base >= 700 ? 2 : 3
const computedDarkerBase = STEPS[STEPS.indexOf(base) + darkerBaseOffset] ?? base
const darkerBase = darkerBaseOverride ?? computedDarkerBase
```

The offset is a count of **positions on the 25-step list**, which is the same as ±100 in step units:

| `base` range | Offset | In step units |
|---|---|---|
| 1900 – 2500 | +0 | +0 |
| 1300 – 1800 | +1 | +100 |
| 700 – 1200 | +2 | +200 |
| 100 – 600 | +3 | +300 |

Do not change this table without explicit instruction.

A scale may override the computed value with a `"darkerBase"` key in the JSON. **Exactly two scales do**, both deliberately, both for the same reason — their base is a near-black at step 200, and the offset table would give another near-black (500). Overriding to 2500 flips the light-anchored tokens to white, which is what a neutral scale needs:

- Jio **`grey`**: `base 200` → override `darkerBase 2500` (computed would be 500)
- Tira **`Neutral`**: `base 200` → override `darkerBase 2500` (computed would be 500)

### Jio scales (36)

| Scale | base | darkerBase | | Scale | base | darkerBase |
|---|---:|---:|---|---|---:|---:|
| `sand` | 1700 | 1800 | | `violet` | 1200 | 1400 |
| `yellow` | 2100 | 2100 | | `purple` | 800 | 1000 |
| `gold` | 1700 | 1800 | | `indigo` | 600 | 900 |
| `marigold` | 1800 | 1900 | | `navi` | 700 | 900 |
| `orange` | 1600 | 1700 | | `cobalt` | 900 | 1100 |
| `saffron` | 1500 | 1600 | | `reliance` | 800 | 1000 |
| `peach` | 1600 | 1700 | | `sky` | 1000 | 1200 |
| `coral` | 1500 | 1600 | | `mint` | 1600 | 1700 |
| `red` | 1100 | 1300 | | `teal` | 1600 | 1700 |
| `scarlet` | 1000 | 1200 | | `emerald` | 1400 | 1500 |
| `crimson` | 800 | 1000 | | `green` | 1300 | 1400 |
| `tulip` | 1300 | 1400 | | `olive` | 1000 | 1200 |
| `rose` | 1400 | 1500 | | `lime` | 1800 | 1900 |
| `pink` | 1100 | 1300 | | **`grey`** | **200** | **2500** *(override)* |
| `lotus` | 1300 | 1400 | | `gold_finance` | 1600 | 1700 |
| `grape` | 700 | 900 | | `rose_gold` | 1500 | 1600 |

System scales (owned by Jio, shared with every brand):

| Scale | base | darkerBase |
|---|---:|---:|
| `positive` | 1300 | 1400 |
| `negative` | 1200 | 1400 |
| `warning` | 1400 | 1500 |
| `informative` | 1400 | 1500 |

`gold_finance` and `rose_gold` exist in the palette but are not referenced by any theme today.

### Tira scales (7, plus the borrowed `informative`)

| Scale | base | darkerBase |
|---|---:|---:|
| **`Neutral`** | **200** | **2500** *(override)* |
| `Tira` | 1600 | 1700 |
| `Pink` | 1700 | 1800 |
| `Peach` | 1900 | 1900 |
| `Amber` | 1700 | 1800 |
| `Red` | 1400 | 1500 |
| `Green` | 1400 | 1500 |
| `informative` *(borrowed from Jio)* | 1400 | 1500 |

> Source: `packages/core/src/themes.ts`, `parseInput.ts`, `surfaceLogic.ts`, `colours.ts`, `colours-tira.ts`.
