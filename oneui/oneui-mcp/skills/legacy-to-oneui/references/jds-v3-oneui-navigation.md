---
name: jds-v3-oneui-navigation
description: >-
  JDS v3 (Jio Testlab Library) → OneUI migration mapping for app headers and bottom navigation. Covers Header, HeaderNative, HeaderWeb, BottomNavigation.
  Use when swapping or prop-mapping any of these components while converting a reference file to OneUI.
---

# Navigation chrome — JDS v3 → OneUI migration

Part of the JDS v3 → OneUI migration skill set. For routing across all component behaviours, load
`get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-migration-figma-agent.md")`.

**Load this skill when migrating:** Header, HeaderNative, HeaderWeb, BottomNavigation.

## Components in this skill

- **Header (HeaderNative / HeaderWeb)** — search `Header`
- **BottomNavigation** — search `BottomNavigation`

Jump straight to the component you need — each has its own Overview, Props Mapping, full comparison
table, and Migration Checklist. Do not invent prop names or variant values; use the tables below.

---

## Explicit mapping rules (override the tables below)

### HeaderNative owns the status bar

**Never place a standalone Status Bar component when using HeaderNative.** The HeaderNative
micropattern already includes a built-in Status Bar internally. Adding a separate Status Bar
alongside it creates duplication and breaks the component hierarchy.

| Scenario | What to do |
|---|---|
| Screen needs a status bar + navigation header | Use **HeaderNative** only. It includes a Status Bar internally — do NOT add a separate Status Bar component. |
| Status bar content should be visible (time, battery, signal) | Leave the HeaderNative's internal Status Bar at its default (`White status bar = false`). The content renders normally. |
| Status bar content should be hidden (e.g. over a dark/coloured hero, splash screen) | Set `White status bar = true` on the HeaderNative's internal Status Bar. This hides the status bar content while keeping the space reserved. |

**In short:** HeaderNative owns the status bar. Configure it through HeaderNative's internal Status
Bar prop — never instantiate a standalone Status Bar next to it.

Icons placed in the header (back, close, overflow) are **IconButton**, never a bare Icon in a frame —
see `get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-media-and-identity.md")` for the full icon decision rule.

---

# Header (HeaderNative / HeaderWeb)  ·  JDS v3 → OneUI

## Overview

|                    | JDS (Jio Testlab Library)                                                                                                                                                                                           | OneUI (`❖ OneUI Micropatterns`)                                                                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Component Name** | TopNavigation + HeaderNavigation + HeaderNavigationItem — 3 separate components                                                                                                                                     | HeaderNative (mobile) + HeaderWeb (desktop) + Header.Item — 3 components, differently scoped                                                                                                            |
| **Total Variants** | 5 (TopNavigation) + 18 (HeaderNavigation) + 54 (HeaderNavigationItem) = 77 total                                                                                                                                    | 2 (HeaderNative) + 1 (HeaderWeb standalone) = 3 total                                                                                                                                                   |
| **Library**        | Jio Testlab Library                                                                                                                                                                                                 | `❖ OneUI Micropatterns`                                                                                                                                                                                 |
| **Architecture**   | TopNavigation = mobile app bar (homeBar/contextBar with back button, avatar, title). HeaderNavigation = horizontal tab navigation (wraps HeaderNavigationItem children). HeaderNavigationItem = individual nav tab. | HeaderNative = mobile header (wraps PrimaryNav + optional SecondaryNav + Divider). HeaderWeb = desktop header (wraps PrimaryNav + optional SecondaryNav + Dividers). Header.Item = individual nav item. |
| **Page**           | Navigation                                                                                                                                                                                                          | ↳ Header                                                                                                                                                                                                |

---

## Component Architecture Mapping

| JDS Component            | → OneUI Component                                                                                     | Notes                                                                                                                               |
| ------------------------ | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **TopNavigation**        | **HeaderNative** → internal PrimaryNav                                                                | ⚠️ JDS TopNavigation maps to the PrimaryNav child inside OneUI HeaderNative. The `type` prop (`homeBar`/`contextBar`) carries over. |
| **HeaderNavigation**     | **HeaderNative** → internal SecondaryNav (with `secondaryNav = true`) **OR** HeaderWeb → SecondaryNav | ⚠️ JDS's tab-style HeaderNavigation maps to the SecondaryNav child inside OneUI's header components.                                |
| **HeaderNavigationItem** | **Header.Item**                                                                                       | Individual nav tab/item mapping                                                                                                     |

> **Key Structural Change:** JDS keeps the mobile app bar (`TopNavigation`) and tab navigation (`HeaderNavigation`) as independent components you compose yourself. OneUI nests them: `HeaderNative` / `HeaderWeb` wrap PrimaryNav + SecondaryNav + Dividers into a single unit. Desktop gets a dedicated `HeaderWeb` that JDS never had.

---

## Props Mapping — TopNavigation → HeaderNative (PrimaryNav)

### Type

|               | JDS          | OneUI (PrimaryNav inside HeaderNative) |
| ------------- | ------------ | -------------------------------------- |
| **Prop Name** | `type`       | `type`                                 |
| **Type**      | VARIANT      | VARIANT                                |
| **Default**   | "contextBar" | "homeBar"                              |

#### Value Mapping

