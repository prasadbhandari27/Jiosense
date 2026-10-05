---
name: jds-v3-oneui-form-fields
description: >-
  JDS v3 (Jio Testlab Library) → OneUI migration mapping for text input and select fields. Covers Input, Select.
  Use when swapping or prop-mapping any of these components while converting a reference file to OneUI.
---

# Form fields (text entry and option picking) — JDS v3 → OneUI migration

Part of the JDS v3 → OneUI migration skill set. For routing across all component behaviours, load
`get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-migration-figma-agent.md")`.

**Load this skill when migrating:** Input, Select.

## Components in this skill

- **Input** — search `Input`
- **Select** — search `Select`

Jump straight to the component you need — each has its own Overview, Props Mapping, full comparison
table, and Migration Checklist. Do not invent prop names or variant values; use the tables below.

---

# Input  ·  JDS v3 → OneUI

## Overview

|                                      | JDS (Jio Testlab Library)                                                                                            | OneUI                                                                                                             |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Component Name**                   | Input (bare) + InputField (with label/slots) + InputFieldFeedback (with validation) — 3 separate components          | Input (bare) + InputField (with label/feedback) + InputText (text styling) — 3 components, but differently scoped |
| **Total Variants**                   | 72 (Input) + 144 (InputField) + 216 (InputFieldFeedback) = 432 total                                                 | 4 (Input) + 3 (InputField) + 96 (InputText) = 103 total                                                           |
| **Architecture**                     | InputField wraps Input; InputFieldFeedback is a separate component with validation states                            | Input wraps `.DNA/Input` internally; InputField wraps Input + label + feedback. InputText handles text display.   |
| **Page**                             | Input                                                                                                                | ↳ Inputs                                                                                                          |
| **Child Instance Tags (InputField)** | Label, Description, Input (child instance), Stroke, FocusRing, Start Slot (Icon), End Slot (IconButton), Helper text | Label + Description, `.DNA/Input`, `.DNA/InputFeedback`, DynamicText                                              |

---

## Component Architecture Mapping

| JDS Component          | → OneUI Component                     | Notes                                                                                                                                                                           |
| ---------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Input (bare)**       | **Input (bare)**                      | Bare input container — JDS has 72 variants with emphasis/state/disabled/readOnly; OneUI has 4 variants (size only), with state/attention handled by internal `.DNA/Input` child |
| **InputField**         | **InputField**                        | Labeled input with start/end slots — **main migration target**                                                                                                                  |
| **InputFieldFeedback** | **InputField** with `feedback = true` | ⚠️ **Component merge** — JDS has a separate component; OneUI folds feedback into InputField via a `feedback` boolean toggle                                                     |

> **Key Structural Change:** JDS splits validation into a third component (`InputFieldFeedback`). OneUI folds it into `InputField` via `feedback`. Many JDS top-level props (`Emphasis`, `State`, `Read Only`, `Active/Focus`, Start/End slots) move onto the nested `.DNA/Input` child and are no longer settable on InputField itself.

---

## Props Mapping (InputField — Primary Migration Target)

### Size

|               | JDS     | OneUI   |
| ------------- | ------- | ------- |
| **Prop Name** | `Size`  | `size`  |
| **Type**      | VARIANT | VARIANT |
| **Default**   | "M"     | "m"     |

#### Value Mapping

| JDS `Size` | OneUI `size` | Notes                             |
| ---------- | ------------ | --------------------------------- |
| S          | s            | Direct mapping                    |
| M          | m            | Direct mapping ✅ (both defaults) |
| L          | l            | Direct mapping                    |

> **Migration Note:** ✅ Same 3 sizes, same default. Rename only: `Size` → `size`, uppercase → lowercase.

---

### Emphasis → (Internal `.DNA` attention)

|               | JDS               | OneUI                                  |
| ------------- | ----------------- | -------------------------------------- |
| **Prop Name** | `Emphasis`        | _(Not a top-level prop on InputField)_ |
| **Type**      | VARIANT           | —                                      |
| **Default**   | "Medium"          | —                                      |
| **Options**   | Low, Medium, High | —                                      |

#### Behavior Difference

- **JDS:** `Emphasis` is a top-level VARIANT prop on InputField with 3 values (`Low`, `Medium`, `High`) controlling the input's visual weight and border styling.
- **OneUI:** InputField has no top-level emphasis/attention prop. The visual weight is managed internally by the `.DNA/Input` child component, which has its own `attention` prop (`medium`, `high`) and `shape` prop (`default`, `pill`). These are not directly exposed on InputField.

> **Migration Note:** JDS `Emphasis` has no direct equivalent as a top-level prop. OneUI's internal `.DNA/Input` supports `attention: medium \| high` (2 values vs JDS's 3). `Emphasis: Low` has **no mapping** — it will default to OneUI's `medium` attention. If emphasis control is critical, you may need to override the nested `.DNA/Input` child's props.

---

### State

|               | JDS          | OneUI                               |
| ------------- | ------------ | ----------------------------------- |
| **Prop Name** | `State`      | _(Internal `.DNA/Input` → `state`)_ |
| **Type**      | VARIANT      | —                                   |
| **Default**   | "Idle"       | —                                   |
| **Options**   | Idle, Filled | —                                   |

#### Behavior Difference

- **JDS:** `State` is a top-level VARIANT on InputField with `Idle` and `Filled` values.
- **OneUI:** State is managed internally by `.DNA/Input` with more values: `idle`, `focus`, `filled`, `readOnly`, `feedback`. These are not exposed as top-level InputField props.

> **Migration Note:** JDS `State` is not directly mappable as a top-level prop. The `.DNA/Input` child handles state internally. `Idle` → `idle` and `Filled` → `filled` in the internal component. Focus and feedback states are also handled internally (JDS uses a separate `Active/Focus` boolean and `InputFieldFeedback` component).

---

### Read Only

|               | JDS         | OneUI                                         |
| ------------- | ----------- | --------------------------------------------- |
| **Prop Name** | `Read Only` | _(Internal `.DNA/Input` → `state: readOnly`)_ |
| **Type**      | VARIANT     | —                                             |
| **Default**   | "False"     | —                                             |

