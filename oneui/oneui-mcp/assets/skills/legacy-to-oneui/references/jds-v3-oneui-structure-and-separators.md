---
name: jds-v3-oneui-structure-and-separators
description: >-
  JDS v3 (Jio Testlab Library) → OneUI migration mapping for breadcrumbs, dividers and scrims. Covers Breadcrumbs, Breadcrumb, BreadcrumbItem, Divider, Scrim, Overlay.
  Use when swapping or prop-mapping any of these components while converting a reference file to OneUI.
---

# Structure, separators and layering — JDS v3 → OneUI migration

Part of the JDS v3 → OneUI migration skill set. For routing across all component behaviours, load
`get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-migration-figma-agent.md")`.

**Load this skill when migrating:** Breadcrumbs, Breadcrumb, BreadcrumbItem, Divider, Scrim, Overlay.

## Components in this skill

- **Breadcrumbs / Breadcrumb** — search `Breadcrumbs`
- **Divider** — search `Divider`
- **Scrim (JDS Overlay)** — search `Scrim`

Jump straight to the component you need — each has its own Overview, Props Mapping, full comparison
table, and Migration Checklist. Do not invent prop names or variant values; use the tables below.

---

# Breadcrumbs / Breadcrumb  ·  JDS v3 → OneUI

---

# 1. Architecture Difference

## JDS (Jio Testlab Library) — 3-component structure

| Component                | Type                           | Description                                                        |
| ------------------------ | ------------------------------ | ------------------------------------------------------------------ |
| **Breadcrumbs**          | Single COMPONENT (no variants) | Main container with separator icons between items                  |
| **Breadcrumbs Semantic** | Single COMPONENT (no variants) | Alternative container using semantic icons (from external library) |
| **BreadcrumbItem**       | COMPONENT_SET (with variants)  | Individual breadcrumb link with state control                      |

## OneUI — 1-component structure (with slots)

| Component      | Type                          | Description                                                             |
| -------------- | ----------------------------- | ----------------------------------------------------------------------- |
| **Breadcrumb** | COMPONENT_SET (with variants) | Single component with size, homeAsIcon, overflow props + SLOT for items |

> **Key Difference:** JDS splits breadcrumbs into 3 components (including a semantic variant and a separate item component). OneUI consolidates everything into **one component** with a `breadcrumb.items` SLOT for adding items. This is a significant simplification — and a different composition model. JDS uses explicit `BreadcrumbItem` children you place manually; OneUI uses a SLOT that you fill with content.

---

## Naming Difference

|          | JDS                      | OneUI                 |
| -------- | ------------------------ | --------------------- |
| **Name** | Breadcrumb**s** (plural) | Breadcrumb (singular) |
| **Page** | Breadcrumbs              | ↳ Breadcrumbs         |

> **Note:** JDS uses the plural "Breadcrumbs", OneUI uses singular "Breadcrumb". Be aware of this when searching for the component in the assets panel.

---

---

# 2. Breadcrumbs → Breadcrumb

## Overview

|                         | JDS (Jio Testlab Library)      | OneUI                                   |
| ----------------------- | ------------------------------ | --------------------------------------- |
| **Component Name**      | Breadcrumbs                    | Breadcrumb                              |
| **Type**                | Single COMPONENT (no variants) | COMPONENT_SET (with variants)           |
| **Total Variants**      | 1 (no variant props)           | 8 (2 sizes × 2 homeAsIcon × 2 overflow) |
| **Instances in Use**    | 21                             | 1                                       |
| **Page**                | Breadcrumbs                    | ↳ Breadcrumbs                           |
| **Child Instance Tags** | BreadcrumbItem, Icon           | .Slot/S, .Slot/M                        |

---

## Props Mapping

### Size

|               | JDS                          | OneUI   |
| ------------- | ---------------------------- | ------- |
| **Prop Name** | _(Not exposed — fixed size)_ | `size`  |
| **Type**      | —                            | VARIANT |
| **Default**   | —                            | "s"     |
| **Options**   | —                            | s, m    |

> **Migration Note:** JDS `Breadcrumbs` has **no size prop** — it's a single fixed-size component. OneUI offers two sizes: `s` (small, default) and `m` (medium). When migrating:
>
> - Visually compare the JDS breadcrumb size against OneUI `s` and `m`
> - Choose the OneUI size that best matches the JDS visual appearance
> - `s` (default) is likely the closer match for most JDS breadcrumb usages

---

### Home As Icon

|               | JDS                                | OneUI        |
| ------------- | ---------------------------------- | ------------ |
| **Prop Name** | _(Not a prop — manual Icon child)_ | `homeAsIcon` |
| **Type**      | —                                  | VARIANT      |
| **Default**   | —                                  | "false"      |
| **Options**   | —                                  | false, true  |

> **Migration Note:** JDS handles the home breadcrumb item the same as any other `BreadcrumbItem` — if a home icon is used, it's set via the nested `Icon` child override on the first item. OneUI has a dedicated `homeAsIcon` toggle that, when `true`, renders the first breadcrumb item as a home icon instead of text. This is a cleaner approach:
>
> - If JDS breadcrumb starts with a home icon → set `homeAsIcon: true`
> - If JDS breadcrumb starts with text like "Home" → keep `homeAsIcon: false` (default)

---

### Overflow / Truncation

|               | JDS               | OneUI       |
| ------------- | ----------------- | ----------- |
| **Prop Name** | _(Not supported)_ | `overflow`  |
| **Type**      | —                 | VARIANT     |
| **Default**   | —                 | "false"     |
| **Options**   | —                 | false, true |

