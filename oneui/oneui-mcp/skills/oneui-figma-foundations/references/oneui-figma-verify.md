---
name: oneui-figma-verify
description: >-
  Read-only audit for OneUI parent-step cascade and Brand bindings in Figma. Use after any cascade, reparent, paste, or theme/colour-mode switch — wrong cascades render with no error, so verification is required.
---

# Verify OneUI foundations

Part of the OneUI Figma foundations set. Invoke the orchestrator `the `oneui-figma-foundations` skill (get_skill "oneui-figma-foundations")` for the full workflow, or this skill when you only need this topic. Core rules live in `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-foundations-core.md")`.

# Verifying a cascade

A wrong parent-step chain does not throw. The file opens, the frames render, the colours are just
wrong — often subtly, often only in one colour mode or one theme. So treat verification as part of
applying the foundations, not as an optional follow-up.

Run this after any cascade, reparent, theme switch, or colour-mode flip. It writes nothing.

## The invariants

| # | Invariant | Why it matters |
|---|---|---|
| 1 | Every fill-bearing node has an explicit `16 Parent range`. | Without it the node inherits its parent's range, which describes the *grandparent's* step — every colour lands one level off. |
| 2 | Exactly one of `17 Parent ≤1200` / `18 Parent >1200` is set; the other is **absent**. | A node that crosses the 1200/1300 boundary otherwise keeps a stale step in the inactive collection, and the alias chain can pick it up instead. |
| 3 | The step set matches the range: `>= 1300` in `18`, `<= 1200` in `17`, and the range mode agrees. | A mismatch resolves through a collection whose mode was never written. |
| 4 | The step equals the parent's **resolved** step — except `default` (always rootStep) and `bold` on a differing non-neutral appearance (also rootStep). | This is the whole contract. See `resolution-maths.md`. |
| 5 | Fillless wrappers carry **no** parent-step modes. | Stamping a fillless COMPONENT propagates through main-tree resolution into every instance sublayer and beats the correct outer write. |
| 6 | No explicit modes on instance sublayers. | Instance interiors mirror the main component; writing there corrupts the library. |
| 7 | The colour Figma actually resolves equals the colour the modes predict. | The end-to-end check. If 1–6 pass and this fails, the library itself has drifted from the skill's tables. |

## The audit script

Pass this as the `code` argument to `use_figma`. It reads only.

