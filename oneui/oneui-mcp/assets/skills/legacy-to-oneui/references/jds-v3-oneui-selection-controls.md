---
name: jds-v3-oneui-selection-controls
description: >-
  JDS v3 (Jio Testlab Library) → OneUI migration mapping for chips, segmented controls and tabs. Covers Chip, SegmentedControl, Segmented control, .SegmentedItem, Tabs, TabGroup, Tab.
  Use when swapping or prop-mapping any of these components while converting a reference file to OneUI.
---

# Selection and view switching — JDS v3 → OneUI migration

Part of the JDS v3 → OneUI migration skill set. For routing across all component behaviours, load
`get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-migration-figma-agent.md")`.

**Load this skill when migrating:** Chip, SegmentedControl, Segmented control, .SegmentedItem, Tabs, TabGroup, Tab.

## Components in this skill

- **Chip** — search `Chip`
- **Segmented control** — search `SegmentedControl`
- **Tabs / TabGroup** — search `Tabs`

Jump straight to the component you need — each has its own Overview, Props Mapping, full comparison
table, and Migration Checklist. Do not invent prop names or variant values; use the tables below.

---

# Chip  ·  JDS v3 → OneUI

## Overview

|                         | JDS (Jio Testlab Library)                         | OneUI                                                      |
| ----------------------- | ------------------------------------------------- | ---------------------------------------------------------- |
| **Component Name**      | Chip                                              | Chip                                                       |
| **Variant Filter**      | N/A (dedicated component)                         | N/A (dedicated component)                                  |
| **Total Variants**      | 168 (7 sizes × 3 emphasis × 2 selected × 4 start) | 162 (3 sizes × 3 attention × 2 selected × 3 start × 3 end) |
| **Page**                | Chip                                              | ↳ Chips                                                    |
| **Child Instance Tags** | Label, Icon, Avatar, CounterBadge, Stroke         | StateLayer, Label (TEXT)                                   |

---

## Props Mapping

### Label

|               | JDS                                                                         | OneUI                                             |
| ------------- | --------------------------------------------------------------------------- | ------------------------------------------------- |
| **Prop Name** | Child `Label` component → `Text` prop                                       | _(direct TEXT node named "Label" inside variant)_ |
| **Type**      | Nested child TEXT (via Label component instance)                            | TEXT (inline text node)                           |
| **Default**   | "Label" (Label component default)                                           | "Label"                                           |
| **Mapping**   | Read `Label` child's `Text` value → override OneUI's inline Label text node |                                                   |

#### Behavior Difference

- **JDS:** The chip label is a nested `Label` component instance (same Label component from the Text page). The text is edited by overriding the child Label's `Text` prop. The Label component also carries `Variant`, `Emphasis`, `Weight`, and `Tinted` props for typography control.
- **OneUI:** The label is a plain TEXT node named `"Label"` directly inside the chip variant — no intermediate component. Text is overridden directly on the text node.

> **Migration Note:** Extract the text string from the JDS Chip's nested `Label` child instance and set it on the inline Label text node in OneUI. The Label component's typography props (`Variant`, `Emphasis`, `Weight`, `Tinted`) do not need to be migrated — OneUI handles typography internally based on `size` and `attention`.

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

> **Important:** The **default value differs** — JDS defaults to `Medium`, OneUI defaults to `high`. Chips migrated without explicitly setting this prop will appear **more prominent** in OneUI. Always explicitly set `attention` during migration.

> **Additional Note:** OneUI's description states: _"Use attention from Selected if chip is selected, use attention from Unselected if chip is not selected."_ This implies attention values may behave differently depending on the selected state — verify visually during migration.

---

### Size

|               | JDS     | OneUI   |
| ------------- | ------- | ------- |
| **Prop Name** | `Size`  | `size`  |
| **Type**      | VARIANT | VARIANT |
| **Default**   | "M"     | "M"     |

#### Value Mapping

| JDS `Size` | OneUI `size`                      | Notes                                       |
| ---------- | --------------------------------- | ------------------------------------------- |
| 2XS        | ❌ _(no equivalent)_ — map to `S` | Lossy — OneUI Chip has no 2XS. Closest is S |
| XS         | ❌ _(no equivalent)_ — map to `S` | Lossy — OneUI Chip has no XS. Closest is S  |
| S          | S                                 | Direct mapping                              |
| M          | M                                 | Direct mapping ✅ (both defaults)           |
| L          | L                                 | Direct mapping                              |
| XL         | ❌ _(no equivalent)_ — map to `L` | Lossy — OneUI Chip caps at L                |
| 2XL        | ❌ _(no equivalent)_ — map to `L` | Lossy — OneUI Chip caps at L                |

> **Migration Note:** JDS has **7 sizes**, OneUI Chip has only **3 sizes** (`S`, `M`, `L`). Four JDS sizes (`2XS`, `XS`, `XL`, `2XL`) have no direct equivalent and must be collapsed. Audit instances using these sizes and validate the visual result after migration.

---

### Selected

|               | JDS        | OneUI      |
| ------------- | ---------- | ---------- |
| **Prop Name** | `Selected` | `selected` |
| **Type**      | VARIANT    | VARIANT    |
| **Default**   | "False"    | "true"     |

#### Value Mapping

| JDS `Selected` | OneUI `selected` | Notes          |
| -------------- | ---------------- | -------------- |
| False          | false            | Direct mapping |
| True           | true             | Direct mapping |

> **Important:** The **default value differs** — JDS defaults to `False` (unselected), while OneUI defaults to `true` (selected). Chips migrated without explicitly setting this prop will appear **selected** in OneUI when they were unselected in JDS. Always explicitly set `selected` during migration.

---

### Start Slot

