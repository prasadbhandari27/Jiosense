---
name: jds-v3-oneui-feedback
description: >-
  JDS v3 (Jio Testlab Library) → OneUI migration mapping for toasts and tooltips. Covers Toast, Tooltip, Tip, TipItem.
  Use when swapping or prop-mapping any of these components while converting a reference file to OneUI.
---

# Transient feedback — JDS v3 → OneUI migration

Part of the JDS v3 → OneUI migration skill set. For routing across all component behaviours, load
`get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-migration-figma-agent.md")`.

**Load this skill when migrating:** Toast, Tooltip, Tip, TipItem.

## Components in this skill

- **Toast** — search `Toast`
- **Tooltip** — search `Tooltip`

Jump straight to the component you need — each has its own Overview, Props Mapping, full comparison
table, and Migration Checklist. Do not invent prop names or variant values; use the tables below.

---

# Toast  ·  JDS v3 → OneUI

## 1. Overview

| Aspect                  | JDS (Jio Testlab Library)                          | OneUI Components                                                                       |
| ----------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Component Name          | Toast                                              | Toast                                                                                  |
| Component Set ID        | `12503:222957`                                     | `12496:5655`                                                                           |
| Total Variants          | 6                                                  | 36                                                                                     |
| VARIANT Props           | 2 (`[example]`, `Emphasis`)                        | 3 (`type`, `attention`, `actionsPlacement`)                                            |
| BOOLEAN Props           | 0                                                  | 7 (`close`, `progressIndicator`, `helpText`, `start`, `actions`, `action1`, `action2`) |
| INSTANCE_SWAP Props     | 0                                                  | 1 (`Start`)                                                                            |
| TEXT Props              | 0 (text via nested Label instance)                 | 0 (text via nested instances)                                                          |
| Semantic Types          | Via variable mode system ("Appearance" collection) | Via `type` VARIANT prop                                                                |
| Estimated JDS Instances | ~30                                                | —                                                                                      |

## 2. Architecture Differences

| Aspect                  | JDS                                                                                                                                                                                                                                                            | OneUI                                                                                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Semantic Type Mechanism | **Variable modes** — "Appearance" collection with hierarchical sub-collections: **Brand Appearance** (Neutral, Primary, Secondary, Sparkle) and **Semantic Appearance** (Positive, Warning, Negative). Applied by setting the variable mode on a parent frame. | **Component prop** — `type` VARIANT with values: `default`, `loading`, `positive`, `negative`, `warning`, `info`. Set directly on the component instance. |
| Surface Styling         | Uses `ElevatedSurface` child instance with `Emphasis` variant (High/Medium/Low). Colors resolve through the Appearance variable collection modes.                                                                                                              | Built into the component — `type` + `attention` together determine surface color and icon.                                                                |
| Text Content            | Nested `Text` instance (Label component) inside `ContentSlot`                                                                                                                                                                                                  | Direct nested text layers (title, helpText)                                                                                                               |
| Actions                 | Not built-in — requires manual slot content                                                                                                                                                                                                                    | Built-in `actions` toggle with `action1`, `action2` booleans and `actionsPlacement` variant                                                               |
| Close Button            | Not built-in                                                                                                                                                                                                                                                   | Built-in `close` boolean                                                                                                                                  |
| Progress Indicator      | Not built-in                                                                                                                                                                                                                                                   | Built-in `progressIndicator` boolean                                                                                                                      |
| Icon / Start Slot       | Via `[example]` variant ("with icon" shows a pre-set icon)                                                                                                                                                                                                     | Via `start` boolean + `Start` INSTANCE_SWAP (flexible icon choice)                                                                                        |

### ⚠️ Key Architecture Shift

JDS uses a **system-level variable mode approach** for semantic types — the same Toast component changes its appearance based on which mode (Positive, Warning, Negative, Primary, etc.) is set on a parent frame. This means the Toast component itself has no "type" or "appearance" prop; the visual change comes from the design token resolution.

OneUI uses a **component-level prop approach** — `type` is a direct VARIANT on the Toast component. This is simpler for designers (just pick a type from the props panel) but doesn't cascade from parent frames.

## 3. Props Mapping

### 3.1 `Emphasis` → `attention` (Partial Match)

