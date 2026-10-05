---
name: jds-v3-oneui-form-controls
description: >-
  JDS v3 (Jio Testlab Library) → OneUI migration mapping for checkbox, radio and switch controls. Covers Checkbox, CheckboxIndeterminate, CheckboxField, Radio, Switch.
  Use when swapping or prop-mapping any of these components while converting a reference file to OneUI.
---

# Form controls (binary and single choice) — JDS v3 → OneUI migration

Part of the JDS v3 → OneUI migration skill set. For routing across all component behaviours, load
`get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-migration-figma-agent.md")`.

**Load this skill when migrating:** Checkbox, CheckboxIndeterminate, CheckboxField, Radio, Switch.

## Components in this skill

- **Checkbox** — search `Checkbox`
- **Radio** — search `Radio`
- **Switch** — search `Switch`

Jump straight to the component you need — each has its own Overview, Props Mapping, full comparison
table, and Migration Checklist. Do not invent prop names or variant values; use the tables below.

---

## Explicit mapping rules (override the tables below)

### Checkbox — configure via content / label / description

Use the **Checkbox** component by default. Configure text through its own props rather than placing
separate text nodes beside it:

| Requirement | Props to set |
|---|---|
| Checkbox only, no text beside it | `content = false` |
| Checkbox with a title | `content = true`, `label = true`, then pass the label text value |
| Checkbox with a description | `content = true`, `description = true`, then pass the description text value |

Title vs description is a **weight difference only** — the title (`label`) is bolder than the
description. Pick based on the visual weight of the text in the old design.

### Checkbox vs CheckboxField

Use **CheckboxField** *only* when the design needs one or more of:

- a required indicator
- an info icon
- a feedback / validation message

In every other case use plain **Checkbox** — do not reach for CheckboxField just because the
checkbox has a label.

---

# Checkbox  ·  JDS v3 → OneUI

## Overview

|                         | JDS (Jio Testlab Library)                              | OneUI                                                              |
| ----------------------- | ------------------------------------------------------ | ------------------------------------------------------------------ |
| **Component Name**      | Checkbox + CheckboxIndeterminate (separate components) | Checkbox (single unified component)                                |
| **Variant Filter**      | N/A (dedicated components)                             | N/A (dedicated component)                                          |
| **Total Variants**      | 48 (Checkbox) + 18 (CheckboxIndeterminate) = 66 total  | 18 (3 sizes × 2 checked × 2 readOnly — with indeterminate overlay) |
| **Page**                | Checkbox                                               | ↳ Checkbox                                                         |
| **Child Instance Tags** | Icon, Focus Ring                                       | CheckboxWrapper, Label + Description                               |

> **Key Structural Change:** JDS splits checked and indeterminate into two components. OneUI merges them into a single `Checkbox` with a dedicated `indeterminate` VARIANT prop. JDS also keeps labels/descriptions on a separate `CheckboxField` wrapper; OneUI builds `labelText` / `descriptionText` into the Checkbox itself.

---

## Props Mapping

### Size

|               | JDS     | OneUI   |
| ------------- | ------- | ------- |
| **Prop Name** | `Size`  | `size`  |
| **Type**      | VARIANT | VARIANT |
| **Default**   | "M"     | "M"     |

#### Value Mapping

| JDS `Size` | OneUI `size` | Notes                             |
| ---------- | ------------ | --------------------------------- |
| S          | S            | Direct mapping                    |
| M          | M            | Direct mapping ✅ (both defaults) |
| L          | L            | Direct mapping                    |

> **Migration Note:** ✅ Perfect 1:1 mapping — same 3 sizes, same default. No action needed beyond renaming `Size` → `size`.

---

### Checked + Indeterminate

|               | JDS (Checkbox) | JDS (CheckboxIndeterminate) | OneUI                                        |
| ------------- | -------------- | --------------------------- | -------------------------------------------- |
| **Prop Name** | `Checked`      | `Checked`                   | `checked` + `indeterminate`                  |
| **Type**      | VARIANT        | VARIANT                     | VARIANT + VARIANT                            |
| **Default**   | "False"        | "Indeterminate"             | `checked`: "false", `indeterminate`: "false" |

#### Value Mapping

| JDS Source Component  | JDS `Checked` Value | OneUI `checked` | OneUI `indeterminate` | Notes                   |
| --------------------- | ------------------- | --------------- | --------------------- | ----------------------- |
| Checkbox              | True                | true            | false                 | Direct mapping          |
| Checkbox              | False               | false           | false                 | Direct mapping          |
| CheckboxIndeterminate | Indeterminate       | false           | true                  | Cross-component merge   |
| CheckboxIndeterminate | All                 | true            | false                 | Maps to checked state   |
| CheckboxIndeterminate | None                | false           | false                 | Maps to unchecked state |

#### Behavior Difference

- **JDS:** Indeterminate state lives in a separate component (`CheckboxIndeterminate`) with its own `Checked` prop that has 3 values: `Indeterminate`, `All`, `None`. The regular `Checkbox` component only has `True` / `False`.
- **OneUI:** Indeterminate is a separate VARIANT prop (`indeterminate`: true/false) on the same unified Checkbox component, alongside the `checked` prop.

