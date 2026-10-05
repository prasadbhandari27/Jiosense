---
name: jds-v3-oneui-lists-and-collections
description: >-
  JDS v3 (Jio Testlab Library) → OneUI migration mapping for list items, context menus and carousels. Covers ListItem, StackedListItem, StackedList, ContextMenu, Carousel, CarouselImage, .CarouselControls.
  Use when swapping or prop-mapping any of these components while converting a reference file to OneUI.
---

# Lists and item collections — JDS v3 → OneUI migration

Part of the JDS v3 → OneUI migration skill set. For routing across all component behaviours, load
`get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-migration-figma-agent.md")`.

**Load this skill when migrating:** ListItem, StackedListItem, StackedList, ContextMenu, Carousel, CarouselImage, .CarouselControls.

## Components in this skill

- **ListItem / StackedList / ContextMenu** — search `ListItem`
- **Carousel** — search `Carousel`

Jump straight to the component you need — each has its own Overview, Props Mapping, full comparison
table, and Migration Checklist. Do not invent prop names or variant values; use the tables below.

---

# ListItem / StackedList / ContextMenu  ·  JDS v3 → OneUI

## 1. Overview

| Component       | JDS (Jio Testlab Library)                            | OneUI Micropatterns                                                                                                                | Migration Type         |
| --------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| **ListItem**    | ✅ `ListItem` (CS, 6 variants) — `Emphasis` × `Size` | ✅ `ListItem` (CS, 2 variants) — `listSlot` (listItem / sectionDivider). Core row lives in `.FullWidth:True` sub-CS (48 variants). | 🔶 Major restructure   |
| **ContextMenu** | ❌ Does not exist                                    | ✅ `ContextMenu` (CS, 4 variants) — `size` (xs/s/m/l) with search + ListItem slots                                                 | 🆕 New OneUI component |

---

## 2. ListItem — Architecture Differences

| Aspect                   | JDS                                                              | OneUI Micropatterns                                                                                                                                        |
| ------------------------ | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Component Set**        | `ListItem` — 6 variants (Emphasis × Size)                        | `ListItem` — 2 variants (listSlot: listItem / sectionDivider)                                                                                              |
| **Architecture**         | Flat — all props on one component set                            | **Deeply nested** — `ListItem` → `.ListItem.Types` (fullWidth) → `.FullWidth:True` sub-CS (48 variants with size/selectedState/contentAlignment/condensed) |
| **Size System**          | `Size`: M, L (2 options)                                         | `size`: xs, s, m, l (4 options) — via `.FullWidth:True` sub-CS                                                                                             |
| **Emphasis / Selection** | `Emphasis`: High, Medium, low — visual weight/background styling | `selectedState`: idle, medium, high — selection highlight state                                                                                            |
| **Content Alignment**    | Not configurable — always vertically centered                    | `contentAlignment`: centre, top — for multi-line content alignment                                                                                         |
| **Condensed Mode**       | Not available                                                    | `condensed`: true/false — reduced vertical padding                                                                                                         |
| **Full Width**           | Not configurable — always full width                             | `fullWidth`: true/false via `.ListItem.Types` — controls horizontal padding behavior                                                                       |
| **Start Slot**           | `Start` — fixed `IconContained` instance (36×36)                 | `showStartSlot` BOOLEAN (multiple instances) — flexible slot system                                                                                        |
| **End Slot**             | `End` — fixed `Icon` instance (26×26)                            | `showEndSlot` BOOLEAN (multiple instances) — flexible slot system                                                                                          |
| **Text Content**         | `ContentSlot` frame with nested `Label` + `Text` instances       | Content within `MainComponent` frame + `StateLayer`                                                                                                        |
| **Supporting Line**      | `SupporingLine` BOOLEAN + `↪ SupportingLine` INSTANCE_SWAP       | Part of content structure — not a separate toggle                                                                                                          |
| **Divider**              | `Stroke Line` instance — always present, built-in                | `showDivider` BOOLEAN — toggleable                                                                                                                         |
| **Section Divider**      | Not available                                                    | `listSlot=sectionDivider` variant with `.SectionDivider` sub-CS (64 variants: size × type × condensed × fullWidth)                                         |
| **Slot-based Content**   | Fixed structure (Start icon, Label, Text, End icon)              | Slot-based architecture with multiple showStartSlot/showEndSlot toggles                                                                                    |
| **Width**                | 328px fixed                                                      | 320px (fullWidth=true), 400px (fullWidth=false)                                                                                                            |
| **Instances**            | 0                                                                | —                                                                                                                                                          |

---

## 3. Props Mapping — ListItem

### 3.1 JDS ListItem → OneUI ListItem

