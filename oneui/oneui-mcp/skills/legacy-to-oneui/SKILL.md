---
name: legacy-to-oneui
description: >-
  Rebuild a frame that was built with an old/legacy Figma component library, recreating it from scratch using ONLY components from OneUI Components and OneUI Micropatterns, with every colour, spacing, radius and stroke bound to OneUI Foundations tokens. Orchestrator: loads the OneUI foundations skills itself and gates on a deep, fail-closed library audit. Use when the user asks to recreate, rebuild or migrate a selected frame with OneUI.
category: figma-design
---

# Rebuild Frame with OneUI

The selected frame was built with an old/legacy Figma component library. This skill recreates it
from scratch, and owns the job end to end: it loads the foundations skills itself, maps every legacy
component by intent before building anything, and gates completion on two fail-closed audits.

Everything placed comes from exactly two component libraries:

- **OneUI Components** (library key: lk-591df3aa712480d79162be60e949bd96010101dd8d121ef35ab4f4dcc70a25cf5301bc6ce18c927d02a6393741baf482d7d3280b4c9ad67f01b097fc2eac4414)
- **OneUI Micropatterns** (library key: lk-a82dde6620196fa82e2fbb6746efec7c431b32029ee9d42e9dc27e478974393afb2544f38eddf216fb434d2c6412bb6f6544aa16b6c821c244a5b715decd3975)

Variables, tokens and variable modes come from a third library (variables only, no components):

- **OneUI Foundations** (library key: lk-db0aef660e3947c35f277f5359e05ed2677a5ca4ade53e3bca827f7b5f91648dd7ac07ac4af13be473859852d98f378795d92e66cf6da5111f88bc086643e299)

---

## The contract

Five rules, in precedence order. Every one of them has a gate further down; **R1** is the reason the
other four exist.

| Rule | Contract | Gate |
|---|---|---|
| **R1** | **Pixel-accurate to the reference.** Measure it; never estimate it | Definition of Done gate 3 |
| **R2** | **Map every legacy component by design purpose before building anything** | Definition of Done gate 1 |
| **R3** | **OneUI Components and Micropatterns only** — never reuse or reference a legacy instance | Deep library audit |
| **R4** | **Every colour, padding, gap, radius and stroke weight bound** to the token that matches the measured value | Token-binding audit |
| **R5** | **Fill, stroke, effects, selection colours, position and auto-layout are read-only** on OneUI instances — props and variants only | Token-binding audit (`OVERRIDE` class) |

**When rules appear to conflict, precedence is `R1 → R2 → R3 → R4 → R5`.** Fidelity never licenses a
raw value, a foreign component or an override — if the reference cannot be matched within these
rules, say so rather than breaking one.

Theme differences are expected — the OneUI theme is not the legacy theme. Layout is not.

Two things that look like rules are **procedure**, and live in the Workflow: which skills to load
(Phase 0) and the root-frame variable modes (Step 7).

---

## Workflow

### Phase 0 — load these skills before you start

This skill loads them **itself**. Do not wait for the user to ask, and do not proceed without them.

| When | Load | Why |
|---|---|---|
| After the inventory, **before** the component pass — screen structure is decided first | `get_skill_reference("oneui-definitions", "references/oneui-micropatterns-definition.md")` | Decides **which OneUI Micropattern** each screen-level region becomes: header, bottom nav, tab group, select, context menu, chat input, chat bubble, carousel, list row. Owns the structural disambiguation rules (HeaderNative vs HeaderWeb, BottomNav vs TabGroup, Select vs ContextMenu, which ChatInput variant, Carousel vs aspect-ratio preset, Slot vs Spacer) and the **slot** contract |
| After the micropattern pass, for every element that is not itself a micropattern | `get_skill_reference("oneui-definitions", "references/oneui-components-definition.md")` | Decides **which OneUI component** each legacy one becomes, by intent. Owns the component disambiguation rules (Icon vs IconContained vs IconButton, Badge vs CounterBadge, Modal vs BottomSheet vs SideSheet, bare control vs `…Field`) |
| Before any script runs | `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-writing-to-figma.md")` | Every mode write, collection import and paint binding here fails silently when written the obvious way |
| Before placing components, and again after | `the `oneui-figma-foundations` skill (get_skill "oneui-figma-foundations")` | The foundations contract: variable modes, Brand bindings, `Surface` discipline, parent-step cascade, read-only audit. Routes to its own sub-skills |
| Before binding padding, gap, radius or stroke | `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-size-and-typography.md")` | The spacing / shape / stroke families, and the px → token reverse lookup R4 depends on |
| Before binding any colour | `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-brand-variables.md")` | Authoritative Brand paths and Figma scopes, plus colour semantics (`tinted` vs `tintedA11y`) |
| When mapping legacy fill tokens to Appearance + Surface modes | `get_skill_reference("oneui-definitions", "references/oneui-surface-color-token-mapping.md")` | Converts `color/{scaleName}/{step}` from the reference frame into `01 Appearance` and `03 Surface` mode values. Handles both palette steps (multiples of 100) and compact steps (multiples of 10). Carries the theme lookup table |

**No hardcoded values — tokens from the OneUI Foundations library only.** That is R4, and the two
token skills above are how you satisfy it. A raw hex or a raw pixel number is never the fallback when
a path cannot be found; the correct move is to load the token skill and find the real path.

The foundations orchestrator is **not optional and not a post-step only**. Load it *before* placing
components, and run its verify *after*. A rebuild that swaps every component correctly but skips
foundations produces a OneUI tree in the wrong colours.

### Prop values: the skills the user invokes

**Which thing to place and what to set on it are different questions.** This skill loads
`oneui-micropatterns-definition` and `oneui-components-definition` for the *choice*. The *values*
come from the JDS v3 → OneUI migration skills, which **this skill does not auto-load** — the user
invokes them.

Router: `get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-migration-figma-agent.md")`. Or ``jds-v3-oneui-`` plus
the family: **actions-and-triggers** (any button, ButtonGroup, SearchTrigger) · **form-controls**
(Checkbox, Radio, Switch) · **form-fields** (Input, Select) · **selection-controls** (Chip,
SegmentedControl, Tabs) · **navigation** (Header, BottomNavigation) · **overlays** (BottomSheet,
Modal/Dialog, SideSheet) · **feedback** (Toast, Tooltip) · **status-indicators** (Badge, CounterBadge,
progress, Spinner) · **media-and-identity** (Icon, IconContained, Image, Avatar, Logo) ·
**structure-and-separators** (Breadcrumbs, Divider, Scrim) · **lists-and-collections** (ListItem,
ContextMenu, Carousel) · **disclosure-and-paging** (Accordion, Pagination).

They carry the real prop/variant tables, default-value differences and lossy-mapping notes — they
turn "old Button" into a correctly configured OneUI Button instead of a guess. Watch the traps they
exist to catch: `Emphasis` → `attention` changes the *default* (JDS `Medium` vs OneUI `high`),
several size scales shrink, and some JDS families collapse into one OneUI component.

**If one is loaded, follow it. If not, ask** — or state plainly which values you inferred without a
table. A component choice with no prop source is a choice plus a set of guesses; never present an
unmapped swap as a completed migration.

### The steps

Each step names the rule that defines it — follow the rule, not a paraphrase.

| # | Step | Defined by |
|---|---|---|
| 0 | Load `oneui-micropatterns-definition`, `oneui-components-definition`, `oneui-figma-writing-to-figma` and `oneui-figma-foundations-figma-agent` yourself, before you need them | Phase 0 |
| 1 | View the selected frame thumbnail to read the layout | — |
| 2 | Inventory the reference frame at full depth — components, props, text, layout metrics, and **which elements are interactive** (clickability decides several mappings) | R2 Phase A |
| 3 | Fingerprint the legacy component keys — **same traversal as step 2, one call**. This must happen before the rebuild; the keys are the denylist that later proves provenance | R2 Phase A / audit Stage 1 |
| 4 | Map by intent — **micropatterns first** (screen-level regions), then components for what is left — and produce the mapping table. **No generation starts until every row has a target** | R2 Phase B |
| 5 | Confirm those micropatterns and components exist and resolve their exact names via the explore-design-systems subagent, and build the OneUI allowlist while you are there | Audit Stage 2 |
| 6 | Recreate the frame with `create_design`, passing the old frame as `references.nodeIds` and the mapping table as the instruction set (brief below) | R2 Phase C |
| 7 | Set the root-frame modes and read the returned SET/SKIP log | Step 7 below |
| 8 | Deep library audit — repair outermost-first, re-run until the gate passes, and check the report's own integrity numbers before believing a zero | R3, audit Stages 3–7 |
| 9 | Token-binding audit — fix every unbound value and every token that does not match its measured px. Re-run until zero | R4 |
| 10 | Foundations pass — surface/appearance modes, parent-step cascade, then the read-only verify. Part of the rebuild, not an extra | Phase 0 |
| 11 | Screenshot to confirm the layout matches and brand/colour-mode switching still resolves | Done gate 5 |