#### Behavior Difference

- **JDS:** `Read Only` is a top-level VARIANT prop (`False`/`True`).
- **OneUI:** Read-only is a state value on the internal `.DNA/Input` child (`state = readOnly`), not a separate prop.

> **Migration Note:** JDS `Read Only = True` maps to the internal `.DNA/Input` `state = readOnly`. This requires overriding the nested child instance rather than setting a top-level prop.

---

### Disabled

|               | JDS        | OneUI                     |
| ------------- | ---------- | ------------------------- |
| **Prop Name** | `Disabled` | _(Not exposed as a prop)_ |
| **Type**      | VARIANT    | —                         |
| **Default**   | "False"    | —                         |

> **Migration Note:** Same pattern as Button/Checkbox — OneUI does not expose a `Disabled` variant prop. Handle via manual overrides if needed.

---

### Active/Focus

|               | JDS                      | OneUI                                      |
| ------------- | ------------------------ | ------------------------------------------ |
| **Prop Name** | `Active/Focus` (BOOLEAN) | _(Internal `.DNA/Input` → `state: focus`)_ |
| **Type**      | BOOLEAN                  | —                                          |
| **Default**   | false                    | —                                          |

> **Migration Note:** JDS exposes focus as a top-level boolean toggle (with a nested FocusRing child). OneUI handles focus via the internal `.DNA/Input` `state = focus` value. Not directly settable from InputField's top-level props.

---

### Label

|            | JDS                                          | OneUI                                        |
| ---------- | -------------------------------------------- | -------------------------------------------- |
| **Toggle** | `Label` (BOOLEAN, default: true)             | `label` (BOOLEAN, default: true)             |
| **Text**   | Child Label component instance → `Text` prop | _(Inline text in Label + Description frame)_ |

#### Behavior Difference

- **JDS:** Label is a nested Label component instance (from the Text page) with its own `Variant`, `Emphasis`, `Weight`, `Tinted` props. Toggle visibility with the `Label` boolean.
- **OneUI:** Label is a built-in text node inside the Label + Description frame. Toggle visibility with the `label` boolean. Also has `labelContent` (BOOLEAN, default: true) for additional control.

> **Migration Note:** Extract label text from JDS's nested Label child → set on OneUI's inline label text. Label typography props are lost — OneUI manages internally. The `labelContent` prop in OneUI provides an additional content visibility toggle not present in JDS.

---

### Description

|            | JDS                                     | OneUI                                          |
| ---------- | --------------------------------------- | ---------------------------------------------- |
| **Toggle** | `Description` (BOOLEAN, default: false) | `description` (BOOLEAN, default: false)        |
| **Text**   | Child Description component instance    | Inline Description TEXT node → `"Description"` |

> **Migration Note:** ✅ Same toggle pattern. Extract text from JDS's nested Description child → set on OneUI's inline Description text node.

---

### Start Slot

|            | JDS                                 | OneUI                                                      |
| ---------- | ----------------------------------- | ---------------------------------------------------------- |
| **Toggle** | `Start` (BOOLEAN, default: false)   | _(Internal `.DNA/Input` → `start` BOOLEAN, default: true)_ |
| **Swap**   | `↳ Content (Start)` (INSTANCE_SWAP) | _(Internal `.DNA/Input` → `❖ start` INSTANCE_SWAP)_        |

#### Behavior Difference

- **JDS:** `Start` is a top-level BOOLEAN toggle on InputField, and `↳ Content (Start)` is a top-level INSTANCE_SWAP with preferred values (Icon, etc.). The start slot frame contains an Input/Icon child.
- **OneUI:** Start/end slots live on the internal `.DNA/Input` child component, not on InputField itself. The `.DNA/Input` has `start` (BOOLEAN), `↳ start 2` (BOOLEAN), `❖ start` (INSTANCE_SWAP) props.

> **Migration Note:** Start slot control moves from a **top-level prop to a nested child prop**. You'll need to override the `.DNA/Input` child's `start` and `❖ start` props rather than setting them at the InputField level.

---

### End Slot

|            | JDS                               | OneUI                                                         |
| ---------- | --------------------------------- | ------------------------------------------------------------- |
| **Toggle** | `End` (BOOLEAN, default: false)   | _(Internal `.DNA/Input` → `end` BOOLEAN, default: true)_      |
| **Swap**   | `↳ Content (End)` (INSTANCE_SWAP) | _(Internal `.DNA/Input` → `❖ end` / `❖ end 2` INSTANCE_SWAP)_ |

> **Migration Note:** Same pattern as Start — end slot moves from top-level to nested `.DNA/Input` child. Override the child's `end` and `❖ end` props.

---

### Helper Text → Feedback

|            | JDS                                     | OneUI                                |
| ---------- | --------------------------------------- | ------------------------------------ |
| **Toggle** | `Helper Text` (BOOLEAN, default: false) | `feedback` (BOOLEAN, default: false) |
| **Text**   | Child Helper text component instance    | Internal `.DNA/InputFeedback` child  |

#### Behavior Difference

- **JDS:** Helper text is a simple text instance below the input, always neutral. For validation feedback, use the separate `InputFieldFeedback` component which adds a `Feedback Type` variant (`Positive`, `Warning`, `Negative`).
- **OneUI:** Feedback is built into InputField via the `feedback` boolean. The internal `.DNA/InputFeedback` child handles styling with its own `variant` (`negative`, etc.) and `attention` props.

> **Migration Note:** JDS Helper Text (neutral helper) and InputFieldFeedback (validation) both map to OneUI's `feedback = true` on InputField. For neutral helper text, consider using `dynamicText` (BOOLEAN, default: false) in OneUI instead.

---

### Feedback Type (JDS InputFieldFeedback Only)

