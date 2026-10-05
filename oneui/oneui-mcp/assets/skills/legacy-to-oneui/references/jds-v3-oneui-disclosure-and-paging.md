---
name: jds-v3-oneui-disclosure-and-paging
description: >-
  JDS v3 (Jio Testlab Library) → OneUI migration mapping for accordions and pagination. Covers Accordion, AccordionItem, AccordionHeader, Accordion Semantic, Pagination, PaginationButton, .PaginationItem, PaginationDots.
  Use when swapping or prop-mapping any of these components while converting a reference file to OneUI.
---

# Disclosure and paging — JDS v3 → OneUI migration

Part of the JDS v3 → OneUI migration skill set. For routing across all component behaviours, load
`get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-migration-figma-agent.md")`.

**Load this skill when migrating:** Accordion, AccordionItem, AccordionHeader, Accordion Semantic, Pagination, PaginationButton, .PaginationItem, PaginationDots.

## Components in this skill

- **Accordion / AccordionItem / AccordionHeader** — search `Accordion`
- **Pagination / .PaginationItem / PaginationDots** — search `Pagination`

Jump straight to the component you need — each has its own Overview, Props Mapping, full comparison
table, and Migration Checklist. Do not invent prop names or variant values; use the tables below.

---

# Accordion / AccordionItem / AccordionHeader  ·  JDS v3 → OneUI

---

# 1. Component Family Overview

## Architecture Difference

|                      | JDS (Jio Testlab Library)                           | OneUI                                      |
| -------------------- | --------------------------------------------------- | ------------------------------------------ |
| **Architecture**     | 3-tier: Accordion → AccordionItem → AccordionHeader | 2-tier: Accordion → AccordionItem          |
| **Header handling**  | Separate `AccordionHeader` component                | Header built into `AccordionItem` directly |
| **Content slot**     | External `Slot (Content)` dependency                | `bodySlot` (SLOT prop) on AccordionItem    |
| **Semantic variant** | Separate `Accordion Semantic` component             | _(Not available)_                          |

> **Key Structural Change:** JDS splits the accordion into 3 nested components — `Accordion` wraps `AccordionItem`, which wraps `AccordionHeader`. OneUI flattens this to 2 tiers — `Accordion` wraps `AccordionItem`, and the header is built directly into `AccordionItem`. This means JDS `AccordionHeader` props are absorbed into OneUI's `AccordionItem`.

## Component Routing

| JDS Component          | OneUI Target                  | Notes                                                             |
| ---------------------- | ----------------------------- | ----------------------------------------------------------------- |
| **Accordion**          | **Accordion**                 | Direct mapping (wrapper component)                                |
| **AccordionItem**      | **AccordionItem**             | Direct mapping (absorbs AccordionHeader props)                    |
| **AccordionHeader**    | _(Merged into AccordionItem)_ | Header is internal to OneUI AccordionItem — no separate component |
| **Accordion Semantic** | _(No equivalent)_             | OneUI has no semantic variant — handle via tokens/overrides       |

---

# 2. Accordion → Accordion

## Overview

|                         | JDS (Jio Testlab Library) | OneUI                                    |
| ----------------------- | ------------------------- | ---------------------------------------- |
| **Component Name**      | Accordion                 | Accordion                                |
| **Total Variants**      | 3 (3 emphasis)            | 18 (3 sizes × 3 attention × 2 fullWidth) |
| **Instances in Use**    | 1                         | 1                                        |
| **Page**                | Accordion                 | ↳ Accordion                              |
| **Child Instance Tags** | AccordionItem             | AccordionItem                            |

---

## Props Mapping

### Emphasis → Attention

|               | JDS        | OneUI       |
| ------------- | ---------- | ----------- |
| **Prop Name** | `Emphasis` | `attention` |
| **Type**      | VARIANT    | VARIANT     |
| **Default**   | "Medium"   | "medium"    |

#### Value Mapping

| JDS `Emphasis` | OneUI `attention` | Notes                             |
| -------------- | ----------------- | --------------------------------- |
| Low            | low               | Direct mapping                    |
| Medium         | medium            | Direct mapping ✅ (both defaults) |
| High           | high              | Direct mapping                    |

> **Note:** Unlike the Button component, the Accordion defaults align — both JDS and OneUI default to the middle tier (`Medium` / `medium`). No default-shift risk here.

---

### New Props in OneUI (No JDS Equivalent)

#### Size

|                 | OneUI                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| **Prop Name**   | `size`                                                                                                          |
| **Type**        | VARIANT                                                                                                         |
| **Options**     | s, m, l                                                                                                         |
| **Default**     | m                                                                                                               |
| **Description** | Controls the overall size of the accordion and its children. JDS Accordion has no size prop — sizing was fixed. |

> **Migration Note:** JDS Accordion has no size control. Set `size = m` (default) for all migrated instances to preserve approximate JDS sizing. Adjust per layout needs.

#### Full Width

|                 | OneUI                                                                             |
| --------------- | --------------------------------------------------------------------------------- |
| **Prop Name**   | `fullWidth`                                                                       |
| **Type**        | VARIANT                                                                           |
| **Options**     | false, true                                                                       |
| **Default**     | false                                                                             |
| **Description** | Controls whether the accordion stretches to fill the full width of its container. |

> **Migration Note:** JDS Accordion has no fullWidth prop. Default `false` is the safe starting point. Set to `true` if the JDS accordion was used in a full-width layout context.

#### Slot

