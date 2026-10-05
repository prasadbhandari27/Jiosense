---
name: jds-v3-oneui-overlays
description: >-
  JDS v3 (Jio Testlab Library) → OneUI migration mapping for bottom sheets, modals/dialogs and side sheets. Covers BottomSheet, Modal, Dialog, SideSheet.
  Use when swapping or prop-mapping any of these components while converting a reference file to OneUI.
---

# Overlays and sheets — JDS v3 → OneUI migration

Part of the JDS v3 → OneUI migration skill set. For routing across all component behaviours, load
`get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-migration-figma-agent.md")`.

**Load this skill when migrating:** BottomSheet, Modal, Dialog, SideSheet.

## Components in this skill

- **BottomSheet** — search `BottomSheet`
- **Modal / Dialog** — search `Modal`
- **SideSheet** — search `SideSheet`

Jump straight to the component you need — each has its own Overview, Props Mapping, full comparison
table, and Migration Checklist. Do not invent prop names or variant values; use the tables below.

---

# BottomSheet  ·  JDS v3 → OneUI

## 1. Overview

| Aspect                  | JDS (Jio Testlab Library)                                                                                | OneUI Components                                                                                                                                 |
| ----------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Component Names         | `BottomSheet`, `ContentSheet`, `OptionSheet`, `ActionSheet`, `OptionSheetItem` (5 standalone components) | `BottomSheet` (component set), `.BottomSheetFooter`, `center`, `.header`, `.MediaHeader`, `.Handle/horizontal`, `left` (1 CS + 6 sub-components) |
| Component Type          | 5 standalone COMPONENTs (no variants)                                                                    | 1 COMPONENT_SET (4 variants) + sub-component sets                                                                                                |
| Total Variants          | 0 (all standalone)                                                                                       | 4 (`snapPoint`: collapsed, halfExpanded, fullyExpanded, custom)                                                                                  |
| VARIANT Props           | 0                                                                                                        | 1 on main (`snapPoint`) + props on sub-components                                                                                                |
| BOOLEAN Props           | 3 total across family                                                                                    | 5 on main + more on sub-components                                                                                                               |
| SLOT Props              | 0 (uses Slot instances)                                                                                  | 1 on main (`body`) + slots on sub-components                                                                                                     |
| Architecture            | Separate components per sheet type — no shared variant system                                            | Unified single component set with configurable header, body slot, and footer                                                                     |
| Estimated JDS Instances | 0                                                                                                        | —                                                                                                                                                |

## 2. Architecture Differences

| Aspect              | JDS                                                                                                                                                                                           | OneUI                                                                                                                                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Component Structure | **4 separate standalone components** — `BottomSheet` (base), `ContentSheet` (with header), `OptionSheet` (with list), `ActionSheet` (with title + buttons). Each is an independent component. | **1 unified component set** — `BottomSheet` with `snapPoint` variant. Header, body, and footer are configurable via props and slots.                                                       |
| Sheet Types         | Determined by which component you use (BottomSheet vs ContentSheet vs OptionSheet vs ActionSheet)                                                                                             | Determined by configuration — set header, body content, and footer props on the single BottomSheet component                                                                               |
| Snap Points         | ❌ Not available — single fixed height                                                                                                                                                        | ✅ `snapPoint` VARIANT: `collapsed`, `halfExpanded`, `fullyExpanded`, `custom`                                                                                                             |
| Handle Bar          | Built into each component as `handlebarArea` frame (fixed)                                                                                                                                    | `.Handle/horizontal` component, togglable via `handle` boolean on header                                                                                                                   |
| Header              | `ContentSheet` has optional header with slot. `OptionSheet` has optional header. `BottomSheet` and `ActionSheet` have no header.                                                              | Unified header system — `.header` CS with `content` variant (`text` / `media`). Supports title, description, start/end icon buttons, close button. `center` and `left` alignment variants. |
| Body Content        | `Content` frame (manual placement) or `OptionsList` slot (OptionSheet)                                                                                                                        | `body` SLOT prop — accepts any component                                                                                                                                                   |
| Footer / Actions    | `ActionSheet` has built-in `ButtonGroup` with semantic + regular buttons. Others have no footer.                                                                                              | `.BottomSheetFooter` CS with `stack` variant (vertical/horizontal). Has `start` slot + action buttons. Toggleable via `footer` boolean.                                                    |
| Surface             | `ElevatedSurface` instance (Emphasis=Low) nested in each component                                                                                                                            | Built into component — no separate surface instance                                                                                                                                        |
| Options List        | `OptionSheetItem` standalone component with Start icon, label, and End icon                                                                                                                   | No dedicated option item — use body slot with list content                                                                                                                                 |
| Dividers            | Not built-in                                                                                                                                                                                  | Built-in `topDivider` and `bottomDivider` booleans                                                                                                                                         |
| Media Header        | Not available                                                                                                                                                                                 | `.MediaHeader` component with image slot + drag handle overlay                                                                                                                             |

### ⚠️ Key Architecture Shift — From 4 Components to 1 Configurable Component

JDS splits bottom sheets into 4 purpose-specific components. OneUI consolidates everything into a single `BottomSheet` component set where:

- **Sheet type** = configure header + body + footer (not pick a different component)
- **Sheet height** = `snapPoint` variant (collapsed/halfExpanded/fullyExpanded/custom)
- **Header style** = `.header` sub-component with text or media content
- **Footer actions** = `.BottomSheetFooter` with vertical or horizontal button stack

## 3. Props Mapping

### 3.1 JDS Component Selection → OneUI Configuration

