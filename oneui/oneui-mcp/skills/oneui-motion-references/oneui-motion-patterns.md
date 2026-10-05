# Motion — Jio Pattern Catalog

Patterns already solved for you — use them instead of building your own whenever one applies. Take **all** the patterns that apply to a component; a button has Tap, Hover, Focus, Disable, and Loading at once.

**Tap and Hover go together.** If a component responds to a pointer arriving, it must also respond to being pressed — leaving Tap out makes the component feel unresponsive at exactly the moment that matters most.

**Surface Colour is the floor, not an option.** Any component with a tap or hover interaction at all gets Surface Colour — it's the universal baseline for both patterns, never something to skip. Whatever else the bucket allows (Scale Down, Scale Up, Transform (Anticipation), and so on) layers on top of Surface Colour, never instead of it.

**The bucket decides which sub-patterns you may use.** The pattern says what's available; the bucket (from [`jio-motion-rules.md`](jio-motion-rules.md)) says which parts of it you're allowed. A chip is bucket 2, so it gets Tap's Surface Colour only — Scale Down is not allowed. A button is bucket 3, so it gets Tap's Surface Colour and Scale Down.

Multibrand pattern guidance doesn't exist yet — this catalog is Jio-only for now.

## How to read a pattern

A pattern spec is a recipe, not a literal CSS block. Every property in the tables below is a duration **step** (L, XL, etc.) or an easing **type** (Transition, Entrance, etc.) — never a raw ms value or `cubic-bezier()`. Jio resolves these steps to specific values via its own motion scale; another brand could resolve the same steps differently and the recipe would still be valid.

```
Stack:
  enter: XL × Entrance Moderate
  exit:  L  × Exit Moderate
  scrim: 50% black over Screen A
```

That's the entire pattern. The implementation is whatever achieves it using tokens.

## Interaction patterns

What a component does when the user touches it.

### Tap

| Sub-pattern | Duration | Easing | Detail |
|---|---|---|---|
| Surface Colour | M (200ms) | Transition | `background-color` shifts to the pressed token |
| Scale Down | M (200ms) | Transition | Press shrinks the component — see the size table in `jio-motion-rules.md`. Interruptible; release triggers touch-up. |
| Scale Up | M (200ms) | Transition | Press enlarges small controls (icons, checkboxes) by 7%. Interruptible. |
| Expand/Collapse Tap | L (300ms) or XL (450ms) | Transition Moderate | `height` (0 ↔ content height) on an accordion item's panel, **self-triggered** — the tap that opens/closes it lands on the component itself (the accordion header). **Fully specified, shipped** — taken from `Accordion.module.css` / `AccordionPanel.tsx`. Duration is content-dependent: panels with more than 5 lines of content use XL, everything else uses L (`AccordionPanel.tsx`'s `LONG_CONTENT_LINE_THRESHOLD`). See `Expand Entry/Exit` under Transition patterns for the externally-triggered equivalent (e.g. a menu opened by a separate trigger). |

### Hover

| Sub-pattern | Duration | Easing | Detail |
|---|---|---|---|
| Surface Colour | M (200ms) | Transition | `background-color` shifts to the hover token |
| Scale Up | L small / XL large | Transition | Card grows 5% on hover. **Section cards only** — a card that navigates to another page/section. Not product cards (e.g. e-commerce listings). |
| Transform (Anticipation) | See below | See below | Hovering one end of a row contracts every fully-visible item on that side; the partly-visible item there slides closer. **Fully specified** — see below. |
| Reveal | See below | See below | A stacked group reveals its full contents on hover, collapses on mouse out. **When to use it** — a stack where lower items sit behind the first, or where stacked items are hidden. Toast stack is the only shipped use case so far, but this generalizes to any stack matching that shape. **Fully specified** — see below. **Governs the stack's collapsed/expanded presentation only** — not how individual items enter or exit; see `Stack (Group)` (Transition patterns) for that. Both apply together to the same toast stack. |

#### Transform (Anticipation) — full spec

**What's needed** — a row of same-size items, where more than one can be fully visible at once, with at most one partly-visible item peeking at each end.

**Trigger**
- Hovering the ~35% strip nearest either end of the row reacts.
- Only one end reacts at a time. Everything on the *opposite* end — every item there — never moves.

**Motion**