| JDS `type` | OneUI PrimaryNav `type` | Notes                                  |
| ---------- | ----------------------- | -------------------------------------- |
| homeBar    | homeBar                 | Direct mapping                         |
| contextBar | contextBar              | Direct mapping                         |
| _(N/A)_    | searchBar               | ❌ OneUI-only — new search bar variant |

> **Important:** The **default value differs** — JDS defaults to `contextBar`, OneUI PrimaryNav defaults to `homeBar`. Always explicitly set `type` during migration.

---

### Expanded

|               | JDS         | OneUI (PrimaryNav) |
| ------------- | ----------- | ------------------ |
| **Prop Name** | `expanded`  | `expanded`         |
| **Type**      | VARIANT     | VARIANT            |
| **Default**   | "false"     | "false"            |
| **Options**   | true, false | true, false        |

> **Migration Note:** ✅ Direct 1:1 mapping. Same default.

---

### OnScroll

|               | JDS         | OneUI                     |
| ------------- | ----------- | ------------------------- |
| **Prop Name** | `onScroll`  | _(Not exposed as a prop)_ |
| **Type**      | VARIANT     | —                         |
| **Default**   | "false"     | —                         |
| **Options**   | true, false | —                         |

> **Migration Note:** JDS-only prop. OneUI does not have an explicit scroll-state variant. Lost in migration — handle via prototype interactions or separate scroll-state frames if needed.

---

### Show Avatar

|               | JDS                     | OneUI (PrimaryNav) |
| ------------- | ----------------------- | ------------------ |
| **Prop Name** | `Show Avatar` (BOOLEAN) | `avatar` (BOOLEAN) |
| **Type**      | BOOLEAN                 | BOOLEAN            |
| **Default**   | true                    | true               |

> **Migration Note:** ✅ Direct 1:1 mapping. Rename only: `Show Avatar` → `avatar`.

---

### Show Back Button

|               | JDS                          | OneUI (PrimaryNav) |
| ------------- | ---------------------------- | ------------------ |
| **Prop Name** | `Show Back Button` (BOOLEAN) | `start` (BOOLEAN)  |
| **Type**      | BOOLEAN                      | BOOLEAN            |
| **Default**   | true                         | false              |

> **Important:** The **default value differs** — JDS defaults to `true` (back button visible), OneUI defaults to `false` (start slot hidden). Always explicitly set `start` during migration. The `start` slot in OneUI is more generic (not just a back button) — it can hold any start action.

---

### Title

|               | JDS                               | OneUI (PrimaryNav) |
| ------------- | --------------------------------- | ------------------ |
| **Prop Name** | _(Child Text component instance)_ | `↳ title` (TEXT)   |
| **Type**      | Child instance TEXT               | TEXT               |
| **Default**   | —                                 | "Title"            |

#### Behavior Difference

- **JDS:** Title is a nested Text component instance (Body M variant) inside the TopNavigation. The text is overridden on the child instance.
- **OneUI:** Title is a top-level TEXT prop (`↳ title`) on the PrimaryNav child, directly settable without navigating into the layer tree.

> **Migration Note:** Extract title text from JDS's nested Text child instance → set on OneUI's `↳ title` TEXT prop.

---

### New Props in OneUI PrimaryNav (No JDS Equivalent)

| Prop Name         | Type    | Default          | Description                                                  |
| ----------------- | ------- | ---------------- | ------------------------------------------------------------ |
| `searchInput`     | BOOLEAN | false            | Toggles a built-in search input in the header                |
| `endActions`      | BOOLEAN | true             | Toggles end action buttons slot                              |
| `↳ endActions`    | SLOT    | —                | Slot content for end actions                                 |
| `↳ endActions`    | SLOT    | —                | Additional end actions slot (contextBar)                     |
| `statusBar`       | BOOLEAN | false            | Toggles an embedded status bar                               |
| `end`             | BOOLEAN | true             | Toggles the end slot                                         |
| `secondaryText`   | BOOLEAN | true             | Toggles secondary text below title                           |
| `↳ secondaryText` | TEXT    | "Secondary text" | Secondary text content                                       |
| `type: searchBar` | VARIANT | —                | New searchBar type variant (JDS only has homeBar/contextBar) |

---

## Props Mapping — HeaderNavigation → SecondaryNav

### Size → (Not directly mapped)

|               | JDS                  | OneUI (SecondaryNav)              |
| ------------- | -------------------- | --------------------------------- |
| **Prop Name** | `Size`               | _(Not exposed — no size variant)_ |
| **Type**      | VARIANT              | —                                 |
| **Default**   | "XS"                 | —                                 |
| **Options**   | XS, S, M, L, XL, 2XL | —                                 |

> **Migration Note:** JDS HeaderNavigation has **6 sizes**. OneUI SecondaryNav has **no size variant** — size is fixed. All 6 JDS size variants collapse to a single OneUI size.

---

### Emphasis → Attention

|               | JDS               | OneUI (SecondaryNav) |
| ------------- | ----------------- | -------------------- |
| **Prop Name** | `Emphasis`        | `attention`          |
| **Type**      | VARIANT           | VARIANT              |
| **Default**   | "Medium"          | "medium"             |
| **Options**   | Low, Medium, High | low, medium, high    |

#### Value Mapping

| JDS `Emphasis` | OneUI `attention` | Notes                             |
| -------------- | ----------------- | --------------------------------- |
| Low            | low               | Direct mapping                    |
| Medium         | medium            | Direct mapping ✅ (both defaults) |
| High           | high              | Direct mapping                    |