|               | JDS (InputFieldFeedback)    | OneUI                                         |
| ------------- | --------------------------- | --------------------------------------------- |
| **Prop Name** | `Feedback Type`             | _(Internal `.DNA/InputFeedback` → `variant`)_ |
| **Type**      | VARIANT                     | —                                             |
| **Default**   | "Negative"                  | —                                             |
| **Options**   | Positive, Warning, Negative | —                                             |

> **Migration Note:** JDS `Feedback Type` on the separate `InputFieldFeedback` component maps to the internal `.DNA/InputFeedback` child's `variant` prop in OneUI. This requires overriding the nested child rather than setting a top-level prop. The separate `InputFieldFeedback` component is eliminated — use OneUI InputField with `feedback = true`.

---

### Inherit Appearance (JDS-Only)

|               | JDS                    | OneUI   |
| ------------- | ---------------------- | ------- |
| **Prop Name** | `[inherit appearance]` | _(N/A)_ |
| **Type**      | VARIANT                | —       |
| **Default**   | "false"                | —       |
| **Options**   | false, true            | —       |

> **Migration Note:** JDS-only prop with no OneUI equivalent. Likely controls whether the input inherits parent styling. Lost in migration.

---

### New Props in OneUI (No JDS Equivalent)

#### Required

|                 | OneUI                                          |
| --------------- | ---------------------------------------------- |
| **Prop Name**   | `required`                                     |
| **Type**        | BOOLEAN                                        |
| **Default**     | false                                          |
| **Description** | Shows a required indicator (`*`) on the label. |

#### Info Icon

|                 | OneUI                                 |
| --------------- | ------------------------------------- |
| **Prop Name**   | `infoIcon`                            |
| **Type**        | BOOLEAN                               |
| **Default**     | false                                 |
| **Description** | Shows an info icon next to the label. |

#### Label Content

|                 | OneUI                                                        |
| --------------- | ------------------------------------------------------------ |
| **Prop Name**   | `labelContent`                                               |
| **Type**        | BOOLEAN                                                      |
| **Default**     | true                                                         |
| **Description** | Controls visibility of label content within the label frame. |

#### Dynamic Text

|                 | OneUI                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| **Prop Name**   | `dynamicText`                                                                                          |
| **Type**        | BOOLEAN                                                                                                |
| **Default**     | false                                                                                                  |
| **Description** | Shows a dynamic text area (character count, helper hint) below the input via `.DNA/DynamicText` child. |

#### Shape (Internal `.DNA/Input`)

|                 | OneUI (`.DNA/Input`)                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------ |
| **Prop Name**   | `shape`                                                                                          |
| **Type**        | VARIANT                                                                                          |
| **Options**     | default, pill                                                                                    |
| **Default**     | default                                                                                          |
| **Description** | Controls the input's border-radius. `pill` creates a fully rounded input. JDS has no equivalent. |

---

### Props Not in OneUI (JDS-Only, Lost in Migration)

| JDS Prop                    | Type                     | Values            | Impact                                                                       |
| --------------------------- | ------------------------ | ----------------- | ---------------------------------------------------------------------------- |
| `Emphasis`                  | VARIANT                  | Low, Medium, High | ⚠️ 3 levels → 2 internal levels (`medium`, `high`). `Low` has no equivalent. |
| `State`                     | VARIANT                  | Idle, Filled      | ⚠️ Moved to internal `.DNA/Input` child — not top-level.                     |
| `Read Only`                 | VARIANT                  | False, True       | ⚠️ Moved to internal `.DNA/Input` state — not top-level.                     |
| `Disabled`                  | VARIANT                  | False, True       | ❌ No static disabled variant at any level.                                  |
| `Active/Focus`              | BOOLEAN                  | true, false       | ⚠️ Moved to internal `.DNA/Input` state — not top-level.                     |
| `[inherit appearance]`      | VARIANT                  | false, true       | ❌ Lost entirely.                                                            |
| Placeholder (on bare Input) | BOOLEAN                  | true, false       | ⚠️ Placeholder handled by InputText component in OneUI.                      |
| Label child Weight/Tinted   | VARIANT (on child Label) | —                 | Typography control lost — OneUI manages internally.                          |

---

## Full Props Comparison Table