| JDS Component                              | OneUI BottomSheet Configuration                                             |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| `BottomSheet` (base, no header)            | `snapPoint: collapsed`, `footer: false`, `body` slot with content           |
| `ContentSheet` (with header)               | `snapPoint: *`, header configured via `.header` sub-component, `body` slot  |
| `ContentSheet` with `[Fixed Header]: true` | Same as above — header is always present in OneUI when configured           |
| `OptionSheet` (with option list)           | `snapPoint: *`, `body` slot with list items                                 |
| `OptionSheet` with `Header: true`          | Same + header configured                                                    |
| `ActionSheet` (with title + buttons)       | `snapPoint: *`, header with title, `footer: true` with `.BottomSheetFooter` |

### 3.2 ContentSheet Props

| JDS Prop         | Type    | Default | OneUI Equivalent                           | Notes                                                                                          |
| ---------------- | ------- | ------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `Header`         | BOOLEAN | `true`  | `header` boolean on `center` sub-component | ✅ Similar toggle                                                                              |
| `[Fixed Header]` | BOOLEAN | `false` | _(not a prop)_                             | 🔶 Header is always part of the component in OneUI — scrolling behavior is handled differently |

### 3.3 OptionSheet Props

| JDS Prop | Type    | Default | OneUI Equivalent                           | Notes                               |
| -------- | ------- | ------- | ------------------------------------------ | ----------------------------------- |
| `Header` | BOOLEAN | `false` | `header` boolean on `center` sub-component | ✅ Similar toggle (default differs) |

### 3.4 OptionSheetItem Props

| JDS Prop | Type    | Default | OneUI Equivalent           | Notes                                   |
| -------- | ------- | ------- | -------------------------- | --------------------------------------- |
| `Start`  | BOOLEAN | `true`  | _(no dedicated component)_ | ❌ Build custom list items in body slot |
| `End`    | BOOLEAN | `false` | _(no dedicated component)_ | ❌ Build custom list items in body slot |

## 4. OneUI BottomSheet Props

### 4.1 Main `BottomSheet` Component Set

| Prop            | Type    | Default     | Values                                                 | Purpose                                          |
| --------------- | ------- | ----------- | ------------------------------------------------------ | ------------------------------------------------ |
| `snapPoint`     | VARIANT | `collapsed` | `collapsed`, `halfExpanded`, `fullyExpanded`, `custom` | Controls sheet height / expansion state          |
| `body`          | SLOT    | —           | Any component                                          | Main content area — replaces JDS `Content` frame |
| `footer`        | BOOLEAN | `true`      | true / false                                           | Show/hide footer with action buttons             |
| `topDivider`    | BOOLEAN | `false`     | true / false                                           | Divider between header and body                  |
| `bottomDivider` | BOOLEAN | `false`     | true / false                                           | Divider between body and footer                  |

### 4.2 `center` Header Sub-Component

| Prop          | Type          | Default | Purpose                                |
| ------------- | ------------- | ------- | -------------------------------------- |
| `start`       | VARIANT       | `false` | Show/hide start icon button area       |
| `end`         | VARIANT       | `false` | Show/hide end icon button area         |
| `header`      | BOOLEAN       | `true`  | Show/hide header section               |
| `title`       | BOOLEAN       | `true`  | Show/hide title text                   |
| `description` | BOOLEAN       | `false` | Show/hide description text below title |
| `handle`      | BOOLEAN       | `true`  | Show/hide drag handle                  |
| `close`       | BOOLEAN       | `true`  | Show/hide close button                 |
| `start`       | INSTANCE_SWAP | —       | Start icon button                      |
| `end`         | INSTANCE_SWAP | —       | End icon button                        |

### 4.3 `left` Header Sub-Component

| Prop          | Type          | Default | Purpose                  |
| ------------- | ------------- | ------- | ------------------------ |
| `header`      | BOOLEAN       | `true`  | Show/hide header section |
| `description` | BOOLEAN       | `false` | Show/hide description    |
| `handle`      | BOOLEAN       | `true`  | Show/hide drag handle    |
| `close`       | BOOLEAN       | `true`  | Show/hide close button   |
| `end`         | BOOLEAN       | `true`  | Show/hide end icon area  |
| `end`         | INSTANCE_SWAP | —       | End icon button          |

### 4.4 `.header` Sub-Component Set

| Prop      | Type          | Default  | Values           | Purpose                                                     |
| --------- | ------------- | -------- | ---------------- | ----------------------------------------------------------- |
| `content` | VARIANT       | `text`   | `text`, `media`  | Header content type — text title or media (image)           |
| `align`   | INSTANCE_SWAP | `center` | `center`, `left` | Header alignment — swaps between center and left components |

### 4.5 `.MediaHeader` Sub-Component

| Prop             | Type    | Default        | Purpose                          |
| ---------------- | ------- | -------------- | -------------------------------- |
| `handle`         | BOOLEAN | `true`         | Show/hide drag handle overlay    |
| `contentWrapper` | SLOT    | Image instance | Media content (image) for header |

### 4.6 `.BottomSheetFooter` Sub-Component Set

| Prop      | Type    | Default    | Values                   | Purpose                                                      |
| --------- | ------- | ---------- | ------------------------ | ------------------------------------------------------------ |
| `stack`   | VARIANT | `vertical` | `vertical`, `horizontal` | Button arrangement direction                                 |
| `start`   | SLOT    | —          | —                        | Additional content before action buttons (hidden by default) |
| `start`   | BOOLEAN | `false`    | true / false             | Show/hide start slot                                         |
| `divider` | BOOLEAN | `false`    | true / false             | Show divider above footer                                    |

## 5. Full Comparison Table