### Step 6 — the brief you pass to `create_design`

**It must say all of this explicitly**, or the design agent will not do it:

- Use ONLY OneUI library components and micropatterns.
- **Place every `Kind: Micropattern` row as that micropattern instance.** Do NOT hand-assemble a
  header, bottom nav, tab group, select, context menu, chat input or carousel out of individual
  components — the mapping table already decided this, and a hand-built one passes every audit while
  still being wrong. Where a micropattern exposes a **slot**, put its children in the slot rather
  than beside the instance.
- Set every icon by **name, copied from the reference frame** — the legacy library and OneUI share
  the `core/jiotokens` asset library, so the same name exists on both sides. Leave nothing at its
  default placeholder glyph.
- Do NOT write hardcoded colours on any node or instance child; fills and strokes keep their library
  bindings. Do NOT set explicit `15 Brand` or `13.2 Theme` modes on instances — let them inherit.
- Do NOT edit fill, stroke, effects, selection colours, position or auto-layout on any OneUI
  instance. Change its look through props and variants only. Those panels are yours to set on frames
  you create and on custom components you build — nowhere else.
- Bind every padding and gap to `dimensions/spacings/*`, every radius to `dimensions/shape/*` (all
  four corner fields — `cornerRadius` is not bindable), every stroke weight to `dimensions/strokes/*`.
  No raw pixel numbers. Tokens come from OneUI Foundations via `15 Brand` only. Half-steps are
  written `0-5`, not `0.5`.

### Step 7 — set the root-frame default modes

**Runs immediately after the root frame exists, before any component placement.** These are the
**default values** — if the user provides explicit values, use those instead.

**These collections come from the OneUI Foundations library — it is the single source of truth for
every collection and mode listed below.**

- OneUI Foundations library key (for reference/identification): `lk-db0aef660e3947c35f277f5359e05ed2677a5ca4ade53e3bca827f7b5f91648dd7ac07ac4af13be473859852d98f378795d92e66cf6da5111f88bc086643e299`
- ⚠️ **Do NOT filter collections by `libraryKey`.** In practice the `libraryKey` field comes back `undefined` on the returned collections, so key-based filtering matches 0 collections. **Match collections by name instead** (see the normalisation helper below).
- ⚠️ **Dash characters matter.** Several collection names use an **en-dash (–), not a hyphen (-)** — e.g. the real name is `13.2 Theme (A–M) [Jio]`. Normalise all dash variants before comparing names, or the lookup silently fails.

#### Default variable modes (from OneUI Foundations library)

| Variable Collection        | Default Mode | Notes                                                       |
| -------------------------- | ------------ | ----------------------------------------------------------- |
| **01 Appearance**          | `neutral`    | Controls the visual appearance/emphasis                     |
| **03 Surface**             | `default`    | Controls surface emphasis level                             |
| **10 Colour mode**         | `light`      | Light mode is the default                                   |
| **15 Brand**               | `Jio`        | Jio brand theming                                           |
| **13.2 Theme (A–M) [Jio]** | `MyJio`      | MyJio theme under Jio brand — note the **en-dash** in `A–M` |
| **09 Platform**            | `S – 360`    | **Mobile rebuilds only.** Sets the fluid base to 16 — this is what makes the px → token lookup in R4 divide by 4. En-dash, spaces both sides. For a web/desktop rebuild set the breakpoint you are designing at instead |
| **11 Density**             | `default`    | **Mobile rebuilds only.** Base 16 at 360. `compact` = 14, `open` = 18 — either changes the divisor |

#### How to apply

Use `evaluate_script` to set these modes on the root frame node. Resolve the collections **by name** —
first from the collections already imported into the file, then from the team library as a fallback:

```javascript
// Normalise names before comparing: collapse every dash variant (– — ‑ ‒ −) to "-",
// collapse whitespace, lowercase. This is what makes "13.2 Theme (A–M) [Jio]" match.
const norm = (s) =>
  (s || "")
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const DEFAULT_MODES = {
  "01 Appearance": "neutral",           // not "auto (neutral)"
  "03 Surface": "default",
  "10 Colour mode": "light",
  "15 Brand": "Jio",
  "13.2 Theme (A\u2013M) [Jio]": "MyJio",  // en-dash
  // Mobile rebuilds: pin the dimension base at 16 so px / 4 = token (R4).
  // Drop these two for a web/desktop rebuild and set the real breakpoint instead.
  "09 Platform": "S \u2013 360",           // en-dash, space either side
  "11 Density": "default",
};

const frame = await figma.getNodeByIdAsync(frameId);

// Preload every variant of every spec family BEFORE any mode write. Setting
// `15 Brand` / `13.2 Theme` re-resolves bound typography/fontFamily/* variables,
// and if the resulting font is not loaded the MODE WRITE ITSELF throws.
// Every brand's families, not just Jio's — switching `15 Brand` to Tira re-resolves
// fontFamily to "PP Object Sans", and the MODE WRITE ITSELF throws if it is unloaded.
const FAMILIES = new Set(["JioType Var", "Noto Sans", "JetBrains Mono", "PP Object Sans"]);
const availableFonts = await figma.listAvailableFontsAsync();
await Promise.all(
  availableFonts
    .filter((f) => FAMILIES.has(f.fontName.family))
    .map((f) => figma.loadFontAsync(f.fontName).catch(() => {}))
);

const byName = new Map(); // norm(name) -> VariableCollection

// 1. Truly local collections. NOTE: this does NOT include library collections —
//    importing a library variable does not make its collection local.
for (const c of await figma.variables.getLocalVariableCollectionsAsync()) {
  byName.set(norm(c.name), c);
}

// 2. Best route in this file: every collection in a bound node's alias chain is
//    a key of `resolvedVariableModes`, and getVariableCollectionByIdAsync works
//    on library collection IDs even though they never appear in the local list.
//    Once OneUI instances exist on the frame, this finds all 19 Foundations
//    collections with no import and no teamLibrary dependency.
const donors = [frame, ...frame.findAll(() => true)].filter(
  (n) => n.resolvedVariableModes && Object.keys(n.resolvedVariableModes).length
);
for (const donor of donors) {
  for (const collId of Object.keys(donor.resolvedVariableModes)) {
    try {
      const c = await figma.variables.getVariableCollectionByIdAsync(collId);
      if (c && !byName.has(norm(c.name))) byName.set(norm(c.name), c);
    } catch (e) {
      // stale proxy or unreachable collection — skip
    }
  }
  if (Object.keys(DEFAULT_MODES).every((n) => byName.has(norm(n)))) break;
}

// 3. Last resort: teamLibrary. Match by NAME — `libraryKey` is undefined here.
let libCollections = [];
if (!Object.keys(DEFAULT_MODES).every((n) => byName.has(norm(n)))) {
  try {
    libCollections =
      await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
  } catch (e) {
    // teamLibrary unavailable in this context
  }
}

const results = [];

for (const [collectionName, modeName] of Object.entries(DEFAULT_MODES)) {
  const want = norm(collectionName);
  let collection = byName.get(want);

  if (!collection) {
    const libCollection = libCollections.find((c) => norm(c.name) === want);
    if (!libCollection) {
      results.push(`SKIP ${collectionName}: collection not found`);
      continue;
    }
    const vars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      libCollection.key
    );
    if (!vars.length) {
      results.push(`SKIP ${collectionName}: library collection is empty`);
      continue;
    }
    // An imported Variable is a HANDLE, not data: reading `.variableCollectionId`
    // (or .id / .name / .valuesByMode) THROWS. Bind it to a throwaway node and
    // read the local VariableID back off the binding instead.
    //
    // The probe MUST be typed. `setBoundVariableForPaint` throws
    //   "can only bind color variables to color"
    // when handed a FLOAT/STRING variable — and most of these collections return a
    // non-COLOR variable first, so probing `vars[0]` blindly fails on every one.
    const colorDesc = vars.find((v) => v.resolvedType === "COLOR");
    const floatDesc = vars.find((v) => v.resolvedType === "FLOAT");
    if (!colorDesc && !floatDesc) {
      results.push(`SKIP ${collectionName}: no COLOR/FLOAT variable to probe with`);
      continue;
    }
    const probe = figma.createRectangle();
    try {
      let localId;
      if (colorDesc) {
        const imported = await figma.variables.importVariableByKeyAsync(colorDesc.key);
        probe.fills = [
          figma.variables.setBoundVariableForPaint(
            { type: "SOLID", color: { r: 0, g: 0, b: 0 } },
            "color",
            imported
          ),
        ];
        localId = probe.fills[0].boundVariables.color.id;
      } else {
        const imported = await figma.variables.importVariableByKeyAsync(floatDesc.key);
        probe.setBoundVariable("opacity", imported);
        localId = probe.boundVariables.opacity.id;
      }
      const v = await figma.variables.getVariableByIdAsync(localId);
      collection = await figma.variables.getVariableCollectionByIdAsync(
        v.variableCollectionId
      );
      byName.set(want, collection);
    } finally {
      probe.remove();
    }
  }

  const mode = collection.modes.find((m) => norm(m.name) === norm(modeName));
  if (!mode) {
    results.push(
      `SKIP ${collectionName}: mode "${modeName}" not in [${collection.modes
        .map((m) => m.name)
        .join(", ")}]`
    );
    continue;
  }

  frame.setExplicitVariableModeForCollection(collection, mode.modeId);
  results.push(`SET ${collection.name} -> ${mode.name}`);
}

return results.join("\n");
```