> **Migration Note:** ✅ Direct 1:1 mapping with same default. Rename only.

---

### SecondaryNav Slots

| OneUI (SecondaryNav)   | Description                                                          |
| ---------------------- | -------------------------------------------------------------------- |
| `start`                | BOOLEAN (default: false) — start slot toggle                         |
| `↳ secondaryNav.items` | SLOT — nav item content slots (3 slot props for different positions) |

> **Migration Note:** OneUI SecondaryNav uses SLOT props for item content. JDS HeaderNavigation uses direct HeaderNavigationItem child instances. You'll override the slot content with Header.Item instances in OneUI.

---

## Props Mapping — HeaderNavigationItem → Header.Item

### Size → (Not directly mapped)

|               | JDS        | OneUI (Header.Item) |
| ------------- | ---------- | ------------------- |
| **Prop Name** | `Size`     | _(No size variant)_ |
| **Type**      | VARIANT    | —                   |
| **Options**   | XS–2XL (6) | —                   |

> **Migration Note:** Header.Item in OneUI has no size variant. Size is inherited from context.

---

### Emphasis → (Internal attention)

|               | JDS               | OneUI (Header.Item internal `.Header.Item`) |
| ------------- | ----------------- | ------------------------------------------- |
| **Prop Name** | `Emphasis`        | `attention` (on internal child)             |
| **Type**      | VARIANT           | VARIANT                                     |
| **Options**   | Low, Medium, High | low, medium, high                           |

> **Migration Note:** Attention is on the internal `.Header.Item` child instance, not directly on Header.Item itself. Override the nested child's `attention` prop.

---

### State

|               | JDS         | OneUI (Header.Item internal) |
| ------------- | ----------- | ---------------------------- |
| **Prop Name** | `State`     | _(internal state)_           |
| **Type**      | VARIANT     | VARIANT (internal)           |
| **Default**   | "Idle"      | "idle"                       |
| **Options**   | Idle, Hover | idle (and likely others)     |

> **Migration Note:** State is internalized on OneUI's `.Header.Item` child. JDS `State = Hover` for spec frames will need to be handled via internal overrides.

---

### Active

|               | JDS         | OneUI (Header.Item internal) |
| ------------- | ----------- | ---------------------------- |
| **Prop Name** | `Active`    | `active` (on internal child) |
| **Type**      | VARIANT     | VARIANT                      |
| **Default**   | "False"     | "false"                      |
| **Options**   | False, True | false, true (likely)         |

> **Migration Note:** Maps to internal `.Header.Item` child's `active` prop. Same concept, but requires nested override.

---

### Start / End Icons

|           | JDS (HeaderNavigationItem)        | OneUI (Header.Item internal)               |
| --------- | --------------------------------- | ------------------------------------------ |
| **Start** | `Start` (BOOLEAN, default: false) | `start` (on internal child, default: none) |
| **End**   | `End` (BOOLEAN, default: false)   | `end` (on internal child, default: none)   |

> **Migration Note:** Both have start/end slot toggles. OneUI uses `none` as the off value rather than a boolean `false`. The swap mechanism moves from a simple boolean toggle to an internal child prop.

---

## Full Props Comparison Table