| Feature                 | JDS BottomSheet Family                                                  | OneUI BottomSheet                                                                                                | Mapping                     |
| ----------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------- |
| **Component Count**     | 5 standalone components                                                 | 1 component set + 6 sub-components                                                                               | ✅ Consolidated             |
| **Sheet Types**         | Pick different component per type                                       | Configure single component                                                                                       | ⚠️ Mechanism change         |
| **Snap Points**         | Not available (fixed height)                                            | `snapPoint`: collapsed / halfExpanded / fullyExpanded / custom                                                   | 🆕 OneUI-only               |
| **Header**              | ContentSheet: optional. OptionSheet: optional. Others: none.            | Unified header system with text/media, center/left alignment, start/end icons, close, handle, title, description | 🆕 Major upgrade            |
| **Media Header**        | Not available                                                           | `.MediaHeader` with image slot                                                                                   | 🆕 OneUI-only               |
| **Body Content**        | `Content` frame or `OptionsList` slot                                   | `body` SLOT prop                                                                                                 | ✅ More flexible            |
| **Footer / Actions**    | ActionSheet only — fixed ButtonGroup (semantic + regular)               | `.BottomSheetFooter` on any config — vertical/horizontal stack, start slot                                       | 🆕 More flexible            |
| **Option Items**        | `OptionSheetItem` component (Start icon, label, End icon)               | No dedicated component — build in body slot                                                                      | ❌ Lost dedicated component |
| **Handle Bar**          | Fixed `handlebarArea` frame in each component                           | `.Handle/horizontal` component, toggleable via `handle` boolean                                                  | ✅ Now configurable         |
| **Close Button**        | Not available                                                           | `close` boolean on header                                                                                        | 🆕 OneUI-only               |
| **Dividers**            | Not built-in                                                            | `topDivider` + `bottomDivider` booleans                                                                          | 🆕 OneUI-only               |
| **Surface**             | Nested `ElevatedSurface` instance (Emphasis=Low)                        | Built into component                                                                                             | ✅ Simplified               |
| **Title + Description** | ActionSheet: Title + Body text instances. ContentSheet: via HeaderSlot. | `title` + `description` booleans on header                                                                       | ✅ Unified                  |
| **Instances in JDS**    | 0                                                                       | —                                                                                                                | No migration needed         |

## 6. Design Tips

1. **One component, not four**: Stop thinking in terms of "which sheet component do I use?" In OneUI, every bottom sheet is the same `BottomSheet` component — you configure it by toggling header options, filling the body slot, and setting up the footer.

2. **Snap points are a game-changer**: JDS had fixed-height sheets. OneUI's `snapPoint` lets you show collapsed (peek), halfExpanded, or fullyExpanded states. Use `custom` for non-standard heights.

3. **Recreating JDS sheet types in OneUI**:
   - **Basic BottomSheet** → `snapPoint: collapsed`, `footer: false`, fill `body` slot
   - **ContentSheet** → configure header (title, optional description), fill `body` slot
   - **OptionSheet** → fill `body` slot with a list of items (no dedicated OptionSheetItem — build your own or use ListItem components)
   - **ActionSheet** → set title in header, `footer: true` with `.BottomSheetFooter`

4. **OptionSheetItem is gone**: JDS had a dedicated `OptionSheetItem` component with Start icon, label, and End icon. In OneUI, you'll need to build option list items using generic components (e.g., ListItem or custom frames) placed in the `body` slot.

5. **Media headers are new**: OneUI supports image/media in the header via `.MediaHeader`. This is great for product sheets, image previews, or media-rich bottom sheets that JDS couldn't do.

6. **Header alignment options**: OneUI offers `center` and `left` header alignment components. Center-aligned titles are standard for mobile; left-aligned works for content-heavy headers.

7. **Footer is now universal**: In JDS, only ActionSheet had buttons. In OneUI, any BottomSheet can have a footer — toggle `footer: true` and configure button stack direction (vertical/horizontal).

8. **Close button is built-in**: No need to manually add a close button — toggle `close: true` on the header.

## 7. Migration Checklist

- [ ] Replace all JDS BottomSheet family components with OneUI `BottomSheet`:
  - [ ] `BottomSheet` → OneUI `BottomSheet` with minimal config
  - [ ] `ContentSheet` → OneUI `BottomSheet` with header configured
  - [ ] `OptionSheet` → OneUI `BottomSheet` with list content in `body` slot
  - [ ] `ActionSheet` → OneUI `BottomSheet` with header title + `footer: true`
- [ ] Choose appropriate `snapPoint` for each sheet (JDS had no equivalent — default to `collapsed` or `halfExpanded`)
- [ ] Configure header sub-component:
  - [ ] Set `content`: `text` (default) or `media`
  - [ ] Set alignment: `center` or `left`
  - [ ] Toggle `title`, `description`, `handle`, `close` as needed
  - [ ] Configure `start` / `end` icon buttons if needed
- [ ] Fill `body` SLOT with content
- [ ] Configure footer if needed:
  - [ ] `footer: true` to show
  - [ ] Choose `stack`: `vertical` (default) or `horizontal`
- [ ] Replace `OptionSheetItem` usage with custom list items in body slot
- [ ] Set `topDivider` / `bottomDivider` if visual separation is needed
- [ ] Remove `ElevatedSurface` references (built into OneUI component)
- [ ] Note: 0 existing JDS instances — primarily a new-design consideration

---

---

# Modal / Dialog  ·  JDS v3 → OneUI

## 1. Overview

