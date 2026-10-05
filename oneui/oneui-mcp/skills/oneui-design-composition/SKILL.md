---
name: oneui-design-composition
visibility: public
description: >
  OneUI/Jio design composition philosophy and UI authoring guide — the holistic
  layer that decides how a whole page or screen hangs together. Teaches layout and
  grid, navigation and app structure, component selection, typography, color roles,
  spacing, shape, elevation, motion, and the content-first / attention-as-budget
  philosophy of the OneUI design system. Use this skill when composing pages, building
  layouts, structuring screens, designing navigation (tabs, bottom nav, headers, app
  shell), selecting which component fits a need, applying color roles, picking
  typography styles, deciding spacing or grid, or creating any UI that should follow
  OneUI/Jio conventions. Trigger when the user says "design", "layout", "compose",
  "page structure", "visual hierarchy", "navigation", "nav", "tab bar", "bottom nav",
  "header", "app structure", "which component", "typography", "color role", "spacing",
  "whitespace", "card design", "hero section", "product grid", or asks about
  Apple-like simplicity, content-first design, or Jio brand conventions.
  Even a plain "build a page" / "create a screen" / "add a section" should pull this
  skill in for composition decisions. For the specific decision of WHICH surface
  level to use and WHEN (default vs minimal/subtle/moderate/bold/elevated/brand-bg,
  restraint, tinting rules), defer to the dedicated `surface` skill — this skill
  references it rather than duplicating it. Do NOT use this skill for engine
  internals (the [data-surface] remapping mechanism, CSS generation pipeline, Convex
  schema, brand CSS injection) — use `surface-context` or `oneui-multi-brand` for those.
metadata:
  author: OneUI Studio
  version: 1.3.0
  category: design-composition
---

# OneUI Design Composition Guide

This skill teaches how to compose UI within the OneUI design system. It covers the design philosophy, composition rules, and practical guidance for building pages, screens, and sections that feel simple, content-first, and brand-appropriate.

## When to Load References

- Laying out a specific page type (product listing, settings, dashboard) -> read `references/composition-patterns.md`
- Structuring navigation, app shell, headers, tabs, or bottom nav -> read `references/navigation-patterns.md`
- Need exact token names or values -> read `references/token-quick-reference.md`
- Deciding attention levels for a complex layout -> read `references/attention-level-mapping.md`
- Routing multi-agent UI tools (Design Director, Layout Architect, Critic, …) -> read `references/agent-skill-map.md`
- **Deciding WHICH surface level to use and WHEN (default vs bold vs subtle..., restraint, tinting rules) -> use the `surface` skill** (it owns surface-choice judgment; this guide only covers how surfaces fit into overall composition)
- Working with surface token mechanics or `[data-surface]` CSS (the remapping engine) -> use the `surface-context` skill instead
- Working with brand CSS injection, recipes, or multi-brand architecture -> use the `oneui-multi-brand` skill instead

---

## 1. Design Philosophy

The OneUI design language is built on a simple principle: **the interface should be invisible so the content can shine.** This draws from three design traditions:

- **Apple**: Cinematic minimalism. Product reverence. The UI retreats until it becomes invisible.
- **Airbnb**: Photography-first. White canvas with warm, singular accent moments.
- **Uber**: Confident restraint. Pill shapes everywhere. Zero gradients. Transit-map efficiency.

**Core beliefs:**

1. **Content is hero.** Every pixel exists to serve the content, not to decorate. Default (white) backgrounds dominate because they let imagery, text, and data breathe.
2. **Simplicity is the key rule.** If a design feels complex, remove elements until it doesn't. The best interface is the one users never notice.
3. **Brand expression through restraint.** Jio's brand color appears in specific, purposeful moments -- not everywhere. A single bold button on a white page has more impact than a page saturated with color.
4. **Attention is a budget.** Every screen has limited user attention. Spend it on what matters most. Most elements should blend (attention = None/Low). Reserve emphasis for the moments that genuinely matter.
5. **Tokens, never literals.** All visual values come from design tokens (`var(--Token-Name)`). Zero hard-coded colors, pixels, or font names. This ensures brand portability and responsive adaptation.

---

## 2. Composition Principles

### The White Canvas Rule

80-90% of any screen should be `default` surface (white in light mode, near-black in dark mode). This is not absence of design -- it IS the design. Content shines against a neutral backdrop.

### The Attention Pyramid

Distribute visual emphasis like a pyramid. Most elements should be quiet; very few should be loud.

```
         /\
        /  \   High (5%) -- Primary CTA, hero branded moment
       /    \
      /Medium\  (10%) -- Secondary CTAs, active states, emphasis cards
     /________\
    /   Low    \ (25%) -- Cards with subtle fills, secondary actions
   /____________\
  /    None      \ (60%) -- Body text, lists, tables, navigation, headers
 /________________\
```

When this pyramid inverts (everything is bold/colored), the page screams and nothing stands out.

### Composition Rules