Notes — only what is specific to this script. The API mechanics behind it (imported variables are
handles, `getLocalVariableCollectionsAsync()` omits library collections, pass the collection
**object** not an ID string, preload fonts before a Brand/Theme write) are in *Figma API mechanics
that bite* below and in `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-writing-to-figma.md")`.

- **`libraryKey` comes back `undefined`** from `getAvailableLibraryVariableCollectionsAsync()`, so
  filtering by the Foundations key matches 0 collections. Match by name through `norm()`; the key
  stays in this doc only to identify the library.
- **En-dash vs hyphen** — the real name is `13.2 Theme (A–M) [Jio]`. Compare through `norm()`, never
  against a literal.
- **Read the returned `SET`/`SKIP` log** rather than assuming success; a name or mode mismatch fails
  silently and the rebuild continues in the wrong brand.

#### Overrides

User intent beats every default: "dark mode" → `10 Colour mode` = `dark`, "Tira" → `15 Brand` =
`Tira`, likewise theme, appearance, surface. Unnamed axes keep their default. Children inherit —
never set these per component.

Full collection and mode list: `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-collections-and-modes.md")`. Only the 7 above
go on the root frame.

**`09 Platform` and `11 Density` are non-negotiable on a mobile rebuild.** They fix the base at 16.
Leave them inheriting and the same token renders a different size, and R4's px → token arithmetic
silently stops being valid.

---

## R1 — Pixel-accurate fidelity to the reference

**Highest priority. Every rule below exists to serve this one.** The rebuild reproduces the
reference frame's padding, gaps, spacing and element positions **exactly**.

- **Measure, never estimate.** No rounding, no "close enough", no component default left in place
  because it looked about right.
- **Every layout metric comes off the reference** — the four paddings, `itemSpacing`,
  `counterAxisSpacing`, position offsets. R2 Phase A returns them.
- **Bind the token that reproduces the measurement**, via `token = px / 4` at mobile base 16 (R4).
  Reference 16 px padding → `dimensions/spacings/4`. Reference 12 px gap → `dimensions/spacings/3`.
  Never the raw number. Never a different token that "looks close".
- **Positions come from your own auto-layout frames** — parent padding and gap — never from nudging
  an instance's x/y, which R5 forbids.

**Right components + wrong or unbound spacing = failed rebuild.** Definition of Done gates 3 and 4
enforce it.

---

## R2 — Analyse, then map, then build

**No node is created until the mapping table in Phase B exists.** Building first and mapping
afterwards is how a rebuild ends up with an IconButton where the old frame had a decorative icon:
visually close, semantically wrong, and **invisible to the library audit**, because the instance
genuinely is a OneUI component. R3 cannot catch a correctly-sourced wrong component. This rule is the
only thing that does.

| Phase | What happens | Gate before moving on |
|---|---|---|
| **A — Analyse** | Inventory every component in the reference frame at full depth | Inventory is non-empty and its depth matches the visible nesting |
| **B — Map** | Load `get_skill_reference("oneui-definitions", "references/oneui-micropatterns-definition.md")` and `get_skill_reference("oneui-definitions", "references/oneui-components-definition.md")`; resolve screen structure to micropatterns first, then every remaining row to a component | Every row has a target, or an explicit "no equivalent — build from primitives" note |
| **C — Build** | Step 7 root modes, then placement | — |

### Phase A — inventory the reference frame

Walk the **full depth**, crossing INSTANCE boundaries, recording what each legacy component *is* and
*does*. Set `figma.skipInvisibleInstanceChildren = false` first, or legacy nodes hide inside
collapsed and hidden variants.

⚠️ **`setPluginData` is unsupported in `use_figma` and throws.** `return` is the only reliable
output channel in this skill. This script therefore does the inventory **and** the legacy-key
fingerprint (audit Stage 1) in one traversal and **returns both**, treating storage as best-effort.
Do not split them into two calls, and do not depend on the write landing.

```javascript
figma.skipInvisibleInstanceChildren = false;

const legacy = await figma.getNodeByIdAsync(LEGACY_FRAME_ID);
const inventory = [];
const keys = new Set();
const names = new Set();

for (const inst of legacy.findAllWithCriteria({ types: ["INSTANCE"] })) {
  const main = await inst.getMainComponentAsync();
  const set = main && main.parent && main.parent.type === "COMPONENT_SET" ? main.parent : null;

  // Shared `core/jiotokens` glyphs (ic_* / ps_*) are used by BOTH the legacy library
  // and OneUI — the Icon Assets rule requires carrying the same names across. Putting
  // them on the denylist makes every correctly-migrated icon report VIOLATION_LEGACY,
  // which is why a faithful rebuild could never clear the audit's zero gate.
  const assetName = set ? set.name : (main ? main.name : "");
  const isSharedAsset = /^(ic_|ps_)/.test(assetName);

  if (main) { if (!isSharedAsset) keys.add(main.key); names.add(main.name); }
  if (set)  { if (!isSharedAsset) keys.add(set.key);  names.add(set.name); }

  let props = {};
  try {
    props = Object.fromEntries(
      Object.entries(inst.componentProperties || {}).map(([k, v]) => [k, v.value])
    );
  } catch (e) {}

  inventory.push({
    id: inst.id,
    node: inst.name,
    component: main ? main.name : null,
    componentSet: set ? set.name : null,
    props,
    text: inst.findAll((n) => n.type === "TEXT").map((n) => n.characters).slice(0, 5),
    x: Math.round(inst.x), y: Math.round(inst.y),
    w: Math.round(inst.width), h: Math.round(inst.height),
  });
}

// --- Layout metrics: padding, gap and radius live on the FRAMES between the
// instances, so the instance walk above never sees them. Measure them here and
// pre-resolve each one to its token, so Phase B maps sizes instead of guessing.
// Mobile only: Step 7 pins Platform S-360 x Density default => base 16 => px = 4 x token.
const SPACING = [0,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,7,8,9,10,12,14,16,18,20,24,28,32,40,48,64,80,120,160,200];
const SHAPE   = [0,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,7,8,9,10];
const seg = (n) => String(n).replace(".", "-");          // 4.5 -> "4-5"
const tok = (px, scale, family, minSide) => {
  if (px == null || typeof px !== "number") return null;
  // A fully rounded shape is `pill` (fixed 9999), not an arithmetic result.
  if (family === "shape" && minSide && px * 2 >= minSide - 0.5) {
    return { px, quotient: null, token: "dimensions/shape/pill", exact: true, offGridNote: null };
  }
  const q = px / 4;                                       // the mobile divisor
  const exact = scale.includes(q);
  const near = scale.reduce((a, b) => (Math.abs(b - q) < Math.abs(a - q) ? b : a));
  const capped = family === "shape" && q > 10;            // shape has no token above 10 (40px)
  return {
    px,
    quotient: q,
    token: `dimensions/${family}/${seg(near)}`,
    exact: exact && !capped,
    offGridNote: capped
      ? `${px}px exceeds the shape cap (shape/10 = 40px) — use shape/10, or shape/pill if it reads fully rounded`
      : exact ? null : `off-grid: ${px}px -> ${q}, snapped to ${near} (${near * 4}px)`,
  };
};

const layout = [];
for (const n of legacy.findAllWithCriteria({ types: ["FRAME", "COMPONENT", "INSTANCE"] })) {
  const auto = n.layoutMode && n.layoutMode !== "NONE";
  const radii = [n.topLeftRadius, n.topRightRadius, n.bottomLeftRadius, n.bottomRightRadius];
  const hasRadius = radii.some((r) => typeof r === "number" && r > 0);
  if (!auto && !hasRadius) continue;
  layout.push({
    id: n.id,
    node: n.name,
    type: n.type,
    layoutMode: auto ? n.layoutMode : null,
    padding: auto ? {
      left: tok(n.paddingLeft, SPACING, "spacings"),
      right: tok(n.paddingRight, SPACING, "spacings"),
      top: tok(n.paddingTop, SPACING, "spacings"),
      bottom: tok(n.paddingBottom, SPACING, "spacings"),
    } : null,
    gap: auto ? {
      itemSpacing: tok(n.itemSpacing, SPACING, "spacings"),
      counterAxisSpacing: tok(n.counterAxisSpacing, SPACING, "spacings"),
    } : null,
    radius: hasRadius ? (() => {
      const min = Math.min(n.width, n.height);
      return {
        topLeft: tok(n.topLeftRadius, SHAPE, "shape", min),
        topRight: tok(n.topRightRadius, SHAPE, "shape", min),
        bottomLeft: tok(n.bottomLeftRadius, SHAPE, "shape", min),
        bottomRight: tok(n.bottomRightRadius, SHAPE, "shape", min),
      };
    })() : null,
  });
}

// Best-effort only — never let a storage failure lose the fingerprint.
let stored = false;
try {
  figma.root.setPluginData("oneui.legacyKeys", JSON.stringify([...keys]));
  figma.root.setPluginData("oneui.legacyNames", JSON.stringify([...names]));
  stored = true;
} catch (e) {}

return JSON.stringify({
  count: inventory.length,
  stored,
  legacyKeys: [...keys],
  legacyNames: [...names],
  inventory,
  layout,
  offGrid: layout.flatMap((l) =>
    [l.padding, l.gap, l.radius].filter(Boolean)
      .flatMap((g) => Object.values(g).filter((v) => v && v.offGridNote)
        .map((v) => ({ node: l.node, ...v })))
  ),
}, null, 2);
```

