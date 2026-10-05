---
name: oneui-motion-build
description: Add motion to a Jio (or sibling-brand) design-system component or pattern — decide whether it should animate, how much, which easing/duration tokens, and which existing pattern to use. Use proactively whenever adding, building, implementing, or specifying UI motion for OneUiStudio components — buttons, chips, tabs, sheets, toasts, cards, carousels, spinners, page transitions. Triggers on — animate, animation, motion, add motion, motion spec, easing, duration, transition, keyframes, hover, tap, press, scale, bucket, frequency, purpose, entrance, exit, stagger, pattern, "how should this animate", "does this need motion", "add a transition". Does not review existing motion (use oneui-motion-review) and does not compare motion options (use oneui-motion-prototype).
metadata:
  short-description: Decide and specify motion for a Jio/OneUiStudio component
---

# Jio Motion — Build

Adds motion to a component or pattern without requiring motion-design knowledge. Work through Steps 1–5 in order — each step narrows the choice. Do not skip ahead.

**Which brand?** Always load `../oneui-motion-references/oneui-motion-brand-guidance.md` — its principles apply to every brand. If the component belongs to **Jio**, also load `../oneui-motion-references/jio-motion-rules.md`; its exact values are hard requirements and override `oneui-motion-brand-guidance.md` wherever the two differ. If the brand isn't stated and isn't obviously Jio, ask.

For reviewing motion that already exists, use `oneui-motion-review`. For deciding between two or three built options, use `oneui-motion-prototype`. For the accessibility pass in Step 5, `oneui-motion-accessibility` has the full test. If the right motion isn't obvious before you start — no clear pattern, an ambiguous purpose, a component that moves for more than one reason — use `oneui-motion-brief` first to settle it, then come back here to implement.

## Step 1 — Does it animate, and how much?

You place the **component or pattern as a whole** — not a Figma layer, not a sub-part. Tabs is one thing, not tab item / tab group / indicator separately. If a component mixes small and large motion, it takes the bucket of its most visible animation.

**The measure is frequency: how often will the user see this animation?**

The five frequency bands and how to place a component in one are universal — see `oneui-motion-brand-guidance.md`. What differs per brand is the property allowlist per bucket (Jio's: `jio-motion-rules.md`) and which components land where, judged by that brand's own actual usage, not looked up by name.

## Step 2 — What's the purpose?

Name the reason before you animate. If you can't name one, don't animate. The six valid reasons and Jio's two extra distinctions (Onboarding vs. Anticipation, and Anticipation's bucket-4/5-only limit) are covered in `oneui-motion-brand-guidance.md` and `jio-motion-rules.md` respectively.

## Step 3 — Which easing and duration?

Use this step when building your own animation because no existing pattern covers it — a product-specific component, or an entry pattern only your app needs.

Never write a raw `cubic-bezier()` or a raw millisecond value. Always the token. The derivation principle (one base, one scale ratio) is in `oneui-motion-brand-guidance.md`; Jio's exact base, ratio, and token names are in `jio-motion-rules.md`.

**Assign easing per property, not per component** — an instance may animate for more than one reason over its lifetime (see the toast example in `jio-motion-rules.md`).

## Step 4 — Which pattern?

Patterns are cases the design system has already solved. If one applies, use it instead of building your own — take all the patterns that apply (a button has Tap, Hover, Focus, Disable, and Loading at once).

The full interaction and transition pattern catalog is in `../oneui-motion-references/oneui-motion-patterns.md`. It's Jio-only today; multibrand pattern guidance doesn't exist yet.

**The bucket decides which sub-patterns you're allowed** — the pattern says what's available, the bucket says which parts of it apply. Always check the bucket before using a sub-pattern.

## Step 5 — The rules

Read `oneui-motion-brand-guidance.md`'s "The rules" section for the universal versions of these. Jio hard-pins several of them further — see `jio-motion-rules.md`:

- Never scale from zero visibly (paired starting-scale table by size)
- Anything pressable must react (exact scale percentages)
- Never `transition: all`
- Motion in Jio is CSS — never JavaScript without asking first (Jio-specific; other brands may reasonably choose a different stack, but should still prefer declarative/predetermined animation and justify any JS)
- Transitions vs. keyframes, by shape of the animation
- Hover gated behind an actual pointer
- Popovers enter from their trigger point, not their center — see `Position Entry/Exit` in `oneui-motion-patterns.md`

## Then: accessibility

Every animation needs a reduced-motion pass. Use the `oneui-motion-accessibility` skill for the essential-motion test and the full A/B checklist before considering the work done — this is not optional and not a separate phase to skip.
