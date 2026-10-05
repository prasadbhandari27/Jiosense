---
name: jds-v3-oneui-media-and-identity
description: >-
  JDS v3 (Jio Testlab Library) → OneUI migration mapping for icons, images, avatars and logo. Covers Icon, IconContained, IconContainedSemantic, Image, Avatar, BadgeAvatarOverlap, Logo, and standalone Text/Label.
  Use when swapping or prop-mapping any of these components while converting a reference file to OneUI.
---

# Media and identity — JDS v3 → OneUI migration

Part of the JDS v3 → OneUI migration skill set. For routing across all component behaviours, load
`get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-migration-figma-agent.md")`.

**Load this skill when migrating:** Icon, IconContained, IconContainedSemantic, Image, Avatar, BadgeAvatarOverlap, Logo, standalone Text/Label.

## Components in this skill

- **Icon / IconContained** — search `Icon`
- **Image** — search `Image`
- **Avatar** — search `Avatar`
- **Logo** — search `Logo`
- **Text / Label (standalone)** — search `Text / Label`

Jump straight to the component you need — each has its own Overview, Props Mapping, full comparison
table, and Migration Checklist. Do not invent prop names or variant values; use the tables below.

---

# Icon / IconContained  ·  JDS v3 → OneUI

---

# 1. Component Family Overview


| Component                 | JDS (Jio Testlab Library) | OneUI            | Purpose                                                       |
| ------------------------- | ------------------------- | ---------------- | ------------------------------------------------------------- |
| **Icon**                  | ✅ (506 instances)         | ✅ (55 instances) | Standalone icon with size, emphasis/attention, and asset swap |
| **IconContained**         | ✅ (0 instances)           | ✅ (1 instance)   | Icon inside a container shape (circle/rounded bg)             |
| **IconContainedSemantic** | ✅ (0 instances)           | ❌                | Semantic variant of contained icon — JDS-only                 |


> **Summary:** The core `Icon` and `IconContained` components exist in both libraries. JDS has an additional `IconContainedSemantic` variant with no OneUI equivalent. OneUI has an extensive Slot Library for icons at various sizes and emphasis levels that JDS lacks.

---

---

# 2. Icon → Icon

## Overview


|                         | JDS (Jio Testlab Library) | OneUI      |
| ----------------------- | ------------------------- | ---------- |
| **Component Name**      | Icon                      | Icon       |
| **Instances in Use**    | 506                       | 55         |
| **Child Instance Tags** | Icon Asset                | Icon Asset |


---

## Props Mapping

### Icon Asset


|               | JDS           | OneUI         |
| ------------- | ------------- | ------------- |
| **Prop Name** | `Icon Asset`  | `Icon Asset`  |
| **Type**      | INSTANCE_SWAP | INSTANCE_SWAP |
| **Default**   | "6098:60"     | "2:3"         |


> **Migration Note:** Both use `Icon Asset` as an INSTANCE_SWAP prop — **same name, same mechanism**. This is the cleanest mapping across all components.
>
> **✅ Same icon asset library — nothing to migrate.** JDS v3 and OneUI Components draw from the **same underlying icon asset library**. Every glyph the old frame used exists, under the same name. So there is **no equivalence hunting, no substitution, and no "does this icon exist in OneUI" verification pass** — the asset carries straight over.
>
> The only thing to do is mechanical: a freshly placed OneUI Icon starts at its own default asset (`2:3` vs JDS `6098:60`), so point `Icon Asset` at the same glyph the old instance used. That is a copy, not a mapping decision — and leaving it at the default is still a defect.

---

### Size


|               | JDS     | OneUI   |
| ------------- | ------- | ------- |
| **Prop Name** | `Size`  | `size`  |
| **Type**      | VARIANT | VARIANT |
| **Default**   | "M"     | "M"     |


#### Value Mapping


| JDS `Size`          | OneUI `size`        | Notes                                    |
| ------------------- | ------------------- | ---------------------------------------- |
| 5XS                 | ❌ *(no equivalent)* | JDS-only — lost                          |
| 4XS                 | ❌ *(no equivalent)* | JDS-only — lost                          |
| 3XS                 | ❌ *(no equivalent)* | JDS-only — lost                          |
| 2XS                 | 2XS                 | Direct mapping ✅                         |
| XS                  | XS                  | Direct mapping ✅                         |
| S                   | S                   | Direct mapping ✅                         |
| M                   | M                   | Direct mapping ✅ (both defaults)         |
| L                   | L                   | Direct mapping ✅                         |
| XL                  | XL                  | Direct mapping ✅                         |
| 2XL                 | 2XL                 | Direct mapping ✅                         |
| 3XL                 | ❌ *(no equivalent)* | JDS-only — lost                          |
| 4XL                 | ❌ *(no equivalent)* | JDS-only — lost                          |
| 5XL                 | ❌ *(no equivalent)* | JDS-only — lost                          |
| ❌ *(no equivalent)* | custom              | OneUI-only (new) — allows arbitrary size |


> **⚠️ Major size scale difference:** JDS has **13 sizes** (5XS–5XL), OneUI has **8 sizes** (2XS–2XL + custom). Five extreme sizes are lost (5XS, 4XS, 3XS, 3XL, 4XL, 5XL). The `custom` option in OneUI allows setting arbitrary sizes, which can cover the lost extremes if needed.
>
> **Defaults match** — both default to "M". Note that OneUI uses **uppercase** size values here (unlike most other OneUI components that use lowercase).

#### Suggested Fallback for Lost Sizes


| JDS Size (Lost) | Suggested OneUI Mapping          |
| --------------- | -------------------------------- |
| 5XS             | `custom` (set manually) or `2XS` |
| 4XS             | `custom` (set manually) or `2XS` |
| 3XS             | `custom` (set manually) or `2XS` |
| 3XL             | `custom` (set manually) or `2XL` |
| 4XL             | `custom` (set manually) or `2XL` |
| 5XL             | `custom` (set manually) or `2XL` |


---

### Emphasis → *(No Direct Equivalent)*


|               | JDS                                                                   | OneUI                   |
| ------------- | --------------------------------------------------------------------- | ----------------------- |
| **Prop Name** | `Emphasis`                                                            | *(Not exposed on Icon)* |
| **Type**      | VARIANT                                                               | —                       |
| **Default**   | "High"                                                                | —                       |
| **Options**   | Low, Medium, High, [On Contrasting], [On Bold] High, [On Bold] Medium | —                       |


> **⚠️ Critical — Lost Prop:** JDS Icon has a rich `Emphasis` system with **6 options** controlling icon color/opacity. OneUI Icon has **no emphasis/attention prop** at all.
>
> **What JDS Emphasis does:**
>
> - `High` — full opacity/contrast icon (default)
> - `Medium` — reduced opacity/lighter icon
> - `Low` — very light/subtle icon
> - `[On Contrasting]` — icon on dark/contrasting backgrounds
> - `[On Bold] High` — high emphasis on bold/colored surfaces
> - `[On Bold] Medium` — medium emphasis on bold/colored surfaces
>
> **Migration Impact:** This is the biggest migration challenge for Icon. In OneUI, icon color/emphasis is likely controlled at the usage level (parent component context, manual color override, or design tokens) rather than as a built-in Icon prop. When migrating:
>
> - `High` → default OneUI Icon (no change needed)
> - `Medium` / `Low` → manually adjust opacity or use a lower-emphasis color token
> - `[On Contrasting]` / `[On Bold]` variants → set appropriate color for the background context manually
>
> **Slot Library Alternative:** OneUI has pre-configured `Slot/size{N}/IconLow`, `Slot/size{N}/IconMedium`, `Slot/size{N}/IconHigh`, and `Slot/size{N}/IconTinted` slot components that encode emphasis at the slot level. When the icon lives inside another component's slot, use these instead of the raw Icon component.