| JDS Prop           | Type          | Default       | OneUI Equivalent                     | OneUI Type | Default    | Notes                                                                                                                                                              |
| ------------------ | ------------- | ------------- | ------------------------------------ | ---------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Emphasis`         | VARIANT       | `Medium`      | `selectedState` on `.FullWidth:True` | VARIANT    | `idle`     | ⚠️ Semantic shift: JDS = visual weight, OneUI = selection state. `Medium` → `idle` (not selected), `High` → `high`, `low` → `idle` or `medium` depending on intent |
| `Size`             | VARIANT       | `L`           | `size` on `.FullWidth:True`          | VARIANT    | `m`        | 🔶 JDS M/L → OneUI xs/s/m/l. JDS `L` → OneUI `m` or `l`. JDS `M` → OneUI `s` or `m`.                                                                               |
| `SupporingLine`    | BOOLEAN       | `true`        | _(no direct toggle)_                 | —          | —          | ❌ Supporting text is part of content structure — no separate boolean                                                                                              |
| `↪ SupportingLine` | INSTANCE_SWAP | Text instance | _(no direct equivalent)_             | —          | —          | ❌ No instance swap for supporting line                                                                                                                            |
| _(not available)_  | —             | —             | `contentAlignment`                   | VARIANT    | `centre`   | 🆕 `centre` or `top` — for multi-line rows                                                                                                                         |
| _(not available)_  | —             | —             | `condensed`                          | VARIANT    | `false`    | 🆕 Reduced padding mode                                                                                                                                            |
| _(not available)_  | —             | —             | `fullWidth` on `.ListItem.Types`     | VARIANT    | `true`     | 🆕 Full-width vs inset padding                                                                                                                                     |
| _(not available)_  | —             | —             | `showDivider`                        | BOOLEAN    | `true`     | 🆕 Toggleable divider (JDS always showed it)                                                                                                                       |
| _(not available)_  | —             | —             | `showStartSlot`                      | BOOLEAN    | `true`     | 🆕 Flexible start slot toggles                                                                                                                                     |
| _(not available)_  | —             | —             | `showEndSlot`                        | BOOLEAN    | `true`     | 🆕 Flexible end slot toggles                                                                                                                                       |
| _(not available)_  | —             | —             | `listSlot` on ListItem               | VARIANT    | `listItem` | 🆕 Switch between item row and section divider                                                                                                                     |

### 3.2 Default Shifts ⚠️

| Aspect                   | JDS Default               | OneUI Default                      | Risk                                                                           |
| ------------------------ | ------------------------- | ---------------------------------- | ------------------------------------------------------------------------------ |
| Size naming              | `L` (Large)               | `m` (medium)                       | Designers may pick wrong size — JDS L ≈ OneUI m in row height                  |
| Emphasis → selectedState | `Medium`                  | `idle`                             | Semantic change — `Medium` emphasis ≠ `idle` selection. Visual result differs. |
| Divider                  | Always visible (built-in) | `showDivider: true` (same default) | ✅ Same default                                                                |
| Supporting line          | `true` (visible)          | Part of content (no toggle)        | Need to structure content differently                                          |

---

## 4. OneUI Micropatterns — Full Component Reference

### 4.1 `ListItem` (Main Component Set)

| Prop       | Type    | Default    | Values                       | Purpose                                                         |
| ---------- | ------- | ---------- | ---------------------------- | --------------------------------------------------------------- |
| `listSlot` | VARIANT | `listItem` | `listItem`, `sectionDivider` | Switch between a standard list row and a section divider/header |

### 4.2 `.ListItem.Types` (Sub-Component Set)

| Prop        | Type    | Default | Values          | Purpose                                                                                                       |
| ----------- | ------- | ------- | --------------- | ------------------------------------------------------------------------------------------------------------- |
| `fullWidth` | VARIANT | `true`  | `true`, `false` | `true` = row extends edge-to-edge with internal padding. `false` = row is inset (400px, no internal padding). |

### 4.3 `.FullWidth:True` (Core Row — 48 variants)

| Prop               | Type         | Default  | Values                   | Purpose                                                   |
| ------------------ | ------------ | -------- | ------------------------ | --------------------------------------------------------- |
| `size`             | VARIANT      | `m`      | `xs`, `s`, `m`, `l`      | Row height — scales all elements                          |
| `selectedState`    | VARIANT      | `idle`   | `idle`, `medium`, `high` | Selection/highlight intensity                             |
| `contentAlignment` | VARIANT      | `centre` | `centre`, `top`          | Vertical alignment of content — `top` for multi-line rows |
| `condensed`        | VARIANT      | `false`  | `true`, `false`          | Reduced vertical padding for compact lists                |
| `showStartSlot`    | BOOLEAN (×4) | `true`   | true / false             | Show/hide leading element slots                           |
| `showEndSlot`      | BOOLEAN (×4) | `true`   | true / false             | Show/hide trailing element slots                          |
| `showDivider`      | BOOLEAN      | `true`   | true / false             | Show/hide bottom divider line                             |

**Internal structure:** LeftSpacer (padding) → MainComponent (StateLayer + content) → RightSpacer (padding)

### 4.4 `.SectionDivider` (Sub-Component Set — 64 variants)

| Prop        | Type    | Default         | Values                                               | Purpose                        |
| ----------- | ------- | --------------- | ---------------------------------------------------- | ------------------------------ |
| `size`      | VARIANT | `m`             | `xs`, `s`, `m`, `l`                                  | Divider/label height           |
| `type`      | VARIANT | `label+divider` | `label+divider`, `labelOnly`, `dividerOnly`, `blank` | What the section divider shows |
| `condensed` | VARIANT | `false`         | `true`, `false`                                      | Compact spacing                |
| `fullWidth` | VARIANT | `true`          | `true`, `false`                                      | Full-width vs inset            |

### 4.5 `ContextMenu` (Component Set — 4 variants)

| Prop             | Type                    | Default                            | Values              | Purpose                                                                          |
| ---------------- | ----------------------- | ---------------------------------- | ------------------- | -------------------------------------------------------------------------------- |
| `size`           | VARIANT                 | `m`                                | `xs`, `s`, `m`, `l` | Menu size — scales padding, corner radius, search trigger, and list item heights |
| `showSearch`     | BOOLEAN                 | `true`                             | true / false        | Show/hide search trigger at top                                                  |
| `Add ListItem ↓` | SLOT (×4, one per size) | 3 ListItem instances + placeholder | Any components      | Content slots for menu items — add/remove ListItem instances                     |

**Size dimensions:**

| Size | Width | Padding | Corner Radius | Search Height | ListItem Height |
| ---- | ----- | ------- | ------------- | ------------- | --------------- |
| `xs` | 400px | 12px    | 12px          | 24px          | 32px            |
| `s`  | 400px | 14px    | 16px          | 32px          | 36px            |
| `m`  | 400px | 14px    | 18px          | 40px          | 40px            |
| `l`  | 400px | 16px    | 20px          | 48px          | 44px            |

**Internal structure:** Search frame (`.SearchTrigger` instance) → `Add ListItem ↓` SLOT (vertical stack of ListItem instances + `.ReplaceWithThisLayer` placeholder)

---

## 5. Full Comparison Table

| Feature                       | JDS ListItem                            | OneUI Micropatterns                                         | Mapping              |
| ----------------------------- | --------------------------------------- | ----------------------------------------------------------- | -------------------- |
| **Component exists**          | ✅ ListItem CS (6 variants)             | ✅ ListItem CS (2 variants) + deep sub-CS hierarchy         | ✅ Both have it      |
| **Size options**              | M, L (2)                                | xs, s, m, l (4)                                             | 🆕 More granular     |
| **Visual weight / selection** | `Emphasis`: High/Medium/low             | `selectedState`: idle/medium/high                           | ⚠️ Semantic shift    |
| **Content alignment**         | Fixed (centered)                        | `contentAlignment`: centre/top                              | 🆕 OneUI-only        |
| **Condensed mode**            | Not available                           | `condensed`: true/false                                     | 🆕 OneUI-only        |
| **Full width control**        | Fixed full-width                        | `fullWidth`: true/false                                     | 🆕 OneUI-only        |
| **Start icon**                | Fixed `IconContained` (36×36)           | Flexible slot system (`showStartSlot`)                      | 🔶 More flexible     |
| **End icon**                  | Fixed `Icon` (26×26)                    | Flexible slot system (`showEndSlot`)                        | 🔶 More flexible     |
| **Supporting text**           | `SupporingLine` BOOLEAN + INSTANCE_SWAP | Part of content structure                                   | ❌ No direct toggle  |
| **Divider**                   | Built-in `Stroke Line` (always visible) | `showDivider` BOOLEAN (toggleable)                          | ✅ Now configurable  |
| **Section divider**           | Not available                           | `listSlot=sectionDivider` → `.SectionDivider` (64 variants) | 🆕 OneUI-only        |
| **State layer**               | Not available                           | StateLayer frame in each variant                            | 🆕 OneUI-only        |
| **ContextMenu**               | ❌ Not in JDS                           | ✅ ContextMenu CS (4 variants) with search + slots          | 🆕 OneUI-only        |
| **Instances**                 | 0 (ListItem) + 5 (StackedListItem)      | —                                                           | Low migration volume |

---

## 6. ContextMenu — New Component (No JDS Equivalent)

JDS has no ContextMenu component. OneUI Micropatterns introduces `ContextMenu` as a container for contextual actions:

- **4 size variants** (xs/s/m/l) — scales everything proportionally
- **Built-in search** via `.SearchTrigger` — toggle with `showSearch` boolean
- **Slot-based items** — `Add ListItem ↓` SLOT accepts any number of `ListItem` instances
- **Used by `Select` component** — Select's description notes: _"showContextMenu can be switched OFF when you prefer the Select component to trigger a BottomSheet instead of a ContextMenu"_
- **Related SelectMenu components** — `SelectMenu/singleSelect`, `SelectMenu/multiSelect`, `SelectMenu/actions` are pre-configured ContextMenu wrappers with specific list item types

---

## 7. Design Tips

1. **JDS Emphasis ≠ OneUI selectedState**: JDS `Emphasis` controlled visual weight (styling). OneUI `selectedState` controls selection highlight. `Medium` emphasis → `idle` (not `medium`!). `High` emphasis → `high` only if the item is actually selected. Don't map by name — map by visual intent.

2. **Size mapping is not 1:1**: JDS had 2 sizes (M/L), OneUI has 4 (xs/s/m/l). A rough mapping: JDS `M` → OneUI `s` or `m`, JDS `L` → OneUI `m` or `l`. Check row heights visually to confirm.

3. **Supporting text requires restructuring**: JDS had a `SupporingLine` toggle + INSTANCE_SWAP. OneUI bakes supporting text into the content structure. You'll need to configure content within the slot rather than toggling a boolean.

4. **Start/End slots are more flexible**: JDS locked you into `IconContained` (start) and `Icon` (end). OneUI uses generic slots — you can put any component (avatar, badge, switch, checkbox, etc.) in start/end positions.

5. **Section dividers are built-in**: OneUI's `listSlot=sectionDivider` lets you use the same ListItem component for both data rows and section headers. The `.SectionDivider` sub-CS has 4 types: `label+divider`, `labelOnly`, `dividerOnly`, `blank`.

6. **ContextMenu is the new dropdown**: Use it for right-click menus, action menus, and select dropdowns. The built-in search trigger is perfect for filterable option lists. Stack `ListItem` instances inside the slot.

7. **fullWidth matters for padding**: `fullWidth=true` adds internal padding via LeftSpacer/RightSpacer (16px each). `fullWidth=false` has no internal padding (400px width, content fills edge-to-edge). Use `true` for standard lists, `false` when the list is inside a padded container.

8. **JDS StackedListItem/StackedList have no OneUI equivalent**: These container components (5 instances) don't map to OneUI Micropatterns. Replace with standard vertical auto-layout frames containing OneUI `ListItem` instances.

---

## 8. Migration Checklist

### ListItem

- [ ] Replace JDS `ListItem` instances with OneUI `ListItem` (`listSlot=listItem`)
- [ ] Map JDS `Emphasis` to OneUI `selectedState`:
  - [ ] `High` → `high` (only if item is selected)
  - [ ] `Medium` → `idle` (default state)
  - [ ] `low` → `idle` (not selected)
- [ ] Map JDS `Size` to OneUI `size`:
  - [ ] JDS `M` → OneUI `s` or `m` (check visually)
  - [ ] JDS `L` → OneUI `m` or `l` (check visually)
- [ ] Set `fullWidth`: `true` for standard lists, `false` for inset/container lists
- [ ] Set `contentAlignment`: `centre` (default) or `top` for multi-line rows
- [ ] Set `condensed`: `false` (default) or `true` for compact lists
- [ ] Configure start/end slots:
  - [ ] Replace fixed `IconContained` start → flexible `showStartSlot` with appropriate component
  - [ ] Replace fixed `Icon` end → flexible `showEndSlot` with appropriate component
- [ ] Restructure supporting text content (no separate toggle — part of content layout)
- [ ] Configure `showDivider` (default `true` — matches JDS behavior)

### StackedListItem / StackedList

- [ ] Replace 5 StackedListItem instances with OneUI ListItem in vertical auto-layout frames
- [ ] Handle disabled state via opacity or custom styling (no `Disabled` variant in OneUI)

### ContextMenu (New Adoption)

- [ ] Identify designs that need contextual menus, action menus, or select dropdowns
- [ ] Use OneUI `ContextMenu` with appropriate `size` (xs/s/m/l)
- [ ] Configure `showSearch`: `true` for filterable menus, `false` for short action lists
- [ ] Fill `Add ListItem ↓` slot with ListItem instances

---

---

# Carousel  ·  JDS v3 → OneUI

## Overview

|                    | JDS (Jio Testlab Library)                                                                                                                                                             | OneUI (`❖ OneUI Micropatterns`)                                                                                                                                                                                                                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Component Name** | Carousel — 1 component                                                                                                                                                                | Carousel (wrapper) → `.Carousel/heightFollowsAspectRatio` or `.Carousel/heightCustom` (internal) — 1 top-level component with layered internal architecture                                                                                                                                                                              |
| **Total Variants** | 4 (2 autoplay × 2 indicatorPosition)                                                                                                                                                  | 2 (top-level: `followsAspectRatio` true/false) × 25 internal variants each (5 widths × 5 controls) = 50+ effective combinations                                                                                                                                                                                                          |
| **Library**        | Jio Testlab Library                                                                                                                                                                   | `❖ OneUI Micropatterns`                                                                                                                                                                                                                                                                                                                  |
| **Architecture**   | Flat structure: Carousel has a Slot for content, boolean toggles for Arrows and Indicators, and variant props for autoplay and indicatorPosition. Content is placed via a Slot child. | Deeply layered architecture: Top-level Carousel (`followsAspectRatio`) wraps an internal `.Carousel` (width × controls), which wraps a `.Rail` (aspectRatio, scrim, fullWidth, contentAlignment, prev/next items), which contains CarouselImage items + ContentBlock overlay + optional `.CarouselControls` or `.CarouselSelectionRail`. |
| **Description**    | "Use InstanceUtils plugin to edit the Slot content"                                                                                                                                   | _(none)_                                                                                                                                                                                                                                                                                                                                 |

---

## Component Architecture Mapping

| JDS Component / Element        | → OneUI Component / Element                                             | Notes                                                                                                         |
| ------------------------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Carousel** (top-level)       | **Carousel** (top-level wrapper)                                        | Direct mapping but radically different internal structure                                                     |
| Slot: `"Content"`              | `.Rail` → CarouselImage items (`ItemPrev` / `ItemCurrent` / `ItemNext`) | ⚠️ JDS uses a single generic slot; OneUI uses structured image items within a Rail with aspect-ratio control  |
| `.CarouselArrow` (Back / Next) | `.Rail` → `itemPrev` / `itemNext` (BOOLEAN toggles)                     | ⚠️ JDS arrows are child instances; OneUI prev/next are booleans on the Rail                                   |
| `.CarouselIndicators`          | `.CarouselControls` → PaginationDots                                    | ⚠️ JDS indicators are always dot-style; OneUI offers dots (pagination) **OR** thumbnail rail (selectionRail)  |
| `.CarouselPlayPauseButton`     | `.CarouselControls` → `autoplay` variant                                | JDS has a visible play/pause button when `autoplay=True`; OneUI has autoplay as a variant on CarouselControls |
| _(No equivalent)_              | `.CarouselSelectionRail` (thumbnail strip)                              | ❌ OneUI-only — thumbnail-based navigation rail with size and overflow control                                |
| _(No equivalent)_              | ContentBlock (overlay content)                                          | ❌ OneUI-only — structured content overlay on slides with badges, text slots, play button                     |
| _(No equivalent)_              | `scrim` (gradient overlay)                                              | ❌ OneUI-only — configurable gradient/overlay scrim for text legibility                                       |

> **Key Structural Change:** JDS is a flat slot + arrows + dots. OneUI is 4+ layers deep (`Carousel` → `.Carousel` → `.Rail` → images/overlays/controls). Content stops being a generic slot (InstanceUtils) and becomes structured `CarouselImage` items with aspect-ratio presets.

---

## Props Mapping — Top Level

### Autoplay

|               | JDS         | OneUI                                      |
| ------------- | ----------- | ------------------------------------------ |
| **Prop Name** | `autoplay`  | Internal: `.CarouselControls` → `autoplay` |
| **Type**      | VARIANT     | VARIANT (on internal component)            |
| **Default**   | "True"      | "false"                                    |
| **Options**   | True, False | false, true                                |

#### Behavior Difference

- **JDS:** Top-level variant prop on the Carousel itself. When `True`, shows a `.CarouselPlayPauseButton` (Playing/Paused states) alongside the indicators.
- **OneUI:** Autoplay is a variant on the internal `.CarouselControls` component, only present when `controls = pagination` or `controls = paginationOnMedia`. Not a top-level prop.

> **Migration Note:** JDS `autoplay = True` → OneUI: set `controls` to `pagination` (or `paginationOnMedia`), then set `.CarouselControls` internal `autoplay = true`. **Default differs** (JDS defaults `True`, OneUI defaults `false`).

---

### Indicator Position

|               | JDS                 | OneUI                    |
| ------------- | ------------------- | ------------------------ |
| **Prop Name** | `indicatorPosition` | _(No direct equivalent)_ |
| **Type**      | VARIANT             | —                        |
| **Default**   | "bottom"            | —                        |
| **Options**   | bottom, top         | —                        |

> **Migration Note:** JDS allows indicators at the top or bottom. OneUI controls are always below the carousel rail (`controls=pagination`) or overlaid on media (`controls=paginationOnMedia`). The `paginationOnMedia` variant places controls on the image (closest to JDS `top`), while `pagination` places them below (closest to JDS `bottom`). No exact 1:1, but `paginationOnMedia` ≈ top, `pagination` ≈ bottom.

---

### Arrows

|               | JDS                | OneUI                                                                                                |
| ------------- | ------------------ | ---------------------------------------------------------------------------------------------------- |
| **Prop Name** | `Arrows` (BOOLEAN) | Internal: `.CarouselControls` → `navButtons` (BOOLEAN) + `.Rail` → `itemPrev` / `itemNext` (BOOLEAN) |
| **Type**      | BOOLEAN            | BOOLEAN (split across internal components)                                                           |
| **Default**   | true               | `navButtons`: true, `itemPrev`: true, `itemNext`: true                                               |

#### Behavior Difference

- **JDS:** Single boolean toggles a Frame `"Arrows"` containing `.CarouselArrow` Back + Next instances.
- **OneUI:** Arrow visibility is split: `navButtons` on `.CarouselControls` controls below-carousel nav buttons, while `itemPrev`/`itemNext` on `.Rail` control whether adjacent slide previews are visible.

> **Migration Note:** JDS `Arrows = true` → OneUI `navButtons = true` on CarouselControls (when using pagination controls). The `.Rail` `itemPrev`/`itemNext` booleans are a **separate concept** (adjacent item peek visibility), not direct arrow equivalents.

---

### Indicators

|               | JDS                    | OneUI                                                                    |
| ------------- | ---------------------- | ------------------------------------------------------------------------ |
| **Prop Name** | `indicators` (BOOLEAN) | `controls` (VARIANT on internal `.Carousel`)                             |
| **Type**      | BOOLEAN                | VARIANT                                                                  |
| **Default**   | true                   | "none"                                                                   |
| **Options**   | true, false            | none, pagination, paginationOnMedia, selectionRail, selectionRailOnMedia |

#### Behavior Difference

- **JDS:** Simple on/off toggle for dot indicators (`.CarouselIndicators` with `# items` = `"more than 5"` / `"less than 5"`).
- **OneUI:** `controls` is a rich VARIANT with 5 options: `none` (no controls), `pagination` (dots below), `paginationOnMedia` (dots overlaid on image), `selectionRail` (thumbnail strip below), `selectionRailOnMedia` (thumbnails overlaid).