| JDS `Emphasis` | OneUI `attention` | Notes         |
| -------------- | ----------------- | ------------- |
| `High`         | `high`            | ✅ Direct map |
| `Medium`       | `medium`          | ✅ Direct map |
| `Low`          | `low`             | ✅ Direct map |

| Aspect      | JDS               | OneUI             |
| ----------- | ----------------- | ----------------- |
| Prop Name   | `Emphasis`        | `attention`       |
| Type        | VARIANT           | VARIANT           |
| **Default** | **`High`**        | **`low`**         |
| Values      | High, Medium, Low | high, medium, low |
| Casing      | PascalCase        | camelCase         |

> ⚠️ **DEFAULT INVERTED**: JDS defaults to `High` emphasis, OneUI defaults to `low` attention. Every migrated Toast will shift from bold/contrasting to subtle unless you explicitly set `attention: high`.

### 3.2 `[example]` → `start` + `Start` (Mechanism Change)

| JDS `[example]` | OneUI Equivalent                 | Notes                                        |
| --------------- | -------------------------------- | -------------------------------------------- |
| `default`       | `start: false`                   | No icon shown                                |
| `with icon`     | `start: true` + set `Start` icon | Icon shown; OneUI allows choosing which icon |

| Aspect    | JDS                       | OneUI                                          |
| --------- | ------------------------- | ---------------------------------------------- |
| Prop Name | `[example]`               | `start` (BOOLEAN) + `Start` (INSTANCE_SWAP)    |
| Type      | VARIANT                   | BOOLEAN + INSTANCE_SWAP                        |
| Default   | `default` (no icon)       | `start: true` (icon shown)                     |
| Mechanism | Fixed preset example icon | Flexible — toggle visibility + choose any icon |

> ⚠️ **DEFAULT SHIFT**: JDS defaults to no icon (`default`), OneUI defaults to icon shown (`start: true`). Migrating without adjusting will add icons where there were none.

### 3.3 Appearance Variable Modes → `type` (Mechanism Change)

This is the key mapping the user identified. JDS achieves semantic toast types through its **variable mode system**, while OneUI uses a direct `type` prop.

| JDS Appearance Mode     | OneUI `type`  | Notes                                            |
| ----------------------- | ------------- | ------------------------------------------------ |
| **Semantic → Positive** | `positive`    | ✅ Direct conceptual map                         |
| **Semantic → Warning**  | `warning`     | ✅ Direct conceptual map                         |
| **Semantic → Negative** | `negative`    | ✅ Direct conceptual map                         |
| **Brand → Neutral**     | `default`     | ✅ Closest map — neutral/default appearance      |
| **Brand → Primary**     | `info`        | 🔶 Partial — Primary brand color ≈ informational |
| **Brand → Secondary**   | No direct map | ❌ Set via `attention` or custom styling         |
| **Brand → Sparkle**     | No direct map | ❌ JDS-only brand appearance                     |
| _(no equivalent)_       | `loading`     | 🆕 OneUI-only — shows loading spinner            |

#### How JDS Appearance System Works

The variables `Surface/Elevated Low`, `Surface/Elevated Medium`, `Surface/Elevated High` in the Appearance collection resolve differently based on which mode is active, changing the Toast's surface color.

#### Migration Approach

- **In JDS**: Set the variable mode on the parent frame (e.g., set "Semantic Appearance" to "Positive" on the test board or screen frame)
- **In OneUI**: Set `type: positive` directly on the Toast instance — no parent frame configuration needed

## 4. New OneUI-Only Props