---

### Tinted


|               | JDS         | OneUI                   |
| ------------- | ----------- | ----------------------- |
| **Prop Name** | `Tinted`    | *(Not exposed on Icon)* |
| **Type**      | VARIANT     | —                       |
| **Default**   | "False"     | —                       |
| **Options**   | False, True | —                       |


> **Migration Note:** JDS `Tinted` applies a colored tint to the icon (vs. the standard monochrome). OneUI has no direct equivalent on the Icon component. However, OneUI Slot Library has `Slot/size{N}/IconTinted` and `Slot/size{N}/IconTintedA11y` components that provide tinted icon behavior at the slot level.
>
> **When migrating:**
>
> - `Tinted: False` → default OneUI Icon (no change)
> - `Tinted: True` → use OneUI `Slot/size{N}/IconTinted` if inside a slot, or manually apply tint color

---

## Full Props Comparison Table (Icon)


| #   | Prop Concept | JDS Prop     | JDS Type      | JDS Values   | JDS Default | OneUI Prop   | OneUI Type    | OneUI Values         | OneUI Default | Status                                        |
| --- | ------------ | ------------ | ------------- | ------------ | ----------- | ------------ | ------------- | -------------------- | ------------- | --------------------------------------------- |
| 1   | Icon asset   | `Icon Asset` | INSTANCE_SWAP | any icon     | 6098:60     | `Icon Asset` | INSTANCE_SWAP | any icon             | 2:3           | ✅ Direct 1:1 (same name!)                     |
| 2   | Size         | `Size`       | VARIANT       | 5XS–5XL (13) | M           | `size`       | VARIANT       | 2XS–2XL + custom (8) | M             | ⚠️ Partial — 5 sizes lost, `custom` added     |
| 3   | Emphasis     | `Emphasis`   | VARIANT       | 6 options    | High        | *(none)*     | —             | —                    | —             | ❌ JDS-only (LOST — use slots or manual color) |
| 4   | Tinted       | `Tinted`     | VARIANT       | False, True  | False       | *(none)*     | —             | —                    | —             | ❌ JDS-only (LOST — use slot library)          |


---

## Migration Checklist (Icon)

- [ ] Map `Icon Asset` → `Icon Asset` — **same mechanism, same asset library**; copy the glyph across, no equivalence check needed
- [ ] Map `Size` (2XS→2XS, XS→XS, S→S, M→M, L→L, XL→XL, 2XL→2XL) — **flag 5XS, 4XS, 3XS, 3XL, 4XL, 5XL instances** for `custom` or nearest size
- [ ] Handle `Emphasis` loss — decide per-instance: use Slot Library icons, manual color override, or accept default appearance
- [ ] Handle `Tinted` loss — use `Slot/size{N}/IconTinted` for tinted icons in slots, or apply tint manually
- [ ] Audit all **506 JDS instances** — high count, plan for bulk migration

---

---

# 3. IconContained → IconContained

## Overview


|                         | JDS (Jio Testlab Library) | OneUI         |
| ----------------------- | ------------------------- | ------------- |
| **Component Name**      | IconContained             | IconContained |
| **Instances in Use**    | 0                         | 1             |
| **Child Instance Tags** | Icon                      | Icon          |


> **Note:** Both have 0–1 instances, so this is a low-traffic migration. Document for completeness and future use.

---

## Props Mapping

### Size


|               | JDS     | OneUI   |
| ------------- | ------- | ------- |
| **Prop Name** | `Size`  | `Size`  |
| **Type**      | VARIANT | VARIANT |
| **Default**   | "2XL"   | "m"     |


#### Value Mapping


| JDS `Size`          | OneUI `Size`                      | Notes                   |
| ------------------- | --------------------------------- | ----------------------- |
| S                   | ❌ *(no equivalent)* — map to `xs` | Lossy                   |
| M                   | ❌ *(no match)* — map to `m`       | Case change only        |
| L                   | l                                 | Direct mapping ✅        |
| XL                  | xl                                | Direct mapping ✅        |
| 2XL                 | ❌ *(no equivalent)* — map to `xl` | Lossy — OneUI max is xl |
| ❌ *(no equivalent)* | xs                                | OneUI-only (new)        |


> **⚠️ Default shift:** JDS defaults to `2XL`, OneUI defaults to `m`. This is a **massive default shift** — migrated IconContained will appear much smaller unless explicitly set to a larger size.

---

### Emphasis → attention


|               | JDS        | OneUI       |
| ------------- | ---------- | ----------- |
| **Prop Name** | `Emphasis` | `attention` |
| **Type**      | VARIANT    | VARIANT     |
| **Default**   | "Low"      | "medium"    |


#### Value Mapping


| JDS `Emphasis` | OneUI `attention`   | Notes            |
| -------------- | ------------------- | ---------------- |
| Low            | ❌ *(no equivalent)* | JDS-only — LOST  |
| Medium         | medium              | Direct mapping ✅ |
| High           | high                | Direct mapping ✅ |


> **⚠️ Default shift:** JDS defaults to `Low`, OneUI defaults to `medium`. OneUI has lost the `Low` attention level for IconContained.

---

## Full Props Comparison Table (IconContained)


| #   | Prop Concept         | JDS Prop   | JDS Type | JDS Values            | JDS Default | OneUI Prop  | OneUI Type | OneUI Values        | OneUI Default | Status                                     |
| --- | -------------------- | ---------- | -------- | --------------------- | ----------- | ----------- | ---------- | ------------------- | ------------- | ------------------------------------------ |
| 1   | Size                 | `Size`     | VARIANT  | S, M, L, XL, 2XL (5)  | 2XL         | `Size`      | VARIANT    | xs, s, m, l, xl (5) | m             | ⚠️ Scale shift + default shift (2XL → m)   |
| 2   | Emphasis / Attention | `Emphasis` | VARIANT  | Low, Medium, High (3) | Low         | `attention` | VARIANT    | high, medium (2)    | medium        | ⚠️ Low lost + default shift (Low → medium) |


---

## Migration Checklist (IconContained)

- [ ] Map `Size` with scale shift — flag `2XL` and `S` instances for nearest equivalent
- [ ] **Set `Size` explicitly** — default shifts dramatically from 2XL to m
- [ ] Map `Emphasis` → `attention` (Medium→medium, High→high) — **flag `Low` instances**
- [ ] Audit all **0 JDS instances**

---

---

# 4. IconContainedSemantic (JDS-Only — No OneUI Equivalent)


|                      | JDS (Jio Testlab Library) | OneUI            |
| -------------------- | ------------------------- | ---------------- |
| **Component Name**   | IconContainedSemantic     | ❌ Does not exist |
| **Instances in Use** | 0                         | —                |


> 0 instances, no migration needed. Use standard `IconContained` with semantic color/icon if needed in future.

---

---

# 5. OneUI Slot Library (Icon Slots)


| Slot Type                     | Emphasis/Style      | Available Sizes |
| ----------------------------- | ------------------- | --------------- |
| `Slot/size{N}/IconHigh`       | High emphasis       | 2–16 (10 sizes) |
| `Slot/size{N}/IconMedium`     | Medium emphasis     | 2–16 (10 sizes) |
| `Slot/size{N}/IconLow`        | Low emphasis        | 2–16 (10 sizes) |
| `Slot/size{N}/IconTinted`     | Tinted/colored      | 2–16 (10 sizes) |
| `Slot/size{N}/IconTintedA11y` | Tinted (accessible) | 2–16 (10 sizes) |


