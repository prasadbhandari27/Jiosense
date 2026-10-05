---
name: oneui-motion-prototype
description: Builds two or three named, real versions of an undecided motion choice behind a reusable picker, so the difference can be judged by watching rather than guessing. Use only when explicitly asked to compare motion options, prototype an animation, or decide between multiple ways something could animate — for example "does this feel better at XL or 2XL". Never use while just adding motion. Triggers on — compare motion options, prototype animation, motion picker, which duration feels better, A/B animation, motion comparison.
disable-model-invocation: true
metadata:
  short-description: Build comparable motion versions behind a reusable picker
---

# Jio Motion — Prototype

**Only use this when asked to compare options.** Never build a comparison as part of adding motion — if someone asks for motion, use `oneui-motion-build`, produce one version through its Steps 1–5, and stop.

This is for when the answer genuinely isn't known — "does this feel better at XL or 2XL" — and can only be settled by watching both.

For someone building on the component library, this should be rare: `oneui-motion-build` Step 3 already says only build custom motion when no existing pattern covers it (`../oneui-motion-references/oneui-motion-patterns.md`). Most of the time the answer is to use the pattern.

## What may differ between versions

Every version still follows every rule in `../oneui-motion-references/oneui-motion-brand-guidance.md` and, for Jio, `../oneui-motion-references/jio-motion-rules.md`. A version that breaks the bucket or writes a raw value teaches nothing — it loses on a technicality, not on feel.

So versions differ only on what's genuinely left open:

- **Duration step** — the same motion at L, XL, and 2XL
- **Easing type** — Entrance against Transition, where either could be argued
- **Size of movement** — how far it travels or scales, inside what the bucket allows
- **Which properties move** — colour alone, against colour plus a small scale
- **Direction** — where it enters from and dismisses to, e.g. sliding in and dismissing from the bottom vs. from the side. Both versions use all the correct tokens; they differ in behaviour, not values. Each version still has to keep its own entry/exit pair consistent — whichever direction it enters from, it dismisses the same way (see `oneui-motion-brand-guidance.md`)
- **Interaction behaviour** — what happens when the user interacts with it while it's on screen (dismiss on tap-outside, drag-to-dismiss, focus handling, and so on). This can differ by use case even while every version follows every rule in this file. **Base UI's own interaction conventions are the default** — a version only deviates from them when it's deliberately testing that deviation, not by accident

Build **two or three, never more**. If two end up feeling the same, drop one and say so. Name each after what it's trying — "Slower," "Softer entry," "Colour only" — never "Option A."

## Where it goes

- **Library component** — ask which surface to use, unless already told:
  - **Storybook** — one story containing all versions behind the picker (one story, not one per version, so flipping between them is fast). Persists alongside the component; the natural home when the comparison is worth keeping around or the team reviews motion in Storybook.
  - **Separate temporary prototype** — a standalone app/route outside Storybook, still built against the real component and real tokens, with the same picker. Deleted once a version is chosen. Use when Storybook shouldn't be touched for this comparison (e.g. mid-flight on something else, or the user just wants a quick look).
- **App built on the library** — a separate route in that app, deleted once a version is chosen.

Either way it's a separate surface. Nothing goes into the real component until a version is picked — three versions can't live in real UI at once, which is the whole reason the surface exists.

## The picker

**Do not design the picker. Do not invent one per run.** Build it once, reuse it always, so it looks identical every time and reads as a tool rather than part of what's being judged.

Two different things are on screen, only one of them judged:
- **The versions** are real — real components, real tokens, every rule followed.
- **The picker** is furniture — it switches between versions and does nothing else.

Jio's exact picker spec (appearance tokens, behaviour, keyboard shortcuts) is in `../oneui-motion-references/jio-motion-rules.md`. If a picker doesn't exist in the project yet, build it once to that spec and reuse it after.

For another brand: same behavioural spec (one active version, replay, keyboard nav, URL state), but the visual tokens are the brand's own — the appearance table in `jio-motion-rules.md` is Jio-specific, not universal.

## Then stop

Present the versions in a table — what each is trying, when it would be the right answer, what it costs. Then stop; the choice isn't yours to make. Don't name a favourite unless asked. If asked, give the reason from the bucket and the frequency, not from taste.

When a version is chosen, put that one into the component and remove the rest.
