---
name: figma-to-flutter
version: 0.2.0
visibility: public
description: >
  Turn a Figma frame into a runnable, visually-verified OneUI Flutter (Dart)
  screen. Drives figma_to_code(platform:"flutter", codegen=true), certifies with
  validate_oneui_code(platform:"flutter"), then flutter run, screenshot, and
  compare against the Figma frame — hand-authoring fixes for visual mismatches.
  Owns the Figma→Flutter mapping semantics (attention → variant, Surface Mode →
  OneUiSurface, size tokens → catalog enums, icon/image/a11y wiring), the
  build/screenshot/hand-fix verify loop, and Flutter widget authoring that
  agents get wrong from the catalog alone — Avatar, progress 0–100, toast
  provider, Image src, 2-char SelectableSingleTextButton, token EdgeInsets,
  independent selection state, Tooltip click trigger on touch, Tooltip
  placement colliding with adjacent content, Chip primary appearance,
  BottomNavigation Surface wrapping, Carousel pagination ambient scope,
  ChipGroup List<String> typing, Object-typed Slider/Tabs callbacks.
---

# Figma → OneUI Flutter (Dart)

`figma_to_code(platform:"flutter", codegen:true)` extracts a Figma frame and
writes a catalog-grounded `.dart` screen plus a `.json` sidecar. Import only
`package:ui_flutter/ui_flutter.dart`. `validate_oneui_code(platform:"flutter")`
clean is necessary but NOT sufficient — always run build → screenshot → compare → fix.

**OneUI widgets only (mandatory).** Every generated screen composes exclusively
from real `OneUi*` widgets in `packages/ui_flutter/lib/widgets/` — never a raw
Material primitive when a OneUI equivalent exists: no `Container` with a
manual `BoxDecoration` color standing in for `OneUiSurface`, no bare `Text`
standing in for `OneUiText`, no `ElevatedButton`/`TextButton`/`OutlinedButton`
standing in for `OneUiButton`, no `Card`/`ListTile`/`CircleAvatar`/
`CircularProgressIndicator`/`LinearProgressIndicator`/`AppBar`/
`BottomNavigationBar`/`Chip`/`AlertDialog`/`SnackBar` standing in for their
`OneUi*` counterparts. `validate_oneui_code` catches this after the fact
(`forbidden-material` for the widgets it knows to forbid, `unrecognized-widget-call`
for anything else non-catalog) — but treat that as a safety net, not the
authoring strategy: decide against the real catalog *before* writing a widget,
not after the validator flags it.

## Prerequisites

- Flutter SDK on PATH; app already set up via `create_oneui_flutter_app` or
  `setup_oneui_project({ platform: "flutter" })` (`vendor/ui_flutter` + pubspec path).
- **Figma Desktop** + Bridge plugin connected.
- **`FIGMA_ACCESS_TOKEN`** for image download.

## Pipeline

1. **Extract** — `ensure_figma_bridge`.
2. **Refine** — Flutter catalog (`list_components({ platform: "flutter" })`).
3. **Download images** → `assets/figma/`.
4. **Codegen** → `lib/screens/<Screen>.dart`.
5. **Validate** — barrel import, no Material chrome, no hex/`Color(0x…)`,
   no **numeric** `EdgeInsets` (token helpers OK), Avatar/Image/progress/toast
   rules in `references/widget-authoring.md`.
6. **`flutter run`**, screenshot, compare against the Figma frame, hand-fix,
   repeat — see "Build, screenshot & hand-fix loop" below. This is step 6 of
   the pipeline, not optional polish.

## Invocation

```
figma_to_code(
  figmaUrl,
  platform: "flutter",
  brand, subBrand,
  codegen: true,
  outDir: "lib/screens",
  projectRoot: "<absolute path to Flutter app>",
)
```