| Prop                | Type          | Default      | Purpose                                                                        | Migration Note                                                                      |
| ------------------- | ------------- | ------------ | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `type`              | VARIANT       | `default`    | Semantic type: `default`, `loading`, `positive`, `negative`, `warning`, `info` | Replaces JDS Appearance variable mode system. Map from Appearance modes (see §3.3). |
| `attention`         | VARIANT       | `low`        | Visual emphasis: `high`, `medium`, `low`                                       | Replaces JDS `Emphasis` (but default is inverted).                                  |
| `actionsPlacement`  | VARIANT       | `bottom`     | Action button position: `bottom`, `end`                                        | 🆕 No JDS equivalent.                                                               |
| `close`             | BOOLEAN       | `true`       | Show/hide close button                                                         | 🆕 Not available in JDS Toast.                                                      |
| `progressIndicator` | BOOLEAN       | `false`      | Show/hide timeout progress bar                                                 | 🆕 Not available in JDS Toast.                                                      |
| `helpText`          | BOOLEAN       | `true`       | Show/hide help text line                                                       | 🆕 Not available in JDS Toast.                                                      |
| `start`             | BOOLEAN       | `true`       | Show/hide start icon                                                           | Replaces JDS `[example]` toggle mechanism.                                          |
| `Start`             | INSTANCE_SWAP | Default icon | Choose the start icon component                                                | 🆕 JDS only had a fixed preset icon.                                                |
| `actions`           | BOOLEAN       | `false`      | Show/hide action buttons                                                       | 🆕 Not available in JDS Toast.                                                      |
| `action1`           | BOOLEAN       | `true`       | Show/hide first action                                                         | 🆕 Not available in JDS Toast.                                                      |
| `action2`           | BOOLEAN       | `true`       | Show/hide second action                                                        | 🆕 Not available in JDS Toast.                                                      |
| `title`             | BOOLEAN       | `true`       | Show/hide title text                                                           | 🆕 Not available in JDS Toast.                                                      |

## 5. Lost JDS-Only Features

| JDS Feature                 | Details                                                   | Migration Impact                                                         |
| --------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------ |
| Brand Appearance: Secondary | Variable mode for secondary brand color                   | ❌ No OneUI equivalent. Use `type: default` with custom attention level. |
| Brand Appearance: Sparkle   | Variable mode for sparkle/accent brand color              | ❌ No OneUI equivalent. Use `type: default` or closest semantic type.    |
| Variable Mode Cascading     | Set appearance once on parent frame, all children inherit | ❌ OneUI requires setting `type` on each Toast instance individually.    |
| `ElevatedSurface` Emphasis  | Independent surface elevation control via nested instance | 🔶 Merged into `attention` prop in OneUI — less granular but simpler.    |

## 6. Full Comparison Table

| Feature                  | JDS Toast                                                       | OneUI Toast                                         | Mapping                               |
| ------------------------ | --------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------- |
| **Emphasis / Attention** | `Emphasis`: High / Medium / Low (default: **High**)             | `attention`: high / medium / low (default: **low**) | ✅ Direct (DEFAULT INVERTED)          |
| **Semantic Types**       | Appearance variable modes: Positive, Warning, Negative          | `type`: positive, negative, warning                 | ✅ Conceptual map (mechanism change)  |
| **Brand Types**          | Appearance variable modes: Neutral, Primary, Secondary, Sparkle | `type`: default, info                               | 🔶 Partial (Secondary & Sparkle lost) |
| **Loading State**        | Not available                                                   | `type: loading`                                     | 🆕 OneUI-only                         |
| **Info Type**            | Not available (use Primary brand)                               | `type: info`                                        | 🆕 OneUI-only                         |
| **Icon Toggle**          | `[example]`: default / with icon                                | `start` boolean                                     | ✅ Mechanism change                   |
| **Icon Choice**          | Fixed preset icon                                               | `Start` INSTANCE_SWAP                               | 🆕 OneUI flexible                     |
| **Close Button**         | Not available                                                   | `close` boolean                                     | 🆕 OneUI-only                         |
| **Progress Bar**         | Not available                                                   | `progressIndicator` boolean                         | 🆕 OneUI-only                         |
| **Actions**              | Not available                                                   | `actions` + `action1` + `action2` booleans          | 🆕 OneUI-only                         |
| **Actions Position**     | Not available                                                   | `actionsPlacement`: bottom / end                    | 🆕 OneUI-only                         |
| **Title**                | Not available as toggle                                         | `title` boolean                                     | 🆕 OneUI-only                         |
| **Help Text**            | Not available as toggle                                         | `helpText` boolean                                  | 🆕 OneUI-only                         |
| **Total Variants**       | 6                                                               | 36                                                  | OneUI: 6× more combinations           |

## 7. Design Tips

1. **Default inversion is a major risk**: JDS Toast defaults to `High` emphasis (bold, contrasting surface). OneUI defaults to `low` attention (subtle). Every Toast you migrate will look dramatically different unless you explicitly set `attention: high`.

