---
name: oneui-figma-foundations
description: >-
  Orchestrator for OneUI design-system foundations in Figma. Use whenever building, editing, auditing or debugging OneUI/Jio/Tira screens or components — variable modes, Brand paint bindings, theme/appearance/colour-mode switches, parent-step cascade, or wrong colours after reparent/paste. Loads the core rules and routes to the supporting OneUI Figma skills as needed.
category: figma-design
---

# OneUI foundations (Figma Agent orchestrator)

You are applying **OneUI foundations inside a Figma file**: set **variable modes** on nodes and
**bind Brand variables** to paints. Mistakes often render with no error — verification is part of
the job.

## How to load skills (critical)

Figma Agent custom skills are separate files. When this orchestrator tells you to load a sibling,
**use the Skill tool** with the exact `/custom-skills:…` name below. Do **not** assume supporting
detail is already in context.

**Do not load every skill at once.** Load only what the current step needs. Prefer:

> Load `/custom-skills:X` when doing Y.

over dumping the whole set into context.

Skill names must match **exactly**. A typo or renamed skill will not resolve.

## Always start here

1. **Load** `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-foundations-core.md")` before doing anything else. Follow its
   mental model, node invariant, token table, and silent-corruption rules for the whole task.
2. **Do not invent** collection names, mode strings, or Brand variable paths — load the sibling
   skill that owns that vocabulary when you need it.
3. **Stop and escalate** when: an instance interior needs modes its main component lacks; an
   instance is unreachable; work spans multiple pages (one page per pass); or the library is not
   enabled in the file. Never create local look-alike variables.

## Workflow — load X when doing Y

Follow steps in order. At each step, load that skill **only if this pass needs it**.

| When you are… | Load |
|---|---|
| Starting any foundations task | `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-foundations-core.md")` |
| About to write modes, bindings, or fonts | `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-writing-to-figma.md")` |
| Unsure of exact collection / mode strings | `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-collections-and-modes.md")` |
| Choosing Brand bindings for fills/strokes | `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-brand-variables.md")` |
| Setting appearance / theme / bold-diff / brandBG | `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-appearance-and-themes.md")` |
| Binding size, type, elevation, or blur | `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-size-and-typography.md")` |
| Cascading parent-step over a subtree (dry-run → apply) | `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-cascade.md")` |
| Verifying after cascade, reparent, paste, or theme switch | `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-verify.md")` |

Build the tree (page-level modes → nodes → bindings) using core plus whichever skills above you
already loaded for this pass — do not re-load skills you already have in context.

## Load only when debugging or checking

| When you need to… | Load |
|---|---|
| Check a chain against a fully derived example | `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-worked-example.md")` |
| Predict or debug one resolved colour | `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-resolution-maths.md")` |
| Look up hex for a scale step | `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-scale-colours.md")` |

## Typical pass (sequential, not bulk)

Example for a new or repaired screen — load each skill **when you reach that step**, not all up front:

1. Load `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-foundations-core.md")`
2. When writing: load `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-writing-to-figma.md")`
3. If names unsure: load `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-collections-and-modes.md")`
4. When binding paints: load `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-brand-variables.md")`
5. If theme/appearance involved: load `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-appearance-and-themes.md")`
6. When cascading: load `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-cascade.md")` (dry-run → apply)
7. When done writing: load `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-verify.md")`

## Quick invariant (from core — obey always)

For each node that binds a fill or stroke:

1. Explicit `16 Parent range` plus **exactly one** of `17 Parent ≤1200` / `18 Parent >1200` (clear the other).
2. That step is **the parent’s resolved step**, not the node’s (exceptions: `default` → `rootStep`; bold-on-different-appearance when parent appearance ≠ neutral → `rootStep`; page root → `rootStep`).
3. Fillless wrappers: **no** parent-step modes and **no** `03 Surface`.
4. Never recurse into instance interiors.
5. `rootStep` = `2500` light / `200` dark.

## If a colour still looks wrong

Ask whether a **full tab reload** (Cmd-R) fixes it before deep debugging — Figma caches resolved library values at tab level.
