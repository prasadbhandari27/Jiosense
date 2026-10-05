---
name: oneui-figma-writing-to-figma
description: >-
  Figma Plugin API mechanics for OneUI foundations — reaching published library collections, setting variable modes, binding paints, font preloading, and symptom → cause → fix. Use before writing any OneUI modes or Brand bindings in a Figma file.
---

# Writing to Figma

Part of the OneUI Figma foundations set. Invoke the orchestrator `the `oneui-figma-foundations` skill (get_skill "oneui-figma-foundations")` for the full workflow, or this skill when you only need this topic. Core rules live in `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-foundations-core.md")`.

# Writing to Figma

The mechanics of applying OneUI through the Figma Plugin API. The rest of this skill says *what must be true*; this says *how to make it true* — and which calls silently do the wrong thing when you get them slightly wrong.

## 1. The execution surface

`use_figma` takes a `code` string (max **50,000** characters) and runs it with the `figma` global bound. It is the plugin console without the manifest, the build step, or the install — the full Plugin API, executed against one file (`fileKey`).

**Load the `figma-use` skill before calling `use_figma`.** It is a documented prerequisite, and it carries the layout/text gotchas this document does not repeat.

Rules that shape every script you write here:

- **`return` is the only output channel.** `console.log()` is not returned. `figma.notify()` throws `"not implemented"`. Build a report object and return it: `return { wrote: [...], skipped: [...], resolved: {...} }`. If you don't return what you observed, you didn't observe it.
- **Atomic.** A thrown error means the script did not execute — zero changes to the file. So a failed call is safe to fix and retry; there are no half-written nodes to clean up. Corollary: put a read-back assertion at the end of a write script and `throw` if it fails, and the bad write rolls itself back.
- **Auto-wrapped in an async context.** Use top-level `await` and top-level `return`. Do not wrap in `(async () => {})()`, do not call `figma.closePlugin()`.
- **Page context resets between calls.** `figma.currentPage` is the first page at the start of every invocation. `figma.currentPage = page` **throws**; use `await figma.setCurrentPageAsync(page)`, and call it **at most once per invocation**. Multi-page work = N parallel `use_figma` calls, one page each.
- **Forbidden here** (available to a real plugin, unsupported in `use_figma`): `setPluginData`, `loadAllPagesAsync`, `createImageAsync`. None are needed to apply OneUI — every piece of state this system reads lives in variable modes, not pluginData. That is by design (see the "default to Figma-native, not pluginData" rule in the consumer plugin), and it is why the plugin's logic ports to `use_figma` at all.

## 2. Reaching a published library's collections — the four-hop dance

**`getLocalVariableCollectionsAsync()` does NOT return library collections.** Importing a library variable does not make its collection local either. In a consumer file that subscribes to the OneUI library, the local list is empty or irrelevant — and this is the single most common reason a first attempt concludes "the collections aren't there" and starts creating duplicates.

The chain, hop by hop. Each hop exists because the previous one hands you strictly less than you need:

```js
// HOP 1 — library collection descriptors. name + key + libraryName ONLY.
//         No modes, no variables, no IDs you can write with.
const libColls = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
const lib = libColls.find(c => c.name === '15 Brand');

// HOP 2 — variable descriptors inside it. name + key + resolvedType ONLY.
//         Still not a Variable — you cannot bind a descriptor.
const libVars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(lib.key);
const desc = libVars.find(v => v.name === 'colour/surface/surface');

// HOP 3 — import by KEY to get a real Variable, local to this file.
const variable = await figma.variables.importVariableByKeyAsync(desc.key);

// HOP 4 — the Variable's collection ID, then the collection OBJECT.
//         Only now do you have `.modes`, i.e. name → modeId.
const coll = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
const modeId = coll.modes.find(m => m.name === 'Jio').modeId;   // ← what a write needs
```

Hop 4 is the point of the whole exercise: **`setExplicitVariableModeForCollection` needs a `modeId`, and a modeId only exists on a collection object.** Mode names (`'dark'`, `'bold'`, `'2500'`) are what you reason in; modeIds are what the API takes.

