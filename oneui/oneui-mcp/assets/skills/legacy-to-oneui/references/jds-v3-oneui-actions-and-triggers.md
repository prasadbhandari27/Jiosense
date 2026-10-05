---
name: jds-v3-oneui-actions-and-triggers
description: >-
  JDS v3 (Jio Testlab Library) → OneUI migration mapping for buttons and tap-to-open triggers. Covers Button, IconButton, SingleTextButton, SelectableButton, SelectableIconButton, SelectableSingleTextButton, ButtonGroup, SearchTrigger.
  Use when swapping or prop-mapping any of these components while converting a reference file to OneUI.
---

# Actions and triggers — JDS v3 → OneUI migration

Part of the JDS v3 → OneUI migration skill set. For routing across all component behaviours, load
`get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-migration-figma-agent.md")`.

**Load this skill when migrating:** Button, IconButton, SingleTextButton, SelectableButton, SelectableIconButton, SelectableSingleTextButton, ButtonGroup, SearchTrigger.

## Components in this skill

- **Button family (Button, IconButton, SingleTextButton, Selectable*, ButtonGroup)** — search `Button`
- **SearchTrigger** — search `SearchTrigger`

Jump straight to the component you need — each has its own Overview, Props Mapping, full comparison
table, and Migration Checklist. Do not invent prop names or variant values; use the tables below.

---

## Explicit mapping rules (override the tables below)

### When a legacy icon becomes an IconButton

Decide by **clickability** first, then background:

| Old element | OneUI component |
|---|---|
| Icon that is clickable / interactive (back, close, overflow, action icon) | **IconButton** — always. Never a bare Icon wrapped in a frame. |
| Icon that is NOT clickable but sits on a background/container | **IconContained** |
| Icon that is NOT clickable and has no background | **Icon** |

**Attention level:** dark background behind the icon → `attention = high`; no background →
`attention = low`; light surface → `attention = medium`.

**Always set the icon asset.** IconButton ships with a placeholder glyph — leaving it at the default
is a defect even when size, attention, and layout are correct. Verify each asset against the old
frame after placement.

Icon / IconContained mapping tables live in `get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-media-and-identity.md")`.

---

# Button family (Button, IconButton, SingleTextButton, Selectable*, ButtonGroup)  ·  JDS v3 → OneUI

---

# 1. Button → Button

## Overview

|                         | JDS (Jio Testlab Library)                             | OneUI                                                                                   |
| ----------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Component Name**      | Button                                                | Button                                                                                  |
| **Variant Filter**      | N/A (dedicated component)                             | N/A (dedicated component)                                                               |
| **Total Variants**      | 84 (7 sizes × 3 emphasis × 2 disabled × 2 full-width) | 384 (4 sizes × 3 attention × 2 condensed × 2 contained × 2 fullWidth × 2 start × 2 end) |
| **Instances in Use**    | 186                                                   | 119                                                                                     |
| **Page**                | Button                                                | ↳ Buttons                                                                               |
| **Child Instance Tags** | Start, Label, End                                     | CircularProgressIndicator, start, end                                                   |

---

## Props Mapping

### Label

|               | JDS                                                   | OneUI    |
| ------------- | ----------------------------------------------------- | -------- |
| **Prop Name** | Child `Label` component → `Text` prop                 | `label`  |
| **Type**      | Nested child TEXT (via Label component)               | TEXT     |
| **Default**   | "Text" (Label component default)                      | "Button" |
| **Mapping**   | Read `Label` child's `Text` value → set OneUI `label` |          |

#### Behavior Difference

- **JDS:** The button label is a nested `Label` component instance (from the Text page). The text is edited by overriding the child Label's `Text` prop. The Label component itself also carries its own `Variant`, `Emphasis`, `Weight`, and `Tinted` props for typography control.
- **OneUI:** The label is a simple top-level `label` TEXT prop on the Button itself. Typography is handled internally by the component based on the `size` variant.

> **Migration Note:** When migrating, extract the text string from the JDS Button's nested `Label` child and set it directly on the OneUI `label` prop. The Label component's typography props (`Variant`, `Emphasis`, `Weight`, `Tinted`) do not need to be migrated — OneUI handles typography internally per size.

---

### Emphasis → Attention

|               | JDS        | OneUI       |
| ------------- | ---------- | ----------- |
| **Prop Name** | `Emphasis` | `attention` |
| **Type**      | VARIANT    | VARIANT     |
| **Default**   | "Medium"   | "high"      |

#### Value Mapping

| JDS `Emphasis` | OneUI `attention` | Notes          |
| -------------- | ----------------- | -------------- |
| High           | high              | Direct mapping |
| Medium         | medium            | Direct mapping |
| Low            | low               | Direct mapping |

> **Important:** The **default value differs** — JDS defaults to `Medium` (middle tier), while OneUI defaults to `high` (top tier). Buttons migrated without explicitly setting this prop will appear **more prominent** in OneUI than they were in JDS. Always explicitly set `attention` during migration.

---

### Size

|               | JDS     | OneUI   |
| ------------- | ------- | ------- |
| **Prop Name** | `Size`  | `size`  |
| **Type**      | VARIANT | VARIANT |
| **Default**   | "M"     | "m"     |

#### Value Mapping

| JDS `Size` | OneUI `size`                       | Notes                                          |
| ---------- | ---------------------------------- | ---------------------------------------------- |
| 2XS        | ❌ _(no equivalent)_ — map to `xs` | Lossy — OneUI Button has no 2xs. Closest is xs |
| XS         | xs                                 | Direct mapping                                 |
| S          | s                                  | Direct mapping                                 |
| M          | m                                  | Direct mapping ✅ (both defaults)              |
| L          | l                                  | Direct mapping                                 |
| XL         | ❌ _(no equivalent)_ — map to `l`  | Lossy — OneUI Button caps at l                 |
| 2XL        | ❌ _(no equivalent)_ — map to `l`  | Lossy — OneUI Button caps at l                 |

> **Migration Note:** JDS has **7 sizes**, OneUI Button has only **4 sizes**. Three JDS sizes (`2XS`, `XL`, `2XL`) have no direct equivalent and must be downscaled. Audit instances using these sizes and validate the visual result after migration.

---

### Disabled