> OneUI moves icon emphasis from a component-level prop to the Slot Library system. JDS `Emphasis` → OneUI Slot variants.

---

# 6. Complete Component Summary


| #   | Component                 | JDS Instances | OneUI Instances | Migration Difficulty | Key Risk                                                       |
| --- | ------------------------- | ------------- | --------------- | -------------------- | -------------------------------------------------------------- |
| 1   | **Icon**                  | 506           | 55              | ⚠️ Medium-High       | `Emphasis` (6 levels) and `Tinted` lost — 5 extreme sizes lost |
| 2   | **IconContained**         | 0             | 1               | ⚠️ Medium            | Default shift (2XL→m), `Low` emphasis lost                     |
| 3   | **IconContainedSemantic** | 0             | ❌               | ✅ None               | 0 instances, component lost                                    |


---

# 7. Complete Migration Checklist

## Icon (506 instances — HIGH PRIORITY)

- [ ] Map `Icon Asset` → `Icon Asset` (shared asset library — copy the glyph, no compatibility check)
- [ ] Map `Size` (7 of 13 map directly) — flag extreme sizes for `custom`
- [ ] Handle `Emphasis` loss — use Slot Library icons or manual color
- [ ] Handle `Tinted` loss — use Slot/IconTinted or manual tint
- [ ] Confirm no icon is left at its default glyph (assets themselves need no migration — shared library)

## IconContained (0 instances)

- [ ] Note default shifts: Size 2XL→m, Emphasis Low→medium

## IconContainedSemantic (0 instances — LOST)

- [ ] No migration needed

## Total Instances to Migrate

- [ ] **506 total** (506 Icon + 0 IconContained + 0 IconContainedSemantic)

---

---

# Image  ·  JDS v3 → OneUI

---

# 1. Component Overview


|                         | JDS (Jio Testlab Library) | OneUI                                                                     |
| ----------------------- | ------------------------- | ------------------------------------------------------------------------- |
| **Component Name**      | Image                     | Image                                                                     |
| **Total Variants**      | 21 (7 ratios × 3 shapes)  | 48 (7 ratios × 2 orientations × 2 interactive × 2 scrim — not all combos) |
| **Instances in Use**    | 0                         | 1                                                                         |
| **Page**                | Image                     | ↳ Image                                                                   |
| **Child Instance Tags** | *(none)*                  | Scrim                                                                     |


> Both libraries have an `Image` component. OneUI's version is significantly more feature-rich with orientation control, interactivity, scrim overlay, and alt text support. JDS focuses purely on aspect ratio and corner shape.

---

---

# 2. Image → Image

## Architecture Difference


| Aspect                | JDS                                 | OneUI                                                                |
| --------------------- | ----------------------------------- | -------------------------------------------------------------------- |
| **Approach**          | Simple — aspect ratio + shape only  | Rich — aspect ratio + orientation + interactivity + scrim + alt text |
| **Children**          | None                                | Scrim (overlay child)                                                |
| **Prop count**        | 2 props                             | 5 props                                                              |
| **Focus**             | Visual shape of the image container | Full image component with accessibility and interaction support      |
| **Portrait handling** | Separate ratio values (9:16, 3:4)   | `orientation: portrait` modifier on landscape ratios                 |


> **Key Insight:** JDS Image is essentially a styled container (pick a ratio and corner style). OneUI Image is a full-featured component with accessibility (`altText`), interaction states (`interactive`), overlay support (`scrim`), and orientation control. This reflects OneUI's more modern, comprehensive approach.

---

## Props Mapping

### Aspect Ratio


|               | JDS            | OneUI         |
| ------------- | -------------- | ------------- |
| **Prop Name** | `Aspect Ratio` | `aspectRatio` |
| **Type**      | VARIANT        | VARIANT       |
| **Default**   | "Auto"         | "auto"        |


#### Value Mapping


| JDS `Aspect Ratio`  | OneUI `aspectRatio`            | Notes                                                 |
| ------------------- | ------------------------------ | ----------------------------------------------------- |
| Auto                | auto                           | Direct mapping ✅ (both defaults)                      |
| 1:1                 | 1:1                            | Direct mapping ✅                                      |
| 16:9                | 16:9                           | Direct mapping ✅                                      |
| 9:16                | 16:9 + `orientation: portrait` | ✅ Equivalent — mechanism change (ratio × orientation) |
| 4:3                 | 4:3                            | Direct mapping ✅                                      |
| 3:4                 | 4:3 + `orientation: portrait`  | ✅ Equivalent — mechanism change (ratio × orientation) |
| 2.75:1              | ❌ *(no exact equivalent)*      | Closest: `2:1` or `21:9`. See note below              |
| ❌ *(no equivalent)* | 2:1                            | OneUI-only (new)                                      |
| ❌ *(no equivalent)* | 3:2                            | OneUI-only (new)                                      |
| ❌ *(no equivalent)* | 21:9                           | OneUI-only (new — ultra-wide)                         |


> **Migration Note:** 6 of 7 JDS ratios have a direct or equivalent mapping in OneUI — **including portrait ratios**. Only `2.75:1` has no exact match.
>
> **⚠️ Architecture difference for portrait ratios:** JDS encodes portrait ratios as separate values (`9:16`, `3:4`). OneUI uses a cleaner system: `aspectRatio` × `orientation`. So `16:9` + `orientation: portrait` = `9:16`. This is NOT a loss — all portrait ratios are fully supported, just expressed differently.

#### Portrait Ratio Conversion Guide


| JDS Ratio | OneUI Equivalent                              | How to Set     |
| --------- | --------------------------------------------- | -------------- |
| `9:16`    | `aspectRatio: 16:9` + `orientation: portrait` | Set both props |
| `3:4`     | `aspectRatio: 4:3` + `orientation: portrait`  | Set both props |


#### 2.75:1 Handling

`2.75:1` (≈ 2.75) has no exact OneUI match. Closest options:

- `2:1` (ratio = 2.0) — slightly less wide
- `21:9` (ratio ≈ 2.33) — closer but still narrower
- Neither is exact. If `2.75:1` is critical, manual frame sizing may be needed.

#### OneUI orientation × aspectRatio Combinations (from actual component)


| aspectRatio | landscape | portrait                                    |
| ----------- | --------- | ------------------------------------------- |
| auto        | ✅         | ❌ (auto is landscape only)                  |
| 1:1         | ✅         | ❌ (1:1 is symmetrical — no portrait needed) |
| 2:1         | ✅         | ✅ (= 1:2)                                   |
| 3:2         | ✅         | ✅ (= 2:3)                                   |
| 4:3         | ✅         | ✅ (= 3:4)                                   |
| 16:9        | ✅         | ✅ (= 9:16)                                  |
| 21:9        | ✅         | ✅ (= 9:21)                                  |


> **Design Tip:** `auto` and `1:1` don't have portrait variants (auto is freeform, 1:1 is symmetrical). All other ratios support both orientations, giving you 12 effective ratio configurations from just 7 ratio values + 2 orientations.

---

### Shape → *(No OneUI Equivalent)*


|               | JDS                    | OneUI           |
| ------------- | ---------------------- | --------------- |
| **Prop Name** | `Shape`                | *(Not exposed)* |
| **Type**      | VARIANT                | —               |
| **Default**   | "Rounded"              | —               |
| **Options**   | Rounded, Sharp, Circle | —               |


