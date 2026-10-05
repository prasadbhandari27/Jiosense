---
name: oneui-motion-accessibility
description: Decides what a component's motion owes under prefers-reduced-motion — whether movement is essential, what the reduced state has to preserve, and how to test it. Use whenever building or reviewing motion that needs a reduced-motion pass, deciding if an animation is essential, judging whether a stopped animation reads as broken, or checking WCAG 2.2 motion criteria. Triggers on — reduced motion, prefers-reduced-motion, accessibility, WCAG, essential animation, motion sickness, spinner accessibility, is this animation essential, reduced-motion checklist, a11y motion.
metadata:
  short-description: Reduced-motion / accessibility rules shared by oneui-motion-build and oneui-motion-review
---

# Jio Motion — Accessibility

Some people get motion sickness from on-screen movement; others just lose their place. The OS lets them ask for less motion via `prefers-reduced-motion: reduce`. Honour it — but less motion does not mean none.

This skill is shared: `oneui-motion-build` uses it while adding motion, `oneui-motion-review` uses it while auditing motion that exists. The rules here are universal (WCAG-anchored); Jio's exact token remap is in `../oneui-motion-references/jio-motion-rules.md`.

## What WCAG asks for

Target at least **WCAG 2.2 Level AA** (Jio's own floor — see `oneui-motion-brand-guidance.md`). Three criteria touch motion:

| Criterion | Level | What it asks for |
|---|---|---|
| 2.3.1 Three Flashes or Below Threshold | A | Nothing flashes more than three times a second |
| 2.2.2 Pause, Stop, Hide | A | Motion that starts on its own, runs longer than 5 seconds, and sits alongside other content needs a way to pause, stop, or hide it |
| 2.3.3 Animation from Interactions | AAA | Motion triggered by an interaction can be turned off, unless essential |

**Nothing in WCAG requires an animation to keep playing.** Honouring `prefers-reduced-motion: reduce` is the named sufficient technique for 2.3.3 — switching motion off is never itself the failure. **What WCAG requires is that the meaning survives without the motion.** The question is never "am I allowed to switch this off" — always "what's left on screen once it's off, and does that still tell the user what they need to know."

## Is the motion essential?

Essential is a narrow exception about **information**, not about how the component looks. Motion is essential only when removing it destroys the information or breaks the function, and no static treatment could carry it:

- A drag preview that follows the pointer
- The playback view of an animation/video editor
- Video content itself

**A spinner is not one of them.** "Work is in progress" is carried perfectly well by a designed static indicator plus a status role (`role="progressbar"`, `aria-busy`). The same goes for indeterminate progress bars, activity pulses, and live audio reactivity — each has a static and a programmatic route to the same meaning. Treat all of them as not essential; take the movement out under reduced motion.

If you believe you have a genuine essential case, name which of the three above it resembles in a code comment. If you can't name one, it isn't essential.

## What the reduced state has to do

Removing the movement is settled — these two questions decide how much work the reduced state needs, not whether you're allowed to stop it. Ask both, write down the answer to each.

| | Question |
|---|---|
| **A** | Without the animation, is the meaning conveyed another way — static layout, icon swap, text label, role/aria-busy/aria-live? |
| **B** | Once the animation stops at its rest frame, does the component look **broken, stuck, or inactive**? |

**A = no is a design bug**, not a trade-off — fix the design, don't answer it by leaving the animation running.

**B = yes doesn't buy back the movement.** It says the component owes a **designed reduced state**, using either or both:
- A **designed still state** — a deliberate resting pose that reads as "work in progress" on first sight, not whatever frame zero happens to leave behind.
- An **opacity or colour loop** — scale, position and rotation come out; opacity and colour stay, implying no self-motion.

**Answer both from the design, before looking at the reduced-motion CSS.** In the other order, whatever the code already does starts looking correct and B gets back-filled to agree with it.

State (which mode) and activity (something happening right now) are different — a label may cover the state and still leave activity uncovered. Say which one you're judging.

**Where 2.2.2 bites:** a loop that can run past 5 seconds alongside other content needs a pause/stop/hide route. Usually the honest fix is making sure the indicator unmounts the moment the work finishes, not adding a control.

### How to answer B

B asks about **activity over time** — stopped, does it still say work is happening right now? It does **not** ask whether anything is left on screen:

| Wrong test | Why it fails |
|---|---|
| "A loading-shaped mark is still visible, so it still reads as loading" | Shape says *this is a progress indicator*; it doesn't say *it's still progressing*. A motionless partial arc reads as stalled. |
| "There's a label and `aria-busy`, so the meaning survives" | That's question A — reusing it for B collapses the two questions and guarantees the same answer. |
| "Frame zero is the resting pose, so the stopped state is intentional" | Frame zero only stops the element looking half-travelled; a tidy still frame can still read as dead. |

The real test: stop the animation and look at it as a user who doesn't know it's stopped. *Stuck / stalled / finished when it hasn't* → B is yes. A settled state meant to look that way → B is no.

### A loop over a settled state is a different problem

If a loop repeats over a state that's already resolved — a favourited heart that keeps beating, a shimmer on a saved item — nothing is ongoing, so stopping it looks correct rather than stuck. That motion has no purpose to begin with (see `oneui-motion-build` Step 2) — name the ongoing work it reports, or take it out. That's a "remove it" fix, not an accessibility one; correctly suppressing it under reduced motion doesn't redeem it for everyone else.

## Review checklist (continuous / looping motion)

| A: meaning without animation? | B: stopped looks broken? | What the component owes |
|---|---|---|
| no | — | Fix A first. Then read the row below. |
| yes | yes | Movement removed under reduce, **plus** a designed still state or an opacity/colour loop |
| yes | no | Movement removed under reduce |

Every row removes the movement — they differ only in how much the reduced state has to do.

## Where a disabled animation lands

An element with motion switched off doesn't disappear — it sits at whatever its plain CSS says, usually frame zero of the animation just removed. **Author frame zero as the resting pose**, so switching it off lands on the correct still image by itself. Get this wrong and the element freezes mid-gesture — half rotated, half travelled — which reads as broken.

This rule is about where a stopped animation lands, not about whether it may be stopped. A well-authored frame zero is the floor, not an answer to question B.

## Process

Get the full-motion version feeling right before touching the reduced version — designing around the reduced state from the start ends up weakening the motion for everyone.

**Always watch the reduced version, don't just read the code.** Turn the preference on (Chrome DevTools → Rendering → emulate `prefers-reduced-motion`) and look. For anything that loops, check both that the movement is gone and that what remains still reads as active if B said it had to.

Jio's exact token behaviour under reduced motion (what's automatic vs. what you apply by hand) is in `../oneui-motion-references/jio-motion-rules.md`.
