---
name: oneui-figma-size-and-typography
description: >-
  OneUI spacing, shape, stroke, grid, typography, elevation, and blur bindings and styles in Figma. Use when applying size tokens or text/effect styles instead of raw numbers.
---

# OneUI size and typography

Part of the OneUI Figma foundations set. Invoke the orchestrator `the `oneui-figma-foundations` skill (get_skill "oneui-figma-foundations")` for the full workflow, or this skill when you only need this topic. Core rules live in `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-foundations-core.md")`.

# Size and typography

## 1. The dimension spine

**Every size family resolves through one primitive: `px = base × multiplier`.** The multiplier is fixed per token; the base is fluid across viewport width. Spacing, shape, stroke, grid, typography and elevation are all thin layers on top — none of them duplicates this maths.

**In Figma you never compute px.** The fluidity is delivered by the mode pair `09 Platform` × `11 Density`: you set a platform breakpoint and a density on an ancestor, and the Brand variable (`dimensions/spacings/4`, `typography/fontSize/body/M`, …) resolves to the right number. Bind the variable; do not type a value.

- `09 Platform` modes: `S – 360`, `M – 768`, `L – 1024`, `L – 1440`, `L – 1920`
- `11 Density` modes: `default`, `compact`, `open`

### The 32 dimension tokens

Token name × 4 = multiplier is the **naming convention**, not a computation — the table is authored explicitly. Do not change it without instruction.

| Token | Mult | | Token | Mult | | Token | Mult | | Token | Mult |
|---|---:|---|---|---:|---|---|---:|---|---|---:|
| `0` | 0 | | `4` | 1 | | `8` | 2 | | `24` | 6 |
| `0.5` | 0.125 | | `4.5` | 1.125 | | `9` | 2.25 | | `28` | 7 |
| `1` | 0.25 | | `5` | 1.25 | | `10` | 2.5 | | `32` | 8 |
| `1.5` | 0.375 | | `5.5` | 1.375 | | `12` | 3 | | `40` | 10 |
| `2` | 0.5 | | `6` | 1.5 | | `14` | 3.5 | | `48` | 12 |
| `2.5` | 0.625 | | `7` | 1.75 | | `16` | 4 | | `64` | 16 |
| `3` | 0.75 | | | | | `18` | 4.5 | | `80` | 20 |
| `3.5` | 0.875 | | | | | `20` | 5 | | `120` | 30 |
| | | | | | | | | | `160` | 40 |
| | | | | | | | | | `200` | 50 |

The top six (`48`–`200`) were added to absorb the retired fluid-pane tokens.

**In Figma, `.` is illegal in a variable-name segment** — half-steps are emitted with `-`: `dimensions/spacings/0-5`, `…/1-5`, `…/2-5`.

### `baseAt` — the fluid base

Linear interpolation on viewport width between two endpoints per density; **clamped** outside 360–1920.

| Density | base @ 360 | base @ 1920 |
|---|---:|---:|
| `default` | 16 | 20 |
| `compact` | 14 | 18 |
| `open` | 18 | 22 |

```ts
if (vw <= 360) return min.base
if (vw >= 1920) return max.base
return min.base + ((vw - 360) / (1920 - 360)) * (max.base - min.base)
```

The five Platform breakpoints (`[360, 768, 1024, 1440, 1920]`) **snap onto this single line** — they are not independent anchors.

Density changes the base endpoints only. The multiplier table is shared across all three densities.

### Reverse lookup — measured px → token (mobile)

The spine runs forward: bind a token, get a px. Rebuilding an existing screen needs it **backwards**
— you have a measured px off a reference frame and need the token that reproduces it.

**On mobile — `09 Platform` = `S – 360`, `11 Density` = `default` — base is 16, so:**

```
token = measured px / 4
```

That is exact, not an approximation: `px = base × multiplier` and `multiplier = tokenName / 4`, so
at base 16, `px = 4 × tokenName`.