> **Migration Note:** JDS instances of `CheckboxIndeterminate` must be swapped to OneUI `Checkbox` with `indeterminate = true`. JDS `CheckboxIndeterminate` with `Checked = All` maps to OneUI `checked = true`, `indeterminate = false`. JDS `CheckboxIndeterminate` with `Checked = None` maps to OneUI `checked = false`, `indeterminate = false`. This is a **component merge** — two JDS components become one OneUI component.

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

> **Migration Note:** Same pattern as Button — OneUI Checkbox does not expose a `Disabled` variant prop. Disabled state is handled internally. Instances showing explicit disabled checkboxes will need manual overrides (opacity, color desaturation) or separate documentation.

---

### Read Only

|               | JDS         | OneUI      |
| ------------- | ----------- | ---------- |
| **Prop Name** | `Read Only` | `readOnly` |
| **Type**      | VARIANT     | VARIANT    |
| **Default**   | "False"     | "false"    |

#### Value Mapping

| JDS `Read Only` | OneUI `readOnly` | Notes          |
| --------------- | ---------------- | -------------- |
| False           | false            | Direct mapping |
| True            | true             | Direct mapping |

> **Migration Note:** ✅ Direct 1:1 mapping — rename only: `Read Only` → `readOnly`.

---

### State (Hover)

|               | JDS         | OneUI                             |
| ------------- | ----------- | --------------------------------- |
| **Prop Name** | `State`     | _(Not exposed as a variant prop)_ |
| **Type**      | VARIANT     | —                                 |
| **Default**   | "Idle"      | —                                 |
| **Options**   | Idle, Hover | —                                 |

> **Migration Note:** OneUI Checkbox does not expose an explicit `State` variant for hover. Hover states are handled internally (likely via prototype interactions or the StateLayer child frame). JDS instances set to `State = Hover` for spec/redline documentation will lose this static hover variant.

---

### Focused

|               | JDS                 | OneUI                     |
| ------------- | ------------------- | ------------------------- |
| **Prop Name** | `Focused` (Boolean) | _(Not exposed as a prop)_ |
| **Type**      | BOOLEAN             | —                         |
| **Default**   | false               | —                         |

> **Migration Note:** JDS exposes a `Focused` boolean to toggle focus ring visibility (via a nested Focus Ring child instance). OneUI has no equivalent prop — focus state is managed internally. Instances showing explicit focus states will lose this visual in migration.

---

### Label Text

|               | JDS                                  | OneUI       |
| ------------- | ------------------------------------ | ----------- |
| **Prop Name** | _(No label prop on Checkbox itself)_ | `labelText` |
| **Type**      | —                                    | TEXT        |
| **Default**   | —                                    | "Checkbox"  |

#### Behavior Difference

- **JDS:** The standalone Checkbox component has no label. Labels are handled by the separate `CheckboxField` wrapper component, which nests the Checkbox + a Label child.
- **OneUI:** The label is built into the Checkbox component as a `labelText` TEXT prop, with a `label` boolean toggle to show/hide it.

> **Migration Note:** If migrating from JDS `CheckboxField` (which has labels), extract the label text and set it on OneUI `labelText`. If migrating from JDS Checkbox alone (no label), set `label = false` on the OneUI component to hide the built-in label.

---

### Label Toggle

|               | JDS                                        | OneUI                            |
| ------------- | ------------------------------------------ | -------------------------------- |
| **Prop Name** | _(N/A — separate CheckboxField component)_ | `label` (BOOLEAN, default: true) |
| **Type**      | —                                          | BOOLEAN                          |
| **Default**   | —                                          | true                             |

> **Migration Note:** OneUI shows the label by default. When migrating standalone JDS Checkbox instances (no label), set `label = false` to match the original appearance.

---

### Content Toggle

|               | JDS     | OneUI                              |
| ------------- | ------- | ---------------------------------- |
| **Prop Name** | _(N/A)_ | `content` (BOOLEAN, default: true) |
| **Type**      | —       | BOOLEAN                            |
| **Default**   | —       | true                               |

> **Migration Note:** Controls visibility of the label + description content block. JDS has no equivalent — it uses separate components (Checkbox vs CheckboxField) to achieve this. Set `content = false` for migrated standalone checkboxes, `content = true` for field-style checkboxes.

---

### Description Text

|               | JDS                                   | OneUI             |
| ------------- | ------------------------------------- | ----------------- |
| **Prop Name** | _(No description on Checkbox itself)_ | `descriptionText` |
| **Type**      | —                                     | TEXT              |
| **Default**   | —                                     | "Description"     |

---

### Description Toggle

|               | JDS     | OneUI                                   |
| ------------- | ------- | --------------------------------------- |
| **Prop Name** | _(N/A)_ | `description` (BOOLEAN, default: false) |
| **Type**      | —       | BOOLEAN                                 |
| **Default**   | —       | false                                   |

> **Migration Note:** OneUI Checkbox has a built-in description slot (hidden by default). JDS Checkbox has no description capability at the component level. If you previously used helper text via `CheckboxField`, you may be able to map it to the OneUI `descriptionText` prop with `description = true`.

---

### New Props in OneUI (No JDS Equivalent)

#### Indeterminate

|                 | OneUI                                                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Prop Name**   | `indeterminate`                                                                                                             |
| **Type**        | VARIANT                                                                                                                     |
| **Options**     | true, false                                                                                                                 |
| **Default**     | false                                                                                                                       |
| **Description** | Toggles the indeterminate (dash) state on the checkbox. Replaces the need for a separate `CheckboxIndeterminate` component. |

