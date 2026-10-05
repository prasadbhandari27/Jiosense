---
name: oneui-figma-collections-and-modes
description: >-
  All OneUI Figma variable collections, every mode string, and the alias chain. Use when you need exact collection or mode names for setting modes on pages or nodes.
---

# OneUI collections and modes

Part of the OneUI Figma foundations set. Invoke the orchestrator `the `oneui-figma-foundations` skill (get_skill "oneui-figma-foundations")` for the full workflow, or this skill when you only need this topic. Core rules live in `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-foundations-core.md")`.

# Collections and modes

19 variable collections. The numeric prefix is part of the collection name — Figma sorts the sidebar alphabetically, and the prefix is the only thing forcing the intended order.

**The first mode in each list is Figma's default.** A node with no explicit mode for a collection resolves that collection's first mode. This is universal — it applies to every collection without exception. Leaving an axis unset is therefore not "undefined"; it is "whatever mode 0 says", inherited down the scene tree.

## All 19 collections

| Collection name (verbatim) | Modes, in order (first = default) |
|---|---|
| `01 Appearance` | `neutral`, `primary`, `secondary`, `sparkle`, `brandBG`, `positive`, `negative`, `warning`, `informative` |
| `02 Accent` | `none`, `neutral`, `primary`, `secondary`, `sparkle`, `brandBG`, `positive`, `negative`, `warning`, `informative` |
| `03 Surface` | `default`, `ghost`, `minimal`, `subtle`, `moderate`, `bold`, `elevated`, `blend` |
| `04 Material` | `solid`, `transparent` |
| `05 Media` | `dynamic`, `dark`, `light` |
| `06 Interaction state` | `idle`, `hover`, `pressed`, `focus` |
| `07 Disabled` | `false`, `true` |
| `08 Loading` | `false`, `true` |
| `09 Platform` | `S – 360`, `M – 768`, `L – 1024`, `L – 1440`, `L – 1920` |
| `10 Colour mode` | `light`, `dark` |
| `11 Density` | `default`, `compact`, `open` |
| `12 Language` | `latin`, `others` |
| `13.1 Theme range [Jio]` | `A–M`, `N–Z` |
| `13.2 Theme (A–M) [Jio]` | 15 themes — see below |
| `13.3 Theme (N–Z) [Jio]` | 10 themes — see below |
| `14 Theme [Tira]` | `Tira` |
| `15 Brand` | `Jio`, `Tira` |
| `16 Parent range` | `2500-1300`, `1200-100` |
| `17 Parent ≤1200` | `1200`, `1100`, `1000`, `900`, `800`, `700`, `600`, `500`, `400`, `300`, `200`, `100` |
| `18 Parent >1200` | `2500`, `2400`, `2300`, `2200`, `2100`, `2000`, `1900`, `1800`, `1700`, `1600`, `1500`, `1400`, `1300` |
| `19 Primitives` | `Value` |

### Characters that are easy to get wrong

| Where | Character | Not |
|---|---|---|
| `09 Platform` modes — `S – 360` | ` – ` = space, **en dash U+2013**, space | hyphen `-`, em dash `—`, no spaces |
| `13.1` modes and `13.2`/`13.3` names — `A–M`, `N–Z` | **en dash U+2013**, no spaces | `A-M`, `A — M` |
| `17 Parent ≤1200` | **`≤` U+2264** | `<=`, `≦` |
| `18 Parent >1200` | ASCII `>` | `≥`, `＞` |
| `16 Parent range` mode **values** — `2500-1300`, `1200-100` | **ASCII hyphen `-`** | en dash |

The last row is the trap: the Parent *collections* are named with `≤` / `>`, but the Parent *range* collection's mode values use a plain ASCII hyphen. The two conventions sit one row apart in Figma's UI and do not match.

Note `09 Platform` has two `L` breakpoints beyond 1024 and labels 1024 itself as `L`, not `M` — the size-class prefix is `S / M / L / L / L`, not `S / M / M / L / L`.

## Jio's split Theme collections

Figma caps a collection at 20 modes; Jio has 25 themes. They are split across two leaf collections merged by a 2-mode range collection — the same pattern as `17`/`18`/`16`.

**`13.2 Theme (A–M) [Jio]`** (15 modes, in order):

`MyJio`, `JioAICloud`, `JioAllianz`, `JioBlackRock`, `JioBusiness`, `JioCX`, `JioFinance`, `JioFit`, `JioGames`, `JioHealthHub`, `JioHome`, `JioMart`, `JioMeals`, `JioMessages`, `JioMobile`

`MyJio` is deliberately first — it is therefore the default mode of `13.2`, and since `13.1` defaults to `A–M`, it is the file-wide default theme. The remaining 14 are alphabetical.