Wrap the **app** (not every screen) in `OneUiBrandProvider` + `OneUiToastProvider` after
`ensureOneUiBrandDefaultsLoaded()` and `JioIconCatalog.instance.ensureLoaded()`.
Use `<OneUiSurface mode="…">` for tinted backgrounds — never a raw colored `Container`.

## Widget mapping (do not invent)

Catalog names are Figma-style (`Button`, `Avatar`); emit `OneUiButton`, `OneUiAvatar`.
Before writing a widget, `get_component_info({ name, platform: "flutter" })`.

**Always load** `get_skill_reference("figma-to-flutter", "references/widget-authoring.md")`
for Flutter UI (showcase, PRD, or Figma). Avatar extras:
`get_skill_reference("figma-to-flutter", "references/avatar.md")`.

### Figma → Flutter mapping table (the core mapping)

| Figma concept | Flutter mapping | Notes |
|---|---|---|
| Attention: High | `OneUiButtonVariant.bold` / `OneUiAvatarAttention.high` | Role `Bold` fill, `Bold-High`-equivalent text; `attentionToVariant` in codegen maps `attention:"high"` → `variant:"bold"` automatically for buttons |
| Attention: Medium | `.subtle` | role `Subtle` fill, tinted text |
| Attention: Low | `.ghost` | transparent fill, tinted text |
| Surface Mode (frame background) | `OneUiSurface(mode: 'default'\|'ghost'\|'minimal'\|'subtle'\|'moderate'\|'bold'\|'elevated')` | Never a `Container` with a manual `color:`/`BoxDecoration` — children only remap tokens inside an `OneUiSurface`/`OneUiSurfaceScope` ancestor |
| Size tokens (S/M/L/XL, …) | Widget-specific enum or string alias — check per widget | `OneUiButton` accepts `sizeAlias: 'xs'\|'s'\|'m'\|'l'` (also `'small'/'medium'/'large'`, `'2xs'/'xl'/'2xl'` all collapse to the 4 real dimension steps) via `oneUiResolveButtonSizeStep`; `OneUiText.size` is a plain `String` from a **variant-scoped** list (`kOneUiTextBodySizes` = `2XS..L`, `kOneUiTextDisplaySizes` = `S/M/L`, `kOneUiTextTitleSizes` — shared by both `title` and `headline` variants — tops out at `L`, no `XL`) — do not assume every variant has the same size ladder |
| Appearance role (primary/secondary/neutral/sparkle/positive/negative/warning/informative/brand-bg) | `appearance: '<role>'` string prop, default `'auto'` | `'auto'` inherits the parent `OneUiSurfaceScope`'s role, else falls back to `'primary'` (see `resolveOneUiButtonAppearance`) — do not emit `appearance: 'auto'` explicitly when you actually mean a specific role from Figma |
| Boolean Figma properties (`"On"/"Off"`, `"true"/"false"`) | `prop: true` / `prop: false` | Only emit boolean args that are actually `true` for `disabled`/`loading`/`fullWidth`/etc. — the printer omits `false` |
| Icon glyph node | `icon: 'ic_name'` string, e.g. `OneUiIconButton(icon: 'ic_name', semanticsLabel: '…')` | Never invent a glyph name not in the loaded `JioIconCatalog` |
| Image / photo node | `OneUiImage(src: '<downloaded asset path or URL>', alt: '…')` | `OneUiIconRemote` is a remote-URL **glyph**, not a substitute for `OneUiImage` — see `references/widget-authoring.md` § Image / IconRemote |
| Avatar node | `OneUiAvatar(content: OneUiAvatarContent.image\|.text\|.icon, …)` | See `references/avatar.md`; never `fallback: OneUiText(...)` |
| Required a11y strings (`semanticsLabel`, `alt`, `aria-label`-equivalents) | Always emit a real, descriptive string — never leave empty or omit on a widget whose constructor requires it | `OneUiIconButton.semanticsLabel`, `OneUiImage.alt`, `OneUiAvatar.alt`, `OneUiBottomNavigation`/`OneUiLogo` a11y strings are all required-in-practice; the codegen printer already backfills a fallback label but hand-authored code must not regress to an empty string |