| #   | Prop Concept         | JDS Prop                    | JDS Type      | JDS Values                  | JDS Default | OneUI Prop                | OneUI Type           | OneUI Values                            | OneUI Default | Status                     |
| --- | -------------------- | --------------------------- | ------------- | --------------------------- | ----------- | ------------------------- | -------------------- | --------------------------------------- | ------------- | -------------------------- |
| 1   | Size                 | `Size`                      | VARIANT       | S, M, L                     | M           | `size`                    | VARIANT              | s, m, l                                 | m             | ✅ Direct match            |
| 2   | Emphasis / Attention | `Emphasis`                  | VARIANT       | Low, Medium, High           | Medium      | _(internal `.DNA`)_       | _(internal VARIANT)_ | medium, high                            | medium        | ⚠️ Internalized + reduced  |
| 3   | State                | `State`                     | VARIANT       | Idle, Filled                | Idle        | _(internal `.DNA`)_       | _(internal VARIANT)_ | idle, focus, filled, readOnly, feedback | idle          | ⚠️ Internalized + expanded |
| 4   | Read Only            | `Read Only`                 | VARIANT       | False, True                 | False       | _(internal `.DNA` state)_ | —                    | readOnly                                | —             | ⚠️ Merged into state       |
| 5   | Disabled             | `Disabled`                  | VARIANT       | False, True                 | False       | _(none)_                  | —                    | —                                       | —             | ❌ JDS-only                |
| 6   | Active/Focus         | `Active/Focus`              | BOOLEAN       | true, false                 | false       | _(internal `.DNA` state)_ | —                    | focus                                   | —             | ⚠️ Merged into state       |
| 7   | Label toggle         | `Label`                     | BOOLEAN       | true, false                 | true        | `label`                   | BOOLEAN              | true, false                             | true          | ✅ Direct match            |
| 8   | Label text           | Child `Label` → `Text`      | Child TEXT    | free text                   | —           | _(inline text)_           | TEXT node            | free text                               | —             | ⚠️ Mechanism change        |
| 9   | Description toggle   | `Description`               | BOOLEAN       | true, false                 | false       | `description`             | BOOLEAN              | true, false                             | false         | ✅ Direct match            |
| 10  | Start toggle         | `Start`                     | BOOLEAN       | true, false                 | false       | _(internal `.DNA`)_       | _(internal BOOLEAN)_ | true, false                             | true          | ⚠️ Internalized            |
| 11  | Start swap           | `↳ Content (Start)`         | INSTANCE_SWAP | component ref               | Icon        | _(internal `.DNA`)_       | _(internal SWAP)_    | component ref                           | —             | ⚠️ Internalized            |
| 12  | End toggle           | `End`                       | BOOLEAN       | true, false                 | false       | _(internal `.DNA`)_       | _(internal BOOLEAN)_ | true, false                             | true          | ⚠️ Internalized            |
| 13  | End swap             | `↳ Content (End)`           | INSTANCE_SWAP | component ref               | IconButton  | _(internal `.DNA`)_       | _(internal SWAP)_    | component ref                           | —             | ⚠️ Internalized            |
| 14  | Helper text toggle   | `Helper Text`               | BOOLEAN       | true, false                 | false       | `feedback`                | BOOLEAN              | true, false                             | false         | ⚠️ Renamed + scoped        |
| 15  | Feedback type        | _(InputFieldFeedback only)_ | VARIANT       | Positive, Warning, Negative | Negative    | _(internal `.DNA`)_       | _(internal VARIANT)_ | negative, etc.                          | negative      | ⚠️ Component merge         |
| 16  | Inherit appearance   | `[inherit appearance]`      | VARIANT       | false, true                 | false       | _(none)_                  | —                    | —                                       | —             | ❌ JDS-only                |
| 17  | Required             | _(N/A)_                     | —             | —                           | —           | `required`                | BOOLEAN              | true, false                             | false         | ❌ OneUI-only (new)        |
| 18  | Info icon            | _(N/A)_                     | —             | —                           | —           | `infoIcon`                | BOOLEAN              | true, false                             | false         | ❌ OneUI-only (new)        |
| 19  | Label content        | _(N/A)_                     | —             | —                           | —           | `labelContent`            | BOOLEAN              | true, false                             | true          | ❌ OneUI-only (new)        |
| 20  | Dynamic text         | _(N/A)_                     | —             | —                           | —           | `dynamicText`             | BOOLEAN              | true, false                             | false         | ❌ OneUI-only (new)        |
| 21  | Shape                | _(N/A)_                     | —             | —                           | —           | _(internal `.DNA`)_       | _(internal VARIANT)_ | default, pill                           | default       | ❌ OneUI-only (new)        |

---

## Migration Checklist

- [ ] Map `Size` → `size` (S→s, M→m, L→l) — direct rename
- [ ] Merge `InputFieldFeedback` instances → OneUI InputField with `feedback = true` — **component swap required**
- [ ] Map `Label` → `label` (same BOOLEAN, same default) — direct rename
- [ ] Map `Description` → `description` (same BOOLEAN, same default) — direct rename
- [ ] Map `Helper Text` → `feedback` or `dynamicText` depending on context (neutral hint → `dynamicText`, validation → `feedback`)
- [ ] Handle `Emphasis` — no direct top-level equivalent; override internal `.DNA/Input` child if needed (`Low` has no mapping)
- [ ] Handle `State` — internalized into `.DNA/Input` `state`; no top-level prop to set
- [ ] Handle `Read Only` — now a state value (`readOnly`) on internal `.DNA/Input`, not a standalone prop
- [ ] Handle `Disabled = True` instances — no OneUI equivalent at any level
- [ ] Handle `Active/Focus` — now internal `.DNA/Input` `state = focus`
- [ ] Migrate Start/End slots — move from top-level `Start`/`End` + `↳ Content` swap props to internal `.DNA/Input` child's `start`/`end` + `❖ start`/`❖ end` props
- [ ] Extract label text from nested `Label` child instance → set on OneUI inline label text node
- [ ] Decide defaults for new props: `required` (`false`), `infoIcon` (`false`), `labelContent` (`true`), `dynamicText` (`false`)
- [ ] Handle `[inherit appearance]` — lost in migration, no equivalent
- [ ] Audit `InputFieldFeedback` `Feedback Type` values → map to internal `.DNA/InputFeedback` `variant` prop

---

---

---

# Select  ·  JDS v3 → OneUI

## 1. Overview

| Component               | JDS (Jio Testlab Library)                                                                      | OneUI Micropatterns                                                            | Migration Type         |
| ----------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------- |
| **SelectField**         | ✅ `SelectField` (CS, 108 variants) — `Size` × `Emphasis` × `State` × `Read Only` × `Disabled` | ✅ `Select` (CS, 39 variants) — `state` × `trigger` × `menuDirection` × `size` | 🔶 Major restructure   |
| **SelectFieldFeedback** | ✅ `SelectFieldFeedback` (CS, 324 variants) — adds `Feedback Type` to SelectField              | ✅ Merged into `Select` via `state=feedback` + `feedback` BOOLEAN              | 🔶 Merged into Select  |
| **Deprecated-Select**   | ✅ `Deprecated-Select` (CS, 72 variants) — older version with Start/End Slot INSTANCE_SWAPs    | ❌ No equivalent — migrate to `Select`                                         | ⚠️ Deprecated → Remove |

---

## 2. Architecture Differences