|               | JDS                                 | OneUI                                        |
| ------------- | ----------------------------------- | -------------------------------------------- |
| **Prop Name** | `Start` (VARIANT)                   | `start` (VARIANT) + `↳start` (INSTANCE_SWAP) |
| **Type**      | VARIANT (selects slot content type) | VARIANT (selects slot size) + INSTANCE_SWAP  |
| **Default**   | "None"                              | "none"                                       |

#### Value Mapping

| JDS `Start`  | OneUI `start` | OneUI `↳start` Swap           | Notes                                           |
| ------------ | ------------- | ----------------------------- | ----------------------------------------------- |
| None         | none          | _(N/A)_                       | Direct mapping                                  |
| Icon         | S or M        | Set to icon component         | Set `start` to size, then swap icon             |
| Avatar       | M             | Set to avatar component       | Set `start` to M (avatar-sized), swap to Avatar |
| CounterBadge | S             | Set to CounterBadge component | Set `start` to S, swap to CounterBadge          |

#### Behavior Difference

- **JDS:** `Start` is a single VARIANT prop with typed slot options (`None`, `Icon`, `Avatar`, `CounterBadge`). Each value swaps in a different child frame (`IconOnChip`, `AvatarOnChip`, `CounterBadgeOnChip`) containing the respective component instance. The icon/avatar/badge is overridden by swapping the nested child instance directly.
- **OneUI:** `start` is a VARIANT prop that controls the **slot size** (`none`, `S`, `M`) — not the content type. The actual content is set via dedicated `↳start` INSTANCE_SWAP props (multiple swap props exist for different size/selected variant combinations). You pick the slot size, then swap in whatever component you want.

> **Migration Note:** This is a **significant mechanism change**. JDS gives you typed start content (Icon vs Avatar vs CounterBadge), while OneUI gives you a generic sized slot you fill with any component. When migrating:
>
> 1. Determine the JDS `Start` type (`Icon`, `Avatar`, `CounterBadge`)
> 2. Set OneUI `start` to the appropriate size (`S` for icons/badges, `M` for avatars)
> 3. Use the `↳start` INSTANCE_SWAP to set the actual component
>
> **Note:** OneUI has 3 `↳start` swap props with slight name variations (`↳ start`, `↳ start `, `↳ start  `) — these correspond to different size/selected combinations. Set the one matching your active variant.

---

### End Slot

|               | JDS                                | OneUI                                    |
| ------------- | ---------------------------------- | ---------------------------------------- |
| **Prop Name** | _(N/A — JDS Chip has no End slot)_ | `end` (VARIANT) + `↳end` (INSTANCE_SWAP) |
| **Type**      | —                                  | VARIANT + INSTANCE_SWAP                  |
| **Default**   | —                                  | "none"                                   |
| **Options**   | —                                  | none, S, M                               |

#### Behavior Difference

- **JDS:** Chip has no end slot at all. Content only appears at the start.
- **OneUI:** `end` is a VARIANT prop controlling end slot size (`none`, `S`, `M`), with dedicated `↳end` INSTANCE_SWAP props to set the content (same pattern as start).

> **Migration Note:** This is a net-new capability in OneUI. JDS Chips only support leading content. If your designs need trailing icons (e.g., close/dismiss icons on filter chips), you can now use the end slot. Set `end = none` for all migrated instances to preserve JDS appearance.

---

### Stroke (JDS-Only Visual Layer)

|             | JDS                                     | OneUI                                        |
| ----------- | --------------------------------------- | -------------------------------------------- |
| **Child**   | `Stroke` (INSTANCE of Stroke component) | _(none — handled internally via StateLayer)_ |
| **Purpose** | Border/outline rendering on the chip    | Built into the component structure           |

> **Migration Note:** JDS Chip includes an explicit `Stroke` child instance (with its own `Emphasis`, `Size`, `Tinted` props) for border rendering. OneUI handles borders internally — no action needed, but any custom Stroke overrides in JDS will be lost.

---

### New Props in OneUI (No JDS Equivalent)

#### End Slot

|                 | OneUI                                                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| **Prop Name**   | `end`                                                                                                |
| **Type**        | VARIANT                                                                                              |
| **Options**     | none, S, M                                                                                           |
| **Default**     | none                                                                                                 |
| **Description** | Controls trailing content slot size. Combined with `↳end` INSTANCE_SWAP to set the actual component. |

> **Migration Note:** JDS Chip has no trailing content. Set `end = none` for all migrated instances to preserve original appearance.

#### End Instance Swap

|                 | OneUI                                                                    |
| --------------- | ------------------------------------------------------------------------ |
| **Prop Name**   | `↳end` / `↳end` / `↳end` (3 swap props for different variant states)     |
| **Type**        | INSTANCE_SWAP                                                            |
| **Description** | Dedicated swap props for end slot content across size/selected variants. |

---

### Props Not in OneUI (JDS-Only, Lost in Migration)

| JDS Prop/Feature               | Type                     | Values                           | Impact                                                                                              |
| ------------------------------ | ------------------------ | -------------------------------- | --------------------------------------------------------------------------------------------------- |
| Start typed slots              | VARIANT                  | None, Icon, Avatar, CounterBadge | ⚠️ Mechanism change — OneUI uses generic sized slots + instance swap instead of typed content slots |
| Label component's `Emphasis`   | VARIANT (on child Label) | Low, Medium, High                | Typography control lost — OneUI manages internally                                                  |
| Label component's `Weight`     | VARIANT (on child Label) | Low, Medium, High                | Typography weight control lost — OneUI manages internally                                           |
| Label component's `Tinted`     | VARIANT (on child Label) | False, True                      | Color tinting option lost — OneUI manages internally                                                |
| Stroke child component         | Child INSTANCE           | Emphasis, Size, Tinted props     | Border rendering lost — OneUI handles internally                                                    |
| Sizes `2XS`, `XS`, `XL`, `2XL` | VARIANT values           | —                                | ⚠️ 4 size options lost — must collapse to S, M, or L                                                |

---

## Full Props Comparison Table

