# Motion — Jio Rules

Jio's motion system is deliberately strict: hard values, not defaults. This file assumes [`oneui-motion-brand-guidance.md`](oneui-motion-brand-guidance.md) as the floor and narrows every place that file leaves open. Where the two disagree, this file wins for Jio.

If you find yourself explaining around one of these rather than applying it, stop and ask — that's the point of writing them this way. Jio's motion is meant to leave no room for interpretation; that's a deliberate departure from how most skills are written, because Jio motion is a brand system, not general guidance.

Source of truth: `packages/shared/src/utils/motion.ts` in OneUiStudio.

## The five buckets

Uses the universal five-band structure and placement tests from `oneui-motion-brand-guidance.md` — not repeated here. What's Jio-specific is the property allowlist per bucket, and how Jio's own components currently land when run through the frequency test:

| Bucket | Motion allowed | Jio examples |
|---|---|---|
| 1 | None. Focus states are the only exception. | Accessibility interactions, keyboard shortcuts, command palettes |
| 2 | Colour and/or opacity only. | Chip, badge, avatar, breadcrumb, pagination, link button |
| 3 | Colour, opacity, scale, position, rotation — all small. | Button, icon button, switch, checkbox, radio, stepper, scroll, tooltip |
| 4 | Same properties as 3, but large and clearly visible. | Bottom sheet, bottom nav, pull/drag/pinch, spinner, tabs, anticipation |
| 5 | Most expressive motion, full choreography. | Success feedback, Hello Jio, milestones, celebrations, expressive microinteractions |

**These examples are worked output, not a lookup table.** They're what Jio's own components produced when run through `oneui-motion-brand-guidance.md`'s frequency test — they don't transfer to other brands, and even within Jio, a component whose real usage differs from the example is re-judged by the test, not assumed from this table.

**This table says what properties a bucket allows — never which Tap sub-pattern an example uses.** Bucket 3's list mixes two different things: icon button, switch, checkbox, and radio are bare marks — no label of their own — so they use **Scale Up** (`jio-motion-rules.md`'s "Exact scale percentages" below), never Scale Down. Only a component that actually holds content (a labelled Button, for instance) is a Scale Down candidate. Don't read "in bucket 3" as "uses Scale Down" — check whether the component is a bare mark or holds content first.

Motion level: buckets 1–4 → **Moderate**. Bucket 5 → **Bold**. **Subtle** is never chosen by hand — it's the automatic `prefers-reduced-motion: reduce` remap.

## Purpose — Jio's two extra distinctions

Onboarding and Anticipation are different reasons, not one: in Onboarding the user only watches; in Anticipation the user is being asked to do something.

**Anticipation has a hard limit** — bucket 4 or 5 only, and only when the reward is high (exploration, discovery). Never on frequent interactions.

## The token scale

Base: Moderate L = **300ms**. Scale ratio: **1.5×** between adjacent steps. Subtle base = Moderate M (base ÷ 1.5). Never write a raw `cubic-bezier()` or a raw millisecond value — always the token, because the token is what remaps under reduced motion.

**Always write the `-Moderate` token, never `-Subtle`.** Jio swaps it for you under `prefers-reduced-motion: reduce` — hand-picking the Subtle token yourself is never correct, even for a component you know will run reduced.

**Pick the step by how big the change is** — how far something moves, how much it grows or shrinks, how far it rotates, or how many elements are involved. The bigger the change, the longer the duration.

| Step | Moderate | Subtle | Use it for | Example |
|---|---:|---:|---|---|
| 2XS | 60ms | 40ms | Rare — only as a supporting part inside a larger choreography | — |
| XS | 90ms | 60ms | Rare — only as a supporting part inside a larger choreography | — |
| S | 135ms | 90ms | Rare — only as a supporting part inside a larger choreography | — |
| M | 200ms | 135ms | Small changes | A hover. A tap. A button scaling down. |
| **L** | **300ms** | **200ms** | **The default** | A chat input growing taller when media or a voice note is added |
| XL | 450ms | 300ms | Larger changes | A bottom sheet coming up. A carousel moving. |
| 2XL | 675ms | 450ms | Larger still | A carousel moving edge to edge on desktop |
| 3XL | 1015ms | 675ms | Extremely large changes and long choreographies | The staggered pulse across a skeleton group |

**L is the default — start there and only move up or down if the size of the change tells you to.** 2XS, XS and S are used rarely, only as a supporting part inside a larger choreography, never on their own.

**Stagger, offset, and delay always use the offset scale below, never the duration scale above — whichever word is used.** The two scales share the same step names (L, M, XL...) at different values (Duration-L is 300ms; Offset-L is 90ms) — reaching for "L" without checking which scale you're in silently grabs the wrong number. Any time a spec says a component moves *after* another one, or waits before it starts, or staggers across a list, that wait is `--Motion-Offset-*`, never `--Motion-Duration-*`.

**The longer the list, the shorter the offset.** Total stagger time is item count × offset, so a long list with a long offset drags on; shortening the offset keeps the whole sequence quick.

| Step | Token | Moderate | Subtle | Use it for |
|---|---|---:|---:|---|
| XL | `--Motion-Offset-XL` | 200ms | 135ms | A heavily pronounced stagger, each item clearly separated |
| L | `--Motion-Offset-L` | 90ms | 60ms | The default |
| M | `--Motion-Offset-M` | 40ms | 25ms | A much longer set of staggered items, such as a long list |
| S | `--Motion-Offset-S` | 25ms | 15ms | Longer still. Rarely used. |

2XL (450ms Moderate / 300ms Subtle) and 3XL (1015ms Moderate / 675ms Subtle) are delays, not staggers — use them to hold something back before it starts, not to space items apart. Almost never used; they exist to complete the scale.