Do all of this **once**, in a discovery call, and return a `{ collectionName: {id, modes: {name: modeId}} }` map plus a `{ varName: key }` map. Later calls re-derive the objects from those IDs/keys. Batch the imports with `Promise.all` — sequential `await` inside a loop is one IPC round-trip per variable and is the dominant cost of a cold start.

### Fallback when `figma.teamLibrary` is unavailable

The bundled `figma-use` reference contradicts itself on this: `variable-patterns.md` documents the calls above, while `api-reference.md` lists `figma.teamLibrary.*` under "What Does NOT Work" (needs the team-library backend). Probe it, and have a fallback ready — in a file that already *uses* the library, you don't need `teamLibrary` at all:

```js
// Any node already bound to a OneUI variable is a doorway into the whole tree.
const node = figma.currentPage.findOne(n => n.boundVariables?.fills?.length);
const id   = node.boundVariables.fills[0].id;             // local VariableID
const v    = await figma.variables.getVariableByIdAsync(id);
const coll = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId);

// And every collection in that node's alias chain is a key of resolvedVariableModes:
for (const collId of Object.keys(node.resolvedVariableModes)) {
  const c = await figma.variables.getVariableCollectionByIdAsync(collId);  // works for library collections
  // → c.name ('10 Colour mode', '17 Parent ≤1200', …), c.modes
}
```

`getVariableCollectionByIdAsync` works on library collection IDs even though those collections never appear in the local list. This is exactly how the consumer plugin discovers all 19 collections, and it is the more robust route in a file that already has OneUI applied anywhere.

## 3. Setting a mode

```js
node.setExplicitVariableModeForCollection(collection, modeId);   // collection OBJECT
node.clearExplicitVariableModeForCollection(collection);          // back to inherited
```

**Pass the `VariableCollection` object, not an ID string.** The ID-string overload is deprecated; it throws in dynamic-page contexts, and — worse — on synthetic instance sublayers it can **silently no-op**: no throw, no effect, and a cascade that looks like it ran. Cache the collection objects from your discovery call and pass those.

`PageNode` supports the same two methods. Setting a mode on the page is how newly-created frames inherit the right context without touching each one.

### `explicitVariableModes` vs `resolvedVariableModes`

| | What it holds |
|---|---|
| `node.explicitVariableModes` | Only what is **pinned on this node**. `{}` on a node that inherits everything. `collId in explicitVariableModes` is the authoritative "did someone deliberately set this?" test. |
| `node.resolvedVariableModes` | What the node **actually resolves to** after walking up the scene tree to the page — a superset, containing every collection in the chain. |

You need both, constantly: read `resolved` to learn the context you are resolving against, read `explicit` to decide whether you're allowed to overwrite. Writing an inherited value back as explicit is a real bug — it converts an inheriting node into a pinned one, and the next page-level change silently stops reaching it.

Two caveats from production: `resolvedVariableModes` does **not** surface modes set on an instance's main component, and on a just-created instance it may be empty or hold a mode ID that resolves to no name. Don't treat a freshly created node's resolved modes as settled; re-read after the tree quiesces, or read the ancestors' explicit modes directly.

## 4. Binding a variable to a paint

```js
const fills = node.fills === figma.mixed ? [] : [...node.fills];
const base  = fills[0]?.type === 'SOLID'
  ? { ...fills[0] }
  : { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };      // placeholder; the variable supplies the colour
node.fills = [figma.variables.setBoundVariableForPaint(base, 'color', variable), ...fills.slice(1)];
```

Three things at once, all easy to miss:

- **`setBoundVariableForPaint` returns a NEW Paint.** It does not mutate. Discard the return value and nothing happens.
- **`fills` is a read-only array.** Clone → modify → reassign the whole array. Mutating `node.fills[0]` is a no-op.
- **A node with `fills = []` has nothing to bind to.** Supply the placeholder SOLID as above. The bound variable's resolved value — including a transparent one — takes over from the placeholder colour.