#### Value Mapping

| JDS `indicators`                    | OneUI `controls`  | Notes                                         |
| ----------------------------------- | ----------------- | --------------------------------------------- |
| false                               | none              | No indicators/controls                        |
| true                                | pagination        | Dot indicators below carousel (closest match) |
| true (with `indicatorPosition=top`) | paginationOnMedia | Dots overlaid on media                        |

> **Migration Note:** This is a **type escalation** — JDS boolean → OneUI rich variant. Choose `pagination` for most JDS `indicators=true` cases, or `paginationOnMedia` if the indicators were positioned on top in JDS.

---

## OneUI-Only Props (New Capabilities)

### `followsAspectRatio` (Top-Level)

|                 | OneUI                                                                                                                                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Prop Name**   | `followsAspectRatio`                                                                                                                                                                                                            |
| **Type**        | VARIANT                                                                                                                                                                                                                         |
| **Default**     | "true"                                                                                                                                                                                                                          |
| **Options**     | true, false                                                                                                                                                                                                                     |
| **Description** | When `true`, carousel height is determined by the aspect ratio of the CarouselImage content. When `false` (`.Carousel/heightCustom`), height is custom/fixed. JDS has no equivalent — height is determined by the slot content. |

---

### Width / Breakpoint (Internal `.Carousel`)