| Measured | ÷ 4 | Spacing / gap token | Radius token |
|---:|---:|---|---|
| 2 px | 0.5 | `dimensions/spacings/0-5` | `dimensions/shape/0-5` |
| 4 px | 1 | `dimensions/spacings/1` | `dimensions/shape/1` |
| 8 px | 2 | `dimensions/spacings/2` | `dimensions/shape/2` |
| 12 px | 3 | `dimensions/spacings/3` | `dimensions/shape/3` |
| 16 px | 4 | `dimensions/spacings/4` | `dimensions/shape/4` |
| 18 px | 4.5 | `dimensions/spacings/4-5` | `dimensions/shape/4-5` |
| 20 px | 5 | `dimensions/spacings/5` | `dimensions/shape/5` |
| 24 px | 6 | `dimensions/spacings/6` | `dimensions/shape/6` |
| 32 px | 8 | `dimensions/spacings/8` | `dimensions/shape/8` |
| 40 px | 10 | `dimensions/spacings/10` | `dimensions/shape/10` — **shape ends here** |
| 64 px | 16 | `dimensions/spacings/16` | no shape token — use `pill` or `10` |

**Three guards — the quotient is a candidate, not automatically a token:**

1. **It must exist in the family.** Spacings offer 32 tokens; above `10` they step `12, 14, 16, 18,
   20, 24, 28, 32, 40, 48, 64, 80, 120, 160, 200`. A 26 px measurement gives 6.5, which is not a
   token — snap to the nearest that *is* (`6` = 24 px or `7` = 28 px) and note the delta. Emitting
   `spacings/6-5` fails to bind and invites a raw-value fallback.
2. **Shape is capped at `10`** (40 px at base 16) — there is no `shape/12`. A larger measured radius
   is `dimensions/shape/pill` when the shape reads as fully rounded, otherwise `shape/10`.
3. **Write the name as Figma stores it** — `spacings` is plural, and `.` is illegal in a segment:
   `4.5` → `4-5`.

**Off mobile, 4 is the wrong divisor.** The general form is `token = px / (base / 4)`, with base
from the `baseAt` table above — 14 at `compact`, 18 at `open`, 20 at `L – 1920` default. Confirm
`09 Platform` and `11 Density` before dividing; if they are not pinned, the divisor is whatever the
file happens to inherit.


## 2. Spacing, shape, stroke

### Spacings

Pure alias — **all 32 dimension tokens** are spacing tokens, same names, same multipliers. Brand path `dimensions/spacings/<token>`, scope `WIDTH_HEIGHT` + `GAP`.

### Negative spacings

A **14-token subset** — the wider `9`–`200` range is deliberately omitted:

`0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 7, 8`

Brand path `dimensions/spacingsNegative/-<token>`, scope **`GAP` only** — narrower than positive spacings on purpose. A negative width or height is meaningless; a negative auto-layout gap (= overlap) is the one legitimate use, so the group is hidden from the width/height picker.

Naming: the **leading** `-` is the sign, an **internal** `-` is the `.` substitution. `-1-5` is "negative 1.5", not "negative 1 then 5".

### Shape

Dimension subset **capped at `10`** (no `12` and above), plus one fixed token:

`0, pill, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 7, 8, 9, 10`

`pill` is **fixed at 9999 px** regardless of viewport or density — it short-circuits the resolver and has no multiplier. `0` and `pill` sit adjacent by convention: they are the two endpoints of the radius ramp (square / fully rounded).

### Strokes — 13 T-shirt tokens, two kinds

The split is the point: **hairline strokes must not grow with the viewport.** A 1px divider at 360 should still be 1px at 1920, so `none`–`2XL` are literal px. Structural strokes that read as part of the layout do scale, so `3XL`–`9XL` reference dimension tokens and inherit the fluid base.