**`13.3 Theme (N–Z) [Jio]`** (10 modes, in order):

`JioNews`, `JioPC`, `JioSaavn`, `JioSarthi`, `JioStar`, `JioThings`, `JioTranslate`, `JioTV`, `JioWave`, `JioWorkspace`

### Bucketing rule (`getJioThemeBucket`)

1. Strip a leading `Jio` prefix if present.
2. Uppercase the first remaining character.
3. `<= 'M'` → `A–M`; otherwise → `N–Z`.

So the bucket is decided by the *product* name, not the literal first letter of the theme string:

| Theme | Tail after stripping `Jio` | Bucket letter | Half |
|---|---|---|---|
| `MyJio` | `MyJio` (no `Jio` prefix — used as-is) | `M` | `A–M` |
| `JioMobile` | `Mobile` | `M` | `A–M` |
| `JioNews` | `News` | `N` | `N–Z` |
| `JioAICloud` | `AICloud` | `A` | `A–M` |

Both `MyJio` and `JioMobile` land in `A–M` because `M <= M`.

### Writing a Jio theme takes three writes

`13.1 Theme range [Jio]` selects **which half is honoured**. To pin a Jio theme on a node you must:

1. Set `13.1 Theme range [Jio]` to `A–M` or `N–Z` per the bucket rule.
2. Set the mode on the matching half collection (`13.2` or `13.3`).
3. **Clear the explicit mode on the other half collection.** A stale explicit mode on the inactive half will be read back later and resolve the wrong theme.

Tira needs none of this — `14 Theme [Tira]` is a single collection with one mode. Setting a Jio theme and a Tira theme on the same node is harmless (only the one matching `15 Brand` is consulted), but the plugin convention is to clear the inactive brand's Theme collection too.

## Alias chain

`15 Brand` is the leaf — the only collection consumers bind to. Everything else is upstream: each collection's variables alias into the next, and the chain terminates in literal values at `19 Primitives`.

### Main colour chain

```
15 Brand
  └─ 10 Colour mode
       └─ 02 Accent
            ├─(colour/surface, colour/content, colour/content [surface])
            │    └─ 04 Material
            │         └─ 03 Surface
            │              ├─(solid)       13.1/13.2/13.3 or 14 Theme [Brand]
            │              │                    └─ 01 Appearance
            │              │                         └─ 16 Parent range
            │              │                              └─ 17 Parent ≤1200  ┐
            │              │                              └─ 18 Parent >1200  ├─ 19 Primitives
            │              └─(transparent) 05 Media ─────────────────────────┘
            └─(colour/interaction only)
                 └─ 06 Interaction state
                      └─ 04 Material  (rejoins the chain above)
```

In prose: a Brand colour variable resolves through Colour mode, then Accent. From Accent, surface/content tokens go straight to Material; interaction tokens detour through **`06 Interaction state`** first and rejoin at Material. Material picks solid or transparent. Surface picks the surface token. For **solid**, the chain continues into the active brand's Theme collection, then Appearance (which selects the colour scale), then the Parent range/step collections (which supply the parent's resolved step, the input to all surface maths), and finally Primitives. For **transparent**, `05 Media` is a terminal branch — it aliases straight into Primitives' transparency variants and **never touches Appearance or the Parent collections**. Transparent material has no parent-step awareness by design.

### Documented deviations

| Group | Deviation |
|---|---|
| `colour/interaction/*` | Routes through `06 Interaction state` between Accent and Material. That collection also collapses the upstream `stateLayerHover` + `stateLayerPressed` pair into a single `stateLayer` variable via its 4 modes. |
| `colour/content [surface]/*` | **Mode-invariant at `03 Surface`**: all 8 Surface modes alias to the same upstream variable for that token. So `colour/content [surface]/bold` is bold regardless of what the parent frame's Surface mode is. That is the whole point — it lets one frame carry a `bold` fill, a `subtle` stroke, and a `minimal` text fill at once. |
| `02 Accent` | **Pass-through today.** Every accent mode aliases to the same target. It is emitted so the infrastructure exists, but the consumer plugin never reads or writes it. Do not set it. |
| `10 Colour mode` | Also a pass-through for the colour chain (light and dark alias the same target) — dark mode is expressed through the Parent-step collections, not here. It is still set on nodes so the active mode is visible in `resolvedVariableModes` for dev handoff. It is **not** pass-through for `colour/dataviz/*`, where light and dark genuinely differ. |
| `colour/logo/*` | Skip-the-chain: `15 Brand` → Theme [Brand] **directly**. No Colour mode, Accent, Material, Surface, Appearance, or Parent. Varies by `(brand, theme)` only. |
| `colour/dataviz/*` | Skip-the-chain: `15 Brand` → `10 Colour mode` → Theme [Brand]. Varies by `(brand, theme, colour mode)` only. |
| `colour/components/button/*`, `interaction/components/button/*` | Skip-the-chain: `15 Brand` → `06 Interaction state` directly. Varies by `(brand, interaction state)` only. |
| `interaction/disabled/*` | `15 Brand` → `07 Disabled` (standalone FLOAT leaf collection). |
| `interaction/loading/*` | `15 Brand` → `08 Loading` (standalone FLOAT leaf collection). |
| `interaction/focusRing/spread*`, `effect/elevation/*/spread`, `effect/blurs/*`, `colour/elevation/*`, `dimensions/shape/pill`, fixed `dimensions/strokes/*` | Literal leaf values written directly into `15 Brand` per brand mode. No upstream collection at all. |

