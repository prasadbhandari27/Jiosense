---
name: oneui-figma-brand-variables
description: >-
  Which OneUI Brand variable to bind to each paint, scopes, and name-mangling rules. Use when choosing fill/stroke bindings for surfaces, content, state layers, or strokes.
---

# OneUI Brand variables

Part of the OneUI Figma foundations set. Invoke the orchestrator `the `oneui-figma-foundations` skill (get_skill "oneui-figma-foundations")` for the full workflow, or this skill when you only need this topic. Core rules live in `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-foundations-core.md")`.

# Brand variables — the binding vocabulary

`15 Brand` is the binding leaf. **Bind Brand variables only.** Every upstream collection (`01`–`14`, `16`–`19`) is explicitly descoped to `[]` by the tokenator, so its variables do not appear in any Figma picker — if you find yourself reaching for one, the path is wrong. Upstream variables exist to make the alias chain resolve; they are not a consumer API.

Brand variable paths are **brand-agnostic** — there is no `Jio/` or `Tira/` in the name. The node's `15 Brand` mode selects which upstream target each alias points at.

Modes on `15 Brand`: `Jio`, `Tira`.

---

## `colour/surface/surface` — one variable, eight tokens

| Path | Type | Scope |
|---|---|---|
| `colour/surface/surface` | `COLOR` | `FRAME_FILL` |

**All eight surface tokens go through this single variable.** There is no `colour/surface/bold`, no `colour/surface/minimal`. Which token you get is selected by the node's **`03 Surface` mode**, not by binding a different variable.

Why: a frame has exactly one fill, and its surface token is a property of the frame's role in the hierarchy — the same axis that its descendants read to resolve their own colours. Collapsing to one variable means the Surface mode is the single source of that fact, and the mode inherits down the tree so a nested state-layer or content node can see what surface it is sitting on. Eight separate variables would let a frame's fill and its declared Surface mode disagree.

To paint a `bold` frame: bind `colour/surface/surface` to the fill **and** set `03 Surface` = `bold` on the frame.

`surface` is a group with exactly one leaf, on purpose — it keeps every direct child of `colour/` a collapsible group (`surface`, `content`, `content [surface]`, `interaction`, `logo`, `dataviz`, `elevation`, `components`), so every colour variable is exactly two segments deep within `colour/`.

## `colour/content/*` — 7 per-token variables

Path pattern `colour/content/{token}`, all `COLOR`. Unlike surface, these **are** per-token variables — a frame can hold several content nodes with different content tiers simultaneously, so the token has to be chosen per binding.

| Path | Scope | For |
|---|---|---|
| `colour/content/high` | `SHAPE_FILL`, `TEXT_FILL`, `STROKE_COLOR` | Primary text/icons, full opacity |
| `colour/content/medium` | `SHAPE_FILL`, `TEXT_FILL`, `STROKE_COLOR` | Secondary text/icons |
| `colour/content/low` | `SHAPE_FILL`, `TEXT_FILL`, `STROKE_COLOR` | Tertiary text — opacity solved to exactly 4.5:1 |
| `colour/content/tinted` | `SHAPE_FILL` | Brand-anchored fill, walked to ≥3.0:1. **Not text-safe** — hence no `TEXT_FILL` |
| `colour/content/tintedA11y` | `SHAPE_FILL`, `TEXT_FILL` | Brand-anchored, walked to ≥4.5:1 — the text-safe tinted |
| `colour/content/stroke medium` | `STROKE_COLOR` | Divider / border, 24–32% |
| `colour/content/stroke low` | `STROKE_COLOR` | Subtle divider, 12–16% |

Note the literal **space** in `stroke medium` / `stroke low`.

## `colour/content [surface]/*` — 8 surface tokens as content fills

Path pattern `colour/content [surface]/{surfaceToken}`, all `COLOR`, all scoped `SHAPE_FILL`, `TEXT_FILL`, `STROKE_COLOR`.