### Must not generate

- Any prop not returned by `get_component_info({ name, platform: "flutter" })`
  for that exact widget — never invent, guess, or port a prop name from
  React/RN. `validate_oneui_code` now flags this as `unknown-prop`; treat it
  as something to fix, not a warning to shrug off.
- Avatar `fallback: OneUiText` or image mode without `src`
- `OneUiLinearProgressIndicator(value: 0.45)` meaning 45% (default max is **100**)
- `OneUiToastScope.of` without `OneUiToastProvider`
- `OneUiSelectableSingleTextButton(label: 'Filter: 5G')` — label max 2 characters
- `EdgeInsets.all(16)` — use `getSpacingTokenPx` / `getDimensionValue`
- A `TextEditingController` fed into `OneUiInputField` — it has no `controller`
  prop (`value`/`onChanged` only); that pattern is dead state, not wiring
- One RadioField + SegmentedControl (or CheckboxGroup + CheckboxField) on the **same** state
- A “media” section that names Image / IconRemote but never constructs them
- `OneUiTooltip` on a touch-primary target without `trigger: 'click'`
- `OneUiTooltip` left at the default `position` when the trigger sits right
  before other interactive content in source order (e.g. a button row) —
  `OneUiTooltip` only avoids viewport edges, never sibling widgets, so the
  popup renders straight over whatever follows
- A selected/filter `OneUiChip` / `OneUiChipGroup` without `appearance: 'primary'`
- `OneUiChipGroup(value: someString, onValueChange: (String v) => …)` — `value`/
  `onValueChange` are always `List<String>`, even when `multiple: false`
- `OneUiBottomNavigation` in `bottomNavigationBar` without an `OneUiSurface` ancestor
- `OneUiCarouselPagination(activePage: …, onActivePageChange: …)` — those props
  exist only on `OneUiCarouselRoot`; `Pagination` reads position ambiently via
  `OneUiCarouselScope`, it takes no state props of its own
- Any raw Material widget standing in for an available OneUI one (see
  "OneUI widgets only" above) — this is checked automatically
  (`forbidden-material`, `unrecognized-widget-call`) but decide it up front

### App wrap

`OneUiBrandProvider` + `OneUiToastProvider` + `OneUiSurface` after
`ensureOneUiBrandDefaultsLoaded()` and `JioIconCatalog.instance.ensureLoaded()`.

## Build, screenshot & hand-fix loop (mandatory — run at least once)

`validate_oneui_code(platform:"flutter")` is a text-level lint gate (barrel
import, forbidden Material names, literal hex/`Color(0x…)`, numeric
`EdgeInsets`, catalog widget/prop existence). It proves the file won't obviously
misbehave — it says **nothing** about whether the screen resembles the Figma
frame. Codegen routinely produces code that passes validation but looks wrong:
wrong surface level, a role that resolves to the wrong brand color, a spacing
token mis-scaled, a missing scrim on an image, a size/attention default that
doesn't match the Figma variant. Never declare a figma-to-flutter task done on
a clean `validate_oneui_code` result alone.

1. **Host & build.** Wrap the screen in `OneUiBrandProvider` + `OneUiToastProvider`
   (see `lib/main.dart` in the target app), then:
   ```bash
   flutter pub get
   flutter run          # emulator or physical device
   ```
   Hot-reload (`r`) after edits; hot-restart (`R`) if state or providers changed shape.

2. **Screenshot the running screen.**
   ```bash
   flutter screenshot -o .oneui-verify/actual.png
   # or: adb -s <device> exec-out screencap -p > .oneui-verify/actual.png
   ```

3. **Get the Figma reference.** Use the Figma MCP's `get_screenshot` for the
   same node-id, saved as `.oneui-verify/reference.png` — compare against the
   actual target frame, not a memory of it.