### Size chain

```
15 Brand → 09 Platform → 11 Density → (literal px)
```

`dimensions/*` variables alias to Platform, which aliases to Density, which holds the resolved pixel value per density mode. Because Platform sits above Density, one Brand variable resolves fluidly across both viewport breakpoint and density with no consumer involvement.

`dimensions/layout/grid/columns` and `dimensions/layout/viewport/{width,height}/screen{Width,Height}` stop at Platform — they are device metadata integers, density-invariant.

### Typography chain

```
15 Brand → 12 Language → 09 Platform → 11 Density → (literal px)
```

Typography inserts `12 Language` ahead of Platform. Only `typography/fontSize/*` and `typography/lineHeight/*` continue past Language into Platform → Density; `typography/fontFamily/*` and `typography/fontWeight/*` are **leaf values in `12 Language`** (family is a per-language STRING; weight is a per-language FLOAT that happens to be identical across languages today).

## Page-level vs node-level axes

Every axis is inherited through the scene tree. An explicit mode on any node applies to that node and all its descendants until another explicit mode overrides it; the page node is the top of that chain, and the collection's first mode is the fallback below that.

| Axis / collection | Usual home | Why |
|---|---|---|
| `15 Brand` | Page | One brand per file/page. |
| `13.1 Theme range [Jio]` + half, or `14 Theme [Tira]` | Page | One theme per page; per-frame themes are legal but unusual. |
| `10 Colour mode` | Page | Light/dark is a whole-canvas decision. |
| `11 Density` | Page | Density is an app-wide setting. |
| `09 Platform` | Page | The breakpoint you are designing at. |
| `12 Language` | Page | Script direction is a locale decision. |
| `01 Appearance` | Node | Per-component brand meaning (a primary button inside a neutral card). |
| `03 Surface` | Node | The surface token this specific frame paints. |
| `04 Material` | Node | Solid vs transparent is per-component (a button on media). |
| `05 Media` | Node | Only meaningful on the transparent path. |
| `06 Interaction state` | Node | Per-component state (a hovered button). |
| `07 Disabled`, `08 Loading` | Node | Per-component state. |
| `16 Parent range`, `17 Parent ≤1200`, `18 Parent >1200` | Node (and Page) | Carries the **parent's resolved step** into a node. Written on the page so root frames inherit the right root step, and re-pinned on every node whose surface context differs from its parent's. |

**Only set what you mean to pin.** An explicit mode is sticky: it stops inheriting, so a later page-level change (switching theme, flipping to dark) will not reach that node or its subtree. Setting an axis to the value it already resolves to is not a no-op — it converts an inheriting node into a pinned one. The three Parent collections are the exception; they carry computed context, not user intent, and are meant to be written explicitly wherever the surface chain requires it.

## Variable-name prefixes in upstream collections

Variables in collections `01`–`14` carry a display prefix so Figma's panel is readable — e.g. `[surface] Jio/solid/surface`, `[media] Jio/surface/subtle`, `[parent <=1200] …`. The prefix is part of the stored name but is display-only; it is never part of the path you reason about. `15 Brand` and `19 Primitives` render bare, with no prefix.

Every collection from `01 Appearance` through `15 Brand` also carries a self-reference STRING variable at the top named after the collection (`appearance`, `accent`, `surface`, …, `brand`) whose value per mode is the mode name — useful for showing the active mode in a dev-handoff text layer. `09 Platform`'s self-ref is the exception: its value is the numeric width only (`360`, `768`, …), with the `S – ` / `M – ` / `L – ` prefix stripped. Collections `16`–`19` have no self-ref.

> Source: derived from `packages/figma-shared/src/collections.ts`, `packages/figma-tokenator/src/generate.ts` (`generateVariables`, `populateSurface`, `populateAccent`, `populateColourMode`, `populateMedia`, `populateBrand`, `populateLanguage`), and `packages/core/src/themes.ts` (`BRANDS`).