| Property | Value |
|---|---|
| Every fully-visible item | Contracts by 3% (width), independently, XL (450ms), Transition |
| Position of each fully-visible item | Cascades — each one carries forward the contraction of every item between it and the untouched far end, so every gap along the chain stays constant |
| Partly-visible item on the reacting end | Slides over by the *sum* of every fully-visible item's contraction — same size, position only, no resize — XL (450ms), Transition |
| Everything on the opposite end | Untouched — not referenced by any rule, so it cannot move |

#### Reveal — full spec

**What each item needs to know** — three things, regardless of what library or code sets them:
1. Its **position** in the stack (1st, 2nd, 3rd...)
2. Whether it's **beyond the visible limit** — position 3 or lower (0-indexed: front + 2 behind peek; the 4th item and beyond are hidden until the stack expands)
3. Whether the stack is currently **expanded** (hovered or not)

**Trigger**
- Pointer enters the stack → expand immediately, no delay.
- Pointer leaves the stack → wait `Motion-Offset-XL` (200ms) before collapsing, so briefly moving off the stack doesn't snap it shut.

**Motion**

| Property | Value |
|---|---|
| Position (collapsed → expanded list) | `transform`, L (300ms), Transition |
| Opacity (items beyond the visible limit, becoming visible) | M (200ms), Transition |
| Front item's content fade (title/description etc.) | M (200ms), Transition |
| Collapsed peek state (not hovered) | Each item behind the front sits one scale-step smaller (**4% per position** — `--Toast-Stack-Scale-Step: 0.04`) and offset by its position (**8px per position** — `--Toast-Stack-Offset`, resolves to `--Spacing-2` / `--Dimension-2`); `transform` L (300ms) Transition, `opacity` M (200ms) Transition. **`transform-origin` is horizontally centered, vertically anchored to whichever edge the stack itself is anchored to** (`center bottom` for a bottom-anchored stack, `center top` for top-anchored) — never a corner. A corner origin scales asymmetrically and reads as an X-axis shift even though the only position change is Y-axis (the peek offset). **Fully specified, shipped** — taken from `Toast.module.css` / `primitives.css` / `Toast.tokens.ts`. |

### Long Press

**One pattern, two phases** — not two sub-patterns to pick between; both happen, in sequence, on every long press. M (200ms), Transition throughout.

1. **Surface Colour** — fires immediately on press. Background tint, acknowledging the item is interactive.
2. **Scale Down** — fires after holding for `Motion-Offset-2XL` (450ms). That's the point at which the press is recognized as a long press. Scales down 3%, on top of the surface tint already showing.

### Disable

**Universal, regardless of bucket** — most interactive components have a disabled state, so this applies across the board, the same way Focus Ring does.

| Sub-pattern | Duration | Easing | Detail |
|---|---|---|---|
| Opacity | M (200ms) | Transition | Fade to 30% opacity |

### Focus

**Focus Ring** — L (300ms), Transition. Stroke 0 → 2px, scale +2px to focus state. Maps to the component's focus variable.

### Loading

Component-level loading state — a user-initiated action is processing (e.g. a submit button becomes a spinner while its request is in flight). Distinct from `Skeleton` (Transition patterns): a structural placeholder shown before content loads, not tied to a user action.

**Icon to circular progress indicator** — **Fully specified.** Use when the component's content is only an icon mark switching to loading. Same recipe as `Content Swap`'s **Icon to icon**, applied to this specific case.

| Property | Value |
|---|---|
| Trigger | Tap (release, i.e. `pointerup` — not press) |
| Outgoing icon | Scale 100% → 0%, L (300ms) Transition, simultaneous with opacity 100% → 0%, M (200ms) Transition |
| Offset | `Motion-Offset-L` (90ms) — delay before the incoming indicator starts, measured from the tap |
| Incoming circular progress indicator | Scale 0% → 100%, L (300ms) Transition, simultaneous with opacity 0% → 100%, M (200ms) Transition |

**Text to circular progress indicator** — **Fully specified.** Use when the component's content is text (or other non-icon content) switching to loading. Same recipe as `Content Swap`'s **Text to icon**, applied to this specific case.