| #   | Prop Concept         | JDS Prop               | JDS Type       | JDS Values                       | JDS Default | OneUI Prop      | OneUI Type    | OneUI Values      | OneUI Default | Status                              |
| --- | -------------------- | ---------------------- | -------------- | -------------------------------- | ----------- | --------------- | ------------- | ----------------- | ------------- | ----------------------------------- |
| 1   | Label text           | Child `Label` → `Text` | Child TEXT     | free text                        | "Label"     | _(inline TEXT)_ | TEXT node     | free text         | "Label"       | ⚠️ Mechanism change                 |
| 2   | Emphasis / Attention | `Emphasis`             | VARIANT        | Low, Medium, High                | Medium      | `attention`     | VARIANT       | low, medium, high | high          | ✅ 1:1 (default differs)            |
| 3   | Size                 | `Size`                 | VARIANT        | 2XS–2XL (7)                      | M           | `size`          | VARIANT       | S, M, L (3)       | M             | ⚠️ Partial (4 sizes lost)           |
| 4   | Selected             | `Selected`             | VARIANT        | False, True                      | False       | `selected`      | VARIANT       | true, false       | true          | ✅ 1:1 (default differs)            |
| 5   | Start slot type      | `Start`                | VARIANT        | None, Icon, Avatar, CounterBadge | None        | `start`         | VARIANT       | none, S, M        | none          | ⚠️ Mechanism change (typed → sized) |
| 6   | Start slot swap      | _(child override)_     | Child instance | —                                | —           | `↳start`        | INSTANCE_SWAP | component ref     | placeholder   | ⚠️ Mechanism change                 |
| 7   | End slot type        | _(N/A)_                | —              | —                                | —           | `end`           | VARIANT       | none, S, M        | none          | ❌ OneUI-only (new)                 |
| 8   | End slot swap        | _(N/A)_                | —              | —                                | —           | `↳end`          | INSTANCE_SWAP | component ref     | placeholder   | ❌ OneUI-only (new)                 |

---

## Migration Checklist

- [ ] Map `Emphasis` → `attention` (Low→low, Medium→medium, High→high) — **always set explicitly** due to default change (Medium → high)
- [ ] Map `Selected` → `selected` (False→false, True→true) — **always set explicitly** due to default change (False → true)
- [ ] Map `Size` (S→S, M→M, L→L) — **flag instances using 2XS, XS, XL, 2XL** for manual size decision (4 sizes lost)
- [ ] Convert `Start` typed slots → `start` sized slot + `↳start` INSTANCE_SWAP:
  - [ ] `Start=None` → `start=none`
  - [ ] `Start=Icon` → `start=S` (or M) + swap icon into `↳start`
  - [ ] `Start=Avatar` → `start=M` + swap avatar into `↳start`
  - [ ] `Start=CounterBadge` → `start=S` + swap CounterBadge into `↳start`
- [ ] Set `end = none` for all migrated instances (JDS has no end slot)
- [ ] Extract label text from nested `Label` child instance → override inline Label text node in OneUI
- [ ] Audit any instances relying on Label's `Weight`, `Emphasis`, or `Tinted` props — these are lost in migration
- [ ] Audit any instances with custom Stroke overrides — border styling is now internal

---

---

---

# Segmented control  ·  JDS v3 → OneUI

---

# 1. Component Family Overview

| Component            | JDS (Jio Testlab Library) | OneUI                                  | Purpose                                                |
| -------------------- | ------------------------- | -------------------------------------- | ------------------------------------------------------ |
| **SegmentedControl** | ✅ (0 instances)          | ✅ as `Segmented control` (1 instance) | Container for segmented items — toggle between options |
| **.SegmentedItem**   | ✅ (child component)      | ❌ (replaced by SLOT system)           | Individual segment/tab within the control              |

> **Architecture Change:** JDS uses a 2-component system (SegmentedControl + .SegmentedItem child instances). OneUI uses a 1-component system with SLOT props — items are placed into slots directly, no separate child component.
>
> **Naming:** JDS uses PascalCase `SegmentedControl`, OneUI uses spaced lowercase `Segmented control`.
>
> **Note:** JDS page is marked with 🚧 (under construction), suggesting the component may be in draft/beta state.

---

---

# 2. Architecture Difference

| Aspect               | JDS                                                   | OneUI                                                          |
| -------------------- | ----------------------------------------------------- | -------------------------------------------------------------- |
| **Parent component** | `SegmentedControl` (4 variants)                       | `Segmented control` (162 variants)                             |
| **Item mechanism**   | `.SegmentedItem` child instances (manual add/remove)  | SLOT props — up to ~45 slots available per variant             |
| **Item component**   | `.SegmentedItem` with `Selected` variant (True/False) | Internal slot items: `.Slot/{type}/{shape}/{attention}/{size}` |
| **Item content**     | Icon + Label + CounterBadge (nested instances)        | Pre-configured via slot type (text or icon)                    |
| **Orientation**      | `Orientation` prop (Horizontal/Vertical)              | ❌ Horizontal only (no vertical)                               |
| **Total variants**   | 4                                                     | 162                                                            |
| **Complexity**       | Simple — 2 props on parent                            | Rich — 6 VARIANT props + 45 SLOT props                         |

> **Key Insight:** JDS SegmentedControl is minimal — just size and orientation with manually placed child instances. OneUI is dramatically more feature-rich with attention levels, shape variants, track emphasis, equal width toggle, and text/icon types — but loses vertical orientation.

---

---

# 3. SegmentedControl → Segmented control

## Overview

|                      | JDS (Jio Testlab Library)    | OneUI                                                                            |
| -------------------- | ---------------------------- | -------------------------------------------------------------------------------- |
| **Component Name**   | SegmentedControl             | Segmented control                                                                |
| **Total Variants**   | 4 (2 orientations × 2 sizes) | 162 (3 sizes × 3 attention × 2 shapes × 2 types × 2 equalWidth × ~trackEmphasis) |
| **Instances in Use** | 0                            | 1                                                                                |
| **Page**             | SegmentedControl 🚧          | ↳ Segmented control                                                              |
| **Children**         | .SegmentedItem (instances)   | Slot items (.Slot/{type}/{shape}/{attention}/{size})                             |

