---
name: jds-to-oneui-figma
description: >
  Redesign legacy JDS (Jio Testlab / @jds/react 3.x) Figma screens into real
  OneUI Components + Micropatterns instances. Use when the user says "convert
  this JDS screen to OneUI", "migrate Testlab screens", "redesign old JDS in
  Figma", hands Jio-Testlab-Library frames plus a working-file target, or asks
  to bake a JDS→OneUI Figma rebuild. Owns component mapping from
  jds-to-oneui-component-map.json, gap handling for missing designs (OTP, Date,
  …), placement below source frames, and surface/theme discipline. For WHICH
  surface level defer to `surface`; for mode writes defer to
  `figma-surface-cascade`; for PRD→Figma (greenfield) defer to `prd-to-figma`.
---

# JDS → OneUI (Figma screen rebuild)

Turn **existing JDS / Testlab** screen frames into **OneUI library** frames.
This is design authoring in Figma (real component instances), not code codegen.

## When to use

| Signal | Action |
|--------|--------|
| User pastes legacy JDS / Testlab frame URLs + a working-file target | Run this skill end-to-end |
| User asks to migrate screens after reading `JDS-to-OneUI-React-Web.md` | Load map JSON, rebuild |
| Greenfield from a PRD (no legacy frame) | Use `prd-to-figma` instead |

## Inputs

1. **Source frame(s)** — Figma URL(s) with `node-id` (legacy library or copies pasted into the working file).
2. **Or a multi-screen container** — one parent frame that holds many JDS screens as children (e.g. `295:33010` in TestFile). Treat every **visible** child as a source screen.
3. **Target file** — default working file `Ors8Y9cGtm1J1YelpT0I51` (TestFile / Untitled).
4. **Component map** — always load  
   `references/jds-to-oneui-component-map.json`  
   (also mirrored under `assets/skills/jds-to-oneui-figma/references/`).

## Hard rules

1. **Real OneUI / Micropatterns only** — import by proven keys in the map / `search_design_system`. Prefer ❖ OneUI Components + ❖ OneUI Micropatterns. Never leave JDS Testlab instances in the rebuild.
2. **`SingleTextButton` = max 2 characters** (circular, e.g. `Ag` / `En` / `12`). For any longer label, or any uncolored / text-link action (Resend OTP, Change number, Forgot PIN?, Skip, Sign Up, Learn more, …), use **`Button` with `attention=low`**. Never use `SingleTextButton` as a generic text button.
3. **Placement**
   - **Single screen:** put rebuild **directly below** its source: same `x`, `y = source.y + source.height + 80`. Name `{source.name} — OneUI`.
   - **Multi-screen container:** create one sibling row `{container.name} — OneUI` **below the container** (`y = container.y + container.height + 120`). Inside it, create one 360-wide shell per visible child, **sorted by source `x` (left→right flow order)**. Do not scatter OneUI frames under each child individually when the user asked to convert the whole container.
4. **Preserve copy + structure** — same section order and labels as the source (titles, CTAs, list rows). Do not invent product content.
4b. **Layout parity (mandatory)** — OneUI shells must match source **frame size** (360×800), **padding**, **vertical rhythm**, and **full-width CTAs** pinned like the source (spacer/`layoutGrow` + footer stack). Do not leave hug-sized buttons or unconstrained OTP rows that overflow. Prefer cloning the source frame as the layout scaffold, then swap JDS instances → OneUI.
4c. **Images from source (mandatory)** — copy every `IMAGE` fill `imageHash` (and vector/logo groups) from that source frame into the rebuild. Never drop collage/hero/avatar/screenshot art. Prefer cloning image-bearing nodes; if rebuilding, paint the same hashes onto OneUI `Image` / rectangles at the same size.
4d. **Clone-then-swap (preferred for multi-screen flows)** — `source.clone()` into the OneUI slot (exact layout + images), rename `— OneUI`, then replace only clear JDS interactive instances (`JDSButton*`, `Input field`, outer `Header`, `Bottom Navigation`). Do **not** deep-swap nested Avatars/IconButtons inside list rows or DigiLocker screenshot chrome — that breaks layout. DigiLocker / third-party screenshot screens: keep the clone visual; annotate remaining JDS in frame name notes if any.
4e. **Verify the library, not just the name, before trusting any component key (mandatory)** — Figma commonly has multiple libraries with an identically-named component (e.g. `Button` exists in `❖ OneUI Components`, `Jio Testlab Library`, `OneUI Design Kit [BETA]`, `Core/JioComponents`, and a "Headless Core Components - DO NOT USE IT!" library that must never be used). A key that imports without error is NOT proof it's the right component — check via `search_design_system(query: "<ComponentName>")` and confirm `libraryName` is `❖ OneUI Components` or `❖ OneUI Micropatterns` before accepting a key into `provenComponentKeys`. If a previously-proven key throws `Component with key ... not found`, first check whether it's actually a `COMPONENT_SET` needing `importComponentSetByKeyAsync` instead of `importComponentByKeyAsync` — that mistake has previously caused an agent to misdiagnose a working OneUI key as dead and substitute a same-named component from Jio Testlab Library instead (see `_ButtonNote` in the component map JSON for the incident). Only replace a key in the map after confirming the library via `get_libraries` / `search_design_system`.
4f. **Preserve `node.visible` when swapping instances (mandatory)** — when replacing an old instance with `variant.createInstance()`, a new instance defaults to `visible: true` even if the node it's replacing was `hidden="true"` in the source (unused variant slots, disabled-state duplicates, etc.). Always copy `newInstance.visible = oldNode.visible` before removing the old node, and after any batch instance-swap, sweep the affected subtree for stray visible instances with unset/placeholder label text (e.g. an instance still showing its component's default text like literal `"Button"`) — these are almost always leftover hidden slots that came back visible and must be re-hidden.
5. **Map via JSON status** — for every JDS instance found:
   - `migrate` / `release_gate` → OneUI component (release_gate still ships in Figma).
   - `design_create` / `design_decide` → **[GAP]** annotated frame + documented fallback from the map (e.g. OTP → temporary 6-cell `InputField` row). Never invent a published component set.
   - `design_confirm` → use proposed substitute and leave a sticky note / frame description naming the open Design question.
   - `datavis` → out of scope for app chrome; skip or note.