| Aspect                      | JDS                                                                                                                                                   | OneUI Micropatterns                                                                                                |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Component Structure**     | Split into 3 CS: `SelectField` (normal), `SelectFieldFeedback` (with validation), `Deprecated-Select` (legacy)                                        | Single unified `Select` CS with `state=feedback` variant + `feedback` BOOLEAN                                      |
| **Trigger Types**           | Input-only — always looks like a form field                                                                                                           | 3 trigger styles: `selectableInput`, `selectableButton`, `selectableIconButton`                                    |
| **Dropdown Menu**           | ❌ No built-in dropdown — Select is the trigger only                                                                                                  | ✅ Built-in dropdown menu via `menuDirection` (below/above/alignWithTrigger) with `SelectMenu` sub-components      |
| **Menu Types**              | ❌ Not available                                                                                                                                      | ✅ `SelectMenu/singleSelect`, `SelectMenu/multiSelect`, `SelectMenu/actions` — pre-configured ContextMenu wrappers |
| **Emphasis System**         | `Emphasis`: Low, Medium, High (PascalCase)                                                                                                            | `attention`: low, medium, high (camelCase) — on trigger sub-components                                             |
| **Size System**             | `Size`: S, M, L (PascalCase)                                                                                                                          | `size`: s, m, l (camelCase)                                                                                        |
| **State System**            | `State`: Idle, Active, Filled (PascalCase)                                                                                                            | `state`: idle, active, feedback (camelCase) — no separate `filled` variant at top level                            |
| **Disabled State**          | `Disabled`: True/False (VARIANT)                                                                                                                      | ❌ No disabled variant                                                                                             |
| **Read Only State**         | `Read Only`: True/False (VARIANT)                                                                                                                     | ❌ No read-only variant                                                                                            |
| **Feedback/Validation**     | Separate `SelectFieldFeedback` CS with `Feedback Type`: Positive/Negative/Warning                                                                     | `state=feedback` on main `Select` CS + `feedback` BOOLEAN + `.DNA/InputFeedback` sub-component                     |
| **Text Content**            | Nested `Label` component (via JDS `Label` CS) + `Text` CS for input/description/helper                                                                | Direct TEXT props (`labelText`) + `InputText` sub-component                                                        |
| **Icon System**             | Fixed `Icon` instance (JDS `Icon` CS, 20×20) with `Icon Asset` INSTANCE_SWAP                                                                          | `.DNA/Input` framework with configurable start/end slots                                                           |
| **Focus Ring**              | `FocusRing` — separate `Stroke` instance (hidden by default), `Focused` BOOLEAN                                                                       | Built into `.DNA/Input` state system — `state=focus`                                                               |
| **Start/End Slots**         | Only in `Deprecated-Select`: `Start Slot` BOOLEAN + `↳ Slot Content (Start)` INSTANCE_SWAP, `End Slot` BOOLEAN + `↳ Slot Content (End)` INSTANCE_SWAP | `start` VARIANT on trigger sub-CS (true/false). End always shows chevron icon.                                     |
| **Shape**                   | Fixed rectangular with `Stroke` component for borders                                                                                                 | `shape`: `default` or `pill` (selectableInput only)                                                                |
| **BottomSheet Alternative** | ❌ Not available                                                                                                                                      | ✅ `contextMenu` BOOLEAN — set `false` to pair with BottomSheet instead                                            |
| **Internal Structure**      | Top (Label + Description) → Input Container (Input + Icon + Stroke + FocusRing) → Helper text                                                         | Label+Description → SelectInputWrapper (SelectTrigger + SelectMenuWrapper) → .DNA/InputFeedback → Helper text      |

---

## 3. Props Mapping

### 3.1 JDS `SelectField` → OneUI `Select`

| JDS Prop          | Type    | Default  | OneUI Equivalent                | OneUI Type | Default           | Notes                                                                                                                                |
| ----------------- | ------- | -------- | ------------------------------- | ---------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `Size`            | VARIANT | `M`      | `size`                          | VARIANT    | `m`               | ✅ Direct: S→s, M→m, L→l                                                                                                             |
| `Emphasis`        | VARIANT | `Medium` | `attention` (on trigger sub-CS) | VARIANT    | `medium`          | ⚠️ JDS has Low/Medium/High. OneUI selectableInput has medium/high only. selectableButton/IconButton have low/medium/high.            |
| `State`           | VARIANT | `Idle`   | `state`                         | VARIANT    | `idle`            | 🔶 Partial: Idle→idle, Active→active. JDS `Filled` has no top-level OneUI equivalent — use idle trigger with `filled=true` on sub-CS |
| `Read Only`       | VARIANT | `False`  | _(no equivalent)_               | —          | —                 | ❌ Lost — OneUI has no read-only state                                                                                               |
| `Disabled`        | VARIANT | `False`  | _(no equivalent)_               | —          | —                 | ❌ Lost — OneUI has no disabled state                                                                                                |
| `Label`           | BOOLEAN | `true`   | `label`                         | BOOLEAN    | `true`            | ✅ Direct mapping                                                                                                                    |
| `Description`     | BOOLEAN | `false`  | `description`                   | BOOLEAN    | `false`           | ✅ Direct mapping                                                                                                                    |
| `Helper Text`     | BOOLEAN | `false`  | `helperText`                    | BOOLEAN    | `false`           | ✅ Direct mapping                                                                                                                    |
| `Focused`         | BOOLEAN | `false`  | _(built into state system)_     | —          | —                 | ❌ No separate prop — focus is part of `state=active`                                                                                |
| _(not available)_ | —       | —        | `trigger`                       | VARIANT    | `selectableInput` | 🆕 Three trigger styles                                                                                                              |
| _(not available)_ | —       | —        | `menuDirection`                 | VARIANT    | `-`               | 🆕 Built-in dropdown positioning                                                                                                     |
| _(not available)_ | —       | —        | `contextMenu`                   | BOOLEAN    | `true`            | 🆕 BottomSheet alternative toggle                                                                                                    |
| _(not available)_ | —       | —        | `required`                      | BOOLEAN    | `false`           | 🆕 Required field indicator                                                                                                          |
| _(not available)_ | —       | —        | `infoIcon`                      | BOOLEAN    | `false`           | 🆕 Info icon next to label                                                                                                           |
| _(not available)_ | —       | —        | `labelText`                     | TEXT       | `"Label"`         | 🆕 Direct text prop (JDS used Label instance)                                                                                        |
| _(not available)_ | —       | —        | `feedback`                      | BOOLEAN    | `false`           | 🆕 Replaces separate SelectFieldFeedback CS                                                                                          |

### 3.2 JDS `SelectFieldFeedback` → OneUI `Select`