|               | JDS        | OneUI                             |
| ------------- | ---------- | --------------------------------- |
| **Prop Name** | `Disabled` | _(Not exposed as a variant prop)_ |
| **Type**      | VARIANT    | —                                 |
| **Default**   | "False"    | —                                 |

#### Value Mapping

| JDS `Disabled` | OneUI         | Notes                               |
| -------------- | ------------- | ----------------------------------- |
| False          | Default state | No action needed                    |
| True           | —             | No static disabled variant in OneUI |

> **Migration Note:** OneUI Button does not expose a `Disabled` variant prop. Disabled state is handled internally (likely via prototype interactions or opacity overrides). If your designs show buttons in an explicit Disabled state (e.g., in spec/redline frames), you'll need to handle this via manual overrides (opacity reduction, color desaturation) or separate documentation.

---

### Full Width

|               | JDS          | OneUI       |
| ------------- | ------------ | ----------- |
| **Prop Name** | `Full Width` | `fullWidth` |
| **Type**      | VARIANT      | VARIANT     |
| **Default**   | "False"      | "false"     |

#### Value Mapping

| JDS `Full Width` | OneUI `fullWidth` | Notes          |
| ---------------- | ----------------- | -------------- |
| False            | false             | Direct mapping |
| True             | true              | Direct mapping |

| **Mapping** | ✅ Direct 1:1 mapping | Rename only: `Full Width` → `fullWidth` |

---

### Start Icon

|                 | JDS                                                | OneUI                                           |
| --------------- | -------------------------------------------------- | ----------------------------------------------- |
| **Toggle Prop** | `Start` (BOOLEAN, default: false)                  | `start` (VARIANT: false/true, default: false)   |
| **Swap Prop**   | _(Override nested `Icon` child instance directly)_ | `↳start` / `↳start‎` (INSTANCE_SWAP, dedicated) |

#### Behavior Difference

- **JDS:** `Start` is a BOOLEAN prop that toggles the visibility of the start icon slot. The icon itself is a child `Icon` component instance — you swap the icon by overriding the nested Icon child directly.
- **OneUI:** `start` is a VARIANT prop (string `"true"`/`"false"`) that toggles visibility. A dedicated `↳start` INSTANCE_SWAP prop on the button lets you swap the start icon without navigating into the layer tree. Two swap props exist (`↳start` and `↳start‎`) for contained vs uncontained variants.

> **Migration Note:** Convert the JDS BOOLEAN toggle to a VARIANT string value. Then identify which icon component was used as the nested Icon override in JDS, and set it on the OneUI `↳start` instance swap prop.

---

### End Icon

|                 | JDS                                                | OneUI                                        |
| --------------- | -------------------------------------------------- | -------------------------------------------- |
| **Toggle Prop** | `End` (BOOLEAN, default: false)                    | `end` (VARIANT: false/true, default: false)  |
| **Swap Prop**   | _(Override nested `Icon` child instance directly)_ | `↳end` / `↳end 2` (INSTANCE_SWAP, dedicated) |

#### Behavior Difference

- **JDS:** Same pattern as Start — `End` is a BOOLEAN toggle, and the icon is swapped by overriding the nested child `Icon` instance.
- **OneUI:** `end` is a VARIANT toggle, with dedicated `↳end` / `↳end 2` INSTANCE_SWAP props for the two contained states.

> **Migration Note:** Same approach as Start Icon — convert BOOLEAN to VARIANT string, then map the nested icon override to the `↳end` instance swap prop.

---

### New Props in OneUI (No JDS Equivalent)

#### Contained

|                 | OneUI                                                                                                                                               |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Prop Name**   | `contained`                                                                                                                                         |
| **Type**        | VARIANT                                                                                                                                             |
| **Options**     | true, false                                                                                                                                         |
| **Default**     | true                                                                                                                                                |
| **Description** | Controls whether the button has a background fill. When `true`, renders with a solid background. When `false`, renders as a ghost/text-only button. |

> **Migration Note:** JDS Button does not have a contained/ghost toggle — it is always contained (filled). Set `contained = true` for all migrated instances unless you intentionally want to convert some to ghost buttons. JDS `Emphasis: Low` may visually approximate OneUI `contained: false` in some contexts — verify visually case by case.

#### Condensed

|                 | OneUI                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------------- |
| **Prop Name**   | `condensed`                                                                                     |
| **Type**        | VARIANT                                                                                         |
| **Options**     | false, true                                                                                     |
| **Default**     | false                                                                                           |
| **Description** | Compact padding variant — reduces internal horizontal and vertical spacing for tighter layouts. |

> **Migration Note:** JDS Button has no condensed variant. Default `false` (standard padding) preserves JDS visual spacing. Only set to `true` if the layout requires tighter button spacing post-migration.

#### Loading State (CircularProgressIndicator)

|                      | OneUI                                                                                                                             |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Child Dependency** | `CircularProgressIndicator`                                                                                                       |
| **Description**      | OneUI Button includes a `CircularProgressIndicator` child component for loading states. JDS Button has no built-in loading state. |

> **Migration Note:** This is a net-new capability in OneUI. If your JDS designs showed loading states via custom overrides or separate loading frames, you can now use the built-in `CircularProgressIndicator` child in OneUI.

---

### Props Not in OneUI (JDS-Only, Lost in Migration)

| JDS Prop                   | Type                     | Values            | Impact                                                        |
| -------------------------- | ------------------------ | ----------------- | ------------------------------------------------------------- |
| `Disabled`                 | VARIANT                  | False, True       | ⚠️ No static disabled variant in OneUI. Handle via overrides. |
| Label component's `Weight` | VARIANT (on child Label) | Low, Medium, High | Typography weight control lost — OneUI manages internally.    |
| Label component's `Tinted` | VARIANT (on child Label) | False, True       | Color tinting option lost — OneUI manages internally.         |

---

## Full Props Comparison Table