Tokens: `default`, `ghost`, `minimal`, `subtle`, `moderate`, `bold`, `elevated`, `blend`.

The group name contains a **literal space and square brackets** — `content [surface]`, not `content-surface` or `contentSurface`. Get this wrong and the lookup silently fails.

**It deliberately excludes `FRAME_FILL`.** Frames must keep binding the merged `colour/surface/surface` so their fill and their `03 Surface` mode stay in lockstep (see above). This group is for the *other* paints: an icon filled with the `bold` surface colour, a stroke drawn in `subtle`, a text run in `minimal`. Each of these variables is mode-invariant at `03 Surface` — `colour/content [surface]/bold` resolves to bold no matter what Surface mode the parent frame carries — which is exactly what lets one frame combine a `bold` fill, a `subtle` stroke and a `minimal` text fill without collision.

## `colour/interaction/*` — 3 variables

| Path | Type | Scope | For |
|---|---|---|---|
| `colour/interaction/stateLayer` | `COLOR` | `FRAME_FILL` | The translucent hover/pressed overlay frame |
| `colour/interaction/focusRing` | `COLOR` | `EFFECT_COLOR` | Outer focus ring shadow colour |
| `colour/interaction/focusRingOffset` | `COLOR` | `EFFECT_COLOR` | Inner focus ring gap colour |

All three resolve to invisible grey (`#808080` @ 0%) outside their active `06 Interaction state` mode — `stateLayer` is only visible at `hover`/`pressed`, the two focus-ring colours only at `focus`. Reading a resolved paint in the wrong state gives transparent grey, not "missing".

## `colour/logo/*` — 2 variables

| Path | Type | Scope | For |
|---|---|---|---|
| `colour/logo/logoMark` | `COLOR` | `FRAME_FILL`, `SHAPE_FILL` | The brand mark colour — the theme's primary scale at its pinned step |
| `colour/logo/onLogoMark` | `COLOR` | `FRAME_FILL`, `SHAPE_FILL` | On-mark text/shape — the primary scale at step 2500 |

Varies by `(brand, theme)` only. Immune to colour mode, appearance, surface, and parent step: a logo mark is the same colour on a dark page as on a light one.

## `colour/elevation/*` — 6 shadow colours

Path pattern `colour/elevation/{level}/{shadow}` — `{level}` ∈ `elevation1` | `elevation2` | `elevation3`, `{shadow}` ∈ `keyLight` | `softLight`. Type `COLOR`, scope `EFFECT_COLOR`.

All six are literal per-brand RGBA leaves. Consumed by the `elevation1` / `elevation2` / `elevation3` EffectStyles — prefer applying the style over hand-building the shadows.

## `colour/components/button/*` — 3 variables

| Path | Type | Scope |
|---|---|---|
| `colour/components/button/underlineHigh` | `COLOR` | `STROKE_COLOR` |
| `colour/components/button/underlineMedium` | `COLOR` | `STROKE_COLOR` |
| `colour/components/button/underlineLow` | `COLOR` | `STROKE_COLOR` |

Text-decoration colour for a button's underline, per interaction state. Note the Brand path segment is lowercase `button` even though the upstream Interaction-state group is `components/Button`. Scoped `STROKE_COLOR` because that is the picker Figma uses for underline colour.

This is the template for future per-component slots: COLOR tokens go under `colour/components/{component}/*`, FLOAT tokens under `interaction/components/{component}/*`.

## `colour/dataviz/*` — 149 chart colours

See the dedicated section below.

## `interaction/*` — FLOAT opacity and spread leaves

Top-level `interaction/` (a sibling of `colour/`, not inside it) is FLOAT-only.

