---
name: oneui-motion-brief
description: Settles the few genuinely open motion decisions for a Jio component before any code gets written, by working through a short mostly-automatic checklist rather than a long interview — because bucket, purpose, and pattern already answer most of what a generic system would need to ask. Use when motion needs deciding before it's built, when no existing pattern obviously covers a component, when asked to "brief this animation" or "decide how this should animate," or when oneui-motion-build hits an ambiguous case it can't resolve on its own. Produces a brief, not an implementation. Triggers on — motion brief, brief this animation, decide how this animates, what should this motion do, plan this animation, new motion pattern.
metadata:
  short-description: Settle the open motion decisions for a Jio component before building
---

# Jio Motion — Brief

A generic motion-design interview asks nine or more open questions because most systems leave easing, duration, and choreography entirely up to taste. Jio doesn't — bucket, purpose, and the pattern catalog already resolve most of that. So this isn't a long interview. It's a short pass that asks only what's genuinely still open, and states plainly why whenever it has to ask something that looks like it should've been automatic.

**Load `../oneui-motion-references/oneui-motion-brand-guidance.md` always, and `../oneui-motion-references/jio-motion-rules.md` + `../oneui-motion-references/oneui-motion-patterns.md` for Jio.** This skill doesn't decide values itself — it routes to the skill or rule that does, and only asks the user where a real decision remains.

The brief is the deliverable. Nothing gets implemented until the user confirms it — that's `oneui-motion-build`'s job, afterward.

## Before asking anything

Read the component. Establish what you can without asking: what it is, what triggers a change, whether it already resembles an existing Jio pattern.

## The checklist

**1. Frequency.** Ask: *"How many times a day does one user see this?"* — show real examples per band from the bucket table in `jio-motion-rules.md`, not one example standing in for all five (100+/day means keyboard shortcuts and command palettes specifically, not assumed for anything else).

If the answer lands on **bucket 1**, stop — no motion is allowed there except focus states. Write the brief as a cut.

**2. Purpose.** Ask: *"What purpose does the motion fulfill?"* — present the six from `oneui-motion-brand-guidance.md` as the answer options (Spatial consistency, State indication, Onboarding/explanation, Feedback, Preventing a jarring change, Anticipation/delight — the last only available at bucket 4/5). Propose your best guess as the default; this is a decision, not something to infer silently, since purpose gates real permissions downstream.

If no purpose fits, stop — no motion. Write the brief as a cut.

**3. Interaction behaviour.** Ask: *"What should happen on interaction?"* — plain language, no property or easing vocabulary; most people using this skill don't know motion design.

- Matches something in `oneui-motion-patterns.md` → recommend that pattern, with its bucket-allowed sub-patterns.
- Doesn't match anything → open it as a chat to define the new behaviour together. Inside that conversation, check whether Base UI has a similar component with a sensible interaction convention, and propose adopting it — don't decide silently, and don't invent from nothing if prior art exists.

**4. Entry/exit.** Ask: does it need one, and which direction does it enter from? Don't ask which direction it exits — exit always mirrors entry, that's a rule from `oneui-motion-brand-guidance.md`, not a decision.

**5. Shape (transition vs. keyframes).** Not a question — apply the rule from `oneui-motion-brand-guidance.md` to what #3 already established. State-to-state and stays → transition. Has waypoints (turns, pauses, loops) → keyframes.

**6. Easing and duration.** Not a question by default — bucket + purpose + pattern already determine the token. **Ask, and name the specific blocker, only when:**
- the component moves for more than one reason and the per-property split isn't clean (see the toast example in `jio-motion-rules.md` — `translate` is Entrance/Exit, `transform` is Transition, on the same instance), or
- it might be a **Bounce** case — a gesture or movement hitting a hard limit it can't go past (pull-to-refresh, scroll-to-bottom).

Say exactly what's blocking the automatic answer — never a generic "can you clarify?"

**7. Reduced motion.** Don't ask a standalone question. Hand off to `oneui-motion-accessibility` and run its A/B checklist — is the motion essential, does the reduced state need a designed still pose or a colour/opacity loop.

**8. Edge case.** Only if a list, drag, filter, or blur is actually involved. Name a **specific, component-relevant** edge case yourself and ask whether it breaks — not a generic template question. *"If this list grows to 100 rows, does the stagger still finish quickly?"* not *"how does this perform at scale?"* If the edge case is a stagger-length problem, check it against the offset formula in `jio-motion-rules.md` before asking — it may resolve on its own.

## The brief

```markdown
## Motion brief — <component>

**Verdict:** animate | cut
**Bucket:** <1–5> — <why>
**Purpose:** <one of the six>
**Interaction behaviour:** <what happens — existing pattern used, or new behaviour agreed, with Base UI reference if one was used>
**Entry/Exit:** <direction, or "none — stays on screen, state changes in place">
**Shape:** <transition | keyframes> — <why, from the behaviour above>
**Easing/Duration:** <resolved token, or the specific blocker if still open>
**Reduced motion:** <essential? designed reduced state needed — from oneui-motion-accessibility>
**Edge case:** <scenario checked, and whether it holds>

**Open risk:** <anything still genuinely uncertain>
```

Stop once every field is filled — not when the conversation feels finished. Ask for confirmation before anything gets built.

## Companion skills

`oneui-motion-build` implements the confirmed brief. `oneui-motion-accessibility` supplies the reduced-motion answer. `oneui-motion-review` audits what gets built against it afterward.
