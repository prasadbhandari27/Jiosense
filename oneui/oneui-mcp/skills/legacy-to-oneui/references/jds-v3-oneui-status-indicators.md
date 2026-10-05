---
name: jds-v3-oneui-status-indicators
description: >-
  JDS v3 (Jio Testlab Library) → OneUI migration mapping for badges, counters and progress indicators. Covers Badge, CounterBadge, IndicatorBadge, CircularProgressIndicator, LinearProgressIndicator, Spinner.
  Use when swapping or prop-mapping any of these components while converting a reference file to OneUI.
---

# Status and progress indicators — JDS v3 → OneUI migration

Part of the JDS v3 → OneUI migration skill set. For routing across all component behaviours, load
`get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-migration-figma-agent.md")`.

**Load this skill when migrating:** Badge, CounterBadge, IndicatorBadge, CircularProgressIndicator, LinearProgressIndicator, Spinner.

## Components in this skill

- **Badge family (Badge, CounterBadge, IndicatorBadge)** — search `Badge`
- **Progress indicators (Circular, Linear, Spinner)** — search `CircularProgressIndicator`

Jump straight to the component you need — each has its own Overview, Props Mapping, full comparison
table, and Migration Checklist. Do not invent prop names or variant values; use the tables below.

---

# Badge family (Badge, CounterBadge, IndicatorBadge)  ·  JDS v3 → OneUI

---

# 1. Component Family Overview

Both libraries share the same 3-component badge family, but with different prop structures:

| Component          | JDS (Jio Testlab Library)                      | OneUI                                                        |
| ------------------ | ---------------------------------------------- | ------------------------------------------------------------ |
| **Badge**          | Text label badge with optional start/end slots | Text label badge with start/end slot sizing + instance swaps |
| **CounterBadge**   | Numeric counter (circular)                     | Numeric counter (circular)                                   |
| **IndicatorBadge** | Dot indicator (no text)                        | Dot indicator (no text)                                      |

> **Good News:** All 3 JDS badge components have direct OneUI equivalents. No components lost, no new component types to learn. The migration is primarily about prop renaming and mechanism changes.

---

---

# 2. Badge → Badge

## Overview

|                         | JDS (Jio Testlab Library)                        | OneUI                                                |
| ----------------------- | ------------------------------------------------ | ---------------------------------------------------- |
| **Component Name**      | Badge                                            | Badge                                                |
| **Total Variants**      | 56 (7 sizes × 2 emphasis × 4 startSlot)          | 225 (5 sizes × 3 attention × 3 start × 3 end × text) |
| **Instances in Use**    | 398                                              | 541                                                  |
| **Page**                | Badge                                            | ↳ Badge                                              |
| **Child Instance Tags** | ContentSlot, EndSlot, Icon, Avatar, CounterBadge | start, end                                           |

---

## Props Mapping

### Label / Text

|               | JDS                                                | OneUI   |
| ------------- | -------------------------------------------------- | ------- |
| **Prop Name** | _(Child `ContentSlot` → nested `Label` component)_ | `Label` |
| **Type**      | Child override (nested Label)                      | TEXT    |
| **Default**   | _(via Label default)_                              | "Badge" |

#### Behavior Difference

- **JDS:** The badge label is set by overriding the nested `ContentSlot` → `Label` child component's `Text` prop. The Label component also carries typography props (`Variant`, `Weight`, etc.).
- **OneUI:** The label is a simple top-level `Label` TEXT prop directly on the Badge. Typography is handled internally based on size.

> **Migration Note:** Extract the text string from the JDS Badge's nested `Label` child and set it directly on the OneUI `Label` prop. Label typography props are no longer available — OneUI manages typography internally per size.

---

### Emphasis → Attention

|               | JDS        | OneUI       |
| ------------- | ---------- | ----------- |
| **Prop Name** | `Emphasis` | `attention` |
| **Type**      | VARIANT    | VARIANT     |
| **Default**   | "Medium"   | "high"      |

#### Value Mapping

| JDS `Emphasis` | OneUI `attention`            | Notes                |
| -------------- | ---------------------------- | -------------------- |
| High           | ❌ _(JDS Badge has no High)_ | —                    |
| Medium         | medium                       | Direct mapping       |
| Low            | low                          | Direct mapping       |
| _(N/A)_        | high                         | OneUI-only (default) |