> **Migration Note:** This is now a prop on the same component rather than a separate component. See the Checked section above for the full cross-component mapping.

#### Label, Content, Description, `labelText`, `descriptionText`

See individual sections above — these are all net-new built-in capabilities that consolidate what JDS split across Checkbox, CheckboxField, and CheckboxField Feedback into a single OneUI Checkbox.

---

### Props Not in OneUI (JDS-Only, Lost in Migration)

| JDS Prop   | Type    | Values      | Impact                                                        |
| ---------- | ------- | ----------- | ------------------------------------------------------------- |
| `Disabled` | VARIANT | False, True | ⚠️ No static disabled variant in OneUI. Handle via overrides. |
| `State`    | VARIANT | Idle, Hover | ⚠️ No static hover variant in OneUI. Lost in migration.       |
| `Focused`  | BOOLEAN | true, false | ⚠️ No focus ring toggle in OneUI. Lost in migration.          |

---

## Full Props Comparison Table

| #   | Prop Concept       | JDS Prop               | JDS Type | JDS Values  | JDS Default | OneUI Prop        | OneUI Type | OneUI Values | OneUI Default | Status              |
| --- | ------------------ | ---------------------- | -------- | ----------- | ----------- | ----------------- | ---------- | ------------ | ------------- | ------------------- |
| 1   | Size               | `Size`                 | VARIANT  | S, M, L     | M           | `size`            | VARIANT    | S, M, L      | M             | ✅ Direct match     |
| 2   | Checked            | `Checked`              | VARIANT  | True, False | False       | `checked`         | VARIANT    | true, false  | false         | ✅ Direct match     |
| 3   | Indeterminate      | _(separate component)_ | —        | —           | —           | `indeterminate`   | VARIANT    | true, false  | false         | ⚠️ Component merge  |
| 4   | Disabled           | `Disabled`             | VARIANT  | False, True | False       | _(none)_          | —          | —            | —             | ❌ JDS-only         |
| 5   | Read Only          | `Read Only`            | VARIANT  | False, True | False       | `readOnly`        | VARIANT    | false, true  | false         | ✅ Direct match     |
| 6   | State (Hover)      | `State`                | VARIANT  | Idle, Hover | Idle        | _(none)_          | —          | —            | —             | ❌ JDS-only         |
| 7   | Focused            | `Focused`              | BOOLEAN  | true, false | false       | _(none)_          | —          | —            | —             | ❌ JDS-only         |
| 8   | Label text         | _(via CheckboxField)_  | —        | —           | —           | `labelText`       | TEXT       | free text    | "Checkbox"    | ❌ OneUI-only (new) |
| 9   | Label toggle       | _(via CheckboxField)_  | —        | —           | —           | `label`           | BOOLEAN    | true, false  | true          | ❌ OneUI-only (new) |
| 10  | Content toggle     | _(N/A)_                | —        | —           | —           | `content`         | BOOLEAN    | true, false  | true          | ❌ OneUI-only (new) |
| 11  | Description text   | _(N/A)_                | —        | —           | —           | `descriptionText` | TEXT       | free text    | "Description" | ❌ OneUI-only (new) |
| 12  | Description toggle | _(N/A)_                | —        | —           | —           | `description`     | BOOLEAN    | true, false  | false         | ❌ OneUI-only (new) |

---

## Migration Checklist

- [ ] Map `Size` → `size` (S→S, M→M, L→L) — ✅ direct rename, same default
- [ ] Map `Checked` → `checked` (True→true, False→false) — direct rename
- [ ] Merge `CheckboxIndeterminate` instances → OneUI Checkbox with `indeterminate = true` — this is a **component swap**, not just a prop change
- [ ] Map `Read Only` → `readOnly` (direct rename)
- [ ] Handle `Disabled = True` instances separately (override-based approach — no OneUI variant)
- [ ] Handle `State = Hover` instances — lost in migration, document separately
- [ ] Handle `Focused = true` instances — lost in migration, no OneUI equivalent
- [ ] For standalone JDS Checkbox instances (no label): set `label = false` and `content = false` on OneUI
- [ ] For JDS CheckboxField instances: extract label text → set `labelText`, keep `label = true`
- [ ] Decide defaults for new props: `content` (recommended: match context), `description` (recommended: `false` unless helper text existed)

---

---

---

# Radio  ·  JDS v3 → OneUI

## Overview

|                                      | JDS (Jio Testlab Library)                                                                              | OneUI                                                                           |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| **Component Name**                   | Radio (bare) + RadioField (with label) + RadioField Feedback (with validation) — 3 separate components | Radio (with built-in label) + RadioField (with label + feedback) — 2 components |
| **Total Variants**                   | 48 (Radio) + 96 (RadioField) + 144 (RadioField Feedback) = 288 total                                   | 12 (Radio) + 12 (RadioField) = 24 total                                         |
| **Architecture**                     | RadioField wraps Radio; RadioField Feedback is a separate component with validation states             | Radio has built-in label; RadioField adds feedback/info icon/required on top    |
| **Page**                             | Radio                                                                                                  | ↳ Radio                                                                         |
| **Child Instance Tags (Radio)**      | Knob, Focus Ring                                                                                       | radioWrapper (StateLayer), Label + Description                                  |
| **Child Instance Tags (RadioField)** | Radio (child), Label, Description, Helper text                                                         | radioWrapper (StateLayer), Label + Description, `.DNA/InputFeedback`            |

---