| Property | Value |
|---|---|
| Trigger | Tap (release, i.e. `pointerup` — not press) |
| Outgoing text | Scale 100% → 70%, L (300ms) Transition, simultaneous with opacity 100% → 0%, M (200ms) Transition |
| Offset | `Motion-Offset-L` (90ms) — delay before the incoming indicator starts, measured from the tap |
| Incoming circular progress indicator | Scale 70% → 100%, L (300ms) Transition, simultaneous with opacity 0% → 100%, M (200ms) Transition |

## Transition patterns

How views and layouts move. Pick by what the user is doing.

| Pattern | When to use it |
|---|---|
| **Forward** | Moving deeper into a journey, one step at a time. Drill-down navigation — each new screen displaces the previous one as the main focus. |
| **Replace** | One screen swaps for another with no movement in between. Each screen stands on its own. Bottom navigation. |
| **Stack** | A temporary view comes in on top of the current one instead of replacing it — a quick action completed before carrying on. Two kinds, below. |
| **Displace** | The transition for an inline side-sheet. |
| **Slide** | Lateral navigation — moving sideways between things at the same level. Three kinds, below. |
| **Transform** | Expressive, continuity-preserving transitions — a component opens and becomes its expanded state. Use for revealing more information. Two kinds, below. |
| **Skeleton** | Loading. |
| **Content Swap** | Swapping between two pieces of content in the same place, not a full screen or view. Two kinds, below. |
| **Content Entry/Exit** | Content appearing in or leaving a container — not a full screen, not Content Swap. Content within containers such as accordions or dropdowns. Two kinds, below. |
| **Expand Entry/Exit** | A no-tip anchored container (e.g. a menu) growing open or closing, triggered **externally** — not a tap on the component itself. Contrast with `Expand/Collapse Tap` (Interaction patterns, self-triggered) and `Position Entry/Exit` (tip-anchored components like tooltip/popover). |
| **Scaling Entry/Exit** | A component scales in as it appears, scales out as it leaves. Two kinds, below, by trigger point. |
| **Position Entry/Exit** | A component slides a short distance into its final position as it appears, and back out as it leaves. Used for tooltip, popover. |

**Note on naming:** the shipped `motion.ts` still calls Replace "Top Level" and Slide "Lateral" — those are the older names. This catalog uses the current, correct names; the code hasn't been renamed to match yet.

### Full specs

**Forward**

| Property | Value |
|---|---|
| Duration | XL (450ms), Transition |
| What animates | Position only — **no opacity**. Neither screen fades; the incoming screen covers the outgoing one. |
| Travel | Outgoing screen slides left 30%; incoming slides in fully (100%) from the right |
| Direction | Going forward, the incoming screen arrives from the right. **Going back reverses it** — the screen you return to comes back in from the left. |
| Scrim | Black over the outgoing screen. Opacity animates **0% → 50%** on the way in, and **50% → 0%** on the way out. **Inherits the screens' own duration and easing** — XL (450ms), Transition. |

**RTL mirrors.** The travel directions above describe left-to-right reading. In a right-to-left locale the whole thing flips: forward brings the incoming screen in from the **left**, the outgoing screen slides **right** 30%, and going back reverses that. Forward/back is a reading-order concept, so it follows the reading direction rather than staying physically fixed.

**Replace**

| Property | Value |
|---|---|
| Duration | S (135ms), Transition |
| Offset | L (90ms) — delay before the incoming screen fades in |
| Extras | Outgoing screen fades out, then incoming fades in after the offset |

**Skeleton**

A **structural layout placeholder shown before content loads** — not a response to a user-initiated action on a specific component. Distinct from Interaction `Loading`, which is a component's own loading state (e.g. a submit button becoming a spinner).

**Keyframes, not a transition** — this is the one looping pattern in the catalog. It runs continuously while content is loading, rather than playing once on a state change.

| Property | Value |
|---|---|
| Duration | 3XL (1015ms), Transition |
| Loop | Infinite, alternating — the pulse runs base → highlight, then plays back in reverse to base, and repeats. That return leg is the alternate direction, not a second keyframe. |
| What animates | `background-color` only — base (`Neutral-Moderate`) ↔ highlight (`Neutral-Minimal`) |
| Stagger | `Motion-Offset-L` (90ms) between elements, applied as an animation delay per item |
| Long groups | The stagger index wraps every 40 items, so item 41 restarts the wave rather than flattening to zero delay — the ripple stays visible in long lists instead of degrading into everything pulsing in unison |

### The two kinds of Stack