1. **One focal point per viewport section.** One primary CTA, one hero element. Never let two bold elements compete.
2. **Headers always use default background.** The header's job is navigation, not brand expression. Keep it clean.
3. **Product/content cards use default background.** Card content (imagery, text, prices) is the hero. Card backgrounds never compete with what's inside them.
4. **Bold surface is an event, not a default.** Use `<Surface mode="bold">` for hero sections, celebration moments, or key brand statements. If everything is bold, nothing is.
5. **Progressive brand disclosure.** Users encounter brand color as they go deeper: default -> subtle -> bold. The homepage is mostly white with strategic accent moments. A detail page might have a bold hero.
6. **Generous whitespace.** The Apple/Airbnb aesthetic comes from breathing room, not tight packing. When in doubt, add more space between sections.
7. **A page has ONE left grid line, and the hero establishes it.** Every band's copy hangs
   off the same left edge — that shared edge is what makes a scrolling page read as one
   document instead of a stack of unrelated posters. So the hero's copy is **left-aligned
   with all the other content**, never centered: the eye lands on the hero first and takes
   its left edge as the page's, so a centered hero makes every section below it look
   misaligned. Centering is an **artifact** idiom — a poster, slide, or billboard is one
   bounded surface taken in at a glance, with no column of following sections to align to.

   **Nothing may quietly leave that grid line.** Two things do it silently, and both have
   shipped as bugs: a `padding` value on a layout container inside the page column applies
   on all **four** sides and pushes the copy inward; and a `max-width` on a container hits
   `margin-inline: auto` and **centers the whole block**. If a region looks like it is
   "floating in the middle of its band", it is one of these two — not an alignment setting.