| #   | Prop Concept         | JDS Prop               | JDS Type       | JDS Values        | JDS Default | OneUI Prop  | OneUI Type                | OneUI Values      | OneUI Default | Status                    |
| --- | -------------------- | ---------------------- | -------------- | ----------------- | ----------- | ----------- | ------------------------- | ----------------- | ------------- | ------------------------- |
| 1   | Label text           | Child `Label` → `Text` | Child TEXT     | free text         | "Text"      | `label`     | TEXT                      | free text         | "Button"      | ⚠️ Mechanism change       |
| 2   | Emphasis / Attention | `Emphasis`             | VARIANT        | High, Medium, Low | Medium      | `attention` | VARIANT                   | high, medium, low | high          | ✅ 1:1 (default differs)  |
| 3   | Size                 | `Size`                 | VARIANT        | 2XS–2XL (7)       | M           | `size`      | VARIANT                   | xs–l (4)          | m             | ⚠️ Partial (3 sizes lost) |
| 4   | Disabled             | `Disabled`             | VARIANT        | False, True       | False       | _(none)_    | —                         | —                 | —             | ❌ JDS-only               |
| 5   | Full Width           | `Full Width`           | VARIANT        | False, True       | False       | `fullWidth` | VARIANT                   | false, true       | false         | ✅ Direct match           |
| 6   | Start icon toggle    | `Start`                | BOOLEAN        | true/false        | false       | `start`     | VARIANT                   | false, true       | false         | ⚠️ Type change            |
| 7   | Start icon swap      | _(child override)_     | Child instance | —                 | —           | `↳start`    | INSTANCE_SWAP             | component ref     | placeholder   | ⚠️ Mechanism change       |
| 8   | End icon toggle      | `End`                  | BOOLEAN        | true/false        | false       | `end`       | VARIANT                   | false, true       | false         | ⚠️ Type change            |
| 9   | End icon swap        | _(child override)_     | Child instance | —                 | —           | `↳end`      | INSTANCE_SWAP             | component ref     | placeholder   | ⚠️ Mechanism change       |
| 10  | Contained            | _(N/A)_                | —              | —                 | —           | `contained` | VARIANT                   | true, false       | true          | ❌ OneUI-only (new)       |
| 11  | Condensed            | _(N/A)_                | —              | —                 | —           | `condensed` | VARIANT                   | false, true       | false         | ❌ OneUI-only (new)       |
| 12  | Loading              | _(N/A)_                | —              | —                 | —           | _(child)_   | CircularProgressIndicator | —                 | —             | ❌ OneUI-only (new)       |

---

## Migration Checklist

- [ ] Map `Emphasis` → `attention` (High→high, Medium→medium, Low→low) — **always set explicitly** due to default change (Medium → high)
- [ ] Map `Size` (XS→xs, S→s, M→m, L→l) — **flag instances using 2XS, XL, 2XL** for manual size decision
- [ ] Map `Full Width` → `fullWidth` (direct rename)
- [ ] Migrate `Start` BOOLEAN → `start` VARIANT + `↳start` INSTANCE_SWAP
- [ ] Migrate `End` BOOLEAN → `end` VARIANT + `↳end` INSTANCE_SWAP
- [ ] Extract label text from nested `Label` child → set on OneUI `label` TEXT prop
- [ ] Decide defaults for new props: `contained` (recommended: `true`), `condensed` (recommended: `false`)
- [ ] Handle `Disabled = True` instances separately (override-based approach)
- [ ] Audit any instances relying on Label's `Weight` or `Tinted` props — these are lost in migration

---

---

# 2. IconButton → IconButton

## Overview

|                         | JDS (Jio Testlab Library)                            | OneUI                                                                           |
| ----------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Component Name**      | IconButton                                           | IconButton                                                                      |
| **Total Variants**      | 84 (7 sizes × 3 emphasis × 2 disabled × 2 condensed) | 432 (6 sizes × 3 attention × 2 shape × 2 condensed × 2 contained × 2 fullWidth) |
| **Instances in Use**    | 2                                                    | 281                                                                             |
| **Page**                | IconButton                                           | ↳ Buttons                                                                       |
| **Child Instance Tags** | Icon                                                 | CircularProgressIndicator, Icon                                                 |

---

## Props Mapping

### Size

|               | JDS     | OneUI   |
| ------------- | ------- | ------- |
| **Prop Name** | `Size`  | `size`  |
| **Type**      | VARIANT | VARIANT |
| **Default**   | "M"     | "m"     |

#### Value Mapping

| JDS `Size` | OneUI `size`                       | Notes                             |
| ---------- | ---------------------------------- | --------------------------------- |
| 2XS        | 2xs                                | Direct mapping ✅                 |
| XS         | xs                                 | Direct mapping                    |
| S          | s                                  | Direct mapping                    |
| M          | m                                  | Direct mapping ✅ (both defaults) |
| L          | l                                  | Direct mapping                    |
| XL         | xl                                 | Direct mapping ✅                 |
| 2XL        | ❌ _(no equivalent)_ — map to `xl` | Lossy — OneUI caps at xl          |

> **Migration Note:** Much better size coverage than Button — only `2XL` is lost. All other 6 sizes map directly.

---

### Emphasis → Attention

|               | JDS        | OneUI       |
| ------------- | ---------- | ----------- |
| **Prop Name** | `Emphasis` | `attention` |
| **Type**      | VARIANT    | VARIANT     |
| **Default**   | "Medium"   | "high"      |

#### Value Mapping

| JDS `Emphasis` | OneUI `attention` | Notes          |
| -------------- | ----------------- | -------------- |
| High           | high              | Direct mapping |
| Medium         | medium            | Direct mapping |
| Low            | low               | Direct mapping |

> **Important:** Same default-shift as Button — JDS defaults to `Medium`, OneUI to `high`. Always set explicitly during migration.

---

### Disabled

|               | JDS        | OneUI                             |
| ------------- | ---------- | --------------------------------- |
| **Prop Name** | `Disabled` | _(Not exposed as a variant prop)_ |
| **Type**      | VARIANT    | —                                 |
| **Default**   | "False"    | —                                 |

#### Value Mapping

| JDS `Disabled` | OneUI         | Notes                               |
| -------------- | ------------- | ----------------------------------- |
| False          | Default state | No action needed                    |
| True           | —             | No static disabled variant in OneUI |

> **Migration Note:** Same gap as Button — handle via overrides.

---

### Condensed

|               | JDS         | OneUI       |
| ------------- | ----------- | ----------- |
| **Prop Name** | `condensed` | `condensed` |
| **Type**      | VARIANT     | VARIANT     |
| **Default**   | "true"      | "false"     |

#### Value Mapping