6. **No raw hex on surfaces** — tinted regions use `colour/surface/surface` + Appearance / Surface / parent-step via `figma-surface-cascade`.
7. **Theme on root** — set `13.1 Theme range` + `13.2`/`13.3` brand Theme modes on the **root** (Theme ≠ Appearance). Match brand from source when known (e.g. MyJio / JioCloud).
8. **Mobile chrome** — `HeaderNative` + `BottomNavigation` when the source has them; width **360**, height **HUG**.
9. **Assets** — prefer copying `imageHash` from source Image nodes in the same file; otherwise `figma_download_images` + `upload_assets` into the **target** file.
10. **Validate** — `get_screenshot` each rebuild vs source; fix gaps before declaring done.

## Workflow

```
1. Detect input: single frame(s) vs multi-screen container
2. get_metadata + get_screenshot (container overview + per-screen as needed)
3. Inventory visible children (x-sorted) + JDS instances → map JSON
4. Create OneUI placement (per-screen below OR container sibling row + shells)
5. Rebuild in batches of 3–6 screens (Header → body → CTA / BottomNav)
6. Apply Theme + surface cascade on tinted regions
7. Screenshot + compare; annotate remaining [GAP]s in frame description
8. Append flow to map JSON `screenInventories` / `rebuildExample`; return URLs + gaps
```

## Multi-screen container extras

- Rename shells to readable flow labels when source names are generic (`360 x 908` → keep source name + ` — OneUI`, and set `description` to the inferred role: Welcome / OTP / …).
- Overlay screens (DigiLocker pin/consent, upload coachmarks) often sit on top of MyJio chrome — rebuild the **visible overlay intent** with OneUI (BottomSheet / Surface card / modal stack), not every obscured wallet card behind it.
- Batch rebuilds: reuse one import cache of proven keys per `use_figma` call; clear shell children before fill.
- After the row exists, never recreate the container — only fill/repair shells.

## Proven component keys (shortcut)

See `provenComponentKeys` in the JSON. Re-verify with `search_design_system` if import fails. Prefer:

| Need | Key |
|------|-----|
| HeaderNative | `338ab37d457ef68112da7456510204e20fbe3dcf` — for a legacy back+title header, use variant `secondaryNav=false`, then `.findOne(n => n.name === 'PrimaryNav')` on the created instance and `.setProperties({ type: 'contextBar', expanded: 'false' })` on that nested instance (its own nested COMPONENT_SET exposes `type=homeBar/contextBar/searchBar`, not visible in the root set's componentPropertyDefinitions). Then on the same nav instance set `{ 'start#3473:1': true, 'avatar#3473:3': false, 'end#3473:4': false, 'secondaryText#4742:7': false, '↳ title#3473:0': <title text> }`. See `_HeaderContextBarNote` in the map JSON. |
| Chip (Selector/tab row) | `87fe16ce70168fe186ae1457b4af782498f33d91` — variant `selected={true|false}, attention=medium, size=M, start=none, end=none` for a For-you/Payments/Loyalty-style tab row (legacy `Action - Button` / `Core/JioComponents`, never use `52083a4c13659db14fd33f859258d39d37ffb731`) |
| Toast | `8d09a16b0d61c7a2b5f7cccf43c14a9260c20376` — variant `type=positive\|negative\|warning\|info\|default\|loading, attention=high\|medium\|low, actionsPlacement=bottom\|end`; message text goes in the `description` TEXT node (set `title#5143:3=false` to hide the separate title line), `actions#5143:0=false` to hide the button row. Legacy `Notification - Toast` (`d7abc3ce5dd7b38ac5e636b55dedcd110eb9e949`) is Core/JioComponents, not OneUI. |
| Button | `53fddb5a4ad3d013bedb2e066b0c6e422314915e` — ❖ OneUI Components, a `COMPONENT_SET`. Use `importComponentSetByKeyAsync`, pick a variant by exact name e.g. `size=L, attention=high, condensed=false, contained=true, fullWidth=true, start=false, end=false` (props are lowercase `size`/`attention`/`condensed`/`contained`/`fullWidth`/`start`/`end`). **Never** use `b6250bdba03c3edf4a5168f48ab0087f9ad0459a` — same display name "Button" but it's Jio Testlab Library, not OneUI (confirmed 2026-08-17 after it produced 79 wrongly-sourced instances in a rebuild) |
| InputField | `c8eb437a6f54e92eaf5081955960854668814f95` |
| SingleTextButton | `d1fc514db2e926d425b418c06ef9869e04faa458` — **≤2 chars only** (e.g. `En`). Phrases / uncolored actions → **Button `attention=low`** |
| IconButton | `3237b074310605063533ac7e42ff67df808c4df0` |
| Avatar | `bb90202670397f390dbc12c0886d1e5ade3e7607` |
| Image | `cb46a4117a2e8a2c98b77c0fce2a3bba73484015` |
| PaginationDots | `c973b171fa4a95a0d6e1ba19000c972d0f7ea5a7` |
| Carousel | `7f78fc10c0dad50206c3f96f3d383fff22479711` |
| BottomNav | `2094412785213ff475c6db0b5ae53fa23a123d41` |
| Divider | `dc3779d38ff51e0cc095a8baf4cdb375f4820fbf` |
| InputField (Testlab-bug warning) | `c8eb437a6f54e92eaf5081955960854668814f95` — same bug class as Button: `0b5ed8e35b894c277d430918d7b8cae7e445737f` is a same-named Jio Testlab Library InputField found wired into 32 instances 2026-08-17. Real component has only `size` (s/m/l) as a variant prop; label text node is named `Label`, value/placeholder text node is named `InputText`. See `_InputFieldNote` in the map JSON. |
| PaginationDots (wrong-key warning) | `c973b171fa4a95a0d6e1ba19000c972d0f7ea5a7` — watch for `.DNA/Pagination/*` prefixed wrapper components (different keys) masquerading as pagination dots; swap the wrapper instance itself (`pageCount`/`loop` variant props), its nested dot children resolve automatically. |
| CheckboxField | resolve via `search_design_system("CheckboxField")` ❖ OneUI |
| IconContained | resolve via `search_design_system("IconContained")` ❖ OneUI |
| ListItem / ListItemGroup | Micropatterns / Components — release_gate; compose if import fails |

## OTP / Date / other design_create gaps

From the engineering comparison: **OTP / PIN / Date / Rating / SelectableCard / Footer** have no published OneUI Figma component. For OTP screens:

1. Build a horizontal auto-layout named `[GAP: OTP] InputCode fallback`.
2. Place six compact `InputField` (or 6 text+underline cells if InputField cannot shrink) with digits from source.
3. Put the gap marker in the **frame name** (e.g. `… — OneUI [GAP: OTP]`) — Figma FRAME nodes may not support `description`.

### DigiLocker / third-party overlays

- Prefer **screenshot** over text inventory when background MyJio chrome pollutes `findAll(TEXT)`.
- Method tabs (Mobile / Username / Aadhaar) → `SegmentedControl`; after import, rewrite default `"Button"` segment labels.
- Consent screens → `CheckboxField` + `ListItem` + Deny/Allow `Button` pair.

### Multi-screen container checklist

- [ ] Sibling `{container} — OneUI` below source container
- [ ] One shell per visible child, **x-sorted**
- [ ] Map JSON `containerFlowExample` updated with source↔OneUI ids
- [ ] Gaps listed under `rebuildExample.containerRebuild.gaps`

## Deliverables checklist

- [ ] One `{source} — OneUI` frame per source, placed below source
- [ ] Real OneUI instances only (no Testlab leftovers)
- [ ] Gaps annotated; map statuses respected
- [ ] Theme modes on root; surfaces cascade where tinted
- [ ] Screenshots compared; URLs returned

## Related

- Map: `references/jds-to-oneui-component-map.json`
- Source analysis: `JDS-to-OneUI-React-Web.md` (consumer doc)
- `figma-surface-cascade`, `surface`, `prd-to-figma`
- Legacy library example: `SjyssHuM5x8fcnriezopvK` (Jio-Testlab-Library)