---

## Props Mapping

### Size

|               | JDS     | OneUI   |
| ------------- | ------- | ------- |
| **Prop Name** | `Size`  | `size`  |
| **Type**      | VARIANT | VARIANT |
| **Default**   | "M"     | "M"     |

#### Value Mapping

| JDS `Size`           | OneUI `size` | Notes                             |
| -------------------- | ------------ | --------------------------------- |
| S                    | S            | Direct mapping ✅                 |
| M                    | M            | Direct mapping ✅ (both defaults) |
| ❌ _(no equivalent)_ | L            | OneUI-only (new)                  |

> **Migration Note:** Both JDS sizes map directly. OneUI adds an `L` (large) size. Defaults match at "M". Note OneUI uses **uppercase** size values here.

---

### Orientation → _(No OneUI Equivalent)_

|               | JDS                  | OneUI           |
| ------------- | -------------------- | --------------- |
| **Prop Name** | `Orientation`        | _(Not exposed)_ |
| **Type**      | VARIANT              | —               |
| **Default**   | "Horizontal"         | —               |
| **Options**   | Horizontal, Vertical | —               |

> **⚠️ Lost Prop:** JDS supports both horizontal and vertical orientations. OneUI only supports **horizontal** layout.
>
> **Migration Impact:**
>
> - `Horizontal` → default OneUI behavior (no change needed)
> - `Vertical` → **no OneUI equivalent** — you'll need a custom solution or redesign the layout to use horizontal segmented control
>
> **Risk Level:** Low — vertical segmented controls are uncommon in mobile/web UI, and JDS has 0 instances.

---

### attention (OneUI-Only — New)

|               | JDS             | OneUI             |
| ------------- | --------------- | ----------------- |
| **Prop Name** | _(Not exposed)_ | `attention`       |
| **Type**      | —               | VARIANT           |
| **Default**   | —               | "high"            |
| **Options**   | —               | high, medium, low |

> **New OneUI Prop:** Controls the visual emphasis of the selected segment indicator — how prominently it stands out. JDS has no equivalent; all segments use the same emphasis level.
>
> - `high` (default) — bold, high-contrast selected state
> - `medium` — moderate emphasis
> - `low` — subtle, understated selected state
>
> **Design Tip:** Use `high` for primary navigation contexts, `medium` for secondary filters, `low` for subtle contextual switches.

---

### shape (OneUI-Only — New)

|               | JDS             | OneUI             |
| ------------- | --------------- | ----------------- |
| **Prop Name** | _(Not exposed)_ | `shape`           |
| **Type**      | —               | VARIANT           |
| **Default**   | —               | "pill"            |
| **Options**   | —               | pill, rectangular |

> **New OneUI Prop:** Controls the corner shape of the segmented control and its selected indicator.
>
> - `pill` (default) — fully rounded corners (capsule shape)
> - `rectangular` — squared/minimal corner radius
>
> **Design Tip:** `pill` gives a softer, modern look; `rectangular` is more structured and formal.

---

### type (OneUI-Only — New)

|               | JDS             | OneUI      |
| ------------- | --------------- | ---------- |
| **Prop Name** | _(Not exposed)_ | `type`     |
| **Type**      | —               | VARIANT    |
| **Default**   | —               | "text"     |
| **Options**   | —               | text, icon |

> **New OneUI Prop:** Controls whether segments display text labels or icons.
>
> - `text` (default) — text label segments
> - `icon` — icon-only segments (no text)
>
> **JDS Comparison:** JDS `.SegmentedItem` has both Icon and Label as nested instances, allowing mixed content per item. OneUI enforces a uniform type across all segments — all text OR all icons, not mixed per-item.

---

### equalWidth (OneUI-Only — New)

|               | JDS             | OneUI        |
| ------------- | --------------- | ------------ |
| **Prop Name** | _(Not exposed)_ | `equalWidth` |
| **Type**      | —               | VARIANT      |
| **Default**   | —               | "True"       |
| **Options**   | —               | True, False  |

> **New OneUI Prop:** Controls whether all segments share equal width or size to their content.
>
> - `True` (default) — all segments have equal width (looks uniform)
> - `False` — each segment sizes to its text/icon content (variable widths)
>
> **Design Tip:** Use `True` for consistent layouts, `False` when segment labels vary significantly in length.

---

### trackEmphasis (OneUI-Only — New)

|               | JDS             | OneUI             |
| ------------- | --------------- | ----------------- |
| **Prop Name** | _(Not exposed)_ | `trackEmphasis`   |
| **Type**      | —               | VARIANT           |
| **Default**   | —               | "high"            |
| **Options**   | —               | high, medium, low |

> **New OneUI Prop:** Controls the visual emphasis of the background track (the container bar behind the segments).
>
> - `high` (default) — prominent track background
> - `medium` — moderate track visibility
> - `low` — subtle/transparent track
>
> **Design Tip:** Pair `trackEmphasis` with `attention` to create different visual hierarchies. E.g., `trackEmphasis: low` + `attention: high` makes the selected segment pop against a subtle background.

---

## Items / Children Mechanism

| Aspect            | JDS                                                          | OneUI                                         |
| ----------------- | ------------------------------------------------------------ | --------------------------------------------- |
| **Mechanism**     | `.SegmentedItem` child instances                             | SLOT props (up to ~45 slots)                  |
| **Adding items**  | Manually duplicate/add `.SegmentedItem` instances            | Populate `segmentedControlItems` slot props   |
| **Item states**   | `Selected` VARIANT (True/False) on each item                 | Managed internally by slot system             |
| **Item content**  | Icon (INSTANCE) + Label (INSTANCE) + CounterBadge (INSTANCE) | Pre-configured by `type` prop (text or icon)  |
| **Mixed content** | ✅ Each item can have different Icon/Label/Badge combos      | ❌ All items must be same type (text or icon) |