|                 | OneUI                                                                                                                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Prop Name**   | _(internal width)_                                                                                                                                                                        |
| **Type**        | VARIANT                                                                                                                                                                                   |
| **Default**     | "360"                                                                                                                                                                                     |
| **Options**     | 360, 768, 1024, 1440, 1920                                                                                                                                                                |
| **Description** | Responsive breakpoint control — the carousel adapts its internal structure (Rail variant, controls layout) based on the target viewport width. JDS has no responsive breakpoint variants. |

---

### Aspect Ratio (Internal `.Rail`)

|                 | OneUI                                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Prop Name**   | `aspectRatio` (INSTANCE_SWAP)                                                                                       |
| **Type**        | INSTANCE_SWAP                                                                                                       |
| **Default**     | CarouselImage/3:4                                                                                                   |
| **Options**     | 3:4, 1:1, 4:3, 16:9, 9:16, 1:2, 21:9, auto                                                                          |
| **Description** | Controls the aspect ratio of carousel image items. JDS has no aspect ratio control — content fills the slot freely. |

---

### Content Alignment (Internal `.Rail`)

|                 | OneUI                                                                                  |
| --------------- | -------------------------------------------------------------------------------------- |
| **Prop Name**   | `contentAlignment`                                                                     |
| **Type**        | VARIANT                                                                                |
| **Default**     | "startBottom"                                                                          |
| **Options**     | startBottom, startMiddle, middleBottom, middleMiddle, middleTop                        |
| **Description** | Controls where the ContentBlock overlay is positioned on the slide. No JDS equivalent. |