| Aspect                  | JDS (Jio Testlab Library)                                                                  | OneUI Components                                                                                                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Component Names         | `Modal` (standalone), `Dialog` (CS, 1 variant), `[Deprecated]Dialog` (CS, 2 variants)      | `Modal` (standalone wrapper), `.Modal` (CS, 20 variants), `.ModalHeader` (CS, 2 variants), `.ModalFooter` (CS, 3 variants), `.ModalDividerTop` (CS, 9 variants), `ModalDividerBottom` (CS, 9 variants) |
| Architecture            | 2 separate components — `Modal` (bare wrapper) + `Dialog` (structured with header/content) | 1 wrapper component + 1 core `.Modal` CS with sub-component system (header, footer, dividers, body slot)                                                                                               |
| Total Variants          | 1 (Dialog) + 2 ([Deprecated]Dialog)                                                        | 20 (`.Modal`) + 2 (header) + 3 (footer) + 9+9 (dividers) = 43                                                                                                                                          |
| VARIANT Props           | 1 on Dialog (`[example]` — internal)                                                       | 2 on `.Modal` (`size`, `⛔️ platform`) + props on each sub-CS                                                                                                                                           |
| BOOLEAN Props           | 1 (`closable`)                                                                             | 2 on `.Modal` (`header`, `footer`) + more on sub-components                                                                                                                                            |
| SLOT Props              | 0 (uses Slot instances from external library)                                              | 1 on `.Modal` (`body`) + slots on footer                                                                                                                                                               |
| Sizing System           | Fixed 328px width                                                                          | Responsive: `size` (s/m/l/fullWidth) × `⛔️ platform` (360/768/1024/1440/1920) — 20 combinations                                                                                                        |
| Estimated JDS Instances | 0 (Modal) + 0 (Dialog) + 6 ([Deprecated]Dialog) = **6**                                    | —                                                                                                                                                                                                      |

## 2. Architecture Differences

| Aspect          | JDS                                                                                                                                                                                                           | OneUI                                                                                                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component Split | **`Modal`** = bare wrapper (Content frame + ElevatedSurface, 0 props). **`Dialog`** = structured overlay (HeaderSlot + IconButton close + ContentSlot + ElevatedSurface, 1 boolean). Two separate components. | **`Modal`** = thin wrapper around **`.Modal`** CS. `.Modal` is the core: Header + DividerTop + `body` SLOT + DividerBottom + Footer. Single unified component.                        |
| Size            | Fixed width: Modal=360px, Dialog=328px                                                                                                                                                                        | Responsive `size` × `⛔️ platform` matrix — s(320px), m(480px), l(640px), fullWidth(328-776px depending on platform) across 5 platform breakpoints                                     |
| Header          | Dialog: `HeaderSlot` (external slot instance) + `IconButton` close button. No header type variants.                                                                                                           | `.ModalHeader` CS: `type` variant — `text` (title + close icon) or `media` (image + close overlay). Rich sub-structure. Toggleable via `header` boolean.                              |
| Body / Content  | Dialog: `ContentSlot` (external slot instance) with 16px horizontal padding. Modal: `SlotContent` frame (no padding).                                                                                         | `.Modal`: `body` SLOT prop — native slot type, any component.                                                                                                                         |
| Footer          | ❌ Not available — Dialog has no footer section                                                                                                                                                               | ✅ `.ModalFooter` CS — `orientation` variant (horizontal/vertical/orientation3). Has `start` SLOT, `divider` boolean, action buttons in `end` frame. Toggleable via `footer` boolean. |
| Close Button    | Dialog: `IconButton` instance in `Top` frame, controlled by `closable` boolean                                                                                                                                | `.ModalHeader` text variant: `end` close icon in header. Media variant: `closeButton` overlay on image. Part of header — hidden when `header=false`.                                  |
| Dividers        | ❌ Only in [Deprecated]Dialog (between header and scrollable content)                                                                                                                                         | ✅ `.ModalDividerTop` + `ModalDividerBottom` — each with `visibility` (always/none/onScroll) × `scrollPosition` (start/middle/end) = 9 variants. Smart scroll-aware dividers.         |
| Scrolling       | [Deprecated]Dialog had `[example]=scrollable` variant with `Scrollbar-Mobile` component                                                                                                                       | Handled by divider visibility system — `onScroll` visibility + `scrollPosition` states manage visual feedback                                                                         |
| Surface         | Both components use nested `ElevatedSurface` instance                                                                                                                                                         | Built into `.Modal` with `cornerRadius: 16` and `clipsContent: true`                                                                                                                  |
| Slots           | External slot library instances (`HeaderSlot`, `ContentSlot`, `SlotContent`)                                                                                                                                  | Native SLOT type props (`body` on `.Modal`, `start` on footer, `contentWrapper` on media header)                                                                                      |

## 3. Props Mapping

### 3.1 JDS Modal → OneUI Modal

| JDS Prop     | Type | Default | OneUI Equivalent                  | Notes                                                                       |
| ------------ | ---- | ------- | --------------------------------- | --------------------------------------------------------------------------- |
| _(no props)_ | —    | —       | `size` VARIANT on `.Modal`        | 🆕 JDS had no size control; set to `s` for closest match to JDS 360px width |
| _(no props)_ | —    | —       | `⛔️ platform` VARIANT on `.Modal` | 🆕 Platform-responsive sizing — choose based on target viewport             |
| _(no props)_ | —    | —       | `header` BOOLEAN on `.Modal`      | 🆕 Set `false` to match bare JDS Modal                                      |
| _(no props)_ | —    | —       | `footer` BOOLEAN on `.Modal`      | 🆕 Set `false` to match bare JDS Modal                                      |
| _(no props)_ | —    | —       | `body` SLOT on `.Modal`           | 🆕 Place content here (replaces JDS `Content` frame)                        |

### 3.2 JDS Dialog → OneUI Modal