> **⚠️ Lost Prop:** JDS Image has a `Shape` prop controlling corner treatment:
>
> - `Rounded` — standard rounded corners (default)
> - `Sharp` — no corner radius (square corners)
> - `Circle` — fully circular image (for avatar-like displays)
>
> **Migration Impact:** OneUI Image has no built-in shape control. Corner radius and clipping are handled at the frame/parent level in OneUI.
>
> - `Rounded` → carry the legacy instance's measured corner radius across as a `dimensions/shape/*` token — see [Corner radius: carry the measured value across](#corner-radius-carry-the-measured-value-across)
> - `Sharp` → no corner radius (may be the OneUI default behavior)
> - `Circle` → `dimensions/shape/pill`, or consider using `Avatar` component for circular images instead
>
> **JDS Variant Combinations:** JDS has all 21 combinations (7 ratios × 3 shapes). When migrating a `Circle` + specific ratio combo, note that circular images override the aspect ratio visually (always appears as a circle regardless of ratio).

#### Corner radius: carry the measured value across

**Do not re-pick the radius by eye and do not leave it at whatever the frame defaults to.** `Shape` is
a lost prop, so the value has to come from the legacy instance itself:

1. **Read the legacy Image's corner radius in px before you delete it** — all four corner fields
   (`topLeftRadius`, `topRightRadius`, `bottomLeftRadius`, `bottomRightRadius`), not just one.
2. **Divide that px value by 4.** The quotient is the token segment:

   ```
   dimensions/shape/{legacy corner radius ÷ 4}
   ```

3. **Bind that token** on the frame wrapping the OneUI Image.


| Legacy corner radius | ÷ 4 | OneUI Foundations token                       |
| -------------------: | --: | --------------------------------------------- |
| 4 px                 | 1   | `dimensions/shape/1`                          |
| 8 px                 | 2   | `dimensions/shape/2`                          |
| 12 px                | 3   | `dimensions/shape/3`                          |
| 16 px                | 4   | `dimensions/shape/4`                          |
| 24 px                | 6   | `dimensions/shape/6`                          |
| 40 px                | 10  | `dimensions/shape/10` — the scale ends here   |


Rules that come with it:

- **Half-steps use `-`, never `.`** — 10 px → 2.5 → `dimensions/shape/2-5`. `shape/2.5` is not a legal
  Figma variable name, so the binding silently fails and tempts a raw px value instead.
- **`cornerRadius` is not bindable.** Bind the four corner fields individually, even when the radius is
  uniform.
- **Above 40 px there is no token** — the shape scale caps at `10`. Use `dimensions/shape/pill`
  (fixed 9999) when the image reads fully rounded; that is also the `Circle` mapping.
- **The divisor is 4 only at mobile base 16** (`09 Platform = S – 360`, `11 Density = default`). At any
  other platform or density the divisor is `base / 4`.
- **Off-grid legacy values get snapped, not rounded away.** 14 px → 3.5 exists (`shape/3-5`); 13 px →
  3.25 does not. Bind the nearest token and record the delta rather than typing the raw px.

---

### Orientation (OneUI-Only — New)


|               | JDS             | OneUI               |
| ------------- | --------------- | ------------------- |
| **Prop Name** | *(Not exposed)* | `orientation`       |
| **Type**      | —               | VARIANT             |
| **Default**   | —               | "landscape"         |
| **Options**   | —               | landscape, portrait |


> **New OneUI Prop:** Controls whether the aspect ratio is applied in landscape (wider than tall) or portrait (taller than wide) orientation. This replaces JDS's approach of having separate portrait ratio values (9:16, 3:4).
>
> **How it works with aspectRatio:**
>
> - `aspectRatio: 16:9` + `orientation: landscape` = wide 16:9 image
> - `aspectRatio: 16:9` + `orientation: portrait` = tall 9:16 image (equivalent to JDS `9:16`)
> - `aspectRatio: 4:3` + `orientation: landscape` = wide 4:3 image
> - `aspectRatio: 4:3` + `orientation: portrait` = tall 3:4 image (equivalent to JDS `3:4`)
> - `aspectRatio: 3:2` + `orientation: portrait` = tall 2:3 image (new — no JDS equivalent)
> - `aspectRatio: 2:1` + `orientation: portrait` = tall 1:2 image (new — no JDS equivalent)
>
> **Not available for:** `auto` (freeform — landscape only) and `1:1` (symmetrical — landscape only)

---

### Interactive (OneUI-Only — New)


|               | JDS             | OneUI         |
| ------------- | --------------- | ------------- |
| **Prop Name** | *(Not exposed)* | `interactive` |
| **Type**      | —               | VARIANT       |
| **Default**   | —               | "false"       |
| **Options**   | —               | false, true   |


> **New OneUI Prop:** Toggles interactive states for the image — adds hover/press state layers. Useful for clickable images in galleries, cards, or media grids. JDS has no equivalent; all JDS images are non-interactive by default.
>
> **When to use:**
>
> - Image is clickable (opens lightbox, navigates, etc.) → `interactive: true`
> - Image is purely decorative or informational → `interactive: false` (default)

---

### Scrim (OneUI-Only — New)


|               | JDS             | OneUI       |
| ------------- | --------------- | ----------- |
| **Prop Name** | *(Not exposed)* | `scrim`     |
| **Type**      | —               | VARIANT     |
| **Default**   | —               | "false"     |
| **Options**   | —               | false, true |


> **New OneUI Prop:** Toggles a semi-transparent overlay (scrim) on top of the image. Used for:
>
> - Text readability on images (dark scrim behind white text)
> - Image dimming in cards/hero sections
> - Overlay UI elements
>
> The OneUI Image has a `Scrim` child component that renders when `scrim: true`. JDS has no equivalent — scrims must be manually added as overlay layers in JDS designs.

---

### Alt Text (OneUI-Only — New)


|               | JDS             | OneUI                                     |
| ------------- | --------------- | ----------------------------------------- |
| **Prop Name** | *(Not exposed)* | `altText`                                 |
| **Type**      | —               | TEXT                                      |
| **Default**   | —               | "Picture of Amber palace, Jaipur, India." |


> **New OneUI Prop:** A TEXT prop for accessibility — stores the image's alt text description. This is an accessibility-first feature:
>
> - Used by screen readers and assistive technologies
> - Documents image content for design handoff to developers
> - JDS has no alt text support built into the Image component
>
> **Design Tip:** When migrating, add meaningful `altText` values to all Image instances. This improves accessibility compliance and design-to-dev handoff quality.

---

## Full Props Comparison Table (Image)


| #   | Prop Concept  | JDS Prop       | JDS Type | JDS Values                                  | JDS Default | OneUI Prop    | OneUI Type | OneUI Values                             | OneUI Default   | Status                                                            |
| --- | ------------- | -------------- | -------- | ------------------------------------------- | ----------- | ------------- | ---------- | ---------------------------------------- | --------------- | ----------------------------------------------------------------- |
| 1   | Aspect ratio  | `Aspect Ratio` | VARIANT  | Auto, 1:1, 16:9, 9:16, 4:3, 3:4, 2.75:1 (7) | Auto        | `aspectRatio` | VARIANT    | auto, 1:1, 2:1, 3:2, 4:3, 16:9, 21:9 (7) | auto            | ⚠️ 6 of 7 map (mechanism change for portrait); 2.75:1 lost; 3 new |
| 2   | Shape         | `Shape`        | VARIANT  | Rounded, Sharp, Circle (3)                  | Rounded     | *(none)*      | —          | —                                        | —               | ❌ JDS-only (LOST — bind `dimensions/shape/{px ÷ 4}` on the frame) |
| 3   | Orientation   | *(none)*       | —        | —                                           | —           | `orientation` | VARIANT    | landscape, portrait                      | landscape       | ✅ OneUI-only (replaces JDS portrait ratios)                       |
| 4   | Interactive   | *(none)*       | —        | —                                           | —           | `interactive` | VARIANT    | false, true                              | false           | ❌ OneUI-only (new)                                                |
| 5   | Scrim overlay | *(none)*       | —        | —                                           | —           | `scrim`       | VARIANT    | false, true                              | false           | ❌ OneUI-only (new)                                                |
| 6   | Alt text      | *(none)*       | —        | —                                           | —           | `altText`     | TEXT       | any string                               | "Picture of..." | ❌ OneUI-only (new — accessibility)                                |