### JDS .SegmentedItem Detail

| Prop       | Type    | Values      | Default |
| ---------- | ------- | ----------- | ------- |
| `Selected` | VARIANT | True, False | True    |

**Internal Structure (per item):**

- **Horizontal layout:** Icon (instance) + [content-wrapper] containing Label (instance) + CounterBadge (instance)
- **Vertical layout:** Icon (instance) + Label (instance) + CounterBadge (instance)

> **Migration Note:** JDS items are more flexible — each can independently show/hide Icon, Label, and CounterBadge. OneUI standardizes items via the `type` prop (all text or all icon) with no per-item CounterBadge support built in.

---

## Full Props Comparison Table

| #   | Prop Concept   | JDS Prop                  | JDS Type | JDS Values               | JDS Default | OneUI Prop              | OneUI Type | OneUI Values          | OneUI Default | Status                                |
| --- | -------------- | ------------------------- | -------- | ------------------------ | ----------- | ----------------------- | ---------- | --------------------- | ------------- | ------------------------------------- |
| 1   | Size           | `Size`                    | VARIANT  | M, S (2)                 | M           | `size`                  | VARIANT    | S, M, L (3)           | M             | ✅ Both map + L new                   |
| 2   | Orientation    | `Orientation`             | VARIANT  | Horizontal, Vertical (2) | Horizontal  | _(none)_                | —          | —                     | —             | ❌ JDS-only (Vertical LOST)           |
| 3   | Attention      | _(none)_                  | —        | —                        | —           | `attention`             | VARIANT    | high, medium, low (3) | high          | ❌ OneUI-only (new)                   |
| 4   | Shape          | _(none)_                  | —        | —                        | —           | `shape`                 | VARIANT    | pill, rectangular (2) | pill          | ❌ OneUI-only (new)                   |
| 5   | Type           | _(none)_                  | —        | —                        | —           | `type`                  | VARIANT    | text, icon (2)        | text          | ❌ OneUI-only (new)                   |
| 6   | Equal width    | _(none)_                  | —        | —                        | —           | `equalWidth`            | VARIANT    | True, False (2)       | True          | ❌ OneUI-only (new)                   |
| 7   | Track emphasis | _(none)_                  | —        | —                        | —           | `trackEmphasis`         | VARIANT    | high, medium, low (3) | high          | ❌ OneUI-only (new)                   |
| 8   | Items          | `.SegmentedItem` children | INSTANCE | Selected True/False      | —           | `segmentedControlItems` | SLOT (×45) | slot content          | —             | ⚠️ Mechanism change (instance → slot) |

---

---

# 4. .SegmentedItem → _(Subsumed by Slot System)_

|                     | JDS                                            | OneUI                                                                   |
| ------------------- | ---------------------------------------------- | ----------------------------------------------------------------------- |
| **Component**       | `.SegmentedItem`                               | ❌ No separate component — items are slots                              |
| **Selection state** | `Selected` VARIANT (True/False)                | Managed internally by parent                                            |
| **Content**         | Icon + Label + CounterBadge (nested instances) | Pre-configured by slot type (`.Slot/{type}/{shape}/{attention}/{size}`) |

### OneUI Slot Item Naming Pattern

Items use internal components following this naming pattern:

**Examples:**

- `.Slot/text/pill/high/M` — text item, pill shape, high attention, medium size
- `.Slot/icon/rectangular/low/S` — icon item, rectangular shape, low attention, small size

**Available combinations per slot:** 48 (2 types × 2 shapes × 3 attentions × 4 sizes)

> **Migration Note:** You no longer manually manage item selection state. The parent `Segmented control` component handles which item appears selected through its internal slot configuration.

---

---

# 5. Behavior Differences

| Behavior                  | JDS                                                  | OneUI                                         |
| ------------------------- | ---------------------------------------------------- | --------------------------------------------- |
| **Number of items**       | Flexible — add/remove `.SegmentedItem` instances     | Up to ~45 items via slot props                |
| **Mixed content**         | ✅ Each item can have independent Icon, Label, Badge | ❌ All items must be same type (text or icon) |
| **CounterBadge on items** | ✅ Built into each .SegmentedItem                    | ❌ Not available as a built-in feature        |
| **Vertical layout**       | ✅ Via `Orientation: Vertical`                       | ❌ Not supported                              |
| **Shape control**         | ❌ Fixed shape                                       | ✅ pill or rectangular                        |
| **Attention levels**      | ❌ Fixed emphasis                                    | ✅ 3 levels (high, medium, low)               |
| **Track emphasis**        | ❌ Fixed track                                       | ✅ 3 levels (high, medium, low)               |
| **Equal width toggle**    | ❌ Fixed behavior                                    | ✅ True/False toggle                          |

---

---

# 6. Complete Component Summary

| Aspect                   | JDS SegmentedControl                            | OneUI Segmented control                                   |
| ------------------------ | ----------------------------------------------- | --------------------------------------------------------- |
| **Props**                | 2 (Size, Orientation)                           | 6 VARIANT + ~45 SLOT                                      |
| **Total Variants**       | 4                                               | 162                                                       |
| **Instances**            | 0                                               | 1                                                         |
| **Sizes**                | S, M (2)                                        | S, M, L (3)                                               |
| **Item mechanism**       | .SegmentedItem instances                        | Slot system                                               |
| **Visual customization** | Minimal — no shape, attention, or track control | Extensive — shape, attention, track emphasis, equal width |
| **Content flexibility**  | High — mixed Icon/Label/Badge per item          | Constrained — all text OR all icon                        |
| **Orientation**          | Horizontal + Vertical                           | Horizontal only                                           |