Only SOLID paints accept a colour binding; gradients and images throw. Strokes work identically via `node.strokes`.

## 5. What else is bindable

`node.setBoundVariable(field, variable)` — pass the `Variable` object (the ID-string form is deprecated), or `null` to unbind.

| Target | Fields | How |
|---|---|---|
| Layout / spacing | `itemSpacing`, `counterAxisSpacing`, `gridRowGap`, `gridColumnGap`, `paddingLeft/Right/Top/Bottom` | `setBoundVariable` |
| Size | `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight` | `setBoundVariable` |
| Radii | `topLeftRadius`, `topRightRadius`, `bottomLeftRadius`, `bottomRightRadius` — **there is no bindable `cornerRadius`**; bind all four | `setBoundVariable` |
| Strokes | `strokeWeight`, `strokeTopWeight`, `strokeRightWeight`, `strokeBottomWeight`, `strokeLeftWeight` | `setBoundVariable` |
| Misc | `opacity`, `visible`, `characters` | `setBoundVariable` |
| Text | `fontFamily`, `fontSize`, `fontStyle`, `fontWeight`, `lineHeight`, `letterSpacing`, `paragraphSpacing`, `paragraphIndent` | `setBoundVariable` |
| Paint colour | `color` | `setBoundVariableForPaint` (returns new Paint) |
| Effects | `color`, `radius`, `spread`, `offsetX`, `offsetY` | `setBoundVariableForEffect` (returns new Effect; `effects` is a whole-array replace) |
| Layout grids | `sectionSize`, `count`, `offset`, `gutterSize` | `setBoundVariableForLayoutGrid` (returns new LayoutGrid) |

> **Correction to the bundled reference.** `figma-use/references/variable-patterns.md` states: *"Not bindable via setBoundVariable: `fontSize`, `fontWeight`, `lineHeight` — set these directly on text nodes."* **That is wrong.** All three are members of `VariableBindableTextField` in `plugin-api-standalone.d.ts` (lines 5729-5737), alongside `fontFamily`, `fontStyle`, `letterSpacing`, `paragraphSpacing`, `paragraphIndent` — and `setBoundVariable` is typed `field: VariableBindableNodeField | VariableBindableTextField`. The OneUI library itself binds exactly these fields: every generated TextStyle binds `fontFamily`, `fontSize`, `fontWeight`, and `lineHeight` to Brand variables. Do not route typography through TextStyles because of that line.
>
> Still **prefer applying the shipped TextStyle** (`node.textStyleId = styleId`) when you want a whole composite — one assignment carries all four bindings, plus letter-spacing, and stays correct if the library republishes. Reach for the individual bindings when you need one axis alone (a bespoke size on an otherwise-styled node), not as the default.

## 6. `resolveForConsumer` — ask Figma instead of predicting

```js
const { value, resolvedType } = variable.resolveForConsumer(node);
// value: {r,g,b,a} for COLOR, number for FLOAT, string for STRING
```

Resolves the variable through its **full alias chain**, under **that node's actual mode stack** — every explicit mode on the node, plus everything inherited from its ancestors and the page. For OneUI this is the escape hatch from re-implementing the resolution maths: rather than predicting what `colour/surface/surface` becomes at `bold` × `primary` × `dark` × `parent 2400`, pin the modes on a throwaway node and ask.

Use it to **verify** after a write (resolve the same variable on the node you just wrote and confirm the colour), and to **derive** values you would otherwise hardcode from a possibly-stale copy of the spec.

**It works on imported library variables** — a genuine exception to §8's rule that imported `Variable` objects throw on property access. `resolveForConsumer` resolves internally without touching the throwing accessors. Verified against the live library; it returns values byte-identical to the node's rendered fill.

## 6b. Styles from a published library — and what to do when you cannot get one

The design system ships TextStyles (`{category}/{size}/{semantic}`), EffectStyles (`focusRing`,
`elevation1`–`3`, `blurS/M/L`) and one GridStyle (`grid`). Applying them is preferable to
rebuilding their contents — the styles bind Brand variables internally, so they follow brand,
density, platform and colour mode for free.