```js
const COLL = {
  APPEARANCE: '01 Appearance', SURFACE: '03 Surface', COLOUR_MODE: '10 Colour mode',
  PARENT_RANGE: '16 Parent range', PARENT_LOW: '17 Parent ≤1200', PARENT_HIGH: '18 Parent >1200',
}
const SCOPE = 'selection'   // or 'page'

const collByName = {}, modeNameById = {}
for (const c of await figma.variables.getLocalVariableCollectionsAsync()) {
  if (Object.values(COLL).includes(c.name)) {
    collByName[c.name] = c
    modeNameById[c.name] = Object.fromEntries(c.modes.map(m => [m.modeId, m.name]))
  }
}
// Library-backed file: resolve remote collections first (see writing-to-figma.md).
if (Object.keys(collByName).length < Object.keys(COLL).length) {
  for (const lc of await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()) {
    if (!Object.values(COLL).includes(lc.name) || collByName[lc.name]) continue
    const vars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(lc.key)
    if (!vars.length) continue
    const v = await figma.variables.importVariableByKeyAsync(vars[0].key)
    const col = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId)
    if (col) {
      collByName[col.name] = col
      modeNameById[col.name] = Object.fromEntries(col.modes.map(m => [m.modeId, m.name]))
    }
  }
}

const issues = []
const explicitOf = (n, cn) => {
  const c = collByName[cn]; if (!c) return null
  try { const e = n.explicitVariableModes || {}; return c.id in e ? modeNameById[cn][e[c.id]] : null }
  catch (e) { return null }
}
const resolvedOf = (n, cn) => {
  const c = collByName[cn]; if (!c) return null
  try { const r = n.resolvedVariableModes || {}; return r[c.id] ? modeNameById[cn][r[c.id]] : null }
  catch (e) { return null }
}
const bearsFill = (n) => {
  try {
    const bv = n.boundVariables || {}
    if ((bv.fills || []).length || (bv.strokes || []).length) return true
    for (const p of (Array.isArray(n.fills) ? n.fills : [])) if (p.type === 'SOLID' && p.boundVariables) return true
    for (const p of (Array.isArray(n.strokes) ? n.strokes : [])) if (p.type === 'SOLID' && p.boundVariables) return true
  } catch (e) {}
  return false
}

function audit(node, inInstance, depth) {
  const range = explicitOf(node, COLL.PARENT_RANGE)
  const low   = explicitOf(node, COLL.PARENT_LOW)
  const high  = explicitOf(node, COLL.PARENT_HIGH)
  const filled = bearsFill(node)
  const where = node.name + ' (' + node.type + ', depth ' + depth + ')'

  if (inInstance && (range || low || high)) {
    issues.push({ rule: 6, where, detail: 'explicit parent-step modes on an instance sublayer' })
  } else if (filled) {
    if (!range) issues.push({ rule: 1, where, detail: 'fill-bearing but no 16 Parent range' })
    if (low && high) issues.push({ rule: 2, where, detail: 'both 17 and 18 are set — clear the inactive one' })
    if (!low && !high) issues.push({ rule: 2, where, detail: 'range set but neither 17 nor 18 has a step' })
    const step = Number(high || low)
    if (!isNaN(step)) {
      const wantHigh = step >= 1300
      if (wantHigh && !high) issues.push({ rule: 3, where, detail: 'step ' + step + ' belongs in 18, found in 17' })
      if (!wantHigh && !low) issues.push({ rule: 3, where, detail: 'step ' + step + ' belongs in 17, found in 18' })
      const wantRange = wantHigh ? '2500-1300' : '1200-100'
      if (range && range !== wantRange) {
        issues.push({ rule: 3, where, detail: 'range "' + range + '" disagrees with step ' + step })
      }
    }
  } else if (range || low || high) {
    issues.push({ rule: 5, where, detail: 'fillless wrapper carries parent-step modes — clear them' })
  }

  const nowInInstance = inInstance || node.type === 'INSTANCE'
  if (node.type === 'INSTANCE') return          // do not descend; see rule 6
  for (const c of (node.children || [])) audit(c, nowInInstance, depth + 1)
}

const roots = SCOPE === 'page' ? figma.currentPage.children : figma.currentPage.selection
for (const r of roots) audit(r, false, 0)

const byRule = {}
for (const i of issues) byRule[i.rule] = (byRule[i.rule] || 0) + 1
return {
  scope: SCOPE, roots: roots.length,
  clean: issues.length === 0,
  countsByRule: byRule,
  issues: issues.slice(0, 60),
  truncated: Math.max(0, issues.length - 60),
}
```

Rules 4 and 7 need the parent's resolved step and the resolved colour, which the audit above does
not compute. `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-cascade.md")` covers both: run it with `apply: false, verify: true`
and read `report.mismatches`. A dry run that reports zero writes and zero mismatches is the
strongest signal available that a subtree is correct.

## Reading the results

**Rule 1 or 2 failures in bulk** usually mean the cascade never ran on that subtree, or stopped
early. Check whether an ancestor is an instance (the walk stops there by design) or whether the
subtree sits under a GROUP or BOOLEAN_OPERATION — those are pass-through containers, and a walk
that treats them as leaves silently orphans everything beneath.

**Rule 5 failures** are usually the residue of an older cascade that lacked the fill gate. They are
worth clearing even though nothing renders from them, because they leak into instance sublayers.

**Rule 7 failures with 1–6 clean** mean the modes are internally consistent but the library
disagrees with the prediction. In order of likelihood: the Figma tab is holding a stale library
cache (reload the tab with Cmd-R and re-run — plugin reload is not enough); the library was
republished with different values; or the skill's tables have drifted (run
(repo drift check — not a Figma skill)).

## When to stop and hand back to the plugin

Some situations are outside what a script driving the public API should attempt. Say so rather
than forcing it:

- **Instance interiors that need different modes from their main component.** Change the main
  component, or use the consumer plugin, which has the reconciliation handling for this.
- **An instance whose interior reads as unreachable** (property access throws on sublayers). The
  consumer plugin has a Repair path that re-instantiates the component; there is no equivalent
  through the public API that does not risk losing overrides.
- **Cross-page cascades.** Page context resets per `use_figma` call, so do one page per call
  rather than trying to walk the document.
- **A file where the library is not enabled.** Nothing can bind. Ask for the library to be added
  first; do not create local look-alike variables as a workaround — they will not track the
  library and will silently diverge.

> Source: invariants derived from `packages/figma-oneui-plugin/src/apply.ts`,
> `packages/figma-oneui-plugin/src/diagnose.ts`, `packages/figma-migrate/src/cascade.ts`.