| #   | Prop Concept         | JDS Prop           | JDS Source           | JDS Type   | JDS Values          | JDS Default | OneUI Prop         | OneUI Source           | OneUI Type | OneUI Values                   | OneUI Default | Status                                   |
| --- | -------------------- | ------------------ | -------------------- | ---------- | ------------------- | ----------- | ------------------ | ---------------------- | ---------- | ------------------------------ | ------------- | ---------------------------------------- |
| 1   | Nav type             | `type`             | TopNavigation        | VARIANT    | homeBar, contextBar | contextBar  | `type`             | PrimaryNav (internal)  | VARIANT    | homeBar, contextBar, searchBar | homeBar       | ✅ 1:1 + new searchBar (default differs) |
| 2   | Expanded             | `expanded`         | TopNavigation        | VARIANT    | true, false         | false       | `expanded`         | PrimaryNav (internal)  | VARIANT    | true, false                    | false         | ✅ Direct match                          |
| 3   | On Scroll            | `onScroll`         | TopNavigation        | VARIANT    | true, false         | false       | _(none)_           | —                      | —          | —                              | —             | ❌ JDS-only                              |
| 4   | Show Avatar          | `Show Avatar`      | TopNavigation        | BOOLEAN    | true, false         | true        | `avatar`           | PrimaryNav (internal)  | BOOLEAN    | true, false                    | true          | ✅ Direct match                          |
| 5   | Show Back Button     | `Show Back Button` | TopNavigation        | BOOLEAN    | true, false         | true        | `start`            | PrimaryNav (internal)  | BOOLEAN    | true, false                    | false         | ✅ 1:1 (default differs)                 |
| 6   | Title text           | _(child Text)_     | TopNavigation        | Child TEXT | free text           | —           | `↳ title`          | PrimaryNav (internal)  | TEXT       | free text                      | "Title"       | ⚠️ Mechanism change                      |
| 7   | Header nav size      | `Size`             | HeaderNavigation     | VARIANT    | XS–2XL (6)          | XS          | _(none)_           | SecondaryNav           | —          | —                              | —             | ❌ JDS-only (6 sizes lost)               |
| 8   | Header nav emphasis  | `Emphasis`         | HeaderNavigation     | VARIANT    | Low, Medium, High   | Medium      | `attention`        | SecondaryNav           | VARIANT    | low, medium, high              | medium        | ✅ Direct match                          |
| 9   | Nav item size        | `Size`             | HeaderNavigationItem | VARIANT    | XS–2XL (6)          | XS          | _(none)_           | Header.Item            | —          | —                              | —             | ❌ JDS-only                              |
| 10  | Nav item emphasis    | `Emphasis`         | HeaderNavigationItem | VARIANT    | Low, Medium, High   | Medium      | `attention`        | Header.Item (internal) | VARIANT    | low, medium, high              | low           | ⚠️ Internalized                          |
| 11  | Nav item state       | `State`            | HeaderNavigationItem | VARIANT    | Idle, Hover         | Idle        | _(internal state)_ | Header.Item (internal) | VARIANT    | idle, etc.                     | idle          | ⚠️ Internalized                          |
| 12  | Nav item active      | `Active`           | HeaderNavigationItem | VARIANT    | False, True         | False       | `active`           | Header.Item (internal) | VARIANT    | false, true                    | false         | ⚠️ Internalized                          |
| 13  | Nav item start       | `Start`            | HeaderNavigationItem | BOOLEAN    | true, false         | false       | `start`            | Header.Item (internal) | VARIANT    | none, etc.                     | none          | ⚠️ Type change                           |
| 14  | Nav item end         | `End`              | HeaderNavigationItem | BOOLEAN    | true, false         | false       | `end`              | Header.Item (internal) | VARIANT    | none, etc.                     | none          | ⚠️ Type change                           |
| 15  | Secondary nav toggle | _(N/A)_            | —                    | —          | —                   | —           | `secondaryNav`     | HeaderNative           | VARIANT    | true, false                    | false         | ❌ OneUI-only (new)                      |
| 16  | Divider              | _(N/A)_            | —                    | —          | —                   | —           | `divider`          | HeaderNative           | BOOLEAN    | true, false                    | true          | ❌ OneUI-only (new)                      |
| 17  | Search input         | _(N/A)_            | —                    | —          | —                   | —           | `searchInput`      | PrimaryNav (internal)  | BOOLEAN    | true, false                    | false         | ❌ OneUI-only (new)                      |
| 18  | End actions          | _(N/A)_            | —                    | —          | —                   | —           | `endActions`       | PrimaryNav (internal)  | BOOLEAN    | true, false                    | true          | ❌ OneUI-only (new)                      |
| 19  | Status bar           | _(N/A)_            | —                    | —          | —                   | —           | `statusBar`        | PrimaryNav (internal)  | BOOLEAN    | true, false                    | false         | ❌ OneUI-only (new)                      |
| 20  | Secondary text       | _(N/A)_            | —                    | —          | —                   | —           | `secondaryText`    | PrimaryNav (internal)  | BOOLEAN    | true, false                    | true          | ❌ OneUI-only (new)                      |

---

## Key Architecture Differences

| Aspect             | JDS                                                                                    | OneUI                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Mobile app bar** | TopNavigation — standalone component                                                   | HeaderNative → wraps PrimaryNav (internal component set)                                     |
| **Tab navigation** | HeaderNavigation — standalone component wrapping HeaderNavigationItem children         | SecondaryNav (internal to HeaderNative/HeaderWeb) — uses SLOT props for items                |
| **Desktop header** | _(No dedicated desktop header)_                                                        | HeaderWeb — standalone component with PrimaryNav + SecondaryNav + dividers                   |
| **Nav items**      | HeaderNavigationItem — fully exposed props (Size, Emphasis, State, Active, Start, End) | Header.Item — thin wrapper, most props on internal `.Header.Item` child                      |
| **Composition**    | Flat — TopNavigation and HeaderNavigation are independent, composed manually           | Nested — HeaderNative/HeaderWeb wrap PrimaryNav + SecondaryNav + Dividers into a single unit |

---

## Migration Checklist

- [ ] Map JDS TopNavigation → OneUI HeaderNative:
  - [ ] Set PrimaryNav `type` (`homeBar`/`contextBar`) — **default differs** (`contextBar` → `homeBar`)
  - [ ] Set PrimaryNav `expanded` (direct mapping)
  - [ ] Map `Show Avatar` → PrimaryNav `avatar` (direct mapping)
  - [ ] Map `Show Back Button` → PrimaryNav `start` — **default differs** (`true` → `false`)
  - [ ] Extract title text from nested child → set PrimaryNav `↳ title`
  - [ ] Handle `onScroll` — lost in migration
- [ ] Map JDS HeaderNavigation → OneUI HeaderNative with `secondaryNav = true`:
  - [ ] Map `Emphasis` → SecondaryNav `attention` (direct mapping)
  - [ ] Handle `Size` — 6 sizes lost, OneUI SecondaryNav has no size variant
  - [ ] Migrate HeaderNavigationItem children → Header.Item instances in SecondaryNav slots
- [ ] Map JDS HeaderNavigationItem → OneUI Header.Item:
  - [ ] Map `Active` → internal `.Header.Item` `active` (requires nested override)
  - [ ] Map `Emphasis` → internal `.Header.Item` `attention` (requires nested override)
  - [ ] Map `Start`/`End` booleans → internal `start`/`end` props (type change: BOOLEAN → VARIANT)
  - [ ] Handle `State = Hover` — internalized, lost as a static variant
  - [ ] Handle `Size` — lost, no equivalent