|                 | OneUI                                                                |
| --------------- | -------------------------------------------------------------------- |
| **Prop Name**   | `slot`                                                               |
| **Type**        | SLOT                                                                 |
| **Default**     | empty                                                                |
| **Description** | A slot prop for inserting custom content into the accordion wrapper. |

> **Migration Note:** This is a new structural capability in OneUI. JDS used fixed AccordionItem children — OneUI additionally offers a slot for custom content at the Accordion wrapper level.

---

## Full Props Comparison Table (Accordion)

| #   | Prop Concept         | JDS Prop   | JDS Type | JDS Values        | JDS Default | OneUI Prop  | OneUI Type | OneUI Values      | OneUI Default | Status              |
| --- | -------------------- | ---------- | -------- | ----------------- | ----------- | ----------- | ---------- | ----------------- | ------------- | ------------------- |
| 1   | Emphasis / Attention | `Emphasis` | VARIANT  | Low, Medium, High | Medium      | `attention` | VARIANT    | low, medium, high | medium        | ✅ Direct 1:1 match |
| 2   | Size                 | _(N/A)_    | —        | —                 | —           | `size`      | VARIANT    | s, m, l           | m             | ❌ OneUI-only (new) |
| 3   | Full Width           | _(N/A)_    | —        | —                 | —           | `fullWidth` | VARIANT    | false, true       | false         | ❌ OneUI-only (new) |
| 4   | Slot                 | _(N/A)_    | —        | —                 | —           | `slot`      | SLOT       | —                 | empty         | ❌ OneUI-only (new) |

---

# 3. AccordionItem → AccordionItem

## Overview

|                         | JDS (Jio Testlab Library)                    | OneUI                                                  |
| ----------------------- | -------------------------------------------- | ------------------------------------------------------ |
| **Component Name**      | AccordionItem                                | AccordionItem                                          |
| **Total Variants**      | 6 (2 event × 3 emphasis)                     | 36 (3 sizes × 3 attention × 2 type × 2 fullWidth)      |
| **Instances in Use**    | 0 (used as child of Accordion)               | 0 (used as child of Accordion)                         |
| **Page**                | Accordion                                    | ↳ Accordion                                            |
| **Child Instance Tags** | AccordionHeader, Slot (Content), Stroke Line | Start, End, Icon, Divider, .paddingLeft, .paddingRight |

---

## Props Mapping

### Event → Type (Expand/Collapse State)

|               | JDS        | OneUI       |
| ------------- | ---------- | ----------- |
| **Prop Name** | `Event`    | `type`      |
| **Type**      | VARIANT    | VARIANT     |
| **Default**   | "Collapse" | "collapsed" |

#### Value Mapping

| JDS `Event` | OneUI `type` | Notes                             |
| ----------- | ------------ | --------------------------------- |
| Collapse    | collapsed    | Direct mapping ✅ (both defaults) |
| Expand      | Expanded     | Direct mapping                    |

> **Note:** The prop names differ (`Event` vs `type`) and the value casing differs (`Collapse`/`Expand` vs `collapsed`/`Expanded`), but the behavior is identical — controls whether the accordion item is open or closed.

---

### Emphasis → Attention

|               | JDS        | OneUI       |
| ------------- | ---------- | ----------- |
| **Prop Name** | `Emphasis` | `attention` |
| **Type**      | VARIANT    | VARIANT     |
| **Default**   | "Medium"   | "medium"    |

#### Value Mapping

| JDS `Emphasis` | OneUI `attention` | Notes                             |
| -------------- | ----------------- | --------------------------------- |
| Medium         | medium            | Direct mapping ✅ (both defaults) |
| Low            | low               | Direct mapping                    |
| High           | high              | Direct mapping                    |

---

### Content Slot

|               | JDS                                  | OneUI      |
| ------------- | ------------------------------------ | ---------- |
| **Prop Name** | _(Child `Slot (Content)` component)_ | `bodySlot` |
| **Type**      | External child dependency            | SLOT       |
| **Default**   | —                                    | empty      |

#### Behavior Difference

- **JDS:** The body content is a nested external `Slot (Content)` component instance. You override the slot's children to insert your content.
- **OneUI:** The body content is exposed as a top-level `bodySlot` SLOT prop on AccordionItem. You drag content directly into the slot.

> **Migration Note:** Extract the content from JDS's nested `Slot (Content)` child and place it into OneUI's `bodySlot` SLOT prop.

---

### Header Content (AccordionHeader merged into AccordionItem)

|                          | JDS                                        | OneUI                                                        |
| ------------------------ | ------------------------------------------ | ------------------------------------------------------------ |
| **Component**            | Separate `AccordionHeader` child component | Header built into AccordionItem                              |
| **Header slot**          | `AccordionHeader` → child `Slot (Header)`  | _(Header text/content set via overrides on internal layers)_ |
| **Expand/Collapse icon** | `AccordionHeader` → child `Trigger` (Icon) | Built-in `Icon` child (chevron)                              |
| **Header divider**       | `AccordionHeader` → child `Stroke Line`    | `headerDivider` (BOOLEAN, default: true)                     |
| **Header open/close**    | `AccordionHeader` → `Variant` (Close/Open) | Controlled by `type` (collapsed/Expanded) on AccordionItem   |

#### Behavior Difference

- **JDS:** `AccordionHeader` is a separate component with its own props (`Variant`: Close/Open, `Emphasis`: Low/Medium/High). The header content is placed via an external `Slot (Header)` component. The expand/collapse icon is a `Trigger` child (Icon component). A `Stroke Line` component provides the divider.
- **OneUI:** The header is built directly into `AccordionItem`. There's no separate header component to configure. The expand/collapse state is controlled by the `type` prop on `AccordionItem` itself. The divider is controlled by a simple `headerDivider` boolean prop.