4. **Compare and enumerate concrete mismatches**, e.g.:
   - wrong surface/appearance (a section that should read as a bold brand
     banner rendering as plain default background)
   - wrong color role resolution (a badge/accent showing the default role
     instead of the Figma-specified one — check `appearance` before assuming
     a token bug)
   - clipped or missing content (a rail/list height hard-set instead of
     hugging content; last item cut off)
   - missing scrim/overlay causing unreadable text on an image
   - wrong spacing scale (gaps/padding visibly too tight or too loose vs the frame)
   - missing or wrong icon/image (blank image tile, generic icon standing in
     for a specific glyph, `OneUiIconRemote` used where `OneUiImage` belongs)
   - typography mismatch (wrong `OneUiTextVariant`/size/weight relative to the
     Figma text style)
   - a raw Material widget where a `OneUi*` widget should be

5. **Hand-author the fix directly in the generated `.dart`.** This is a normal
   code edit, not a pipeline change — fix the specific screen file using the
   mapping table above (surface modes, attention→variant, token-only
   spacing/color). Re-run `validate_oneui_code(platform:"flutter")` after every
   edit so a visual fix doesn't reintroduce a lint issue.

6. **Rebuild, re-screenshot, re-compare** (or call `verify_flutter_screen_loop`,
   which automates steps 1–5 for you). Repeat until the rendered screen and the
   Figma frame agree on layout, color roles, and content — there's no fixed
   numeric threshold, but "surface/color roles look categorically wrong" or
   "content is missing/clipped" is blocking, not cosmetic.

7. **Completion contract (mandatory).** Cap the loop at **5 iterations**
   (`verify_flutter_screen_loop`'s built-in cap). On each pass, either the
   mismatches shrink or they don't:
   - **Converged** → done, report what was fixed.
   - **Not converged after 5 iterations** → do NOT silently declare the task
     complete. Report `NEEDS_HUMAN_INPUT` with the specific remaining
     blockers. A blocker is only legitimate after **at least 3 distinct fix
     attempts** targeting different causes (not 3 retries of the same guess),
     and falls into one of:
     - the Figma node/file is inaccessible (404, wrong node-id, unauthorized token),
     - the design uses a feature Flutter/OneUI genuinely can't render yet (a
       shader/blend-mode with no `OneUi*` equivalent),
     - a missing primitive whose fix is an architecture decision (new
       widget needed in `ui_flutter`, not a screen-level edit),
     - the mismatch has visibly plateaued across iterations despite different
       fixes tried.
   - Forbidden as a blocker: device/emulator dimension differences, minor
     icon-fidelity gaps, or safe-area offsets — those are fixable in the
     screen and don't excuse stopping.
   - Never use "it's close enough" or "`validate_oneui_code` is clean" as a
     substitute for actually reaching convergence or reporting
     `NEEDS_HUMAN_INPUT`.

8. **If a mismatch is systemic** (the same wrong mapping shows up across
   multiple screens — e.g. every `attention:"high"` button rendering the wrong
   variant, or every image node emitting without `src`), that's a pipeline
   bug, not a one-off. Fix it in `packages/mcp/src/platforms/flutter/printer/index.ts`
   (the Dart printer) or `packages/mcp/src/lib/flutterFigmaPipeline.ts` so
   future `figma_to_code(platform:"flutter")` runs don't regenerate the same
   defect. Hand-fixing the same class of bug screen-by-screen without ever
   touching the pipeline just means re-doing the same fix on the next screen.

Never report a figma-to-flutter task complete without having done at least one
full pass of this loop. If the target project has no working
emulator/simulator or the Figma MCP screenshot tool isn't available, say so
explicitly instead of declaring success on `validate_oneui_code` alone.

## Component recognition: identity vs. name-matching (read this before blaming the extractor)

Recognition of a Figma component instance happens two ways, checked in order:

1. **Identity match** — the instance's real `mainComponentKey`/`componentSetKey`
   (from the Figma file) plus its `componentProperties` (variants), checked
   against `packages/mcp/assets/figma-identities/oneui-library.json`. This is
   exact: right component, right variant, no name guessing.
2. **Name fallback** — the Figma layer's *display name* (plus
   `src/lib/componentAliases.ts`) matched against the catalog. No variant/props
   checking at all — a node named "Header" matches the `Header` contract
   whatever its actual content looks like; a node named anything else
   (`"Top Bar"`, a custom instance name, a plain unnamed frame) matches nothing.

**Identity acquisition (2026-09-09, real production data):** the
`OneUI-References-PluginGen` file used in an earlier acquisition pass turned
out to be a curated references/examples file, not the canonical library —
basic atoms (`Button`, `Avatar`, `Switch`, ...) were entirely absent from it
for every platform. The actual libraries are the published **"❖ OneUI
Components"** file (`eYJriZveeBwZDzGlCts22f`) and **"❖ OneUI Micropatterns"**
file (`y4r5eCoZhqvPw1U1bm2qfw`). A REST-API personal access token got
`403 File not exportable` on both (viewer-only token scope) — the official
Figma MCP connector's `list_file_components_for_code_connect` tool (OAuth,
not a PAT) could still read them, so acquisition now supports that as an
alternate source: `snapshotFromCodeConnectComponentList()` in
`figmaIdentityManifest.ts`, fed via `acquire --code-connect-list <path(s)>`
instead of `--file-key` + `FIGMA_ACCESS_TOKEN`.

That data source only returns one key per top-level COMPONENT/COMPONENT_SET
(never a separate key per variant inside a set) — enough for
`exact_component_set` recognition (componentSetKey + variant properties),
not `exact_main_component` for a set's individual variants. Acquiring against
it required three real fixes in `acquireIdentityManifest()`, all still in
effect for any future acquisition, not just this run:

- **Component-set-only records** (no per-variant key) are now a valid MATCHED
  identity — `mainComponentKey` is optional on `FigmaLibraryComponentRecord`;
  matching falls back to `componentSetKey` alone.
- **Leading-dot names are excluded from candidate matching.** Figma's
  documented convention for hiding a component from the Assets panel (e.g.
  `.Modal`, `.Text`) marks an internal implementation piece a real screen
  never instances directly — it can share a bare display name with the real
  public component and would otherwise create a false ambiguity.
- **A literal catalog-name match now always outranks an alias-derived one.**
  An alias (`componentAliases.ts`) exists to bridge a *missing* direct match,
  not to add a second, distinct component as a competing candidate once a
  real literal match already exists (e.g. legacy standalone `InputText`
  vs. the real, actively-used `Input`).
- `validateIdentityManifest`'s main-component-key collision check is now
  platform-scoped (it already was for componentSetKey) — a shared reference
  library legitimately has React's, React Native's, and Flutter's contracts
  for the same concept (e.g. `HeaderItem`) all pointing at the same single
  Figma master, since there's only one design for it.

**Current state, checked into `assets/figma-identities/oneui-library.json`
(186 entries, all `validateIdentityManifest`-clean):**

| Platform | Matched | Ambiguous | Pending |
| --- | --- | --- | --- |
| `react` | 43 / 50 | 1 | 6 |
| `reactnative` | 47 / 62 | 1 | 14 |
| `flutter` | 46 / 74 | 1 | 27 |

- **`Text` is ambiguous on every platform** — the library publishes two
  byte-identical, 0-instance `Text` component-set duplicates on the same
  page. Needs a design-system owner to delete the stale one; not a code fix.