| Path | Type | Scope | For |
|---|---|---|---|
| `interaction/disabled/disabledOpacity` | `FLOAT` | `OPACITY` | Bind to a node's opacity; `07 Disabled` mode drives it |
| `interaction/loading/invisibleOnLoading` | `FLOAT` | `OPACITY` | Hides an element while `08 Loading` = `true` |
| `interaction/loading/visibleOnLoading` | `FLOAT` | `OPACITY` | Reveals an element while `08 Loading` = `true` |
| `interaction/components/button/label` | `FLOAT` | `OPACITY` | Per-state label opacity |
| `interaction/components/button/icon` | `FLOAT` | `OPACITY` | Per-state icon opacity |
| `interaction/focusRing/spreadFocusRing` | `FLOAT` | `EFFECT_FLOAT` | = 4, outer ring spread |
| `interaction/focusRing/spreadFocusRingOffset` | `FLOAT` | `EFFECT_FLOAT` | = 2, inner gap spread |

Binding `interaction/disabled/disabledOpacity` to a node's opacity is what makes `07 Disabled` "applicable" to that node at all — the plugin detects the disabled/loading axes by looking for exactly these bindings on `opacity`.

## `effect/*` — elevation geometry and blur radii

New top-level group, sibling of `colour/`, `interaction/`, `dimensions/`, `typography/`. All `FLOAT`, all scoped `EFFECT_FLOAT`.

| Path pattern | Count | Notes |
|---|---|---|
| `effect/elevation/{level}/{shadow}/y` | 6 | Aliases Platform → Density — viewport- and density-fluid |
| `effect/elevation/{level}/{shadow}/blur` | 6 | Same chain |
| `effect/elevation/{level}/{shadow}/spread` | 6 | Literal leaf, `0` today |
| `effect/blurs/blurS` `/blurM` `/blurL` | 3 | Literal leaf radii (16 / 24 / 40), no upstream chain |

`{level}` ∈ `elevation1` | `elevation2` | `elevation3`; `{shadow}` ∈ `keyLight` | `softLight`.

Do not conflate `effect/*` with `interaction/focusRing/spread*` — the focus ring's spreads live under `interaction/` because the ring is an interaction affordance; elevation is not.

## `dimensions/*`

All `FLOAT`. All alias `09 Platform` → `11 Density` unless noted as a leaf.

| Path pattern | Scope | Tokens |
|---|---|---|
| `dimensions/spacings/{token}` | `WIDTH_HEIGHT`, `GAP` | 32: `0`, `0-5`, `1`, `1-5`, `2`, `2-5`, `3`, `3-5`, `4`, `4-5`, `5`, `5-5`, `6`, `7`, `8`, `9`, `10`, `12`, `14`, `16`, `18`, `20`, `24`, `28`, `32`, `40`, `48`, `64`, `80`, `120`, `160`, `200` |
| `dimensions/shape/{token}` | `CORNER_RADIUS` | 18: `0`, `pill`, `0-5`, `1`, `1-5`, `2`, `2-5`, `3`, `3-5`, `4`, `4-5`, `5`, `5-5`, `6`, `7`, `8`, `9`, `10`. `pill` is a **literal leaf** = 9999 |
| `dimensions/strokes/{token}` | `STROKE_FLOAT` | 13: `none`, `S`, `M`, `L`, `XL`, `2XL`, `3XL`, `4XL`, `5XL`, `6XL`, `7XL`, `8XL`, `9XL`. `none`–`2XL` are **literal leaves** (0 / 0.5 / 1 / 1.5 / 2 / 3 px, never scale); `3XL`–`9XL` alias dimension tokens and do scale |
| `dimensions/layout/grid/columns` | **`[]` — hidden from all pickers** | Integer metadata leaf at Platform |
| `dimensions/layout/grid/margin`, `…/gutter` | `WIDTH_HEIGHT`, `GAP` | Density-fluid |
| `dimensions/layout/grid/contentWidth`, `contentWidthExtended`, `contentHeight`, `contentHeightExtended` | `WIDTH_HEIGHT` | `extent − 2×margin`, and the `+1×gutter` tiling variant |
| `dimensions/layout/viewport/width/screenWidth`, `dimensions/layout/viewport/height/screenHeight` | `WIDTH_HEIGHT` | Full viewport extent, integer metadata at Platform |
| `dimensions/layout/viewport/width/{frac}`, `dimensions/layout/viewport/height/{frac}` | `WIDTH_HEIGHT` | 7 each: `1∕6`, `1∕4`, `1∕3`, `1∕2`, `2∕3`, `3∕4`, `5∕6` |
| `dimensions/spacingsNegative/-{token}` | **`GAP` only** | 14: `-0-5`, `-1`, `-1-5`, `-2`, `-2-5`, `-3`, `-3-5`, `-4`, `-4-5`, `-5`, `-5-5`, `-6`, `-7`, `-8` |