> **Migration Note:** JDS `AccordionHeader` props map as follows:
>
> - `AccordionHeader.Variant` (Close/Open) → Controlled by `AccordionItem.type` (collapsed/Expanded)
> - `AccordionHeader.Emphasis` → Controlled by `AccordionItem.attention`
> - `AccordionHeader.Slot (Header)` content → Override internal header layers in OneUI AccordionItem
> - `AccordionHeader.Stroke Line` → `AccordionItem.headerDivider` (true/false)

---

### Start Icon

|               | JDS                                | OneUI                |
| ------------- | ---------------------------------- | -------------------- |
| **Prop Name** | _(Not available on AccordionItem)_ | `start`              |
| **Type**      | —                                  | INSTANCE_SWAP        |
| **Default**   | —                                  | Component "305:7463" |

> **Migration Note:** OneUI AccordionItem supports a `start` icon slot in the header (e.g., for a leading icon before the title). JDS AccordionItem does not have this — it's a new capability.

---

### End Icon

|               | JDS                                | OneUI                           |
| ------------- | ---------------------------------- | ------------------------------- |
| **Prop Name** | _(Not available on AccordionItem)_ | `end`                           |
| **Type**      | —                                  | INSTANCE_SWAP                   |
| **Default**   | —                                  | Component "421:12769" (chevron) |

> **Migration Note:** OneUI AccordionItem has a dedicated `end` icon slot (defaults to the chevron/expand icon). In JDS, the expand/collapse icon was handled by the nested `AccordionHeader`'s `Trigger` child. In OneUI, you can swap this to any icon via the `end` instance swap prop.

---

### Header Divider

|               | JDS                                                  | OneUI           |
| ------------- | ---------------------------------------------------- | --------------- |
| **Prop Name** | _(Child `Stroke Line` component in AccordionHeader)_ | `headerDivider` |
| **Type**      | Child dependency                                     | BOOLEAN         |
| **Default**   | _(Always present)_                                   | true            |

#### Behavior Difference

- **JDS:** The divider is a `Stroke Line` component nested inside `AccordionHeader`. Visibility is controlled by overriding or hiding the child.
- **OneUI:** The divider is controlled by a simple `headerDivider` boolean prop on AccordionItem. Toggle it on/off directly.

> **Migration Note:** JDS always shows the divider (via Stroke Line child). OneUI defaults to `headerDivider = true`, which preserves JDS behavior. Set to `false` only if you want to remove the divider.

---

### New Props in OneUI (No JDS Equivalent)

#### Size

|                 | OneUI                                                                        |
| --------------- | ---------------------------------------------------------------------------- |
| **Prop Name**   | `size`                                                                       |
| **Type**        | VARIANT                                                                      |
| **Options**     | s, m, l                                                                      |
| **Default**     | m                                                                            |
| **Description** | Controls the size of the accordion item (header height, text size, padding). |

> **Migration Note:** JDS AccordionItem has no size control. Set `size = m` (default) to approximate JDS sizing.

#### Full Width

|                 | OneUI                                                        |
| --------------- | ------------------------------------------------------------ |
| **Prop Name**   | `fullWidth`                                                  |
| **Type**        | VARIANT                                                      |
| **Options**     | true, false                                                  |
| **Default**     | true                                                         |
| **Description** | Controls whether the accordion item stretches to full width. |

> **Migration Note:** JDS AccordionItem has no fullWidth control. Note that the default is `true` on AccordionItem (vs `false` on the parent Accordion component) — verify which behavior matches your JDS layout.

---

### Props Not in OneUI (JDS-Only, Lost in Migration)

| JDS Prop / Component                   | Type             | Values            | Impact                                                                                                           |
| -------------------------------------- | ---------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| `AccordionHeader` (separate component) | COMPONENT_SET    | —                 | ⚠️ Merged into AccordionItem. Header customization moves from a dedicated component to internal layer overrides. |
| `AccordionHeader.Variant`              | VARIANT          | Close, Open       | Absorbed into `AccordionItem.type` (collapsed/Expanded). No loss.                                                |
| `AccordionHeader.Emphasis`             | VARIANT          | Low, Medium, High | Absorbed into `AccordionItem.attention`. No loss.                                                                |
| `AccordionHeader.Slot (Header)`        | External child   | —                 | ⚠️ Header content is no longer a slot-based component. Override internal layers directly.                        |
| `Slot (Content)` (external)            | External child   | —                 | Replaced by `bodySlot` SLOT prop. Mechanism change, no loss.                                                     |
| `Stroke Line` (child divider)          | Child dependency | —                 | Replaced by `headerDivider` BOOLEAN. Simpler API, no loss.                                                       |

---

## Full Props Comparison Table (AccordionItem)

