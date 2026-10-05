---
name: oneui-components-definition
description: >-
  Definitions of every OneUI UI component — what each one is, when to use it, which sibling to
  reach for instead, and the props that change its meaning. Use whenever choosing, placing,
  swapping or reviewing a OneUI component in Figma, or when unsure which of two similar
  components (Icon vs IconContained vs IconButton, Badge vs CounterBadge, Tooltip vs Popover,
  Switch vs Checkbox, Modal vs BottomSheet vs SideSheet, Spinner vs CircularProgressIndicator,
  Button vs SingleTextButton) is correct.
---

# OneUI Components — definitions

Use this skill to answer **"which component is this, and is it the right one?"**

It covers what each OneUI component *means*, the intent it serves, the props that change that
intent, and the sibling components that are easy to confuse with it. It does not cover token
binding or variable modes — for those, load the OneUI foundations skills.

## How to use this skill

1. **Start from what the element does, not from how it looks.** "User taps this to do something"
   → Button family. "This shows a count" → CounterBadge. Jump via
   [Intent → component](#intent--component).
2. **Check the disambiguation rules** before placing anything from a confusable family
   (icons, badges, overlays, progress, form controls). Those rules override a component's own
   description.
3. **Read the component entry** for its props and its *Related siblings* block. Siblings exist
   because they encode a different intent — picking the wrong one renders fine and is still wrong.
4. **Never invent props or variant values.** If a behaviour is not listed here, it does not exist
   on that component — say so rather than substituting something similar.
5. **Never restyle an instance to get the look you want.** On a placed OneUI Component or
   Micropattern, the fill, stroke, effects, selection colours, position and auto-layout panels are
   **read-only** — they carry the library's own bindings, and overriding one detaches that property
   from brand, theme, colour mode and density. Change the look through the props and variants listed
   in this file. If they cannot get you there, the component choice is wrong — come back to step 1.
   Those panels are yours to set on frames you create and on custom components you build because no
   OneUI equivalent exists, and nowhere else.

---

## Shared behaviour

### `attention`

`attention` appears across components and always means the same thing — visual emphasis, not
semantics:

| Value | Renders as | Use for |
|---|---|---|
| `high` | Bold, solid filled surface | Primary emphasis — the one main action or the thing that must be seen first |
| `medium` | Tinted, muted surface | Standard / secondary emphasis — the default for most instances |
| `low` | Ghost / transparent, no visible surface | De-emphasised — tertiary actions, dismiss, inline links |

**Rule:** one `high` per decision point. Two competing `high` elements in the same view means the
hierarchy is wrong, not that both are important.

### `contained`

`contained` decides whether the component brings its own padded container, or sits flush in the
content around it. It appears on [Button](#1-button) and [IconButton](#2-iconbutton):

| Value | Renders as | Use for |
|---|---|---|
| `true` | A padded box that owns its own tap target and spacing | Standalone actions — form submits, dialog buttons, toolbar icons |
| `false` | No padding and no container box; the label or icon aligns flush with what sits next to it | Inline actions where the surrounding layout already provides the spacing — "See all" beside a section title, a close icon after a heading |

**Pair `contained = false` with `attention = low`.** The no-padding form exists for lightweight
inline actions. A `high` or `medium` instance needs its container to read as a solid or tinted
surface, so leave `contained = true` there.

**Set the prop; do not strip the padding.** If an inline action sits too far from its neighbour,
switch `contained` to `false` rather than zeroing padding on the instance — padding on a placed
OneUI component is read-only (see step 5 above).

---

## Intent → component

| The user needs to… | Component |
|---|---|
| Perform a labelled action | [Button](#1-button) |
| Toggle between labelled options, one stays active | [SelectableButton](#1-button) |
| Tap lightweight inline text ("See all", "Cancel") | [Button](#1-button) with `attention = low`, `contained = false` |
| Perform an action shown only by an icon | [IconButton](#2-iconbutton) |
| Toggle an icon on/off (bookmark, favourite) | [SelectableIconButton](#2-iconbutton) |
| Show a fixed one-or-two-character pill — a calendar date, an initials token | [SingleTextButton](#35-singletextbutton) |
| …the same, but it can be picked (a selected date) | [SelectableSingleTextButton](#35-singletextbutton) |
| Read a short status or category label | [Badge](#3-badge) |
| Read a numeric count | [CounterBadge](#29-counterbadge) |
| See that *something* is there, count irrelevant | [IndicatorBadge](#29-counterbadge) |
| See a picture in a consistent frame | [Image](#4-image) |
| See content sections visually separated | [Divider](#5-divider) |
| See a bare decorative/informational icon | [Icon](#6-icon) |
| See a non-clickable icon on a background shape | [IconContained](#7-iconcontained) |
| Identify a person or entity | [Avatar](#8-avatar) / [AvatarGroup](#8-avatar) |
| Filter, tag, or multi-select compactly | [Chip](#9-chip) / [ChipGroup](#9-chip) |
| Enter text into a form | [InputField](#10-inputfield) |
| Flip a setting that applies immediately | [Switch](#11-switch) |
| Toggle an option in a form — label and/or description only | [Checkbox](#12-checkbox) |
| …the same, **plus** a required indicator, info icon, or validation message | [CheckboxField](#12-checkbox) |
| Choose exactly one from a mutually exclusive set — label and/or description only | [Radio](#13-radio) |
| …the same, **plus** a required indicator, info icon, or validation message | [RadioField](#13-radio) |
| Dim content behind a floating surface | [Scrim](#14-scrim) |
| See the brand mark | [Logo](#15-logo) / ProductLogo |
| Increment / decrement a number | [Stepper](#16-stepper) |
| Act on contextual content sliding up from the bottom | [BottomSheet](#17-bottomsheet) |
| Make a focused, blocking decision | [Modal](#18-modal) |
| Work in a side panel (filters, details) | [SideSheet](#17-bottomsheet) |
| See progress across a full-width bar | [LinearProgressIndicator](#19-linearprogressindicator) |
| See progress in a compact ring | [CircularProgressIndicator](#20-circularprogressindicator) |
| See that something is loading, no progress value | [Spinner](#27-spinner) |
| Switch between mutually exclusive views | [Segmented Control](#21-segmented-control) |
| Expand and collapse sections of content | [Accordion](#22-accordion) |
| Get brief, non-blocking system feedback | [Toast](#23-toast) |
| Read a short hint on hover/focus | [Tooltip](#24-tooltip) |
| Interact with rich content in a floating container | [Popover](#25-popover) |
| Pick a value along a continuous range | [Slider](#26-slider) / [TouchSlider](#26-slider) |
| Move between numbered pages | [Pagination](#28-pagination) |
| See position within a swipeable carousel | [PaginationDots](#28-pagination) |
| See a realistic device status bar — **and there is no header** | [Status Bar](#30-status-bar) |
| …the same, **with** a mobile header | HeaderNative *(micropattern)* — see [Status Bar vs HeaderNative](#status-bar-vs-headernative) |
| Understand where they are in a hierarchy | [Breadcrumb](#31-breadcrumb) |
| Read a countdown or elapsed duration | [Timer](#32-timer) |
| See a screen inside a device frame | [Mockup](#33-mockup) |
| See the state of an AI / voice agent | [AgentPulse](#34-agentpulse-icon) |

---

## Disambiguation rules

These override the individual component descriptions. Check the relevant one **before** placing.

### Button vs SingleTextButton — an action vs a character pill

**SingleTextButton is not "Button without icons".** Despite the name, it is not part of the action
family and is not the component for text-only actions.

| The element is | Component |
|---|---|
| A worded action the user performs — "Save", "See all", "Learn more", "Cancel" | **Button** (use `attention = low` for the lightweight inline ones; set `contained = false` for no-padding scenarios) |
| A fixed pill holding one or two characters that stands for a value — a date number in a calendar, initials in an avatar-style cluster | **SingleTextButton** |

If the content is a word, a phrase, or anything that reads as a command, it is a **Button** — even
when there is no icon and no full-width. A text-only Button is still a Button. For lightweight
inline / no-padding actions, pair `attention = low` with [`contained = false`](#contained).

### Icons — clickability first, then background

| Clickable? | Background surface? | Component |
|---|---|---|
| Yes | Either | **IconButton** (or **SelectableIconButton** if it toggles) |
| No | Yes | **IconContained** |
| No | No | **Icon** |

Decide clickability first. A decorative icon on a coloured circle is *not* an IconButton just
because it looks like one.

### Badges — text vs number vs dot

| Content | Component |
|---|---|
| Short text status or category — "New", "Sale", "Pro" | **Badge** |
| A number — "3", "99+" | **CounterBadge** |
| Nothing; presence only — unread, online, new activity | **IndicatorBadge** |

### Overlays — how much content, how blocking

| Situation | Component | Where it renders |
|---|---|---|
| Short, blocking decision — confirm, alert, destructive warning | **Modal** | Always centred on the screen |
| Longer, scrollable, multi-step, or mobile-contextual content | **BottomSheet** | Always flush to the bottom edge |
| Desktop-oriented persistent detail panel, filters, secondary nav | **SideSheet** | Left or right edge — see below |

**Position is fixed, not configurable.** Modal is centred and BottomSheet is bottom-anchored as
inherent UI behaviour — there is no position prop on either, so do not look for one and do not
reposition the instance on the canvas. SideSheet is the only overlay whose side is settable:
`style` = `overlay` (floats over content) or `inline` (embeds alongside it), then `direction`
(`left` / `right`) on the overlay form or `placement` (`left` / `right`) on the inline form.

All three include a Scrim internally — do not place Scrim beside them.

### Progress — do you know the value?

| Situation | Component |
|---|---|
| Full-width, page or section-level progress | **LinearProgressIndicator** |
| Compact ring, or you need a percentage / label / centre icon | **CircularProgressIndicator** |
| Simply "something is loading", no value, no label | **Spinner** |

Spinner has no determinate mode, no label and no icon. If you need any of those, it is a
CircularProgressIndicator.

### Floating content — Tooltip vs Popover

| | Tooltip | Popover |
|---|---|---|
| Trigger | Hover / focus | Click / tap |
| Content | Text only | Header, body slot, footer |
| Interactive? | No | Yes |
| Use for | Field hints, icon labels, truncated text | Mini-forms, rich menus, confirmation prompts |

If the content contains anything the user can click, it is a Popover.

### Immediate vs submitted — Switch vs Checkbox

| Situation | Component |
|---|---|
| Setting takes effect immediately (notifications, dark mode) | **Switch** |
| Selection is part of a form that requires explicit submission | **Checkbox** / **CheckboxField** |

### Bare control vs `…Field` wrapper

Two different situations — do not treat them alike.

**Checkbox and Radio are placeable on their own. Default to the bare control.** Reach for
`CheckboxField` / `RadioField` **only** when the design actually demands one of these three:

| Reach for the Field wrapper when you need | Example |
|---|---|
| A **required indicator** | The asterisk on a mandatory consent checkbox |
| An **info icon** | A help/tooltip affordance beside the label |
| A **validation / feedback message** | Error, warning or success text under the control |

**A label and a description are not enough.** A checkbox with a label — or a label plus supporting
description text — is still a plain **Checkbox**. Wrapping it in CheckboxField adds form structure
nothing asked for. Same for Radio.

**Input is the exception.** Input and InputText are internal sub-components that are never placed
directly, so `InputField` is always the component for a text field — there is no bare control to
choose instead.

### Status Bar vs HeaderNative

**HeaderNative owns the status bar.** The micropattern includes one internally, so a standalone
Status Bar beside it renders twice.

| Screen has | Place |
|---|---|
| A mobile header | **HeaderNative only** — set `statusBar = true` |
| No header (splash, full-bleed media, device mockup) | **Status Bar** directly |

⚠️ **`statusBar` defaults to `false`.** Placing HeaderNative does not give you a status bar — you
must set the prop. Forgetting it is why a rebuilt screen loses its status bar.

### One-of-many selectors

| Situation | Component |
|---|---|
| Mutually exclusive views/modes, always one selected, compact bar | **Segmented Control** |
| Filtering, tagging, multi-select, optional selection | **Chip** / **ChipGroup** |
| Mutually exclusive form choice with descriptions | **Radio** / **RadioField** |
| Labelled toggle buttons that stay active | **SelectableButton** |

# Component definitions

### 1. Button

The primary action trigger across the system. Use **Button** whenever a user needs to perform a
labelled action — submitting a form, confirming a dialog, navigating forward.

**Related siblings:**

- **SelectableButton** — same as Button but adds a `selected` state. Use for toggle-style buttons
  where one option stays active (view mode switchers, filter tabs with labels).

**Notes:** emphasis comes from [`attention`](#attention) — `high` for the primary action, `medium`
for secondary, `low` for tertiary/dismiss. Whether the button carries its own padded container
comes from [`contained`](#contained).

**Button covers every worded action, including text-only ones.** A "See all" or "Cancel" with no
icon and no full-width is a Button at `attention = low` with [`contained = false`](#contained) for
the no-padding scenarios, not a [SingleTextButton](#35-singletextbutton) — that component is a
character pill, not a sibling of Button. See
[Button vs SingleTextButton](#button-vs-singletextbutton--an-action-vs-a-character-pill).

---

### 2. IconButton

A clickable, icon-only button for actions where a label isn't needed — close, menu, settings,
share, favourite. The icon itself communicates the action.

**Related sibling:**

- **SelectableIconButton** — same as IconButton but adds a `selected` state. Use for toggle icons
  like bookmark, favourite, or view-mode switches where the icon stays "on".

**Notes:** if the icon is not clickable, it is [Icon or IconContained](#icons--clickability-first-then-background),
never IconButton. An icon action sitting inline next to text — a close after a section label — takes
`attention = low` with [`contained = false`](#contained); a standalone one in a header or toolbar
keeps `contained = true`.

---

### 3. Badge

A compact, metadata-level label for displaying status, category, or short informational text
alongside content — "New", "Sale", "Pro", status indicators in lists or cards.

**Not for numbers.** See [CounterBadge](#29-counterbadge).

---

### 4. Image

A structured image container that enforces consistent aspect ratios, orientation, and optional
overlays.

| Prop | Meaning |
|---|---|
| `interactive` | `true` when the image is clickable |
| `scrim` | `true` adds a gradient overlay so text placed on the image stays legible |

---

### 5. Divider

A visual separator for creating logical grouping between content sections. Works horizontally
(between stacked rows) or vertically (between side-by-side columns).

| Prop | Meaning |
|---|---|
| `slot` | Optionally places a label ("OR", a section title) or an icon in the middle of the divider |

---

### 6. Icon

A standalone, **non-clickable** icon **without** a background surface. Use for decorative or
informational icons in a layout — feature-list inline icons, empty-state accents, or any place you
need a bare icon that isn't interactive.

---

### 7. IconContained

A **non-clickable** icon **with** a background surface. Use when the icon sits on a visible
background shape that is purely presentational — feature list icons, category markers, step
indicators, decorative accents.

**Key distinctions:**

- Background surface, non-clickable → **IconContained**
- No background surface, non-clickable → **Icon**
- Clickable (with or without background) → **IconButton**

---

### 8. Avatar

Represents a user or entity visually — profile headers, comment threads, user lists, mentions.

| Content type | Use when |
|---|---|
| `image` | A real profile photo is available |
| `icon` | Generic silhouette placeholder, no photo and no name |
| `text` | Initials, e.g. "JS" |

**Related sibling:**

- **AvatarGroup** — displays multiple avatars together in **stacked** (overlapping), **inline**, or
  **grid** layout with a "+N" overflow count. Use for team lists, shared-with indicators, or
  participant displays — do not hand-arrange multiple Avatars.

---

### 9. Chip

A compact, selectable element for filtering, tagging, or multi-select choices — filter bars, tag
selectors, category pickers.

| Prop | Meaning |
|---|---|
| `selected` | Toggle state. Selected chips appear filled; unselected appear outlined/ghost |

**Related sibling:**

- **ChipGroup** — wraps multiple Chips in an `inline` (single row, scrollable) or `wrap`
  (multi-line) container with consistent spacing. Use instead of manually arranging chips.

---

### 10. InputField

The **complete form field wrapper** — composes a label, input area, helper text, validation
feedback, and required indicator into one unit. **This is what should be placed in forms.**

**Internal sub-components (not placed directly):**

- **Input** — the bare input container shell (box outline + internal slots). Used internally by
  InputField.
- **InputText** — the raw text content layer inside the input, handling placeholder vs. filled
  states.

---

### 11. Switch

A toggle control for binary on/off settings — enabling notifications, toggling dark mode,
activating features. Use when the setting **takes effect immediately**, without a form submission.

**Related sibling:**

- **Checkbox** — use Checkbox instead when the selection is part of a form that requires explicit
  submission ("I agree to terms", multi-select preferences in a settings form).

---

### 12. Checkbox

A selection control for toggling a single option on/off, or selecting multiple items from a list.

| State | Use for |
|---|---|
| `indeterminate` | "Select all" parent checkboxes where only some children are checked |

**Related siblings:**

- **CheckboxField** — the form-level wrapper around Checkbox, adding a required indicator, info icon
  and validation feedback. **Use it only when one of those three is genuinely required.** A checkbox
  with just a label, or a label plus description, stays a plain Checkbox — see
  [Bare control vs `…Field` wrapper](#bare-control-vs-field-wrapper).
- **Switch** — use Switch instead when the toggle takes effect immediately (no form submission).

---

### 13. Radio

A single-select control for choosing exactly one option from a mutually exclusive set — payment
method, shipping speed, plan tier.

**Related sibling:**

- **RadioField** — the form-level wrapper around Radio, adding a required indicator, info icon and
  validation feedback. Same rule as CheckboxField: **use it only when one of those three is needed**
  — a radio with a label and description stays a plain Radio. See
  [Bare control vs `…Field` wrapper](#bare-control-vs-field-wrapper).

---

### 14. Scrim

A background overlay layer used behind modals, bottom sheets, side sheets and other floating
surfaces. Dims or blurs the content underneath to draw focus to the foreground element.

| Prop | Values | Meaning |
|---|---|---|
| `variant` | `gradient`, `overlay` | `gradient` fades directionally from an edge; `overlay` dims the entire surface uniformly |
| `position` | `bottom`, `top`, `left`, `right`, `center` | Which edge the gradient originates from |
| `overlayBlurSize` | `none`, `s`, `m`, `l` | Optional backdrop blur for frosted-glass effects |

**Not typically placed manually** — it comes built into BottomSheet, Modal and SideSheet.

---

### 15. Logo

The product/brand logo mark. Use for app headers, splash screens, login screens, and anywhere the
brand identity needs to appear.

| Prop | Meaning |
|---|---|
| `interactive` | `true` makes the logo tappable (e.g. "tap logo to go home") |

**Related sibling:**

- **ProductLogo** — a single, fixed variant for specific product-level branding.

---

### 16. Stepper

A numeric increment/decrement control — quantity selectors in carts, number of guests, adjusting
counts. Composed of two IconButtons flanking an InputText display.

| Prop | Values | Meaning |
|---|---|---|
| `type` | `button` | Read-only display; the user can only tap **+** / **−** |
| | `input` | The user can also type a value directly |

---

### 17. BottomSheet

A sliding panel that rises from the bottom of the screen — contextual actions, confirmations,
detail views, or secondary flows without leaving the current screen.

| Prop | Values | Meaning |
|---|---|---|
| `snapPoint` | `collapsed` | Peek / handle only |
| | `halfExpanded` | Half screen |
| | `fullyExpanded` | Full screen |
| | `custom` | Custom height |
| `footer` | boolean | Show/hide the footer action area |
| `topDivider` | boolean | Divider below the header |
| `bottomDivider` | boolean | Divider above the footer |

Internally composed of Header, a body slot (accepts any content), and Footer with action buttons.

**Related siblings:**

- **Modal** — a centred floating dialog for focused decisions (confirmations, alerts, simple
  forms). Use Modal when content is short and the decision is blocking; use BottomSheet when
  content may be long or scrollable.
- **SideSheet** — a panel that slides in from the side, in `inline` (pushes content) or `overlay`
  (floats on top) style. Use for desktop-oriented detail panels, filters, or secondary navigation.

---

### 18. Modal

A centred floating dialog for focused, blocking decisions — confirmations, alerts, simple forms and
destructive action warnings. Keeps the user's attention on a single task before continuing.

**Related siblings:**

- **BottomSheet** — use instead for mobile-friendly, scrollable, or multi-step contextual content.
- **SideSheet** — use instead for desktop-oriented side panels with persistent detail views or
  filters.

---

### 19. LinearProgressIndicator

A horizontal progress bar showing task completion or loading state.

| Prop | Values | Meaning |
|---|---|---|
| `type` | `determinate` | Shows exact progress percentage |
| | `indeterminate` | Animated loop for unknown duration |
| `roundedCaps` | boolean | Rounds the bar ends for a softer appearance |

**Related sibling:**

- **CircularProgressIndicator** — the circular/ring variant of the same concept. Use circular when
  space is constrained (inside buttons, card corners, avatar overlays) or for a more compact
  visual. Use linear for full-width section/page-level progress.

---

### 20. CircularProgressIndicator

A circular/ring progress indicator for task completion or loading state.

| Prop | Values | Meaning |
|---|---|---|
| `variant` | `determinate` | Shows exact progress arc |
| | `indeterminate` | Spinning animation for unknown duration |
| `label` | boolean | Show/hide a percentage or status label in the centre |
| `icon` | boolean | Show/hide an icon in the centre (e.g. checkmark on completion) |

**Related sibling:**

- **LinearProgressIndicator** — use linear for full-width, page/section-level progress bars.
- **Spinner** — use Spinner when there is no value, label or icon to show. See
  [Progress](#progress--do-you-know-the-value).

---

### 21. Segmented Control

A horizontal set of mutually exclusive options where **one is always selected** — view mode
switchers (List/Grid/Map), time period selectors (Day/Week/Month), content type tabs.

| Prop | Values | Meaning |
|---|---|---|
| `shape` | `pill`, `rectangular` | Rounded ends vs sharp corners |
| `type` | `text`, `icon` | Labelled segments vs icon-only segments |
| `equalWidth` | boolean | Forces all segments to the same width for visual balance |
| `trackEmphasis` | — | Controls the background track's visual weight |

Uses a slot-based architecture — fill it with **Segmented control - slot** items, one per option.

---

### 22. Accordion

A vertically stacked list of expandable/collapsible sections — FAQs, settings groups, or any
content that benefits from progressive disclosure. Keeps the page scannable by hiding detail until
the user asks for it.

**Internal sub-component (not placed directly):**

- **AccordionItem** — a single collapsible row with a header and expandable body.

  | Prop | Values | Meaning |
  |---|---|---|
  | `type` | `collapsed`, `Expanded` | Open state of the row |
  | `start` / `end` | slot | Optional leading / trailing icon slots |
  | `headerDivider` | boolean | Divider between items |

---

### 23. Toast

A temporary, **non-blocking** notification that appears briefly to confirm an action or surface
system feedback — "Saved successfully", "Connection lost", "Upload in progress".

| Prop | Values | Meaning |
|---|---|---|
| `type` | `default` | Neutral |
| | `loading` | In-progress |
| | `positive` | Success (green) |
| | `negative` | Error (red) |
| | `warning` | Warning (yellow) |
| | `info` | Informational (blue) |
| `actionsPlacement` | `bottom`, `end` | Where action buttons sit relative to the message |
| `close` | boolean | Dismiss ✕ button |
| `progressIndicator` | boolean | Loading bar |
| `helpText` | boolean | Secondary supporting line |
| `title` | boolean | Show/hide the title line |
| `actions` | boolean | Show/hide action buttons |
| `start` | slot | Leading icon |

If the message requires a decision before continuing, it is a [Modal](#18-modal), not a Toast.

---

### 24. Tooltip

A small, dark text bubble that appears on hover/focus to provide brief explanatory text — field
hints, icon label clarification, truncated text reveal.

| Prop | Values |
|---|---|
| `position` | `topStart`, `top`, `topEnd`, `leftStart`, `left`, `leftEnd`, `bottom`, `bottomStart`, `bottomEnd`, `right`, `rightStart`, `rightEnd` |
| `tip` | boolean — show/hide the triangular pointer arrow |

**Text only, never interactive.** For anything clickable, use [Popover](#25-popover).

---

### 25. Popover

A floating container with structured content (header, body slot, footer) that appears on
click/tap — rich contextual menus, mini-forms, confirmation prompts, or any interaction needing
more content than a Tooltip but less commitment than a Modal.

| Prop | Values |
|---|---|
| `position` | Same 12 placements as Tooltip |
| `tip` | boolean — show/hide the pointer arrow |
| `header` | boolean — show/hide the header section |
| `footer` | boolean — show/hide the footer section |

The body is a free-form slot.

**Key distinction from Tooltip:** Tooltip is hover-triggered, text-only and informational. Popover
is click-triggered, has structured sections, and supports interactive content.

---

### 26. Slider

A draggable track control for selecting a value within a continuous range — volume, brightness,
price-range filters, or any numeric input where precision matters less than speed.

| Prop | Values | Meaning |
|---|---|---|
| `type` | `continuous` | Single thumb |
| | `range` | Two thumbs for min/max selection |
| `knobStyle` | `inside` | Thumb sits within the track |
| | `outside` | Thumb extends beyond the track edges |
| `start` / `end` | slot | Optional icon or label flanking the track |

**Related sibling:**

- **TouchSlider** — a touch-optimised, thick-track variant designed for mobile swipe gestures.
  Works `horizontal` and `vertical`, with `sharp` or `rounded` track styles. Use TouchSlider for
  mobile-first interfaces where the standard Slider's thin track would be hard to grab.

---

### 27. Spinner

An indeterminate loading indicator — a simple animated circle/arc used when content or a section is
loading and the duration is unknown.

**Spinner has no determinate mode, no label and no icon.** It is purely a compact "something is
loading" signal.

**Key distinction:** use CircularProgressIndicator when you need to show an actual progress
percentage or completion state.

---

### 28. Pagination

A numbered page navigation control for browsing paginated content — search results, data tables,
article lists.

| Prop | Meaning |
|---|---|
| `firstLast` | Show/hide jump-to-first and jump-to-last buttons |
| `prevNext` | Show/hide previous/next arrow buttons |

**Related sibling:**

- **PaginationDots** — a minimal dot-style page indicator for carousels and swipeable content,
  showing the current position as a highlighted dot among a row of dots. Use PaginationDots for
  horizontal swiping (image carousels, onboarding flows); use Pagination for traditional numbered
  page navigation.

---

### 29. CounterBadge

A small numeric badge displaying a count — unread message counts, notification counts, cart item
quantities. Typically overlaid on icons (bell icon + "3") or placed inline with labels.

**Key distinction from Badge:** Badge is a text label for status/category ("New", "Sale").
CounterBadge is specifically for numeric counts ("3", "99+").

**Related sibling:**

- **IndicatorBadge** — an even simpler variant: just a coloured dot, with no text or number. Use
  for binary presence indicators — "has unread", "online status", "new activity" — where the exact
  count doesn't matter.

---

### 30. Status Bar

The device-level status bar (time, signal, battery) placed at the top of mobile screen mockups for
realistic framing.

| Prop | Meaning |
|---|---|
| `White status bar` | `true` for dark backgrounds (white text/icons); `false` for light backgrounds (dark text/icons) |

> ### ⚠️ Never place this next to a HeaderNative
>
> **If the screen has a mobile header, the status bar comes from
> [HeaderNative](#status-bar-vs-headernative), not from this component.** The HeaderNative
> micropattern contains a Status Bar internally — adding a standalone one beside it produces two
> stacked status bars and doubles the top inset.
>
> | Situation | What to place |
> |---|---|
> | Screen needs a status bar **and** a navigation header | **HeaderNative only.** Its `statusBar` prop (on PrimaryNav) **defaults to `false` — set it to `true`** |
> | Screen needs a status bar with **no** header — splash, full-bleed media, a device mockup | **Status Bar** on its own. This is the only case it is placed directly |
>
> Configure the internal one through HeaderNative, never by adding an instance next to it. Note that
> on the internal Status Bar, `White status bar = true` **hides** the content while keeping the space
> reserved — which is what you want over a dark hero or splash.

---

### 31. Breadcrumb

A horizontal navigation trail showing the user's location within a hierarchy — e.g.
Home > Category > Subcategory > Current Page.

| Prop | Meaning |
|---|---|
| `homeAsIcon` | `true` replaces the first "Home" text with a house icon |
| `overflow` | `true` collapses middle items into an ellipsis "…" for deep hierarchies |

---

### 32. Timer

A time display component showing hours, minutes and seconds — countdown timers, elapsed time, or
duration displays.

| Prop | Values | Renders as |
|---|---|---|
| `format` | `digits` | 1:24:45 |
| | `text short` | 1hr 24 min 45 sec |
| | `text long` | 1 hour 24 minutes 45 seconds |
| `hours` / `minutes` / `seconds` | boolean | Show/hide individual time segments |

---

### 33. Mockup

A device frame (phone shell) for wrapping screen designs in realistic device mockups — used in
presentations, marketing materials and app store screenshots.

---

### 34. AgentPulse (icon)

An animated AI/agent status indicator icon — visually represents the state of an AI assistant or
voice agent in the interface.

| Prop | Values |
|---|---|
| `State` | `Idle`, `Listening (rest)`, `Listening (active)`, `Thinking`, `Speaking` |

Each value renders a distinct animated icon form.

---

### 35. SingleTextButton

A fixed **pill** holding a very short string — in almost every case one or two characters. It is a
*character token*, not a worded action: the text stands for a value the user reads or picks, such as
a date number in a calendar grid or a two-letter token in a clustered display like an avatar group.

**Despite the name, this is not a member of the [Button](#1-button) family.** It is not "Button
without icons", it is not the component for text-only actions, and it is not a sibling you swap in
to make a Button lighter. A worded action — "See all", "Learn more", "Cancel" — is a **Button** at
`attention = low`, no matter how small or how plain it looks.

| Prop | Values | Meaning |
|---|---|---|
| `size` | `s`, `m`, `l` | Overall size |
| `attention` | `high`, `medium`, `low` | Visual emphasis — see [`attention`](#attention). Use it to mark the token's state, e.g. today vs a plain date |
| `condensed` | boolean | Compact padding |

**The pill shape is inherent, not a choice.** There is no shape, corner, icon, contained or
fullWidth prop — the component always renders as a pill. If the design needs an icon, a longer
label, or a full-width block, the component choice is wrong; go back to
[Button](#1-button).

**Related sibling:**

- **SelectableSingleTextButton** — the same pill plus a `selected` prop. Use it wherever the token
  can be picked and stays picked: the chosen date in a calendar, an active day-of-week token.

**Not to be confused with:**

- **[Avatar](#8-avatar) with `text` content** — initials that *identify a person or entity* are an
  Avatar, and multiple of them belong in an AvatarGroup, which brings its own "+N" overflow.
- **[Chip](#9-chip)** — a filter or tag the user selects from a set of labelled options, with word-
  length content.
- **[CounterBadge](#29-counterbadge)** — a number reporting a *count* attached to something else,
  not a value the user reads or picks on its own.

---

## Name index

Every component name in this skill, including siblings and internals.

| Name | Section |
|---|---|
| Accordion | [22](#22-accordion) |
| AccordionItem *(internal)* | [22](#22-accordion) |
| AgentPulse | [34](#34-agentpulse-icon) |
| Avatar | [8](#8-avatar) |
| AvatarGroup | [8](#8-avatar) |
| Badge | [3](#3-badge) |
| BottomSheet | [17](#17-bottomsheet) |
| Breadcrumb | [31](#31-breadcrumb) |
| Button | [1](#1-button) |
| Checkbox | [12](#12-checkbox) |
| CheckboxField | [12](#12-checkbox) |
| Chip | [9](#9-chip) |
| ChipGroup | [9](#9-chip) |
| CircularProgressIndicator | [20](#20-circularprogressindicator) |
| CounterBadge | [29](#29-counterbadge) |
| Divider | [5](#5-divider) |
| Icon | [6](#6-icon) |
| IconButton | [2](#2-iconbutton) |
| IconContained | [7](#7-iconcontained) |
| Image | [4](#4-image) |
| IndicatorBadge | [29](#29-counterbadge) |
| Input *(internal)* | [10](#10-inputfield) |
| InputField | [10](#10-inputfield) |
| InputText *(internal)* | [10](#10-inputfield) |
| LinearProgressIndicator | [19](#19-linearprogressindicator) |
| Logo | [15](#15-logo) |
| Mockup | [33](#33-mockup) |
| Modal | [18](#18-modal) |
| Pagination | [28](#28-pagination) |
| PaginationDots | [28](#28-pagination) |
| Popover | [25](#25-popover) |
| ProductLogo | [15](#15-logo) |
| Radio | [13](#13-radio) |
| RadioField | [13](#13-radio) |
| Scrim | [14](#14-scrim) |
| Segmented Control | [21](#21-segmented-control) |
| Segmented control - slot *(internal)* | [21](#21-segmented-control) |
| SelectableButton | [1](#1-button) |
| SelectableIconButton | [2](#2-iconbutton) |
| SelectableSingleTextButton | [35](#35-singletextbutton) |
| SideSheet | [17](#17-bottomsheet) |
| SingleTextButton | [35](#35-singletextbutton) |
| Slider | [26](#26-slider) |
| Spinner | [27](#27-spinner) |
| Status Bar | [30](#30-status-bar) |
| Stepper | [16](#16-stepper) |
| Switch | [11](#11-switch) |
| Timer | [32](#32-timer) |
| Toast | [23](#23-toast) |
| Tooltip | [24](#24-tooltip) |
| TouchSlider | [26](#26-slider) |