**If `stored` comes back `false`, nothing is lost — but you must carry the list forward yourself.**
Paste the returned `legacyKeys` array into `INLINE_LEGACY_KEYS` in the audit's Stage 3 deep scan.
Losing the denylist is what turns the audit into a rubber stamp; a failed write is not a reason to
skip it.

If `count` is 0 on a frame that visibly contains components, the walk failed. Fix it before
continuing; an empty inventory makes every mapping decision below a guess.

**`layout` answers "which spacing token?" — carry it into Phase B.** Each entry holds the measured
px, the quotient and the token to bind, so R4 becomes a lookup, not a judgement call. Report every
`offGrid` row rather than rounding it away — those are the legacy frame off-grid, not a missing
token.

⚠️ **The divisor is 4 only because this is a mobile rebuild.** Different `09 Platform` / `11 Density`
→ `tok()` is wrong: load `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-size-and-typography.md")` and use
`token = px / (base / 4)`.

### Phase B — map every row to a OneUI micropattern or component

**Two passes, in this order. Load both definition skills now.**

#### B1 — structure first: `get_skill_reference("oneui-definitions", "references/oneui-micropatterns-definition.md")`

**Micropatterns are decided before components, and the order is not cosmetic.** A micropattern is
the *arrangement* — a Header is not a Button, it is the structure that holds buttons, logos and
tabs. Resolve those regions first, because a header hand-assembled from a Frame plus three
IconButtons passes every audit in this skill: the parts are all genuine OneUI components, so R3
sees no violation, R4 sees bound tokens, and the rebuild is still wrong. **Nothing downstream
catches a missed micropattern. This pass is the only thing that does.**

Walk the reference frame's *regions* — not its leaves — and ask what each one structurally is:

| The reference region… | Micropattern |
|---|---|
| App bar at the top of a native/mobile screen | `HeaderNative` |
| Site header on a web/desktop layout | `HeaderWeb` |
| One nav link or tab inside a header | `Header.Item` |
| Persistent bar switching 2–5 top-level destinations | `BottomNav` |
| Switches content sections *within* a view | `TabGroup` |
| Dropdown that picks one value in a form | `Select` |
| Floating menu of actions or options | `ContextMenu` |
| One row inside a menu or list | `ListItem` |
| Message composer | `ChatInput` (pick the variant) |
| A sent or received chat message | `UserChatBubble` |
| Horizontally swiped cards or media | `Carousel` |
| A controlled gap between elements | `Spacer` |

Its disambiguation rules override any name-based guess: native vs web decides HeaderNative vs
HeaderWeb; top-level vs in-page decides BottomNav vs TabGroup; form field vs floating surface
decides Select vs ContextMenu; the input context decides the ChatInput variant; scroll vs fixed
proportion decides Carousel vs an aspect-ratio preset.

**Respect the slot contract.** Slot-based micropatterns (TabGroup, ContextMenu, and others the skill
lists) supply the layout and chrome; you supply the children *inside the named slot*. Placing those
children beside the instance instead is the same defect as hand-building the pattern.

#### B2 — leaves: `get_skill_reference("oneui-definitions", "references/oneui-components-definition.md")`

For every inventory row **not** already claimed by a micropattern — including the rows that fill a
micropattern's slots — choose the component by intent. It turns "a circular thing with a tick in
it" into a named OneUI component. Do not skip it because a legacy name looks
self-explanatory — legacy names lie, and its disambiguation rules are exactly what a name-based guess
walks into: clickability decides Icon vs IconContained vs IconButton; text vs number vs dot decides
Badge vs CounterBadge vs IndicatorBadge; content length and blocking-ness decide Modal vs BottomSheet
vs SideSheet; immediate effect vs form submission decides Switch vs Checkbox; in a form the `…Field`
wrapper is the placeable component; determinate vs indeterminate vs neither decides Linear vs
Circular progress vs Spinner.

#### The mapping table

Produce this table and keep it visible for the rest of the rebuild. **`Kind` is what records the B1
decision** — a table with no `Micropattern` rows on a frame that has a header or a nav bar means B1
was skipped, not that the frame had none:

| Legacy element | Count | Kind | OneUI target | Why (what it does, not how it looks) | Prop-mapping source |
|---|---|---|---|---|---|
| `Top Bar/Default` | 1 | Micropattern | `HeaderNative` | Native app bar — the structure, not its buttons | `jds-v3-oneui-navigation` |
| `Icon Button/Small` | 4 | Component | `IconContained` | Non-clickable category marker, not an action | `jds-v3-oneui-media-and-identity` |
| `Tab Bar/3-up` | 1 | Micropattern | `TabGroup` | Switches sections within the view, not app destinations — tab items go in its slot | `jds-v3-oneui-selection-controls` |

