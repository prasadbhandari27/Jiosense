---
name: oneui-figma-foundations-core
description: >-
  Core OneUI foundations logic for Figma — mental model (axes vs Brand variables), the parent-step
  node invariant, node anatomy (Frame / StateLayer / content), token selection table, and the six
  silent corruption modes. Use whenever building, editing, auditing or debugging OneUI/Jio/Tira
  variable modes and Brand paint bindings in Figma. Prefer invoking via the `oneui-figma-foundations` skill (get_skill "oneui-figma-foundations")
  which routes to this and the supporting skills.
---

# OneUI foundations — core

Part of the OneUI Figma foundations skill set. For API mechanics, verification, colour maths,
collections, and the cascade script, the orchestrator `the `oneui-figma-foundations` skill (get_skill "oneui-figma-foundations")` tells
you which sibling skill to load.


# OneUI foundations in Figma

Applying this design system means setting **variable modes** on nodes and **binding Brand
variables** to paints. The plugin normally does it; this skill is for when you are working in the
file directly and it is not available.

Everything here is achievable through the public Plugin API. The hard part is not the API — it is
that a mistake produces a file that renders, just in the wrong colours, with nothing to indicate
anything went wrong. Verification is therefore part of the job, not a follow-up.

## Mental model

**Two kinds of thing.** *Axes* are variable collections whose mode is context (`01 Appearance`,
`03 Surface`, `10 Colour mode`, …). *Variables* are the values you bind (`colour/surface/surface`,
`dimensions/spacings/4`, …). You set modes on nodes; you bind variables to properties. Getting
these two confused is the most common structural error.

**Everything resolves to Brand.** `15 Brand` is the only collection you ever bind to. Every other
collection sits upstream of it in an alias chain, and each one's mode narrows what Brand resolves
to. So a single variable — `colour/surface/surface` — serves all eight surface tokens; which token
you get is decided by the node's `03 Surface` mode, not by binding a different variable.

**Modes inherit down the scene tree.** An unset axis resolves from the nearest ancestor that has
it, falling back to the page, falling back to the collection's first mode. Leaving an axis unset is
usually right — only pin what you actually mean to pin, or you freeze a value that should have
tracked its context.

**Page-level vs node-level.** Brand, theme, colour mode, density, platform and language are
normally set once on the page. Appearance, surface, material, media, interaction, disabled, loading
and the three parent-step collections are set per node.

**Appearance chooses the scale.** `bold`, `tinted` and `tintedA11y` anchor on a colour scale's
`base`/`darkerBase`, and which scale that is comes from `(theme, appearance)`. The same `bold`
token is indigo under `primary` and near-black under `neutral`.

## The invariant

Everything else in this skill exists to make this true. For each node:

1. If it **binds a fill or stroke**, it carries an explicit `16 Parent range` plus **exactly one**
   of `17 Parent ≤1200` / `18 Parent >1200`, and the other is cleared.
2. That step is **the step its parent resolves to** — not its own. Three exceptions:
   - token `default` → always `rootStep` (`2500` light, `200` dark); it is a hard reset.
   - a `bold` node whose appearance differs from its parent's, where the parent's appearance is
     not `neutral` → also `rootStep`.
   - a node at page root → `rootStep`.
3. If it does **not** bind a fill or stroke, it carries **no** parent-step modes and passes through.
4. Its fill is bound to the right Brand variable for what it is (surface / content / state layer).
5. Nothing inside an instance is touched.

`rootStep` is `2500` in light mode and `200` in dark. Range mode values are `2500-1300` and
`1200-100` — ASCII hyphens, unlike the `≤`/`>` in the collection display names.

## Node anatomy

A styled surface is usually three nodes, not one:

```
Frame                 fill → colour/surface/surface,  03 Surface = <token>
├─ StateLayer         fill → colour/interaction/stateLayer
│                     03 Surface CLEARED (must inherit), parent-step = the frame's resolved step
└─ Text / Icon        fill → colour/content/<token>,  no 03 Surface at all
```

The state layer is the one node that deliberately splits the two rules: **Surface inherited,
parent-step explicit**. It needs the frame's Surface mode so the chain selects the per-token
overlay variant (`bold` gets 24/32% where everything else gets 16/24%), but it needs its own
parent-step pinned to the frame's *resolved* step, because inheriting would pick up the frame's
modes, which describe the grandparent. Geometrically it covers the frame exactly: inside an
auto-layout parent give it `layoutPositioning = 'ABSOLUTE'` with both constraints stretched, so it
fills the frame without becoming a layout item and displacing the real content.

A **fillless wrapper** — a layout row, an icon container, a slot — carries no parent-step modes
*and no `03 Surface` mode either*. It binds nothing, so it has nothing to resolve; both would be
inherited noise that its descendants then read as if it were meaningful.

The focus ring is not a node — it is the `focusRing` EffectStyle, applied to the frame itself.

## Choosing tokens

| You want | Set | Bind |
|---|---|---|
| page background | `03 Surface` = `default` | `colour/surface/surface` |
| a card / raised panel | `minimal`, `subtle`, `moderate`, or `elevated` | `colour/surface/surface` |
| a filled brand element (button, badge, chip) | `bold` + `01 Appearance` = the brand role | `colour/surface/surface` |
| the brand's signature background | `bold` + appearance `brandBG` | `colour/surface/surface` |
| an invisible hit area that still takes a focus ring | `ghost` | `colour/surface/surface` |
| primary text | — | `colour/content/high` |
| secondary / tertiary text | — | `colour/content/medium` or `low` |
| a coloured-but-legible label on a tinted surface | — | `colour/content/tintedA11y` |
| a border | — | `colour/content/stroke medium` or `stroke low` |
| text or an icon in a *surface* colour | — | `colour/content [surface]/<token>` |
| hover / pressed feedback | a StateLayer child; `06 Interaction state` on the frame | `colour/interaction/stateLayer` |
| a glass surface over media | `04 Material` = `transparent`, `05 Media` = the backdrop | same surface variable |