---

# 7. Recurring Patterns

| Pattern             | JDS → OneUI                                                                            |
| ------------------- | -------------------------------------------------------------------------------------- |
| **Size**            | S, M map directly + L new. Defaults match (M)                                          |
| **Items mechanism** | Instance children → SLOT props (same as Breadcrumbs pattern)                           |
| **Naming**          | PascalCase → spaced lowercase (`SegmentedControl` → `Segmented control`)               |
| **Vertical lost**   | Follows pattern of OneUI being horizontal-focused                                      |
| **Attention added** | Same 3-level attention system (high/medium/low) seen across Badge, IconContained, etc. |

---

# 8. Complete Migration Checklist

## SegmentedControl → Segmented control

- [ ] Map `Size` (S→S, M→M) — both map directly, defaults match
- [ ] Handle `Orientation` loss — **flag any Vertical instances** for redesign
- [ ] Set `attention` based on visual context — default `high` for primary use
- [ ] Set `shape` — `pill` (default) for modern look, `rectangular` for structured
- [ ] Set `type` — `text` for label segments, `icon` for icon-only segments
- [ ] Set `equalWidth` — `True` (default) for uniform, `False` for variable-width
- [ ] Set `trackEmphasis` — `high` (default) for prominent background track

## .SegmentedItem → Slot System

- [ ] Replace `.SegmentedItem` instances with slot content in `segmentedControlItems` slots
- [ ] Remove manual `Selected` state management — OneUI handles internally
- [ ] **Flag items using CounterBadge** — no built-in OneUI equivalent
- [ ] **Flag items with mixed content** (some with icons, some without) — OneUI requires uniform type

## Total Instances to Migrate

- [ ] **0 total** — JDS has 0 instances (component marked 🚧 under construction)

---

---

# Tabs / TabGroup  ·  JDS v3 → OneUI

## Overview

|                                | JDS (Jio Testlab Library)                                                                                                                | OneUI (`❖ OneUI Micropatterns`)                                                                                                                                                      |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Component Name**             | Tabs (horizontal container) + TabItem + TabsVertical (vertical container) + TabVerticalItem — 4 separate components                      | TabGroup (unified container with orientation prop) — 1 component (with internal `.Tab.Item/Horizontal` and `.Tab.Item/Vertical`)                                                     |
| **Total Variants**             | 2 (Tabs) + 2 (TabItem) + 1 (TabsVertical) + 2 (TabVerticalItem) = 7 total                                                                | 6 (TabGroup: 3 sizes × 2 orientations), internal `.Tab.Item`: 162 per orientation                                                                                                    |
| **Library**                    | Jio Testlab Library                                                                                                                      | `❖ OneUI Micropatterns`                                                                                                                                                              |
| **Architecture**               | Separate components for horizontal (Tabs + TabItem) and vertical (TabsVertical + TabVerticalItem). Tabs wraps TabItem children directly. | Single TabGroup with `orientation` prop (horizontal/vertical). Uses SLOT props (`↳ TabItems`) for tab item content. Internal `.Tab.Item` components handle individual tab rendering. |
| **Page**                       | Tabs                                                                                                                                     | ↳ TabGroup                                                                                                                                                                           |
| **Child Instance Tags (Tabs)** | ScrollButton Start, TabItem children, ScrollButton End                                                                                   | `↳ TabItems` (SLOT containing `.slot` instances wrapping `.Tab.Item`)                                                                                                                |

---

## Component Architecture Mapping

| JDS Component       | → OneUI Component                            | Notes                                                                                                            |
| ------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Tabs**            | **TabGroup** with `orientation = horizontal` | Container merge — JDS Tabs becomes OneUI TabGroup                                                                |
| **TabsVertical**    | **TabGroup** with `orientation = vertical`   | Container merge — JDS TabsVertical becomes the same OneUI TabGroup with different orientation                    |
| **TabItem**         | Internal `.Tab.Item/Horizontal` (via slot)   | ⚠️ JDS TabItem is a top-level component; OneUI tab items are internal slot content — not independently published |
| **TabVerticalItem** | Internal `.Tab.Item/Vertical` (via slot)     | Same pattern — items are internal to the slot system                                                             |

> **Key Structural Change:** JDS splits horizontal and vertical into two component trees. OneUI unifies them as one `TabGroup` with an `orientation` prop. Tab items stop being published components and become slot content inside TabGroup.

---

## Props Mapping — Tabs Container (Tabs / TabsVertical → TabGroup)

### Orientation

|               | JDS                                           | OneUI                |
| ------------- | --------------------------------------------- | -------------------- |
| **Prop Name** | _(Separate components: Tabs vs TabsVertical)_ | `orientation`        |
| **Type**      | —                                             | VARIANT              |
| **Default**   | —                                             | "horizontal"         |
| **Options**   | —                                             | horizontal, vertical |

#### Behavior Difference

- **JDS:** Horizontal and vertical tabs are entirely separate component trees — `Tabs` + `TabItem` for horizontal, `TabsVertical` + `TabVerticalItem` for vertical.
- **OneUI:** A single TabGroup component with an `orientation` variant prop switches between horizontal and vertical layout. Tab items adapt internally.

> **Migration Note:** This is a **component merge**. Swap JDS Tabs → OneUI TabGroup with `orientation = horizontal`. Swap JDS TabsVertical → OneUI TabGroup with `orientation = vertical`.

---

### Size

|               | JDS              | OneUI   |
| ------------- | ---------------- | ------- |
| **Prop Name** | _(No size prop)_ | `size`  |
| **Type**      | —                | VARIANT |
| **Default**   | —                | "M"     |
| **Options**   | —                | S, M, L |

> **Migration Note:** JDS Tabs has no size variant. OneUI TabGroup has 3 sizes (`S`, `M`, `L`). Default `M` likely matches JDS's fixed size. Set explicitly if you need size control.

---