---

### Full Width (Internal `.Rail`)

|                 | OneUI                                                                   |
| --------------- | ----------------------------------------------------------------------- |
| **Prop Name**   | `fullWidth`                                                             |
| **Type**        | VARIANT                                                                 |
| **Default**     | "false"                                                                 |
| **Options**     | false, true                                                             |
| **Description** | Whether the carousel rail items span the full width. No JDS equivalent. |

---

### Scrim (Internal `.Rail`)

|                 | OneUI                                                                                                                                                                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Prop Name**   | `scrim`                                                                                                                                                                                                                                        |
| **Type**        | BOOLEAN                                                                                                                                                                                                                                        |
| **Default**     | true                                                                                                                                                                                                                                           |
| **Description** | Gradient/overlay scrim for text legibility on images. Internal scrim component has its own props: `position` (bottom/left/top/right/center), `size` (XS–full), `attention` (low/medium/high), `variant` (gradient/overlay). No JDS equivalent. |

---

### Selection Rail Controls (Internal `.CarouselSelectionRail`)

|                 | OneUI                                                                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Size**        | `size`: VARIANT (`s`, `m`, `l`, `xl`, `2xl`)                                                                                                          |
| **Overflow**    | `overflow`: VARIANT (`true`, `false`)                                                                                                                 |
| **Description** | Thumbnail strip navigation — each item is a `.CarouselSelectionRail.Item` with `active` (true/false) and `surface` (opaque) props. No JDS equivalent. |