> **Migration Note:** JDS `Breadcrumbs` has no overflow/truncation handling — all items are always visible. OneUI's `overflow: true` collapses middle items into an ellipsis ("...") menu when the breadcrumb path is long. This is a common UX pattern for deep navigation hierarchies.
>
> - For short breadcrumb paths (2-4 items): keep `overflow: false` (default)
> - For deep breadcrumb paths or responsive designs: consider enabling `overflow: true`

---

### Breadcrumb Items (Slot)

|                    | JDS                                                                                | OneUI                                                                |
| ------------------ | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **Mechanism**      | Manually place `BreadcrumbItem` instances as children + `Icon` separator instances | `breadcrumb.items` SLOT prop                                         |
| **Type**           | Child instances                                                                    | SLOT                                                                 |
| **Item Component** | `BreadcrumbItem` (public, with State variants)                                     | _(Items placed inside slot — no dedicated published item component)_ |
| **Separator**      | Explicit `Icon` child instances between items                                      | Handled internally by the component                                  |

#### Behavior Difference

- **JDS:** You manually place `BreadcrumbItem` instances and `Icon` separator instances as children of the `Breadcrumbs` frame. Each `BreadcrumbItem` has its own `State` variant (Idle, Hover, Current). You control the number of items by adding/removing children. Separators must be placed manually between each item.
- **OneUI:** The `breadcrumb.items` SLOT accepts content directly. Separators are handled internally by the component — you don't need to add them. Items are placed into the slot, and the component manages spacing and separators automatically.

> **Design Tip for Migration:** When recreating a JDS breadcrumb in OneUI:
>
> 1. Drop a `Breadcrumb` component onto the canvas
> 2. Fill the `breadcrumb.items` slot with text links matching the JDS breadcrumb labels
> 3. Set `size` to match visual appearance
> 4. Enable `homeAsIcon` if the first item was a home icon in JDS
> 5. Don't worry about separators — OneUI handles them automatically

---

## Full Props Comparison Table (Breadcrumbs → Breadcrumb)

| #   | Prop Concept | JDS Prop                           | JDS Type        | JDS Values | JDS Default | OneUI Prop         | OneUI Type | OneUI Values | OneUI Default | Status                           |
| --- | ------------ | ---------------------------------- | --------------- | ---------- | ----------- | ------------------ | ---------- | ------------ | ------------- | -------------------------------- |
| 1   | Size         | _(none — fixed)_                   | —               | —          | —           | `size`             | VARIANT    | s, m         | s             | ❌ OneUI-only (new)              |
| 2   | Home as icon | _(manual child override)_          | —               | —          | —           | `homeAsIcon`       | VARIANT    | false, true  | false         | ❌ OneUI-only (new — was manual) |
| 3   | Overflow     | _(none)_                           | —               | —          | —           | `overflow`         | VARIANT    | false, true  | false         | ❌ OneUI-only (new)              |
| 4   | Items        | _(manual BreadcrumbItem children)_ | Child instances | —          | —           | `breadcrumb.items` | SLOT       | slot content | —             | ⚠️ Mechanism change              |

---

---

# 3. Breadcrumbs Semantic → _(No OneUI Equivalent)_

## Overview

|                         | JDS (Jio Testlab Library)                                                                                          | OneUI                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------- |
| **Component Name**      | Breadcrumbs Semantic                                                                                               | _(No separate equivalent)_ |
| **Type**                | Single COMPONENT (no variants)                                                                                     | —                          |
| **Instances in Use**    | 12                                                                                                                 | —                          |
| **Page**                | Breadcrumbs                                                                                                        | —                          |
| **Child Instance Tags** | BreadcrumbItem, Icon Semantic                                                                                      | —                          |
| **Description**         | Variant of Breadcrumbs that uses `Icon Semantic` (from external library) instead of standard `Icon` for separators | —                          |

> **Migration Note:** JDS has two breadcrumb containers — `Breadcrumbs` (uses standard `Icon`) and `Breadcrumbs Semantic` (uses `Icon Semantic` from an external library for separators). The difference is purely in the separator icon source. OneUI has just one `Breadcrumb` component that handles separators internally — there's no need for a semantic variant. Migrate both JDS variants to the same OneUI `Breadcrumb` component.

#### Design Tip

When migrating the 12 `Breadcrumbs Semantic` instances:

- Use the same OneUI `Breadcrumb` component as regular breadcrumbs
- The separator style is controlled internally by OneUI — no separate icon library needed
- Focus on migrating the breadcrumb item labels and structure, not the separator icons

---

---

# 4. BreadcrumbItem → _(Subsumed by Breadcrumb Slot)_

## Overview

|                         | JDS (Jio Testlab Library)                             | OneUI                                |
| ----------------------- | ----------------------------------------------------- | ------------------------------------ |
| **Component Name**      | BreadcrumbItem                                        | _(No dedicated published component)_ |
| **Type**                | COMPONENT_SET (with variants)                         | —                                    |
| **Total Variants**      | 3 (3 states)                                          | —                                    |
| **Instances in Use**    | 0 (used only inside Breadcrumbs/Breadcrumbs Semantic) | —                                    |
| **Page**                | Breadcrumbs                                           | —                                    |
| **Child Instance Tags** | Label, Stroke Line                                    | —                                    |

---

## JDS BreadcrumbItem Props

### State