| JDS Prop    | Type    | Default     | OneUI Equivalent   | Type | Default | Notes                                                                                                                                                                              |
| ----------- | ------- | ----------- | ------------------ | ---- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `closable`  | BOOLEAN | `true`      | _(part of header)_ | —    | —       | ⚠️ No direct boolean — close button is built into `.ModalHeader`. To hide it, you'd hide the `end` icon in the text header. When `header=false`, close button disappears entirely. |
| `[example]` | VARIANT | `"Default"` | _(removed)_        | —    | —       | ❌ Internal example variant — not a user-facing prop                                                                                                                               |

### 3.3 JDS [Deprecated]Dialog → OneUI Modal

| JDS Prop                   | Type    | Default     | OneUI Equivalent              | Notes                                                                                         |
| -------------------------- | ------- | ----------- | ----------------------------- | --------------------------------------------------------------------------------------------- |
| `closable`                 | BOOLEAN | `true`      | _(see 3.2 above)_             | Same mapping                                                                                  |
| `[example]` = `scrollable` | VARIANT | `"default"` | Divider `visibility=onScroll` | 🔶 Scroll behavior now managed by `.ModalDividerTop` / `ModalDividerBottom` visibility system |

## 4. OneUI Props — Full Reference

### 4.1 `.Modal` Component Set (core)

| Prop          | Type    | Default | Values                               | Purpose                                                 |
| ------------- | ------- | ------- | ------------------------------------ | ------------------------------------------------------- |
| `size`        | VARIANT | `s`     | `s`, `m`, `l`, `fullWidth`           | Modal width — responsive per platform                   |
| `⛔️ platform` | VARIANT | `360`   | `360`, `768`, `1024`, `1440`, `1920` | Platform breakpoint — sets actual pixel widths per size |
| `header`      | BOOLEAN | `true`  | true / false                         | Show/hide header section                                |
| `footer`      | BOOLEAN | `true`  | true / false                         | Show/hide footer section                                |
| `body`        | SLOT    | —       | Any component                        | Main content area                                       |

**Size × Platform Width Matrix:**

| Size \ Platform | 360   | 768   | 1024  | 1440  | 1920  |
| --------------- | ----- | ----- | ----- | ----- | ----- |
| `s`             | 336px | 320px | 320px | 320px | 320px |
| `m`             | 336px | 480px | 480px | 480px | 480px |
| `l`             | 336px | 640px | 640px | 640px | 640px |
| `fullWidth`     | 328px | 328px | 328px | 328px | 328px |

_Note: On mobile (360), s/m/l all render at 336px. Size differentiation applies on larger platforms._

### 4.2 `.ModalHeader` Component Set

| Prop   | Type    | Default | Values          | Purpose             |
| ------ | ------- | ------- | --------------- | ------------------- |
| `type` | VARIANT | `text`  | `text`, `media` | Header content type |

- **`text`**: Title text in `contentWrapper` + `end` close icon button (56px height)
- **`media`**: Image in `contentWrapper` SLOT + `closeButton` overlay + `headerWrapper` (240px height)

### 4.3 `.ModalFooter` Component Set

| Prop          | Type    | Default      | Values                                   | Purpose                                  |
| ------------- | ------- | ------------ | ---------------------------------------- | ---------------------------------------- |
| `orientation` | VARIANT | `horizontal` | `horizontal`, `vertical`, `orientation3` | Button layout direction                  |
| `start`       | SLOT    | _(hidden)_   | —                                        | Additional content before action buttons |
| `start`       | BOOLEAN | `false`      | true / false                             | Show/hide start slot                     |
| `divider`     | BOOLEAN | `false`      | true / false                             | Show divider above footer                |

- **`horizontal`**: Side-by-side buttons in `end` frame (64px height)
- **`vertical`**: Stacked buttons in `actions` frame + optional `start` slot (104px height)
- **`orientation3`**: Same layout as horizontal (appears to be a third arrangement option)

### 4.4 `.ModalDividerTop` / `ModalDividerBottom` Component Sets

| Prop             | Type    | Default | Values                       | Purpose                       |
| ---------------- | ------- | ------- | ---------------------------- | ----------------------------- |
| `visibility`     | VARIANT | `none`  | `always`, `none`, `onScroll` | When divider is visible       |
| `scrollPosition` | VARIANT | `start` | `start`, `middle`, `end`     | Current scroll position state |

**Visibility × ScrollPosition behavior:**

- `visibility=none`: Divider hidden in all scroll states
- `visibility=always`: Divider visible in all scroll states
- `visibility=onScroll`: Divider appears/hides based on scroll position (e.g., top divider hidden at `start`, visible at `middle`/`end`)

## 5. Full Comparison Table