- [ ] Decide whether to use **HeaderNative** (mobile) or **HeaderWeb** (desktop) based on context
- [ ] Configure new props: `divider`, `searchInput`, `endActions`, `statusBar`, `secondaryText`

---

---

---

# BottomNavigation  ·  JDS v3 → OneUI

## 1. Overview

| Component            | JDS (Jio Testlab Library)                                                                                                                                                                        | OneUI Micropatterns                                                                                                                      | Migration Type       |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| **BottomNavigation** | ✅ `BottomNavigation` (standalone component, 0 variant props) — fixed 4-item nav bar with manual item add/remove via DevUtils Plugin. `BottomNavigationItem` CS (2 variants: Active True/False). | ✅ `BottomNav` (CS, 12 variants) — `label` × `items`. 3 item sub-CS for label modes (1Line/2Line/labelFalse), each with `active` On/Off. | 🔶 Major restructure |

---

## 2. Architecture Differences

| Aspect                  | JDS                                                                                                                                              | OneUI Micropatterns                                                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Container Structure** | `BottomNavigation` is a **standalone component** (not a component set) — no variant props. Description says _"Add Items using DevUtils Plugin"_. | `BottomNav` is a **component set** with 12 variants (label × items). Item count is a VARIANT prop.                                                 |
| **Item Count Control**  | Manual — add/remove `BottomNavigationItem` instances by hand or via DevUtils Plugin. Default: 4 visible + 1 hidden (5th slot).                   | VARIANT prop `items`: 2, 3, 4, 5 — pre-configured item counts per variant                                                                          |
| **Label Visibility**    | Always visible — label is baked into `BottomNavigationItem`                                                                                      | VARIANT prop `label`: `1Line`, `2Line`, `none` — 3 label modes                                                                                     |
| **Label Text**          | Nested `Label` instance (JDS `Label` CS with Text, Emphasis, Weight, Tinted props)                                                               | Direct TEXT node (`Label`, 12px) + `↳ label` TEXT prop on item sub-CS                                                                              |
| **Item Component**      | `BottomNavigationItem` CS (2 variants: `Active`: True/False)                                                                                     | 3 item sub-CS by label mode: `.BottomNav.Item/label1Line`, `.BottomNav.Item/label2Line`, `.BottomNav.Item/labelFalse` — each with `active`: On/Off |
| **Active State Naming** | `Active`: `True` / `False` (PascalCase VARIANT)                                                                                                  | `active`: `On` / `Off` (camelCase VARIANT)                                                                                                         |
| **Icon System**         | JDS `Icon` CS instance (Emphasis/Size/Tinted props) with `Icon Asset` INSTANCE_SWAP                                                              | OneUI Slot system: `Slot/size5/IconTinted` (active) / `Slot/size5/IconLow` (inactive) wrapping `Icon` → `Icon Asset` INSTANCE_SWAP                 |
| **Active Icon Style**   | `Emphasis=Medium, Size=M, Tinted=True` → 20×20 icon                                                                                              | `Slot/size5/IconTinted` → 20×20 icon (tinted/highlighted)                                                                                          |
| **Inactive Icon Style** | `Emphasis=Low, Size=M, Tinted=False` → 20×20 icon                                                                                                | `Slot/size5/IconLow` → 20×20 icon (dimmed)                                                                                                         |
| **No-Label Icon Size**  | Not configurable — always 20×20                                                                                                                  | 24×24 (`Slot/size6/IconTinted`) — larger icon when label is hidden                                                                                 |
| **Divider/Stroke**      | `Stroke Line` instance (JDS `Stroke Line` CS, Emphasis=Minimal) — positioned absolutely                                                          | `Divider` instance (OneUI `Divider` CS, orientation=horizontal, attention=low) — positioned absolutely                                             |
| **State Layer**         | Not present                                                                                                                                      | `state layer` FRAME wrapping icon + label — touch target area                                                                                      |
| **Container Padding**   | 16px all sides                                                                                                                                   | 16px left/right, 0px top/bottom                                                                                                                    |
| **Item Spacing**        | 4px between items                                                                                                                                | 0px between items (items fill-distribute)                                                                                                          |
| **Width**               | 360px                                                                                                                                            | 360px                                                                                                                                              |
| **Height**              | 70px                                                                                                                                             | 64px (1Line), 72px (2Line), 56px (none)                                                                                                            |
| **Label Font Size**     | 10px (via Label 2XS)                                                                                                                             | 12px (direct TEXT node)                                                                                                                            |
| **2-Line Labels**       | Not supported — always single-line                                                                                                               | ✅ `label=2Line` variant with `↳ label` TEXT default: "Label can go into 2 lines"                                                                  |
| **Multi-Line Default**  | Not applicable                                                                                                                                   | "Label can go into 2 lines" — 12px, 24px height                                                                                                    |

---

## 3. Props Mapping

### 3.1 JDS `BottomNavigation` → OneUI `BottomNav`