| #   | Prop Concept         | JDS Prop                             | JDS Type     | JDS Values        | JDS Default    | OneUI Prop      | OneUI Type    | OneUI Values        | OneUI Default | Status              |
| --- | -------------------- | ------------------------------------ | ------------ | ----------------- | -------------- | --------------- | ------------- | ------------------- | ------------- | ------------------- |
| 1   | Expand/Collapse      | `Event`                              | VARIANT      | Expand, Collapse  | Collapse       | `type`          | VARIANT       | collapsed, Expanded | collapsed     | ✅ 1:1 (rename)     |
| 2   | Emphasis / Attention | `Emphasis`                           | VARIANT      | Medium, Low, High | Medium         | `attention`     | VARIANT       | low, medium, high   | medium        | ✅ 1:1 match        |
| 3   | Content slot         | _(child Slot component)_             | External dep | —                 | —              | `bodySlot`      | SLOT          | —                   | empty         | ⚠️ Mechanism change |
| 4   | Header divider       | _(child Stroke Line)_                | Child dep    | —                 | always present | `headerDivider` | BOOLEAN       | true/false          | true          | ⚠️ Mechanism change |
| 5   | Start icon           | _(N/A)_                              | —            | —                 | —              | `start`         | INSTANCE_SWAP | component ref       | placeholder   | ❌ OneUI-only (new) |
| 6   | End icon             | _(N/A — Trigger in AccordionHeader)_ | —            | —                 | —              | `end`           | INSTANCE_SWAP | component ref       | chevron       | ⚠️ Mechanism change |
| 7   | Size                 | _(N/A)_                              | —            | —                 | —              | `size`          | VARIANT       | s, m, l             | m             | ❌ OneUI-only (new) |
| 8   | Full Width           | _(N/A)_                              | —            | —                 | —              | `fullWidth`     | VARIANT       | true, false         | true          | ❌ OneUI-only (new) |

---

# 4. AccordionHeader → _(Merged into OneUI AccordionItem)_

## Overview

|                      | JDS (Jio Testlab Library)          | OneUI                     |
| -------------------- | ---------------------------------- | ------------------------- |
| **Component Name**   | AccordionHeader                    | _(No separate component)_ |
| **Total Variants**   | 6 (2 variant × 3 emphasis)         | —                         |
| **Instances in Use** | 0 (used as child of AccordionItem) | —                         |
| **Status**           | Dedicated component                | Merged into AccordionItem |

---

## Props Mapping

| #   | JDS Prop               | JDS Type     | JDS Values        | JDS Default | OneUI Equivalent                            | Notes                                      |
| --- | ---------------------- | ------------ | ----------------- | ----------- | ------------------------------------------- | ------------------------------------------ |
| 1   | `Variant`              | VARIANT      | Close, Open       | Close       | `AccordionItem.type` (collapsed/Expanded)   | Close→collapsed, Open→Expanded             |
| 2   | `Emphasis`             | VARIANT      | Low, Medium, High | Medium      | `AccordionItem.attention` (low/medium/high) | Direct 1:1 mapping                         |
| 3   | Child `Slot (Header)`  | External dep | —                 | —           | Override internal header layers             | ⚠️ No dedicated slot — use layer overrides |
| 4   | Child `Trigger` (Icon) | Child dep    | —                 | —           | `AccordionItem.end` (INSTANCE_SWAP)         | Chevron icon handled via end prop          |
| 5   | Child `Stroke Line`    | Child dep    | —                 | —           | `AccordionItem.headerDivider` (BOOLEAN)     | true/false toggle replaces child component |

> **Migration Note:** `AccordionHeader` does not exist as a separate component in OneUI. All its functionality is absorbed into `AccordionItem`. When migrating, map AccordionHeader props to the corresponding AccordionItem props as shown above.

---

# 5. Accordion Semantic → _(No OneUI Equivalent)_

## Overview

|                      | JDS (Jio Testlab Library) | OneUI             |
| -------------------- | ------------------------- | ----------------- |
| **Component Name**   | Accordion Semantic        | _(No equivalent)_ |
| **Total Variants**   | 3 (3 emphasis)            | —                 |
| **Instances in Use** | 0                         | —                 |
| **Status**           | Published component       | Not available     |

---

## JDS Accordion Semantic Props

| Prop       | Type    | Values            | Default |
| ---------- | ------- | ----------------- | ------- |
| `Emphasis` | VARIANT | Low, Medium, High | Medium  |

> **Migration Note:** JDS `Accordion Semantic` is a semantic-token variant of the Accordion that uses `AccordionItem Semantic` children (external dependency). OneUI does not have a separate semantic variant — the base `Accordion` component handles theming internally via design tokens. If your designs use `Accordion Semantic`, migrate to the standard OneUI `Accordion` and verify that the semantic token values are correctly applied via the OneUI token system.

---

# 6. Migration Checklist

## Accordion (Wrapper)

- [ ] Map `Emphasis` → `attention` (Low→low, Medium→medium, High→high) — defaults match, safe migration
- [ ] Decide default for new `size` prop (recommended: `m`)
- [ ] Decide default for new `fullWidth` prop (recommended: check JDS layout context)

## AccordionItem

- [ ] Map `Event` → `type` (Collapse→collapsed, Expand→Expanded)
- [ ] Map `Emphasis` → `attention` (Low→low, Medium→medium, High→high)
- [ ] Migrate content from child `Slot (Content)` → OneUI `bodySlot` SLOT prop
- [ ] Decide default for new `size` prop (recommended: `m`)
- [ ] Decide default for new `fullWidth` prop (check: default is `true` on AccordionItem)
- [ ] Set `headerDivider = true` to preserve JDS Stroke Line behavior

## AccordionHeader (Absorbed)

- [ ] Map `AccordionHeader.Variant` (Close/Open) → `AccordionItem.type` (collapsed/Expanded)
- [ ] Map `AccordionHeader.Emphasis` → `AccordionItem.attention`
- [ ] Migrate header slot content to internal layer overrides in OneUI AccordionItem
- [ ] Map Trigger (expand icon) → `AccordionItem.end` INSTANCE_SWAP (defaults to chevron)
- [ ] Map Stroke Line → `AccordionItem.headerDivider` (set to `true`)