Non-canonical tokens that don't exist and must never appear: `--Motion-Duration-Discreet-*`, `--Motion-Duration-Expressive-*`, `--Motion-Easing-Standard`, `--Motion-Easing-Emphasized`.

**Easing per property, not per component.** One instance can move for more than one reason over its lifetime — assign easing per property based on why *that* property moves, never one curve for the whole transition rule. If properties can't be split cleanly, stop and ask; never downgrade Entrance to Transition because the CSS is awkward.

**The one exception:** a drag gesture uses Entrance even though it can see where it starts — it follows the pointer in a straight line, then settles, so there's no lag or snap at the start.

## Exact scale percentages

**Within bucket 3, pick by what the component IS.** A bare mark with no label of its own (icon, icon button, checkbox, radio, switch knob, tab icon) is Scale Up, never Scale Down. Scale Down is only for bucket-3 components that hold their own content (a labelled Button, for instance).

**Scale down (things that hold content):**

| Component size | Scale down by |
|---|---|
| XS | 7% |
| S, M, L, XL | 3% |
| Full width | 1% |

**Scale up 7%** — the mark itself, with no label of its own: icon, icon button, checkbox, radio, the knob in a switch, the icon in a tab item. Scale the control only, never its label or container.

**Hover scale up: 5%**, small cards at L (300ms), large cards at XL (450ms) — "up one size in the duration scale." **Section cards only** — a card that navigates to another page/section. Not product cards (e.g. e-commerce listings); those don't get this.

**The crowding exception:** if several marks would animate close together in a small space, drop the scale — this is why the plus/minus in a stepper don't scale up despite being icon buttons.

**Starting scale, by size, when scaling from near-zero (always paired with opacity from 0):**

| Size | Enters from | Example |
|---|---|---|
| Small | 0% | An icon switch |
| Medium | 50% | A chat bubble |
| Large | 90% | A modal |

## Patterns

Jio's full interaction and transition pattern catalog lives in [`oneui-motion-patterns.md`](oneui-motion-patterns.md) in this folder — not duplicated here since it changes independently of these rules. Multibrand pattern guidance doesn't exist yet; today the pattern catalog is Jio-only.

## CSS-only

**Motion in Jio is CSS. Never reach for JavaScript on your own.** If an animation seems to need it, stop and ask before writing any — say which part CSS can't express and why, then wait. If someone asks for JS, it still needs solid reasoning and proof it can't be done another way; being asked isn't the same as it being justified.

Almost everything that looks like it needs JS doesn't — a there-and-back move is keyframes, a value that follows the user's finger is a CSS custom property written from an event handler (the animation itself is still CSS), a sequence that pauses partway through is keyframes with a hold.

## Hover — Jio's stakes are higher

Most Jio users are on phones, so hover is the exception, not the norm. Anything put behind hover is invisible to the majority of users — never let it carry information that isn't available another way.

## Accessibility — Jio's exact remap

Jio targets WCAG 2.2 Level AA — no exceptions, this is the floor from `oneui-motion-brand-guidance.md` with nothing raised on top of it.

Under `prefers-reduced-motion: reduce`, motion becomes **Subtle**:

- Scale, position and rotation are **removed entirely** — not made smaller, taken out.
- Opacity and colour stay, using the Subtle tokens.

This remap is automatic for duration/offset/easing tokens, but **removing `transform` is not automatic** — nothing in the token system does that for you. It's yours to apply by hand, in every component, every time. A component can use only tokens, pass lint, and still slide across the screen for someone who asked for no motion. The only way to catch it is turning the preference on and watching.

**Author frame zero as the resting pose**, so switching an animation off lands on the correct still image with no separate work. An element frozen mid-gesture — half rotated, half travelled — reads as broken, not still.

Full essential-motion test and the A/B reduced-state checklist: the `oneui-motion-accessibility` skill (shared with `oneui-motion-review`).

## Final pass

Three quality-check philosophies, run at the end — after a component is built, before calling it done. Jio-specific, not universal.

- **Continuity** — does movement connect every change, whether an element morphs or a scene transforms from one state to another? Motion should read as one continuous thread, not disconnected snaps.
- **Simplicity** — does the motion stay clear, with supporting elements minimal so nothing competes for attention? This is also where **"is the whole screen too busy"** belongs — the buckets judge one component at a time, so five components can each be individually correct and the screen still be too much. A single-diff review can only judge what's in front of it; a true whole-screen busyness check needs `oneui-motion-improve`'s wider view across everything on screen at once.
- **Stability** — no blinking, instant snaps, or broken-looking motion, and no bounce outside a legitimate overshoot moment (a gesture hitting a hard limit it can't go past). Every movement should feel smooth, steady and controlled, so the interface always reads as working the way it should.

## Comparing versions — Jio's picker spec

The workflow itself (build 2–3 named versions, present a table, don't pick a favourite) is universal — see `oneui-motion-brand-guidance.md`. Jio's picker has one fixed, reused visual spec:

**Appearance** — a floating bar, centred at the bottom, above everything else.

| Part | Token |
|---|---|
| Bar background | `--Neutral-Bold` |
| Active label | `--Neutral-Bold-High` |
| Inactive labels | `--Neutral-Bold-Medium` |
| Corner radius | `--Shape-Pill` |
| Padding and gaps | The spacing scale |

Move it to the top if a version occupies the bottom of the screen. Change nothing else.

**Behaviour** — one button per version, exactly one active; number keys and left/right arrows switch (ignored while focus is in a text field); a replay button and the `R` key (entrances play once, so without replay comparing is nearly useless); switching re-mounts the version so entrances replay from the start; the current version is held in the URL.

Full detail: the `oneui-motion-prototype` skill.