> **⚠️ Important:** JDS Badge only has **2 emphasis levels** (Low, Medium) — no High. OneUI Badge has **3 attention levels** (low, medium, high) with `high` as the default. This means:
>
> - JDS `Medium` → OneUI `medium` _(NOT high — even though it was JDS's top tier)_
> - JDS `Low` → OneUI `low`
> - OneUI `high` is a **new, more prominent level** that didn't exist in JDS Badge
>
> **⚠️ Default shift:** JDS defaults to `Medium` (its top tier). OneUI defaults to `high` (a new, even higher tier). Migrated badges without explicit attention will appear **more prominent** than in JDS. Always set `attention` explicitly.

---

### Size

|               | JDS     | OneUI   |
| ------------- | ------- | ------- |
| **Prop Name** | `Size`  | `size`  |
| **Type**      | VARIANT | VARIANT |
| **Default**   | "M"     | "m"     |

#### Value Mapping

| JDS `Size` | OneUI `size`                       | Notes                             |
| ---------- | ---------------------------------- | --------------------------------- |
| 2XS        | ❌ _(no equivalent)_ — map to `xs` | Lossy                             |
| XS         | xs                                 | Direct mapping ✅                 |
| S          | s                                  | Direct mapping ✅                 |
| M          | m                                  | Direct mapping ✅ (both defaults) |
| L          | l                                  | Direct mapping ✅                 |
| XL         | xl                                 | Direct mapping ✅                 |
| 2XL        | ❌ _(no equivalent)_ — map to `xl` | Lossy                             |

> **Migration Note:** JDS has 7 sizes, OneUI has 5. Two extreme sizes (`2XS`, `2XL`) are lost. Most common sizes (XS–XL) map directly.

---

### Start Slot

|                 | JDS                                                                | OneUI                         |
| --------------- | ------------------------------------------------------------------ | ----------------------------- |
| **Toggle Prop** | `StartSlot` (VARIANT: None, Icon, Avatar, CounterBadge)            | `start` (VARIANT: none, S, M) |
| **Swap Prop**   | _(Override nested child directly — Icon, Avatar, or CounterBadge)_ | `↳start` (INSTANCE_SWAP)      |

#### Behavior Difference

- **JDS:** `StartSlot` is a VARIANT with 4 options that selects the **type** of start content (None, Icon, Avatar, CounterBadge). Each type shows a different nested child component that you override directly.
- **OneUI:** `start` is a VARIANT with 3 options that selects the **size** of the start slot (none, S, M). The actual content is set via the `↳start` INSTANCE_SWAP prop — you swap in whatever component you want (icon, avatar, counter badge, indicator badge, etc.).

| JDS `StartSlot` | OneUI `start`                    | OneUI `↳start`                      | Notes                            |
| --------------- | -------------------------------- | ----------------------------------- | -------------------------------- |
| None            | none                             | —                                   | Direct mapping                   |
| Icon            | S or M (pick size to match)      | Swap in Icon component              | Size-based instead of type-based |
| Avatar          | M (avatars are typically larger) | Swap in Avatar slot component       | Size-based instead of type-based |
| CounterBadge    | S or M (pick size to match)      | Swap in CounterBadge slot component | Size-based instead of type-based |

> **Migration Note:** This is a **significant mechanism change**. JDS uses content-type selection (Icon vs Avatar vs CounterBadge), while OneUI uses size-based slot selection (S vs M) + instance swap. The OneUI approach is more flexible — you can put ANY component in the start slot, not just the 3 predefined types. When migrating:
>
> 1. Set `start` to `S` or `M` based on the visual size needed
> 2. Swap `↳start` to the appropriate OneUI slot component (e.g., `Slot/size3/AvatarImage` for an avatar)

---

### End Slot

|                 | JDS                                        | OneUI                       |
| --------------- | ------------------------------------------ | --------------------------- |
| **Toggle Prop** | `EndSlot` (BOOLEAN, default: false)        | `end` (VARIANT: none, S, M) |
| **Swap Prop**   | _(Override nested EndSlot child directly)_ | `↳end` (INSTANCE_SWAP)      |

#### Behavior Difference

- **JDS:** `EndSlot` is a simple BOOLEAN toggle — `true` shows the end slot, `false` hides it. The content is whatever child component is placed in the EndSlot position.
- **OneUI:** `end` is a VARIANT with size options (none, S, M) — same pattern as start. A dedicated `↳end` INSTANCE_SWAP lets you swap the end content.

| JDS `EndSlot` | OneUI `end`        | Notes                      |
| ------------- | ------------------ | -------------------------- |
| false         | none               | Direct mapping             |
| true          | S or M (pick size) | Size-based + instance swap |

> **Migration Note:** Convert the JDS BOOLEAN toggle to a OneUI VARIANT size value. Then use `↳end` to swap in the appropriate content component.

---

## Full Props Comparison Table (Badge)

| #   | Prop Concept         | JDS Prop               | JDS Type       | JDS Values                       | JDS Default   | OneUI Prop  | OneUI Type    | OneUI Values          | OneUI Default | Status                           |
| --- | -------------------- | ---------------------- | -------------- | -------------------------------- | ------------- | ----------- | ------------- | --------------------- | ------------- | -------------------------------- |
| 1   | Label text           | Child `Label` override | Child TEXT     | free text                        | _(via Label)_ | `Label`     | TEXT          | free text             | "Badge"       | ⚠️ Mechanism change              |
| 2   | Emphasis / Attention | `Emphasis`             | VARIANT        | Low, Medium (2)                  | Medium        | `attention` | VARIANT       | high, medium, low (3) | high          | ⚠️ Values differ + default shift |
| 3   | Size                 | `Size`                 | VARIANT        | 2XS–2XL (7)                      | M             | `size`      | VARIANT       | xs–xl (5)             | m             | ⚠️ Partial (2 sizes lost)        |
| 4   | Start slot toggle    | `StartSlot`            | VARIANT        | None, Icon, Avatar, CounterBadge | None          | `start`     | VARIANT       | none, S, M            | none          | ⚠️ Type-based → Size-based       |
| 5   | Start slot content   | _(child override)_     | Child instance | —                                | —             | `↳start`    | INSTANCE_SWAP | component ref         | placeholder   | ⚠️ Mechanism change              |
| 6   | End slot toggle      | `EndSlot`              | BOOLEAN        | true/false                       | false         | `end`       | VARIANT       | none, S, M            | none          | ⚠️ BOOLEAN → VARIANT             |
| 7   | End slot content     | _(child override)_     | Child instance | —                                | —             | `↳end`      | INSTANCE_SWAP | component ref         | placeholder   | ⚠️ Mechanism change              |

---

## Migration Checklist (Badge)

- [ ] Extract label text from nested `Label` child → set on OneUI `Label` TEXT prop
- [ ] Map `Emphasis` → `attention` — **set explicitly!** (Medium→medium, Low→low) — default shifts to `high` which is NEW and more prominent
- [ ] Map `Size` (XS→xs, S→s, M→m, L→l, XL→xl) — flag `2XS` and `2XL` instances
- [ ] Convert `StartSlot` type-based selection → `start` size-based + `↳start` instance swap
- [ ] Convert `EndSlot` BOOLEAN → `end` VARIANT + `↳end` instance swap
- [ ] Audit all **398 JDS Badge instances** — high usage count

---

---

# 3. CounterBadge → CounterBadge

## Overview

|                         | JDS (Jio Testlab Library) | OneUI                      |
| ----------------------- | ------------------------- | -------------------------- |
| **Component Name**      | CounterBadge              | CounterBadge               |
| **Total Variants**      | 21 (7 sizes × 3 emphasis) | 15 (5 sizes × 3 attention) |
| **Instances in Use**    | 247                       | 0                          |
| **Page**                | CounterBadge              | ↳ Badge                    |
| **Child Instance Tags** | Number                    | _(none)_                   |

---

## Props Mapping

### Emphasis → Attention

|               | JDS        | OneUI       |
| ------------- | ---------- | ----------- |
| **Prop Name** | `Emphasis` | `attention` |
| **Type**      | VARIANT    | VARIANT     |
| **Default**   | "Medium"   | "high"      |

#### Value Mapping

| JDS `Emphasis` | OneUI `attention` | Notes             |
| -------------- | ----------------- | ----------------- |
| High           | high              | Direct mapping ✅ |
| Medium         | medium            | Direct mapping ✅ |
| Low            | low               | Direct mapping ✅ |

> **⚠️ Default shift:** JDS defaults to `Medium`, OneUI to `high`. Migrated counter badges will appear more prominent unless explicitly set. Note: unlike Badge (which has only Low/Medium), CounterBadge has all 3 levels in both libraries — the mapping is clean 1:1.

---

### Size

|               | JDS     | OneUI   |
| ------------- | ------- | ------- |
| **Prop Name** | `Size`  | `size`  |
| **Type**      | VARIANT | VARIANT |
| **Default**   | "M"     | "m"     |

#### Value Mapping

| JDS `Size` | OneUI `size`                       | Notes                             |
| ---------- | ---------------------------------- | --------------------------------- |
| 2XS        | ❌ _(no equivalent)_ — map to `xs` | Lossy                             |
| XS         | xs                                 | Direct mapping ✅                 |
| S          | s                                  | Direct mapping ✅                 |
| M          | m                                  | Direct mapping ✅ (both defaults) |
| L          | l                                  | Direct mapping ✅                 |
| XL         | xl                                 | Direct mapping ✅                 |
| 2XL        | ❌ _(no equivalent)_ — map to `xl` | Lossy                             |

> **Migration Note:** Same pattern as Badge — JDS has 7 sizes, OneUI has 5. Two extreme sizes lost.

---

### Counter Number

|               | JDS                                           | OneUI                               |
| ------------- | --------------------------------------------- | ----------------------------------- |
| **Mechanism** | Nested `Number` child (via `Label` component) | _(Internal — likely text override)_ |
| **Type**      | Child TEXT override                           | Internal                            |

> **Migration Note:** JDS uses a nested `Number` child (a `Label` component instance) to display the count. OneUI CounterBadge has no child instance tags — the number is likely handled internally. Set the count value by overriding the text layer inside the component.

---

## Full Props Comparison Table (CounterBadge)

| #   | Prop Concept         | JDS Prop                | JDS Type   | JDS Values        | JDS Default | OneUI Prop        | OneUI Type | OneUI Values      | OneUI Default | Status                    |
| --- | -------------------- | ----------------------- | ---------- | ----------------- | ----------- | ----------------- | ---------- | ----------------- | ------------- | ------------------------- |
| 1   | Size                 | `Size`                  | VARIANT    | 2XS–2XL (7)       | M           | `size`            | VARIANT    | xs–xl (5)         | m             | ⚠️ Partial (2 sizes lost) |
| 2   | Emphasis / Attention | `Emphasis`              | VARIANT    | High, Medium, Low | Medium      | `attention`       | VARIANT    | high, medium, low | high          | ✅ 1:1 (default differs)  |
| 3   | Counter number       | Child `Number` override | Child TEXT | numeric           | —           | _(internal text)_ | Internal   | numeric           | —             | ⚠️ Mechanism change       |

---

## Migration Checklist (CounterBadge)

- [ ] Map `Emphasis` → `attention` (High→high, Medium→medium, Low→low) — **set explicitly** (default shifts Medium → high)
- [ ] Map `Size` (XS→xs, S→s, M→m, L→l, XL→xl) — flag `2XS` and `2XL` instances
- [ ] Transfer counter number from nested `Number` child → internal text override in OneUI
- [ ] Audit all **247 JDS CounterBadge instances**

---

---

# 4. IndicatorBadge → IndicatorBadge

## Overview

|                         | JDS (Jio Testlab Library) | OneUI          |
| ----------------------- | ------------------------- | -------------- |
| **Component Name**      | IndicatorBadge            | IndicatorBadge |
| **Total Variants**      | 7 (7 sizes)               | 5 (5 sizes)    |
| **Instances in Use**    | 5                         | 0              |
| **Page**                | IndicatorBadge            | ↳ Badge        |
| **Child Instance Tags** | _(none)_                  | _(none)_       |

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
| 2XS        | ❌ _(no equivalent)_ — map to `xs` | Lossy                             |
| XS         | xs                                 | Direct mapping ✅                 |
| S          | s                                  | Direct mapping ✅                 |
| M          | m                                  | Direct mapping ✅ (both defaults) |
| L          | l                                  | Direct mapping ✅                 |
| XL         | xl                                 | Direct mapping ✅                 |
| 2XL        | ❌ _(no equivalent)_ — map to `xl` | Lossy                             |

---

## Full Props Comparison Table (IndicatorBadge)

| #   | Prop Concept | JDS Prop | JDS Type | JDS Values  | JDS Default | OneUI Prop | OneUI Type | OneUI Values | OneUI Default | Status                    |
| --- | ------------ | -------- | -------- | ----------- | ----------- | ---------- | ---------- | ------------ | ------------- | ------------------------- |
| 1   | Size         | `Size`   | VARIANT  | 2XS–2XL (7) | M           | `size`     | VARIANT    | xs–xl (5)    | m             | ⚠️ Partial (2 sizes lost) |

> **Note:** IndicatorBadge is the simplest component in the badge family — it's just a colored dot with a size prop. No emphasis/attention, no text, no slots. The only migration concern is the 2 lost extreme sizes.

---

## Migration Checklist (IndicatorBadge)

- [ ] Map `Size` (XS→xs, S→s, M→m, L→l, XL→xl) — flag `2XS` and `2XL` instances
- [ ] Audit all **5 JDS IndicatorBadge instances** (low count — quick migration)

---

---

# 5. OneUI Slot Library (Badge Slots)

OneUI provides pre-configured Badge and CounterBadge slot components for use inside other components:

### Badge Slots

| Slot Pattern               | Sizes         | Description                 |
| -------------------------- | ------------- | --------------------------- |
| `Slot/size{N}/BadgeHigh`   | 3, 4, 5, 6, 8 | Badge with high attention   |
| `Slot/size{N}/BadgeMedium` | 3, 4, 5, 6, 8 | Badge with medium attention |
| `Slot/size{N}/BadgeLow`    | 3, 4, 5, 6, 8 | Badge with low attention    |

### CounterBadge Slots

| Slot Pattern                      | Sizes      | Description                        |
| --------------------------------- | ---------- | ---------------------------------- |
| `Slot/size{N}/CounterBadgeHigh`   | 2, 3, 4, 5 | CounterBadge with high attention   |
| `Slot/size{N}/CounterBadgeMedium` | 2, 3, 4, 5 | CounterBadge with medium attention |
| `Slot/size{N}/CounterBadgeLow`    | 2, 3, 4, 5 | CounterBadge with low attention    |

### IndicatorBadge Slots

| Slot Pattern                  | Sizes           | Description                  |
| ----------------------------- | --------------- | ---------------------------- |
| `Slot/size{N}/IndicatorBadge` | 1, 1.5, 2, 3, 4 | IndicatorBadge at given size |

> **Design Tip:** When placing badges inside other OneUI components (list items, navigation, tabs, etc.), use these slot components for consistent sizing and styling. JDS has no equivalent slot system.

---

---

# 6. Complete Component Summary

| #   | Component          | JDS Instances | OneUI Instances | Size Mapping    | Emphasis/Attention Mapping          | Migration Risk                                         |
| --- | ------------------ | ------------- | --------------- | --------------- | ----------------------------------- | ------------------------------------------------------ |
| 1   | **Badge**          | 398           | 541             | ⚠️ 7→5 (2 lost) | ⚠️ 2→3 (new `high` + default shift) | **High** — slot mechanism change + high instance count |
| 2   | **CounterBadge**   | 247           | 0               | ⚠️ 7→5 (2 lost) | ✅ 3→3 (1:1, default shift only)    | **Medium** — clean mapping but high count              |
| 3   | **IndicatorBadge** | 5             | 0               | ⚠️ 7→5 (2 lost) | _(N/A — no emphasis)_               | **Low** — simple component, low count                  |

---

# 7. Recurring Patterns Across Badge Family

### Size: All 3 badge components share the same pattern

- JDS: 7 sizes (2XS, XS, S, M, L, XL, 2XL)
- OneUI: 5 sizes (xs, s, m, l, xl)
- Lost: `2XS` (→ `xs`) and `2XL` (→ `xl`)
- Default: M → m (matches)

### Emphasis → Attention: Consistent rename but different levels per component

| Component      | JDS Emphasis Levels          | OneUI Attention Levels           | Default Shift                 |
| -------------- | ---------------------------- | -------------------------------- | ----------------------------- |
| Badge          | Low, Medium (2 levels)       | low, medium, **high** (3 levels) | Medium → **high** (NEW level) |
| CounterBadge   | Low, Medium, High (3 levels) | low, medium, high (3 levels)     | Medium → high                 |
| IndicatorBadge | _(none)_                     | _(none)_                         | N/A                           |

---

# 8. Complete Migration Checklist

## Badge (398 instances — highest priority)

- [ ] Extract label from nested `Label` → set OneUI `Label` TEXT prop
- [ ] Map `Emphasis` → `attention` (Medium→medium, Low→low) — **default is now `high` (new level)**
- [ ] Map `Size` (XS→xs through XL→xl) — flag 2XS/2XL
- [ ] Convert `StartSlot` (type-based: None/Icon/Avatar/CounterBadge) → `start` (size-based: none/S/M) + `↳start` INSTANCE_SWAP
- [ ] Convert `EndSlot` BOOLEAN → `end` VARIANT (none/S/M) + `↳end` INSTANCE_SWAP
- [ ] For start slots with Avatar → use OneUI Avatar slot components (e.g., `Slot/size3/AvatarImage`)
- [ ] For start slots with CounterBadge → use OneUI CounterBadge slot components
- [ ] For start slots with Icon → swap in OneUI Icon component

## CounterBadge (247 instances)

- [ ] Map `Emphasis` → `attention` (High→high, Medium→medium, Low→low) — **set explicitly**
- [ ] Map `Size` — flag 2XS/2XL
- [ ] Transfer counter number from nested child to internal text

## IndicatorBadge (5 instances)

- [ ] Map `Size` — flag 2XS/2XL
- [ ] Quick migration — only 5 instances

## Total Instances to Migrate

- [ ] **650 total** (398 Badge + 247 CounterBadge + 5 IndicatorBadge)

---

---

# Progress indicators (Circular, Linear, Spinner)  ·  JDS v3 → OneUI

---

# 1. Component Family Overview

Both libraries share the same 3-component progress indicator family:

| Component                     | JDS (Jio Testlab Library) | OneUI | Purpose                                                   |
| ----------------------------- | ------------------------- | ----- | --------------------------------------------------------- |
| **CircularProgressIndicator** | ✅                        | ✅    | Circular ring showing determinate/indeterminate progress  |
| **LinearProgressIndicator**   | ✅                        | ✅    | Horizontal bar showing determinate/indeterminate progress |
| **Spinner**                   | ✅                        | ✅    | Indeterminate loading spinner (rotating animation)        |

> **Good News:** All 3 components exist in both libraries — no components lost, none new. The migration is about prop renaming, size scale changes, and some feature additions in OneUI.

---

---

# 2. CircularProgressIndicator → CircularProgressIndicator

## Overview

|                         | JDS (Jio Testlab Library) | OneUI                       |
| ----------------------- | ------------------------- | --------------------------- |
| **Component Name**      | CircularProgressIndicator | CircularProgressIndicator   |
| **Total Variants**      | 5 (5 sizes)               | 20 (10 sizes × 2 variant)   |
| **Instances in Use**    | 100                       | 64                          |
| **Page**                | CircularProgressIndicator | ↳ CircularProgressIndicator |
| **Child Instance Tags** | Label                     | Icon                        |

---

## Props Mapping

### Size

|               | JDS     | OneUI   |
| ------------- | ------- | ------- |
| **Prop Name** | `Size`  | `size`  |
| **Type**      | VARIANT | VARIANT |
| **Default**   | "M"     | "m"     |

#### Value Mapping

| JDS `Size`           | OneUI `size` | Notes                             |
| -------------------- | ------------ | --------------------------------- |
| ❌ _(no equivalent)_ | 2xs          | OneUI-only (new)                  |
| XS                   | xs           | Direct mapping ✅                 |
| S                    | s            | Direct mapping ✅                 |
| M                    | m            | Direct mapping ✅ (both defaults) |
| L                    | l            | Direct mapping ✅                 |
| XL                   | xl           | Direct mapping ✅                 |
| ❌ _(no equivalent)_ | 2xl          | OneUI-only (new)                  |
| ❌ _(no equivalent)_ | 3xl          | OneUI-only (new)                  |
| ❌ _(no equivalent)_ | 4xl          | OneUI-only (new)                  |
| ❌ _(no equivalent)_ | 5XL          | OneUI-only (new)                  |

> **Migration Note:** All 5 JDS sizes map directly — **no sizes lost!** OneUI adds 5 extra sizes (2xs, 2xl, 3xl, 4xl, 5XL) for larger display contexts like full-page loading states or dashboard widgets.

---

### Variant (Determinate / Indeterminate)

|               | JDS                               | OneUI                      |
| ------------- | --------------------------------- | -------------------------- |
| **Prop Name** | _(Not exposed as a variant prop)_ | `variant`                  |
| **Type**      | —                                 | VARIANT                    |
| **Default**   | —                                 | "determinate"              |
| **Options**   | —                                 | determinate, indeterminate |

> **Migration Note:** JDS CircularProgressIndicator does not expose a determinate/indeterminate variant prop — it appears to be a single visual state (likely always shows a progress arc). OneUI explicitly separates these:
>
> - `determinate` — shows a partial arc representing exact progress (e.g., 45% complete)
> - `indeterminate` — shows an animated spinning arc for unknown duration
>
> When migrating, choose the variant based on the design context:
>
> - If the JDS usage shows a specific percentage → `determinate`
> - If the JDS usage shows a continuous loading animation → `indeterminate`

---

### Slot Content / Center Content

|             | JDS                                   | OneUI                                                                |
| ----------- | ------------------------------------- | -------------------------------------------------------------------- |
| **Toggle**  | `Show Slot` (BOOLEAN, default: false) | `label` (BOOLEAN, default: false) + `icon` (BOOLEAN, default: false) |
| **Content** | `↳ Slot Content` (INSTANCE_SWAP)      | _(internal label text + Icon child)_                                 |

#### Behavior Difference

- **JDS:** Uses a generic slot approach — `Show Slot` toggles visibility, and `↳ Slot Content` lets you swap in any component (defaults to a Label). This means you can put text, icons, or any custom content in the center of the circular progress.
- **OneUI:** Separates center content into two explicit toggles:
  - `label` (BOOLEAN) — shows/hides a text label (typically percentage like "45%")
  - `icon` (BOOLEAN) — shows/hides an icon in the center

  These are more structured but less flexible than JDS's generic slot approach.

| JDS Configuration                    | OneUI Configuration           | Notes                                                    |
| ------------------------------------ | ----------------------------- | -------------------------------------------------------- |
| `Show Slot: false`                   | `label: false`, `icon: false` | No center content — direct match                         |
| `Show Slot: true` + Label in slot    | `label: true`                 | Text label in center                                     |
| `Show Slot: true` + Icon in slot     | `icon: true`                  | Icon in center                                           |
| `Show Slot: true` + Custom component | ⚠️ No direct equivalent       | OneUI only supports label OR icon, not arbitrary content |

> **Migration Note:** If your JDS designs use the `↳ Slot Content` instance swap with standard Label text (percentage), set `label: true` in OneUI. If using an icon, set `icon: true`. If using custom/non-standard content in the slot, you'll need to adapt the design or use a manual override.

---

## Full Props Comparison Table (CircularProgressIndicator)

| #   | Prop Concept        | JDS Prop         | JDS Type      | JDS Values    | JDS Default | OneUI Prop       | OneUI Type | OneUI Values               | OneUI Default | Status                          |
| --- | ------------------- | ---------------- | ------------- | ------------- | ----------- | ---------------- | ---------- | -------------------------- | ------------- | ------------------------------- |
| 1   | Size                | `Size`           | VARIANT       | XS–XL (5)     | M           | `size`           | VARIANT    | 2xs–5XL (10)               | m             | ✅ All 5 map + 5 new            |
| 2   | Variant             | _(none)_         | —             | —             | —           | `variant`        | VARIANT    | determinate, indeterminate | determinate   | ❌ OneUI-only (new)             |
| 3   | Show center content | `Show Slot`      | BOOLEAN       | true/false    | false       | `label` / `icon` | BOOLEAN    | true/false                 | false         | ⚠️ Generic slot → split toggles |
| 4   | Center content      | `↳ Slot Content` | INSTANCE_SWAP | any component | Label       | _(internal)_     | —          | —                          | —             | ⚠️ Mechanism change             |

---

## Migration Checklist (CircularProgressIndicator)

- [ ] Map `Size` (XS→xs, S→s, M→m, L→l, XL→xl) — **all sizes map directly, no losses!**
- [ ] Set `variant` based on usage context — `determinate` for percentage progress, `indeterminate` for loading animations
- [ ] Convert `Show Slot` + `↳ Slot Content`:
  - Label/percentage text → set `label: true`
  - Icon in center → set `icon: true`
  - Custom content → manual adaptation needed
- [ ] Audit all **100 JDS instances**

---

---

# 3. LinearProgressIndicator → LinearProgressIndicator

## Overview

|                         | JDS (Jio Testlab Library) | OneUI                                 |
| ----------------------- | ------------------------- | ------------------------------------- |
| **Component Name**      | LinearProgressIndicator   | LinearProgressIndicator               |
| **Total Variants**      | 10 (5 sizes × 2 variant)  | 12 (3 sizes × 2 type × 2 roundedCaps) |
| **Instances in Use**    | 85                        | 0                                     |
| **Page**                | LinearProgressIndicator   | ↳ LinearProgressIndicator             |
| **Child Instance Tags** | _(none)_                  | .progressIndicator                    |

---

## Props Mapping

### Size

|               | JDS     | OneUI   |
| ------------- | ------- | ------- |
| **Prop Name** | `Size`  | `size`  |
| **Type**      | VARIANT | VARIANT |
| **Default**   | "M"     | "S"     |

#### Value Mapping

| JDS `Size` | OneUI `size`                      | Notes                      |
| ---------- | --------------------------------- | -------------------------- |
| XS         | ❌ _(no equivalent)_ — map to `S` | Lossy — OneUI minimum is S |
| S          | S                                 | Direct mapping ✅          |
| M          | M                                 | Direct mapping ✅          |
| L          | L                                 | Direct mapping ✅          |
| XL         | ❌ _(no equivalent)_ — map to `L` | Lossy — OneUI maximum is L |

> **⚠️ Default shift:** JDS defaults to `M`, OneUI defaults to `S`. Migrated linear progress bars will appear **thinner** unless you explicitly set `size = M`.
>
> **Migration Note:** JDS has 5 sizes, OneUI has 3. Two sizes lost (`XS` → `S`, `XL` → `L`). Note that OneUI uses **uppercase** size values (S, M, L) unlike most other OneUI components that use lowercase.

---

### Variant / Type (Determinate / Indeterminate)

|               | JDS           | OneUI         |
| ------------- | ------------- | ------------- |
| **Prop Name** | `Variant`     | `type`        |
| **Type**      | VARIANT       | VARIANT       |
| **Default**   | "Determinate" | "determinate" |

#### Value Mapping

| JDS `Variant` | OneUI `type`  | Notes                             |
| ------------- | ------------- | --------------------------------- |
| Determinate   | determinate   | Direct mapping ✅ (both defaults) |
| Indeterminate | indeterminate | Direct mapping ✅                 |

| **Mapping** | ✅ Direct 1:1 mapping | Rename only: `Variant` → `type`, casing change |

---

### Rounded Caps

|               | JDS             | OneUI         |
| ------------- | --------------- | ------------- |
| **Prop Name** | _(Not exposed)_ | `roundedCaps` |
| **Type**      | —               | VARIANT       |
| **Default**   | —               | "true"        |
| **Options**   | —               | true, false   |

> **Migration Note:** OneUI adds a `roundedCaps` toggle that controls whether the progress bar ends are rounded or square. JDS has no equivalent — the bar end style is fixed. Set `roundedCaps = true` (default) to get standard rounded appearance, or `false` for sharp-edged progress bars.

---

## Full Props Comparison Table (LinearProgressIndicator)

| #   | Prop Concept   | JDS Prop  | JDS Type | JDS Values                 | JDS Default | OneUI Prop    | OneUI Type | OneUI Values               | OneUI Default | Status                              |
| --- | -------------- | --------- | -------- | -------------------------- | ----------- | ------------- | ---------- | -------------------------- | ------------- | ----------------------------------- |
| 1   | Size           | `Size`    | VARIANT  | XS–XL (5)                  | M           | `size`        | VARIANT    | S, M, L (3)                | S             | ⚠️ Partial (2 lost) + default shift |
| 2   | Variant / Type | `Variant` | VARIANT  | Determinate, Indeterminate | Determinate | `type`        | VARIANT    | determinate, indeterminate | determinate   | ✅ 1:1 (rename only)                |
| 3   | Rounded caps   | _(none)_  | —        | —                          | —           | `roundedCaps` | VARIANT    | true, false                | true          | ❌ OneUI-only (new)                 |

---

## Migration Checklist (LinearProgressIndicator)

- [ ] Map `Size` (S→S, M→M, L→L) — **flag XS and XL instances** for manual decision
- [ ] **Set `size` explicitly** — default shifts from M to S (bars will appear thinner)
- [ ] Map `Variant` → `type` (Determinate→determinate, Indeterminate→indeterminate) — direct rename
- [ ] Set `roundedCaps = true` (default) unless square edges are desired
- [ ] Audit all **85 JDS instances**

---

---

# 4. Spinner → Spinner

## Overview

|                         | JDS (Jio Testlab Library) | OneUI         |
| ----------------------- | ------------------------- | ------------- |
| **Component Name**      | Spinner                   | Spinner       |
| **Total Variants**      | 5 (5 sizes × 1 emphasis)  | 10 (10 sizes) |
| **Instances in Use**    | 0                         | 0             |
| **Page**                | Spinner                   | ↳ Spinner     |
| **Child Instance Tags** | CircularProgress/Label    | Icon          |

---

## Props Mapping

### Size

|               | JDS     | OneUI   |
| ------------- | ------- | ------- |
| **Prop Name** | `Size`  | `size`  |
| **Type**      | VARIANT | VARIANT |
| **Default**   | "M"     | "m"     |

#### Value Mapping

| JDS `Size`           | OneUI `size` | Notes                             |
| -------------------- | ------------ | --------------------------------- |
| ❌ _(no equivalent)_ | 2xs          | OneUI-only (new)                  |
| XS                   | xs           | Direct mapping ✅                 |
| S                    | s            | Direct mapping ✅                 |
| M                    | m            | Direct mapping ✅ (both defaults) |
| L                    | l            | Direct mapping ✅                 |
| XL                   | xl           | Direct mapping ✅                 |
| ❌ _(no equivalent)_ | 2xl          | OneUI-only (new)                  |
| ❌ _(no equivalent)_ | 3xl          | OneUI-only (new)                  |
| ❌ _(no equivalent)_ | 4xl          | OneUI-only (new)                  |
| ❌ _(no equivalent)_ | 5xl          | OneUI-only (new)                  |

> **Migration Note:** Same size scale as CircularProgressIndicator — all 5 JDS sizes map directly, and OneUI adds 5 larger sizes for full-page or section-level loading spinners. **No sizes lost!**

---

### Emphasis

|               | JDS                      | OneUI           |
| ------------- | ------------------------ | --------------- |
| **Prop Name** | `Emphasis`               | _(Not exposed)_ |
| **Type**      | VARIANT                  | —               |
| **Default**   | "Medium"                 | —               |
| **Options**   | "Medium" (only 1 option) | —               |

> **Migration Note:** JDS Spinner has an `Emphasis` prop but with only **one option** ("Medium") — effectively it's a no-op/placeholder prop. OneUI Spinner has no emphasis/attention prop. No migration action needed since there's nothing to vary.

---

## Relationship Between Spinner and CircularProgressIndicator

| Concept            | Spinner                                                                           | CircularProgressIndicator                                                 |
| ------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Purpose**        | Always indeterminate — continuous rotation animation for unknown-duration loading | Can be determinate (show percentage) or indeterminate (loading animation) |
| **Center content** | No label/icon support                                                             | Label and icon toggles for center content                                 |
| **When to use**    | Simple loading state with no progress info                                        | When you need to show progress percentage or need center content          |

> **Design Tip:** If your JDS designs use `CircularProgressIndicator` purely as an indeterminate loading spinner (no percentage, no slot content), consider whether `Spinner` is a better fit in OneUI — it's simpler and lighter. Use `CircularProgressIndicator` with `variant: indeterminate` only if you need the label/icon center content options.

---

## Full Props Comparison Table (Spinner)

| #   | Prop Concept | JDS Prop   | JDS Type | JDS Values        | JDS Default | OneUI Prop | OneUI Type | OneUI Values | OneUI Default | Status                             |
| --- | ------------ | ---------- | -------- | ----------------- | ----------- | ---------- | ---------- | ------------ | ------------- | ---------------------------------- |
| 1   | Size         | `Size`     | VARIANT  | XS–XL (5)         | M           | `size`     | VARIANT    | 2xs–5xl (10) | m             | ✅ All 5 map + 5 new               |
| 2   | Emphasis     | `Emphasis` | VARIANT  | Medium (1 option) | Medium      | _(none)_   | —          | —            | —             | ❌ JDS-only (no-op — only 1 value) |

---

## Migration Checklist (Spinner)

- [ ] Map `Size` (XS→xs, S→s, M→m, L→l, XL→xl) — **all sizes map directly, no losses!**
- [ ] Ignore `Emphasis` — it has only 1 value ("Medium") in JDS, so nothing to migrate
- [ ] Audit all **0 JDS Spinner instances** — no instances to migrate (component exists but unused in JDS)

---

---

# 5. OneUI Slot Library (Progress Indicator Slots)

OneUI provides pre-configured CircularProgressIndicator slot components:

| Slot Pattern                                    | Sizes            | Description                                   |
| ----------------------------------------------- | ---------------- | --------------------------------------------- |
| `Slot/size{N}/CircularProgressBarDeterminate`   | 2, 3, 4, 5, 6, 8 | Determinate circular progress at given size   |
| `Slot/size{N}/CircularProgressBarIndeterminate` | 2, 3, 4, 5, 6, 8 | Indeterminate circular progress at given size |

> **Design Tip:** Use these slot components when placing progress indicators inside other OneUI components (buttons, cards, list items, etc.). The `CircularProgressIndicator` used inside OneUI `Button` for loading states comes from this slot system. JDS has no equivalent slot system.

---

---

# 6. Complete Component Summary

| #   | Component                     | JDS Instances | OneUI Instances | Size Mapping                    | Key Differences                                                     |
| --- | ----------------------------- | ------------- | --------------- | ------------------------------- | ------------------------------------------------------------------- |
| 1   | **CircularProgressIndicator** | 100           | 64              | ✅ 5→10 (all map + 5 new)       | OneUI adds `variant` (det/indet), splits slot into `label` + `icon` |
| 2   | **LinearProgressIndicator**   | 85            | 0               | ⚠️ 5→3 (2 lost) + default shift | OneUI adds `roundedCaps`; `Variant` renamed to `type`               |
| 3   | **Spinner**                   | 0             | 0               | ✅ 5→10 (all map + 5 new)       | JDS `Emphasis` dropped (was no-op); simplest migration              |

---

# 7. Recurring Patterns

### Size Scales

| Component                 | JDS Sizes           | OneUI Sizes  | Sizes Lost | Sizes Gained                 |
| ------------------------- | ------------------- | ------------ | ---------- | ---------------------------- |
| CircularProgressIndicator | XS, S, M, L, XL (5) | 2xs–5XL (10) | None ✅    | +5 (2xs, 2xl, 3xl, 4xl, 5XL) |
| LinearProgressIndicator   | XS, S, M, L, XL (5) | S, M, L (3)  | 2 (XS, XL) | None                         |
| Spinner                   | XS, S, M, L, XL (5) | 2xs–5xl (10) | None ✅    | +5 (2xs, 2xl, 3xl, 4xl, 5xl) |

> **Pattern:** Circular components (CircularProgressIndicator, Spinner) get expanded to 10 sizes. LinearProgressIndicator gets reduced to 3 sizes — reflecting that bar height variation is less common than circular diameter variation.

### Determinate / Indeterminate

| Component                 | JDS Prop                 | OneUI Prop               | JDS Values                 | OneUI Values               |
| ------------------------- | ------------------------ | ------------------------ | -------------------------- | -------------------------- |
| CircularProgressIndicator | _(none)_                 | `variant`                | —                          | determinate, indeterminate |
| LinearProgressIndicator   | `Variant`                | `type`                   | Determinate, Indeterminate | determinate, indeterminate |
| Spinner                   | _(always indeterminate)_ | _(always indeterminate)_ | —                          | —                          |

---

# 8. Complete Migration Checklist

## CircularProgressIndicator (100 instances)

- [ ] Map `Size` (XS→xs, S→s, M→m, L→l, XL→xl) — all map directly
- [ ] Set `variant` — `determinate` for percentage progress, `indeterminate` for loading
- [ ] Convert `Show Slot` + `↳ Slot Content` → `label: true` (for text) or `icon: true` (for icon)
- [ ] Flag any instances using custom slot content (not standard Label/Icon)

## LinearProgressIndicator (85 instances)

- [ ] Map `Size` (S→S, M→M, L→L) — **flag XS and XL instances**
- [ ] **Set `size` explicitly** — default shifts M → S
- [ ] Map `Variant` → `type` (rename only)
- [ ] Set `roundedCaps = true` (default) unless design requires square edges

## Spinner (0 instances — no migration needed)

- [ ] No instances to migrate
- [ ] Map `Size` if instances are added in the future

## Total Instances to Migrate

- [ ] **185 total** (100 CircularProgressIndicator + 85 LinearProgressIndicator + 0 Spinner)

---