2. **Semantic types are now simpler**: Instead of configuring variable modes on parent frames, just set `type: positive/negative/warning` directly on the Toast. This is faster but means you lose the cascading behavior.

3. **Don't forget actions**: OneUI Toast has built-in action buttons — no need to hack them into a content slot. Turn on `actions: true` and configure `action1`/`action2`.

4. **Icon flexibility**: JDS gave you a fixed icon or no icon. OneUI lets you choose any icon via the `Start` instance swap. Use this to add contextual icons (✓ for positive, ⚠ for warning, etc.).

5. **Brand appearances need rethinking**: If you used JDS Brand Appearance modes (Primary, Secondary, Sparkle), you'll need to decide which OneUI `type` best represents that intent. `Primary` → `info` is the closest; `Secondary` and `Sparkle` have no equivalent.

6. **Loading state is new**: OneUI's `type: loading` with `progressIndicator: true` gives you a proper loading toast pattern that JDS didn't support natively.

## 8. Migration Checklist

- [ ] Replace JDS Toast with OneUI Toast
- [ ] Map `Emphasis` → `attention` (remember: **default flips from High to low**)
- [ ] Map JDS Appearance variable modes to OneUI `type`:
  - [ ] Semantic Positive → `type: positive`
  - [ ] Semantic Warning → `type: warning`
  - [ ] Semantic Negative → `type: negative`
  - [ ] Brand Neutral → `type: default`
  - [ ] Brand Primary → `type: info` (or `type: default`)
  - [ ] Brand Secondary → decide replacement (`type: default` + attention level)
  - [ ] Brand Sparkle → decide replacement
- [ ] Map `[example]` → `start` boolean (default shifts: no icon → icon shown)
- [ ] Remove any parent-frame Appearance variable mode overrides (no longer needed)
- [ ] Configure new OneUI features as needed:
  - [ ] `close` — close button (default: on)
  - [ ] `actions` — action buttons
  - [ ] `actionsPlacement` — bottom vs end
  - [ ] `progressIndicator` — timeout progress bar
  - [ ] `title` / `helpText` — text toggles
- [ ] Verify text content migrated correctly (JDS nested Label → OneUI nested text)
- [ ] Test all semantic types visually match design intent
- [ ] Verify ~30 existing JDS Toast instances are covered

---

---

# Tooltip  ·  JDS v3 → OneUI

## 1. Overview

| Aspect                  | JDS (Jio Testlab Library)                          | OneUI Components                      |
| ----------------------- | -------------------------------------------------- | ------------------------------------- |
| Component Name          | Tooltip                                            | Tooltip                               |
| Component Set ID        | `9772:40346`                                       | `2323:25`                             |
| Total Variants          | 2                                                  | 12                                    |
| VARIANT Props           | 1 (`Custom Width`)                                 | 1 (`position`)                        |
| BOOLEAN Props           | 0                                                  | 1 (`tip`)                             |
| INSTANCE_SWAP Props     | 0                                                  | 0                                     |
| TEXT Props              | 0 (text via nested Label instance)                 | 0 (text is a direct TEXT child)       |
| Sub-Components          | `Tip` (12-variant arrow component set) + `TipItem` | None — arrow is a direct VECTOR child |
| Estimated JDS Instances | ~5                                                 | —                                     |

## 2. Architecture Differences