| JDS Prop                            | Type | Default | OneUI Equivalent | OneUI Type | Default | Notes                                             |
| ----------------------------------- | ---- | ------- | ---------------- | ---------- | ------- | ------------------------------------------------- |
| _(no props — standalone component)_ | —    | —       | `label`          | VARIANT    | `1Line` | 🆕 Label display mode                             |
| _(no props)_                        | —    | —       | `items`          | VARIANT    | `2`     | 🆕 Item count (2/3/4/5)                           |
| _(manual item add/remove)_          | —    | —       | `items` VARIANT  | —          | —       | JDS required DevUtils Plugin; OneUI uses variants |

### 3.2 JDS `BottomNavigationItem` → OneUI `.BottomNav.Item/*`

| JDS Prop                                | Type          | Default                        | OneUI Equivalent                      | OneUI Type    | Default                                       | Notes                                                     |
| --------------------------------------- | ------------- | ------------------------------ | ------------------------------------- | ------------- | --------------------------------------------- | --------------------------------------------------------- |
| `Active`                                | VARIANT       | `True`                         | `active`                              | VARIANT       | `On`                                          | ⚠️ Value change: True/False → On/Off                      |
| _(Icon Asset via nested Icon instance)_ | INSTANCE_SWAP | `ic_favorite`                  | _(Icon Asset via nested Slot → Icon)_ | INSTANCE_SWAP | `ic_home` (active) / `ic_favorite` (inactive) | 🔶 Same mechanism, different wrapper (Slot system)        |
| _(Label via nested Label instance)_     | TEXT          | `"Label"`                      | `↳ label`                             | TEXT          | `"Label"`                                     | 🔶 JDS used Label CS; OneUI uses direct TEXT prop         |
| _(Label emphasis via Label CS)_         | —             | High (active) / Low (inactive) | _(built into item sub-CS)_            | —             | —                                             | OneUI handles active/inactive label styling automatically |

### 3.3 Default Shifts ⚠️

| Aspect              | JDS Default                 | OneUI Default                                | Risk                                                        |
| ------------------- | --------------------------- | -------------------------------------------- | ----------------------------------------------------------- |
| Default item count  | 4 visible (manual)          | `items=2`                                    | ⚠️ HIGH — OneUI defaults to 2, must explicitly set to match |
| Active value naming | `True` / `False`            | `On` / `Off`                                 | LOW — cosmetic                                              |
| Container height    | 70px fixed                  | 64px (1Line)                                 | ⚠️ MEDIUM — 6px shorter, may affect layout                  |
| Label font size     | 10px                        | 12px                                         | ⚠️ MEDIUM — OneUI labels are 2px larger                     |
| Item spacing        | 4px gap                     | 0px (fill-distribute)                        | LOW — items fill available space equally                    |
| Container padding   | 16px all sides              | 16px LR, 0px TB                              | ⚠️ MEDIUM — no top/bottom padding in OneUI                  |
| Default icon        | `ic_favorite` for all items | `ic_home` (active), `ic_favorite` (inactive) | LOW — icons should be customized per-design                 |

---

## 4. Component Details

### 4.1 JDS `BottomNavigation` (Standalone Component)

**Description:** _"Add Items using DevUtils Plugin"_
**Dimensions:** 360 × 70px
**Layout:** HORIZONTAL auto-layout, 4px item spacing, 16px padding all sides

| Element                      | Details                                                              |
| ---------------------------- | -------------------------------------------------------------------- |
| **BottomNavigationItem × 4** | Visible instances (1 active + 3 inactive). Each 82×38px.             |
| **BottomNavigationItem × 1** | Hidden 5th slot (for manual expansion)                               |
| **Stroke Line**              | Top border divider, Emphasis=Minimal, 360×1px, absolutely positioned |

### 4.2 JDS `BottomNavigationItem` (CS, 2 variants)

| Prop     | Type    | Default | Values          | Purpose               |
| -------- | ------- | ------- | --------------- | --------------------- |
| `Active` | VARIANT | `True`  | `True`, `False` | Active/inactive state |

**Internal structure:**

### BottomNavigationItem — Internal Structure

    BottomNavigationItem
    ├── Icon (INSTANCE → JDS Icon CS)
    │   └── Icon Asset (INSTANCE_SWAP — ic_favorite)
    │
    └── Label (INSTANCE → JDS Label CS, "Label", Label 2XS, 10px)

**Active state:** Icon: Emphasis=Medium, Tinted=True. Label: Emphasis=High, Weight=Medium.
**Inactive state:** Icon: Emphasis=Low, Tinted=False. Label: Emphasis=Low, Weight=Medium.

### 4.3 OneUI `BottomNav` (CS, 12 variants)

| Prop    | Type    | Default | Values                   | Purpose                    |
| ------- | ------- | ------- | ------------------------ | -------------------------- |
| `label` | VARIANT | `1Line` | `1Line`, `2Line`, `none` | Label display mode         |
| `items` | VARIANT | `2`     | `2`, `3`, `4`, `5`       | Number of navigation items |

**Dimensions by label mode:**

| Label Mode | Width | Height | Item Height |
| ---------- | ----- | ------ | ----------- |
| `1Line`    | 360px | 64px   | 64px        |
| `2Line`    | 360px | 72px   | 72px        |
| `none`     | 360px | 56px   | 56px        |

**Layout:** HORIZONTAL auto-layout, 0px item spacing, 16px left/right padding, 0px top/bottom padding. Items fill-distribute horizontally.

### 4.4 OneUI `.BottomNav.Item/label1Line` (CS, 2 variants)