1. **Stack (Full Screen)** — a drawer stacks on top of the current view. **When to use it** — profile page entry from the home screen (mobile). Also used on tablet/desktop as a temporary sheet over the page. Whatever would use `Displace` on tablet/desktop collapses into this on mobile instead — `Displace`'s inline mechanism doesn't fit a mobile screen. **Fully specified, shipped.**

   | Property | Value |
   |---|---|
   | What animates | The drawer's **position only**. The drawer itself never changes opacity — only the scrim does. |
   | Enter | Slides in from **fully off-screen**, XL (450ms), Entrance |
   | Exit | Slides back off-screen, L (300ms), Exit |
   | Direction | The edge its **trigger** sits on — a left-side trigger enters from the left, a right-side trigger from the right. Exit mirrors entry. |
   | Scrim | Black over the content behind. Opacity animates **0% → 50%** as the drawer enters, and **50% → 0%** as it leaves. **Inherits the drawer's own timings** — XL (450ms) Entrance in, L (300ms) Exit out. |
   | Bounds | Covers **the container it sits in**, not necessarily the full viewport. |

2. **Stack (Group)** — a group of same-kind items stacks together in place, e.g. a notification stack. **Fully specified.** **Governs entry/exit/reflow only** — not whether the stack starts collapsed or expanded on hover; see `Reveal` (Interaction patterns > Hover) for that. Both apply together to the same toast stack.

   **Entry and exit always share the same edge and direction.** An item can enter from six positions — top-start, top-center, top-end, bottom-start, bottom-center, bottom-end — and whichever one it enters from, it exits back the same way.

   | Property | Value |
   |---|---|
   | Enter | Slides in from its edge (distance = 150% of the item's own size), L (300ms) Entrance, simultaneous with opacity 0% → 100%, M (200ms) Entrance |
   | Multiple items entering together | No stagger — they all animate at the same time |
   | Reflow (other items shifting position/scale as the group changes) | `transform`, L (300ms) Transition — runs continuously in the background, so it fires automatically whenever an item's position in the stack changes |
   | Exit | Slides out the same edge and direction it entered from, simultaneous with opacity 100% → 0%, both M (200ms) Exit |
   | Multiple items dismissed together | Staggered — each next item's exit is delayed by its position in the group × `Motion-Offset-M` (40ms), so they close in a quick ripple, not all at once. **Dismissal is only ever all-at-once or one-at-a-time — never a partial subset** — so this row and `While an item is exiting` (below) never both apply at the same moment: an all-dismiss empties the stack (nothing left to reflow), and a one-at-a-time dismiss never triggers this row's stagger. |
   | While an item is exiting | The rest of the group waits `Motion-Offset-M` (40ms) — a stagger, not simultaneous with the dismissed item's own exit — before repositioning, so dismissing doesn't add visual noise on top of it. Reflow itself still uses its own `transform`, L (300ms) Transition (above) once it starts. |
   | Swipe-to-dismiss | Dragging an item past the same 150%-of-its-size distance triggers the same exit, but follows the drag direction instead of the item's fixed entry edge |

### The three kinds of Slide

1. **Tabs** — moving between tabs. **Fully specified, shipped.**

   | Property | Value |
   |---|---|
   | Slide duration | XL (450ms), Transition — both cards move 30% |
   | Direction | Opposite the tab you moved toward. Tapping a tab to the **right** moves the cards **left**; tapping a tab to the **left** moves them **right**. |
   | Fade out | S (135ms), Transition — outgoing tab, from the start |
   | Offset | L (90ms) — delay before the incoming tab fades in |
   | Fade in | M (200ms), Transition — incoming tab |

2. **Card rail or carousel** — moving through a row of cards. **When to use it** — card rail or carousel items (self-descriptive from the name). **Open — not yet specified.** `oneui-motion-build`'s duration guidance hints this sits around XL (450ms), by analogy with "a carousel moving," but the choreography (what slides, what fades, any scale) hasn't been decided. Needs a decision before this line can be marked done. **No scrim** — Slide is lateral movement between things at the same level, so nothing is covered and there is nothing to darken (same as Tabs, which has none).

3. **Full bleed carousel** — edge to edge, like Apple TV. **When to use it** — the sliding item goes edge to edge (self-descriptive from the name). **Open — not yet specified.** The "2XL (675ms) — a carousel moving edge to edge on desktop" example points here, but as with Card rail, the actual choreography is undecided.

### The two kinds of Transform

1. **Transform to Modal** — a specific interaction: a tapped **card** continuously morphs into becoming the modal itself (shared-element transition), revealing more information about that card. **Not** the general case of a modal opening — for a standard modal with no originating element, use `Scaling Entry/Exit`'s "No trigger point" case instead. **Fully specified, shipped.**

   | Property | Value |
   |---|---|
   | Enter duration | XL (450ms), Transition |
   | Exit duration | L (300ms), Exit |
   | What animates | Position, size and radius, together — **no opacity**. One shape is continuously becoming another; it never fades. |
   | Origin | The triggering component itself. The card that was tapped *is* what morphs, so the motion starts from that card's own position and size. |
   | Scrim | Black, sitting **under the morphing component** — the component animates on top of it. Opacity animates **0% → 50%** as the modal opens, and **50% → 0%** as it closes. **Inherits the transform's own duration and easing** — XL (450ms) Transition in, L (300ms) Exit out. |

2. **Transform to Full Screen** — a component expands to become a full page. **Open — not yet specified.**

### Displace

The transition for an inline side sheet — a structural sibling of the content next to it, not an overlay. **When to use it** — side navigation on tablet or desktop only. On mobile, the equivalent becomes `Stack (Full Screen)` instead. **Fully specified.**

| Property | Value |
|---|---|
| Animated property | `margin` on the docked edge (left or right) — not `transform`, not `width`. Margin genuinely displaces the adjacent content as it moves; a transform would only move the panel, leaving the content static underneath it. |
| Slide | Full panel-width — `margin` 0 → `-width`, on the panel itself |
| Opening | `margin`, XL (450ms), Transition |
| Closing | `margin`, L (300ms), Transition |
| Direction | Entry and exit always use the same edge (left or right) |
| Requirements | Width must be a single readable value wherever it's set (panel's own width stays constant throughout — this is what keeps the header/body/footer inside it from reflowing). Container must clip overflow — the closed panel sits past the container's edge via negative margin. |