`dimensions/spacingsNegative/*` is scoped narrower than positive spacings **on purpose**: negative widths and heights are nonsensical, so the group is hidden from the width/height picker. Negative auto-layout gap (overlapping children) is the legitimate use.

## `typography/*`

| Path pattern | Type | Scope | Count |
|---|---|---|---|
| `typography/fontFamily/{category}` | `STRING` | `FONT_FAMILY` | 6 |
| `typography/fontSize/{category}/{size}` | `FLOAT` | `FONT_SIZE` | 28 |
| `typography/lineHeight/{category}/{size}` | `FLOAT` | `LINE_HEIGHT` | 28 |
| `typography/fontWeight/{category}/{size}/{semantic}` | `FLOAT` | `FONT_WEIGHT` | 84 |

`{category}` ∈ `display` | `headline` | `title` | `label` | `body` | `code`.
`{semantic}` ∈ `high` | `medium` | `low` — **every category exposes all three**, so every `fontWeight` path carries a semantic suffix. There is no bare `typography/fontWeight/{category}/{size}` form; historical ones were renamed to `/high`.

`{size}` per category:

| Category | Sizes (big → small) |
|---|---|
| `display` | `XL`, `L`, `M`, `S` |
| `headline` | `L`, `M`, `S` |
| `title` | `L`, `M`, `S` |
| `label` | `XL`, `L`, `M`, `S`, `XS`, `2XS`, `3XS` |
| `body` | `XL`, `L`, `M`, `S`, `XS`, `2XS` |
| `code` | `M`, `S`, `XS`, `2XS`, `3XS` |

Prefer applying the matching **TextStyle** (`{category}/{size}/{semantic}`, e.g. `label/M/high`) over binding these four variables by hand — the style already binds all four and stays in sync with the library.

There is no `typography/fontOpticalSizing/*` at Brand. The optical-sizing flag (`headline/S/high`, `title/S/high`) exists only as a STRING in `12 Language`.

---

## Name mangling — three rules

Variable paths are not the token names. Three transforms are applied before a token becomes a path segment, and getting one wrong is a silent lookup miss rather than an error.

### 1. `safeName` — `.` becomes `-`

Figma rejects `.` in variable names. Every half-step token is rewritten.

| Token | Path segment |
|---|---|
| `0.5` | `0-5` |
| `1.5` | `1-5` |
| `4.5` | `4-5` |

`dimensions/spacings/2.5` does not exist. `dimensions/spacings/2-5` does.

### 2. `paneSizeName` — `/` becomes `∕` (U+2215 DIVISION SLASH)

Figma treats `/` as a group separator, so a literal fraction would nest a folder. The division slash renders like a fraction but stays a flat leaf.

| Fraction | Path segment |
|---|---|
| `1/3` | `1∕3` |
| `2/3` | `2∕3` |
| `5/6` | `5∕6` |

`dimensions/layout/viewport/width/1∕3` is **one** leaf named `1∕3`, not a `1` folder containing a `3`. Copy the character; do not retype it.

### 3. Negative spacings — a literal leading `-`

The sign is a prefix on the already-`safeName`d token.

| Value | Path |
|---|---|
| −1 | `dimensions/spacingsNegative/-1` |
| −1.5 | `dimensions/spacingsNegative/-1-5` |
| −0.5 | `dimensions/spacingsNegative/-0-5` |