## Accordion Semantic

- [ ] Audit all Accordion Semantic usages
- [ ] Migrate to standard OneUI `Accordion` component
- [ ] Verify semantic token mapping in the OneUI token system

## General

- [ ] Verify the 3-tier → 2-tier structural change doesn't break any nested overrides
- [ ] Test expand/collapse behavior after migration
- [ ] Review `start` icon — new capability in OneUI, decide if any items should use it

---

---

# Pagination / .PaginationItem / PaginationDots  ·  JDS v3 → OneUI

---

# 1. Architecture Difference

## JDS (Jio Testlab Library) — 2-tier structure

| Level      | Component          | Description                                   |
| ---------- | ------------------ | --------------------------------------------- |
| **Parent** | `Pagination`       | Container with page buttons + ellipsis labels |
| **Child**  | `PaginationButton` | Individual page number / nav button           |

## OneUI — 2-tier structure (richer)

| Level               | Component                     | Description                                                   |
| ------------------- | ----------------------------- | ------------------------------------------------------------- |
| **Parent**          | `Pagination`                  | Container with page items, nav arrows, first/last, truncation |
| **Child (private)** | `.PaginationItem`             | Individual page number item (private — prefixed with `.`)     |
| **Child (private)** | `.PaginationSelectableButton` | Selectable button used inside pagination (external dep)       |
| **Child**           | `IconButton`                  | Arrow navigation buttons (prev/next, first/last)              |

## Separate Component (No JDS Equivalent)

| Component        | Library    | Description                                                                                              |
| ---------------- | ---------- | -------------------------------------------------------------------------------------------------------- |
| `PaginationDots` | OneUI only | Dot-style page indicators for carousels/swipeable content — completely separate from numbered pagination |

> **Key Difference:** JDS has a simpler Pagination with just Size and Emphasis. OneUI Pagination is significantly more feature-rich — with truncation control, compact mode, boundary/sibling counts, first/last arrows, and fullWidth support. PaginationDots is an entirely new OneUI component with no JDS equivalent.

---

---

# 2. Pagination → Pagination

## Overview

|                         | JDS (Jio Testlab Library) | OneUI                                                                                                 |
| ----------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Component Name**      | Pagination                | Pagination                                                                                            |
| **Total Variants**      | 18 (6 sizes × 3 emphasis) | 432+ (3 sizes × 3 attention × 2 type × 2 siblingCount × 2 boundaryCount × 2 fullWidth × bool toggles) |
| **Instances in Use**    | 87                        | 13                                                                                                    |
| **Page**                | Pagination                | ↳ Pagination                                                                                          |
| **Child Instance Tags** | PaginationButton, Label   | IconButton, .PaginationItem, PaginationItem, .PaginationSelectableButton                              |

---

## Props Mapping

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

> **⚠️ Important:** Default differs — JDS defaults to `Medium`, OneUI to `high`. Always set `attention` explicitly during migration. Without it, migrated paginations will appear more prominent.

---

### Size

|               | JDS     | OneUI   |
| ------------- | ------- | ------- |
| **Prop Name** | `Size`  | `size`  |
| **Type**      | VARIANT | VARIANT |
| **Default**   | "M"     | "m"     |

#### Value Mapping

| JDS `Size` | OneUI `size`                      | Notes                                       |
| ---------- | --------------------------------- | ------------------------------------------- |
| XS         | s                                 | ⚠️ Lossy — no `xs` in OneUI, closest is `s` |
| S          | s                                 | Direct mapping                              |
| M          | m                                 | Direct mapping ✅ (both defaults)           |
| L          | l                                 | Direct mapping                              |
| XL         | ❌ _(no equivalent)_ — map to `l` | Lossy — OneUI caps at `l`                   |
| 2XL        | ❌ _(no equivalent)_ — map to `l` | Lossy — OneUI caps at `l`                   |

> **Migration Note:** JDS has **6 sizes** (XS–2XL), OneUI has only **3 sizes** (s, m, l). Three JDS sizes (`XS`, `XL`, `2XL`) have no direct equivalent. `XS` can map to `s`; `XL` and `2XL` must downscale to `l`. Audit instances using these sizes.

---

### New Props in OneUI (No JDS Equivalent)

#### Type (Compact / Truncate)

|                 | OneUI                                                                                                                                                                   |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Prop Name**   | `type`                                                                                                                                                                  |
| **Type**        | VARIANT                                                                                                                                                                 |
| **Options**     | compact, truncate                                                                                                                                                       |
| **Default**     | truncate                                                                                                                                                                |
| **Description** | Controls the pagination display mode. `truncate` shows page numbers with ellipsis truncation for large page counts. `compact` shows a simplified view (e.g., "3 / 11"). |

> **Migration Note:** JDS Pagination has no compact mode — it always shows page number buttons. Set `type = truncate` (default) to preserve JDS behavior.

---

#### Total Pages

|                 | OneUI                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------- |
| **Prop Name**   | `totalPages`                                                                                   |
| **Type**        | VARIANT                                                                                        |
| **Options**     | "11"                                                                                           |
| **Default**     | "11"                                                                                           |
| **Description** | Total number of pages. Currently fixed at 11 in the component set (design-time configuration). |