|                 | JDS                                              |
| --------------- | ------------------------------------------------ |
| **Prop Name**   | `State`                                          |
| **Type**        | VARIANT                                          |
| **Options**     | Idle, Hover, Current                             |
| **Default**     | "Idle"                                           |
| **Description** | Controls the visual state of the breadcrumb item |

#### State Descriptions

| State       | Visual Behavior                                                  | Migration Impact                                                                                 |
| ----------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Idle**    | Default clickable link appearance                                | OneUI handles internally — the slot item renders as a link                                       |
| **Hover**   | Hovered link appearance (likely underline/color change)          | OneUI handles internally via prototyping/interactions                                            |
| **Current** | Current/active page — typically non-clickable, different styling | OneUI handles internally — the last item in the breadcrumb typically renders as the current page |

> **Migration Note:** JDS `BreadcrumbItem` gives you explicit control over each item's state (Idle, Hover, Current). In OneUI, these states are managed internally by the `Breadcrumb` component — the last item automatically appears as "current", and hover states are built in. You don't need to manually set item states.

---

## BreadcrumbItem Child Components

| Child         | Type               | Purpose                                             | Migration                          |
| ------------- | ------------------ | --------------------------------------------------- | ---------------------------------- |
| `Label`       | Label component    | Text content of the breadcrumb link                 | → Content inside the slot in OneUI |
| `Stroke Line` | Internal component | Underline/stroke decoration for hover/active states | → Handled internally by OneUI      |

> **Design Tip:** When migrating, focus on transferring the **text labels** from each JDS `BreadcrumbItem`'s `Label` child into the OneUI `Breadcrumb` slot. Don't worry about recreating the stroke line or state variants — OneUI handles all of that.

---

---

# 5. Complete Component Summary

| #   | JDS Component            | JDS Instances | OneUI Equivalent      | Migration Status                                               |
| --- | ------------------------ | ------------- | --------------------- | -------------------------------------------------------------- |
| 1   | **Breadcrumbs**          | 21            | **Breadcrumb**        | ✅ Maps — OneUI has more features (size, homeAsIcon, overflow) |
| 2   | **Breadcrumbs Semantic** | 12            | **Breadcrumb** (same) | ✅ Maps — merge into single component                          |
| 3   | **BreadcrumbItem**       | 0 (internal)  | _(Slot content)_      | ⚠️ Subsumed — items go into the `breadcrumb.items` SLOT        |

---

# 6. Quick Reference for Designers

When you see a JDS breadcrumb in a design file and need to recreate it in OneUI:

### Step-by-Step

1. **Find the OneUI component:** Search for "Breadcrumb" (singular) in assets
2. **Place it** on the canvas
3. **Set size:** Visually compare with the JDS breadcrumb — try `s` first, then `m` if it looks too small
4. **Check the first item:** If JDS uses a home icon as the first item → set `homeAsIcon: true`
5. **Fill the slot:** Add your breadcrumb text labels into the `breadcrumb.items` slot
6. **Consider overflow:** For deep paths (5+ levels), consider `overflow: true`
7. **Don't add separators** — OneUI handles them automatically

### Common Migration Scenarios

| JDS Breadcrumb Pattern                               | OneUI Configuration                                    |
| ---------------------------------------------------- | ------------------------------------------------------ |
| Simple 3-item breadcrumb (Home > Category > Page)    | `Breadcrumb` with 3 items in slot, `homeAsIcon: false` |
| Breadcrumb with home icon first                      | `Breadcrumb` with `homeAsIcon: true`                   |
| Deep breadcrumb (5+ levels)                          | `Breadcrumb` with `overflow: true`                     |
| Semantic breadcrumb (using Icon Semantic separators) | Same `Breadcrumb` component — no distinction needed    |

---

# 7. Migration Checklist

### Breadcrumbs → Breadcrumb