| Feature                  | JDS Modal Family                                           | OneUI Modal                                                            | Mapping                  |
| ------------------------ | ---------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------ |
| **Component Count**      | 3 (Modal + Dialog + [Deprecated]Dialog)                    | 1 wrapper + 5 sub-component sets                                       | ✅ Consolidated          |
| **Variant System**       | Dialog: 1 variant ([example]=Default)                      | `.Modal`: 20 variants (size × platform)                                | 🆕 Major upgrade         |
| **Size Control**         | Fixed width (360px Modal, 328px Dialog)                    | 4 sizes × 5 platforms = responsive matrix                              | 🆕 OneUI-only            |
| **Header**               | Dialog: HeaderSlot + IconButton close                      | `.ModalHeader`: text (title+close) or media (image+close overlay)      | 🔶 Mechanism change      |
| **Media Header**         | ❌ Not available                                           | ✅ `type=media` with image slot                                        | 🆕 OneUI-only            |
| **Close Button**         | `closable` BOOLEAN on Dialog                               | Built into header — no standalone toggle                               | ⚠️ Less granular control |
| **Body Content**         | `ContentSlot` / `SlotContent` (external instances)         | `body` SLOT (native type)                                              | ✅ More flexible         |
| **Footer**               | ❌ Not available                                           | `.ModalFooter` with horizontal/vertical buttons + start slot           | 🆕 OneUI-only            |
| **Dividers**             | Only in [Deprecated]Dialog                                 | `.ModalDividerTop` + `ModalDividerBottom` with scroll-aware visibility | 🆕 OneUI-only            |
| **Scroll Support**       | [Deprecated]Dialog `scrollable` variant + Scrollbar-Mobile | Divider visibility system (onScroll + scrollPosition states)           | 🔶 Mechanism change      |
| **Surface**              | Nested `ElevatedSurface` instance                          | Built-in (cornerRadius: 16, clipsContent)                              | ✅ Simplified            |
| **Corner Radius**        | Set by ElevatedSurface                                     | 16px built into `.Modal` variant                                       | ✅ Consistent            |
| **Platform Responsive**  | ❌ Fixed width for all screens                             | ✅ 5 platform breakpoints (360–1920)                                   | 🆕 OneUI-only            |
| **Instances to Migrate** | 6 ([Deprecated]Dialog only)                                | —                                                                      | Low effort               |

## 6. Design Tips

1. **JDS has two components — OneUI has one**: In JDS, `Modal` was a bare wrapper (no header, no structure) and `Dialog` was the structured version. In OneUI, use `Modal` → `.Modal` for everything — toggle `header` and `footer` booleans to control structure.

2. **Migrating bare JDS Modal**: Set `header: false`, `footer: false` on OneUI `.Modal`. Place your content in the `body` slot. Choose `size=s` and `⛔️ platform=360` to match the original 360px width.

3. **Migrating JDS Dialog**: Set `header: true`, `footer: false` (JDS Dialog had no footer). Place header content in the `.ModalHeader` text variant. Move ContentSlot content to the `body` slot.

4. **`closable` has no direct equivalent**: JDS Dialog's `closable` boolean toggled the close IconButton. In OneUI, the close button is part of `.ModalHeader` — it's always there when the header is visible. To hide it, you'd need to modify the header instance directly (hide the `end` icon). When `header=false`, the close button disappears automatically.

5. **Size matters now**: JDS was fixed-width. OneUI gives you `s` (320px), `m` (480px), `l` (640px), and `fullWidth` across 5 platform breakpoints. On mobile (360 platform), s/m/l all collapse to 336px — differentiation is for tablet and desktop.

6. **Footer is a bonus**: JDS had no footer on Modal or Dialog. OneUI's `.ModalFooter` gives you horizontal or vertical button layouts with an optional start slot — great for confirm/cancel patterns that JDS required manual construction for.

7. **Scroll-aware dividers replace scrollbar**: The [Deprecated]Dialog used a `Scrollbar-Mobile` component for scrollable content. OneUI replaces this with smart dividers that respond to scroll position — set `visibility=onScroll` on `.ModalDividerTop`/`ModalDividerBottom` to show dividers only when content is scrolled.

8. **Media headers are new**: OneUI `.ModalHeader` supports `type=media` — a 240px image header with close button overlay. JDS had no equivalent. Use for product detail modals, image previews, or onboarding flows.

9. **6 [Deprecated]Dialog instances**: These are the only instances to migrate. They use `closable` + `[example]` (default/scrollable) — map to OneUI Modal with `header: true`, divider visibility set to `onScroll` for scrollable variants.

## 7. Migration Checklist

- [ ] Replace all JDS Modal/Dialog family components with OneUI `Modal`:
  - [ ] **JDS `Modal`** (0 instances) → OneUI `Modal` with `.Modal` set to `header: false`, `footer: false`, content in `body` slot
  - [ ] **JDS `Dialog`** (0 instances) → OneUI `Modal` with `.Modal` set to `header: true`, `footer: false`, header text content, ContentSlot → `body` slot
  - [ ] **JDS `[Deprecated]Dialog`** (6 instances) → OneUI `Modal` with `.Modal` set to `header: true`, map `closable` behavior, map `scrollable` to divider `visibility=onScroll`
- [ ] Choose appropriate `size` for each modal:
  - [ ] `s` (320px) — small dialogs, confirmations
  - [ ] `m` (480px) — standard content modals
  - [ ] `l` (640px) — wide content, forms
  - [ ] `fullWidth` — full-screen mobile modals
- [ ] Set `⛔️ platform` to match target design viewport (360/768/1024/1440/1920)
- [ ] Configure header:
  - [ ] `header: true/false` — show or hide
  - [ ] `.ModalHeader` `type`: `text` (title + close) or `media` (image + close overlay)
- [ ] Migrate header slot content to `.ModalHeader` text contentWrapper
- [ ] Migrate content slot to `body` SLOT prop
- [ ] Add footer if needed (JDS had none):
  - [ ] `footer: true` to show
  - [ ] `.ModalFooter` `orientation`: `horizontal` or `vertical`
  - [ ] Configure action buttons in `end` frame
- [ ] Configure dividers for scrollable content:
  - [ ] `.ModalDividerTop` / `ModalDividerBottom` `visibility`: `none`, `always`, or `onScroll`
- [ ] Remove `ElevatedSurface` references (built into OneUI `.Modal`)
- [ ] Remove `Scrollbar-Mobile` references (replaced by divider visibility system)
- [ ] Handle `closable=false` cases — manually hide close icon in header instance
- [ ] Verify corner radius matches (OneUI = 16px built-in)

---

---