| Prop      | Type    | Default   | Values      | Purpose               |
| --------- | ------- | --------- | ----------- | --------------------- |
| `↳ label` | TEXT    | `"Label"` | any string  | Label text content    |
| `active`  | VARIANT | `On`      | `On`, `Off` | Active/inactive state |

**Internal structure:**

### BottomNav.Item/label1Line — Internal Structure

    .BottomNav.Item/label1Line
    └── state layer (FRAME — touch target)
        ├── Icon (INSTANCE → Slot/size5/IconTinted or Slot/size5/IconLow)
        │   └── Icon (INSTANCE → Icon CS)
        │       └── Icon Asset (INSTANCE_SWAP)
        │
        └── Label (TEXT — "Label", 12px, centered)

### 4.5 OneUI `.BottomNav.Item/label2Line` (CS, 2 variants)

| Prop      | Type    | Default                       | Values      | Purpose               |
| --------- | ------- | ----------------------------- | ----------- | --------------------- |
| `↳ label` | TEXT    | `"Label can go into 2 lines"` | any string  | Multi-line label text |
| `active`  | VARIANT | `On`                          | `On`, `Off` | Active/inactive state |

Same structure as label1Line but taller (72px item, 24px text height for 2-line support).

### 4.6 OneUI `.BottomNav.Item/labelFalse` (CS, 2 variants)

| Prop     | Type    | Default | Values      | Purpose               |
| -------- | ------- | ------- | ----------- | --------------------- |
| `active` | VARIANT | `On`    | `On`, `Off` | Active/inactive state |

**No label TEXT prop** — icon-only navigation. Icon is larger: 24×24 (`Slot/size6`) vs 20×20 (`Slot/size5`).

---

## 5. Full Comparison Table

| Feature                      | JDS BottomNavigation              | OneUI BottomNav                  | Mapping                        |
| ---------------------------- | --------------------------------- | -------------------------------- | ------------------------------ |
| **Component type**           | Standalone component (0 props)    | Component set (12 variants)      | 🔶 Different architecture      |
| **Item count**               | Manual add/remove (default 4)     | `items` VARIANT: 2/3/4/5         | 🔶 Manual → variant-controlled |
| **Label modes**              | Always shown, single-line         | `label`: 1Line/2Line/none        | 🆕 More flexible               |
| **2-line labels**            | ❌ Not supported                  | ✅ `label=2Line`                 | 🆕 OneUI-only                  |
| **Icon-only mode**           | ❌ Not supported                  | ✅ `label=none` (24×24 icons)    | 🆕 OneUI-only                  |
| **Active state**             | `Active`: True/False              | `active`: On/Off                 | ⚠️ Value naming change         |
| **Label text**               | Nested `Label` CS instance        | Direct `↳ label` TEXT prop       | 🔶 Simplified                  |
| **Label font size**          | 10px (Label 2XS)                  | 12px                             | ⚠️ Size increase               |
| **Icon size (with label)**   | 20×20                             | 20×20                            | ✅ Same                        |
| **Icon size (no label)**     | Not applicable                    | 24×24                            | 🆕 Larger icons                |
| **Container height**         | 70px fixed                        | 64/72/56px by label mode         | ⚠️ Different heights           |
| **Container width**          | 360px                             | 360px                            | ✅ Same                        |
| **Padding**                  | 16px all sides                    | 16px LR, 0px TB                  | ⚠️ No vertical padding         |
| **Item spacing**             | 4px                               | 0px (fill)                       | LOW — layout change            |
| **Divider**                  | `Stroke Line` instance            | `Divider` instance               | 🔶 Different component         |
| **State layer**              | ❌ Not present                    | ✅ `state layer` FRAME           | 🆕 Touch target                |
| **Active icon style**        | Emphasis=Medium, Tinted=True      | Slot/size5/IconTinted            | 🔶 Different system            |
| **Inactive icon style**      | Emphasis=Low, Tinted=False        | Slot/size5/IconLow               | 🔶 Different system            |
| **Label styling (active)**   | Label CS: Emphasis=High           | Built into item variant          | 🔶 Automatic                   |
| **Label styling (inactive)** | Label CS: Emphasis=Low            | Built into item variant          | 🔶 Automatic                   |
| **Description**              | "Add Items using DevUtils Plugin" | _(none)_                         | —                              |
| **Hidden 5th item slot**     | ✅ Built-in hidden instance       | ❌ Use `items=5` variant instead | 🔶 Different approach          |

---

## 6. Internal Layer Structure Comparison

### JDS BottomNavigation

### BottomNavigation — Internal Structure

    BottomNavigation (COMPONENT, 360×70, HORIZONTAL, 4px gap, 16px padding)
    ├── BottomNavigationItem (INSTANCE, Active=True, 82×38)
    │   ├── Icon (INSTANCE → Icon CS, Emphasis=Medium, Tinted=True, 20×20)
    │   │   └── Icon Asset (INSTANCE_SWAP — ic_favorite)
    │   └── Label (INSTANCE → Label CS, "Label", 10px, Emphasis=High)
    │
    ├── BottomNavigationItem (INSTANCE, Active=False, 82×38) × 3
    │   ├── Icon (INSTANCE → Icon CS, Emphasis=Low, Tinted=False, 20×20)
    │   │   └── Icon Asset (INSTANCE_SWAP — ic_favorite)
    │   └── Label (INSTANCE → Label CS, "Label", 10px, Emphasis=Low)
    │
    ├── BottomNavigationItem (INSTANCE, Active=False, hidden — 5th slot)
    └── Stroke Line (INSTANCE → Stroke Line CS, absolutely positioned, 360×1)