`Kind` is one of **Micropattern**, **Component**, or **Primitive** (R3's build-from-primitives path).

The **Prop-mapping source** column is filled from *Prop values: the skills the user invokes* in the
Workflow — this skill does not auto-load those. A row with a target but no prop source is a choice
plus a set of guesses.

**Where no OneUI equivalent exists,** say so in the table, mark `Kind` as `Primitive`, and follow
R3's build-from-primitives path. Never resolve a blank row by importing a component from another
library. Check the micropattern list before concluding "no equivalent" — a region with no matching
*component* often has a matching *micropattern*.

### Phase C — build

Only once every inventory row has a mapping row. Proceed to Step 7 (root frame modes), then
placement.

---

## R3 — OneUI Components and Micropatterns only

**The library restriction is absolute — it overrides every rule except R1 and R2.**

Every instance in the output — **at every depth, including instances inside instances** — comes from
one of two libraries:

- **OneUI Components** (key: `lk-591df3aa712480d79162be60e949bd96010101dd8d121ef35ab4f4dcc70a25cf5301bc6ce18c927d02a6393741baf482d7d3280b4c9ad67f01b097fc2eac4414`)
- **OneUI Micropatterns** (key: `lk-a82dde6620196fa82e2fbb6746efec7c431b32029ee9d42e9dc27e478974393afb2544f38eddf216fb434d2c6412bb6f6544aa16b6c821c244a5b715decd3975`)

### The only two questions

1. **Does its key match one of the two OneUI keys above?** Not "is it remote" — `remote === true`
   only means "from *some* library", and the legacy library is one too. Not "does it look right".
2. **If not, can you prove otherwise?** No. Unverified is a violation, not a pass.

**Forbidden:** any component from another library (JDS, MyJio, Material, iOS kit…); any local
component defined in this file; anything from OneUI Foundations (variables only, no components);
any instance copied or referenced from the old frame; any legacy container that "looks fine" from
outside — a legacy `Modal popup` or card brings its whole legacy interior with it, and the outer
instance is the violation.

**Allowed:** instances from OneUI Components and OneUI Micropatterns; plain frames, text and
rectangles for layouts no OneUI component covers; variables and modes from OneUI Foundations
(key `lk-db0aef660e3947c35f277f5359e05ed2677a5ca4ade53e3bca827f7b5f91648dd7ac07ac4af13be473859852d98f378795d92e66cf6da5111f88bc086643e299`).

### If no OneUI equivalent exists

Build it from plain Figma primitives with OneUI token variables bound to fills and strokes. Never
import a component from another library as a substitute. Anything you build by hand this way must
still satisfy **R4**.

### R3 gate — deep library audit (mandatory, deep + fail-closed)

**This check is the gate that decides whether the rebuild is finished.** A shallow version of it is
worse than no check at all, because it reports "0 violations" on a frame that is still full of
legacy components and the agent then declares success.

Its stages are numbered separately from the Workflow's steps: **Stage N** here, **Step N** there.

#### The three bugs that produce a false clean report

Each of these has returned "0 violations" on a frame still full of legacy components:

1. **Stopping at INSTANCE boundaries** — recursing only while `"children" in node` but skipping
   instance children means a legacy `Modal popup` is one node and its whole interior is never seen.
2. **Walking only top-level children** instead of the full depth.
3. **Treating `remote === true` as proof of OneUI** — it only means "from some library", and the
   legacy library is one.

The fix is not "recurse harder": resolve every instance's actual source at every depth and treat
anything unproven as a violation.

#### Non-negotiable invariants

1. **Every INSTANCE at every depth is checked**, including instances inside instances. No depth
   limit, no node type that terminates the walk.
2. **Provenance comes only from the component's `key`** (or its set's key) matching a known OneUI
   key — never from `remote`.
3. **Fail closed.** Unknown or unresolvable provenance is a VIOLATION.
4. **Set `figma.skipInvisibleInstanceChildren = false` first**, or legacy nodes hide inside
   collapsed and invisible variants.
5. **Two independent traversals must agree** on the instance count; if they disagree the scan is
   broken, and the scan is what you fix.
6. **Repair outermost-first** — everything inside a violating instance is also a violation. Replace
   the outer instance; never patch its children.
7. **The gate is zero**, confirmed by a re-run after every repair pass.

#### Stage 1 — the legacy denylist (fingerprinted before rebuilding)

The most reliable signal available, and obtainable only while the old frame still exists: every
component key the source frame uses. Any of those keys in the rebuild is a **certain** violation, with
no dependence on library-key APIs.

**This already ran in R2 Phase A** — same traversal, one call, returning `legacyKeys` / `legacyNames`
beside the inventory. Do not run a second pass; use the Phase A result. If it returned 0 keys on a
frame that visibly contains components, the fingerprint failed — fix that before continuing without a
denylist.

`setPluginData` throws in `use_figma`, which is why Phase A guards the write and returns the keys
regardless. When `stored` is `false`, paste the array into `INLINE_LEGACY_KEYS` in Stage 3. Carrying
the list forward through returned payloads is equivalent; losing it is not.

#### Stage 2 — build the OneUI allowlist

The allowlist is the set of component keys published by the two OneUI libraries. Obtain it from an
authoritative source, in this order:

| Source | How |
|---|---|
| Design-system MCP | `list_components` for OneUI Components + OneUI Micropatterns, keeping each component's Figma key |
| Figma REST | `GET /v1/files/:file_key/components` on each of the two OneUI library files |
| Live capture | Place one instance of each OneUI component used, and record `mainComponent.key` and its component set key |

```javascript
// ONEUI_KEYS = array of component + component-set keys from the two OneUI libraries
let stored = false;
try {
  figma.root.setPluginData("oneui.allowlist", JSON.stringify(ONEUI_KEYS));
  stored = true;
} catch (e) {}   // unsupported in `use_figma` — the return below is the real channel
return JSON.stringify({ stored, count: ONEUI_KEYS.length, allowlist: ONEUI_KEYS });
```

If `stored` is `false`, paste the returned `allowlist` into `INLINE_ONEUI_KEYS` in the Stage 3 scan.

**If the allowlist cannot be built, the audit does not pass by default.** Every instance whose key
is not in the legacy denylist is then reported as `UNVERIFIED`, and unverified is a blocking state
that must be resolved or escalated — never silently accepted.

#### Stage 3 — the deep scan

```javascript
figma.skipInvisibleInstanceChildren = false;

const ALLOWED_LIB_KEYS = [
  "lk-591df3aa712480d79162be60e949bd96010101dd8d121ef35ab4f4dcc70a25cf5301bc6ce18c927d02a6393741baf482d7d3280b4c9ad67f01b097fc2eac4414", // OneUI Components
  "lk-a82dde6620196fa82e2fbb6746efec7c431b32029ee9d42e9dc27e478974393afb2544f38eddf216fb434d2c6412bb6f6544aa16b6c821c244a5b715decd3975", // OneUI Micropatterns
];

const frame = await figma.getNodeByIdAsync(frameId);
if (!frame) throw new Error("frame not found: " + frameId);

// pluginData is unavailable in `use_figma`. Paste the arrays returned by Phase A and
// Step 1 here whenever their `stored` flag came back false — two empty sets make every
// verdict below meaningless (Step 6 catches it, but only after a wasted pass).
const INLINE_LEGACY_KEYS = [];   // <- Phase A `legacyKeys`
const INLINE_ONEUI_KEYS  = [];   // <- Step 1 `allowlist`

const readStored = (k) => {
  try { return JSON.parse(figma.root.getPluginData(k) || "[]"); } catch (e) { return []; }
};

const ONEUI_KEYS  = new Set([...readStored("oneui.allowlist"),  ...INLINE_ONEUI_KEYS]);
const LEGACY_KEYS = new Set([...readStored("oneui.legacyKeys"), ...INLINE_LEGACY_KEYS]);

// --- Traversal A: crosses instance boundaries by design ---
const viaCriteria = frame.findAllWithCriteria({ types: ["INSTANCE"] });

// --- Traversal B: explicit walk that records depth + path, INCLUDING instance children ---
const viaWalk = [];
const stack = [{ node: frame, path: frame.name, depth: 0 }];
while (stack.length) {
  const { node, path, depth } = stack.pop();
  if (node.type === "INSTANCE") viaWalk.push({ node, path, depth });
  // NOTE: no INSTANCE early-return here — that omission is the original bug.
  if ("children" in node) {
    for (const child of node.children) {
      stack.push({ node: child, path: `${path} / ${child.name}`, depth: depth + 1 });
    }
  }
}

const scanIntegrity =
  viaWalk.length === viaCriteria.length
    ? "OK"
    : `MISMATCH walk=${viaWalk.length} criteria=${viaCriteria.length}`;

const rows = [];
for (const { node, path, depth } of viaWalk) {
  let main = null;
  try { main = await node.getMainComponentAsync(); } catch (e) { main = null; }

  const set = main && main.parent && main.parent.type === "COMPONENT_SET" ? main.parent : null;
  const key = main ? main.key : null;
  const setKey = set ? set.key : null;

  let verdict;
  if (!main)                                             verdict = "VIOLATION_UNREACHABLE";
  else if (!main.remote)                                 verdict = "VIOLATION_LOCAL";
  // `core/jiotokens` glyphs are shared by both libraries and are REQUIRED to carry the
  // reference's names across (Icon assets rule) — they are not provenance violations.
  else if (/^(ic_|ps_)/.test(set ? set.name : main.name))   verdict = "ICON_ASSET";
  else if (LEGACY_KEYS.has(key) || LEGACY_KEYS.has(setKey)) verdict = "VIOLATION_LEGACY";
  else if (ONEUI_KEYS.has(key) || ONEUI_KEYS.has(setKey))   verdict = "PASS";
  else                                                   verdict = "UNVERIFIED";

  rows.push({
    id: node.id, depth, path,
    node: node.name,
    component: main ? main.name : null,
    componentSet: set ? set.name : null,
    key, setKey, verdict,
  });
}

// Outermost-first: a violation with no violating ancestor is the one to replace.
const badIds = new Set(rows.filter(r => r.verdict !== "PASS").map(r => r.id));
const outermost = rows.filter(r => {
  if (!badIds.has(r.id)) return false;
  let p = figma.getNodeById(r.id).parent;
  while (p && p.id !== frame.id) {
    if (badIds.has(p.id)) return false;
    p = p.parent;
  }
  return true;
});

return JSON.stringify({
  scanIntegrity,
  instancesScanned: rows.length,
  maxDepth: rows.reduce((m, r) => Math.max(m, r.depth), 0),
  allowlistSize: ONEUI_KEYS.size,
  legacyKeySize: LEGACY_KEYS.size,
  counts: rows.reduce((a, r) => ((a[r.verdict] = (a[r.verdict] || 0) + 1), a), {}),
  outermostViolations: outermost,
  all: rows,
}, null, 2);
```