## Component Architecture Mapping

| JDS Component           | → OneUI Component                                   | Notes                                                                                                      |
| ----------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Radio (bare)**        | **Radio** (with `content = false`, `label = false`) | OneUI Radio has built-in label — hide it to get a bare radio                                               |
| **RadioField**          | **Radio** (with `content = true`, `label = true`)   | ⚠️ JDS RadioField → OneUI **Radio** (not RadioField). OneUI Radio already has built-in label + description |
| **RadioField Feedback** | **RadioField** (with `feedback = true`)             | ⚠️ **Component merge** — JDS uses a separate component; OneUI folds feedback into RadioField               |

> **Key Structural Change:** Unlike Input, where JDS `InputField` maps to OneUI `InputField`, JDS `RadioField` maps to OneUI **Radio**. OneUI Radio already includes label + description. OneUI `RadioField` is reserved for validation/feedback (`infoIcon`, `require`, `feedback`).

---

## Props Mapping

### Size

|               | JDS     | OneUI   |
| ------------- | ------- | ------- |
| **Prop Name** | `Size`  | `size`  |
| **Type**      | VARIANT | VARIANT |
| **Default**   | "M"     | "M"     |

#### Value Mapping

| JDS `Size` | OneUI `size` | Notes                             |
| ---------- | ------------ | --------------------------------- |
| S          | S            | Direct mapping                    |
| M          | M            | Direct mapping ✅ (both defaults) |
| L          | L            | Direct mapping                    |

> **Migration Note:** ✅ Perfect 1:1 mapping — same 3 sizes, same default.

---

### Checked

|               | JDS       | OneUI     |
| ------------- | --------- | --------- |
| **Prop Name** | `Checked` | `checked` |
| **Type**      | VARIANT   | VARIANT   |
| **Default**   | "False"   | "false"   |

#### Value Mapping

| JDS `Checked` | OneUI `checked` | Notes          |
| ------------- | --------------- | -------------- |
| False         | false           | Direct mapping |
| True          | true            | Direct mapping |

> **Migration Note:** ✅ Direct 1:1 mapping. Same default.

---

### Read Only

|               | JDS         | OneUI      |
| ------------- | ----------- | ---------- |
| **Prop Name** | `Read Only` | `readOnly` |
| **Type**      | VARIANT     | VARIANT    |
| **Default**   | "False"     | "false"    |

#### Value Mapping

| JDS `Read Only` | OneUI `readOnly` | Notes          |
| --------------- | ---------------- | -------------- |
| False           | false            | Direct mapping |
| True            | true             | Direct mapping |

> **Migration Note:** ✅ Direct 1:1 mapping. Rename only.

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

> **Migration Note:** Same pattern as other components — OneUI does not expose a `Disabled` variant. Handle via manual overrides if needed.

---

### State (Hover)

|               | JDS         | OneUI                             |
| ------------- | ----------- | --------------------------------- |
| **Prop Name** | `State`     | _(Not exposed as a variant prop)_ |
| **Type**      | VARIANT     | —                                 |
| **Default**   | "Idle"      | —                                 |
| **Options**   | Idle, Hover | —                                 |

> **Migration Note:** OneUI Radio does not expose a `State` variant for hover. Hover is handled internally via the StateLayer child frame. JDS instances set to `State = Hover` for spec/redline frames will lose this static variant.

---

### Focused

|               | JDS                 | OneUI                     |
| ------------- | ------------------- | ------------------------- |
| **Prop Name** | `Focused` (BOOLEAN) | _(Not exposed as a prop)_ |
| **Type**      | BOOLEAN             | —                         |
| **Default**   | false               | —                         |

> **Migration Note:** JDS exposes a `Focused` boolean to toggle the Focus Ring child visibility. OneUI has no equivalent — focus state is managed internally via StateLayer.

---

### Label Text

|               | JDS                                                          | OneUI       |
| ------------- | ------------------------------------------------------------ | ----------- |
| **Prop Name** | _(No label on bare Radio; nested Label child on RadioField)_ | `labelText` |
| **Type**      | —                                                            | TEXT        |
| **Default**   | —                                                            | "Radio"     |

#### Behavior Difference

- **JDS:** The bare Radio has no label. Labels are handled by RadioField, which wraps Radio + a nested Label component instance (with its own `Variant`, `Emphasis`, `Weight`, `Tinted` props).
- **OneUI:** The label is built into the Radio component as a `labelText` TEXT prop, with `label` and `content` boolean toggles to show/hide it.

> **Migration Note:** If migrating from JDS RadioField, extract the label text from the nested Label child → set on OneUI `labelText`. If migrating from bare JDS Radio (no label), set `label = false` and `content = false` on OneUI Radio.

---

### Label Toggle

|               | JDS (RadioField)                 | OneUI (Radio)                    |
| ------------- | -------------------------------- | -------------------------------- |
| **Prop Name** | `Label` (BOOLEAN, default: true) | `label` (BOOLEAN, default: true) |
| **Type**      | BOOLEAN                          | BOOLEAN                          |

> **Migration Note:** ✅ Same toggle pattern, same default. Direct mapping.

---

### Content Toggle

|               | JDS     | OneUI                              |
| ------------- | ------- | ---------------------------------- |
| **Prop Name** | _(N/A)_ | `content` (BOOLEAN, default: true) |
| **Type**      | —       | BOOLEAN                            |