---

---

# 3. OneUI Slot Library (Image Slots)

OneUI provides pre-configured Image slot components for use inside other components:


| Slot Pattern         | Available Sizes               | Description                   |
| -------------------- | ----------------------------- | ----------------------------- |
| `Slot/size{N}/Image` | 3, 4, 5, 6, 8, 10, 12, 14, 16 | Image at given container size |


> **Design Tip:** Use these slot components when placing images inside other OneUI components (cards, list items, etc.). JDS has no equivalent slot system for images. The slot pre-configures the image dimensions to fit the parent component's slot size.

---

---

# 4. Design Tips for Migration

### Ratio Architecture Change

The biggest conceptual shift is how portrait ratios work:

This means OneUI has **fewer ratio values** but **more combinations** (each ratio × 2 orientations = 12 effective ratios from 7 values). It's a more systematic approach that avoids duplicating every ratio in both landscape and portrait. **No portrait ratios are lost — they're just expressed differently.**

### Shape Handling

Since OneUI drops the `Shape` prop:


| JDS Shape | OneUI Approach                                                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `Rounded` | Bind `dimensions/shape/{legacy corner radius ÷ 4}` on the Image frame — e.g. 16 px → `dimensions/shape/4`. See [Corner radius: carry the measured value across](#corner-radius-carry-the-measured-value-across) |
| `Sharp`   | No corner radius on the Image frame                                                                                                        |
| `Circle`  | Bind `dimensions/shape/pill` — or use `Avatar` component for profile pictures                                                              |


### New Capabilities in OneUI

When migrating, take advantage of OneUI's new features:

1. **`altText`** — add to every image for accessibility compliance
2. **`scrim`** — use instead of manually adding overlay layers for text-on-image readability
3. **`interactive`** — use for clickable images instead of wrapping in a pressable frame
4. **`orientation`** — cleaner portrait/landscape control with the same ratio values
5. **New ratios** — `2:1`, `3:2`, `21:9` (and their portrait equivalents `1:2`, `2:3`, `9:21`)

### Effective Ratio Count Comparison


|                            | JDS                              | OneUI                                    |
| -------------------------- | -------------------------------- | ---------------------------------------- |
| **Landscape ratios**       | Auto, 1:1, 16:9, 4:3, 2.75:1 (5) | auto, 1:1, 2:1, 3:2, 4:3, 16:9, 21:9 (7) |
| **Portrait ratios**        | 9:16, 3:4 (2)                    | 1:2, 2:3, 3:4, 9:16, 9:21 (5)            |
| **Total effective ratios** | 7                                | 12                                       |


> OneUI gives you **nearly double** the ratio options while using the same number of ratio values (7) — thanks to the orientation modifier.

---

---

# 5. Complete Component Summary


| Aspect              | JDS Image                                 | OneUI Image                                                   |
| ------------------- | ----------------------------------------- | ------------------------------------------------------------- |
| **Props**           | 2 (Aspect Ratio, Shape)                   | 5 (aspectRatio, orientation, interactive, scrim, altText)     |
| **Total Variants**  | 21                                        | 48                                                            |
| **Instances**       | 0                                         | 1                                                             |
| **Approach**        | Simple container styling                  | Full-featured with a11y + interaction                         |
| **Portrait ratios** | Separate values (9:16, 3:4) — ✅ supported | `orientation: portrait` modifier — ✅ supported (more options) |
| **Shape control**   | Built-in (Rounded, Sharp, Circle)         | Not built-in (frame-level corner radius)                      |
| **Accessibility**   | None                                      | `altText` TEXT prop                                           |
| **Overlays**        | Manual layers                             | Built-in `scrim` toggle                                       |
| **Interactivity**   | None                                      | `interactive` toggle                                          |


---

# 6. Complete Migration Checklist

## Image (0 instances — LOW PRIORITY)

- [ ] Map `Aspect Ratio`:
  - `Auto` → `auto` ✅
  - `1:1` → `1:1` ✅
  - `16:9` → `16:9` ✅ (landscape) or `16:9` + `orientation: portrait` for 9:16
  - `9:16` → `aspectRatio: 16:9` + `orientation: portrait` ✅
  - `4:3` → `4:3` ✅ (landscape) or `4:3` + `orientation: portrait` for 3:4
  - `3:4` → `aspectRatio: 4:3` + `orientation: portrait` ✅
  - `2.75:1` → `21:9` or `2:1` (nearest match — no exact equivalent)
- [ ] Handle `Shape` loss — **read the legacy corner radius in px first, then divide by 4 to get the token**:
  - `Rounded` → bind `dimensions/shape/{px ÷ 4}` on the wrapping frame (16 px → `dimensions/shape/4`), all four corner fields
  - `Sharp` → no corner radius
  - `Circle` → `dimensions/shape/pill`, or use Avatar component
  - Half-steps use `-` (10 px → `dimensions/shape/2-5`); above 40 px use `shape/10` or `shape/pill`
- [ ] Set `orientation` correctly — `landscape` (default) for standard ratios, `portrait` for portrait ratios
- [ ] Set `interactive: false` (default) unless image is clickable
- [ ] Set `scrim: false` (default) unless overlay text is present
- [ ] Add meaningful `altText` to all images for accessibility
- [ ] Audit all **0 JDS instances** — no instances to migrate currently

## Total Instances to Migrate

- [ ] **0 total** — Image component exists in JDS but has no instances in use

---

---

# Avatar  ·  JDS v3 → OneUI

---

# 1. Avatar → Avatar

## Overview


|                         | JDS (Jio Testlab Library)                             | OneUI                                                                      |
| ----------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------- |
| **Component Name**      | Avatar                                                | Avatar                                                                     |
| **Total Variants**      | 30 (5 sizes × 3 content × 2 disabled)                 | 48 (8 sizes × 3 attention × 2 content — note: `custom` size adds variants) |
| **Instances in Use**    | 214                                                   | 6                                                                          |
| **Page**                | Avatar                                                | ↳ Avatar                                                                   |
| **Child Instance Tags** | Focus Ring, CounterBadgeAvatarOverlap, Initials, Icon | .DNA/AvatarAsset, Icon                                                     |


---

## Architecture Difference


| Concept                  | JDS                                                                              | OneUI                                                                                                                                     |
| ------------------------ | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Content types**        | Image, Initials, Icon (via VARIANT)                                              | image, icon, text (via VARIANT)                                                                                                           |
| **Badge overlay**        | Built-in `CounterBadgeAvatarOverlap` child + `BadgeAvatarOverlap` BOOLEAN toggle | Not built into Avatar — badges are composed externally                                                                                    |
| **Focus ring**           | Built-in `Focus Ring` child + `Focus` BOOLEAN toggle                             | Not built into Avatar — focus states handled externally                                                                                   |
| **State layer**          | `state-layer` BOOLEAN toggle for hover/press states                              | Not exposed — states handled by parent components                                                                                         |
| **Disabled state**       | `Disabled` VARIANT (False/True)                                                  | Not exposed as a prop                                                                                                                     |
| **Attention / Emphasis** | Not present — Avatar has no emphasis control                                     | `attention` VARIANT (high/medium/low) — NEW                                                                                               |
| **Slot library**         | Not present                                                                      | OneUI has extensive Slot Library entries for Avatar (AvatarImage, AvatarIconHigh/Medium/Low, AvatarTextHigh/Medium/Low in multiple sizes) |


> **Key Insight for Design Migration:** JDS Avatar is a **self-contained component** with built-in badge, focus ring, state layer, and disabled state. OneUI Avatar is a **leaner component** focused on the avatar circle itself — overlay features like badges and focus rings are composed from other components. This means when migrating a JDS Avatar that uses a badge overlay, you'll need to **compose** the OneUI Avatar with a separate badge component rather than toggling a single prop.

---

## Props Mapping

### Content


|               | JDS       | OneUI     |
| ------------- | --------- | --------- |
| **Prop Name** | `Content` | `content` |
| **Type**      | VARIANT   | VARIANT   |
| **Default**   | "Image"   | "image"   |


#### Value Mapping


| JDS `Content` | OneUI `content` | Notes                                                  |
| ------------- | --------------- | ------------------------------------------------------ |
| Image         | image           | Direct mapping ✅ (both defaults)                       |
| Initials      | text            | Direct mapping — **renamed** from "Initials" to "text" |
| Icon          | icon            | Direct mapping                                         |


> **Migration Note:** The mapping is 1:1 but `Initials` is renamed to `text` in OneUI. When migrating, ensure the initials text content is preserved — in JDS it's via the nested `Initials` child (Label component), in OneUI it's handled internally by the `.DNA/AvatarAsset` child.

---

### Size


|               | JDS     | OneUI   |
| ------------- | ------- | ------- |
| **Prop Name** | `Size`  | `size`  |
| **Type**      | VARIANT | VARIANT |
| **Default**   | "M"     | "m"     |


#### Value Mapping


| JDS `Size`          | OneUI `size` | Notes                                       |
| ------------------- | ------------ | ------------------------------------------- |
| ❌ *(no equivalent)* | 2xs          | OneUI-only (new — smaller than JDS minimum) |
| XS                  | xs           | Direct mapping ✅                            |
| S                   | s            | Direct mapping ✅                            |
| M                   | m            | Direct mapping ✅ (both defaults)            |
| L                   | l            | Direct mapping ✅                            |
| XL                  | xl           | Direct mapping ✅                            |
| ❌ *(no equivalent)* | 2xl          | OneUI-only (new — larger than JDS maximum)  |
| ❌ *(no equivalent)* | custom       | OneUI-only (new — custom/freeform size)     |


> **Migration Note:** All 5 JDS sizes map directly to OneUI — **no sizes lost!** OneUI adds 3 extra sizes (`2xs`, `2xl`, `custom`) that JDS doesn't have. This is the best size mapping of any component in the migration.

---

### Disabled


|               | JDS        | OneUI           |
| ------------- | ---------- | --------------- |
| **Prop Name** | `Disabled` | *(Not exposed)* |
| **Type**      | VARIANT    | —               |
| **Default**   | "False"    | —               |


#### Value Mapping


| JDS `Disabled` | OneUI         | Notes                        |
| -------------- | ------------- | ---------------------------- |
| False          | Default state | No action needed             |
| True           | —             | No disabled variant in OneUI |


> **Migration Note:** JDS Avatar has a `Disabled` variant that reduces opacity/interactivity. OneUI Avatar does not have this. If your designs show disabled avatars (e.g., in disabled profile cards or inactive user lists), you'll need to handle this via manual opacity overrides (typically 0.4–0.5 opacity) on the OneUI Avatar instance.

#### Design Tip

When recreating the disabled appearance in OneUI:

- Apply 40-50% opacity override on the Avatar instance
- Or use the parent container's disabled state to visually dim the entire row/card

---

### Badge Overlay (BadgeAvatarOverlap)


|                     | JDS                                                      | OneUI            |
| ------------------- | -------------------------------------------------------- | ---------------- |
| **Prop Name**       | `BadgeAvatarOverlap`                                     | *(Not built in)* |
| **Type**            | BOOLEAN                                                  | —                |
| **Default**         | false                                                    | —                |
| **Child Component** | `CounterBadgeAvatarOverlap` (with position + size props) | —                |


> **Migration Note:** JDS Avatar has a **built-in badge overlay** — toggling `BadgeAvatarOverlap: true` shows a `CounterBadgeAvatarOverlap` child that can be positioned (horizontal: start/center/end, vertical: top/center/bottom) and sized (XS–XL). OneUI Avatar does **not** include this. To show a badge on an avatar in OneUI, you need to:
>
> 1. Place the OneUI `Avatar` inside a parent frame
> 2. Add a separate badge/counter component as a sibling
> 3. Position the badge manually (absolute position or auto-layout with negative margin)
>
> This is a **significant composition change** that affects any JDS Avatar instance using `BadgeAvatarOverlap: true`.

#### JDS CounterBadgeAvatarOverlap Sub-Component


| Prop                  | Type    | Values              | Default | Description                                  |
| --------------------- | ------- | ------------------- | ------- | -------------------------------------------- |
| `horizontal-position` | VARIANT | end, center, start  | end     | Badge horizontal position relative to avatar |
| `vertical-position`   | VARIANT | bottom, top, center | bottom  | Badge vertical position relative to avatar   |
| `size`                | VARIANT | XS, S, M, L, XL     | XS      | Badge size (matches avatar size scale)       |


> **Design Tip:** When composing badges in OneUI, use the badge's position relative to the avatar to match the JDS `horizontal-position` and `vertical-position` settings. Common pattern: absolute positioning with the badge at bottom-end (matching JDS defaults).

---

### Focus Ring


|               | JDS     | OneUI            |
| ------------- | ------- | ---------------- |
| **Prop Name** | `Focus` | *(Not built in)* |
| **Type**      | BOOLEAN | —                |
| **Default**   | false   | —                |


> **Migration Note:** JDS Avatar includes a `Focus Ring` child component toggled by the `Focus` boolean. This shows a ring around the avatar to indicate keyboard focus. OneUI Avatar does not include this — focus states are handled by whatever parent component wraps the avatar (list item, card, button, etc.). For spec/redline frames that show focus states, you'll need to add a focus ring manually or use the parent component's focus state.

---

### State Layer


|               | JDS           | OneUI            |
| ------------- | ------------- | ---------------- |
| **Prop Name** | `state-layer` | *(Not built in)* |
| **Type**      | BOOLEAN       | —                |
| **Default**   | false         | —                |


> **Migration Note:** JDS Avatar's `state-layer` toggle shows a semi-transparent overlay for hover/pressed states. OneUI handles this at the parent component level (e.g., a list item or button that contains the avatar shows its own state layer). For most design work, this doesn't need explicit migration — the parent component in OneUI will handle interaction states.

---

### New Props in OneUI (No JDS Equivalent)

#### Attention


|                 | OneUI                                                                                                                                                            |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Prop Name**   | `attention`                                                                                                                                                      |
| **Type**        | VARIANT                                                                                                                                                          |
| **Options**     | high, medium, low                                                                                                                                                |
| **Default**     | high                                                                                                                                                             |
| **Description** | Controls the visual prominence of the avatar. Affects background color intensity for icon and text content types. Image content type may be unaffected visually. |


> **Migration Note:** JDS Avatar has no attention/emphasis control. OneUI defaults to `high`. When migrating:
>
> - For **image avatars**: `attention` likely has minimal visual impact (the image fills the circle), so `high` (default) is fine
> - For **icon/text avatars**: `attention` controls the background color intensity. Choose based on the visual hierarchy needed:
>   - `high` = strong/saturated background (most prominent)
>   - `medium` = moderate background
>   - `low` = subtle/light background (least prominent)
>
> If your JDS designs use icon or text avatars, visually compare the OneUI attention levels to pick the best match for each usage context.

---

### OneUI Slot Library (Avatar Slots)

OneUI provides an extensive set of **pre-configured Avatar slot components** in the Slot Library. These are ready-made Avatar instances at specific sizes, content types, and attention levels, designed for use inside other components via instance swap slots.


| Slot Pattern                    | Sizes Available      | Description                                |
| ------------------------------- | -------------------- | ------------------------------------------ |
| `Slot/size{N}/AvatarImage`      | 2, 3, 4, 5, 6, 8, 10 | Image avatar at given size                 |
| `Slot/size{N}/AvatarIconHigh`   | 2, 3, 4, 5, 6, 8, 10 | Icon avatar with high attention            |
| `Slot/size{N}/AvatarIconMedium` | 2, 3, 4, 5, 6, 8, 10 | Icon avatar with medium attention          |
| `Slot/size{N}/AvatarIconLow`    | 2, 3, 4, 5, 6, 8, 10 | Icon avatar with low attention             |
| `Slot/size{N}/AvatarTextHigh`   | 2, 3, 4, 5, 6, 8, 10 | Text/initials avatar with high attention   |
| `Slot/size{N}/AvatarTextMedium` | 2, 3, 4, 5, 6, 8, 10 | Text/initials avatar with medium attention |
| `Slot/size{N}/AvatarTextLow`    | 2, 3, 4, 5, 6, 8, 10 | Text/initials avatar with low attention    |


> **Design Tip:** When placing avatars inside other OneUI components (list items, cards, chat bubbles, etc.), use these slot components rather than manually configuring an Avatar instance. They are pre-sized and pre-styled for each slot context. JDS has no equivalent slot system — avatars are always placed as direct instances.

---

## Full Props Comparison Table


| #   | Prop Concept  | JDS Prop             | JDS Type | JDS Values            | JDS Default | OneUI Prop  | OneUI Type | OneUI Values      | OneUI Default | Status                          |
| --- | ------------- | -------------------- | -------- | --------------------- | ----------- | ----------- | ---------- | ----------------- | ------------- | ------------------------------- |
| 1   | Content type  | `Content`            | VARIANT  | Image, Initials, Icon | Image       | `content`   | VARIANT    | image, icon, text | image         | ✅ 1:1 (Initials → text rename)  |
| 2   | Size          | `Size`               | VARIANT  | XS–XL (5)             | M           | `size`      | VARIANT    | 2xs–custom (8)    | m             | ✅ All 5 map + 3 new             |
| 3   | Disabled      | `Disabled`           | VARIANT  | False, True           | False       | *(none)*    | —          | —                 | —             | ❌ JDS-only                      |
| 4   | Badge overlay | `BadgeAvatarOverlap` | BOOLEAN  | true/false            | false       | *(none)*    | —          | —                 | —             | ❌ JDS-only (compose externally) |
| 5   | Focus ring    | `Focus`              | BOOLEAN  | true/false            | false       | *(none)*    | —          | —                 | —             | ❌ JDS-only (parent handles)     |
| 6   | State layer   | `state-layer`        | BOOLEAN  | true/false            | false       | *(none)*    | —          | —                 | —             | ❌ JDS-only (parent handles)     |
| 7   | Attention     | *(N/A)*              | —        | —                     | —           | `attention` | VARIANT    | high, medium, low | high          | ❌ OneUI-only (new)              |


---

## Migration Checklist

### Core Props

- [ ] Map `Content` → `content` (Image→image, Initials→text, Icon→icon) — note `Initials` is renamed to `text`
- [ ] Map `Size` (XS→xs, S→s, M→m, L→l, XL→xl) — **all sizes map directly, no losses!**
- [ ] Set `attention` based on visual context — `high` (default) works for image avatars; compare visually for icon/text avatars

### Lost Features (Handle Manually)

- [ ] **Audit all instances with `BadgeAvatarOverlap: true`** — these need manual composition (Avatar + separate Badge component in a parent frame)
- [ ] Handle `Disabled = True` instances via opacity overrides (40-50%)
- [ ] `Focus` ring and `state-layer` — generally handled by parent components in OneUI; flag any standalone usages in spec frames

### Content Migration

- [ ] Preserve image fills when migrating image avatars
- [ ] Preserve initials text when migrating to `content: text`
- [ ] Carry the icon glyph across for icon avatars — same asset library, so the reference is preserved as-is

### Instance Count

- [ ] Audit all **214 JDS Avatar instances** — high usage count, plan for batch migration

---

---

# Logo  ·  JDS v3 → OneUI

---

# 1. Component Overview


|                        | JDS (Jio Testlab Library) | OneUI                                                    |
| ---------------------- | ------------------------- | -------------------------------------------------------- |
| **Component Name**     | ❌ Does not exist          | Logo                                                     |
| **Component Type**     | —                         | COMPONENT_SET                                            |
| **Total Variants**     | —                         | 16 (8 sizes × 2 interactive)                             |
| **Instances in Use**   | —                         | 0                                                        |
| **Page**               | —                         | ↳ Logo                                                   |
| **Internal Structure** | —                         | circle (RECTANGLE) + text (VECTOR) — the Jio logo symbol |


> **OneUI-Only Component:** `Logo` has **no JDS equivalent**. JDS designs that display the Jio brand logo use custom/manual implementations (images, vectors, imported SVGs). OneUI standardizes this with a library-managed Logo component.

---

---

# 2. Logo (OneUI-Only — New)

## Purpose

The Jio brand logo component — the official Jio wordmark/symbol used for brand identity across Jio products. Provides standardized sizing and optional interactive states for clickable logos.

---

## Props

### size


|               | OneUI                                 |
| ------------- | ------------------------------------- |
| **Prop Name** | `size`                                |
| **Type**      | VARIANT                               |
| **Default**   | "M"                                   |
| **Options**   | 2XS, XS, S, M, L, XL, 2XL, custom (8) |


> **8 size options** including a `custom` size for arbitrary dimensions:
>
> - `2XS` / `XS` — small inline contexts (navigation, breadcrumbs, compact headers)
> - `S` / `M` — standard UI placement (headers, cards, footers)
> - `L` / `XL` / `2XL` — hero sections, splash screens, marketing pages
> - `custom` — any non-standard size (manually adjust dimensions)

---

### interactive


|               | OneUI         |
| ------------- | ------------- |
| **Prop Name** | `interactive` |
| **Type**      | VARIANT       |
| **Default**   | "false"       |
| **Options**   | false, true   |


> **Interactive state toggle:**
>
> - `false` (default) — static logo display, no hover/press states
> - `true` — adds hover/press state layers, making the logo clickable (e.g., "click logo to go home" pattern)
>
> **When to use `interactive: true`:**
>
> - Logo in navigation bar that links to homepage
> - Logo in footer that links to homepage
> - Any clickable logo instance

---

## All Variant Combinations


| size        | interactive=false | interactive=true |
| ----------- | ----------------- | ---------------- |
| 2XS         | ✅                 | ✅                |
| XS          | ✅                 | ✅                |
| S           | ✅                 | ✅                |
| M (default) | ✅ (default)       | ✅                |
| L           | ✅                 | ✅                |
| XL          | ✅                 | ✅                |
| 2XL         | ✅                 | ✅                |
| custom      | ✅                 | ✅                |


---

## Full Props Table (Logo)


| #   | Prop          | Type    | Values                                | Default | Notes                                       |
| --- | ------------- | ------- | ------------------------------------- | ------- | ------------------------------------------- |
| 1   | `size`        | VARIANT | 2XS, XS, S, M, L, XL, 2XL, custom (8) | M       | Standard size scale + custom                |
| 2   | `interactive` | VARIANT | false, true                           | false   | Adds hover/press states for clickable logos |


---

---

# 3. OneUI Slot Library (Logo Slots)


| Slot Pattern      | Available Sizes |
| ----------------- | --------------- |
| `Slot/size3/Logo` | size 3          |
| `Slot/size4/Logo` | size 4          |
| `Slot/size5/Logo` | size 5          |
| `Slot/size6/Logo` | size 6          |
| `Slot/size8/Logo` | size 8          |


> **Design Tip:** Use these slot components when placing the Jio logo inside other OneUI components (navigation bars, headers, cards, etc.). The slot pre-configures the logo dimensions to fit the parent component's slot size.

---

---

# 4. Migration Notes

### For JDS → OneUI Migration

Since JDS has **no Logo** component:

- **If your JDS designs display the Jio brand logo manually** (images, vectors, SVGs) → replace with `Logo` component, set appropriate `size`, and `interactive: true` if clickable
- **If your JDS designs don't display the Jio brand logo** → no migration needed; this component is available for new designs
- **Use `Slot/size{N}/Logo`** when placing the Jio logo inside other components' slots (nav bars, headers)

---

---

# 5. Complete Migration Checklist

## Logo (NEW — OneUI-only)

- [ ] No JDS instances to migrate — component doesn't exist in JDS
- [ ] Identify any JDS designs using manual Jio brand logo implementations
- [ ] Replace manual logos with `Logo` component instances
- [ ] Set `size` based on usage context (2XS–2XL or custom)
- [ ] Set `interactive: true` for clickable logos (nav bars, footers)
- [ ] Use `Slot/size{N}/Logo` when placing inside other components' slots

## Total Instances to Migrate

- [ ] **0** — no JDS equivalent exists; this is a net-new OneUI component

---

---

## Text / Label (standalone)

**There is no Text component in OneUI Components.** Use a **native Figma TEXT node** — the one case
where a non-component primitive is the correct answer rather than a fallback.

This section is for **standalone** text. A `Label` nested inside a OneUI Button, Chip, Badge or Tab
is different: those manage typography internally, and the Label's props are dropped (see each
component's migration note).

### Rule

1. **Load `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-size-and-typography.md")` first.** It owns the token vocabulary —
  all 84 composites, the font-size token per (category, size, breakpoint), the line-height offsets
   and the brand weight tables. Pick the style from that skill, never from memory and never from the
   summary tables below, which are a cross-check only.
2. Create a plain TEXT node, keeping the **font family from the reference frame**.
3. **Never type a font size, weight or line height.** Resolve the OneUI **TextStyle** and apply it
  with `setTextStyleIdAsync`. There are 84, named `{category}/{size}/{semantic}`.
4. The legacy `Label` instance already carries everything needed to pick that style:


| Read off the JDS Label                 | Gives you       | OneUI                                    |
| -------------------------------------- | --------------- | ---------------------------------------- |
| `Variant` (e.g. "Heading M", "Body S") | category + size | `{category}/{size}`                      |
| `Emphasis` — Low / Medium / High       | attention       | `{semantic}` — `low` / `medium` / `high` |


`Heading M` + `Emphasis High` → **`headline/M/high`**.


| Category   | Sizes                     |
| ---------- | ------------------------- |
| `display`  | XL, L, M, S               |
| `headline` | L, M, S                   |
| `title`    | L, M, S                   |
| `label`    | XL, L, M, S, XS, 2XS, 3XS |
| `body`     | XL, L, M, S, XS, 2XS      |
| `code`     | M, S, XS, 2XS, 3XS        |


All six categories carry all three semantics. The model is **sparse** — a `(category, semantic)`
that is not defined is not defined. Never fall back to `medium`.

### Resolved px — Platform `S – 360`, default density

`px = base × multiplier`. At the standard mobile anchor the base is exactly **16**, so every style
lands on a clean integer — use this to cross-check a mapping:


| px  | Style                                                  |
| --- | ------------------------------------------------------ |
| 48  | `display/XL`                                           |
| 40  | `display/L`                                            |
| 36  | `display/M`                                            |
| 32  | `display/S`                                            |
| 24  | `headline/L`                                           |
| 20  | `headline/M`, `title/L`, `label/XL`, `body/XL`         |
| 18  | `label/L`, `body/L`                                    |
| 16  | `headline/S`, `title/M`, `label/M`, `body/M`, `code/M` |
| 14  | `label/S`, `body/S`, `code/S`                          |
| 12  | `title/S`, `label/XS`, `body/XS`, `code/XS`            |
| 10  | `label/2XS`, `body/2XS`, `code/2XS`                    |
| 8   | `label/3XS`, `code/3XS`                                |


The whole scale is **8, 10, 12, 14, 16, 18, 20, 24, 32, 36, 40, 48** — nothing between 24 and 32.

⚠️ **Valid only at 360 / default.** The base is fluid (16→20 default, 14→18 compact, 18→22 open) and
the other Platform modes give non-integer bases — 17.05 @768, 17.70 @1024, 18.77 @1440 — so
`headline/M` is 25.8px at 1440 and `headline/L` is 31.0px at 1024. Only `display/*` and `headline/*`
change token by breakpoint; everything else is breakpoint-uniform.

**So map from `Variant` + `Emphasis`, which is breakpoint-independent, and use px to confirm.**

### No exact match → nearest token. Never a fixed value.

A legacy size that is not on the scale — 26px, say — is legacy drift, not a missing token. **Snap to
the nearest OneUI token and state which you chose.** Keeping the raw px is never the fallback: every
text node must end on a OneUI Foundations typography token, the same contract colour and spacing are
held to. If a size sits exactly between two steps, prefer the one its `Variant` implies.

### Why the style and not four hand-set values

Each TextStyle binds `fontFamily`, `fontSize`, `fontWeight` and `lineHeight` to Brand variables, so
one style covers every Brand × Language × Platform × Density combination. Typing values opts the
text out of all four. Line height especially: it is a signed **index offset** into the 32-token
dimension list, not a ratio or a px value — it cannot be reproduced by typing a number.

### Migration checklist — Text / Label

- [ ] `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-size-and-typography.md")` loaded before any style was chosen
- [ ] Off-scale legacy sizes snapped to the nearest token — no raw px left anywhere
- [ ] Standalone text is a native TEXT node — not a detached component, not a Label instance
- [ ] `Variant` → category/size and `Emphasis` → semantic recorded per node **before** swapping
- [ ] TextStyle applied via `setTextStyleIdAsync`; no typed font size, weight or line height
- [ ] Font family matches the reference frame
- [ ] Text colour bound to a `colour/content/*` token — `tintedA11y` for brand-coloured text,
      never `tinted` (that one is `SHAPE_FILL` only)