#### Stage 4 — reading the verdicts

| Verdict | Meaning | Action |
|---|---|---|
| `PASS` | Key is in the OneUI allowlist | none |
| `ICON_ASSET` | An `ic_*` / `ps_*` glyph from the shared `core/jiotokens` library | none — carrying these names across is **required** by the Icon assets rule, not a violation |
| `VIOLATION_LEGACY` | Key was fingerprinted on the old frame — certain legacy | replace |
| `VIOLATION_LOCAL` | `remote === false`, a component defined in this file | replace |
| `VIOLATION_UNREACHABLE` | `getMainComponentAsync()` returned null/threw | replace or escalate |
| `UNVERIFIED` | Remote, but not proven OneUI | **treat as a violation** — resolve before passing |

**Handling `UNVERIFIED` nested inside a `PASS`ing OneUI instance:** OneUI components legitimately
contain other OneUI components, some of them unpublished internals that will not be in the
allowlist. Such a node is acceptable **only** when all of the following hold: its nearest instance
ancestor is `PASS`, its key is not in the legacy denylist, and it was not swapped via an override.
Anything else stays a violation. When in doubt, re-check whether the outer instance's `overrides`
record a main-component swap for that child; if your API version does not expose that, confirm the
node manually rather than assuming it is internal.

#### Stage 5 — repair, outermost first

Work only the `outermostViolations` list — replacing an outer instance removes everything inside it,
so repairing children first is wasted effort that hides the real fault.

For each outermost violation:

1. Identify its purpose from the old frame (modal, button group, header, input, icon…).
2. Take the OneUI target from the R2 Phase B mapping table. If the node is not there — a nested
   interior only the deep scan revealed — go back to the definition skills, choose by intent
   (`oneui-micropatterns-definition` if the violation is a whole region, `oneui-components-definition`
   if it is a single element), and **add the row** with its `Kind`, so the table stays a complete
   record of the rebuild.
3. **Map the props from the tables, do not eyeball them** — see *Prop values: the skills the user
   invokes* in the Workflow for the router and the per-family list.
4. Place a **fresh instance from the OneUI library**, re-apply text, props and position, then
   delete the legacy one. Use `swapComponent()` only when the prop schema
   genuinely matches — across libraries it usually does not, and stale overrides survive the swap.
5. Re-apply R4 to whatever you placed or built, and R1's measured-px check with it.
6. No OneUI equivalent → plain frames/text/rectangles plus OneUI tokens. Never a foreign component.

Do **not** use `detachInstance()` on a legacy component as a way to clear the violation. Detaching
removes the instance but leaves legacy geometry and hardcoded values behind, and it will pass this
check while still being wrong.

#### Stage 6 — the gate

Re-run Stage 3 after every repair pass. The rebuild is complete only when **all** of these hold:

- `scanIntegrity === "OK"`
- `counts.VIOLATION_LEGACY`, `VIOLATION_LOCAL`, `VIOLATION_UNREACHABLE` are all `0` or absent
- `counts.UNVERIFIED` is `0`, or every remaining one is justified by the nested-internal rule above
- `instancesScanned > 0` and `maxDepth` is consistent with the visible nesting

Cap at **5 repair passes**. If violations remain, stop and report `NEEDS_HUMAN_INPUT` with the
outermost violation list — do not declare success on a partial fix.

#### Stage 7 — validate the validator

Before trusting any "0 violations" result, check the report's own numbers:

- `instancesScanned === 0` on a frame that visibly contains components → the scan never ran.
- `maxDepth <= 1` on a nested layout → the walk stopped at the first level.
- `scanIntegrity !== "OK"` → the two traversals disagree; one of them is skipping nodes.
- `allowlistSize === 0` and `legacyKeySize === 0` → nothing could be proven, so every `PASS` is
  meaningless and the run must be treated as unverified.

A report that claims zero violations while any of these is true is a **failed scan, not a clean
frame**. Say so instead of reporting success.

---

## R4 — Token binding contract (no raw numbers, no raw colours)

**Every colour, every padding/gap, every corner radius, and every stroke weight must be bound to a
OneUI Foundations variable.** A raw number is as much a defect as a raw hex — it renders correctly
today and stops responding to brand, colour mode, theme, and density.

### Why

OneUI resolves colour through a deep alias chain (Brand → Colour mode → Accent → Material → Surface
→ Theme → Appearance → Parent → Primitives), and every size through one primitive
(`px = base × multiplier`) where the base is fluid across viewport width. A hardcoded value opts out
of both: switch brand (Jio/Tira), colour mode (light/dark), theme, or breakpoint and it does not move.

Tokens come from **OneUI Foundations only** — never a local variable, never another library, never a
literal. The three skills that make this satisfiable (`oneui-figma-size-and-typography`,
`oneui-figma-brand-variables`, `oneui-figma-writing-to-figma`) are loaded in Workflow Phase 0.

`15 Brand` is the binding leaf: **bind Brand variables only.** Every upstream collection is descoped,
so a path that does not appear in the picker is a wrong path — go back to `oneui-figma-brand-variables`
rather than falling back to a raw value.

### What binds to what

| Property on the node | MUST bind to | Variable family | Figma scope | Bind via |
|---|---|---|---|---|
| Padding — `paddingLeft` / `paddingRight` / `paddingTop` / `paddingBottom` | **spacing token** | `dimensions/spacings/*` | `WIDTH_HEIGHT`, `GAP` | `setBoundVariable` |
| Gaps — `itemSpacing`, `counterAxisSpacing` | **spacing token** | `dimensions/spacings/*` | `WIDTH_HEIGHT`, `GAP` | `setBoundVariable` |
| Negative gap (overlap) only | **negative spacing token** | `dimensions/spacingsNegative/-*` | `GAP` only | `setBoundVariable` |
| Corner radius — `topLeftRadius`, `topRightRadius`, `bottomLeftRadius`, `bottomRightRadius` | **shape token** | `dimensions/shape/*` | `CORNER_RADIUS` | `setBoundVariable` |
| Stroke weight — `strokeWeight` (or the four per-side weights) | **stroke token** | `dimensions/strokes/*` | `STROKE_FLOAT` | `setBoundVariable` |
| Frame / surface fills | **colour token** | `colour/surface/surface`, `colour/interaction/stateLayer` | `FRAME_FILL` | `setBoundVariableForPaint` |
| Icon and shape fills | **colour token** | `colour/content/*` | `SHAPE_FILL` | `setBoundVariableForPaint` |
| Text colours | **colour token** | `colour/content/high` \| `medium` \| `low` \| `tintedA11y` | `TEXT_FILL` | `setBoundVariableForPaint` |
| Stroke colours | **colour token** | `colour/content/stroke medium` \| `stroke low` | `STROKE_COLOR` | `setBoundVariableForPaint` |
| Typography + elevation | the shipped **TextStyle / EffectStyle** | `{category}/{size}/{semantic}`, `elevation1`–`3`, `blurS/M/L` | — | `setTextStyleIdAsync` / `setEffectStyleIdAsync` |
| Layout sizing (fullWidth buttons, stretch elements) | `layoutSizingHorizontal = "FILL"` inside an auto-layout parent | — | — | — |

**Scopes are the guardrail, not a detail.** `dimensions/shape/*` is scoped `CORNER_RADIUS` and
`dimensions/strokes/*` is scoped `STROKE_FLOAT` — they are not interchangeable, and a shape token
will not even appear in the stroke-weight picker.

### Picking the *right* token — measure first, then divide (mobile)

**A real token is not the same as the right token.** `spacings/3` and `spacings/4` both pass R3 — but
at mobile base they are 12 px and 16 px. The audit cannot tell them apart. Only the reference can.
This is how R1 is satisfied:

1. **Measure the reference node** — the four paddings, `itemSpacing`, `counterAxisSpacing`, and each
   of the four corner radii, in px. R2 Phase A already returns these in `layout`.
2. **Divide by 4.** Step 7 pins `09 Platform = S – 360` and `11 Density = default`, fixing the base
   at 16. With `px = base × multiplier` and `multiplier = tokenName / 4`, that is `px = 4 × token`:

   ```
   token = measured px / 4
   ```

   | Measured | ÷ 4 | Padding / gap | Corner radius |
   |---:|---:|---|---|
   | 8 px | 2 | `dimensions/spacings/2` | `dimensions/shape/2` |
   | 12 px | 3 | `dimensions/spacings/3` | `dimensions/shape/3` |
   | 16 px | 4 | `dimensions/spacings/4` | `dimensions/shape/4` |
   | 18 px | 4.5 | `dimensions/spacings/4-5` | `dimensions/shape/4-5` |
   | 24 px | 6 | `dimensions/spacings/6` | `dimensions/shape/6` |
   | 40 px | 10 | `dimensions/spacings/10` | `dimensions/shape/10` (shape ends here) |

3. **The quotient is a candidate, not a token.** Above `10` spacings step `12, 14, 16, 18, 20, 24, 28,
   32, 40, 48, 64, 80, 120, 160, 200`. 26 px → 6.5 does not exist: snap to `6` (24 px) or `7` (28 px)
   and record the delta. Off-grid usually means the *legacy frame* is off-grid — report it.
4. **Radius over 40 px has no token** — shape caps at `10`. Use `shape/pill` (fixed 9999) when the
   shape reads fully rounded, otherwise `shape/10`.
5. **Not mobile? Do not divide by 4.** Use `token = px / (base / 4)` — load
   `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-size-and-typography.md")`, Reverse lookup section.

**Gate — every spacing/shape binding must survive this check:**

> `chosen token × 4 === measured px` (mobile), or the row carries an explicit "off-grid, snapped
> from N px" note.

A binding that passes R3 (it is a Foundations token) but fails this check is still a defect. R3 asks
*"is this a token?"*; this asks *"is this the token the reference actually used?"* — which is the only
question that catches a 12 px padding rebuilt as 16 px.

### Token-name traps that cause silent fallbacks to raw values

These are the ones that make a binding attempt fail and tempt a hardcoded value instead:

- **`.` is illegal in a Figma variable-name segment.** Half-steps use `-`: `dimensions/spacings/0-5`,
  not `dimensions/spacings/0.5`. `dimensions/spacings/2.5` does not exist.
- **`dimensions/shape/pill` is fixed at 9999 px**, bypassing viewport and density. Use it for fully
  rounded shapes rather than typing a large radius.
- **Strokes split on purpose:** `none`–`2XL` are literal px so hairlines stay hairlines at every
  breakpoint; `3XL`–`9XL` alias dimension tokens and scale. Pick by whether the stroke should grow.
- **`colour/content/tinted` is not text-safe** — it is `SHAPE_FILL` only, walked to ≥3.0:1. For
  brand-coloured *text* use `colour/content/tintedA11y`, which is walked to ≥4.5:1 and carries
  `TEXT_FILL`.
- **Negative spacings are `GAP`-only** and cover a narrower range than positive spacings; a negative
  width or height is meaningless by design.

**Never** write a raw hex/RGB (`#0078AD`, `{r:0,g:0.47,b:0.68}`), and never type a raw pixel number
into padding, gap, radius, or stroke weight.

### Two API facts that break radius and colour binding

- **There is no bindable `cornerRadius`.** Binding the composite property does nothing — bind all
  **four** corner fields individually, even when the radius is uniform.
- **`setBoundVariableForPaint` returns a NEW Paint and `fills` is a read-only array.** Clone the
  array, replace the entry, reassign the whole array. Mutating `node.fills[0]` is a silent no-op, and
  a node with `fills = []` has nothing to bind to — supply a placeholder SOLID first.

Full mechanics, including the complete bindable-field list: `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-writing-to-figma.md")`.

### Prefer inherited bindings over new ones

On an instance the correct fix is never a fresh binding — it is to stop overriding the one the
component already carries. See **R5**. Bind explicitly only on primitives you built yourself.

### R4 gate — token-binding audit

Run this after the frame is created, traversing **every descendant at full depth** — same traversal
rules as the library scan, no stopping at INSTANCE boundaries. It flags unbound fills, strokes,
paddings, gaps, radii (all four corners — a uniform radius set via `cornerRadius` leaves every corner
unbound) and stroke weights. Also check that any Button with `fullWidth=true` has
`layoutSizingHorizontal = "FILL"`, not `FIXED`.

Fix on instances by resetting from the main component, which carries the correct bindings; on your
own primitives by binding the token from the table above. Re-run until zero, and `return` the report —
`console.log` produces no output.

**Scope the findings, or the report is unusable.** A OneUI component's *internal* nodes may carry raw
values that ship that way in the library, and you cannot edit a library component's internals from a
consumer file. Flagging them produces a violation list nobody can clear, which pushes the agent
toward detaching (banned) or giving up. So classify every finding:

| Class | Where the node sits | Action |
|---|---|---|
| `OWNED` | Not inside any instance — a primitive you built | **Violation.** Bind the token |
| `OVERRIDE` | Inside an instance, and the field is listed in that instance's `overrides` | **Violation.** Reset from the main component so it inherits again |
| `LIBRARY_INTERNAL` | Inside an instance, not overridden | **Informational.** Not yours to change — do not detach, do not "fix" |
| `UNKNOWN` | Inside an instance, but overrides could not be read | Inspect manually; do not pass by default |

Only `OWNED` and `OVERRIDE` gate the rebuild.

```javascript
figma.skipInvisibleInstanceChildren = false;   // hidden nodes must be audited too

const frame = await figma.getNodeByIdAsync(frameId);
const SPACING_FIELDS = ["paddingLeft","paddingRight","paddingTop","paddingBottom",
                        "itemSpacing","counterAxisSpacing"];
const RADIUS_FIELDS  = ["topLeftRadius","topRightRadius","bottomLeftRadius","bottomRightRadius"];

const nodes = [frame, ...frame.findAll(() => true)];   // traverse ONCE
const findings = [];

// Nearest ancestor INSTANCE, plus the fields that instance records as overridden.
// An INSTANCE is itself library-owned: its own root fill/radius/padding belong to the
// main component, and a consumer cannot bind them without an override that Rule R5
// forbids. Without this first check a top-level OneUI instance is misreported as
// OWNED — an unfixable "violation" that blocks the gate forever.
function ownership(n) {
  if (n.type === "INSTANCE") return { inInstance: true, overriddenFields: [] };
  let p = n.parent;
  while (p && p.id !== frame.id) {
    if (p.type === "INSTANCE") {
      try {
        const entry = (p.overrides || []).find((o) => o.id === n.id);
        return { inInstance: true, overriddenFields: entry ? entry.overriddenFields : [] };
      } catch (e) {
        return { inInstance: true, overriddenFields: null };  // unavailable in this API version
      }
    }
    p = p.parent;
  }
  return { inInstance: false, overriddenFields: null };
}

function classify(own, field) {
  if (!own.inInstance) return "OWNED";
  if (own.overriddenFields === null) return "UNKNOWN";
  return own.overriddenFields.includes(field) ? "OVERRIDE" : "LIBRARY_INTERNAL";
}

for (const n of nodes) {
  const bv = n.boundVariables || {};
  const own = ownership(n);
  const add = (field, issue) =>
    findings.push({ id: n.id, name: n.name, field, issue, cls: classify(own, field) });

  if (Array.isArray(n.fills))
    n.fills.forEach((f, i) => {
      if (f.type === "SOLID" && !(f.boundVariables && f.boundVariables.color))
        add("fills", `fill[${i}] unbound colour`);
    });

  if (Array.isArray(n.strokes))
    n.strokes.forEach((s, i) => {
      if (s.type === "SOLID" && !(s.boundVariables && s.boundVariables.color))
        add("strokes", `stroke[${i}] unbound colour`);
    });

  for (const f of SPACING_FIELDS)
    if (typeof n[f] === "number" && n[f] !== 0 && !bv[f])
      add(f, `${f}=${n[f]} not bound to a spacing token`);

  for (const f of RADIUS_FIELDS)
    if (typeof n[f] === "number" && n[f] !== 0 && !bv[f])
      add(f, `${f}=${n[f]} not bound to a shape token`);

  // Only a node that actually DRAWS a stroke has a stroke weight worth binding.
  // Every Figma frame carries a default `strokeWeight = 1` with `strokes = []`, so
  // testing the weight alone fires on essentially every node in the tree.
  if (Array.isArray(n.strokes) && n.strokes.length > 0 &&
      typeof n.strokeWeight === "number" && n.strokeWeight !== 0 && !bv.strokeWeight)
    add("strokeWeight", `strokeWeight=${n.strokeWeight} not bound to a stroke token`);
}

const counts = findings.reduce((a, f) => ((a[f.cls] = (a[f.cls] || 0) + 1), a), {});
return JSON.stringify({
  nodesScanned: nodes.length,
  counts,
  blocking: findings.filter((f) => f.cls === "OWNED" || f.cls === "OVERRIDE"),
  needsManualCheck: findings.filter((f) => f.cls === "UNKNOWN"),
  libraryInternalCount: findings.filter((f) => f.cls === "LIBRARY_INTERNAL").length,
}, null, 2);
```