| JDS `condensed` | OneUI `condensed` | Notes          |
| --------------- | ----------------- | -------------- |
| true            | true              | Direct mapping |
| false           | false             | Direct mapping |

> **⚠️ Critical:** The **defaults are opposite** — JDS defaults to `true` (condensed), OneUI defaults to `false` (standard). Migrated IconButtons will appear **larger with more padding** unless you explicitly set `condensed = true`.

---

### Icon

|               | JDS                                | OneUI                              |
| ------------- | ---------------------------------- | ---------------------------------- |
| **Prop Name** | _(Child `Icon` instance override)_ | _(Child `Icon` instance override)_ |
| **Type**      | Child dependency                   | Child dependency                   |
| **Mechanism** | Override nested Icon child         | Override nested Icon child         |

> **Note:** Both libraries use the same mechanism — the icon is a child `Icon` component you override by swapping the nested instance. No migration change needed for the icon itself, only for the icon library source (JDS Icon vs OneUI Icon).

---

### New Props in OneUI (No JDS Equivalent)

#### Shape

|                 | OneUI                                                              |
| --------------- | ------------------------------------------------------------------ |
| **Prop Name**   | `shape`                                                            |
| **Type**        | VARIANT                                                            |
| **Options**     | 1:1, 3:2                                                           |
| **Default**     | 1:1                                                                |
| **Description** | Controls the aspect ratio. `1:1` = square, `3:2` = landscape/wide. |

> **Migration Note:** JDS IconButton is always square. Set `shape = 1:1` (default) for all migrated instances.

#### Contained

|                 | OneUI                                                                   |
| --------------- | ----------------------------------------------------------------------- |
| **Prop Name**   | `contained`                                                             |
| **Type**        | VARIANT                                                                 |
| **Options**     | true, false                                                             |
| **Default**     | true                                                                    |
| **Description** | Controls background fill. `true` = solid fill, `false` = ghost/outline. |

> **Migration Note:** JDS IconButton has no contained toggle. Set `contained = true` for all migrated instances.

#### Full Width

|                 | OneUI                                          |
| --------------- | ---------------------------------------------- |
| **Prop Name**   | `fullWidth`                                    |
| **Type**        | VARIANT                                        |
| **Options**     | false, true                                    |
| **Default**     | false                                          |
| **Description** | Stretches icon button to fill container width. |

> **Migration Note:** JDS IconButton has no fullWidth. Default `false` preserves JDS behavior.

#### Loading State (CircularProgressIndicator)

|                      | OneUI                                                                             |
| -------------------- | --------------------------------------------------------------------------------- |
| **Child Dependency** | `CircularProgressIndicator`                                                       |
| **Description**      | OneUI IconButton includes a loading spinner. JDS IconButton has no loading state. |

---

### Props Not in OneUI (JDS-Only, Lost in Migration)

| JDS Prop   | Type    | Values      | Impact                                                        |
| ---------- | ------- | ----------- | ------------------------------------------------------------- |
| `Disabled` | VARIANT | False, True | ⚠️ No static disabled variant in OneUI. Handle via overrides. |

---

## Full Props Comparison Table (IconButton)

| #   | Prop Concept         | JDS Prop           | JDS Type  | JDS Values        | JDS Default | OneUI Prop         | OneUI Type                | OneUI Values      | OneUI Default | Status                        |
| --- | -------------------- | ------------------ | --------- | ----------------- | ----------- | ------------------ | ------------------------- | ----------------- | ------------- | ----------------------------- |
| 1   | Size                 | `Size`             | VARIANT   | 2XS–2XL (7)       | M           | `size`             | VARIANT                   | 2xs–xl (6)        | m             | ✅ Near-match (only 2XL lost) |
| 2   | Emphasis / Attention | `Emphasis`         | VARIANT   | High, Medium, Low | Medium      | `attention`        | VARIANT                   | high, medium, low | high          | ✅ 1:1 (default differs)      |
| 3   | Disabled             | `Disabled`         | VARIANT   | False, True       | False       | _(none)_           | —                         | —                 | —             | ❌ JDS-only                   |
| 4   | Condensed            | `condensed`        | VARIANT   | true, false       | true        | `condensed`        | VARIANT                   | false, true       | false         | ⚠️ Default flipped            |
| 5   | Icon                 | _(child override)_ | Child dep | —                 | —           | _(child override)_ | Child dep                 | —                 | —             | ✅ Same mechanism             |
| 6   | Shape                | _(N/A)_            | —         | —                 | —           | `shape`            | VARIANT                   | 1:1, 3:2          | 1:1           | ❌ OneUI-only (new)           |
| 7   | Contained            | _(N/A)_            | —         | —                 | —           | `contained`        | VARIANT                   | true, false       | true          | ❌ OneUI-only (new)           |
| 8   | Full Width           | _(N/A)_            | —         | —                 | —           | `fullWidth`        | VARIANT                   | false, true       | false         | ❌ OneUI-only (new)           |
| 9   | Loading              | _(N/A)_            | —         | —                 | —           | _(child)_          | CircularProgressIndicator | —                 | —             | ❌ OneUI-only (new)           |

---

## Migration Checklist (IconButton)

- [ ] Map `Emphasis` → `attention` — **always set explicitly** (default shifts from Medium to high)
- [ ] Map `Size` (2XS→2xs, XS→xs, S→s, M→m, L→l, XL→xl) — **flag 2XL instances** for manual mapping to xl
- [ ] **Set `condensed = true`** on all migrated instances to preserve JDS compact appearance (JDS defaults true, OneUI defaults false)
- [ ] Handle `Disabled = True` instances via overrides
- [ ] Set `shape = 1:1` (default, matches JDS square)
- [ ] Set `contained = true` (default, matches JDS filled appearance)
- [ ] Swap icon references from JDS Icon library to OneUI Icon library

---

---

# 3. SingleTextButton → _(New in OneUI, No JDS Equivalent)_

## Overview