# SideSheet  ·  JDS v3 → OneUI

## 1. Overview

| Aspect                  | JDS (Jio Testlab Library)                                                   | OneUI Components                                                                                                                              |
| ----------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Component Name          | ❌ **Does not exist**                                                       | `SideSheet` (component set)                                                                                                                   |
| Component Type          | —                                                                           | COMPONENT_SET (2 variants)                                                                                                                    |
| Sub-Components          | —                                                                           | `.OverlaySheet` (CS, 40 variants), `.InlineSheet` (CS, 40 variants), `.SidesheetHeader`, `.SidesheetFooter`, `.ResizeHandle` (CS, 2 variants) |
| Total Variants          | —                                                                           | 2 (main) + 40 (overlay) + 40 (inline) + 2 (resize handle) = 84                                                                                |
| VARIANT Props           | —                                                                           | 1 on main (`style`), 3 on `.OverlaySheet` (`direction`, `size`, `⛔️ platform`), 3 on `.InlineSheet` (`placement`, `size`, `⛔️ platform`)      |
| BOOLEAN Props           | —                                                                           | 4 on each sub-sheet (`header`, `footer`, `dividers`, + `draggable` on inline only)                                                            |
| SLOT Props              | —                                                                           | 1 on each sub-sheet (`body`)                                                                                                                  |
| Architecture            | No side sheet component — designers built custom panels or used BottomSheet | Full side panel system with overlay/inline modes, responsive sizing, direction/placement control, and resize handle                           |
| Estimated JDS Instances | 0                                                                           | —                                                                                                                                             |

## 2. Architecture — OneUI SideSheet (New Component)

Since JDS has no SideSheet equivalent, this section documents the OneUI component architecture for new adoption.

### Component Hierarchy

### SideSheet — Internal Structure

    SideSheet (COMPONENT_SET)
    ├── style=overlay → .OverlaySheet instance
    │   ├── Header (.SidesheetHeader)
    │   ├── Divider (top)
    │   ├── body (SLOT)
    │   ├── Divider (bottom)
    │   └── .SidesheetFooter
    │
    └── style=inline → .InlineSheet instance
        ├── sheetWrapper (frame)
        │   ├── Header (.SidesheetHeader)
        │   ├── Divider (top)
        │   ├── body (SLOT)
        │   ├── Divider (bottom)
        │   └── Footer (.SidesheetFooter)
        │
        └── .ResizeHandle (state: idle/hover)

### Key Architectural Decisions

| Aspect                    | Detail                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Two modes**             | `style=overlay` (floats over content with scrim) vs `style=inline` (embedded alongside content with resize handle) |
| **Direction / Placement** | Overlay uses `direction` (right/left). Inline uses `placement` (right/left). Both default to `right`.              |
| **Responsive sizing**     | `size` (S/M/L/Custom) × `⛔️ platform` (360/768/1024/1440/1920) — responsive width matrix across breakpoints        |
| **Shared structure**      | Both overlay and inline share: Header + Divider + body SLOT + Divider + Footer                                     |
| **Inline extras**         | `.ResizeHandle` with idle/hover states, `draggable` boolean, `sheetWrapper` container                              |
| **Content area**          | `body` SLOT prop (native Figma SLOT type) — accepts any component                                                  |

## 3. OneUI SideSheet Props — Full Reference

### 3.1 `SideSheet` (Main Component Set)

| Prop    | Type    | Default   | Values              | Purpose                                                                     |
| ------- | ------- | --------- | ------------------- | --------------------------------------------------------------------------- |
| `style` | VARIANT | `overlay` | `overlay`, `inline` | Sheet display mode — overlay floats on top, inline embeds alongside content |

### 3.2 `.OverlaySheet` Sub-Component Set (40 variants)

| Prop          | Type    | Default | Values                               | Purpose                                   |
| ------------- | ------- | ------- | ------------------------------------ | ----------------------------------------- |
| `direction`   | VARIANT | `right` | `right`, `left`                      | Which side the sheet slides in from       |
| `size`        | VARIANT | `S`     | `S`, `M`, `L`, `Custom`              | Sheet width tier                          |
| `⛔️ platform` | VARIANT | `360`   | `360`, `768`, `1024`, `1440`, `1920` | Platform breakpoint for responsive widths |
| `header`      | BOOLEAN | `true`  | true / false                         | Show/hide header section                  |
| `footer`      | BOOLEAN | `true`  | true / false                         | Show/hide footer section                  |
| `dividers`    | BOOLEAN | `true`  | true / false                         | Show/hide top and bottom dividers         |
| `body`        | SLOT    | —       | Any component                        | Main content area                         |

### 3.3 `.InlineSheet` Sub-Component Set (40 variants)

| Prop          | Type    | Default | Values                               | Purpose                                    |
| ------------- | ------- | ------- | ------------------------------------ | ------------------------------------------ |
| `placement`   | VARIANT | `right` | `left`, `right`                      | Which side the sheet is placed on          |
| `size`        | VARIANT | `S`     | `S`, `M`, `L`, `Custom`              | Sheet width tier                           |
| `⛔️ platform` | VARIANT | `360`   | `360`, `768`, `1024`, `1440`, `1920` | Platform breakpoint for responsive widths  |
| `header`      | BOOLEAN | `true`  | true / false                         | Show/hide header section                   |
| `footer`      | BOOLEAN | `true`  | true / false                         | Show/hide footer section                   |
| `dividers`    | BOOLEAN | `true`  | true / false                         | Show/hide top and bottom dividers          |
| `draggable`   | BOOLEAN | `true`  | true / false                         | Show/hide resize handle for drag-to-resize |
| `body`        | SLOT    | —       | Any component                        | Main content area                          |