### OneUI BottomNav — Internal Structure

#### label=1Line, items=2

    BottomNav (COMPONENT, 360×64, HORIZONTAL, 0px gap, 16px LR padding)
    ├── .BottomNav.Item/label1Line (INSTANCE, active=On, 164×64)
    │   └── state layer (FRAME, 156×56, VERTICAL, 6px gap, 4px TB padding)
    │       ├── Icon (INSTANCE → Slot/size5/IconTinted, 20×20)
    │       │   └── Icon (INSTANCE → Icon CS)
    │       │       └── Icon Asset (INSTANCE_SWAP — ic_home)
    │       └── Label (TEXT — "Label", 12px, centered)
    │
    ├── .BottomNav.Item/label1Line (INSTANCE, active=Off, 164×64)
    │   └── state layer (FRAME, 156×56, VERTICAL, 6px gap, 4px TB padding)
    │       ├── Icon (INSTANCE → Slot/size5/IconLow, 20×20)
    │       │   └── Icon (INSTANCE → Icon CS)
    │       │       └── Icon Asset (INSTANCE_SWAP — ic_favorite)
    │       └── Label (TEXT — "Label", 12px, centered)
    │
    └── Divider (INSTANCE → Divider CS, horizontal, attention=low, 360×1, absolutely positioned)

---

## 7. Design Tips

1. **JDS has no props; OneUI has 2 key variants.** JDS BottomNavigation was a fixed standalone component — you added/removed items manually. OneUI `BottomNav` gives you `items` (2/3/4/5) and `label` (1Line/2Line/none) as VARIANT props. Always set `items` to match your design.

2. **Default item count is different.** JDS defaults to 4 visible items. OneUI defaults to `items=2`. Always explicitly set `items=4` or `items=5` when migrating.

3. **Label font size increased.** JDS used 10px labels (Label 2XS). OneUI uses 12px labels. This is a subtle but noticeable change — labels will appear slightly larger.

4. **Height changed.** JDS was fixed at 70px. OneUI is 64px (1Line), 72px (2Line), or 56px (none). The standard 1Line variant is 6px shorter than JDS. Adjust surrounding layouts accordingly.

5. **2-line labels are new.** If you need longer navigation labels, use `label=2Line`. The nav bar grows to 72px to accommodate. JDS had no multi-line support.

6. **Icon-only mode is new.** Use `label=none` for a compact 56px nav bar with larger 24×24 icons. Great for minimal mobile interfaces.

7. **Active state values changed.** JDS: `Active=True/False`. OneUI: `active=On/Off`. When reading designs, remember `On` = `True`, `Off` = `False`.

8. **No more manual item management.** JDS required the DevUtils Plugin to add items. OneUI just uses the `items` VARIANT — switch between 2/3/4/5 items instantly. No hidden slots needed.

9. **Label text is now a direct TEXT prop.** JDS used a nested `Label` CS instance (with Emphasis, Weight, Tinted styling). OneUI uses `↳ label` TEXT prop on each item sub-CS. You lose the Label component's styling props but gain simplicity.

10. **Icon swapping works the same way.** Both libraries use nested `Icon Asset` INSTANCE_SWAP for changing icons. The wrapper hierarchy differs (JDS Icon CS vs OneUI Slot system), but the actual icon swap mechanism is identical.

---

## 8. Migration Checklist

### BottomNavigation → BottomNav

- [ ] Replace JDS `BottomNavigation` with OneUI `BottomNav`:
  - [ ] Set `items` to match current item count (2/3/4/5)
  - [ ] ⚠️ Remember: OneUI defaults to `items=2`, JDS defaults to 4
  - [ ] Set `label` to `1Line` (closest to JDS behavior)
  - [ ] Consider `label=2Line` if labels are being truncated
  - [ ] Consider `label=none` for icon-only compact nav

### BottomNavigationItem → .BottomNav.Item/\*

- [ ] Map active state: JDS `Active=True` → OneUI `active=On`
- [ ] Map active state: JDS `Active=False` → OneUI `active=Off`
- [ ] Replace icon instances:
  - [ ] Swap `Icon Asset` INSTANCE_SWAP to correct icon per tab
  - [ ] Active items use `Slot/size5/IconTinted` automatically
  - [ ] Inactive items use `Slot/size5/IconLow` automatically
- [ ] Set label text:
  - [ ] Replace nested Label CS text with `↳ label` TEXT prop
  - [ ] Note: font size changes from 10px → 12px

### Layout Adjustments

- [ ] Adjust surrounding layouts for height change:
  - [ ] JDS 70px → OneUI 64px (1Line) = 6px shorter
  - [ ] JDS 70px → OneUI 72px (2Line) = 2px taller
  - [ ] JDS 70px → OneUI 56px (none) = 14px shorter
- [ ] Note padding change: JDS 16px all sides → OneUI 16px LR only
- [ ] Note item spacing change: JDS 4px gap → OneUI 0px (fill-distribute)

### New Capabilities (Adopt where useful)

- [ ] Use `label=2Line` for longer navigation labels
- [ ] Use `label=none` for icon-only compact navigation
- [ ] Use `items` variant instead of manually adding/removing items

---