| JDS Prop            | Type    | Default    | OneUI Equivalent                                  | OneUI Type | Default    | Notes                                                                                                                   |
| ------------------- | ------- | ---------- | ------------------------------------------------- | ---------- | ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| `Feedback Type`     | VARIANT | `Negative` | _(built into `.DNA/InputFeedback` sub-component)_ | —          | `negative` | ⚠️ JDS had Positive/Negative/Warning as top-level variant. OneUI uses `.DNA/InputFeedback` instance with `variant` prop |
| _(all other props)_ | —       | —          | _(same as SelectField mapping above)_             | —          | —          |                                                                                                                         |

### 3.3 JDS `Deprecated-Select` → OneUI `Select`

| JDS Prop                 | Type          | Default  | OneUI Equivalent                    | OneUI Type | Default  | Notes                                                                     |
| ------------------------ | ------------- | -------- | ----------------------------------- | ---------- | -------- | ------------------------------------------------------------------------- |
| `Start Slot`             | BOOLEAN       | `false`  | `start` (on trigger sub-CS)         | VARIANT    | `false`  | 🔶 Similar concept, different mechanism                                   |
| `End Slot`               | BOOLEAN       | `true`   | _(always present — chevron icon)_   | —          | —        | ❌ End slot is fixed chevron in OneUI — not configurable                  |
| `↳ Slot Content (Start)` | INSTANCE_SWAP | icon     | _(part of `.DNA/Input` start slot)_ | —          | —        | ❌ No direct INSTANCE_SWAP — icon is fixed in start slot                  |
| `↳ Slot Content (End)`   | INSTANCE_SWAP | icon     | _(no equivalent)_                   | —          | —        | ❌ Lost — end is always chevron                                           |
| `Focused`                | BOOLEAN       | `false`  | _(built into state)_                | —          | —        | ❌ No separate focus prop                                                 |
| `Emphasis`               | VARIANT       | `Medium` | `attention`                         | VARIANT    | `medium` | ⚠️ Deprecated had Low/Medium only. OneUI selectableInput has medium/high. |

### 3.4 Default Shifts ⚠️

| Aspect               | JDS Default                            | OneUI Default                              | Risk                                                                      |
| -------------------- | -------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------- |
| Size naming          | `M` (PascalCase)                       | `m` (camelCase)                            | Low — same meaning                                                        |
| Emphasis → attention | `Medium`                               | `medium`                                   | Low — same meaning, different casing                                      |
| State naming         | `Idle` (PascalCase)                    | `idle` (camelCase)                         | Low — same meaning                                                        |
| Disabled state       | Available (`False`)                    | ❌ Not available                           | ⚠️ HIGH — no way to disable Select in OneUI                               |
| Read Only state      | Available (`False`)                    | ❌ Not available                           | ⚠️ HIGH — no read-only mode in OneUI                                      |
| Filled state         | Top-level `State=Filled`               | No top-level filled — sub-CS `filled=true` | ⚠️ MEDIUM — different mechanism for showing selected value                |
| Feedback             | Separate CS (`SelectFieldFeedback`)    | Single CS with `state=feedback`            | ⚠️ MEDIUM — designers must use state variant, not a separate component    |
| Label structure      | Nested `Label` instance (JDS Label CS) | Direct `labelText` TEXT prop               | ⚠️ MEDIUM — can't use Label component features (Emphasis, Weight, Tinted) |

---

## 4. Size Dimensions

| Size  | JDS Width | JDS Height | OneUI Width (selectableInput) | OneUI Height (selectableInput) |
| ----- | --------- | ---------- | ----------------------------- | ------------------------------ |
| S / s | 328px     | 54px       | 328px                         | 58px                           |
| M / m | 328px     | 70px       | 328px                         | 66px                           |
| L / l | 328px     | 80px       | 328px                         | 74px                           |

> Note: OneUI also has `selectableButton` (s: 98×32, m: 118×40, l: 136×48) and `selectableIconButton` (s: 32×32, m: 40×40, l: 48×48) which have no JDS equivalent.

---

## 5. OneUI-Only Features (New in OneUI)

### 5.1 Multiple Trigger Styles

JDS Select was input-style only. OneUI offers 3 trigger types:

| Trigger                | Description                                 | Use Case                              |
| ---------------------- | ------------------------------------------- | ------------------------------------- |
| `selectableInput`      | Form input field with placeholder + chevron | Standard form fields (closest to JDS) |
| `selectableButton`     | Button with label text + chevron            | Inline filter/sort selectors          |
| `selectableIconButton` | Icon-only button                            | Compact triggers, overflow menus      |

### 5.2 Built-in Dropdown Menu

JDS Select was a trigger-only component — no dropdown menu was included. OneUI Select integrates the full dropdown:

- **`menuDirection`**: `below`, `above`, `alignWithTrigger` — controls dropdown position
- **`SelectMenu/singleSelect`**: Radio-like single selection (groups, secondaryText)
- **`SelectMenu/multiSelect`**: Checkbox multi-selection (groups, secondaryText)
- **`SelectMenu/actions`**: Action menu (groups, secondaryText)
- **`.SelectMenuWrapper`**: Controls menu alignment and sizing

### 5.3 SelectableInput Trigger Sub-CS Props

| Prop        | Type    | Default   | Values        | Purpose                           |
| ----------- | ------- | --------- | ------------- | --------------------------------- |
| `filled`    | VARIANT | `false`   | false, true   | Whether a value has been selected |
| `attention` | VARIANT | `medium`  | medium, high  | Visual weight                     |
| `shape`     | VARIANT | `default` | default, pill | Input shape                       |
| `start`     | VARIANT | `false`   | false, true   | Leading icon                      |

### 5.4 SelectableButton Trigger Sub-CS Props

| Prop        | Type    | Default  | Values            | Purpose         |
| ----------- | ------- | -------- | ----------------- | --------------- |
| `attention` | VARIANT | `medium` | low, medium, high | Visual weight   |
| `condensed` | VARIANT | `false`  | false, true       | Compact padding |
| `contained` | VARIANT | `true`   | true, false       | Background fill |
| `start`     | VARIANT | `false`  | false, true       | Leading icon    |
| `chevron`   | VARIANT | `true`   | false, true       | Dropdown arrow  |