| Aspect                     | JDS                                                                                                                                                                      | OneUI                                                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Arrow / Tip                | **Separate component set** — `Tip` with 12 `Positioning` variants nested as an INSTANCE inside Tooltip. `TipItem` is a standalone helper component for the arrow vector. | **Inline vector** — arrow is a direct VECTOR child (`Tip`) with visibility controlled by a `tip` BOOLEAN prop.               |
| Position / Direction       | Controlled via the nested `Tip` instance's `Positioning` variant (12 values: Top Start, Top, Top End, etc.)                                                              | Controlled via `position` VARIANT directly on the Tooltip (12 values: topStart, top, topEnd, etc.)                           |
| Position Naming Convention | **Arrow-based** — `Positioning` describes where the **arrow** is placed (e.g. `Top` = arrow at top = tooltip appears BELOW target)                                       | **Tooltip-based** — `position` describes where the **tooltip** appears (e.g. `top` = tooltip above target = arrow at bottom) |
| Custom Width               | Dedicated VARIANT prop (`Custom Width`: Default / True)                                                                                                                  | Not a component prop — width adjusts naturally via auto-layout (hug or fixed by the designer)                                |
| Text Content               | Nested `Text` instance (Label component: Body S, Emphasis High, Weight Medium)                                                                                           | Direct TEXT node child (`"Tooltip"`)                                                                                         |
| Surface Fill               | Uses variable `Surface/Contrasting`                                                                                                                                      | Uses variable `colour/surface/surface`                                                                                       |
| Padding                    | 8px top/bottom, 12px left/right                                                                                                                                          | 6px top/bottom, 12px left/right                                                                                              |
| Corner Radius              | 6px                                                                                                                                                                      | 6px                                                                                                                          |
| Font                       | JioType Var Medium, 14px                                                                                                                                                 | JioType Var Medium, 14px                                                                                                     |
| Layout Mode                | HORIZONTAL                                                                                                                                                               | VERTICAL                                                                                                                     |

### ⚠️ Critical Architecture Difference — Position Naming Is INVERTED

This is the most important difference to understand:

- **JDS `Positioning`** = where the **ARROW** is placed on the tooltip body
  - `Top` = arrow at top edge → tooltip appears **below** the target
  - `Bottom` = arrow at bottom edge → tooltip appears **above** the target
  - `Start` = arrow at left edge → tooltip appears to the **right** of the target
  - `End` = arrow at right edge → tooltip appears to the **left** of the target

- **OneUI `position`** = where the **TOOLTIP** appears relative to the target
  - `top` = tooltip **above** target → arrow at bottom
  - `bottom` = tooltip **below** target → arrow at top
  - `left` = tooltip to the **left** of target → arrow at right
  - `right` = tooltip to the **right** of target → arrow at left

**They are opposite!** Mapping `Top` → `top` (same name) will give you the wrong placement. `Top` maps to `bottom`, `Bottom` maps to `top`, etc.

## 3. Props Mapping

### 3.1 `Tip > Positioning` → `position` (Mechanism Change + INVERTED Naming)

> ⚠️ **CRITICAL**: The naming convention is **opposite**. JDS names the arrow position, OneUI names the tooltip position. Every mapping is inverted.

| JDS `Tip > Positioning` | OneUI `position` | Explanation                                        |
| ----------------------- | ---------------- | -------------------------------------------------- |
| `Top Start`             | `bottomStart`    | Arrow at top-left → tooltip is below-start         |
| `Top`                   | `bottom`         | Arrow at top → tooltip is below                    |
| `Top End`               | `bottomEnd`      | Arrow at top-right → tooltip is below-end          |
| `Bottom Start`          | `topStart`       | Arrow at bottom-left → tooltip is above-start      |
| `Bottom`                | `top`            | Arrow at bottom → tooltip is above                 |
| `Bottom End`            | `topEnd`         | Arrow at bottom-right → tooltip is above-end       |
| `Start Start`           | `rightStart`     | Arrow at left-top → tooltip is to the right-start  |
| `Start`                 | `right`          | Arrow at left → tooltip is to the right            |
| `Start End`             | `rightEnd`       | Arrow at left-bottom → tooltip is to the right-end |
| `End Start`             | `leftStart`      | Arrow at right-top → tooltip is to the left-start  |
| `End`                   | `left`           | Arrow at right → tooltip is to the left            |
| `End End`               | `leftEnd`        | Arrow at right-bottom → tooltip is to the left-end |

| Aspect            | JDS                                      | OneUI                                        |
| ----------------- | ---------------------------------------- | -------------------------------------------- |
| Prop Name         | `Positioning` (on nested `Tip` instance) | `position`                                   |
| Type              | VARIANT (on sub-component)               | VARIANT (on Tooltip)                         |
| Default           | `Bottom Start` (as used in Tooltip)      | `top`                                        |
| Naming Convention | **Arrow position** (where arrow sits)    | **Tooltip position** (where tooltip appears) |
| Direction System  | Logical (`Start`/`End`)                  | Physical (`left`/`right`)                    |
| Casing            | PascalCase                               | camelCase                                    |
| Values            | 12                                       | 12                                           |

