---
name: oneui-motion-review
description: Reviews existing motion/animation code in a Jio or sibling-brand component against the Jio motion system — flags wrong buckets, undefined tokens, bad easing, broken entry/exit pairing, and accessibility gaps, then gives a block-or-approve verdict. Use only when explicitly asked to review, audit, or check motion/animation code — never as part of building or adding motion. Triggers on — review motion, review animation, audit motion, check this animation, motion review, is this motion correct, flag animation issues, motion code review.
disable-model-invocation: true
metadata:
  short-description: Review existing Jio/OneUiStudio motion code against the system's rules
---

# Jio Motion — Review

Reviews motion **in a diff or change** — a PR, a changeset, "did I just do this right." Auditing the existing codebase as a whole, independent of any diff, is `oneui-motion-improve`'s job — it applies the same flag list this skill uses, just at scale and unscoped to any change.

**Only invoke this when asked to review something.** Never run it as part of building an animation, and never review code nobody asked about — if asked how to animate something, use `oneui-motion-build` instead and stop there.

Start from the assumption that something needs changing. A pass is the result of checking, not the starting point.

**Before flagging accessibility**, run the `oneui-motion-accessibility` skill's A/B checklist and write both answers down — answer them before reading the component's existing reduced-motion CSS, or the existing code starts looking like the correct answer.

**Removing motion is never the failure.** A block that takes movement out under the OS preference is doing the right thing, spinners included. What's under review is what it leaves behind — whether the movement is genuinely gone, and whether what remains still carries the meaning.

**For Jio, also run the final pass** in `jio-motion-rules.md` — Continuity, Simplicity, Stability — before closing out. Jio-specific, not something to apply for other brands.

## What to check

Apply `../oneui-motion-references/oneui-motion-flag-list.md` to the diff. It's the shared violation list — also used by `oneui-motion-improve` at scale — and already handles the Jio/multibrand split, so nothing further to check here beyond loading it.

## Fix in this order

1. **Remove it** — wrong bucket, or no purpose can be named.
2. **Reduce it** — fewer properties, smaller movement, one duration step shorter.
3. **Fix the values** — replace raw numbers and undefined tokens with real ones.
4. **Fix the easing** — Entrance, Exit or Transition, based on whether start/end are visible.
5. **Fix the entry** — correct starting scale for the size, with opacity alongside it.
6. **Fix the shape** — transition where the value simply moves state to state; keyframes only where there are waypoints.
7. **Fix the pairing** — entry and exit in the same direction, exit one step shorter, Tap wherever Hover is.
8. **Fix accessibility** — movement removed under Subtle, hover gated, frame zero holding the resting pose, designed reduced state where owed.

## How to report it

Two parts, in this order.

**A table.** One row per issue, not a before/after list:

| Before | After | Why |
|---|---|---|
| `transition: all var(--Motion-Duration-M)` | `transition: background-color var(--Motion-Duration-M) var(--Motion-Easing-Transition-Moderate)` | Name the properties, so nothing animates by accident |
| `transform: scale(0)` | `transform: scale(0); opacity: 0` | Nothing may be seen growing out of nothing |
| `scale(1.03)` on a chip | Colour change only | Chips are bucket 2 — colour and opacity only |

**A verdict.** Group what's left by how much it matters, worst first, skipping empty groups: (1) motion that shouldn't exist, (2) motion that should be reduced, (3) values that don't work, (4) easing and duration, (5) entry/exit/pairing, (6) accessibility.

Close with **Changes needed** (anything in groups 1–3, or any accessibility item) or **Approved** (nothing in 1–3, easing/duration within scale, accessibility handled).

Always cite `file:line`.