---

### ContentBlock Overlay (Internal)

|                 | OneUI                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| **Slots**       | `↳ badgesStart`, `↳ badgesEnd`, `↳ content` (×3 levels)                                                |
| **Props**       | `playButton` (BOOLEAN), `contentWidth` (VARIANT: fill/l/m/s)                                           |
| **Description** | Rich overlay content system on carousel slides — badges, text content, play button. No JDS equivalent. |

---

## Full Props Comparison Table

| #   | Prop Concept            | JDS Prop                           | JDS Type | JDS Values                   | JDS Default   | OneUI Prop                     | OneUI Location                 | OneUI Type       | OneUI Values                                                             | OneUI Default     | Status                                  |
| --- | ----------------------- | ---------------------------------- | -------- | ---------------------------- | ------------- | ------------------------------ | ------------------------------ | ---------------- | ------------------------------------------------------------------------ | ----------------- | --------------------------------------- |
| 1   | Autoplay                | `autoplay`                         | VARIANT  | True, False                  | True          | `autoplay`                     | `.CarouselControls` (internal) | VARIANT          | false, true                                                              | false             | ⚠️ Moved to internal, default differs   |
| 2   | Indicator position      | `indicatorPosition`                | VARIANT  | bottom, top                  | bottom        | `controls`                     | `.Carousel` (internal)         | VARIANT          | none, pagination, paginationOnMedia, selectionRail, selectionRailOnMedia | none              | ⚠️ Subsumed into `controls` variant     |
| 3   | Show arrows             | `Arrows`                           | BOOLEAN  | true, false                  | true          | `navButtons`                   | `.CarouselControls` (internal) | BOOLEAN          | true, false                                                              | true              | ⚠️ Moved to internal                    |
| 4   | Show indicators         | `indicators`                       | BOOLEAN  | true, false                  | true          | `controls`                     | `.Carousel` (internal)         | VARIANT          | none, pagination, paginationOnMedia, selectionRail, selectionRailOnMedia | none              | ⚠️ Type change (BOOLEAN → VARIANT)      |
| 5   | Content                 | Slot: `"Content"`                  | Slot     | —                            | —             | CarouselImage items in `.Rail` | `.Rail` (internal)             | Structured items | —                                                                        | CarouselImage/3:4 | ⚠️ Mechanism change (slot → structured) |
| 6   | Follows aspect ratio    | _(N/A)_                            | —        | —                            | —             | `followsAspectRatio`           | Carousel (top-level)           | VARIANT          | true, false                                                              | true              | ❌ OneUI-only (new)                     |
| 7   | Width / breakpoint      | _(N/A)_                            | —        | —                            | —             | _(internal width)_             | `.Carousel` (internal)         | VARIANT          | 360, 768, 1024, 1440, 1920                                               | 360               | ❌ OneUI-only (new)                     |
| 8   | Aspect ratio            | _(N/A)_                            | —        | —                            | —             | `aspectRatio`                  | `.Rail` (internal)             | INSTANCE_SWAP    | 3:4, 1:1, 4:3, 16:9, 9:16, 1:2, 21:9, auto                               | 3:4               | ❌ OneUI-only (new)                     |
| 9   | Content alignment       | _(N/A)_                            | —        | —                            | —             | `contentAlignment`             | `.Rail` (internal)             | VARIANT          | startBottom, startMiddle, middleBottom, middleMiddle, middleTop          | startBottom       | ❌ OneUI-only (new)                     |
| 10  | Full width              | _(N/A)_                            | —        | —                            | —             | `fullWidth`                    | `.Rail` (internal)             | VARIANT          | false, true                                                              | false             | ❌ OneUI-only (new)                     |
| 11  | Scrim                   | _(N/A)_                            | —        | —                            | —             | `scrim`                        | `.Rail` (internal)             | BOOLEAN          | true, false                                                              | true              | ❌ OneUI-only (new)                     |
| 12  | Prev/Next item peek     | _(N/A)_                            | —        | —                            | —             | `itemPrev` / `itemNext`        | `.Rail` (internal)             | BOOLEAN          | true, false                                                              | true              | ❌ OneUI-only (new)                     |
| 13  | Selection rail size     | _(N/A)_                            | —        | —                            | —             | `size`                         | `.CarouselSelectionRail`       | VARIANT          | s, m, l, xl, 2xl                                                         | m                 | ❌ OneUI-only (new)                     |
| 14  | Selection rail overflow | _(N/A)_                            | —        | —                            | —             | `overflow`                     | `.CarouselSelectionRail`       | VARIANT          | true, false                                                              | true              | ❌ OneUI-only (new)                     |
| 15  | Content overlay         | _(N/A)_                            | —        | —                            | —             | ContentBlock slots             | `.Rail` (internal)             | SLOT × multiple  | badges, content, playButton                                              | —                 | ❌ OneUI-only (new)                     |
| 16  | Indicator count         | `.CarouselIndicators` `# items`    | VARIANT  | "more than 5", "less than 5" | "more than 5" | PaginationDots → `pageCount`   | `.CarouselControls` (internal) | VARIANT          | 2, 3, 4, 5, 5+                                                           | 5+                | ⚠️ Richer options in OneUI              |
| 17  | Play/Pause button       | `.CarouselPlayPauseButton` `State` | VARIANT  | Playing, Paused              | Playing       | _(internal to autoplay)_       | `.CarouselControls`            | —                | —                                                                        | —                 | ⚠️ Internalized in OneUI                |