| Token | Kind | Value |
|---|---|---|
| `none` | fixed | 0 px |
| `S` | fixed | 0.5 px |
| `M` | fixed | 1 px |
| `L` | fixed | 1.5 px |
| `XL` | fixed | 2 px |
| `2XL` | fixed | 3 px |
| `3XL` | dimension | ref `1` |
| `4XL` | dimension | ref `1.5` |
| `5XL` | dimension | ref `2` |
| `6XL` | dimension | ref `2.5` |
| `7XL` | dimension | ref `3` |
| `8XL` | dimension | ref `3.5` |
| `9XL` | dimension | ref `4` |

Bind `dimensions/strokes/<token>` to `strokeWeight`; do not type a number.

## 3. Grid

**Three grid breakpoints classify the viewport for layout.** They are a **different axis** from the five `09 Platform` modes — do not conflate them. Platform modes are Figma mode snap points that drive the dimension base; grid breakpoints are viewport-range classifiers that pick a column count and margin/gutter token.

| | `S` | `M` | `L` |
|---|---|---|---|
| Viewport range (inclusive) | `< 620` (max 619) | `620 – 990` | `> 990` (min 991) |
| columns | 4 | 8 | 12 |
| margin — `default` | `4` | `8` | `10` |
| margin — `compact` | `3` | `6` | `8` |
| margin — `open` | `5` | `10` | `16` |
| gutter — `default` | `2` | `4` | `5` |
| gutter — `compact` | `1.5` | `3` | `4` |
| gutter — `open` | `2.5` | `5` | `5.5` |

Margin and gutter cells are **dimension token names**, so density flows through twice: it picks the token *and* the interpolation base. That is intended — open mode gets a bigger token name AND a bigger base.

In Figma, apply the shipped **GridStyle named `grid`**. Its `count` / `offset` / `gutterSize` bind to `dimensions/layout/grid/{columns, margin, gutter}`, which resolve natively against the frame's Platform × Density modes. Do not hand-build a layout grid.

## 4. Typography

**Apply the shipped TextStyle. Do not bind the four variables by hand.** There are **84** TextStyles, one per `(category, size, semantic)` composite, named `{category}/{size}/{semantic}` — e.g. `label/M/high`, `body/2XS/low`, `display/L/high`, `title/S/medium`. Each style binds `fontFamily`, `fontSize`, `fontWeight` and `lineHeight` to Brand variables, so one style covers every Brand × Language × Platform × Density combination at render time.

### Categories and sizes

Ordered big → small.

| Category | Sizes | Composites |
|---|---|---:|
| `display` | XL, L, M, S | 12 |
| `headline` | L, M, S | 9 |
| `title` | L, M, S | 9 |
| `label` | XL, L, M, S, XS, 2XS, 3XS | 21 |
| `body` | XL, L, M, S, XS, 2XS | 18 |
| `code` | M, S, XS, 2XS, 3XS | 15 |

### Weight semantics

`low | medium | high`. **All six categories carry all three** (display / headline / title gained `medium` + `low` on 2026-07-29; the historical single weight is `high`). The type is modelled sparse, not fallback-driven — absence of a `(category, semantic)` cell means the weight is not defined; do not fall back to `medium`.

### Font size — a dimension token per (category, size, grid breakpoint)

Font sizes are **dimension token names**, so viewport-fluidity and density come for free. The breakpoint axis is the **same `S`/`M`/`L` grid breakpoint** as §3 — there is no second typography breakpoint axis.