|                         | JDS (Jio Testlab Library) | OneUI                                                                                    |
| ----------------------- | ------------------------- | ---------------------------------------------------------------------------------------- |
| **Component Name**      | _(No equivalent)_         | SingleTextButton                                                                         |
| **Total Variants**      | —                         | 18 (3 sizes × 3 attention × 2 condensed)                                                 |
| **Instances in Use**    | —                         | 96                                                                                       |
| **Page**                | —                         | ↳ Buttons                                                                                |
| **Child Instance Tags** | —                         | CircularProgressIndicator                                                                |
| **Description**         | —                         | The simplest button in OneUI — text only, no icon slots, no contained/fullWidth toggles. |

---

## Props

| #   | Prop        | Type    | Values            | Default | Description                      |
| --- | ----------- | ------- | ----------------- | ------- | -------------------------------- |
| 1   | `size`      | VARIANT | s, m, l           | m       | Overall size (3 options — no xs) |
| 2   | `attention` | VARIANT | high, medium, low | high    | Visual prominence                |
| 3   | `condensed` | VARIANT | false, true       | false   | Compact padding                  |

---

## When to Use Instead of Button

| JDS Button Configuration                          | Consider OneUI Target | Why                                                            |
| ------------------------------------------------- | --------------------- | -------------------------------------------------------------- |
| `Start: false`, `End: false`, `Full Width: false` | **SingleTextButton**  | Lighter component — no unused icon slots or fullWidth overhead |
| Any icon enabled, or full-width needed            | **Button**            | SingleTextButton has no icon or fullWidth support              |

> **Migration Note:** If a JDS `Button` instance uses no icons and no full-width, you can optionally migrate it to `SingleTextButton` for a cleaner, lighter component. This is optional — migrating to `Button` works perfectly fine too.

---

---

# 4. SelectableButton → _(New in OneUI, No JDS Equivalent)_

## Overview

|                         | JDS (Jio Testlab Library) | OneUI                                                                                              |
| ----------------------- | ------------------------- | -------------------------------------------------------------------------------------------------- |
| **Component Name**      | _(No equivalent)_         | SelectableButton                                                                                   |
| **Total Variants**      | —                         | 384+ (4 sizes × 3 attention × 2 selected × 2 condensed × 2 contained × 2 fullWidth × start/end)    |
| **Instances in Use**    | —                         | 0                                                                                                  |
| **Page**                | —                         | ↳ SelectableButtons                                                                                |
| **Child Instance Tags** | —                         | CircularProgressIndicator, start, end                                                              |
| **Description**         | —                         | Structurally identical to OneUI `Button` with one addition: a `selected` prop for toggle behavior. |

---

## Relationship to OneUI Button

`SelectableButton` is **OneUI `Button` + `selected` prop**. Every other prop is exactly the same:

| Prop                            | In Button? | In SelectableButton? | Notes               |
| ------------------------------- | ---------- | -------------------- | ------------------- |
| `label`                         | ✅         | ✅                   | Same                |
| `size` (xs, s, m, l)            | ✅         | ✅                   | Same                |
| `attention` (high, medium, low) | ✅         | ✅                   | Same                |
| `condensed` (false, true)       | ✅         | ✅                   | Same                |
| `contained` (true, false)       | ✅         | ✅                   | Same                |
| `fullWidth` (false, true)       | ✅         | ✅                   | Same                |
| `start` / `↳start`              | ✅         | ✅                   | Same                |
| `end` / `↳end`                  | ✅         | ✅                   | Same                |
| **`selected` (true, false)**    | ❌         | ✅                   | **Only difference** |

---

## Selected Prop

|                 | OneUI                                                                                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Prop Name**   | `selected`                                                                                                                                                                      |
| **Type**        | VARIANT                                                                                                                                                                         |
| **Options**     | true, false                                                                                                                                                                     |
| **Default**     | true                                                                                                                                                                            |
| **Description** | Toggles the button's selected/active visual state. When `true`, renders with a selected appearance (filled/highlighted). When `false`, renders in its unselected/default state. |

---

## When to Use

| Scenario                                                 | Use Component        |
| -------------------------------------------------------- | -------------------- |
| JDS `Button` that needs a toggle/selected state in OneUI | **SelectableButton** |
| JDS `Button` that does NOT need a toggle state           | **Button**           |

> **Migration Note:** JDS `Button` has no selected state. If you're adding toggle behavior during the migration, use `SelectableButton`. Otherwise, use `Button`. All other prop mappings (Emphasis→attention, Size, Start/End icons, etc.) follow the exact same rules documented in Section 1 above.

---

---

# 5. SelectableIconButton → _(New in OneUI, No JDS Equivalent)_

## Overview

|                         | JDS (Jio Testlab Library) | OneUI                                                                                        |
| ----------------------- | ------------------------- | -------------------------------------------------------------------------------------------- |
| **Component Name**      | _(No equivalent)_         | SelectableIconButton                                                                         |
| **Total Variants**      | —                         | 576 (6 sizes × 3 attention × 2 shape × 2 selected × 2 condensed × 2 contained × 2 fullWidth) |
| **Instances in Use**    | —                         | 0                                                                                            |
| **Page**                | —                         | ↳ SelectableButtons                                                                          |
| **Child Instance Tags** | —                         | CircularProgressIndicator, Icon                                                              |
| **Description**         | —                         | Structurally identical to OneUI `IconButton` with one addition: a `selected` prop.           |

---

## Relationship to OneUI IconButton

`SelectableIconButton` is **OneUI `IconButton` + `selected` prop**. Every other prop is exactly the same:

| Prop                            | In IconButton? | In SelectableIconButton? | Notes               |
| ------------------------------- | -------------- | ------------------------ | ------------------- |
| `size` (2xs, xs, s, m, l, xl)   | ✅             | ✅                       | Same                |
| `attention` (high, medium, low) | ✅             | ✅                       | Same                |
| `shape` (1:1, 3:2)              | ✅             | ✅                       | Same                |
| `condensed` (false, true)       | ✅             | ✅                       | Same                |
| `contained` (true, false)       | ✅             | ✅                       | Same                |
| `fullWidth` (false, true)       | ✅             | ✅                       | Same                |
| **`selected` (true, false)**    | ❌             | ✅                       | **Only difference** |

---

## Selected Prop

|                 | OneUI                                                   |
| --------------- | ------------------------------------------------------- |
| **Prop Name**   | `selected`                                              |
| **Type**        | VARIANT                                                 |
| **Options**     | true, false                                             |
| **Default**     | true                                                    |
| **Description** | Toggles the icon button's selected/active visual state. |