---

## Key Architecture Differences

| Aspect               | JDS                                                   | OneUI                                                                                                                           |
| -------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Depth**            | Flat: 1 level of nesting (Carousel → Slot + Controls) | Deep: 4+ levels (Carousel → `.Carousel` → `.Rail` → CarouselImage + ContentBlock + scrim)                                       |
| **Content model**    | Generic slot — any content via InstanceUtils plugin   | Structured: CarouselImage items with predefined aspect ratios + ContentBlock overlays                                           |
| **Responsive**       | No breakpoint awareness                               | 5 breakpoint variants (360–1920) with adapted internal layouts                                                                  |
| **Controls variety** | Dots only (on/off)                                    | 4 control types: pagination dots, pagination on media, selection rail, selection rail on media                                  |
| **Navigation**       | Arrows (Back/Next) as visible child instances         | `navButtons` boolean + prev/next item peek (`itemPrev`/`itemNext`)                                                              |
| **Visual polish**    | No scrim, no content alignment, no overlay content    | Rich scrim system (position, size, attention, variant), content alignment (5 positions), ContentBlock with badges + play button |
| **Aspect ratio**     | Determined by slot content                            | Explicit `aspectRatio` INSTANCE_SWAP with 8 presets (3:4, 1:1, 4:3, 16:9, 9:16, 1:2, 21:9, auto)                                |