| Category / size | S | M | L |
|---|---|---|---|
| `display/XL` | `12` | `12` | **`20`** |
| `display/L` | `10` | `10` | **`16`** |
| `display/M` | `9` | `9` | **`12`** |
| `display/S` | `8` | `8` | **`9`** |
| `headline/L` | `6` | `6` | **`7`** |
| `headline/M` | `5` | `5` | **`5.5`** |
| `headline/S` | `4` | `4` | **`4.5`** |
| `title/L` | `5` | `5` | `5` |
| `title/M` | `4` | `4` | `4` |
| `title/S` | `3` | `3` | `3` |
| `label/XL`, `body/XL` | `5` | `5` | `5` |
| `label/L`, `body/L` | `4.5` | `4.5` | `4.5` |
| `label/M`, `body/M`, `code/M` | `4` | `4` | `4` |
| `label/S`, `body/S`, `code/S` | `3.5` | `3.5` | `3.5` |
| `label/XS`, `body/XS`, `code/XS` | `3` | `3` | `3` |
| `label/2XS`, `body/2XS`, `code/2XS` | `2.5` | `2.5` | `2.5` |
| `label/3XS`, `code/3XS` | `2` | `2` | `2` |

**Only `display/*` and `headline/*` vary by breakpoint** — S and M share a value, L is larger. Everything else is breakpoint-uniform. Both brands share this table.

### Line height — a signed index offset on the dimension token list

Line height is **not** a ratio and **not** a px value. It is a signed offset applied to the position of the font-size token in the ordered 32-token dimension list, then resolved as a dimension token in its own right — which is why line height is viewport- and density-fluid for free.

```ts
lineHeightToken = tokens[tokens.indexOf(fontSizeToken) + offset]
```

Worked example — `body/M`, Jio, offset `3`. Font size token is `4`; the token list runs `… 3, 3.5, 4, 4.5, 5, 5.5, 6, 7 …`, so three positions up from `4` is `5.5`. At default density @ 360 (base 16), font size = 16 × 1 = **16 px**, line height = 16 × 1.375 = **22 px**.

Because the token list is **non-linear** (gaps widen past `6`), a constant offset yields different ratios at different sizes. The resolver **throws** if the offset runs off the end of the array — it does not silently clamp.

| Category | Jio offset | Tira offset |
|---|---:|---:|
| `display` | 0 | **2** |
| `headline` | 0 | **3** |
| `title` | 1 | **3** |
| `label` | 0 | 0 |
| `body` | 3 (`2XS`: 2) | 3 (`2XS`: 2) |
| `code` | 2 | 2 |

Tira is looser across the three heading categories. `display` sits at +2 rather than +3 so the largest headings do not run looser than the small ones.

### Font weight — per (category, semantic), brand-scoped

**Jio:**

| Category | high | medium | low |
|---|---:|---:|---:|
| `display` (all sizes) | 900 | 700 | 500 |
| `headline` L, M | 900 | 700 | 500 |
| `headline` **S** | **850** \* | 700 | 500 |
| `title` L, M | 800 | 600 | 500 |
| `title` **S** | **750** \* | 600 | 500 |
| `label` / `body` / `code` (all sizes) | 700 | 500 | 400 |

\* carries `opticalSizing: 'auto'` — emitted as the CSS `font-optical-sizing` property, and as a sibling `fontOpticalSizing` STRING variable in the Language collection.

The two per-size deviations and their optical-sizing flag are **scoped to `high` only**. `medium` and `low` are flat across sizes for every category. Do not mirror the override onto them.

**Tira** — uniform across every category **and** every size. No `bySize` deviations, no `opticalSizing` anywhere. The spec names weights by style; these are the variable-font axis values they map to:

| Semantic | Style name | Value |
|---|---|---:|
| `high` | Medium | 500 |
| `medium` | Regular | 400 |
| `low` | Light | 300 |

### Font family — per (category, language)

Language is the `12 Language` collection, modes `latin` / `others` (`others` covers RTL and non-Latin scripts).

| Category | Jio latin | Jio others | Tira latin | Tira others |
|---|---|---|---|---|
| `display` / `headline` / `title` / `label` / `body` | `'JioType Var', sans-serif` | `'Noto Sans', sans-serif` | `'PP Object Sans', sans-serif` | `'Noto Sans', sans-serif` |
| `code` | `'JetBrains Mono', monospace` | `'JetBrains Mono', monospace` | `'JetBrains Mono', monospace` | `'JetBrains Mono', monospace` |