> **Migration Note:** JDS Pagination uses child `PaginationButton` instances to represent pages — the total count is implicit from how many buttons are placed. OneUI uses a `totalPages` variant to control this. Currently only `"11"` is available as a variant option.

---

#### Sibling Count

|                 | OneUI                                                                                                                              |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Prop Name**   | `siblingCount`                                                                                                                     |
| **Type**        | VARIANT                                                                                                                            |
| **Options**     | "1", "-"                                                                                                                           |
| **Default**     | "1"                                                                                                                                |
| **Description** | Number of page items shown on each side of the current page. `"1"` shows one sibling on each side; `"-"` disables sibling display. |

> **Migration Note:** JDS has no sibling count control. Set `siblingCount = "1"` (default) for standard pagination behavior.

---

#### Boundary Count

|                 | OneUI                                                                                                                              |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Prop Name**   | `boundaryCount`                                                                                                                    |
| **Type**        | VARIANT                                                                                                                            |
| **Options**     | "1", "-"                                                                                                                           |
| **Default**     | "1"                                                                                                                                |
| **Description** | Number of page items always shown at the start and end of the pagination. `"1"` shows first/last page; `"-"` hides boundary items. |

> **Migration Note:** JDS has no boundary count control. Set `boundaryCount = "1"` (default) for standard behavior showing first and last pages.

---

#### Previous / Next Arrows

|                 | OneUI                                           |
| --------------- | ----------------------------------------------- |
| **Prop Name**   | `prevNext`                                      |
| **Type**        | BOOLEAN                                         |
| **Default**     | true                                            |
| **Description** | Toggles previous/next navigation arrow buttons. |

> **Migration Note:** JDS Pagination includes prev/next buttons as child `PaginationButton` instances (with `Icon` children for arrows). OneUI controls this with a single boolean toggle. Set `prevNext = true` (default) to match JDS behavior.

---

#### First / Last Arrows

|                 | OneUI                                                      |
| --------------- | ---------------------------------------------------------- |
| **Prop Name**   | `firstLast`                                                |
| **Type**        | BOOLEAN                                                    |
| **Default**     | false                                                      |
| **Description** | Toggles first-page/last-page jump arrow buttons (⏮ / ⏭). |

> **Migration Note:** JDS Pagination has no first/last page jump buttons. Set `firstLast = false` (default) to match JDS behavior — enable only if adding this feature during migration.

---

#### Full Width

|                 | OneUI                                                     |
| --------------- | --------------------------------------------------------- |
| **Prop Name**   | `fullWidth`                                               |
| **Type**        | VARIANT                                                   |
| **Options**     | true, false                                               |
| **Default**     | false                                                     |
| **Description** | Stretches the pagination bar to fill the container width. |

> **Migration Note:** JDS Pagination has no fullWidth control. Set `fullWidth = false` (default) to preserve JDS behavior.

---

## Full Props Comparison Table (Pagination)

| #   | Prop Concept         | JDS Prop                     | JDS Type | JDS Values        | JDS Default | OneUI Prop      | OneUI Type | OneUI Values      | OneUI Default | Status                    |
| --- | -------------------- | ---------------------------- | -------- | ----------------- | ----------- | --------------- | ---------- | ----------------- | ------------- | ------------------------- |
| 1   | Emphasis / Attention | `Emphasis`                   | VARIANT  | High, Medium, Low | Medium      | `attention`     | VARIANT    | high, medium, low | high          | ✅ 1:1 (default differs)  |
| 2   | Size                 | `Size`                       | VARIANT  | XS–2XL (6)        | M           | `size`          | VARIANT    | s, m, l (3)       | m             | ⚠️ Partial (3 sizes lost) |
| 3   | Display type         | _(N/A)_                      | —        | —                 | —           | `type`          | VARIANT    | compact, truncate | truncate      | ❌ OneUI-only (new)       |
| 4   | Total pages          | _(implicit — child count)_   | —        | —                 | —           | `totalPages`    | VARIANT    | "11"              | "11"          | ❌ OneUI-only (new)       |
| 5   | Sibling count        | _(N/A)_                      | —        | —                 | —           | `siblingCount`  | VARIANT    | "1", "-"          | "1"           | ❌ OneUI-only (new)       |
| 6   | Boundary count       | _(N/A)_                      | —        | —                 | —           | `boundaryCount` | VARIANT    | "1", "-"          | "1"           | ❌ OneUI-only (new)       |
| 7   | Prev / Next arrows   | _(implicit — child buttons)_ | —        | —                 | —           | `prevNext`      | BOOLEAN    | true/false        | true          | ❌ OneUI-only (new)       |
| 8   | First / Last arrows  | _(N/A)_                      | —        | —                 | —           | `firstLast`     | BOOLEAN    | true/false        | false         | ❌ OneUI-only (new)       |
| 9   | Full width           | _(N/A)_                      | —        | —                 | —           | `fullWidth`     | VARIANT    | true, false       | false         | ❌ OneUI-only (new)       |

---

## Migration Checklist (Pagination)

- [ ] Map `Emphasis` → `attention` (High→high, Medium→medium, Low→low) — **set explicitly** (default shifts Medium → high)
- [ ] Map `Size` (S→s, M→m, L→l) — **flag XS, XL, 2XL instances** for manual size decision
- [ ] Set `type = truncate` (default — matches JDS page-number display)
- [ ] Set `prevNext = true` (default — matches JDS arrow buttons)
- [ ] Set `firstLast = false` (default — JDS has no first/last jump)
- [ ] Set `fullWidth = false` (default — JDS has no full-width mode)
- [ ] Set `siblingCount = "1"` and `boundaryCount = "1"` (defaults — standard truncation behavior)
- [ ] Audit all 87 JDS Pagination instances