- **`SegmentedControl` IS matched** (all three platforms) — the real published
  master is named "Segmented control" (with a space), on its own "↳ Segmented
  control" page, `componentSetKey: 38069aaee489161aeb00279c59263d8eab985dec`.
  Its item slots are a *different* story: **`SegmentedControlItem` has no
  standalone public master** — the set's items are composed internally from
  dot-prefixed `.Slot/text|icon/pill|rectangular/{high,medium,low}/{S,M,L,XL}`
  pieces (correctly excluded from acquisition as internal-only) and a
  `.SegementedControlItem` (sic) internal component-set — there is no public
  component a screen instance could carry as its own identity for an
  individual item. Not Flutter-specific — same shape for `react`/`reactnative`.
- Everything else still `PENDING_EXTERNAL_EVIDENCE` genuinely wasn't found
  under a matchable (or aliased) name in either file — stays name-fallback
  only until published there, or aliased if it's a known spelling mismatch.

Re-running `acquire` is safe and additive: it only touches the one
platform's entries and merges into whatever's already on disk for the others.

```bash
cd packages/mcp
# From a session with the official Figma MCP connected:
#   list_file_components_for_code_connect(fileKey: "eYJriZveeBwZDzGlCts22f")   -> save as /tmp/components.json
#   list_file_components_for_code_connect(fileKey: "y4r5eCoZhqvPw1U1bm2qfw")   -> save as /tmp/micropatterns.json
node scripts/figma-identities.mjs acquire \
  --platform flutter \
  --file-key eYJriZveeBwZDzGlCts22f \
  --code-connect-list /tmp/components.json,/tmp/micropatterns.json \
  --library-name "OneUI Components + Micropatterns" \
  --library-version "$(date +%F)" \
  --output packages/mcp/assets/figma-identities/oneui-library.json   # relative to repo root, not packages/mcp
node scripts/figma-identities.mjs validate \
  --input packages/mcp/assets/figma-identities/oneui-library.json
```

If a REST-capable token IS available for the target file, `--file-key` +
`FIGMA_ACCESS_TOKEN` (or `--input <raw REST /v1/files/:key response>`) still
works exactly as before and additionally yields real per-variant
`mainComponentKey`s, not just componentSetKey-level matches.

`--output`/`--input`/`--code-connect-list` resolve relative to the **repo
root**, not `packages/mcp` — a bare `assets/...` path without the
`packages/mcp/` prefix silently writes/reads a stray directory at the repo
root instead of the real manifest; always double-check with `git status`
after running this. Never fabricate a `mainComponentKey`/`componentSetKey` by
hand — a wrong key silently misidentifies a component rather than falling
back safely to name-matching.

**Note on `scripts/figma-code-connect/`:** that's a separate subsystem (plan
§2, "Code Connect ownership") for publishing Figma↔code mappings inside
Figma's own UI — its `figma.codeConnect.componentKey` field on baked
component snapshots is deliberately never promoted into
`mainComponentKeys`/`componentSetKeys` (a prior attempt to do that,
unconditionally and without per-key COMPONENT/COMPONENT_SET typing or
ambiguity checking, was reverted — see `git log -S "must not become
figma_to_code exact identity"`). This acquisition pipeline reads the same
underlying Figma data but is a different, audited path: real
ambiguity/collision detection, correct per-key typing, and reviewable
provenance in the checked-in manifest — not a bypass of that boundary.