`code` is script-agnostic in both brands; every other category swaps when the Language mode changes.

### Letter spacing

`{ default: 0 }` for **both** brands — 0 em on every composite. Authored standalone per brand (not aliased) so a future Tira-only tracking change lands without touching Jio. The TextStyles carry a literal `0%`; there is no variable for it.

## 5. Elevation

**Apply the shipped EffectStyle — `elevation1`, `elevation2`, `elevation3`.** Each composites two DROP_SHADOWs whose `color`, `offsetY`, `radius` and `spread` are *all* bound to Brand variables, so the style follows brand + density + platform + colour-mode context automatically. Rebuilding the shadows by hand loses all of that.

Each level renders as two stacked drop shadows: **`keyLight`** (sharper, smaller blur) and **`softLight`** (wider blur). In the EffectStyle, `effects[0]` = softLight and `effects[1]` = keyLight — the later index paints on top, so the soft halo sits over the defined inner shadow. Do not swap them.

### Derivation from one anchor token

Per `(level, density)` a single anchor dimension token `n` is authored. Both shadows derive from it, where `f(t)` = `resolveDimension(t, viewport, density)`:

| Shadow | y | blur |
|---|---|---|
| `keyLight` | `f(n) × 0.5` | `f(n)` |
| `softLight` | `f(n) × 0.25` | `f(n + 6)` |

`+6` is an **index offset on the dimension token list** — the same mechanic line height uses, not an addition of 6 px. It gives softLight a much wider blur than keyLight. `x` and `spread` are 0 today (exposed on the shape so future directional shadows extend cleanly). The resolver **throws** if the offset runs off the end of the array.

### Anchor per (level, density)

| Level | compact | default | open |
|---|---|---|---|
| `elevation1` | `0.5` | `2` | `2` |
| `elevation2` | `1` | `3` | `3.5` |
| `elevation3` | `1.5` | `4` | `5` |

### Colour

Authored per `(level, shadow)` — all six cells identical today, split per-cell so a future brand can change one without disturbing the others.

| Brand | scale | step | opacity |
|---|---|---|---|
| Jio | `grey` | 200 | 0.08 |
| Tira | `Neutral` | 200 | 0.08 |

The scale name is brand-scoped rather than flattened to a hex, so `(scale, step)` resolves correctly across brands. Tira's repoint is load-bearing: without it the `brand.colours[ref.scale]` lookup misses and every `colour/elevation/*` variable resolves empty in the Tira mode.

## 6. Blur

Three tokens, **fixed px**. No viewport-fluidity, no density variation, no upstream chain — `brand.blurs.values[token]` is the entire computation, which is why there is no resolver function.

| Token | px |
|---|---:|
| `blurS` | 16 |
| `blurM` | 24 |
| `blurL` | 40 |

Both brands hold identical values today; the per-brand split exists so a future brand can diverge without a schema change.

Shipped as three `BACKGROUND_BLUR` **EffectStyles** named `blurS` / `blurM` / `blurL` (flat names, no `blur/` hierarchy). Each style's `radius` binds to the Brand FLOAT leaf `effect/blurs/<token>`. Apply the style. Note that `BACKGROUND_BLUR` effects accept only `type`, `radius`, `visible` — colour, offset and spread do not apply, and Figma's runtime rejects `blendMode` on them.

> Source: `packages/core/src/` — `dimensions.ts`, `dimensionLogic.ts`, `spacings.ts`, `shapes.ts`, `strokes.ts`, `grid.ts`, `typography.ts`, `typographyTypes.ts`, `themes.ts`, `elevations.ts`, `elevationLogic.ts`, `blurs.ts`; `packages/figma-shared/src/collections.ts`.