> **Migration Note:** OneUI-only prop. Controls visibility of the entire label + description block. Set `content = false` for bare JDS Radio migrations (no label). Set `content = true` for JDS RadioField migrations.

---

### Description Toggle

|               | JDS (RadioField)                        | OneUI                                                                |
| ------------- | --------------------------------------- | -------------------------------------------------------------------- |
| **Prop Name** | `Description` (BOOLEAN, default: false) | `description` (BOOLEAN, default: false on Radio, true on RadioField) |
| **Type**      | BOOLEAN                                 | BOOLEAN                                                              |

> **Migration Note:** Same toggle concept. Note that OneUI RadioField defaults `description` to **true** while OneUI Radio defaults to **false**. Match based on context.

---

### Description Text

|               | JDS                                      | OneUI             |
| ------------- | ---------------------------------------- | ----------------- |
| **Prop Name** | _(Child Description component instance)_ | `descriptionText` |
| **Type**      | Child TEXT                               | TEXT              |
| **Default**   | —                                        | "Description"     |

> **Migration Note:** Extract text from JDS's nested Description child instance → set on OneUI `descriptionText`.

---

### Helper Text → Feedback

|            | JDS (RadioField)                        | OneUI (RadioField)                   |
| ---------- | --------------------------------------- | ------------------------------------ |
| **Toggle** | `Helper text` (BOOLEAN, default: false) | `feedback` (BOOLEAN, default: false) |
| **Text**   | Child Helper text component instance    | Internal `.DNA/InputFeedback` child  |

#### Behavior Difference

- **JDS:** Helper text is a simple text instance below the radio. For validation, use the separate RadioField Feedback component with a `Feedback Type` variant (`Negative`, `Warning`, `Positive`).
- **OneUI:** Feedback is built into RadioField via the `feedback` boolean. The internal `.DNA/InputFeedback` child handles validation styling.

> **Migration Note:** JDS Helper text (neutral) and RadioField Feedback (validation) both map to OneUI RadioField's `feedback = true`. JDS RadioField Feedback must be **component-swapped** to OneUI RadioField.

---

### Feedback Type (JDS RadioField Feedback Only)

|               | JDS (RadioField Feedback)   | OneUI                                         |
| ------------- | --------------------------- | --------------------------------------------- |
| **Prop Name** | `Feedback Type`             | _(Internal `.DNA/InputFeedback` → `variant`)_ |
| **Type**      | VARIANT                     | —                                             |
| **Default**   | "Negative"                  | —                                             |
| **Options**   | Negative, Warning, Positive | —                                             |

> **Migration Note:** Maps to the internal `.DNA/InputFeedback` child's `variant` prop. Requires overriding the nested child. The separate RadioField Feedback component is eliminated — use OneUI RadioField with `feedback = true`.

---

### Inherit Appearance (JDS-Only)

|               | JDS                    | OneUI   |
| ------------- | ---------------------- | ------- |
| **Prop Name** | `[inherit appearance]` | _(N/A)_ |
| **Type**      | VARIANT                | —       |
| **Default**   | "false"                | —       |
| **Options**   | false, true            | —       |

> **Migration Note:** JDS-only prop with no OneUI equivalent. Lost in migration.

---

### New Props in OneUI (No JDS Equivalent)

#### Required (RadioField)

|                 | OneUI                                          |
| --------------- | ---------------------------------------------- |
| **Prop Name**   | `require`                                      |
| **Type**        | BOOLEAN                                        |
| **Default**     | false                                          |
| **Description** | Shows a required indicator (`*`) on the label. |

#### Info Icon (RadioField)

|                 | OneUI                                 |
| --------------- | ------------------------------------- |
| **Prop Name**   | `infoIcon`                            |
| **Type**        | BOOLEAN                               |
| **Default**     | false                                 |
| **Description** | Shows an info icon next to the label. |

> **Migration Note:** Both are net-new capabilities in OneUI RadioField. Set to `false` for all migrated instances to preserve JDS appearance.

---

### Props Not in OneUI (JDS-Only, Lost in Migration)

| JDS Prop                     | Type                     | Values            | Impact                                                        |
| ---------------------------- | ------------------------ | ----------------- | ------------------------------------------------------------- |
| `Disabled`                   | VARIANT                  | False, True       | ⚠️ No static disabled variant in OneUI. Handle via overrides. |
| `State`                      | VARIANT                  | Idle, Hover       | ⚠️ No static hover variant. Handled internally.               |
| `Focused`                    | BOOLEAN                  | true, false       | ⚠️ No focus ring toggle. Handled internally.                  |
| `[inherit appearance]`       | VARIANT                  | false, true       | ❌ Lost entirely.                                             |
| Label component's `Weight`   | VARIANT (on child Label) | Low, Medium, High | Typography weight control lost.                               |
| Label component's `Tinted`   | VARIANT (on child Label) | False, True       | Color tinting lost.                                           |
| Label component's `Emphasis` | VARIANT (on child Label) | Low, Medium, High | Typography emphasis lost.                                     |

---

## Full Props Comparison Table