---

## When to Use

| Scenario                                                     | Use Component            |
| ------------------------------------------------------------ | ------------------------ |
| JDS `IconButton` that needs a toggle/selected state in OneUI | **SelectableIconButton** |
| JDS `IconButton` that does NOT need a toggle state           | **IconButton**           |

> **Migration Note:** JDS `IconButton` has no selected state. If you're adding toggle behavior during the migration, use `SelectableIconButton`. All other prop mappings (Size, Emphasis→attention, condensed default flip, etc.) follow the exact same rules documented in Section 2 above.

---

---

# 6. SelectableSingleTextButton → _(New in OneUI, No JDS Equivalent)_

## Overview

|                         | JDS (Jio Testlab Library) | OneUI                                                                                    |
| ----------------------- | ------------------------- | ---------------------------------------------------------------------------------------- |
| **Component Name**      | _(No equivalent)_         | SelectableSingleTextButton                                                               |
| **Total Variants**      | —                         | 36 (3 sizes × 3 attention × 2 selected × 2 condensed)                                    |
| **Instances in Use**    | —                         | 2                                                                                        |
| **Page**                | —                         | ↳ SelectableButtons                                                                      |
| **Child Instance Tags** | —                         | CircularProgressIndicator                                                                |
| **Description**         | —                         | Structurally identical to OneUI `SingleTextButton` with one addition: a `selected` prop. |

---

## Relationship to OneUI SingleTextButton

`SelectableSingleTextButton` is **OneUI `SingleTextButton` + `selected` prop**:

| Prop                            | In SingleTextButton? | In SelectableSingleTextButton? | Notes               |
| ------------------------------- | -------------------- | ------------------------------ | ------------------- |
| `size` (s, m, l)                | ✅                   | ✅                             | Same                |
| `attention` (high, medium, low) | ✅                   | ✅                             | Same                |
| `condensed` (false, true)       | ✅                   | ✅                             | Same                |
| **`selected` (true, false)**    | ❌                   | ✅                             | **Only difference** |

---

## Selected Prop

|                 | OneUI                                                   |
| --------------- | ------------------------------------------------------- |
| **Prop Name**   | `selected`                                              |
| **Type**        | VARIANT                                                 |
| **Options**     | true, false                                             |
| **Default**     | true                                                    |
| **Description** | Toggles the text button's selected/active visual state. |

---

## When to Use

| Scenario                                                   | Use Component                  |
| ---------------------------------------------------------- | ------------------------------ |
| Simple text-only button that needs a toggle/selected state | **SelectableSingleTextButton** |
| Simple text-only button without toggle                     | **SingleTextButton**           |

---

---

# 7. ButtonGroup → _(No OneUI Equivalent)_

## Overview

|                         | JDS (Jio Testlab Library)                   | OneUI             |
| ----------------------- | ------------------------------------------- | ----------------- |
| **Component Name**      | ButtonGroup                                 | _(No equivalent)_ |
| **Total Variants**      | 28 (2 orientation × 7 sizes × 2 full-width) |                   |
| **Instances in Use**    | 28                                          | —                 |
| **Page**                | ButtonGroup                                 | —                 |
| **Child Instance Tags** | Slot, Button                                | —                 |

---

## JDS ButtonGroup Props

| #   | Prop          | Type    | Values                    | Default    | Migration Recommendation                            |
| --- | ------------- | ------- | ------------------------- | ---------- | --------------------------------------------------- |
| 1   | `Orientation` | VARIANT | Horizontal, Vertical      | Horizontal | Use an auto-layout frame; set direction accordingly |
| 2   | `Size`        | VARIANT | 2XS, XS, S, M, L, XL, 2XL | M          | Set `size` on each individual OneUI Button child    |
| 3   | `Full Width`  | VARIANT | False, True               | False      | Set `fullWidth` on each child + parent frame fill   |
| 4   | `Slot`        | BOOLEAN | true/false                | false      | Manual slot composition in the parent frame         |

> **Migration Note:** OneUI does not have a ButtonGroup component. Recreate the grouping using an auto-layout frame containing individual OneUI `Button` instances. Set orientation (horizontal/vertical) on the frame, and size/fullWidth on each button child individually.

---

## Migration Checklist (ButtonGroup)

- [ ] Audit all 28 ButtonGroup instances
- [ ] Replace each with an auto-layout frame
- [ ] Set frame direction to match JDS `Orientation` (Horizontal/Vertical)
- [ ] Place OneUI `Button` children inside, set `size` on each
- [ ] If `Full Width: True`, set parent frame to fill and each button's `fullWidth` to true

---

---

# 8. Complete OneUI Button Family Summary

| #   | OneUI Component                | Page                | Instances | JDS Equivalent     | Base Component   | Extra Prop   |
| --- | ------------------------------ | ------------------- | --------- | ------------------ | ---------------- | ------------ |
| 1   | **Button**                     | ↳ Buttons           | 119       | **Button** (186)   | —                | —            |
| 2   | **IconButton**                 | ↳ Buttons           | 281       | **IconButton** (2) | —                | —            |
| 3   | **SingleTextButton**           | ↳ Buttons           | 96        | _(None)_           | —                | —            |
| 4   | **SelectableButton**           | ↳ SelectableButtons | 0         | _(None)_           | Button           | + `selected` |
| 5   | **SelectableIconButton**       | ↳ SelectableButtons | 0         | _(None)_           | IconButton       | + `selected` |
| 6   | **SelectableSingleTextButton** | ↳ SelectableButtons | 2         | _(None)_           | SingleTextButton | + `selected` |

> **Key Insight:** Each Selectable variant is its base component + `selected` prop. No other prop differences. Choose the Selectable version only when you need a toggle/selected state.

---

# 9. Complete Migration Checklist

## Button

- [ ] Map `Emphasis` → `attention` (High→high, Medium→medium, Low→low) — **set explicitly** (default shifts Medium → high)
- [ ] Map `Size` (XS→xs, S→s, M→m, L→l) — flag 2XS, XL, 2XL for manual decision
- [ ] Map `Full Width` → `fullWidth` (rename)
- [ ] Migrate `Start` BOOLEAN → `start` VARIANT + `↳start` INSTANCE_SWAP
- [ ] Migrate `End` BOOLEAN → `end` VARIANT + `↳end` INSTANCE_SWAP
- [ ] Extract label text from nested `Label` child → OneUI `label` TEXT prop
- [ ] Decide defaults for `contained` (true), `condensed` (false)
- [ ] Handle `Disabled = True` instances via overrides
- [ ] Audit Label's `Weight` and `Tinted` props — lost in migration