### 5.5 SelectableIconButton Trigger Sub-CS Props

| Prop        | Type    | Default  | Values            | Purpose         |
| ----------- | ------- | -------- | ----------------- | --------------- |
| `attention` | VARIANT | `medium` | low, medium, high | Visual weight   |
| `contained` | VARIANT | `true`   | true, false       | Background fill |
| `condensed` | VARIANT | `false`  | false, true       | Compact padding |

### 5.6 Other New Features

- **`required` BOOLEAN** — asterisk indicator for required fields
- **`infoIcon` BOOLEAN** — info icon next to label
- **`contextMenu` BOOLEAN** — toggle to use BottomSheet instead of dropdown
- **`labelText` TEXT** — direct text prop (replaces Label instance)
- **`shape=pill`** — fully rounded input shape
- **Menu alignment**: `fill`, `start`, `middle`, `end`
- **Menu sizing**: `fill`, `s`, `m`, `l`
- **Select-specific ListItems**: `.SelectMenuListItem` variants for single/multi select with `selected` and `divider` props

---

## 6. Lost JDS Props (No OneUI Equivalent)

| JDS Prop                               | Type          | Default    | Impact                                     | Workaround                                                    |
| -------------------------------------- | ------------- | ---------- | ------------------------------------------ | ------------------------------------------------------------- |
| `Disabled`                             | VARIANT       | `False`    | ⚠️ HIGH — cannot disable Select in OneUI   | Apply opacity via design tokens or custom override            |
| `Read Only`                            | VARIANT       | `False`    | ⚠️ HIGH — cannot make Select read-only     | Remove interaction cues manually                              |
| `Focused`                              | BOOLEAN       | `false`    | LOW — built into `state=active`            | Use `state=active` to show focused state                      |
| `↳ Slot Content (End)` INSTANCE_SWAP   | INSTANCE_SWAP | icon       | MEDIUM — end slot is fixed chevron         | End is always dropdown chevron — can't swap                   |
| `↳ Slot Content (Start)` INSTANCE_SWAP | INSTANCE_SWAP | icon       | LOW — OneUI has `start` toggle but no swap | Start icon is configurable at DNA/Input level                 |
| `Feedback Type` as separate CS         | VARIANT       | `Negative` | MEDIUM — now built into single CS          | Use `state=feedback` + configure `.DNA/InputFeedback` variant |

---

## 7. Full Comparison Table

| Feature                     | JDS SelectField                                                              | OneUI Select                                      | Mapping                |
| --------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------- | ---------------------- |
| **Component exists**        | ✅ SelectField (108v) + SelectFieldFeedback (324v) + Deprecated-Select (72v) | ✅ Select (39v)                                   | ✅ Both exist          |
| **Size options**            | S, M, L (3)                                                                  | s, m, l (3)                                       | ✅ Same count          |
| **Emphasis / Attention**    | Low, Medium, High (3)                                                        | medium, high (input) / low, medium, high (button) | ⚠️ Input lost `low`    |
| **States**                  | Idle, Active, Filled                                                         | idle, active, feedback                            | 🔶 Different semantics |
| **Disabled**                | ✅ Variant                                                                   | ❌ Not available                                  | ❌ Lost                |
| **Read Only**               | ✅ Variant                                                                   | ❌ Not available                                  | ❌ Lost                |
| **Label**                   | ✅ BOOLEAN + nested Label CS                                                 | ✅ BOOLEAN + `labelText` TEXT                     | 🔶 Simplified          |
| **Description**             | ✅ BOOLEAN                                                                   | ✅ BOOLEAN                                        | ✅ Same                |
| **Helper Text**             | ✅ BOOLEAN                                                                   | ✅ BOOLEAN                                        | ✅ Same                |
| **Focus indicator**         | ✅ `Focused` BOOLEAN + FocusRing                                             | Built into DNA/Input state=focus                  | 🔶 Mechanism change    |
| **Validation/Feedback**     | Separate CS (SelectFieldFeedback)                                            | `state=feedback` + `feedback` BOOLEAN             | 🔶 Merged              |
| **Feedback types**          | Positive, Negative, Warning                                                  | Via `.DNA/InputFeedback` variant                  | 🔶 Sub-component level |
| **Dropdown menu**           | ❌ Not included                                                              | ✅ Built-in with 3 menu types                     | 🆕 Major addition      |
| **Multiple trigger styles** | ❌ Input-only                                                                | ✅ Input, Button, IconButton                      | 🆕 Major addition      |
| **Shape options**           | Fixed rectangular                                                            | default / pill                                    | 🆕 OneUI-only          |
| **Required indicator**      | ❌ Not available                                                             | ✅ `required` BOOLEAN                             | 🆕 OneUI-only          |
| **Start/End slots**         | Deprecated-Select only (INSTANCE_SWAP)                                       | `start` toggle on trigger sub-CS                  | 🔶 Simplified          |
| **BottomSheet mode**        | ❌ Not available                                                             | ✅ `contextMenu` BOOLEAN                          | 🆕 OneUI-only          |

---

## 8. Internal Layer Structure Comparison

### JDS SelectField (Idle, M, Medium)

### SelectField — Internal Structure

    SelectField
    ├── Top (FRAME)
    │   ├── Label (INSTANCE → JDS Label CS, "Label", 14px)
    │   └── Description (INSTANCE → JDS Text CS, hidden)
    │
    ├── Input Container (FRAME)
    │   ├── Input (INSTANCE → JDS Input CS, "Placeholder", 16px)
    │   │   └── InputText (INSTANCE → JDS Text CS)
    │   ├── Icon (INSTANCE → JDS Icon CS, 20×20, ic_favorite)
    │   ├── Stroke (INSTANCE → JDS Stroke CS, border)
    │   └── FocusRing (INSTANCE → JDS Stroke CS, hidden)
    │
    └── Helper text (INSTANCE → JDS Text CS, hidden)

