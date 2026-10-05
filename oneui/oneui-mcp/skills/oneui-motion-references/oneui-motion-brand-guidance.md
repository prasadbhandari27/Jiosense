# Motion — Brand Guidance

Universal motion principles for any brand under the parent umbrella, including Jio. These are defaults with reasoning, not hard mandates — a brand can adapt them, but should be able to explain why if it departs.

Jio itself follows these **and** the stricter, non-negotiable layer in [`jio-motion-rules.md`](jio-motion-rules.md). Where the two conflict, `jio-motion-rules.md` wins for Jio.

## Should it animate, and how much?

Match motion to how often a user sees it. The more often something is seen, the less it should move — a component seen constantly should stay close to still, so it never gets in the way of the tens or hundreds of times someone passes it in a day.

**Every brand uses the same five frequency bands.** What's brand-specific is which properties each bucket allows, and which components a brand's own components land in — never the bands themselves.

| Bucket | How often |
|---|---|
| 1 | 100+ times a day — seen constantly, all day |
| 2 | Highly frequent — seen constantly, many appear together |
| 3 | Less frequent — seen often, but only a few appear together |
| 4 | Occasional — seen now and then, not on every screen |
| 5 | Rare / first-time — seen once in a while, or once ever |

You place the **component or pattern as a whole**, not a sub-part — if a component mixes small and large motion, it takes the bucket of its most visible animation.

**Bucket 2 vs 3:** is the instance count on screen fixed by the designer, or decided by data? Decided by data (can grow unbounded) → bucket 2. Fixed and small → bucket 3. If unclear: packed tightly against each other → bucket 2; separated by other content → bucket 3. This test only works for things you can count on screen — for a gesture like scroll, there's nothing to count, judge it by how often it happens instead.

**Bucket 3 vs 4:** same properties, different size — bucket 4 travels farther, scales more, and isn't hidden behind opacity alone.

A component's bucket is judged by its own actual usage frequency, not looked up by name — the same component type can land differently across apps or brands. Jio's own property allowlist and worked examples: `jio-motion-rules.md`.

## What's the purpose?

Name the reason before animating. If none applies, don't animate. Six recognized reasons:

- **Spatial consistency** — enters and exits the same way, so the dismiss gesture feels obvious.
- **State indication** — shows something changed.
- **Onboarding / explanation** — teaches how a feature works; the user watches.
- **Feedback** — confirms the system heard the user.
- **Preventing a jarring change** — a transition instead of a snap.
- **Anticipation / delight** — invites interaction or rewards a rare moment. Reserve for infrequent, high-value moments — it wears out fast on anything seen often.

"It looks good" on its own is not a purpose.

## Motion levels

Three levels, this exact structure, universal for every brand:

- **Moderate** — the default. Buckets 1–4 all use Moderate.
- **Bold** — bucket 5 only. Rare, expressive, full choreography — earns its weight by how seldom it's seen.
- **Subtle** — never chosen by hand. It's the automatic remap under `prefers-reduced-motion: reduce`. Scale, position and rotation are removed; opacity and colour stay, using the Subtle-tier values.

A brand doesn't invent its own tier system — it supplies its own values for Subtle/Moderate/Bold inside this structure, the same as it supplies its own base duration inside the fixed derivation method below.

## Timing

Never write a raw duration or a raw easing curve — use the tokens, so the whole scale can be swapped by changing one number. The values below are Jio's defaults — every brand starts here and can edit **the base duration** and **the easing curves**. The scale ratio and the derivation method are fixed for every brand; only the numbers going in differ.

**Duration scale.** One number in, eight steps out:

- **Base** (editable) — Moderate L = **300ms** by default.
- **Scale ratio** (fixed, universal) — **1.5×** between adjacent steps.
- Every other Moderate step derives from the base: one step up = base × 1.5, one step down = base ÷ 1.5, repeated outward from L in both directions (M, S, XS, 2XS below; XL, 2XL, 3XL above). Round each result to the nearest 5ms.
- **Subtle's base is Moderate's M step** (base ÷ 1.5), not a separate number — the same ×/÷1.5 derivation then runs again from there to produce Subtle's own eight steps.
- **Offsets** (stagger/delay) derive from the duration scale too, shifted three steps down: Offset-L = Duration-XS, Offset-XL = Duration-M, Offset-2XL = Duration-XL, Offset-3XL = Duration-3XL. Offset-M and Offset-S continue below 2XS by the same ×/÷1.5 rule.

Change the base, and every one of these numbers moves with it — that's the entire point of deriving from one number instead of hand-tuning each token.

**Easing curves.** Five types. Pick by **whether the user can see where the movement starts and ends**: can't see the start → decelerate in (Entrance); can't see the end → accelerate out (Exit); can see both, or more than one element moves together → ease through the middle (Transition); a gesture hits a hard limit → overshoot (Bounce); constant motion → no acceleration at all (Linear). That selection logic is universal. Default curves below — every brand starts here, edits per type:

| Type | Default curve (Moderate) | Default curve (Subtle) |
|---|---|---|
| Entrance | `cubic-bezier(0.25, 0.8, 0.5, 1)` | `cubic-bezier(0.2, 0.3, 0.5, 0.9)` |
| Exit | `cubic-bezier(0.7, 0.1, 0.9, 0.7)` | `cubic-bezier(0.5, 0.1, 1, 1)` |
| Transition | `cubic-bezier(0.5, 0, 0.3, 1)` | `cubic-bezier(0.4, 0, 0.5, 1)` |
| Bounce | `cubic-bezier(0.2, 1.4, 0.3, 1)` | `cubic-bezier(0.4, 0, 0.5, 1)` |
| Linear | `linear` | `linear` |

**Bounce can be replaced entirely, not just re-curved.** If a curve alone doesn't give the feel a brand needs, Bounce can be swapped for a different mechanism — a CSS spring approximation (`linear()`), for instance. Every other type stays a cubic-bezier.

- Entry and exit are a pair — whatever direction something enters from, it leaves the same way.
- Exits are shorter and simpler than entries — the user already made their choice; getting out of the way doesn't need to explain itself.
- Bigger changes take longer. Duration should scale with how far something travels, how much it grows or shrinks, and how many elements move together.

## The rules

- **Never let something appear to grow out of nothing.** Scaling from zero is fine only if opacity also starts at zero, hiding the moment it appears from nothing. Larger elements should start closer to full size — the more of the screen something covers, the less distance it should visibly travel.
- **Anything the user can press should visibly respond.** A component that reacts to a pointer arriving but not to being pressed feels unfinished at exactly the moment that matters most.
- **Never animate every property that changes.** Name the exact properties being animated — an unbounded animation rule silently picks up properties nobody meant to animate, including layout properties that were never supposed to move.
- **Use a transition when a value moves from one state to another and stays there** (a press, a hover, a toggle) — transitions are interruptible, so reversing mid-motion looks natural. **Use keyframes when the animation has waypoints** — it turns, pauses, or loops. Keyframes restart from the beginning when re-triggered; that's correct for something like a pulse, not a bug. Replaying one is done by removing the class, forcing a reflow, and adding the class back — that's the normal technique, not a workaround. The one hard case is stopping a *looping* keyframe animation cleanly: it has no end value, so stopping it means reading where it currently is and starting from there.
- **Gate hover behind an actual pointer.** `@media (hover: hover) and (pointer: fine)` (or the platform's equivalent) — on a touch device, a tap counts as a hover with no way to "un-hover," so an ungated hover animation can get stuck.
- **Popovers enter from the trigger point that opened them, not their own center** — see `oneui-motion-patterns.md`'s `Position Entry/Exit`. Modals are the exception — nothing on screen opened them from a fixed point, so they stay centered.
- **Prefer declarative, predetermined animation (CSS/WAAPI-equivalent) over JavaScript.** Reach for JS only for what's genuinely interruptible or physics-driven (drag-following, real springs) or dynamic in a way the declarative layer can't express — and be able to say why before writing it.

## Accessibility floor

**WCAG 2.2 Level AA is the floor every brand should meet.** A brand can hold itself to a stricter target; none should fall below AA.

Honor `prefers-reduced-motion`. Removing motion under that preference is never itself a failure — what matters is whether the meaning survives without it:

- If the same information isn't available another way (a static layout, a label, a status role), that's a design bug — fix the design, don't answer it by leaving the animation running.
- If stopping the motion at its resting frame reads as broken, stuck, or inactive, the component owes a **designed reduced state** — a deliberate still pose, or a color/opacity channel that still reads as "in progress" without relying on movement.
- A well-authored "frame zero" — the first frame of any animation authored as its resting pose — means switching the animation off lands on a correct still image automatically.

Motion is essential (allowed to keep moving under reduced motion) only when removing it destroys real information and nothing static can replace it — a drag preview following the pointer, playback scrubbing, video content itself. "Work is in progress" almost never qualifies; it has a static/programmatic route (a designed indicator plus a status role).

Full essential-motion test and the A/B reduced-state checklist: the `oneui-motion-accessibility` skill.

## Cohesion & spatial consistency

- **Sub-animations within a component** typically share a timing feel by default (the pattern or design usually defines it), so it reads as one entity. Override this when it serves the purpose better — to make something more expressive, more visible, or to emphasize a change; the purpose + bucket decision already gates whether this motion should exist at all.
- **Exit direction matches entry direction.** Forward navigation = left; back = right. An expanded view travels from its source card.
- **Motion matches the component's personality.** A playful component can be bouncier; a dashboard stays crisp.
- **When a group animates together, stagger is varied by importance** — uniform stagger kills hierarchy and feels mechanical.

## Comparing options

When it's genuinely unclear which version is right, build a small number of named, real versions — never more than two or three — behind a reusable picker, and present them as a table of tradeoffs rather than picking a favorite. Every version still has to follow every other rule in this file; a version that breaks a rule to win the comparison isn't teaching anything.

Full workflow: the `oneui-motion-prototype` skill.