## IconButton

- [ ] Map `Emphasis` → `attention` — **set explicitly** (default shifts Medium → high)
- [ ] Map `Size` (2XS→2xs through XL→xl) — flag 2XL for manual mapping to xl
- [ ] **Set `condensed = true`** to preserve JDS compact appearance (default flipped)
- [ ] Handle `Disabled = True` instances via overrides
- [ ] Set `shape = 1:1`, `contained = true` (match JDS defaults)
- [ ] Swap icon references from JDS Icon to OneUI Icon library

## ButtonGroup

- [ ] Replace all 28 instances with auto-layout frames + OneUI Button children
- [ ] Match `Orientation` → frame direction, `Size` → per-child `size`

## New Components (Adopt as Needed)

- [ ] Consider `SingleTextButton` for simple text-only JDS Buttons (no icons, no full-width)
- [ ] Consider `SelectableButton` / `SelectableIconButton` / `SelectableSingleTextButton` when adding toggle behavior

---

---

# SearchTrigger  ·  JDS v3 → OneUI

## 1. Overview

| Component         | JDS (Jio Testlab Library) | OneUI Micropatterns                                                                                                                                                                                 | Migration Type         |
| ----------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| **SearchTrigger** | ❌ Does not exist         | ✅ `.SearchTrigger` (CS, 3 variants) — `searchStates` (idle / active / filled). Composed of 3 state-specific sub-CS with `size` × `showEndSlot` variants. Built on the `.DNA/Input` pill framework. | 🆕 New OneUI component |

> **Key Finding:** JDS has no Search, SearchTrigger, SearchBar, Input, or TextField component of any kind. The OneUI `.SearchTrigger` is an entirely new component with no JDS equivalent. It is a **sub-component** (dot prefix `.`) designed for use inside `ContextMenu` and other micropattern compositions — not typically used standalone.

---

## 2. Architecture — OneUI `.SearchTrigger`

### 2.1 Component Hierarchy

### SearchTrigger — Internal Structure

    .SearchTrigger (Main CS — 3 variants)
    ├── searchStates=idle → .Idle.SearchTrigger instance
    ├── searchStates=active → .Active.SearchTrigger instance
    └── searchStates=filled → .Filled.SearchTrigger instance

    .Idle.SearchTrigger (Sub-CS — 8 variants)
    ├── showEndSlot: mic / none
    └── size: xs / s / m / l

    .Active.SearchTrigger (Sub-CS — 4 variants)
    └── size: xs / s / m / l
        (no showEndSlot — end slot hidden during active input)

    .Filled.SearchTrigger (Sub-CS — 8 variants)
    ├── showEndSlot: mic / none
    └── size: xs / s / m / l

### 2.2 Internal Layer Structure (all states share this)

### SearchTrigger [State] — Internal Structure

    [State].SearchTrigger
    └── Input (instance of "Input" CS, size-matched)
        └── .DNA/Input/[Size] (core input framework)
            └── StateLayer (HORIZONTAL auto-layout, 12px horizontal padding, 6px vertical)
                ├── Start (frame, 20×20)
                │   └── start 1 (Slot/size5/IconHigh → search icon)
                │
                ├── InputText (instance of "InputText" CS)
                │   └── InputText (TEXT node — placeholder or value)
                │
                └── End (frame, 20×20)
                    └── end (Slot/size5/IconButtonHighUncontained → mic/close icon)

### 2.3 State-specific DNA/Input Configuration

| State      | `attention` | `shape` | `state`  | InputText Characters         | End Slot Behavior                     |
| ---------- | ----------- | ------- | -------- | ---------------------------- | ------------------------------------- |
| **idle**   | `high`      | `pill`  | `idle`   | `"Search"` (placeholder)     | Mic icon or hidden (`showEndSlot`)    |
| **active** | `medium`    | `pill`  | `focus`  | `"Lorem\|"` (cursor visible) | Always hidden (no `showEndSlot` prop) |
| **filled** | `high`      | `pill`  | `filled` | `"Lorem"` (entered text)     | Mic icon or hidden (`showEndSlot`)    |

---

## 3. Component Set Details

### 3.1 `.SearchTrigger` (Main Router CS)

| Prop           | Type    | Default | Values                     | Purpose                                            |
| -------------- | ------- | ------- | -------------------------- | -------------------------------------------------- |
| `searchStates` | VARIANT | `idle`  | `idle`, `active`, `filled` | Routes to the correct state-specific sub-component |

**Variant count:** 3
**Default dimensions:** 400 × 40px (size=m)

### 3.2 `.Idle.SearchTrigger` (Sub-CS)

| Prop          | Type    | Default | Values              | Purpose                                       |
| ------------- | ------- | ------- | ------------------- | --------------------------------------------- |
| `showEndSlot` | VARIANT | `mic`   | `mic`, `none`       | Show/hide trailing mic icon                   |
| `size`        | VARIANT | `m`     | `xs`, `s`, `m`, `l` | Trigger height — scales all internal elements |

**Variant count:** 8 (2 × 4)
**Visual:** Pill-shaped search field with placeholder text "Search", search icon (start), optional mic icon (end). Background: `rgba(245, 245, 246, 1)` (light gray). Corner radius: `9999` (full pill).

### 3.3 `.Active.SearchTrigger` (Sub-CS)

| Prop   | Type    | Default | Values              | Purpose        |
| ------ | ------- | ------- | ------------------- | -------------- |
| `size` | VARIANT | `m`     | `xs`, `s`, `m`, `l` | Trigger height |

**Variant count:** 4
**Visual:** Active input state with focus ring, cursor visible in text (`"Lorem|"`), end slot always hidden (user is typing). `attention=medium` lowers visual weight to indicate input focus.

### 3.4 `.Filled.SearchTrigger` (Sub-CS)