Getting hold of one in a **consumer** file is harder than getting a variable, and the difference
is a real API gap rather than an oversight:

**There is no `getAvailableLibraryStylesAsync`.** `figma.teamLibrary` enumerates variable
collections only. `getLocalTextStylesAsync()` / `getLocalEffectStylesAsync()` return only styles
local to the file. So there is no way to *browse* a subscribed library's styles from a script.

Three ways to get one, best first:

```js
// 1. Harvest from a node that already uses it — the most reliable route in a
//    consumer file, and free of any key bookkeeping.
const donor = figma.currentPage.findOne(n => n.type === 'TEXT' && n.textStyleId);
await target.setTextStyleIdAsync(donor.textStyleId);

// 2. Import by key, if you have one. Keys are stable across republishes, so a
//    manifest of them from the library file is worth keeping.
const style = await figma.importStyleByKeyAsync(key);   // → BaseStyle
await target.setTextStyleIdAsync(style.id);

// 3. Local styles, when the file IS the library.
const styles = await figma.getLocalTextStylesAsync();
const s = styles.find(x => x.name === 'label/M/high');
```

Note the setters are the async forms — `setTextStyleIdAsync`, `setEffectStyleIdAsync`,
`setGridStyleIdAsync`. The plain `textStyleId` property is read-only under dynamic-page access.

**If you cannot reach the style, you are not blocked.** Every style is a thin wrapper over Brand
variables, so bind those directly:

| Instead of | Bind |
|---|---|
| TextStyle `{cat}/{size}/{semantic}` | `typography/fontFamily/{cat}` (STRING), `typography/fontSize/{cat}/{size}`, `typography/lineHeight/{cat}/{size}`, `typography/fontWeight/{cat}/{size}/{semantic}` — all four via `setBoundVariable` (see §5; they *are* bindable) |
| EffectStyle `focusRing` | two `DROP_SHADOW` effects at offset (0,0), radius 0, `showShadowBehindNode: false`; colours `colour/interaction/focusRing` and `colour/interaction/focusRingOffset`, spreads `interaction/focusRing/spreadFocusRing` (4) and `spreadFocusRingOffset` (2). **Order matters:** the ring goes at `effects[0]`, the smaller-spread offset at `effects[1]` — later indices paint on top, and reversing them collapses the two-tone ring into one solid halo |
| EffectStyle `elevation{1,2,3}` | two `DROP_SHADOW`s — `effects[0]` = softLight, `effects[1]` = keyLight — with `color`, `offsetY`, `radius`, `spread` bound to `colour/elevation/{level}/{shadow}` and `effect/elevation/{level}/{shadow}/{y,blur,spread}` |
| EffectStyle `blur{S,M,L}` | one `BACKGROUND_BLUR` with `radius` bound to `effect/blurs/blur{S,M,L}`. Fields are `type`, `radius`, `visible` **only** — the runtime rejects `blendMode` here even though the shared `Effect` type exposes it |

Say which route you took. A hand-built equivalent tracks the same variables and renders
identically, but it is not the same object as the style, so it will not pick up a future change to
the style's own composition.

## 7. Fonts

Setting the `12 Language` mode — or anything else that changes which family a bound `typography/fontFamily/*` variable resolves to — makes Figma **re-resolve every bound text style and text node** and load the resulting `(family, style)` pair. If that font isn't loaded, **the mode write itself throws**:

```
Error in setExplicitVariableModeForCollection: unloaded font 'Noto Sans Medium'
```

Note what that means: the failure is on the *mode write*, on a collection that has nothing to do with the text node that triggered it. It reads like a mode bug. It is a font bug.

Preload before any Language or typography mode write — **every variant**, because you don't control which `(family, style)` combination Figma's re-resolution picks:

```js
const families = new Set(['JioType Var', 'Noto Sans', 'JetBrains Mono']);   // the spec's families
const all = await figma.listAvailableFontsAsync();
await Promise.all(
  all.filter(f => families.has(f.fontName.family))
     .map(f => figma.loadFontAsync(f.fontName).catch(() => {}))
);
```