**For anything still name-fallback only**, the mitigation is naming
discipline + aliases: if a specific screen's component isn't recognizing,
check the exact Figma layer name and either rename it to match the catalog
component name, or add a `flutter`/`all`-scoped alias in
`componentAliases.ts` (see the `SegmentedControl`/`SegmentedControlItem`
flutter aliases added alongside react's).

## Known fidelity gaps (review before declaring done)

- **Every generated screen now scales proportionally to device width.** Every
  literal pixel dimension the printer emits (fixed-size `SizedBox`, `Positioned`
  left/top/width/height, `OneUiImage` width/height) is wrapped in
  `_oneUiScale(context, px)`, defined as `px * MediaQuery.of(context).size.width
  / _kOneUiDesignWidth` where `_kOneUiDesignWidth` is the captured Figma frame's
  own width. This keeps the whole screen proportional to the design on any real
  device instead of pinning it to the exact resolution the frame was captured
  at (previously: zero device-width awareness anywhere in the Flutter pipeline
  — every dimension was a bare Figma-pixel literal, so a device narrower or
  wider than the capture width clipped or gapped). If a hand-edited screen adds
  its own literal pixel dimension, wrap it in `_oneUiScale(context, ...)` too
  rather than leaving it bare — mixing scaled and unscaled dimensions on the
  same screen reintroduces the same fidelity gap for just that node.
- **Image download has two fallback paths, and both can fail.** The pipeline
  tries the Figma REST image API first (`FIGMA_ACCESS_TOKEN`), then falls back
  to Desktop Bridge export for anything REST couldn't fetch. If the token
  can't see the file, or Bridge isn't connected, `OneUiImage` nodes get
  emitted with a placeholder path (`assets/figma/placeholder.png`) and a
  codegen warning — check `imageErrors` in the pipeline result, don't assume
  every `OneUiImage` actually resolved a real asset.
- **The Dart printer (`platforms/flutter/printer/index.ts`) copies through
  only string/number/boolean scalar props** (`propsOf`) — any Figma property
  that resolved to something richer (nested objects, arrays) is silently
  dropped from the emitted widget. If a widget looks under-configured after
  codegen (missing a prop you can see in the Figma inspector), check whether
  its value type was non-scalar before assuming the prop mapping itself is wrong.
- **Only a small, explicit set of widgets get bespoke prop wiring** in the
  printer (`OneUiAvatar`, `OneUiImage`, `OneUiIconButton`, `OneUiIcon`,
  `OneUiBottomNavItem`, `OneUiInput`, `OneUiBadge`, `OneUiCheckbox`,
  `OneUiButton`/`*Button`/`OneUiChip` labels). Every other
  cataloged widget only gets its raw scalar props copied through plus
  `disabled`/`loading`/`fullWidth`/`contained`/`condensed`/`size`/`mode` — more
  complex widgets (Slider, Tabs, ChipGroup, Carousel) frequently need hand
  authoring after codegen, not just a validation pass, to get real props
  (`value`/`onValueChange` typing, ambient scope wiring) right.
- **`OneUiText` content resolution prefers `label`/`children`/node text in
  that order** — if Figma text was authored as a component-instance override
  rather than plain text content, verify the emitted `text:` string actually
  matches, since the printer only looks at `props.label`, `props.children`, and
  `node.text`.
- **Attention→variant mapping only applies to `OneUiButton`.** Other widgets
  with an `attention` concept in Figma (e.g. Avatar) have their own bespoke
  emission logic (see `emitOneUiAvatar`); don't assume the same
  `attentionToVariant` helper covers every widget class.
- **SegmentedControl recognition requires real component identity.** A Figma
  "Quick / All"-style pill toggle only maps to `OneUiSegmentedControl` when
  the instance's key/name actually resolves to the real Figma SegmentedControl
  component (`componentContracts.ts` `recognize()` — exact identity or name
  match, no structural/visual heuristic). Two adjacent Button/Chip instances
  that merely *look* like a segmented toggle (one filled/bold, one not) will
  codegen as plain Button/Chip siblings. During the hand-fix loop, check any
  Figma frame with a "quick filter" or two-option toggle for this — if it
  didn't come out as `OneUiSegmentedControl`, replace it by hand rather than
  leaving two independent Buttons that don't enforce mutual exclusivity.
- **Absolute-position coordinates are parent-relative, not page-relative** —
  fixed in this pipeline version. If you see a `Positioned(left:, top:)` with
  implausibly large values (thousands of px) after `figma_to_code`, that's a
  sign you're on an older MCP build; update it rather than hand-subtracting
  coordinates.