7b. **A measure shortens a LINE. It never narrows a BOX or moves a BLOCK.** A column of
   running prose stops at ~65% so the eye doesn't lose the line on the return sweep — but
   the cap only ever takes width off the **right**; the left edge stays on the grid line.
   And it applies *only* to running prose. A list of rows, an accordion, a table, a painted
   callout, a grid — these are **regions**, not lines. Capping a region doesn't shorten
   anything; it just strands a narrow box in the middle of an empty band. Regions are
   **full width, flush to the margin, following the grid**. (July-17: an icon checklist and
   an FAQ accordion were both squeezed to a centered 65% — "please make it full width,
   following the grid and margin".)
8. **A repeating set is a set of PEERS — lay it out as one uniform grid.** How many columns
   is a function of how many items there are, not a choice: fewest rows, then the fullest
   last row. Six capabilities are 3+3. Never promote one item of a uniform set to a
   full-row "feature" tile: a span makes a **tile** bigger, so it needs a tile — a picture
   that gets larger, or a box that gets wider. An unboxed icon+title+one-liner promoted to
   a full row has nothing to fill it, so it reads as one bullet stranded on a line above
   its own identical siblings — a broken grid, not a hierarchy. A lead tile is earned by
   content that uses the width (a chart, a photo), never by being first.
9. **Over media, everything composites — including the buttons.** On a photo or video
   background, a high-attention button is the one element that stays an opaque slab while
   the copy and containers around it turn to scrim and glass. Step the CTA ladder down over
   media (primary → the material's translucent tint, secondary → ghost): hierarchy survives
   as tint-vs-nothing, and the button belongs to the image instead of sitting on top of it.
10. **Padding is a function of tint.** A container that PAINTS something — a tinted/coloured
   surface (`minimal`/`subtle`/`moderate`/`bold`/`elevated`, or any appearance role) or a
   background image — **must** inset its content with padding. Content touching a tinted edge
   is broken, and this is **mandatory**: a tinted box always has interior padding. The
   inverse is just as important: a container with **no** tint (`default`/`ghost`) is a
   transparent content *group*, not a box — it gets **no** padding, and its content follows
   the section's grid margin. This is what keeps padding *consistent* — one shared interior
   inset for every painted box, and zero extra inset for everything else (so an untinted
   "Order Summary" lines up on the grid instead of double-indenting). Never pad an unboxed
   group "to separate it" — that is whitespace's job (gap between siblings), not padding.
11. **A tinted box is a rounded box.** Any container that paints a tint/colour surface takes
   the small-card corner radius (`--Shape-4`, 16px) — a square tinted box reads as unfinished.
   (Full-bleed section BANDS are the deliberate exception: an edge-to-edge band stays square.)
12. **A structural divider is full-bleed.** A `Divider` used to separate content GROUPS at the
   section level runs edge-to-edge — screen edge to screen edge, cancelling the grid margin —
   so it reads as a real rule, not a short inset line. (A divider INSIDE a card/box stays within
   that box's padding.) Use dividers between groups to add structure; keep them full-width.

### Choosing a Surface Level → defer to the `surface` skill

Picking *which* surface level a region gets (default vs minimal/subtle/moderate/bold/
elevated/brand-bg), and *when* a non-default surface is even justified, is its own
discipline — the **`surface` skill owns that judgment** (default-first, restraint,
tinting rules, attention budget) and is grounded in the real engine math. From a
composition standpoint you only need the one-line version:

> Start every region on `default`. Escalate to a non-default surface only for a real
> moment — a hero/promo (`bold`/`brand-bg`), a floating element (`elevated`), or
> genuine local separation type/spacing can't solve (`minimal`/`subtle`/`moderate`).
> One loud surface per viewport, max. For anything beyond this, use the `surface` skill.

To fill a Surface with a specific role colour (e.g. a secondary-tinted card instead of the primary-tinted default subtle), override `--Surface-Fill-{Mode}` inline:

```tsx
<Surface
  mode="subtle"
  style={{ '--Surface-Fill-Subtle': 'var(--Secondary-Subtle)' }}
>
  <Slider appearance="secondary" />
</Surface>
```

---

## 3. Surface Usage Guide

> **The `surface` skill is the authority on surface-level choice.** The table below is a
> quick composition-context reference; for any real decision about whether a region
> earns a non-default surface and which level it should be, use that skill. What stays
> firmly in *this* guide is the **mandatory `<Surface>` wrapper rule** below — it's a
> composition safety rule that prevents broken child adaptation.

### 7 Surface Tokens — Quick Reference

One vocabulary, no BG/FG split. Every surface is resolved relative to its parent step.

| Mode | Resolution | Use Case | Example | Frequency |
|------|------------|----------|---------|-----------|
| `default` | Page surface (2500 light / 200 dark) | Page bg, cards, headers, product grids | Main layout, product cards | 70-80% |
| `ghost` | Same step as parent | Same fill as parent but still triggers context remapping | Trigger inversion without visual change | Rare |
| `minimal` | Parent + 1 step toward contrast | Minimal differentiation | Alternating rows, sidebar bg | 5-10% |
| `subtle` | Parent + 2 steps | Section grouping, card backgrounds | Settings section, feature group | 5-10% |
| `moderate` | Parent + 3 steps | Stronger tint without going bold | Promotional card, callout | 2-5% |
| `bold` | Role baseStep (or darkerBaseStep on dark parents) | Brand accent surface, hero, celebration | Hero banner, CTA area, primary button fill | Rare (1-5%) |
| `elevated` | Parent + 1 step toward lighter (capped 2500) | Floating elements | Popover, dropdown, dialog, sheet | Context-dependent |

The same `bold` token is used whether the surface is a hero section or a primary button's fill — context-awareness happens automatically because every surface resolves against its parent step.

### Mandatory Surface Rule

When placing components on ANY non-default background, wrap with `<Surface mode="...">`. Never set background-color manually on a container that holds interactive children — tokens inside a raw `<div>` do not remap.

```tsx
// CORRECT -- Surface triggers [data-surface] token remapping for all children.
<Surface mode="bold">
  <Button variant="bold">Fill stays distinguishable</Button>
  <Button variant="subtle">Tinted fill, readable text</Button>
  <Button variant="ghost">Readable text, no fill</Button>
</Surface>

// WRONG -- children don't adapt, dark text on dark background
<div style={{ background: 'var(--Primary-Bold)' }}>
  <Button variant="ghost">BROKEN: invisible text</Button>
</div>
```

### How `bold` Stays Distinguishable Inside a Bold Surface

On a `<Surface mode="bold">`, an inner `variant="bold"` button would normally be invisible (same fill as surface). Because every surface is resolved relative to its parent step, `--{Role}-Bold` on the inner button resolves at the outer bold container's step, so the inner fill stays distinguishable. `--{Role}-Bold-High` flips to the contrasting extreme of the inner step. No per-component inversion logic, no separate "on-bold" token family at the API boundary.

| Figma attention | Variant | Fill | Text |
|-----------------|---------|------|------|
| High | `bold` | `--{Role}-Bold` | `--{Role}-Bold-High` |
| Medium | `subtle` | `--{Role}-Subtle` | `--{Role}-TintedA11y` |
| Low | `ghost` | transparent | `--{Role}-TintedA11y` |

---

## 4. Color Role Semantics

### The 4 Brand Color Roles (Jio)

Each Jio sub-brand assigns 4 color roles. These roles determine which appearance to use on components.

**Primary (Action Color)**
- Purpose: Orients the customer, directs towards action, signals the brand
- Used on: Logo, primary buttons, navigation indicators, pagination, tab bar active state, progress bars, links
- Default appearance for: `Button`, `FAB`, `IconButton`, `Link`, progress components
- Rule: One primary action per viewport section. Primary color = "this is the thing to do"

**Secondary (Accent Color)**
- Purpose: Communicates priority, accents selective moments, reinforces non-primary CTAs
- Used on: Checkbox/radio/toggle selected states, chips, accordion active, list item indicators, segmented control
- Default appearance for: `Chip`, `Checkbox`, `Radio`, `Switch`
- Rule: Complements primary. Never equal visual weight. Secondary says "here's something worth noting"

**Sparkle (Celebration Color)**
- Purpose: Signals success, promotion, happy outcomes. Spreads joy.
- Used on: Achievement badges, confetti, promotional banners, "gift unlocked" cards, status icons for positive outcomes
- Rule: **Keep rare.** Sparkle loses all meaning if overused. Maximum 1-2 sparkle elements per viewport. Sparkle says "something special happened"

**Brand Surface**
- Purpose: Brand background identity color for branded sections
- Used on: Full-section brand washes, brand identity backgrounds
- Rule: Used for container backgrounds, not individual component fills

### Semantic Roles (Status Communication)

| Role | Purpose | Component Example |
|------|---------|-------------------|
| `positive` | Success, confirmation | Green badge, success toast |
| `negative` | Error, destructive action | Red badge, delete button |
| `warning` | Caution, attention needed | Amber badge, warning banner |
| `informative` | Neutral information | Blue badge, info tooltip |
| `neutral` | De-emphasized, chrome | Gray icon buttons, dividers, tertiary actions |

Never use semantic roles for brand expression. They communicate system status, not brand identity.

---

## 5. Typography Guide

### 6 Roles, 27 Sizes

All typography sizes alias to dimension f-steps: `--Display-L-FontSize: var(--Dimension-f7)`. When platform or density changes, typography cascades automatically.

| Context | Role | Size | Weight | Token Example |
|---------|------|------|--------|---------------|
| Hero/splash headline | Display | L/M | 900 | `--Display-L-FontSize` (f7 = 40px) |
| Page title | Headline | L/M | 900 | `--Headline-L-FontSize` (f4 = 28px) |
| Section heading | Headline S / Title L | S or L | 850/800 | `--Headline-S-FontSize` (f0 = 16px) |
| Card title | Title | M/S | 800/750 | `--Title-M-FontSize` (f0 = 16px) |
| Body paragraph | Body | M | 400 (low) | `--Body-M-FontSize` (f0 = 16px) |
| Emphasized body | Body | M | 700 (high) | `--Body-FontWeight-High` |
| Helper/caption text | Body | S/XS | 400 | `--Body-S-FontSize` (f-1 = 14px) |
| Button label | Label | M/S | 700 (high) | `--Label-M-FontSize` (f0 = 16px) |
| Input label | Label | S/XS | 500 (medium) | `--Label-S-FontSize` (f-1 = 14px) |
| Tab/nav label | Label | M/S | 500 (medium) | `--Label-M-FontSize` |
| Badge text | Label | XS/2XS | 500 | `--Label-XS-FontSize` (f-2 = 12px) |
| Code snippet | Code | M/S | 500 | `--Code-M-FontSize` (f0 = 16px) |

### Key Typography Rules

- **Jio brand**: Always use JioType Var as primary font (`--Typography-Font-Primary`)
- **Display text**: Use negative letter-spacing (`--Typography-LetterSpacing-Tight: -0.02em`) for cinematic headlines
- **Line height offsets**: Display/Headline = tight (offset 0), Title = +1, Body = +3 (relaxed reading), Label = 0 (compact UI), Code = +2
- **Weight hierarchy** (Body/Label/Code): High (700) for emphasis, Medium (500) for default, Low (400) for de-emphasis
- **Fixed weights** (Display/Headline/Title): Per-size assignments (900, 850, 800, 750) -- not emphasis-based
- **Optical sizing**: Enabled on Headline-S and Title-S for better rendering at smaller sizes
- **Use the full scale — especially on mobile.** A small screen is not a reason for small type. The screen title is a `Headline` (not `Title`/`Body`); the one number that matters on the screen — an order total, a price, a balance — earns `Display`/`Headline` scale so it anchors the view. Keeping everything at `Body`/`Label` produces the flat, undersized "everything is 14px" look. Hierarchy is a *range*: pair a large anchor with genuinely small supporting `Label` text, and let the gap between them do the work. (The scale cascades per platform automatically — you choose the ROLE, the tokens choose the px.)

### Roles are semantic — `Title` is a SUBSECTION heading, not a default

The single most common typography slop is using `Title` for everything with weight — every
list-item name, every price, every row. `Title` (and `Headline`) is a **subsection heading**:
it groups content beneath it. A row in a list is **not** a subsection, so it is **not** a
Title. Pick the role by what the text *is*, then let **weight** and **attention** carry the
hierarchy *within* the element — never by promoting a line to a bigger role.

**List-item / row typography (the checkout-line pattern):**

| The text | Role | Weight | Attention | Why |
|----------|------|--------|-----------|-----|
| Primary line (a name, a label) | `Label` | Medium (default) | default | one line, so a Label — not a Title |
| A prominent value (a price, a line total) | `Label` | **High** | **High** | the one thing in the row that should pop |
| A quiet second row / subtitle / description | **`Body`** | Low | Medium | descriptive rows wrap — `Body` has the relaxed reading line-height; a `Label` here crushes multi-line text |
| A block of running copy | `Body` | Low | Medium | long text is always low weight, medium attention |

**`Label` is for a genuinely SHORT, single-line label only.** The moment text can wrap to two
lines — a subtitle, an address, a one-liner under a title — it must be `Body`, not `Label`:
`Label` carries the compact UI line-height and a multi-line label reads cramped (July-20 —
"if you have two rows / a long text, always use body, otherwise the line height is too short").

So a checkout line is **name (Label medium) ↔ price (Label high/high)**, with **qty (Label
low/medium)** tucked under the name — a clear three-step hierarchy with **zero** Titles. Reserve
`Title` for an actual subsection header ("Delivery details", "Payment method").

This is a **compiler guarantee on pages**, not just guidance: any `Title`/`Headline` trapped
inside a single-row list item (a run of nowrap rows) is demoted to `Label` automatically — so
the rule holds across every flow and every blueprint, not only the one you're looking at. (The
demotion never assigns *prominence* — which value pops is a semantic choice the author makes with
weight + attention.)

- **An eyebrow / label / title placed ON TOP of a headline is always LEFT-aligned** on a page
  (see composition rule 7). A short eyebrow is the tell: in a centered stack the wrapped heading
  fills the width and reads left while the short eyebrow visibly centers — so only the eyebrow
  looks adrift. Intros hang off the page's left grid line; centering is an artifact idiom.
- **Text colour on the default canvas is neutral ink** (`auto`), never a brand tint. A purple/
  brand-coloured heading or line on a white/default background is off-brand. Tint text ONLY for
  **links**, or when it's **on a surface** (context-aware, readable on the band). Semantic status
  colours (success/error/warning) are the exception. (Compiler-enforced: a brand-tinted Text
  off-surface is dropped back to neutral ink.)

---

## 6. Spacing and Layout

### Grid System Per Platform

| Platform | Breakpoint | Margin | Gutter | Columns |
|----------|-----------|--------|--------|---------|
| S-360 (Mobile) | 360px | `var(--Grid-Margin)` = 16px | `var(--Grid-Gutter)` = 8px | 4 |
| S-600 (Tablet) | 600px | 24px | 12px | 8 |
| M-1024 (Landscape) | 1024px | 32px | 16px | 12 |
| L-1920 (Desktop) | 1920px | 50-88px | 22-27.5px | 12 |
| XL-2560 (Large) | 2560px | 80-120px | 24-32px | 12 |

Use `var(--Spacing-Margin)` and `var(--Spacing-Gutter)` for page-level margins and gutters -- they automatically adapt to the active platform.

**Content never touches the frame edge.** Every screen has a horizontal margin (even the 16px mobile minimum above) — text and controls running flush to the edge is the single most obvious "unfinished" tell. The page root owns exactly ONE margin (the DS `Container` fluid variant self-applies `--Grid-Margin`); sections inherit it and must not double it or zero it out. Full-bleed is a deliberate exception (a hero image band, an edge-to-edge divider), never the default. If a generated screen shows content at x=0, the margin cascade has broken — that is a defect to fix, not a style.

### Spacing Selection Guide

Spacing tokens are **numeric** — the suffix is the value in quarter-units (`--Spacing-N` ≈ N×4px at base density). There are no T-shirt names.

| Use Case | Token | Mobile Default |
|----------|-------|----------------|
| Micro gap (icon to text) | `--Spacing-1` (f-6) | 4px |
| Small gap (between chips) | `--Spacing-2` (f-4) | 8px |
| Tight padding (compact button) | `--Spacing-2-5` (f-3) | 10px |
| Standard padding | `--Spacing-4` (f0) | 16px |
| Between components | `--Spacing-4-5` to `--Spacing-6` | 18-24px |
| Between card groups | `--Spacing-7` to `--Spacing-8` | 28-32px |
| Section gap | `--Spacing-9` to `--Spacing-12` | 36-48px |
| Major page separator | `--Spacing-14` to `--Spacing-18` | 56-72px |

### Whitespace Philosophy

When in doubt, add more whitespace. The spacious, Apple-like aesthetic comes from generous breathing room between elements. Tight packing signals density and complexity -- avoid it unless the use case genuinely demands it (data tables, compact toolbars).

### Task flows are dense and CONSISTENT, not spacious

A checkout / onboarding / booking flow is a **tool**, not a brochure — marketing breathing room
(48–80px between bands) reads as "huge empty gaps between the sections" on a focused task. A flow
keeps a **tight** section rhythm, and — just as important — a **uniform** one: every step and every
section on a step gets the *same* vertical padding, so no screen looks more spaced than another.
The section's own `paddingY` is the single source of rhythm; never stack a container gap on top of
it (that double-spaces every step). (Enforced by the compiler for any flow — see the task-flow
rhythm rule — so this is a guarantee, not a suggestion.)

---

## 7. Navigation and App Structure

Navigation is the skeleton of a composition — get it wrong and nothing else lands. The fundamentals below cover the whole-page structure; the full inventory, breakpoint shell model, and worked patterns live in `references/navigation-patterns.md` (read it when building real nav).

### Use the navigation components that exist

OneUI ships these — compose with them, don't hand-roll nav from raw divs (you'd lose `aria-current`, focus, and touch targets):

| Need | Component | Notes |
|------|-----------|-------|
| Switch views *within one screen* | `Tabs` | Compound; horizontal/vertical; active = role accent + sliding indicator. NOT for top-level app destinations |
| Top-level destinations on **mobile** | `BottomNavigation` + `BottomNavItem` | 2–5 destinations; active = content `high`, inactive = `low` |
| Top app bar / header on **every** screen (web AND mobile) | `WebHeader` (`.PrimaryNav` / `.SecondaryNav` / `.Item`) | The real DS header — responsive, collapses to `MobileDrawer` at small breakpoints. **Never hand-roll a top bar from raw `Logo`+`IconButton` in a row** — that ships wrong (non-mobile) sizing. On mobile it's a brand/logo bar (destinations live in the bottom nav). |
| Hierarchical location trail | `Breadcrumb` | Semantic navigation landmark with current-item handling, deterministic overflow, truncation, and router-link composition |
| Dropdown / grouped link nav | `NavigationMenu` | Compound mega-menu |
| Overflow / context actions | `Menu` | Not primary navigation |
| View-mode / filter switch | `ToggleGroup` | A toggle, not navigation (grid vs list) |
| Paged results | `Pagination` | `attention` + `appearance` props |
| Inline / standalone text nav | `Link` (`<a>`) / `LinkButton` (`<button>`) | |

**Does not exist — compose, don't hallucinate:** Sidebar/NavRail (compose from vertical `Tabs` or a `Link` column) and AppBar (use `WebHeader`). `Stepper` is a numeric input, **not** a step indicator.

### The fundamentals (apply every time)

1. **Swap the shell by breakpoint.** One primary *destination map* per breakpoint: `BottomNavigation` on mobile (S-360/S-600), `WebHeader.PrimaryNav` on desktop (L-1920/XL-2560). Never show a bottom nav *and* a full header **destination nav** at once — that's two competing maps. A **minimal top app bar** (brand mark, or a screen title + back — *no* destination links) is NOT a second map: on mobile it may sit above the bottom nav, and every real mobile screen has one. So a mobile page ships BOTH: a light title/app bar on top, the destination bar at the bottom.
1b. **Linear flows get flow chrome, not tab chrome — but they STILL ship the DS header.** A checkout, onboarding, or wizard is a sequence, not a hub, so it shows **no destination map** (no bottom-nav tabs / side rail the user can't leave mid-step). But it does keep the design-system **header** — a minimal brand app bar (the real `WebHeader`, logo-only) — plus the **step-progress** indicator (a breadcrumb/`Badge`+`Text`; `Stepper` is a numeric input, not a step indicator). A flow step with no header at all reads as a detached fragment. The primary action ("Continue"/"Place order") is one clear button, not a nav item.
2. **Active = `primary` role; inactive = neutral.** Mark the current location with the primary accent + `aria-current="page"`. Never use `secondary` to signal active nav. One unambiguous "you are here" per surface.
3. **Navigation is None/Low attention.** Users look *through* the nav to reach content. It sits at the bottom of the attention pyramid — don't spend bold surfaces or brand color on the chrome.
4. **Headers stay on the `default` surface.** A header is wayfinding, not brand expression. (For any non-default header/nav surface question, the `surface` skill is the authority — but the default answer for nav chrome is `default`.)
5. **Nav labels use the `Label` role** at Medium weight — never Body or Display.
6. **2–5 top-level destinations.** More than that means the information architecture is too flat — group and use overflow, don't cram.

For the breakpoint shell table, active-state details, accessibility specifics, and worked TSX (mobile shell, in-screen tabs, and Breadcrumb), see `references/navigation-patterns.md`.

## 8. Component Selection Guide

### Action Components

| Need | Component | Variant | Appearance | Notes |
|------|-----------|---------|------------|-------|
| Primary CTA | `Button` | `bold` | `primary` | One per viewport section |
| Secondary action | `Button` | `subtle` | `primary` or `secondary` | |
| Tertiary/cancel | `Button` | `ghost` | `neutral` | |
| Icon-only (toolbar) | `IconButton` | `high`/`medium`/`low` | `neutral` | Always provide `aria-label` |
| Floating action | `FAB` | `primary`/`secondary` | `primary` | Position fixed/sticky |
| Text navigation | `Link` / `LinkButton` | `default` | -- | Inline or standalone |
| Destructive action | `Button` | `bold` or `subtle` | `negative` | Red accent signals danger |
| Success confirmation | `Button` | `bold` | `positive` | Green accent |

### Selection & Filter Components

| Need | Component | Notes |
|------|-----------|-------|
| Toggleable filter | `Chip` | Default appearance = `secondary`. Use `bold` for selected state |
| Category selector | `ChipGroup` | Horizontal set of chips; on a narrow screen it **wraps** — it never clips off the edge |
| Pick ONE from a short set (date, delivery slot, plan) | `ChipGroup` | Selectable chips — a real single-select control, NOT hand-built option cards |
| Pick one from a longer/detailed list (address, payment method) | `Radio` rows / `ListItem` with a trailing `Radio` | Selected = `primary`/`bold`; the row is a rounded box (`--Shape-4`), never square |
| Status indicator | `Badge` | Use semantic roles (`positive`/`negative`/`warning`) |
| Count | `CounterBadge` | Numeric content only |
| User identity | `Avatar` | `image`/`icon`/`text` content modes, 2xs-2xl sizes |

**Selection is a component, not a layout.** A "choose a date", "pick a delivery slot", "select an
address" step is a **selection control** — use `ChipGroup` (chips) or `Radio` rows, whose
selected state, focus, and rounded shape are built in. Do **not** hand-roll selectable option "cards"
out of `Container` + `Text` (they end up square, inconsistent, and have no real selected state — the
July-20 delivery-slot report). And a horizontal row of choices must **wrap on mobile**, never sit in a
`wrap:false` row that clips the last option off the screen edge ("Tomorrow · 24 Jun" cut in half).

**A dropdown (`Select`) is for choosing from a SHORT fixed list** (a topic, a plan, a country). It is
**not** for free-text entry — an address, a pincode, a name, a phone number are `InputField`s. Never put
a "Choose a topic" dropdown on an address/checkout-detail form; that is the `form/enquiry` pattern
leaking where it does not belong.

### Form Components

| Need | Component | Notes |
|------|-----------|-------|
| Boolean toggle | `Switch` | Secondary color role |
| Single choice (few options) | `Radio` | Secondary color role |
| Multi choice (few options) | `Checkbox` | Secondary color role |
| Numeric adjustment | `Stepper` | Small +/- controls |

### Content Components

| Need | Component |
|------|-----------|
| Section divider | `Divider` |
| Brand mark | `Logo` |
| Media display | `Image` |
| Content card layout | `ContentBlock` |

---

## 9. Shape System

Shape tokens derive from dimension f-steps, so they respond to platform and density automatically.

Shape tokens are **numeric** (`--Shape-0` … `--Shape-10`, same N×4px convention) plus the standalone `--Shape-Pill` (9999px). There are no T-shirt names.

| Element Type | Token | Jio Default | Reason |
|-------------|-------|-------------|--------|
| Buttons | `var(--Shape-Pill)` | 9999px | Pill = maximum friendliness, Jio identity |
| Icon buttons | `var(--Shape-Pill)` | 9999px | Circular for tappability |
| Chips | `var(--Shape-Pill)` | 9999px | Pill for filter chips |
| Avatars | `var(--Shape-Pill)` | 9999px | Always circular |
| Inputs, selects | `var(--Shape-2)` (f-4) | 8px | Subtle rounding, container feel |
| Small cards | `var(--Shape-4)` (f0) | 16px | Moderate rounding |
| Large containers | `var(--Shape-4-5)` to `--Shape-6` | 18-24px | Gentle rounding |
| FAB | `var(--Shape-4)` (f0) | 16px | Rounded square, not pill |
| Modals/sheets | `var(--Shape-4-5)` or larger | 18px+ | Soft corners |
| Sharp edges | `var(--Shape-0)` | 0px | Dividers, full-bleed sections |

Rule: Components define their default shape via `--ComponentName-borderRadius`, overridable per brand. `--Shape-Pill` is a standalone constant — NOT part of the numeric scale.

---

## 10. Elevation and Depth

Prefer surface differentiation over shadows. Shadows are for functional hierarchy (floating elements), not decoration.

| Level | Token | Use Case |
|-------|-------|----------|
| 0 | `--Elevation-0` (none) | Default state, flat UI (80%+ of elements) |
| 1 | `--Elevation-1` | Subtle lift: sticky header, card hover |
| 2 | `--Elevation-2` | Medium lift: floating card, tooltip |
| 3 | `--Elevation-3` | FAB, popover, dropdown menu |
| 4 | `--Elevation-4` | FAB hover, emphasized floating |
| 5 | `--Elevation-5` | Modal overlay, bottom sheet |

**Rules:**
- Use `<Surface mode="minimal">` or `<Surface mode="subtle">` to visually separate sections before reaching for shadows
- Most UI lives at Elevation-0. Apple-like flat design uses surface color differences, not shadows
- Dark mode: elevation uses slightly lighter surface (the system handles this via theme tokens)
- Two-shadow formula per level: sharp key light + soft ambient light

---

## 11. Responsive Behavior

The system uses **discrete platform breakpoints** (not fluid clamp). All dimensions, spacing, typography, and shape adapt via the f-step cascade.

| Platform | Base Scale (f0) | Touch Target | Key Layout Change |
|----------|----------------|--------------|-------------------|
| S-360 | 16px | 44px | 4-col grid, stacked layouts, full-bleed |
| S-600 | 16px | 44px | 8-col grid, side-by-side starts |
| M-1024 | 18px | 44px | 12-col grid, sidebar navigation |
| L-1920 | 18px | 44px | Full desktop, generous whitespace |
| XL-2560 | 20px | 44px | Max-width containers, maximum whitespace |

**Density** (compact/default/open) changes the **base size** the whole scale is derived from — it does NOT remap which step a token points to. `--Spacing-4` is `var(--Dimension-4)` at every density; `--Dimension-4` is simply worth fewer or more pixels. Since every token is `base x (tokenName / 4)`, one number moves spacing, shape, stroke, grid and type together, in proportion.

| Breakpoint | Compact | Default | Open |
|---|---|---|---|
| S (<620px) | 14px | 16px | 18px |
| M (620-990px) | 16px | 18px | 20px |
| L (>=991px) | 18px | 20px | 22px |

Compact = tighter UI for power users. Open = roomier UI for content-focused experiences.

The same mechanism scales the system to non-web media: a TV, print sheet or billboard is a fixed canvas whose base comes from its DIN 1450 viewing distance (TV ~29.9px, A4 ~47.9px, billboard ~143.6px), and the identical ladder re-derives from it.

All responsive adaptation happens through CSS tokens -- no media query breakpoints in component CSS. The `[data-Breakpoint]` and `[data-6-Density]` attributes control which dimension values are active.

---

## 12. CSS Token Pattern

All component CSS follows the **role-agnostic intermediate variable** pattern, using the unified role-explicit tokens (`--{Role}-Bold`, `--{Role}-Subtle`, `--{Role}-Bold-High`, etc.):

```css
.component {
  /* 1. Intermediate vars -- default = Primary role */
  --_comp-fill: var(--Primary-Bold);
  --_comp-text: var(--Primary-Bold-High);

  /* 2. Consume intermediates */
  background-color: var(--_comp-fill);
  color: var(--_comp-text);
  border-radius: var(--Shape-Pill);
  padding: var(--Spacing-2-5) var(--Spacing-5);
  font-size: var(--Label-M-FontSize);
  font-weight: var(--Label-FontWeight-High);
}

/* 3. Appearance classes remap intermediates to other roles */
.appearanceNeutral {
  --_comp-fill: var(--Neutral-Bold);
  --_comp-text: var(--Neutral-Bold-High);
}

/* 4. Variant selectors consume intermediates -- zero duplication */
.bold { background-color: var(--_comp-fill); }
.subtle { background-color: var(--Primary-Subtle); }
.ghost { background-color: transparent; }
```

### Zero Literals Rule

No hex colors, no pixel values (except `0`, `9999px`, `100%`), no font names directly in CSS. Everything via `var(--Token-Name)`. Enforced by `pnpm check:literals`.

<!-- INTENTIONAL-LEGACY-VOCAB: this section names legacy aliases so the model
     knows them as deprecated. Do NOT use them in new generation. -->
### Token Naming

Reach for the role-explicit unified tokens first: `--Primary-Bold`, `--Primary-Subtle`, `--Primary-High`, `--Primary-Bold-High`, `--Primary-TintedA11y`, etc. Legacy aliases (`--Primary-FG-Bold`, `--Surface-Bold`, `--Text-High`) are still emitted for backward compatibility but new code should not reach for them as primaries.

---

## 13. Do's and Don'ts

### Do

- Use `<Surface>` for any non-default background containing interactive children
- Use `default` surface for most UI: headers, cards, product grids, lists
- Follow the attention pyramid: None (60%) > Low (25%) > Medium (10%) > High (5%)
- Use one primary CTA per viewport section
- Use semantic color roles (`positive`/`negative`/`warning`/`informative`) for status -- not brand roles
- Use `Label` role for all interactive element text (buttons, chips, tabs, nav items)
- Use generous whitespace between sections -- more is almost always better
- Use `var(--Spacing-Margin)` and `var(--Spacing-Gutter)` for page margins and gutters
- Keep Sparkle rare -- maximum 1-2 elements per viewport
- Let content (imagery, text, data) be the hero on product cards

### Don't

- Use bold surfaces everywhere -- it makes nothing stand out
- Put brand color on headers -- headers are for navigation
- Use Display or Headline roles for button text -- buttons use Label role
- Use elevation when surface differentiation (`minimal`/`subtle`) suffices
- Hard-code colors, sizes, or fonts -- use tokens exclusively
- Use Sparkle role for common UI elements -- reserve for celebration moments
- Compete with content -- if photography is hero, reduce surrounding UI chrome
- Use `bold` without a `<Surface>` wrapper -- breaks child adaptation
- Use more than 3 different surface modes on the same page -- keep it simple
- Set `background-color` manually on containers with interactive children
<!-- INTENTIONAL-LEGACY-VOCAB: this Don't-list rule names legacy aliases so the
     model can recognise and avoid them. -->
- Reach for legacy `--*-FG-Bold`, `--*-BG-Subtle`, `--Surface-Bold`, `--Text-High` tokens in new code -- use the unified `--{Role}-Bold`, `--{Role}-Subtle`, `--{Role}-High`, `--{Role}-Bold-High` instead

---

## 14. Cross-Skill Integration

There are three distinct surface-related skills — keep their jobs separate:

- **`surface`** — *when/which/why* a surface level is used (design judgment, restraint). The authority on surface choice.
- **`surface-context`** — *how* surfaces work under the hood (the `[data-surface]` token-remapping engine, building surface-aware components, debugging invisible elements).
- **`oneui-design-composition`** (this skill) — *how surfaces fit into the whole page* alongside layout, type, spacing, components.

| Working On | Use This Skill | Plus |
|------------|---------------|------|
| Page layout, overall UI composition | `oneui-design-composition` | -- |
| Which surface level / when to use a non-default surface | `surface` (primary) | This for how it fits the page |
| Surface token mechanics, `[data-surface]` CSS, surface-aware component CSS | `surface-context` (primary) | -- |
| Debugging surface adaptation (invisible element on bold) | `surface-context` (primary) | -- |
| Brand theming, recipe system, CSS injection | This for visual guidelines | `oneui-multi-brand` for architecture |
| Component CSS internals | This for conventions | Read the component's `.module.css` directly |
| Brand CSS injection pipeline | -- | `oneui-multi-brand` (primary) |