> ⚠️ **DEFAULT MATCHES**: JDS default `Bottom Start` (arrow at bottom) maps to OneUI default `top` (tooltip above target) — the same visual result. But every other value must be carefully inverted.

### 3.2 `Custom Width` → _(Removed)_

| Aspect    | JDS               | OneUI          |
| --------- | ----------------- | -------------- |
| Prop Name | `Custom Width`    | _(Not a prop)_ |
| Type      | VARIANT           | —              |
| Default   | `Default`         | —              |
| Values    | `Default`, `True` | —              |

> In JDS, `Custom Width: True` enables manual width override. In OneUI, width is controlled naturally — the text wraps or the designer sets a fixed width on the frame directly. No dedicated prop needed.

### 3.3 Arrow Visibility → `tip` (New Mechanism)

| Aspect    | JDS                                  | OneUI   |
| --------- | ------------------------------------ | ------- |
| Prop Name | _(no toggle — arrow always visible)_ | `tip`   |
| Type      | —                                    | BOOLEAN |
| Default   | _(always shown)_                     | `true`  |

> 🆕 OneUI adds the ability to hide the arrow/tip via a boolean. JDS Tooltip always shows the arrow.

## 4. Sub-Component Comparison

### JDS `Tip` Component Set (ID: `9772:39983`)

| Prop          | Type    | Default     | Values                                                                                                                           |
| ------------- | ------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `Positioning` | VARIANT | `Top Start` | 12 positions (Top Start, Top, Top End, End Start, End, End End, Bottom End, Bottom, Bottom Start, Start End, Start, Start Start) |

- Contains `TipItem` component (standalone vector arrow shape)
- Each variant rotates/positions the arrow vector for the corresponding direction
- The `Positioning` value describes **where the arrow is**, not where the tooltip appears

### JDS `TipItem` Component (ID: `9772:39974`)

- Standalone component with no props
- Contains a single `Tip` vector
- Used inside the `Tip` component set variants

> **In OneUI**: Both `Tip` component set and `TipItem` are eliminated. The arrow is a direct VECTOR child of the Tooltip component, with visibility controlled by the `tip` BOOLEAN. No separate components needed.

## 5. New OneUI-Only Props

| Prop       | Type    | Default | Purpose                              | Migration Note                                                                                      |
| ---------- | ------- | ------- | ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `tip`      | BOOLEAN | `true`  | Show/hide arrow tip                  | 🆕 JDS always shows the arrow. Set `false` to create tooltip without pointer.                       |
| `position` | VARIANT | `top`   | Tooltip placement relative to target | Replaces JDS nested `Tip` instance mechanism. **All 12 positions map but are INVERTED** (see §3.1). |

## 6. Lost JDS-Only Features

| JDS Feature              | Details                                                  | Migration Impact                                                                             |
| ------------------------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `Custom Width` variant   | Toggle between default auto-width and custom fixed width | 🔶 Minor — set fixed width directly on the OneUI Tooltip frame manually. No functional loss. |
| `Tip` component set      | Separate reusable arrow component with 12 variants       | 🔶 Architecture simplification — OneUI inlines the arrow. No functional loss.                |
| `TipItem` component      | Standalone arrow vector component                        | 🔶 Architecture simplification — no longer needed.                                           |
| Logical direction naming | `Start`/`End` instead of `Left`/`Right`                  | 🔶 Minor — OneUI uses physical directions. No functional difference in LTR.                  |
| Nested Label instance    | Text via `Text` component (Body S, Emphasis High)        | 🔶 OneUI uses direct TEXT node. Simpler but less connected to typography system.             |

## 7. Full Comparison Table