### The two kinds of Content Swap

Swapping between two pieces of content occupying the same place — not a screen transition, a same-spot content change.

**Interruptible.** A re-tap mid-swap retargets from wherever the motion currently is, rather than restarting from zero. If the re-tap lands during the offset window — before the incoming content has started — the pending incoming is **cancelled** and the outgoing reverses from its current state.

1. **Icon to icon** — e.g. a play icon swapping to a pause icon. **When to use it** — swapping one icon for another icon (self-descriptive from the name), for any reason, not just loading. Interaction `Loading`'s **Icon to circular progress indicator** uses this same recipe. **Fully specified.**

   | Property | Value |
   |---|---|
   | Trigger | Tap (release, i.e. `pointerup` — not press) |
   | Outgoing icon | Scale 100% → 0%, L (300ms) Transition, simultaneous with opacity 100% → 0%, M (200ms) Transition |
   | Offset | `Motion-Offset-L` (90ms) — delay before the incoming icon starts, measured from the tap |
   | Incoming icon | Scale 0% → 100%, L (300ms) Transition, simultaneous with opacity 0% → 100%, M (200ms) Transition |

2. **Text to icon** — e.g. a button's label swapping to its loading state. **When to use it** — swapping text/other content for an icon (self-descriptive from the name), for any reason, not just loading. Interaction `Loading`'s **Text to circular progress indicator** uses this same recipe. **Fully specified.**

   | Property | Value |
   |---|---|
   | Trigger | Tap (release, i.e. `pointerup` — not press) |
   | Outgoing content | Scale 100% → 70%, L (300ms) Transition, simultaneous with opacity 100% → 0%, M (200ms) Transition |
   | Offset | `Motion-Offset-L` (90ms) — delay before the incoming content starts, measured from the tap |
   | Incoming content | Scale 70% → 100%, L (300ms) Transition, simultaneous with opacity 0% → 100%, M (200ms) Transition |

### The two kinds of Content Entry/Exit

Content appearing in or leaving a container — not a full screen, not Content Swap. Used for content within containers such as accordions or dropdowns.

**This is directional, and the direction follows the container.** Content that expands *downwards* (an accordion panel, a dropdown) enters from **10px above** its final position and settles down into place; on collapse it goes back **up** the same 10px. The offset always points back toward where the content came from.