| Prop          | Type    | Default | Values              | Purpose                     |
| ------------- | ------- | ------- | ------------------- | --------------------------- |
| `showEndSlot` | VARIANT | `mic`   | `mic`, `none`       | Show/hide trailing mic icon |
| `size`        | VARIANT | `m`     | `xs`, `s`, `m`, `l` | Trigger height              |

**Variant count:** 8 (2 × 4)
**Visual:** Filled state with search text displayed (`"Lorem"`), search icon (start), optional mic icon (end). `attention=high` restores full visual weight.

---

## 4. Size Dimensions

| Size | Width | Height   | Icon Size | Padding (H × V) | Font Size |
| ---- | ----- | -------- | --------- | --------------- | --------- |
| `xs` | 400px | 24px     | 20×20     | 12×6            | —         |
| `s`  | 400px | 32px     | 20×20     | 12×6            | —         |
| `m`  | 400px | **40px** | 20×20     | 12×6            | 16px      |
| `l`  | 400px | 48px     | 20×20     | 12×6            | —         |

All sizes share the same width (400px) and internal padding. Height scales with size.

---

## 5. Relationship to Other Components

### 5.1 Used Inside `ContextMenu`

`.SearchTrigger` is embedded inside `ContextMenu` (CS, 4 variants). The `ContextMenu.showSearch` BOOLEAN toggles visibility of the `.SearchTrigger` instance:

### ContextMenu — Internal Structure

    ContextMenu
    ├── .SearchTrigger (instance, visibility controlled by showSearch)
    └── Add ListItem ↓ (SLOT — stacked ListItem instances)

- When `showSearch=true` (default): `.SearchTrigger` is visible at the top of the menu
- When `showSearch=false`: `.SearchTrigger` is hidden

### 5.2 Built on `.DNA/Input` Framework

`.SearchTrigger` is not a standalone input — it's a **specialized wrapper** around the OneUI `.DNA/Input` primitive, pre-configured with:

- **Shape:** Always `pill` (rounded ends, cornerRadius 9999)
- **Start icon:** Always `search` icon via `Slot/size5/IconHigh`
- **End icon:** Mic icon via `Slot/size5/IconButtonHighUncontained` (when `showEndSlot=mic`)
- **InputText:** Uses the `InputText` sub-component for text display

---

## 6. Full Prop Reference Table

| Sub-Component           | Prop           | Type    | Default | Values               | Notes                |
| ----------------------- | -------------- | ------- | ------- | -------------------- | -------------------- |
| `.SearchTrigger`        | `searchStates` | VARIANT | `idle`  | idle, active, filled | State router         |
| `.Idle.SearchTrigger`   | `showEndSlot`  | VARIANT | `mic`   | mic, none            | Trailing icon toggle |
| `.Idle.SearchTrigger`   | `size`         | VARIANT | `m`     | xs, s, m, l          | Trigger height       |
| `.Active.SearchTrigger` | `size`         | VARIANT | `m`     | xs, s, m, l          | Trigger height       |
| `.Filled.SearchTrigger` | `showEndSlot`  | VARIANT | `mic`   | mic, none            | Trailing icon toggle |
| `.Filled.SearchTrigger` | `size`         | VARIANT | `m`     | xs, s, m, l          | Trigger height       |

**Internal (non-exposed) configuration per state:**

| State  | DNA Attention | DNA Shape | DNA State | Start Icon | End Icon      | Text                   |
| ------ | ------------- | --------- | --------- | ---------- | ------------- | ---------------------- |
| idle   | high          | pill      | idle      | search     | mic / hidden  | "Search" (placeholder) |
| active | medium        | pill      | focus     | search     | always hidden | "Lorem\|" (cursor)     |
| filled | high          | pill      | filled    | search     | mic / hidden  | "Lorem" (value)        |

---

## 7. Design Tips

1. **This is a sub-component, not standalone.** The dot prefix (`.SearchTrigger`) indicates it's designed for internal composition. Primary use case is inside `ContextMenu`. If you need it standalone, you can still use it — but it's not the intended primary usage.

2. **State management is built-in.** Don't try to manually configure idle/active/filled states via DNA/Input props. Use the `searchStates` VARIANT on the main `.SearchTrigger` CS — it pre-configures everything (attention, input state, end slot visibility, placeholder text).

3. **Active state hides the end slot automatically.** When the user is typing (`searchStates=active`), the mic icon disappears. This is baked into the architecture — `.Active.SearchTrigger` has no `showEndSlot` prop. You don't need to manage this.

4. **Size must match ContextMenu size.** When using inside `ContextMenu`, the SearchTrigger size should align with the ContextMenu's `size` variant. The ContextMenu handles this internally via its pre-configured instances.

5. **Mic icon is the only end slot option.** `showEndSlot` toggles between `mic` and `none` — there's no generic icon swap. If you need a different end icon (e.g., camera, voice), you'd need to detach or override the instance.

6. **Search icon (start) is always present.** There's no prop to hide or swap the start search icon — it's structurally baked in. This reinforces that the component is purpose-built for search, not a generic input.

7. **Full Search component is coming.** The `🔴 Search [WIP]` page indicates a complete search experience (likely search panel, results overlay, etc.) is in development. `.SearchTrigger` will likely be the entry point for that component.

---

## 8. Adoption Checklist (Net-New Component)

### SearchTrigger

- [ ] Identify all designs that use custom/hand-built search inputs
- [ ] Replace with OneUI `.SearchTrigger` using appropriate `searchStates`:
  - [ ] `idle` — default resting state with "Search" placeholder
  - [ ] `active` — user is typing, cursor visible
  - [ ] `filled` — search term entered, field shows value
- [ ] Set `size` to match context:
  - [ ] `xs` (24px) — compact toolbars
  - [ ] `s` (32px) — secondary search areas
  - [ ] `m` (40px) — **default**, primary search triggers
  - [ ] `l` (48px) — prominent/hero search bars
- [ ] Configure `showEndSlot`:
  - [ ] `mic` — voice input available
  - [ ] `none` — text-only search
- [ ] When used inside `ContextMenu`:
  - [ ] Ensure `ContextMenu.showSearch=true` (default)
  - [ ] Size is auto-matched by ContextMenu — no manual size configuration needed
- [ ] Replace any placeholder text in prototypes:
  - [ ] Idle: "Search" is the default placeholder
  - [ ] Filled: Override the InputText characters with actual search terms

---