| #   | Prop Concept           | JDS Prop                     | JDS Type   | JDS Values                  | JDS Default | OneUI Prop              | OneUI Type   | OneUI Values   | OneUI Default | Status              |
| --- | ---------------------- | ---------------------------- | ---------- | --------------------------- | ----------- | ----------------------- | ------------ | -------------- | ------------- | ------------------- |
| 1   | Size                   | `Size`                       | VARIANT    | S, M, L                     | M           | `size`                  | VARIANT      | S, M, L        | M             | ✅ Direct match     |
| 2   | Checked                | `Checked`                    | VARIANT    | True, False                 | False       | `checked`               | VARIANT      | true, false    | false         | ✅ Direct match     |
| 3   | Read Only              | `Read Only`                  | VARIANT    | False, True                 | False       | `readOnly`              | VARIANT      | false, true    | false         | ✅ Direct match     |
| 4   | Disabled               | `Disabled`                   | VARIANT    | False, True                 | False       | _(none)_                | —            | —              | —             | ❌ JDS-only         |
| 5   | State (Hover)          | `State`                      | VARIANT    | Idle, Hover                 | Idle        | _(none)_                | —            | —              | —             | ❌ JDS-only         |
| 6   | Focused                | `Focused`                    | BOOLEAN    | true, false                 | false       | _(none)_                | —            | —              | —             | ❌ JDS-only         |
| 7   | Label text             | _(RadioField child Label)_   | Child TEXT | free text                   | —           | `labelText`             | TEXT         | free text      | "Radio"       | ⚠️ Mechanism change |
| 8   | Label toggle           | `Label` (RadioField)         | BOOLEAN    | true, false                 | true        | `label`                 | BOOLEAN      | true, false    | true          | ✅ Direct match     |
| 9   | Content toggle         | _(N/A)_                      | —          | —                           | —           | `content`               | BOOLEAN      | true, false    | true          | ❌ OneUI-only (new) |
| 10  | Description toggle     | `Description` (RadioField)   | BOOLEAN    | true, false                 | false       | `description`           | BOOLEAN      | true, false    | false/true    | ✅ Direct match     |
| 11  | Description text       | _(RadioField child Desc)_    | Child TEXT | free text                   | —           | `descriptionText`       | TEXT         | free text      | "Description" | ⚠️ Mechanism change |
| 12  | Helper text / Feedback | `Helper text` (RadioField)   | BOOLEAN    | true, false                 | false       | `feedback` (RadioField) | BOOLEAN      | true, false    | false         | ⚠️ Renamed + scoped |
| 13  | Feedback Type          | _(RadioField Feedback only)_ | VARIANT    | Negative, Warning, Positive | Negative    | _(internal `.DNA`)_     | _(internal)_ | negative, etc. | negative      | ⚠️ Component merge  |
| 14  | Inherit appearance     | `[inherit appearance]`       | VARIANT    | false, true                 | false       | _(none)_                | —            | —              | —             | ❌ JDS-only         |
| 15  | Required               | _(N/A)_                      | —          | —                           | —           | `require`               | BOOLEAN      | true, false    | false         | ❌ OneUI-only (new) |
| 16  | Info icon              | _(N/A)_                      | —          | —                           | —           | `infoIcon`              | BOOLEAN      | true, false    | false         | ❌ OneUI-only (new) |

---

## Migration Checklist

- [ ] Map `Size` → `size` (S→S, M→M, L→L) — ✅ direct match, same default
- [ ] Map `Checked` → `checked` (True→true, False→false) — direct mapping
- [ ] Map `Read Only` → `readOnly` — direct rename
- [ ] Map JDS Radio (bare) → OneUI Radio with `content = false`, `label = false`
- [ ] Map JDS RadioField → OneUI **Radio** with `content = true`, `label = true`, extract `labelText`
- [ ] Merge RadioField Feedback instances → OneUI RadioField with `feedback = true` — **component swap required**
- [ ] Map `Description` → `description` (same toggle pattern)
- [ ] Extract description text from nested child → set on OneUI `descriptionText`
- [ ] Map `Helper text` → `feedback` (for RadioField context)
- [ ] Handle `Disabled = True` instances — no OneUI equivalent, manual overrides
- [ ] Handle `State = Hover` instances — lost in migration
- [ ] Handle `Focused = true` instances — lost in migration
- [ ] Handle `[inherit appearance]` — lost in migration
- [ ] Decide defaults for new props: `require` (`false`), `infoIcon` (`false`)
- [ ] Audit any instances relying on Label's `Weight`, `Tinted`, or `Emphasis` — lost in migration

---

---

---

# Switch  ·  JDS v3 → OneUI

## Overview

|                                        | JDS (Jio Testlab Library)                                                        | OneUI                                                                           |
| -------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Component Name**                     | SwitchButton (bare toggle) + SwitchField (with label/description) — 2 components | Switch (bare toggle only) — 1 component                                         |
| **Total Variants**                     | 112 (SwitchButton) + 48 (SwitchField) = 160 total                                | 12 (3 sizes × 2 checked × 2 readOnly)                                           |
| **Architecture**                       | SwitchField wraps SwitchButton + Label + Description + Helper text               | Switch is a bare toggle only — no built-in label, description, or field wrapper |
| **Page**                               | Switch                                                                           | ↳ Switch                                                                        |
| **Child Instance Tags (SwitchButton)** | `[invisible-knob]`, Knob, Focus Ring                                             | StateLayer (Knob)                                                               |
| **Child Instance Tags (SwitchField)**  | SwitchButton (child), Label, Description, Helper text                            | _(N/A — no field component)_                                                    |

---

## Component Architecture Mapping