The gate is `blocking.length === 0` **and** `needsManualCheck.length === 0`. If `nodesScanned` is
implausibly low for the frame, the traversal failed — fix that before trusting any result.

### How to fix hardcoded fills on instances

When a hardcoded fill is found on an instance or its children:

1. Get the main component via `instance.getMainComponentAsync()`
2. Find the matching child in the main component by name
3. Copy the main component child's fills (which contain `boundVariables`) back onto the instance child:
  ```
   const mainFills = JSON.parse(JSON.stringify(mainChild.fills));
   instanceChild.fills = mainFills;
  ```
   This restores variable inheritance without creating overrides.

### How to fix explicit Brand/Theme modes on instances

The design agent may also set `15 Brand` and `13.2 Theme` as explicit variable modes directly on instances. These MUST be cleared so components inherit brand/theme from the parent frame:

- Clear `15 Brand` mode: `node.clearExplicitVariableModeForCollection(brandCollection)`
- Clear `13.2 Theme (A–M) [Jio]` mode: `node.clearExplicitVariableModeForCollection(themeCollection)`
- Keep component-internal modes like `01 Appearance → primary`, `03 Surface → bold`, `06 Interaction state → idle`, etc.

### Standalone text nodes (not inside a component)

For standalone text like "Skip" links that need to respond to brand:

1. Bind the fill to a variable from the "15 Brand" collection (e.g. `colour/content/tintedA11y`)
2. Set the appropriate explicit modes on the text node: `01 Appearance → primary` and `03 Surface → bold` — these ensure the variable resolves to the correct brand accent color
3. Do NOT set `15 Brand` or `13.2 Theme` modes — those must inherit from the parent

---

## R5 — Never restyle a OneUI instance

**On a OneUI Component or Micropattern instance, these panels are READ-ONLY: fill, stroke, effects,
selection colours, position, auto-layout.** They carry the library's bindings. Override one and the
property stops tracking brand, theme, colour mode and density — and R3 still passes it, because the
node genuinely is a OneUI component.

| Node | Fill / stroke / effects / selection colours | Position / auto-layout |
|---|---|---|
| **OneUI instance** | **Never touch.** Props, variants and modes only | **Never touch.** Nest it in *your* auto-layout frame and let it fill |
| **Your own frame or custom component** | Yours — bind tokens per R4 | Yours |

- Instance looks wrong → different prop, variant or mode. Never a manual override.
- Props cannot get you there → wrong component. Back to R2 Phase B.
- No OneUI equivalent → build from primitives under R3.
- **Detaching is not an escape hatch.** A detached instance passes every check while being neither a
  OneUI component nor a deliberate primitive.
- Already overridden → **revert it**, don't re-bind it. Reset from the main component (*How to fix
  hardcoded fills on instances*, under R4).

That is what the audit's classes mean: `OWNED` = yours to bind. `OVERRIDE` = yours to revert.

---

## Figma API mechanics that bite in this workflow

Load `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-writing-to-figma.md")` for the full symptom → cause → fix table; these
are the ones that break a rebuild specifically:

| Rule | Why it matters here |
|---|---|
| **Never read `.id` / `.name` / `.variableCollectionId` / `.valuesByMode` off an imported `Variable`** | Imported variables are handles, not data — every property access throws. Step 7's import fallback works around this with a throwaway-paint probe |
| **`getLocalVariableCollectionsAsync()` does not return library collections** | Do not conclude the Foundations collections are missing and create local look-alikes — they silently drift from the library |
| **Discover collections from a bound node's `resolvedVariableModes` keys** | The route that works once OneUI instances are on the frame: every instance's alias chain contains all the Foundations collections |
| **Pass the `VariableCollection` object, never an ID string**, to `setExplicitVariableModeForCollection` / `clearExplicitVariableModeForCollection` | The ID form **silently no-ops on instance sublayers** — exactly where this skill clears `15 Brand` / `13.2 Theme`, so the clear appears to work and does nothing |
| **Preload every variant of every spec font before a Brand/Theme/Language mode write** | The mode write itself throws on an unloaded font, with an error that reads like a mode bug |
| **`return` is the only output channel** — `console.log` is not returned and `figma.notify()` throws | Every verification script here must `return` its report, or you have observed nothing |
| **`setPluginData` / `getPluginData` are unsupported and throw** | The fingerprint and allowlist look like they persist and do not. Wrap the write, return the data, inline it into the next script |
| **Scripts are atomic; a throw means zero changes** | Safe to retry. End a write with a read-back assertion that throws on mismatch and a bad write rolls itself back |
| **Page context resets between calls** | Earlier node IDs resolve only after `await figma.setCurrentPageAsync(page)`, once per call |
| **A stale colour that native drag-drop gets right is Figma's tab-level cache** | Ask "does Cmd-R fix it?" **before** debugging modes and bindings |

---

## Icon assets (mandatory)

**Both libraries draw icons from the same asset library — `core/jiotokens`.** No mapping step, no
choice: the reference frame's glyph exists in OneUI under the same name.

**Rule: every icon carries the same asset name as the icon it replaces.** A placeholder glyph is a
defect. So is a plausible-looking icon under a different name.

**No separate audit script.** R2 Phase A's walk crosses instance boundaries, so nested icons already
appear in its `inventory` as `component`. Run it against the rebuilt frame and diff the two name sets:

- **Reference name missing from the rebuild** → dropped, or left at a placeholder (an unset
  INSTANCE_SWAP reports its default glyph name, so it surfaces as a name the reference never had).
- **Rebuild name absent from the reference** → a substitution, not a migration.

Fix both, or state why the reference name was unusable.

---

## Definition of Done (all five gates, no exceptions)

The rebuild is complete only when every one of these passes. Report the numbers, not an assurance.

| # | Gate | Passes when |
|---|---|---|
| 1 | **Structure + component mapping** (R2) | Every inventory row has a mapping row with a `Kind`; every screen-level region was resolved via `oneui-micropatterns-definition` before its parts, and every remaining element via `oneui-components-definition`; no micropattern was hand-assembled from components; slot-based patterns have their children in the slot; every row names a prop-mapping source or states which values were inferred without one |
| 2 | **Deep library audit** (R3) | `scanIntegrity === "OK"`, zero `VIOLATION_*`, zero unexplained `UNVERIFIED`, `instancesScanned > 0`, `maxDepth` consistent with the visible nesting |
| 3 | **Fidelity + token binding + no restyling** (R1, R4, R5) | `blocking.length === 0` and `needsManualCheck.length === 0`; every bound token reproduces its measured px (or carries an off-grid note); every `OVERRIDE` reverted rather than re-bound; `LIBRARY_INTERNAL` acknowledged, not "fixed" |
| 4 | **Foundations** (Workflow Phase 0 + Step 7) | The root modes applied per the SET/SKIP log, `Surface` used on every tinted/dark area, parent-step cascade applied, and the foundations verify pass run |
| 5 | **Visual + assets** | Screenshot matches the old frame's layout; the rebuild's icon-name set matches the reference's, with any difference explained; brand/colour-mode switch still resolves |

Stop conditions — report `NEEDS_HUMAN_INPUT` rather than declaring success: a legacy component with
no OneUI equivalent *and* no viable primitives rebuild; 5 repair passes without reaching gate 2 or 3;
an instance interior that needs modes its main component lacks or reads as unreachable; work spanning
multiple pages (page context resets per call — one page per pass); a OneUI library not enabled in the
file. **Never** create local look-alike components or variables.

Never report completion on a script that returned zero findings while also reporting zero nodes
scanned, `maxDepth <= 1`, an empty allowlist *and* empty denylist, or a traversal mismatch. Those are
failed scans, not clean frames.