---

## Migration Checklist

- [ ] Swap JDS Carousel → OneUI Carousel from `❖ OneUI Micropatterns`
- [ ] Set `followsAspectRatio` — choose `true` (aspect-ratio driven height) or `false` (custom height) based on your use case
- [ ] Map `autoplay`: JDS `autoplay = True` → set OneUI `controls = pagination` (or `paginationOnMedia`), then on `.CarouselControls` set `autoplay = true`. **Default differs** (JDS True → OneUI false)
- [ ] Map `indicators`: JDS `indicators = true` → OneUI `controls = pagination` (bottom) or `paginationOnMedia` (on media)
- [ ] Map indicator position: JDS `indicatorPosition = bottom` → `controls = pagination`; `indicatorPosition = top` → `controls = paginationOnMedia`
- [ ] Map arrows: JDS `Arrows = true` → OneUI `.CarouselControls` `navButtons = true`
- [ ] Migrate content: Replace JDS Slot content with OneUI CarouselImage items in the `.Rail` — choose appropriate `aspectRatio` (default 3:4)
- [ ] Configure `contentAlignment` if overlay content is needed (default: `startBottom`)
- [ ] Configure `scrim` for text legibility on images (default: `true`)
- [ ] Note: OneUI adds significant capabilities not in JDS — `selectionRail` controls, ContentBlock overlays, responsive breakpoints, `fullWidth` option, item peek (`itemPrev`/`itemNext`)
- [ ] Note: JDS Slot-based content model (via InstanceUtils plugin) is replaced by structured CarouselImage items — this is a **fundamental content architecture change**

---