Appearance values: `neutral primary secondary sparkle brandBG positive negative warning informative`.
Surface tokens: `default ghost minimal subtle moderate bold elevated blend`.
Content tokens: `high medium low tinted tintedA11y "stroke medium" "stroke low"`.

For sizes, always bind rather than typing numbers: `dimensions/spacings/*` for padding and gaps,
`dimensions/shape/*` for radii, `dimensions/strokes/*` for stroke weight. Typography and elevation
ship as ready-made styles — apply the TextStyle (`{category}/{size}/{semantic}`) or the EffectStyle
(`focusRing`, `elevation1`–`3`, `blurS/M/L`) instead of rebuilding them from variables.

Reaching a *published library's* styles is harder than reaching its variables — Figma has no
enumeration API for them. Load `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-writing-to-figma.md")` (section 6b) for the
three ways to get one and the variable-level fallback for when you cannot, which is never blocking.

## Six ways to corrupt a file silently

Each of these renders fine and is wrong.

1. **Never recurse into an instance.** An instance's interior mirrors its main component; modes
   written on sublayers fight the component and survive as unexplainable overrides. Walk up to the
   main component instead, or stop and say so.
2. **Never stamp a fillless wrapper.** Parent-step modes on a fillless COMPONENT propagate through
   Figma's main-tree resolution into every instance sublayer and *beat* the correct outer write.
   Layout frames, icon wrappers and slots pass through untouched.
3. **Always clear the inactive Parent collection.** Writing `18` without clearing `17` leaves a
   stale step that the chain can still resolve through when a node later crosses the boundary.
4. **The parent-step modes describe the parent, not the node.** Writing a node's own resolved step
   there shifts every colour beneath it by one level. This is the single easiest mistake to make.
5. **Pass the VariableCollection object, never an ID string.** The ID-string overload of
   `setExplicitVariableModeForCollection` is deprecated and throws.
6. **Preload fonts before touching `12 Language` or typography.** Changing which family resolves
   makes Figma re-resolve every bound text style and load the result; if that font is not loaded,
   the *mode write itself* throws.

Two more worth knowing: `GROUP` and `BOOLEAN_OPERATION` are pass-through containers — recurse into
them at the same step, never treat them as leaves, or their entire subtree is orphaned. And never
overwrite a user's image, gradient or video fill; if a node has a non-SOLID paint, leave it
completely alone.

## Micro-example

Light mode, MyJio. Three frames and a label:

```
Screen   surface=default            → parent-step 2500   → resolves 2500  (#ffffff)
 Card    surface=minimal            → parent-step 2500   → resolves 2400  (#f5f5f6)
  Button surface=bold, appearance=primary
                                    → parent-step 2400   → resolves  600  (#3900ad)
   Label content/high               → parent-step  600   → resolves 2500  (#ffffff)
```

Each node receives what its parent resolved to. Button's `bold` anchors on indigo's base (600)
because the candidate is far enough from the parent to be legible on it.

`get_skill_reference("oneui-figma-foundations", "references/oneui-figma-worked-example.md")` runs this four levels deeper, including the bold-on-different-
appearance case and the state layer, with every value computed rather than estimated.

## Executing

Default path: the Figma MCP's `use_figma`, which runs a `code` string with the `figma` global
bound. Load Figma's own `figma-use` skill before calling it. It is atomic — a thrown error makes
zero changes — and capped at 50,000 characters. `console.log` produces no output; build a report
object and `return` it.

1. Load `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-writing-to-figma.md")` first if you have not. Reaching a *published
   library's* collections takes a specific four-hop sequence and there is no shortcut; this is what
   defeats most first attempts.
2. Set the page-level modes.
3. Build the tree, binding fills as you go.
4. Load `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-cascade.md")` and run with `apply: false` to see the parent-step
   chain it would write, then again with `apply: true`. **That skill is not a Node script** — edit
   its CONFIG block and pass its contents as `code`.
5. Load `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-verify.md")` and run it. Do not skip this.

If `use_figma` is unavailable, the consumer plugin is the fallback. If neither is available, emit a
per-node table of modes and bindings for a designer to apply by hand rather than guessing — the
invariant above is the contract regardless of who executes it.

**Stop and escalate** when: an instance's interior needs modes its main component does not have; an
instance reads as unreachable (property access on sublayers throws); the work spans pages (page
context resets per call — do one page per call); or the library is not enabled in the file. Do not
create local look-alike variables as a workaround — they will not track the library.


## Sibling skills (load as needed)

| Skill | When |
|---|---|
| `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-writing-to-figma.md")` | Before writing modes/bindings — Plugin API, library discovery, fonts |
| `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-verify.md")` | After cascade, reparent, or theme switch |
| `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-worked-example.md")` | Check a chain against a fully derived example |
| `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-collections-and-modes.md")` | Exact collection names and mode strings |
| `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-brand-variables.md")` | Which Brand variable to bind |
| `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-appearance-and-themes.md")` | Theme pins, anchors, brandBG, bold-diff |
| `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-resolution-maths.md")` | Predict or debug a specific colour |
| `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-size-and-typography.md")` | Spacing, shape, stroke, type, elevation, blur |
| `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-scale-colours.md")` | Hex for every scale step |
| `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-cascade.md")` | Bulk parent-step write across a subtree |