| JDS Component           | → OneUI Component           | Notes                                                                                                                         |
| ----------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **SwitchButton (bare)** | **Switch**                  | Direct mapping — bare toggle to bare toggle                                                                                   |
| **SwitchField**         | ⚠️ **No direct equivalent** | OneUI has no SwitchField. Manually compose: OneUI Switch + external label/description text nodes, or a generic layout pattern |

> **⚠️ Critical:** OneUI does not have a SwitchField component. JDS SwitchField instances (with label, description, helper text) cannot be migrated to a single OneUI component. You must either:
>
> 1. Use OneUI Switch and manually add label/description text alongside it
> 2. Build a local composite component wrapping OneUI Switch + text elements
> 3. Check if a future OneUI update adds a SwitchField equivalent

---

## Props Mapping

### Size

|               | JDS (SwitchButton) | JDS (SwitchField) | OneUI   |
| ------------- | ------------------ | ----------------- | ------- |
| **Prop Name** | `Size`             | `Size`            | `size`  |
| **Type**      | VARIANT            | VARIANT           | VARIANT |
| **Default**   | "M"                | "M"               | "M"     |

#### Value Mapping

| JDS `Size` | OneUI `size`                      | Notes                                               |
| ---------- | --------------------------------- | --------------------------------------------------- |
| 2XS        | ❌ _(no equivalent)_ — map to `S` | Lossy — OneUI Switch has no 2XS. SwitchButton only. |
| XS         | ❌ _(no equivalent)_ — map to `S` | Lossy — OneUI Switch has no XS. SwitchButton only.  |
| S          | S                                 | Direct mapping                                      |
| M          | M                                 | Direct mapping ✅ (both defaults)                   |
| L          | L                                 | Direct mapping                                      |
| XL         | ❌ _(no equivalent)_ — map to `L` | Lossy — OneUI Switch caps at L. SwitchButton only.  |
| 2XL        | ❌ _(no equivalent)_ — map to `L` | Lossy — OneUI Switch caps at L. SwitchButton only.  |

> **Migration Note:** JDS SwitchButton has **7 sizes**, JDS SwitchField has **3 sizes** (`S`, `M`, `L`). OneUI Switch has **3 sizes** (`S`, `M`, `L`). If migrating from SwitchButton, 4 sizes (`2XS`, `XS`, `XL`, `2XL`) must be collapsed. If migrating from SwitchField, it's a direct 1:1 match.

---

### Checked

|               | JDS       | OneUI     |
| ------------- | --------- | --------- |
| **Prop Name** | `Checked` | `checked` |
| **Type**      | VARIANT   | VARIANT   |
| **Default**   | "False"   | "false"   |

#### Value Mapping

| JDS `Checked` | OneUI `checked` | Notes          |
| ------------- | --------------- | -------------- |
| False         | false           | Direct mapping |
| True          | true            | Direct mapping |

> **Migration Note:** ✅ Direct 1:1 mapping. Same default.

---

### Read Only

|               | JDS         | OneUI      |
| ------------- | ----------- | ---------- |
| **Prop Name** | `Read Only` | `readonly` |
| **Type**      | VARIANT     | VARIANT    |
| **Default**   | "False"     | "false"    |

#### Value Mapping

| JDS `Read Only` | OneUI `readonly` | Notes          |
| --------------- | ---------------- | -------------- |
| False           | false            | Direct mapping |
| True            | true             | Direct mapping |

> **Migration Note:** ✅ Direct 1:1 mapping. Note the slight naming difference: `Read Only` (space) → `readonly` (single word, lowercase).

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

> **Migration Note:** Same pattern as other components — OneUI does not expose a `Disabled` variant. Handle via manual overrides if needed.

---

### State (Hover)

|               | JDS         | OneUI                             |
| ------------- | ----------- | --------------------------------- |
| **Prop Name** | `State`     | _(Not exposed as a variant prop)_ |
| **Type**      | VARIANT     | —                                 |
| **Default**   | "Idle"      | —                                 |
| **Options**   | Idle, Hover | —                                 |

> **Migration Note:** OneUI Switch does not expose a hover state variant. Hover is handled internally via the StateLayer child. JDS instances set to `State = Hover` for spec/redline frames will lose this static variant.

---

### Focused

|               | JDS (SwitchButton)  | OneUI                     |
| ------------- | ------------------- | ------------------------- |
| **Prop Name** | `Focused` (BOOLEAN) | _(Not exposed as a prop)_ |
| **Type**      | BOOLEAN             | —                         |
| **Default**   | false               | —                         |

> **Migration Note:** JDS exposes a `Focused` boolean to toggle the Focus Ring child visibility on SwitchButton. OneUI has no equivalent — focus state is managed internally.

---

### Label (SwitchField Only)

|            | JDS (SwitchField)                | OneUI                             |
| ---------- | -------------------------------- | --------------------------------- |
| **Toggle** | `Label` (BOOLEAN, default: true) | _(N/A — no SwitchField in OneUI)_ |
| **Text**   | Child Label component instance   | —                                 |

> **Migration Note:** ⚠️ OneUI has no SwitchField, so there is no label toggle or built-in label. You must manually compose a label alongside the OneUI Switch component.

---

### Description (SwitchField Only)

|            | JDS (SwitchField)                       | OneUI                             |
| ---------- | --------------------------------------- | --------------------------------- |
| **Toggle** | `Description` (BOOLEAN, default: false) | _(N/A — no SwitchField in OneUI)_ |
| **Text**   | Child Description component instance    | —                                 |