### 3.4 `.ResizeHandle` Sub-Component Set (Inline only)

| Prop    | Type    | Default | Values          | Purpose                                |
| ------- | ------- | ------- | --------------- | -------------------------------------- |
| `state` | VARIANT | `idle`  | `idle`, `hover` | Visual state of the resize drag handle |

### 3.5 Size × Platform Width Matrix (Overlay & Inline share the same widths)

| Size \ Platform | 360   | 768   | 1024  | 1440  | 1920  |
| --------------- | ----- | ----- | ----- | ----- | ----- |
| `S`             | 328px | 256px | 256px | 256px | 256px |
| `M`             | 328px | 480px | 480px | 480px | 480px |
| `L`             | 360px | 640px | 640px | 640px | 640px |
| `Custom`        | 300px | 300px | 300px | 300px | 300px |

_Note: On mobile (360), S and M collapse to 328px, L takes the full 360px width. On larger platforms, sizes differentiate properly. Custom is 300px across all platforms (user-adjustable)._

### 3.6 Internal Structure Details

**Header (`.SidesheetHeader`):**

- Standalone component (not a component set)
- Contains `headerWrapper` frame (304px × 24px at size S)
- Houses title text and optional controls

**Footer (`.SidesheetFooter`):**

- Standalone component (not a component set)
- Contains `end` frame with action buttons (horizontal layout)
- 64px height, horizontal button arrangement

**Dividers:**

- Uses the standard OneUI `Divider` component (from the shared Divider CS)
- Default config: `orientation=horizontal, size=m, attention=low, slot=none, contentAlign=center, roundCaps=false`
- Toggleable via `dividers` boolean on both overlay and inline

## 4. Comparison with JDS Alternatives

Since JDS has no SideSheet, designers may have used alternative patterns. Here's how to map those to OneUI SideSheet:

| JDS Workaround                     | OneUI SideSheet Equivalent                                                                    |
| ---------------------------------- | --------------------------------------------------------------------------------------------- |
| Custom-built side panel frame      | `SideSheet` with `style=inline`                                                               |
| Dialog used as side panel          | `SideSheet` with `style=overlay`                                                              |
| BottomSheet on desktop             | `SideSheet` with `style=overlay` (side panels are more appropriate for desktop)               |
| Manual overlay with close button   | `SideSheet` with `style=overlay`, `header: true` (built-in close), `footer: true` for actions |
| No equivalent — content was inline | `SideSheet` with `style=inline`, `draggable: true` for resizable side panels                  |

## 5. Design Tips

1. **Overlay vs Inline — when to use which**:
   - **Overlay** (`style=overlay`): For temporary tasks — filters, detail panels, settings. Floats over the main content with a scrim. User dismisses when done.
   - **Inline** (`style=inline`): For persistent side panels — file browsers, property inspectors, chat panels. Sits alongside main content and can be resized.

2. **Direction / Placement naming**: Overlay uses `direction` (which side the sheet slides in from). Inline uses `placement` (which side the sheet sits on). Both default to `right` — the most common pattern for LTR layouts. Use `left` for navigation-style panels.

3. **Size selection guide**:
   - `S` (256px on desktop): Quick actions, simple forms, notifications
   - `M` (480px on desktop): Standard content panels, detail views
   - `L` (640px on desktop): Rich content, complex forms, data tables
   - `Custom` (300px default): When standard sizes don't fit — adjust width manually

4. **Responsive behavior**: On mobile (360 platform), S and M both collapse to 328px — effectively full-width minus margins. Size differentiation only matters on tablet (768) and above. For mobile-first designs, the `size` prop primarily affects larger breakpoints.

5. **Dividers are on by default**: Unlike Modal where dividers are off by default, SideSheet ships with `dividers: true`. This is appropriate because side sheets typically have scrollable content where dividers provide visual separation between header/body/footer.

6. **Footer pattern**: The footer (`.SidesheetFooter`) uses a horizontal button layout with an `end`-aligned frame — matching the standard action pattern (cancel/confirm buttons on the right). Always use `footer: true` when the sheet involves a confirm/cancel workflow.

7. **Draggable is inline-only**: The `draggable` boolean and `.ResizeHandle` component only exist on `.InlineSheet`. Use for resizable panels like code editors, file browsers, or property inspectors. Set `draggable: false` for fixed-width inline panels.

8. **This is a net-new component**: JDS had no SideSheet. If you're migrating designs that used custom-built side panels, use this as an opportunity to standardize on the OneUI SideSheet component for consistency across your design files.

## 6. Adoption Checklist (New Component — No Migration)

- [ ] Identify all custom-built side panel patterns in existing JDS designs
- [ ] Replace custom side panels with OneUI `SideSheet`:
  - [ ] Floating/overlay panels → `style: overlay`
  - [ ] Persistent/embedded panels → `style: inline`
- [ ] Configure style:
  - [ ] `direction` / `placement`: `right` (default) or `left`
  - [ ] `size`: `S`, `M`, `L`, or `Custom`
  - [ ] `⛔️ platform`: match your target viewport
- [ ] Toggle header: `header: true/false`
- [ ] Toggle footer: `footer: true/false` (use for action-based workflows)
- [ ] Toggle dividers: `dividers: true/false` (default on)
- [ ] Fill `body` SLOT with content
- [ ] For inline sheets: set `draggable: true/false` based on whether resize is needed
- [ ] Replace any BottomSheet instances used on desktop with SideSheet for better UX
- [ ] Test across platform breakpoints (360/768/1024/1440/1920) for responsive behavior
- [ ] Note: 4 existing OneUI SideSheet instances — reference them for usage patterns

---