### Equal Width

|               | JDS             | OneUI                     |
| ------------- | --------------- | ------------------------- |
| **Prop Name** | `[equal width]` | _(Not exposed as a prop)_ |
| **Type**      | VARIANT         | —                         |
| **Default**   | "False"         | —                         |
| **Options**   | False, True     | —                         |

> **Migration Note:** JDS Tabs has an `[equal width]` variant that makes all tabs equal width. OneUI TabGroup has no equivalent prop. Lost in migration — you may need to handle equal-width tabs via auto-layout FILL on individual tab items, or accept the loss.

---

### Show Scroll Buttons

|               | JDS                           | OneUI                     |
| ------------- | ----------------------------- | ------------------------- |
| **Prop Name** | `showScrollButtons` (BOOLEAN) | _(Not exposed as a prop)_ |
| **Type**      | BOOLEAN                       | —                         |
| **Default**   | false                         | —                         |

> **Migration Note:** JDS Tabs can show scroll buttons (left/right arrows) for overflow tab navigation. OneUI TabGroup has no built-in scroll buttons. Lost in migration.

---

## Props Mapping — Tab Items (TabItem → `.Tab.Item`)

### Label Text

|               | JDS                                          | OneUI (`.Tab.Item` internal) |
| ------------- | -------------------------------------------- | ---------------------------- |
| **Prop Name** | Child Label component instance → `Text` prop | `label` (TEXT)               |
| **Type**      | Nested child TEXT (via Label component)      | TEXT                         |
| **Default**   | —                                            | "Label"                      |

#### Behavior Difference

- **JDS:** Tab label is a nested Label component instance inside ContentWrapper, with its own `Variant`, `Emphasis`, `Weight`, `Tinted` props.
- **OneUI:** Label is a simple `label` TEXT prop directly on the `.Tab.Item` internal component.

> **Migration Note:** Extract text from JDS TabItem's nested Label child → set on OneUI `.Tab.Item` `label` TEXT prop. Label typography props are lost — OneUI manages internally.

---

### Selected / Active

|               | JDS         | OneUI (`.Tab.Item` internal) |
| ------------- | ----------- | ---------------------------- |
| **Prop Name** | `Selected`  | `active`                     |
| **Type**      | VARIANT     | VARIANT                      |
| **Default**   | "true"      | "false"                      |
| **Options**   | true, false | false, true                  |

#### Value Mapping

| JDS `Selected` | OneUI `active` | Notes          |
| -------------- | -------------- | -------------- |
| true           | true           | Direct mapping |
| false          | false          | Direct mapping |

> **Important:** The **default value differs** — JDS defaults to `true` (selected), OneUI defaults to `false` (inactive). Always explicitly set `active` during migration.

---

### State

|               | JDS                          | OneUI (`.Tab.Item` internal) |
| ------------- | ---------------------------- | ---------------------------- |
| **Prop Name** | _(No state prop on TabItem)_ | _(internal state)_           |
| **Type**      | —                            | VARIANT                      |
| **Default**   | —                            | "idle"                       |
| **Options**   | —                            | idle, hover, pressed, focus  |

> **Migration Note:** OneUI exposes a full interaction state set (`idle`, `hover`, `pressed`, `focus`) on the internal `.Tab.Item`. JDS TabItem has no state variant — this is a net-new capability in OneUI. Default `idle` for all migrated instances.

---

### Start Icon

|            | JDS (TabItem / TabVerticalItem)         | OneUI (`.Tab.Item` internal)                                             |
| ---------- | --------------------------------------- | ------------------------------------------------------------------------ |
| **Toggle** | `Start` (BOOLEAN, default: false)       | `start` (VARIANT: none/S/M, default: none)                               |
| **Swap**   | _(Override nested Icon child instance)_ | `↳ start` (multiple INSTANCE_SWAP props for different size/state combos) |

#### Behavior Difference

- **JDS:** `Start` is a simple BOOLEAN toggle. The icon is a child Icon component instance (`Emphasis=High`, `Size=S`, `Tinted=False`) that you override by swapping the nested child.
- **OneUI:** `start` is a VARIANT prop controlling the slot size (`none`, `S`, `M`). Dedicated `↳ start` INSTANCE_SWAP props (many variants for different size/state combinations) let you set the icon content.

> **Migration Note:** Convert JDS BOOLEAN toggle (`Start = true`) → OneUI `start = S` (or `M` for larger icons). Then swap the icon content into the appropriate `↳ start` INSTANCE_SWAP prop.

---

### End Icon / Badge

|            | JDS (TabItem / TabVerticalItem)        | OneUI (`.Tab.Item` internal)             |
| ---------- | -------------------------------------- | ---------------------------------------- |
| **Toggle** | `End` (BOOLEAN, default: false)        | `end` (VARIANT: none/S/M, default: none) |
| **Swap**   | _(Override nested CounterBadge child)_ | `↳ end` (multiple INSTANCE_SWAP props)   |

#### Behavior Difference

- **JDS:** `End` toggles a CounterBadge component child (`Size=S`, `Emphasis=Medium`).
- **OneUI:** `end` is a generic sized slot (`none`, `S`, `M`) + INSTANCE_SWAP — can hold any component, not just badges.

> **Migration Note:** Convert JDS `End = true` → OneUI `end = S` + swap CounterBadge into `↳ end`. OneUI's slot is more flexible — it can hold any component, not just a badge.

---

### Size (Tab Item Level)

|               | JDS              | OneUI (`.Tab.Item` internal) |
| ------------- | ---------------- | ---------------------------- |
| **Prop Name** | _(No size prop)_ | `size`                       |
| **Type**      | —                | VARIANT                      |
| **Default**   | —                | "M"                          |
| **Options**   | —                | S, M, L                      |

> **Migration Note:** JDS TabItem has no size prop — size is fixed. OneUI's `.Tab.Item` has a size variant (`S`, `M`, `L`) that is typically inherited from the parent TabGroup's `size` prop.