> **Migration Note:** ⚠️ Same as Label — no OneUI equivalent. Must be manually composed.

---

### Helper Text (SwitchField Only)

|            | JDS (SwitchField)                       | OneUI                             |
| ---------- | --------------------------------------- | --------------------------------- |
| **Toggle** | `Helper text` (BOOLEAN, default: false) | _(N/A — no SwitchField in OneUI)_ |
| **Text**   | Child Helper text component instance    | —                                 |

> **Migration Note:** ⚠️ No OneUI equivalent. Must be manually composed or omitted.

---

### Props Not in OneUI (JDS-Only, Lost in Migration)

| JDS Prop                           | Component    | Type                     | Values      | Impact                                                        |
| ---------------------------------- | ------------ | ------------------------ | ----------- | ------------------------------------------------------------- |
| `Disabled`                         | Both         | VARIANT                  | False, True | ⚠️ No static disabled variant in OneUI. Handle via overrides. |
| `State`                            | Both         | VARIANT                  | Idle, Hover | ⚠️ No static hover variant. Handled internally.               |
| `Focused`                          | SwitchButton | BOOLEAN                  | true, false | ⚠️ No focus ring toggle. Handled internally.                  |
| `Label`                            | SwitchField  | BOOLEAN                  | true, false | ❌ No SwitchField in OneUI. Must compose manually.            |
| `Description`                      | SwitchField  | BOOLEAN                  | true, false | ❌ No SwitchField in OneUI. Must compose manually.            |
| `Helper text`                      | SwitchField  | BOOLEAN                  | true, false | ❌ No SwitchField in OneUI. Must compose manually.            |
| Sizes `2XS`, `XS`, `XL`, `2XL`     | SwitchButton | VARIANT                  | —           | ⚠️ 4 size options lost on bare toggle.                        |
| Label child Weight/Emphasis/Tinted | SwitchField  | VARIANT (on child Label) | —           | Typography control lost.                                      |

---

## Full Props Comparison Table

| #   | Prop Concept       | JDS Prop             | JDS Source   | JDS Type   | JDS Values                | JDS Default | OneUI Prop | OneUI Type | OneUI Values | OneUI Default | Status                                       |
| --- | ------------------ | -------------------- | ------------ | ---------- | ------------------------- | ----------- | ---------- | ---------- | ------------ | ------------- | -------------------------------------------- |
| 1   | Size               | `Size`               | Both         | VARIANT    | 2XS–2XL (7) / S, M, L (3) | M           | `size`     | VARIANT    | S, M, L      | M             | ✅/⚠️ SwitchField direct, SwitchButton lossy |
| 2   | Checked            | `Checked`            | Both         | VARIANT    | True, False               | False       | `checked`  | VARIANT    | true, false  | false         | ✅ Direct match                              |
| 3   | Read Only          | `Read Only`          | Both         | VARIANT    | False, True               | False       | `readonly` | VARIANT    | false, true  | false         | ✅ Direct match                              |
| 4   | Disabled           | `Disabled`           | Both         | VARIANT    | False, True               | False       | _(none)_   | —          | —            | —             | ❌ JDS-only                                  |
| 5   | State (Hover)      | `State`              | Both         | VARIANT    | Idle, Hover               | Idle        | _(none)_   | —          | —            | —             | ❌ JDS-only                                  |
| 6   | Focused            | `Focused`            | SwitchButton | BOOLEAN    | true, false               | false       | _(none)_   | —          | —            | —             | ❌ JDS-only                                  |
| 7   | Label toggle       | `Label`              | SwitchField  | BOOLEAN    | true, false               | true        | _(none)_   | —          | —            | —             | ❌ No SwitchField                            |
| 8   | Label text         | Child Label instance | SwitchField  | Child TEXT | free text                 | —           | _(none)_   | —          | —            | —             | ❌ No SwitchField                            |
| 9   | Description toggle | `Description`        | SwitchField  | BOOLEAN    | true, false               | false       | _(none)_   | —          | —            | —             | ❌ No SwitchField                            |
| 10  | Helper text toggle | `Helper text`        | SwitchField  | BOOLEAN    | true, false               | false       | _(none)_   | —          | —            | —             | ❌ No SwitchField                            |

---

## Migration Checklist

- [ ] Map JDS SwitchButton → OneUI Switch — bare toggle, direct mapping
- [ ] Map `Size` → `size` — for SwitchButton: **flag instances using 2XS, XS, XL, 2XL** (4 sizes lost); for SwitchField: direct S→S, M→M, L→L
- [ ] Map `Checked` → `checked` (True→true, False→false) — direct mapping
- [ ] Map `Read Only` → `readonly` — direct rename
- [ ] Handle `Disabled = True` instances — no OneUI equivalent, manual overrides
- [ ] Handle `State = Hover` instances — lost in migration
- [ ] Handle `Focused = true` instances — lost in migration
- [ ] ⚠️ Map JDS SwitchField → OneUI Switch + **manually composed** label/description/helper text:
  - [ ] Extract label text from nested Label child
  - [ ] Extract description text from nested Description child
  - [ ] Extract helper text from nested Helper text child
  - [ ] Build a local frame or component wrapping OneUI Switch with these text elements
- [ ] Audit all SwitchField instances — they require the most manual work due to missing OneUI SwitchField equivalent
- [ ] Audit any instances relying on Label's `Weight`, `Emphasis`, or `Tinted` — lost in migration

---

---