`-1-5` means **negative 1.5** — leading `-` is the sign, the internal `-` is rule 1's `.` substitution. It is visually ambiguous (you cannot tell `-1.5` from `-1` followed by `-5` from the string alone) but unambiguous in practice, because the only shape ever emitted is sign-then-`safeName(token)`.

---

## `colour/dataviz/*` — chart palettes

149 `COLOR` variables, all scoped `FRAME_FILL`, `SHAPE_FILL`, `TEXT_FILL`, `STROKE_COLOR` — pickable anywhere a solid colour goes. They vary by `(brand, theme, colour mode)` only, skipping accent, material, surface, media, and parent step entirely. Chart colours are authored, not computed; they must not drift with the surface they sit on.

| Group | Path pattern | Count | Reach for it when |
|---|---|---|---|
| `categorical` | `colour/dataviz/categorical/{bold\|hover\|subtle}/{1..12}` | 36 | Series are unordered and distinct — bar/line/pie series, legend swatches. `bold` is the resting fill, `hover` the emphasis, `subtle` the de-emphasised/background variant of the same series |
| `monochromatic` | `colour/dataviz/monochromatic/category{1..6}/{1..5}` | 30 | One series needs internal shading — stacked segments of a single category, five steps of one hue |
| `sequential` | `colour/dataviz/sequential/category{1..6}/{1..9}` | 54 | A quantity ramps low → high in one direction — heatmaps, choropleths, density. Nine stops, one hue family |
| `divergingSemantic` | `colour/dataviz/divergingSemantic/{negative5..negative1, neutral, positive1..positive5}` | 11 | Values diverge from a meaningful zero **and the direction carries good/bad meaning** — variance to budget, sentiment |
| `divergingBrand` | `colour/dataviz/divergingBrand/{negative5..negative1, neutral, positive1..positive5}` | 11 | Values diverge from a midpoint but the poles are **not** good/bad — correlation, above/below average |
| `core` | `colour/dataviz/core/{primary\|secondary\|sparkle}` | 3 | A single series that should read as the brand itself — a hero metric, a KPI sparkline |
| `neutral` | `colour/dataviz/neutral/neutralData` | 1 | Reference/comparison series, gridline data, "other" bucket |
| `semantic` | `colour/dataviz/semantic/{positive\|negative\|warning}` | 3 | A datum whose state is the point — a threshold breach, a gain/loss marker |

The two diverging groups have an identical 11-key shape. Stop order, verbatim, in emission order:

`negative5`, `negative4`, `negative3`, `negative2`, `negative1`, `neutral`, `positive1`, `positive2`, `positive3`, `positive4`, `positive5`

`negative5` is the extreme negative end and `positive5` the extreme positive end, with `neutral` at the midpoint. Both `categorical` and the `category{n}` groups are 1-indexed.

---

## Which scope table is authoritative

`resolveBrandScope` in `packages/figma-tokenator/src/generate.ts` is the **only** authority for scopes. It is path-prefix-based, which is what makes `dimensions/spacings/0` and `dimensions/shape/0` — or `typography/fontWeight/label/M/low` and `colour/content/low` — scope differently despite identical last segments.

`TOKEN_SCOPES` in `packages/figma-shared/src/collections.ts` is a **legacy parallel map** keyed on bare token names. It is not consulted by the generator and its entries do not all reflect current paths (`logoMark` / `onLogoMark` are keyed bare there, while the live path is `colour/logo/logoMark`). Do not quote it.

> Source: derived from `packages/figma-tokenator/src/generate.ts` (`resolveBrandScope`, `populateBrand`, `safeName`, `paneSizeName`, `populateLanguage`), `packages/figma-shared/src/collections.ts` (token lists, `DATAVIZ_PATHS`), and `packages/core/src/` (`dimensions.ts`, `shapes.ts`, `strokes.ts`, `panes.ts`, `typography.ts`).