| Feature                  | JDS Tooltip                                                                                        | OneUI Tooltip                                                                   | Mapping                             |
| ------------------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------- |
| **Position / Direction** | Via nested `Tip` instance `Positioning` (12 values, PascalCase, Start/End naming, **arrow-based**) | `position` VARIANT (12 values, camelCase, Left/Right naming, **tooltip-based**) | ⚠️ All 12 map but are **INVERTED**  |
| **Arrow Visibility**     | Always visible (no toggle)                                                                         | `tip` BOOLEAN (default: true)                                                   | 🆕 OneUI adds hide option           |
| **Custom Width**         | `Custom Width` VARIANT (Default / True)                                                            | Not a prop                                                                      | ❌ Set manually on frame            |
| **Text Content**         | Nested `Text` instance (Label component)                                                           | Direct TEXT child                                                               | ✅ Architecture change only         |
| **Arrow Sub-Component**  | `Tip` CS (12 variants) + `TipItem`                                                                 | Inline VECTOR                                                                   | ✅ Simplified                       |
| **Surface Variable**     | `Surface/Contrasting`                                                                              | `colour/surface/surface`                                                        | ✅ Token name change                |
| **Padding**              | 8px / 12px                                                                                         | 6px / 12px                                                                      | ⚠️ Vertical padding reduced         |
| **Corner Radius**        | 6px                                                                                                | 6px                                                                             | ✅ Same                             |
| **Font**                 | JioType Var Medium 14px                                                                            | JioType Var Medium 14px                                                         | ✅ Same                             |
| **Total Variants**       | 2 (Custom Width)                                                                                   | 12 (Position)                                                                   | OneUI exposes position at top level |

## 8. Design Tips

1. **Position mapping is INVERTED — this is the #1 migration risk**: JDS `Positioning` names where the arrow is. OneUI `position` names where the tooltip is. These are opposite concepts. When migrating, flip the direction:
   - JDS `Top` → OneUI `bottom`
   - JDS `Bottom` → OneUI `top`
   - JDS `Start` → OneUI `right`
   - JDS `End` → OneUI `left`

2. **Default position is visually the same**: JDS default (`Bottom Start` = arrow at bottom) and OneUI default (`top` = tooltip above) produce the same visual result — tooltip above the target, arrow pointing down. So instances using the default don't need position changes.

3. **Arrow is now optional**: OneUI lets you hide the arrow with `tip: false`. Consider using this for inline tooltips or contexts where the pointer isn't needed.

4. **No Custom Width prop needed**: If you were using `Custom Width: True` in JDS, simply set the OneUI Tooltip frame to a fixed width manually. The auto-layout handles text wrapping naturally.

5. **Padding difference**: OneUI has 2px less vertical padding (6px vs 8px). This makes tooltips slightly more compact. The visual difference is minimal but worth noting for pixel-perfect comparisons.

6. **Sub-components are gone**: You don't need to worry about `Tip` or `TipItem` in OneUI. Everything is self-contained in the single Tooltip component.

7. **Quick reference for common positions**:
   | Want tooltip to appear... | JDS `Positioning` | OneUI `position` |
   |---|---|---|
   | Above target (most common) | `Bottom` / `Bottom Start` | `top` / `topStart` |
   | Below target | `Top` / `Top Start` | `bottom` / `bottomStart` |
   | Left of target | `End` / `End Start` | `left` / `leftStart` |
   | Right of target | `Start` / `Start Start` | `right` / `rightStart` |

## 9. Migration Checklist

- [ ] Replace JDS Tooltip with OneUI Tooltip
- [ ] **CRITICAL** — Map positioning with INVERTED logic:
  - [ ] JDS `Top` / `Top Start` / `Top End` → OneUI `bottom` / `bottomStart` / `bottomEnd`
  - [ ] JDS `Bottom` / `Bottom Start` / `Bottom End` → OneUI `top` / `topStart` / `topEnd`
  - [ ] JDS `Start` / `Start Start` / `Start End` → OneUI `right` / `rightStart` / `rightEnd`
  - [ ] JDS `End` / `End Start` / `End End` → OneUI `left` / `leftStart` / `leftEnd`
- [ ] Instances using default position (Bottom Start → top) need no position change
- [ ] Remove reliance on `Custom Width` variant — set fixed width manually if needed
- [ ] `tip` boolean defaults to `true` (arrow shown) — same as JDS behavior, no change needed unless you want to hide it
- [ ] Verify text content migrated (JDS nested Label → OneUI direct TEXT node)
- [ ] Note slight padding difference (8px → 6px vertical)
- [ ] Remove any orphaned `Tip` or `TipItem` component instances
- [ ] Verify ~5 existing JDS Tooltip instances are covered

---