---

---

# 3. PaginationButton → .PaginationItem

## Overview

|                         | JDS (Jio Testlab Library)                                        | OneUI                                                   |
| ----------------------- | ---------------------------------------------------------------- | ------------------------------------------------------- |
| **Component Name**      | PaginationButton                                                 | .PaginationItem                                         |
| **Type**                | Public component (usable standalone)                             | Private component (`.` prefix — internal to Pagination) |
| **Total Variants**      | 144 (6 sizes × 3 emphasis × 2 disabled × 2 active × 2 condensed) | 18 (3 sizes × 3 attention × 2 select)                   |
| **Instances in Use**    | 0 (used only inside Pagination)                                  | 0 (used only inside Pagination)                         |
| **Page**                | Pagination                                                       | ↳ Pagination                                            |
| **Child Instance Tags** | Label, Icon                                                      | _(none)_                                                |

> **Key Difference:** JDS `PaginationButton` is a public component that can be used standalone. OneUI `.PaginationItem` is private (`.` prefix) — it's only used internally by the `Pagination` parent component. You should **not** need to use `.PaginationItem` directly in migration.

---

## Props Mapping

### Size

|               | JDS     | OneUI   |
| ------------- | ------- | ------- |
| **Prop Name** | `Size`  | `size`  |
| **Type**      | VARIANT | VARIANT |
| **Default**   | "M"     | "m"     |

#### Value Mapping

| JDS `Size` | OneUI `size`    | Notes                          |
| ---------- | --------------- | ------------------------------ |
| XS         | s               | ⚠️ Lossy — no `xs`, map to `s` |
| S          | s               | Direct mapping                 |
| M          | m               | Direct mapping ✅              |
| L          | l               | Direct mapping                 |
| XL         | ❌ — map to `l` | Lossy                          |
| 2XL        | ❌ — map to `l` | Lossy                          |

---

### Emphasis → Attention

|               | JDS        | OneUI       |
| ------------- | ---------- | ----------- |
| **Prop Name** | `Emphasis` | `attention` |
| **Type**      | VARIANT    | VARIANT     |
| **Default**   | "Medium"   | "medium"    |

#### Value Mapping

| JDS `Emphasis` | OneUI `attention` | Notes                                    |
| -------------- | ----------------- | ---------------------------------------- |
| High           | high              | Direct mapping                           |
| Medium         | medium            | Direct mapping ✅ (both defaults match!) |
| Low            | low               | Direct mapping                           |

> **Note:** Unlike most other components, the defaults **match** here (both `Medium`/`medium`). No default-shift risk.

---

### Active → Select

|               | JDS      | OneUI    |
| ------------- | -------- | -------- |
| **Prop Name** | `Active` | `select` |
| **Type**      | VARIANT  | VARIANT  |
| **Default**   | "False"  | "false"  |

#### Value Mapping

| JDS `Active` | OneUI `select` | Notes          |
| ------------ | -------------- | -------------- |
| False        | false          | Direct mapping |
| True         | true           | Direct mapping |

| **Mapping** | ✅ Direct 1:1 mapping | Rename only: `Active` → `select` |

---

### Disabled

|               | JDS        | OneUI           |
| ------------- | ---------- | --------------- |
| **Prop Name** | `Disabled` | _(Not exposed)_ |
| **Type**      | VARIANT    | —               |
| **Default**   | "False"    | —               |

> **Migration Note:** JDS `PaginationButton` has a `Disabled` variant. OneUI `.PaginationItem` does not. Handle disabled states via overrides if needed. Since `.PaginationItem` is internal/private, disabled states are likely managed by the parent `Pagination` component.

---

## Full Props Comparison Table (PaginationButton → .PaginationItem)

| #   | Prop Concept         | JDS Prop                 | JDS Type  | JDS Values        | JDS Default | OneUI Prop          | OneUI Type | OneUI Values      | OneUI Default | Status                                 |
| --- | -------------------- | ------------------------ | --------- | ----------------- | ----------- | ------------------- | ---------- | ----------------- | ------------- | -------------------------------------- |
| 1   | Size                 | `Size`                   | VARIANT   | XS–2XL (6)        | M           | `size`              | VARIANT    | s, m, l (3)       | m             | ⚠️ Partial (3 sizes lost)              |
| 2   | Emphasis / Attention | `Emphasis`               | VARIANT   | High, Medium, Low | Medium      | `attention`         | VARIANT    | high, medium, low | medium        | ✅ 1:1 (defaults match)                |
| 3   | Active / Selected    | `Active`                 | VARIANT   | False, True       | False       | `select`            | VARIANT    | false, true       | false         | ✅ Direct (rename only)                |
| 4   | Disabled             | `Disabled`               | VARIANT   | False, True       | False       | _(none)_            | —          | —                 | —             | ❌ JDS-only                            |
| 5   | Icon                 | _(child Icon override)_  | Child dep | —                 | —           | _(none)_            | —          | —                 | —             | ❌ JDS-only (arrows handled by parent) |
| 6   | Label                | _(child Label override)_ | Child dep | —                 | —           | _(none — internal)_ | —          | —                 | —             | ⚠️ Internal to parent                  |

---

---

# 4. PaginationDots → _(New in OneUI, No JDS Equivalent)_

## Overview