1. **Content block** — a single block, no stagger.

   | Property | Value |
   |---|---|
   | Offset | 10px default (flexible with reasoning) |
   | Enter | `translateY(-10px → 0)` — starts above, settles down — simultaneous with `opacity: 0 → 1`, L (300ms), Entrance |
   | Exit | `translateY(0 → -10px)` — back up the way it came — simultaneous with `opacity: 1 → 0`, L (300ms), Exit |

2. **List** — multiple items, per item, plus a stagger.

   | Property | Value |
   |---|---|
   | Offset | 10px default (same as above) |
   | Enter/Exit | `translateY` + `opacity`, same as Content block, L (300ms), Entrance (enter) / Exit (exit) |
   | Stagger | **Enter only.** `Motion-Offset-M` (40ms) default. Above 10 items, drop one level to `Motion-Offset-S` (25ms) — the offset scale's next step down (`jio-motion-rules.md`'s offset table: XL 200ms, L 90ms, M 40ms, S 25ms). On exit, all items animate out **simultaneously, no stagger** — every item's `translateY(0 → -10px)` + `opacity: 1 → 0` starts at the same moment. |

### The two kinds of Scaling Entry/Exit

A component scales in as it appears, scales out as it leaves.

**Base spec** — applies to both kinds:

| Property | Value |
|---|---|
| Enter | `scale(0.9 → 1)`, simultaneous with `opacity: 0 → 1`, L (300ms), Entrance |
| Exit | reverse — `scale(1 → 0.9)`, simultaneous with `opacity: 1 → 0`, M (200ms), Exit |

Differ only in trigger point (`transform-origin`):

1. **No trigger point** — e.g. a standard Modal with no originating on-screen element (opened by a toolbar action, not tied to any specific tapped item). Scales from center. Distinct from `Transform to Modal` (above), which is a different, specific interaction — a tapped card continuously morphing into becoming the modal itself, not a standard modal opening.
2. **Directional trigger point** — e.g. a chat bubble. Scales from a corner matching context: inbound scales from bottom-left, outbound scales from bottom-right.

### Position Entry/Exit

A component slides a short distance into its final position as it appears, and back out as it leaves. Used for tooltip, popover.

| Property | Value |
|---|---|
| Offset | 5px, direction depends on which side it's anchored to — always moves away from the trigger as it settles into place |
| Enter | `translate(offset → 0)`, simultaneous with `opacity: 0 → 1`, M (200ms), Entrance |
| Exit | reverse, M (200ms), Exit — same duration as enter, only the easing curve switches |

### Expand Entry/Exit

A no-tip anchored container (e.g. a menu) opening or closing, triggered **externally** — the interaction that opens/closes it happens outside the container itself. Distinct from `Expand/Collapse Tap` (Interaction patterns), which the component triggers on itself (an accordion header tapping its own panel), and from `Position Entry/Exit`, which is for tip-anchored components (tooltip, popover).

| Property | Value |
|---|---|
| What animates | `height` (0 ↔ content height), simultaneous with `opacity` (0 ↔ 1) |
| Height duration | L (300ms), always — not content-dependent. (Unlike `Expand/Collapse Tap`, which does scale its duration to content length — the two patterns don't share that rule.) |
| Opacity duration | M (200ms) |
| Enter | Height and opacity both animate 0 → their full value, Entrance easing |
| Exit | Height and opacity both animate back to 0, Exit easing |

**Composing with content inside the container.** `Expand Entry/Exit` animates the container only (its height and opacity) — it says nothing about the content inside. When that content is itself a list of discrete items (e.g. a Select menu's options), apply `Content Entry/Exit`'s **List** sub-pattern to those items on top of it: on enter, each option gets its own `translateY(-10px → 0)` + `opacity` entrance, staggered by `Motion-Offset-M` (40ms) — or `Motion-Offset-S` (25ms) above 10 items, per that sub-pattern's own rule. Both patterns start together at the same moment (t=0) — the container's height/opacity and the first item's entrance all begin simultaneously, not sequenced. On exit, the items have no stagger — every option animates out at the same moment, only the container's own `Expand Entry/Exit` closes on its own timing. The container's `overflow: hidden` naturally clips the items' motion to whatever height is currently revealed, so the two reads as one continuous motion rather than two separate beats.