- [ ] Rename: search for `Breadcrumbs` (plural) → replace with `Breadcrumb` (singular)
- [ ] Set `size` based on visual comparison (try `s` first — it's the default)
- [ ] Check if first item uses a home icon → set `homeAsIcon: true` if so
- [ ] Migrate breadcrumb item labels from `BreadcrumbItem` children → `breadcrumb.items` SLOT
- [ ] Consider `overflow: true` for deep navigation paths
- [ ] **Don't manually add separators** — OneUI handles them
- [ ] Audit all **21 JDS Breadcrumbs instances**

### Breadcrumbs Semantic → Breadcrumb

- [ ] Migrate to the same OneUI `Breadcrumb` component (no separate semantic variant needed)
- [ ] Transfer item labels from `BreadcrumbItem` children → slot
- [ ] Audit all **12 JDS Breadcrumbs Semantic instances**

### BreadcrumbItem (Internal)

- [ ] **No direct migration needed** — items are now slot content in OneUI
- [ ] Transfer text labels from JDS `BreadcrumbItem` → `Label` child text → OneUI slot content
- [ ] States (Idle, Hover, Current) are handled automatically — no manual state setting needed

### Total Instances to Migrate

- [ ] **33 total** (21 Breadcrumbs + 12 Breadcrumbs Semantic) → all become OneUI `Breadcrumb`

---

---

# Divider  ·  JDS v3 → OneUI

## 1. Overview

| Aspect                  | JDS (Jio Testlab Library)                                                       | OneUI Components                                                            |
| ----------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Component Name          | Divider                                                                         | Divider                                                                     |
| Component Set ID        | `8003:8209`                                                                     | `2896:18341`                                                                |
| Total Variants          | 54                                                                              | 252                                                                         |
| VARIANT Props           | 4 (`Orientation`, `Size`, `Emphasis`, `Content Align`)                          | 6 (`orientation`, `size`, `attention`, `slot`, `contentAlign`, `roundCaps`) |
| BOOLEAN Props           | 1 (`Show Slot`)                                                                 | 0                                                                           |
| INSTANCE_SWAP Props     | 1 (`↳ Slot Content`)                                                            | 0                                                                           |
| TEXT Props              | 0 (text via nested Label instance)                                              | 0 (text is a direct TEXT child)                                             |
| Sub-Components          | `Stroke Line` (70-variant CS) + `Divider/Text`                                  | None — stroke is inline VECTOR, icon is inline Instance                     |
| Deprecated Variants     | `Deprecated-Divider` (54 variants), `Deprecated-Divider Semantic` (54 variants) | None                                                                        |
| Estimated JDS Instances | ~67                                                                             | —                                                                           |

## 2. Architecture Differences

| Aspect                 | JDS                                                                                                                                                                                            | OneUI                                                                                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Stroke Line            | **Separate component** — `Stroke Line` CS with `Emphasis` (5 levels: Minimal, Moderate, Bold, Heavy, Contrasting), `Size` (7: S–4XL), and `Tinted` toggle. Nested as instances inside Divider. | **Inline vector** — `Stroke` VECTOR node directly inside `StrokeStart` / `StrokeEnd` frames. No separate component.                       |
| Slot Content Mechanism | **BOOLEAN + INSTANCE_SWAP** — `Show Slot` boolean toggles slot visibility, `↳ Slot Content` instance swap lets you swap in any content (default: `Divider/Text` component with nested Label)   | **VARIANT** — `slot` VARIANT with values `none`, `icon`, `label`. Content type is fixed per variant (text or icon), not freely swappable. |
| Slot Content Type      | Freely swappable — any component via INSTANCE_SWAP (text, icon, custom)                                                                                                                        | Fixed options — `none` (no content), `label` (direct TEXT node), `icon` (Icon instance from Slot Library)                                 |
| Text Content           | Via `Divider/Text` standalone component → nested `Label` instance (Label XS, Emphasis Medium, Weight Medium)                                                                                   | Direct TEXT node child (`"Label"`)                                                                                                        |
| Emphasis / Attention   | Controlled via nested `Stroke Line` instance's `Emphasis` variant. JDS Divider `Emphasis` maps to Stroke Line emphasis: Low→Minimal, Medium→Moderate, High→Contrasting.                        | Direct `attention` VARIANT on Divider: `low`, `medium`, `high`. Stroke color bound to design tokens.                                      |
| Stroke Thickness       | Controlled via `Size` VARIANT (S=0.5px, M=1px, L=1.5px) — but `Stroke Line` itself supports 7 sizes (S–4XL)                                                                                    | Controlled via `size` VARIANT (s=0.5px, m=1px, l=1.5px)                                                                                   |
| Round Caps             | Not a prop                                                                                                                                                                                     | `roundCaps` VARIANT (`true`/`false`)                                                                                                      |
| Tinted                 | Available on nested `Stroke Line` (`Tinted`: True/False)                                                                                                                                       | Not available as a prop                                                                                                                   |

### ⚠️ Key Architecture Shift — Slot Flexibility Reduced

JDS Divider's `↳ Slot Content` INSTANCE_SWAP accepts **any component** — you could drop in custom content, icons, badges, or anything else. OneUI replaces this with a `slot` VARIANT that locks you into three fixed options: `none`, `label`, or `icon`. If you were using custom slot content in JDS, you'll need to find an alternative approach in OneUI.

## 3. Props Mapping

### 3.1 `Orientation` → `orientation` (Direct Match)

| JDS `Orientation` | OneUI `orientation` | Notes         |
| ----------------- | ------------------- | ------------- |
| `Horizontal`      | `horizontal`        | ✅ Direct map |
| `Vertical`        | `vertical`          | ✅ Direct map |

| Aspect    | JDS           | OneUI         |
| --------- | ------------- | ------------- |
| Prop Name | `Orientation` | `orientation` |
| Type      | VARIANT       | VARIANT       |
| Default   | `Horizontal`  | `horizontal`  |
| Casing    | PascalCase    | camelCase     |

### 3.2 `Size` → `size` (Direct Match)

| JDS `Size` | OneUI `size` | Stroke Thickness |
| ---------- | ------------ | ---------------- |
| `S`        | `s`          | 0.5px            |
| `M`        | `m`          | 1px              |
| `L`        | `l`          | 1.5px            |

| Aspect    | JDS       | OneUI     |
| --------- | --------- | --------- |
| Prop Name | `Size`    | `size`    |
| Type      | VARIANT   | VARIANT   |
| Default   | `M`       | `m`       |
| Values    | S, M, L   | s, m, l   |
| Casing    | Uppercase | Lowercase |

> ✅ Sizes map 1:1 with identical stroke thicknesses. Note: JDS's `Stroke Line` sub-component supports 7 sizes (S–4XL), but the Divider itself only exposes 3 (S, M, L). OneUI also offers 3 sizes.

### 3.3 `Emphasis` → `attention` (Partial Match)

| JDS `Emphasis` | OneUI `attention` | Notes         |
| -------------- | ----------------- | ------------- |
| `Low`          | `low`             | ✅ Direct map |
| `Medium`       | `medium`          | ✅ Direct map |
| `High`         | `high`            | ✅ Direct map |

| Aspect           | JDS                                                              | OneUI                                                        |
| ---------------- | ---------------------------------------------------------------- | ------------------------------------------------------------ |
| Prop Name        | `Emphasis`                                                       | `attention`                                                  |
| Type             | VARIANT                                                          | VARIANT                                                      |
| **Default**      | **`Medium`**                                                     | **`low`**                                                    |
| Values           | Low, Medium, High                                                | low, medium, high                                            |
| Casing           | PascalCase                                                       | camelCase                                                    |
| Internal Mapping | Low→Stroke Line `Minimal`, Medium→`Moderate`, High→`Contrasting` | Direct token binding (`stroke low`, `stroke medium`, `high`) |

> ⚠️ **DEFAULT SHIFT**: JDS defaults to `Medium` emphasis, OneUI defaults to `low` attention. Migrated dividers will appear lighter/more subtle unless you explicitly set `attention: medium`.

### 3.4 `Content Align` → `contentAlign` (Direct Match)

| JDS `Content Align` | OneUI `contentAlign` | Notes         |
| ------------------- | -------------------- | ------------- |
| `Start`             | `start`              | ✅ Direct map |
| `Center`            | `center`             | ✅ Direct map |
| `End`               | `end`                | ✅ Direct map |

| Aspect    | JDS             | OneUI          |
| --------- | --------------- | -------------- |
| Prop Name | `Content Align` | `contentAlign` |
| Type      | VARIANT         | VARIANT        |
| Default   | `Center`        | `center`       |
| Casing    | PascalCase      | camelCase      |

### 3.5 `Show Slot` + `↳ Slot Content` → `slot` (Mechanism Change)

| JDS Configuration                                        | OneUI `slot`     | Notes                             |
| -------------------------------------------------------- | ---------------- | --------------------------------- |
| `Show Slot: false`                                       | `none`           | ✅ No content shown               |
| `Show Slot: true` + `↳ Slot Content: Divider/Text`       | `label`          | ✅ Text label shown               |
| `Show Slot: true` + `↳ Slot Content: [icon component]`   | `icon`           | ✅ Icon shown                     |
| `Show Slot: true` + `↳ Slot Content: [custom component]` | ❌ No equivalent | Custom slot content not supported |

| Aspect       | JDS                                              | OneUI                                     |
| ------------ | ------------------------------------------------ | ----------------------------------------- |
| Visibility   | `Show Slot` (BOOLEAN, default: `true`)           | Part of `slot` VARIANT (`none` = hidden)  |
| Content Type | `↳ Slot Content` (INSTANCE_SWAP — any component) | `slot` VARIANT: `none` / `icon` / `label` |
| Default      | Slot shown with `Divider/Text`                   | `none` (no slot content)                  |
| Flexibility  | Accepts any component                            | Fixed to none, icon, or label only        |

> ⚠️ **DEFAULT SHIFT**: JDS defaults to showing the slot (`Show Slot: true` with text), OneUI defaults to `slot: none` (no content). Migrated dividers with text labels will lose them unless you set `slot: label`.

> ⚠️ **FLEXIBILITY REDUCED**: JDS allows any component in the slot via INSTANCE_SWAP. OneUI limits to three fixed options. Custom slot content must be redesigned.

## 4. New OneUI-Only Props

| Prop           | Type    | Default  | Purpose                                          | Migration Note                                                                    |
| -------------- | ------- | -------- | ------------------------------------------------ | --------------------------------------------------------------------------------- |
| `slot`         | VARIANT | `none`   | Content between strokes: `none`, `icon`, `label` | Replaces JDS `Show Slot` + `↳ Slot Content` mechanism (with reduced flexibility). |
| `roundCaps`    | VARIANT | `true`   | Round stroke endpoints: `true` / `false`         | 🆕 No JDS equivalent. JDS strokes have no cap style control.                      |
| `contentAlign` | VARIANT | `center` | Slot content alignment                           | Same as JDS `Content Align` — not new, just renamed.                              |

## 5. Lost JDS-Only Features

| JDS Feature                      | Details                                                                                                                              | Migration Impact                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `↳ Slot Content` INSTANCE_SWAP   | Accepts any component as divider content                                                                                             | ❌ OneUI limits slot to `none`, `icon`, or `label`. Custom content not supported.                 |
| `Show Slot` BOOLEAN              | Independent toggle for slot visibility                                                                                               | 🔶 Merged into `slot` VARIANT. Use `slot: none` instead of `Show Slot: false`.                    |
| `Stroke Line` sub-component      | Reusable stroke component with 5 Emphasis levels (Minimal, Moderate, Bold, Heavy, Contrasting), 7 sizes (S–4XL), and `Tinted` toggle | 🔶 Architecture simplification. Stroke is inline in OneUI.                                        |
| `Tinted` stroke                  | Stroke Line had `Tinted` boolean for brand-tinted strokes                                                                            | ❌ No OneUI equivalent. Tinted dividers not available.                                            |
| 5-level stroke emphasis          | Stroke Line: Minimal, Moderate, Bold, Heavy, Contrasting                                                                             | 🔶 Reduced to 3 levels via `attention`. Bold and Heavy have no direct map.                        |
| 7 stroke sizes (via Stroke Line) | Stroke Line: S, M, L, XL, 2XL, 3XL, 4XL                                                                                              | 🔶 Only 3 sizes exposed on both Divider components (S, M, L). No practical loss at Divider level. |
| `Divider/Text` component         | Standalone text component with nested Label                                                                                          | 🔶 OneUI uses direct TEXT node. Simpler but less connected to typography system.                  |
| Deprecated variants              | `Deprecated-Divider` and `Deprecated-Divider Semantic` component sets                                                                | ✅ Not needed — these are already deprecated in JDS.                                              |

## 6. Full Comparison Table

| Feature                  | JDS Divider                                                | OneUI Divider                                              | Mapping                                    |
| ------------------------ | ---------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------ |
| **Orientation**          | `Orientation`: Horizontal / Vertical (default: Horizontal) | `orientation`: horizontal / vertical (default: horizontal) | ✅ Direct (casing change)                  |
| **Size**                 | `Size`: S / M / L (default: M) — 0.5/1/1.5px               | `size`: s / m / l (default: m) — 0.5/1/1.5px               | ✅ Direct (casing change)                  |
| **Emphasis / Attention** | `Emphasis`: Low / Medium / High (default: **Medium**)      | `attention`: low / medium / high (default: **low**)        | ✅ Values map (DEFAULT SHIFT)              |
| **Content Align**        | `Content Align`: Start / Center / End (default: Center)    | `contentAlign`: center / start / end (default: center)     | ✅ Direct (casing change)                  |
| **Slot Visibility**      | `Show Slot` BOOLEAN (default: true)                        | `slot` VARIANT includes `none`                             | ⚠️ Mechanism change                        |
| **Slot Content**         | `↳ Slot Content` INSTANCE_SWAP (any component)             | `slot`: none / icon / label (fixed)                        | ⚠️ Flexibility reduced                     |
| **Round Caps**           | Not available                                              | `roundCaps`: true / false (default: true)                  | 🆕 OneUI-only                              |
| **Tinted Stroke**        | Via Stroke Line `Tinted` boolean                           | Not available                                              | ❌ Lost                                    |
| **Stroke Sub-Component** | `Stroke Line` CS (70 variants)                             | Inline VECTOR                                              | ✅ Simplified                              |
| **Text Component**       | `Divider/Text` → nested Label                              | Direct TEXT node                                           | ✅ Simplified                              |
| **Total Variants**       | 54 (+108 deprecated)                                       | 252                                                        | OneUI: 4.7× more (due to slot × roundCaps) |

## 7. Design Tips

1. **Default emphasis shift matters**: JDS defaults to `Medium` emphasis, OneUI defaults to `low` attention. With ~67 existing instances, most will appear lighter after migration unless you explicitly set `attention: medium`.

2. **Slot default is also different**: JDS shows the slot by default (`Show Slot: true`), OneUI hides it (`slot: none`). If your dividers have text labels, set `slot: label` explicitly.

3. **Custom slot content needs rethinking**: If you used the JDS INSTANCE_SWAP to put custom components in the divider (badges, custom icons, decorative elements), you'll need to either:
   - Use OneUI's `slot: icon` or `slot: label` if they fit
   - Build a custom wrapper around the OneUI Divider
   - Detach and customize the instance

4. **Round caps are new and on by default**: OneUI adds `roundCaps: true` as default. This gives strokes rounded endpoints. If you need sharp/flat endpoints to match JDS's look, set `roundCaps: false`.

5. **Tinted strokes are lost**: If you relied on JDS's `Tinted` stroke feature (via Stroke Line), there's no built-in equivalent in OneUI. You'd need to manually adjust stroke colors or use a variable override.

6. **Ignore deprecated variants**: JDS has `Deprecated-Divider` and `Deprecated-Divider Semantic` component sets (108 extra variants). These should not be migrated — use the current `Divider` component set.

7. **Stroke sizes are identical**: S=0.5px, M=1px, L=1.5px in both libraries. This is a clean 1:1 map.

## 8. Migration Checklist

- [ ] Replace JDS Divider with OneUI Divider
- [ ] Map `Orientation` → `orientation` (just casing change)
- [ ] Map `Size` → `size` (just casing change, values identical)
- [ ] Map `Emphasis` → `attention` (**default shifts from Medium to low**)
  - [ ] Explicitly set `attention: medium` on instances that were using the JDS default
- [ ] Map `Content Align` → `contentAlign` (just casing change)
- [ ] Map slot mechanism:
  - [ ] `Show Slot: false` → `slot: none`
  - [ ] `Show Slot: true` with text → `slot: label` (must set explicitly — OneUI defaults to `none`)
  - [ ] `Show Slot: true` with icon → `slot: icon`
  - [ ] `Show Slot: true` with custom content → redesign approach (OneUI doesn't support custom slot content)
- [ ] Decide on `roundCaps` — default is `true` (new in OneUI)
- [ ] Check for any `Tinted` stroke usage — no OneUI equivalent
- [ ] Remove any deprecated Divider instances (`Deprecated-Divider`, `Deprecated-Divider Semantic`)
- [ ] Verify text content migrated (JDS `Divider/Text` → OneUI direct TEXT node)
- [ ] Verify ~67 existing JDS Divider instances are covered

---

---

# Scrim (JDS Overlay)  ·  JDS v3 → OneUI

## 1. Overview

| Aspect                  | JDS (Jio Testlab Library)                   | OneUI Components                                                                                  |
| ----------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Component Name          | Overlay                                     | Scrim                                                                                             |
| Component ID / Set ID   | `13397:5372` (standalone COMPONENT)         | `4301:4782` (COMPONENT_SET)                                                                       |
| Total Variants          | 1 (no variants — single component)          | 72                                                                                                |
| VARIANT Props           | 0                                           | 5 (`position`, `size`, `attention`, `variant`, `overlayBlurSize`)                                 |
| BOOLEAN Props           | 0                                           | 0                                                                                                 |
| INSTANCE_SWAP Props     | 0                                           | 0                                                                                                 |
| Architecture            | Simple rectangle with 50% opacity, no props | Full-featured component set with gradient/overlay variants, directional positioning, blur support |
| Estimated JDS Instances | 0                                           | —                                                                                                 |

## 2. Architecture Differences

| Aspect               | JDS `Overlay`                                                       | OneUI `Scrim`                                                                                         |
| -------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Component Type       | **Standalone component** — single COMPONENT, no variants, no props  | **Component set** — 72 variants across 5 VARIANT props                                                |
| Visual Mechanism     | Single solid fill rectangle at 50% opacity (color: `rgb(13,13,14)`) | Two-layer system: `scrim` base rectangle + `Mask` rectangle (gradient or solid with variable opacity) |
| Gradient Support     | ❌ Not available                                                    | ✅ `variant: gradient` — 7-stop linear gradient mask for smooth edge fade                             |
| Overlay Support      | ✅ Basic — full solid overlay at 50% opacity                        | ✅ `variant: overlay` — configurable opacity per attention level                                      |
| Position / Direction | ❌ Not available — single rectangle fills parent                    | ✅ `position`: bottom, top, left, right, center (gradient direction or overlay placement)             |
| Size Control         | ❌ Not available — stretches to fill                                | ✅ `size`: xs, s, m, l, xl, full (controls gradient coverage)                                         |
| Attention Levels     | ❌ Not available — fixed 50% opacity                                | ✅ `attention`: low, medium, high (controls opacity intensity)                                        |
| Background Blur      | ❌ Not available                                                    | ✅ `overlayBlurSize`: none, s (16px), m (24px), l (40px)                                              |
| Configurable Props   | None                                                                | 5 VARIANT props                                                                                       |

### ⚠️ Key Architecture Shift — From Primitive to Full Component

JDS `Overlay` is essentially a design primitive — a single colored rectangle at 50% opacity with no configurability. OneUI `Scrim` is a fully-featured component with directional gradients, variable intensity, and background blur. This is not a migration of equivalent features — it's an **upgrade** from a minimal utility to a rich component.

## 3. Props Mapping

### 3.1 JDS has no props — all OneUI props are new

Since JDS Overlay has zero props, there are no direct mappings. The closest behavioral match is:

| JDS Overlay Behavior              | OneUI Scrim Equivalent                                                    |
| --------------------------------- | ------------------------------------------------------------------------- |
| Full solid overlay at 50% opacity | `variant: overlay`, `position: center`, `size: full`, `attention: medium` |

> The OneUI configuration above produces the closest visual result to JDS Overlay's fixed 50% dark overlay behavior.

## 4. OneUI Scrim Props (All New)

### 4.1 `variant` — Scrim Type

| Value                | Description                                                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `gradient` (default) | Directional gradient fade — smooth transition from opaque to transparent. Used for content fade at edges (e.g., bottom of scrollable areas, image overlays). |
| `overlay`            | Full-area solid overlay — uniform darkening. Used for modal backgrounds, dialog backdrops. Only available with `position: center` + `size: full`.            |

### 4.2 `position` — Gradient Direction / Placement

| Value              | Description                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------- |
| `bottom` (default) | Gradient fades from bottom (opaque) to top (transparent). Most common for content scrolling. |
| `top`              | Gradient fades from top (opaque) to bottom (transparent).                                    |
| `left`             | Gradient fades from left (opaque) to right (transparent).                                    |
| `right`            | Gradient fades from right (opaque) to left (transparent).                                    |
| `center`           | Used with `variant: overlay` — full uniform coverage from center.                            |

### 4.3 `size` — Gradient Coverage

Controls how much of the component's area the gradient covers. Smaller sizes = steeper gradient (fade happens in a smaller area). Larger sizes = gentler gradient.

| Value         | Gradient Transform Scale | Description                          |
| ------------- | ------------------------ | ------------------------------------ |
| `xs`          | 5×                       | Very steep — fade in top 20% of area |
| `s` (default) | 2.5×                     | Steep — fade in top 40%              |
| `m`           | 1.67×                    | Medium — fade in top 60%             |
| `l`           | 1.25×                    | Gentle — fade in top 80%             |
| `xl`          | 1×                       | Full — gradient spans entire area    |
| `full`        | —                        | Used with `variant: overlay` only    |

### 4.4 `attention` — Opacity Intensity

| Value              | Gradient Mask Opacity | Overlay Mask Opacity |
| ------------------ | --------------------- | -------------------- |
| `low`              | 25%                   | 17%                  |
| `medium` (default) | 50%                   | 33%                  |
| `high`             | 95%                   | 50%                  |

> The `attention` prop controls the Mask layer opacity, affecting how dark/intense the scrim appears.

### 4.5 `overlayBlurSize` — Background Blur (Overlay Only)

| Value            | Blur Radius | Description        |
| ---------------- | ----------- | ------------------ |
| `none` (default) | 0px         | No background blur |
| `s`              | 16px        | Subtle blur        |
| `m`              | 24px        | Medium blur        |
| `l`              | 40px        | Strong blur        |

> Only available with `variant: overlay`. Applied as a `BACKGROUND_BLUR` effect on the component root. Creates frosted-glass effect behind the scrim.

## 5. Internal Structure

### JDS Overlay

    Overlay (COMPONENT)
    └── (no children — the component itself is the colored rectangle)
        Fill: solid rgb(13,13,14) at 100% fill opacity
        Layer opacity: 50%

### OneUI Scrim — Gradient Variant

    Scrim (COMPONENT)
    ├── Mask (RECTANGLE) — gradient or solid fill, opacity varies by attention
    │   ├── Gradient: 7-stop linear gradient
    │   ├── Color: black, fading from opaque to transparent
    │   ├── Direction: controlled by position prop
    │   └── Opacity: low=25%, medium=50%, high=95%
    │
    └── scrim (RECTANGLE)
        ├── Base dark color layer
        ├── Fill: solid rgb(12,13,16)
        └── Opacity: 100%

### OneUI Scrim — Overlay Variant

    Scrim (COMPONENT)
    ├── BACKGROUND_BLUR effect (optional, per overlayBlurSize)
    │
    ├── Mask (RECTANGLE)
    │   ├── Solid black fill
    │   └── Opacity:
    │       ├── low = 17%
    │       ├── medium = 33%
    │       └── high = 50%
    │
    └── scrim (RECTANGLE)
        ├── Base dark color layer
        ├── Fill: solid rgb(12,13,16)
        └── Opacity: 100%

## 6. Full Comparison Table

| Feature                   | JDS Overlay                        | OneUI Scrim                                             | Mapping                                  |
| ------------------------- | ---------------------------------- | ------------------------------------------------------- | ---------------------------------------- |
| **Component Name**        | Overlay                            | Scrim                                                   | Renamed                                  |
| **Component Type**        | Standalone component (no variants) | Component set (72 variants)                             | 🆕 Major upgrade                         |
| **Variant Type**          | N/A                                | `variant`: gradient / overlay                           | 🆕 OneUI-only                            |
| **Position / Direction**  | N/A (fills parent)                 | `position`: bottom / top / left / right / center        | 🆕 OneUI-only                            |
| **Size / Coverage**       | N/A (fills parent)                 | `size`: xs / s / m / l / xl / full                      | 🆕 OneUI-only                            |
| **Intensity**             | Fixed 50% opacity                  | `attention`: low / medium / high                        | 🆕 OneUI-only (closest to JDS: `medium`) |
| **Background Blur**       | Not available                      | `overlayBlurSize`: none / s / m / l (16/24/40px)        | 🆕 OneUI-only                            |
| **Fill Color**            | `rgb(13,13,14)` solid              | `rgb(12,13,16)` solid (base) + black gradient/mask      | ≈ Similar dark color                     |
| **Opacity**               | Fixed 50% layer opacity            | Variable — controlled by `attention` prop on Mask layer | 🆕 Configurable                          |
| **Gradient Support**      | ❌ No                              | ✅ 7-stop linear gradient with direction control        | 🆕 OneUI-only                            |
| **Props Count**           | 0                                  | 5 VARIANT props                                         | 0 → 5                                    |
| **Total Variants**        | 1                                  | 72                                                      | 1 → 72                                   |
| **Instances in JDS File** | 0                                  | —                                                       | No migration needed                      |

## 7. Design Tips

1. **This is an upgrade, not a lateral migration**: JDS Overlay is a bare-minimum utility (colored rectangle at 50%). OneUI Scrim is a production-ready component with gradients, blur, and configurable intensity. Take advantage of the new capabilities.

2. **Closest equivalent to JDS Overlay**: If you just need a simple dark overlay (like JDS Overlay), use:
   - `variant: overlay`
   - `position: center`
   - `size: full`
   - `attention: medium`
   - `overlayBlurSize: none`

3. **Use gradient variant for content fade**: The `variant: gradient` is perfect for:
   - Bottom fade on scrollable content lists
   - Image overlay text readability
   - Edge fade on carousels

4. **Blur adds polish for modals**: Use `overlayBlurSize: s/m/l` with `variant: overlay` for frosted-glass modal backgrounds. This was not possible at all with JDS Overlay.

5. **Attention levels explained**:
   - `low` — subtle dimming, content behind still clearly visible
   - `medium` — moderate dimming, standard overlay intensity
   - `high` — strong dimming, content behind barely visible (gradient: 95% opacity)

6. **Zero JDS instances to migrate**: No existing JDS Overlay instances were found in the file, so this is purely about using Scrim in new OneUI designs rather than migrating existing instances. If your designs used manual rectangles as scrims (not the Overlay component), consider replacing them with the OneUI Scrim component for consistency.

7. **Position naming is intuitive**: Unlike Tooltip (where JDS and OneUI naming was inverted), Scrim's `position` names the edge where the scrim starts (opaque end). `position: bottom` = dark at the bottom, fading upward.

## 8. Migration Checklist

- [ ] Replace any JDS `Overlay` usage with OneUI `Scrim`
- [ ] Choose appropriate `variant`:
  - [ ] `gradient` for edge fades (scrollable content, images)
  - [ ] `overlay` for full-area backdrops (modals, dialogs)
- [ ] Set `position` for gradient direction (default: `bottom`)
- [ ] Set `size` for gradient steepness (default: `s`)
- [ ] Set `attention` for intensity (default: `medium` — closest to JDS 50% opacity)
- [ ] Consider `overlayBlurSize` for frosted-glass effects on overlays
- [ ] Search for manual scrim rectangles in designs — replace with OneUI Scrim component
- [ ] Note: 0 existing JDS Overlay instances — primarily a new-design consideration

  ***