|                         | JDS (Jio Testlab Library) | OneUI                                                                                                                                                          |
| ----------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Component Name**      | _(No equivalent)_         | PaginationDots                                                                                                                                                 |
| **Total Variants**      | —                         | 10 (5 pageCount × 2 loop)                                                                                                                                      |
| **Instances in Use**    | —                         | 1                                                                                                                                                              |
| **Page**                | —                         | ↳ PaginationDots                                                                                                                                               |
| **Child Instance Tags** | —                         | _(none)_                                                                                                                                                       |
| **Description**         | —                         | Dot-style page indicator for carousels, swipeable views, and onboarding flows. Visually represents which page/slide the user is on using filled/unfilled dots. |

> **Important:** `PaginationDots` is a **completely different component** from `Pagination`. It is NOT a variant of numbered pagination — it's a dot indicator used for carousels, swipeable content, onboarding screens, etc.

---

## Props

### Page Count

|                 | OneUI                                                                                                                                                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Prop Name**   | `pageCount`                                                                                                                                                                                          |
| **Type**        | VARIANT                                                                                                                                                                                              |
| **Options**     | "2", "3", "4", "5", "5+"                                                                                                                                                                             |
| **Default**     | "5+"                                                                                                                                                                                                 |
| **Description** | Number of pages/slides to indicate. `"5+"` shows a scrolling/truncated dots pattern for more than 5 pages (common carousel behavior where only a window of dots is visible, with scaling animation). |

---

### Loop

|                 | OneUI                                                                                                                                                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Prop Name**   | `loop`                                                                                                                                                                                                                 |
| **Type**        | VARIANT                                                                                                                                                                                                                |
| **Options**     | false, true                                                                                                                                                                                                            |
| **Default**     | true                                                                                                                                                                                                                   |
| **Description** | Controls whether the pagination dots indicate infinite/looping scroll behavior. When `true`, the dots suggest the content wraps around (first→last→first). When `false`, the dots indicate finite/non-looping content. |

---

## Full Props Table (PaginationDots)

| #   | Prop        | Type    | Values         | Default | Description                      |
| --- | ----------- | ------- | -------------- | ------- | -------------------------------- |
| 1   | `pageCount` | VARIANT | 2, 3, 4, 5, 5+ | 5+      | Number of pages to indicate      |
| 2   | `loop`      | VARIANT | false, true    | true    | Whether content loops infinitely |

---

## Closest JDS Approximation

The closest JDS equivalent is the **`.CarouselIndicators`** internal component (used inside the `Carousel` component), which also provides dot-style page indicators. However:

|                        | JDS `.CarouselIndicators`                  | OneUI `PaginationDots`                                        |
| ---------------------- | ------------------------------------------ | ------------------------------------------------------------- |
| **Accessibility**      | Private (`.` prefix, internal to Carousel) | Public (standalone component)                                 |
| **Usage**              | Only inside `Carousel` component           | Can be used anywhere — carousels, onboarding, swipeable views |
| **Page count control** | Implicit (set by Carousel content)         | Explicit `pageCount` variant (2–5+)                           |
| **Loop control**       | Controlled by parent Carousel              | Direct `loop` prop                                            |

> **Migration Note:** If your JDS designs use the `Carousel` component's built-in dots, those are tied to the Carousel component and don't need separate migration. OneUI `PaginationDots` is useful when you need standalone dot indicators outside of a carousel context.

---

---

# 5. Complete Component Summary

| #   | Component                  | JDS                            | OneUI                          | JDS Instances | OneUI Instances | Migration Status                                |
| --- | -------------------------- | ------------------------------ | ------------------------------ | ------------- | --------------- | ----------------------------------------------- |
| 1   | **Pagination** (numbered)  | ✅ `Pagination`                | ✅ `Pagination`                | 87            | 13              | ✅ Maps — OneUI has more features               |
| 2   | **Pagination Button/Item** | ✅ `PaginationButton` (public) | ✅ `.PaginationItem` (private) | 0             | 0               | ⚠️ Maps — but OneUI version is private/internal |
| 3   | **Pagination Dots**        | ❌ _(No equivalent)_           | ✅ `PaginationDots`            | —             | 1               | ❌ New in OneUI                                 |

---

# 6. Complete Migration Checklist

## Pagination (Parent)

- [ ] Map `Emphasis` → `attention` — **set explicitly** (default shifts Medium → high)
- [ ] Map `Size` (S→s, M→m, L→l) — flag XS, XL, 2XL for manual mapping
- [ ] Set `type = truncate` to match JDS page-number display
- [ ] Set `prevNext = true` to keep arrow navigation
- [ ] Set `firstLast = false` (JDS had no first/last jump)
- [ ] Set `fullWidth = false` (JDS had no full-width)
- [ ] Keep `siblingCount = "1"` and `boundaryCount = "1"` (defaults)
- [ ] Audit all 87 JDS instances

## PaginationButton → .PaginationItem

- [ ] **No direct migration needed** — `.PaginationItem` is internal to OneUI `Pagination`
- [ ] JDS `PaginationButton` instances used standalone (0 instances) would need manual recreation
- [ ] `Active` → `select` (rename only)
- [ ] `Disabled` state lost — handle via overrides if needed

## PaginationDots (New — Adopt as Needed)

- [ ] Identify JDS designs with dot-style page indicators (e.g., carousel indicators)
- [ ] If used outside of Carousel context → adopt OneUI `PaginationDots`
- [ ] Set `pageCount` based on number of pages/slides
- [ ] Set `loop` based on content behavior (looping vs finite)

---