### OneUI Select — Internal Structure

#### Idle, selectableInput, -, m

    Select
    ├── Label + Description (FRAME)
    │   ├── Label + Icon (FRAME)
    │   │   ├── Label + Required* (FRAME)
    │   │   │   ├── Label (TEXT — "Label", 14px)
    │   │   │   └── * (TEXT — required asterisk, hidden)
    │   │   └── Icon (INSTANCE — info icon, hidden)
    │   └── Description (TEXT — hidden)
    │
    ├── SelectInputWrapper (FRAME)
    │   ├── SelectInput (INSTANCE → .SelectTrigger/StyleSelectableInput/...)
    │   │   └── Input (INSTANCE → .DNA/Input)
    │   │       └── StateLayer (FRAME)
    │   │           ├── InputText (INSTANCE → InputText CS)
    │   │           └── End (FRAME — chevron icon)
    │   │
    │   └── SelectMenuWrapper (INSTANCE — dropdown, active state only)
    │
    ├── .DNA/InputFeedback (INSTANCE — error/validation, hidden)
    └── Helper text. (TEXT — hidden)

---

## 9. Design Tips

1. **JDS splits Select into 3 components; OneUI unifies into 1.** If your designs use `SelectFieldFeedback`, switch to the same `Select` component with `state=feedback` + `feedback=true`. If using `Deprecated-Select`, migrate to `Select` with `trigger=selectableInput`.

2. **`State=Filled` maps differently.** JDS has a top-level `Filled` state. OneUI handles filled state at the trigger sub-CS level (`filled=true` on `.SelectTrigger/StyleSelectableInput/...`). The top-level `state` only has idle/active/feedback.

3. **Disabled and Read Only are lost.** This is a critical migration gap. JDS Select supports both `Disabled=True` and `Read Only=True`. OneUI Select has neither. Apply opacity overrides or custom styling if needed.

4. **JDS uses nested Label/Text instances; OneUI uses direct TEXT nodes.** JDS leveraged its `Label` CS (with Emphasis, Weight, Tinted props) and `Text` CS. OneUI uses a direct `labelText` TEXT prop + raw TEXT nodes. You lose the Label component's styling flexibility.

5. **OneUI adds dropdown menus that JDS lacked.** JDS Select was trigger-only — designers had to build dropdown menus separately. OneUI bundles the full dropdown experience. Use `menuDirection=below` (most common), `above` (near viewport bottom), or `alignWithTrigger`.

6. **Choose the right trigger style.** `selectableInput` is closest to JDS (form field + label). Use `selectableButton` for compact inline selectors (filter chips, sort controls). Use `selectableIconButton` for icon-only triggers.

7. **Emphasis Low on selectableInput is gone.** JDS offered `Emphasis=Low` for a subtle select field. OneUI `selectableInput` only supports `attention=medium/high`. Use `selectableButton` with `attention=low` for de-emphasized triggers.

8. **SelectMenu types cover single, multi, and action patterns.** `singleSelect` has radio-like selection. `multiSelect` adds checkboxes. `actions` is for action menus with no selection state. Each supports `groups` (section dividers) and `secondaryText` (descriptive option text).

9. **`shape=pill` is new for select inputs.** Use it for search-like select fields or rounded UI patterns. Only available on `selectableInput` trigger.

10. **BottomSheet alternative for mobile.** Set `contextMenu=false` when designing for mobile where selection should open a BottomSheet overlay instead of an inline dropdown.

---

## 10. Migration Checklist

### SelectField → Select

- [ ] Replace JDS `SelectField` with OneUI `Select`:
  - [ ] Set `trigger=selectableInput` (closest to JDS appearance)
  - [ ] Map `Size` → `size`: S→s, M→m, L→l
  - [ ] Map `Emphasis` → `attention` on trigger sub-CS: Medium→medium, High→high
  - [ ] ⚠️ If using `Emphasis=Low`: switch to `selectableButton` trigger with `attention=low`
  - [ ] Map `State`: Idle→idle, Active→active, Filled→idle (with trigger sub-CS `filled=true`)
- [ ] Configure form metadata:
  - [ ] `label=true` + `labelText="..."` (replaces nested Label instance)
  - [ ] `description=true/false` (same concept)
  - [ ] `helperText=true/false` (same concept)
  - [ ] `required=true` if field is mandatory (🆕)
- [ ] Handle JDS-only states:
  - [ ] ⚠️ `Disabled=True` — no OneUI equivalent. Apply opacity override or custom styling.
  - [ ] ⚠️ `Read Only=True` — no OneUI equivalent. Remove interaction cues manually.
- [ ] Handle focus: Remove `Focused` BOOLEAN usage — focus is built into `state=active`

### SelectFieldFeedback → Select (state=feedback)

- [ ] Replace JDS `SelectFieldFeedback` with OneUI `Select`:
  - [ ] Set `state=feedback`
  - [ ] Set `feedback=true`
  - [ ] Map `Feedback Type` (Positive/Negative/Warning) → configure `.DNA/InputFeedback` sub-component `variant` prop
  - [ ] All other props map same as SelectField above

### Deprecated-Select → Select

- [ ] Replace JDS `Deprecated-Select` with OneUI `Select`:
  - [ ] Remove `Start Slot` / `End Slot` BOOLEANs → use `start` VARIANT on trigger sub-CS
  - [ ] Remove `↳ Slot Content (Start/End)` INSTANCE_SWAPs → fixed start/chevron icons
  - [ ] All other props map same as SelectField above

### New Capabilities (Adopt where useful)

- [ ] Consider `selectableButton` / `selectableIconButton` triggers for non-form-field use cases
- [ ] Add dropdown menus: configure `menuDirection` + choose `SelectMenu` type (singleSelect/multiSelect/actions)
- [ ] Add `required=true` for mandatory form fields
- [ ] Use `shape=pill` for rounded select inputs
- [ ] Use `contextMenu=false` for mobile BottomSheet pattern

---