Separately: **any write to a text node requires that node's *current* font loaded first** — even a write that replaces the font, and even a write to an unrelated property. Read the current fonts with `node.getStyledTextSegments(['fontName'])` and load those; don't assume Inter. Style names are file-dependent (`"Semi Bold"`, not `"SemiBold"`) — verify with `listAvailableFontsAsync()` rather than from memory.

## 8. Failure modes

| Symptom | Cause | Fix |
|---|---|---|
| Mode write throws `Cannot call setExplicitVariableModeForCollection with …`, or silently does nothing on an instance sublayer | Passed a collection **ID string**. The overload is deprecated; on synthetic sublayers it no-ops without throwing | Pass the `VariableCollection` object. Cache objects from discovery |
| Library collection absent from `getLocalVariableCollectionsAsync()`; scripts conclude it must be created | That API returns **only truly local** collections. Importing a library variable does not make its collection local | §2 — four-hop dance, or discover via a bound node's `resolvedVariableModes` keys |
| `Error: in get_id: …` (or `get_name`, `get_valuesByMode`) on a variable that imported fine | **Imported `Variable` objects throw on every property access.** The object is a handle, not data | Never read `.id` / `.name` / `.variableCollectionId` / `.valuesByMode` off one. Safe uses: `setBoundVariableForPaint`, `node.setBoundVariable(field, imported)`, `resolveForConsumer(node)`. To get a usable local ID, bind it to a throwaway paint and read `paint.boundVariables.color.id` |
| An import that worked earlier stops working later in a long session | The imported `Variable` JS object **expires** when Figma flushes its registry | Store the library **key**, re-import with `importVariableByKeyAsync(key)` immediately before use. Fast path `getVariableByIdAsync`, async fallback re-import |
| `Cannot write to node with unloaded font 'X Y'` — raised by a *mode* write | Mode change re-resolved a bound font family to an unloaded variant | §7 — preload every variant of every spec family before the mode write |
| `The variable collection with id "…" does not exist`, for a collection that plainly exists; everything stops working | **Multiplayer reconnect** (look for `ERR_NETWORK_CHANGED` / `[MultiplayerSession] connecting` just before). Figma rebuilt its registry; your cached `VariableCollection` proxies are dead. The **ID is still valid** — only the JS object is stale | Re-fetch: `getVariableCollectionByIdAsync(id)`. Evict and rehydrate the cache; the next action succeeds. Cheap guard: `try { void col.modes } catch { /* refetch */ }` before use |
| A node renders a **stale library value**; native drag-drop of the same variable gives the correct one; reloading the plugin/tool does **not** help | Figma's **tab-level** cache of resolved library values. Independent of your session — every import goes through it | **Full tab reload (Cmd-R).** Nothing scriptable fixes it. This masquerades as stale caches, orphan locals, unaccepted library updates, and key churn — so make *"does a full tab reload fix it?"* the first question, not the last |
| Binding a fill appears to do nothing | Node had `fills = []` — no paint to bind to; or the returned Paint was discarded; or `node.fills[0]` was mutated in place | §4 — placeholder SOLID, capture the return, reassign the whole array |
| Script "succeeded" but you can't tell what it did | `console.log` isn't returned; `figma.notify()` throws | Return a report object with node IDs, values written, and read-back resolutions |
| Node ID from an earlier call not found | Page context reset to page 1 between calls | `await figma.setCurrentPageAsync(page)` at the top of each call that targets a non-default page (once per call) |

> Source: derived from the bundled `figma-use` skill (`SKILL.md`, `references/variable-patterns.md`, `references/api-reference.md`, `references/gotchas.md`, `references/plugin-api-standalone.d.ts`), the `use_figma` tool schema, `packages/figma-oneui-plugin/src/apply.ts` (`preloadSpecFonts`, `setExplicitMode`, `clearExplicitMode`, `discoverCollectionsFromNode`, `ensureLibVar`), and the "Figma — shared library API behaviours" section of `CLAUDE.md`.