---

## Full Props Comparison Table

| #   | Prop Concept          | JDS Prop                    | JDS Source          | JDS Type   | JDS Values  | JDS Default | OneUI Prop    | OneUI Source           | OneUI Type    | OneUI Values                | OneUI Default | Status                             |
| --- | --------------------- | --------------------------- | ------------------- | ---------- | ----------- | ----------- | ------------- | ---------------------- | ------------- | --------------------------- | ------------- | ---------------------------------- |
| 1   | Orientation           | _(separate components)_     | Tabs / TabsVertical | —          | —           | —           | `orientation` | TabGroup               | VARIANT       | horizontal, vertical        | horizontal    | ⚠️ Component merge                 |
| 2   | Container size        | _(N/A)_                     | —                   | —          | —           | —           | `size`        | TabGroup               | VARIANT       | S, M, L                     | M             | ❌ OneUI-only (new)                |
| 3   | Equal width           | `[equal width]`             | Tabs                | VARIANT    | False, True | False       | _(none)_      | —                      | —             | —                           | —             | ❌ JDS-only                        |
| 4   | Scroll buttons        | `showScrollButtons`         | Tabs                | BOOLEAN    | true, false | false       | _(none)_      | —                      | —             | —                           | —             | ❌ JDS-only                        |
| 5   | Tab items content     | _(direct TabItem children)_ | Tabs                | Children   | —           | —           | `↳ TabItems`  | TabGroup               | SLOT          | —                           | —             | ⚠️ Mechanism change                |
| 6   | Label text            | Child `Label` → `Text`      | TabItem             | Child TEXT | free text   | —           | `label`       | `.Tab.Item` (internal) | TEXT          | free text                   | "Label"       | ⚠️ Mechanism change                |
| 7   | Selected / Active     | `Selected`                  | TabItem             | VARIANT    | true, false | true        | `active`      | `.Tab.Item` (internal) | VARIANT       | false, true                 | false         | ✅ 1:1 (default differs)           |
| 8   | State                 | _(N/A)_                     | —                   | —          | —           | —           | _(internal)_  | `.Tab.Item` (internal) | VARIANT       | idle, hover, pressed, focus | idle          | ❌ OneUI-only (new)                |
| 9   | Start icon toggle     | `Start`                     | TabItem             | BOOLEAN    | true, false | false       | `start`       | `.Tab.Item` (internal) | VARIANT       | none, S, M                  | none          | ⚠️ Type change (BOOLEAN → VARIANT) |
| 10  | Start icon swap       | _(child override)_          | TabItem             | Child inst | —           | —           | `↳ start`     | `.Tab.Item` (internal) | INSTANCE_SWAP | component ref               | placeholder   | ⚠️ Mechanism change                |
| 11  | End icon/badge toggle | `End`                       | TabItem             | BOOLEAN    | true, false | false       | `end`         | `.Tab.Item` (internal) | VARIANT       | none, S, M                  | none          | ⚠️ Type change (BOOLEAN → VARIANT) |
| 12  | End icon/badge swap   | _(child override)_          | TabItem             | Child inst | —           | —           | `↳ end`       | `.Tab.Item` (internal) | INSTANCE_SWAP | component ref               | placeholder   | ⚠️ Mechanism change                |
| 13  | Item size             | _(N/A)_                     | —                   | —          | —           | —           | `size`        | `.Tab.Item` (internal) | VARIANT       | S, M, L                     | M             | ❌ OneUI-only (new)                |

---

## Key Architecture Differences

| Aspect                     | JDS                                                                               | OneUI                                                                                 |
| -------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Horizontal vs Vertical** | Separate component trees: Tabs + TabItem vs TabsVertical + TabVerticalItem        | Single TabGroup with `orientation` prop                                               |
| **Tab items**              | Published components (TabItem, TabVerticalItem) — directly usable and inspectable | Internal `.Tab.Item` via `.slot` wrappers in SLOT props — not independently published |
| **Item composition**       | Direct child instances inside TabsWrapper frame                                   | SLOT-based (`↳ TabItems` slots × 6 for different configurations)                      |
| **Scroll overflow**        | Built-in `showScrollButtons` with IconButton children                             | No built-in scroll mechanism                                                          |
| **Size control**           | No size variant on any component                                                  | 3 sizes (`S`, `M`, `L`) on both TabGroup and individual `.Tab.Item`                   |
| **Interaction states**     | No state props on tab items                                                       | Full state set (`idle`, `hover`, `pressed`, `focus`) on `.Tab.Item`                   |

---

## Migration Checklist

- [ ] Map JDS Tabs → OneUI TabGroup with `orientation = horizontal`
- [ ] Map JDS TabsVertical → OneUI TabGroup with `orientation = vertical`
- [ ] Set TabGroup `size` (recommended: `M` to match JDS default appearance)
- [ ] Migrate TabItem children → Populate OneUI `↳ TabItems` SLOT content:
  - [ ] For each JDS TabItem:
    - [ ] Extract label text from nested Label child → set on `.Tab.Item` `label`
    - [ ] Map `Selected` → `active` — **default differs** (`true` → `false`), always set explicitly
    - [ ] Map `Start` BOOLEAN → `start` VARIANT (`false` → `none`, `true` → `S` or `M`) + `↳ start` INSTANCE_SWAP
    - [ ] Map `End` BOOLEAN → `end` VARIANT (`false` → `none`, `true` → `S`) + `↳ end` INSTANCE_SWAP
- [ ] Handle `[equal width]` — lost in migration, no OneUI equivalent
- [ ] Handle `showScrollButtons` — lost in migration, no built-in scroll buttons
- [ ] Audit Label typography props (`Weight`, `Emphasis`, `Tinted`) — lost in migration
- [ ] Note: OneUI tab items are **not independently published** — they exist only within TabGroup's slot system

---

---
