---
name: oneui-figma-cascade
description: >-
  Bulk-write the OneUI parent-step cascade (16 Parent range + 17/18 Parent step) across a Figma
  subtree. Contains the cascade-in-figma script — edit CONFIG, dry-run first (apply: false), then
  apply. Use after building or reparenting OneUI surfaces; follow with get_skill_reference("oneui-figma-foundations", "references/oneui-figma-verify.md").
---

# Cascade parent-step chain

Part of the OneUI Figma foundations set. Core invariant: `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-foundations-core.md")`. Verify after: `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-verify.md")`.

This is **not** a Node script. Edit the CONFIG block, then run it in the Figma file context (agent code / plugin sandbox). Default is dry-run (`apply: false`) — report what would be written before setting `apply: true`.

```javascript
/* ============================================================================
 * OneUI — parent-step cascade
 *
 * THIS IS NOT A NODE SCRIPT. Do not run it with `node`.
 * Read this file, edit the CONFIG block, and pass the whole thing as the
 * `code` argument to the Figma MCP `use_figma` tool. It runs inside the
 * Figma file with the `figma` global bound.
 *
 * What it does
 *   Walks a subtree top-down and writes the parent-step modes
 *   (`16 Parent range` + one of `17 Parent ≤1200` / `18 Parent >1200`) on
 *   every fill-bearing node, so each node carries THE STEP ITS PARENT
 *   RESOLVES TO. That single invariant is what makes surface, content and
 *   interaction colours resolve correctly through the alias chain.
 *
 * Why it reads from the library instead of hardcoding the maths
 *   A node's resolved step depends on the surface token, the appearance's
 *   colour scale, that scale's base/darkerBase anchors, and a WCAG-contrast
 *   direction. The tokenator bakes the shipped library values using the real
 *   contrast comparison (`contrastDir` in packages/core/src/surfaceLogic.ts),
 *   NOT the `step >= 1300` shortcut that packages/figma-migrate/src/cascade.ts
 *   uses. So this script fetches each scale's 25 primitive colours from
 *   `19 Primitives` and derives that scale's anchors from the library's own
 *   `surface/bold` values. If the file's library is newer than this script,
 *   the answers are still right — Figma did the resolution, not us.
 *
 * Start with apply:false. Read the report. Then set apply:true.
 * ========================================================================== */

const CONFIG = {
  // 'selection' | 'page'   — 'page' walks every top-level frame on the page.
  scope: 'selection',
  // false = dry run (writes nothing, reports what it would do). Start here.
  apply: false,
  // Cross-check each prediction against what Figma actually resolves.
  // Costs one extra resolve per node; worth it until you trust the run.
  verify: true,
  // Fallback anchors, used only if a scale's anchors cannot be derived from
  // the library. Regenerate with scripts/check-drift.mjs.
  fallbackAnchors: {
    grey: { base: 200, darkerBase: 2500 },
    Neutral: { base: 200, darkerBase: 2500 },
  },
}

// ── Collection + token vocabulary ───────────────────────────────────────────
const COLL = {
  APPEARANCE: '01 Appearance',
  SURFACE: '03 Surface',
  COLOUR_MODE: '10 Colour mode',
  BRAND: '15 Brand',
  THEME_JIO_RANGE: '13.1 Theme range [Jio]',
  THEME_JIO_AM: '13.2 Theme (A–M) [Jio]',
  THEME_JIO_NZ: '13.3 Theme (N–Z) [Jio]',
  THEME_TIRA: '14 Theme [Tira]',
  PARENT_RANGE: '16 Parent range',
  PARENT_LOW: '17 Parent ≤1200',
  PARENT_HIGH: '18 Parent >1200',
  PRIMITIVES: '19 Primitives',
}
const RANGE_HIGH = '2500-1300'
const RANGE_LOW = '1200-100'
const STEPS = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200,
  1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500]
const SURFACE_TOKENS = ['default', 'ghost', 'minimal', 'subtle', 'moderate',
  'bold', 'elevated', 'blend']
const BRANDBG_ROOT_PROXIMITY = [2500, 2400, 300, 200, 100]
const SURFACE_VAR = 'colour/surface/surface'

const report = {
  mode: CONFIG.apply ? 'APPLY' : 'DRY RUN',
  visited: 0, writes: 0, skipped: 0,
  perNode: [], mismatches: [], diagnostics: [],
}
const note = (m) => { if (report.diagnostics.indexOf(m) === -1) report.diagnostics.push(m) }

// ── Colour maths (sRGB, matching core's wcagContrast after oklch→rgb) ───────
function luminance(c) {
  const f = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4))
  return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b)
}
function contrast(a, b) {
  if (!a || !b) return 0
  const la = luminance(a), lb = luminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}
/** dir === 1  → contrasting colour is light, offsets walk UP toward 2500.
 *  dir === -1 → contrasting colour is dark, offsets walk DOWN toward 100. */
function contrastDir(parent, step2500, step200) {
  return contrast(parent, step2500) >= contrast(parent, step200) ? 1 : -1
}
function nearestStep(stepMap, colour) {
  let best = null, bestD = Infinity
  for (const s of STEPS) {
    const c = stepMap[s]
    if (!c) continue
    const d = Math.pow(c.r - colour.r, 2) + Math.pow(c.g - colour.g, 2) + Math.pow(c.b - colour.b, 2)
    if (d < bestD) { bestD = d; best = s }
  }
  return bestD < 1e-6 ? best : (bestD < 0.01 ? best : null)
}

// ── resolveSurface — an exact port of packages/core/src/surfaceLogic.ts ─────
const clampStep = (s) => Math.max(100, Math.min(2500, s))
function resolveSurface(token, parentStep, anchors, dir, darkMode, pinnedStep) {
  switch (token) {
    case 'default': return darkMode ? 200 : 2500
    case 'elevated': return Math.min(parentStep + 100, 2500)
    case 'ghost': return parentStep
    case 'blend': return parentStep
    case 'minimal': return clampStep(parentStep + dir * 100)
    case 'subtle': return clampStep(parentStep + dir * 200)
    case 'moderate': return clampStep(parentStep + dir * 300)
    case 'bold': {
      const candidate = pinnedStep != null
        ? pinnedStep
        : (parentStep >= 1300 ? anchors.base : anchors.darkerBase)
      // brandBG holy-colour: a pinned bold on/next to a root background keeps
      // its exact colour instead of being contrast-walked off it.
      if (pinnedStep != null && BRANDBG_ROOT_PROXIMITY.indexOf(parentStep) !== -1) {
        return clampStep(pinnedStep)
      }
      if (Math.abs(parentStep - candidate) / 100 >= 7) return candidate
      let result = parentStep - 700
      if (result < 500) result = parentStep + 700
      return clampStep(result)
    }
    default: return parentStep
  }
}

// ── Collection discovery (local first, then the remote-library four-hop) ────
const collByName = {}
const modeNameById = {}   // collName → { modeId → name }
const modeIdByName = {}   // collName → { name → modeId }

function indexCollection(col) {
  collByName[col.name] = col
  modeNameById[col.name] = {}
  modeIdByName[col.name] = {}
  for (const m of col.modes) {
    modeNameById[col.name][m.modeId] = m.name
    modeIdByName[col.name][m.name] = m.modeId
  }
}

const wanted = Object.keys(COLL).map((k) => COLL[k])

for (const col of await figma.variables.getLocalVariableCollectionsAsync()) {
  if (wanted.indexOf(col.name) !== -1) indexCollection(col)
}

// Remote (published-library) collections are NOT returned above. Reaching a
// remote collection's modeIds is a four-hop dance and there is no shortcut:
//   library collection → its variables → import one → its collectionId → modes
const libVarKeyByName = {}   // "<collName>::<varName>" → library key
if (Object.keys(collByName).length < wanted.length) {
  const libColls = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()
  for (const lc of libColls) {
    if (wanted.indexOf(lc.name) === -1 && lc.name !== COLL.PRIMITIVES) continue
    let vars
    try { vars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(lc.key) }
    catch (e) { note('could not list ' + lc.name + ': ' + e.message); continue }
    for (const lv of vars) libVarKeyByName[lc.name + '::' + lv.name] = lv.key
    if (collByName[lc.name] || !vars.length) continue
    try {
      const imported = await figma.variables.importVariableByKeyAsync(vars[0].key)
      const col = await figma.variables.getVariableCollectionByIdAsync(imported.variableCollectionId)
      if (col) indexCollection(col)
    } catch (e) { note('could not resolve modes for ' + lc.name + ': ' + e.message) }
  }
}

for (const name of wanted) {
  if (!collByName[name]) note('MISSING collection: ' + name)
}
const required = [COLL.SURFACE, COLL.PARENT_RANGE, COLL.PARENT_LOW, COLL.PARENT_HIGH]
for (const r of required) {
  if (!collByName[r]) return { error: 'Cannot cascade — required collection not found: ' + r, report }
}

// ── Variable lookup, local or imported ─────────────────────────────────────
// Local variables are fetched once — the list is stable for this run, and
// re-fetching per lookup turns ~100 lookups into ~100 full scans.
const localVars = await figma.variables.getLocalVariablesAsync()
const localByName = {}
for (const v of localVars) localByName[v.name] = v

const varCache = {}
async function getVar(collName, varName) {
  const cacheKey = collName + '::' + varName
  if (cacheKey in varCache) return varCache[cacheKey]
  let found = localByName[varName] || null
  if (!found && libVarKeyByName[cacheKey]) {
    try { found = await figma.variables.importVariableByKeyAsync(libVarKeyByName[cacheKey]) }
    catch (e) { note('import failed for ' + varName + ': ' + e.message) }
  }
  varCache[cacheKey] = found
  return found
}

// A throwaway node is the only reliable way to evaluate a variable under a
// chosen mode stack. resolveForConsumer walks the full alias chain for us.
const probe = figma.createRectangle()
probe.name = '__oneui_probe__'
probe.resize(1, 1)
probe.visible = false

async function resolveUnder(variable, modes) {
  for (const collName in modes) {
    const col = collByName[collName]
    const modeId = modeIdByName[collName] && modeIdByName[collName][modes[collName]]
    if (!col || !modeId) return null
    try { probe.setExplicitVariableModeForCollection(col, modeId) } catch (e) { return null }
  }
  try { return variable.resolveForConsumer(probe).value } catch (e) { return null }
}

// ── Per-scale data: 25 primitive colours + anchors derived from the library ─
const scaleCache = {}
async function getScale(brand, scaleName) {
  const key = brand + '/' + scaleName
  if (key in scaleCache) return scaleCache[key]

  const stepMap = {}
  for (const s of STEPS) {
    const v = await getVar(COLL.PRIMITIVES, key + '/' + s)
    if (!v) continue
    let value = null
    try { value = v.valuesByMode[Object.keys(v.valuesByMode)[0]] } catch (e) { value = null }
    if (!value) value = await resolveUnder(v, {})
    if (value && typeof value.r === 'number') stepMap[s] = value
  }
  if (!stepMap[2500] || !stepMap[200]) {
    note('scale ' + key + ': primitives unavailable, direction may be wrong')
  }

  // Derive anchors from the library itself. At parent_step = rootStep the bold
  // rule returns its candidate as-is (the 7-step branch), so:
  //   bold @ parent 2500 == scale.base       bold @ parent 200 == scale.darkerBase
  let anchors = null
  const boldHigh = await getVar(COLL.PARENT_HIGH, '[parent >1200] ' + key + '/surface/bold')
  const boldLow = await getVar(COLL.PARENT_LOW, '[parent <=1200] ' + key + '/surface/bold')
  if (boldHigh && boldLow && stepMap[2500]) {
    const hi = await resolveUnder(boldHigh, { [COLL.PARENT_HIGH]: '2500' })
    const lo = await resolveUnder(boldLow, { [COLL.PARENT_LOW]: '200' })
    const base = hi ? nearestStep(stepMap, hi) : null
    const darkerBase = lo ? nearestStep(stepMap, lo) : null
    if (base != null && darkerBase != null) anchors = { base, darkerBase, from: 'library' }
  }
  if (!anchors && CONFIG.fallbackAnchors[scaleName]) {
    anchors = Object.assign({ from: 'fallback' }, CONFIG.fallbackAnchors[scaleName])
    note('scale ' + key + ': using fallback anchors — bold/tinted may be wrong')
  }
  if (!anchors) {
    anchors = { base: 200, darkerBase: 2500, from: 'guess' }
    note('scale ' + key + ': NO anchors available — bold results are unreliable')
  }

  scaleCache[key] = { stepMap, anchors }
  return scaleCache[key]
}

// ── Reading a node's own mode context ──────────────────────────────────────
function readMode(node, collName) {
  const col = collByName[collName]
  if (!col) return null
  let modes = null
  try { modes = node.resolvedVariableModes } catch (e) { return null }
  if (!modes) return null
  const id = modes[col.id]
  return id ? (modeNameById[collName][id] || null) : null
}

/** The Surface token must be read from the node's OWN explicit mode, never the
 *  resolved one. A state layer deliberately CLEARS its Surface so it inherits
 *  the parent's token (that is how the chain picks the bold 24/32% overlay
 *  variant) — so its resolved Surface is its parent's token. Reading resolved
 *  would make this script treat the overlay as a surface in its own right,
 *  compute a new step from it, and hand that wrong step to every child.
 *  Only a real surface frame carries an explicit Surface mode; everything
 *  else (state layers, fillless wrappers) passes its parent's step through. */
function readOwnSurfaceToken(node) {
  const col = collByName[COLL.SURFACE]
  if (!col) return null
  try {
    const e = node.explicitVariableModes
    if (!e || !(col.id in e)) return null
    return modeNameById[COLL.SURFACE][e[col.id]] || null
  } catch (err) { return null }
}
function isExplicit(node, collName) {
  const col = collByName[collName]
  if (!col) return false
  try { return !!node.explicitVariableModes && col.id in node.explicitVariableModes }
  catch (e) { return false }
}

/** Only nodes that actually bind a fill carry parent-step modes.
 *  Stamping a fillless COMPONENT definition propagates through Figma's
 *  main-tree mode resolution into every instance sublayer and BEATS the
 *  correct outer write — a silent, hard-to-trace corruption. Fillless
 *  wrappers pass through; their fill-bearing descendants still resolve
 *  correctly by walking up the scene tree. */
function hasBoundFill(node) {
  try {
    const bv = node.boundVariables || {}
    if (Array.isArray(bv.fills) && bv.fills.length) return true
    if (Array.isArray(bv.strokes) && bv.strokes.length) return true
    const fills = node.fills
    if (Array.isArray(fills)) {
      for (const p of fills) if (p.type === 'SOLID' && p.boundVariables) return true
    }
    const strokes = node.strokes
    if (Array.isArray(strokes)) {
      for (const p of strokes) if (p.type === 'SOLID' && p.boundVariables) return true
    }
  } catch (e) { /* instance sublayers can throw mid-reconcile */ }
  return false
}

function writeParentStep(node, step) {
  const high = step >= 1300
  const rangeId = modeIdByName[COLL.PARENT_RANGE][high ? RANGE_HIGH : RANGE_LOW]
  const activeColl = collByName[high ? COLL.PARENT_HIGH : COLL.PARENT_LOW]
  const inactiveColl = collByName[high ? COLL.PARENT_LOW : COLL.PARENT_HIGH]
  const stepId = modeIdByName[high ? COLL.PARENT_HIGH : COLL.PARENT_LOW][String(step)]
  if (!rangeId || !stepId) {
    note('no mode for step ' + step + ' — is it a multiple of 100 in range?')
    return false
  }
  if (!CONFIG.apply) return true
  try {
    node.setExplicitVariableModeForCollection(collByName[COLL.PARENT_RANGE], rangeId)
    node.setExplicitVariableModeForCollection(activeColl, stepId)
    // Clearing the inactive collection is not optional. A node that crosses
    // the 1200/1300 boundary otherwise keeps a stale step there, and the
    // alias chain can pick it up instead of the one just written.
    try { node.clearExplicitVariableModeForCollection(inactiveColl) } catch (e) { /* none set */ }
  } catch (e) {
    note('write failed on "' + node.name + '": ' + e.message)
    return false
  }
  return true
}

// ── The walk ───────────────────────────────────────────────────────────────
const themeCollFor = (brand, node) => {
  if (brand === 'Tira') return readMode(node, COLL.THEME_TIRA)
  const half = readMode(node, COLL.THEME_JIO_RANGE)
  return readMode(node, half === 'N–Z' ? COLL.THEME_JIO_NZ : COLL.THEME_JIO_AM)
}

async function cascade(node, parentStep, parentAppearance, depth) {
  report.visited++
  if (node.type === 'PAGE') {
    for (const c of node.children) await cascade(c, parentStep, parentAppearance, depth)
    return
  }

  const appearance = readMode(node, COLL.APPEARANCE) || parentAppearance
  const token = readOwnSurfaceToken(node)
  const darkMode = readMode(node, COLL.COLOUR_MODE) === 'dark'
  const rootStep = darkMode ? 200 : 2500

  // The bold-on-different-appearance rule. There is no parent-appearance axis
  // in the variable tree, so the way to honour it is to write rootStep as this
  // node's parent-step instead of the parent's real resolved step. At rootStep
  // the bold rule returns the scale's own anchor — which is the whole point:
  // the child keeps its brand colour instead of being contrast-pulled off it.
  let stepToWrite = parentStep
  if (token === 'bold' && appearance !== parentAppearance && parentAppearance !== 'neutral') {
    stepToWrite = rootStep
  }
  // `default` is a hard reset to the page background, whatever the parent did.
  if (token === 'default') stepToWrite = rootStep

  const bearsFill = hasBoundFill(node)
  if (bearsFill) {
    if (writeParentStep(node, stepToWrite)) report.writes++
    if (depth <= 2 || report.perNode.length < 40) {
      report.perNode.push({
        name: node.name, type: node.type, depth: depth,
        appearance: appearance, surface: token || '(none)',
        parentStepWritten: stepToWrite,
      })
    }
  } else {
    report.skipped++
  }

  // What does THIS node resolve to? That is what its children receive.
  let resolvedStep = stepToWrite
  if (token && SURFACE_TOKENS.indexOf(token) !== -1) {
    const brand = readMode(node, COLL.BRAND) || 'Jio'
    const themeName = themeCollFor(brand, node)
    const scaleName = scaleNameFor(brand, themeName, appearance)
    const scale = await getScale(brand, scaleName)
    const dir = contrastDir(scale.stepMap[stepToWrite], scale.stepMap[2500], scale.stepMap[200])
    const pinned = appearance === 'brandBG' ? brandBGPin(themeName) : null
    resolvedStep = resolveSurface(token, stepToWrite, scale.anchors, dir, darkMode, pinned)

    if (CONFIG.verify && bearsFill) await verifyNode(node, scale, resolvedStep)
  }

  // Never recurse into an instance. Its interior mirrors the main component;
  // writing modes on instance sublayers corrupts the component library.
  if (node.type === 'INSTANCE') return
  if ('children' in node) {
    for (const c of node.children) await cascade(c, resolvedStep, appearance, depth + 1)
  }
}

async function verifyNode(node, scale, predictedStep) {
  const v = await getVar(COLL.BRAND, SURFACE_VAR)
  if (!v) return
  let actual = null
  try { actual = v.resolveForConsumer(node).value } catch (e) { return }
  if (!actual || typeof actual.r !== 'number') return
  const actualStep = nearestStep(scale.stepMap, actual)
  if (actualStep != null && actualStep !== predictedStep) {
    report.mismatches.push({
      name: node.name, predicted: predictedStep, figmaResolved: actualStep,
    })
  }
}

// ── Theme → scale mapping ──────────────────────────────────────────────────
// Appearance selects WHICH colour scale a node's tokens resolve against, and
// the theme decides which scale each appearance points at. Same `bold` token,
// different theme, different colour. Mirrors getScaleName/getScaleStep in
// packages/core/src/themes.ts. Verify with scripts/check-drift.mjs.
const THEMES = {
  MyJio:         { neutral: 'grey',     primary: 'indigo',    secondary: 'saffron',   sparkle: 'green',     brandBG: ['indigo',   300] },
  JioAICloud:    { neutral: 'grey',     primary: 'sky',       secondary: 'marigold',  sparkle: 'mint',      brandBG: ['sky',      700] },
  JioAllianz:    { neutral: 'grey',     primary: 'gold',      secondary: 'purple',    sparkle: 'sky',       brandBG: ['reliance', 300] },
  JioBlackRock:  { neutral: 'grey',     primary: 'gold',      secondary: 'purple',    sparkle: 'sky',       brandBG: ['reliance', 200] },
  JioBusiness:   { neutral: 'grey',     primary: 'purple',    secondary: 'reliance',  sparkle: 'mint',      brandBG: ['reliance', 300] },
  JioCX:         { neutral: 'grey',     primary: 'purple',    secondary: 'navi',      sparkle: 'orange',    brandBG: ['navi',     400] },
  JioFinance:    { neutral: 'grey',     primary: 'gold',      secondary: 'purple',    sparkle: 'sky',       brandBG: ['reliance', 300] },
  JioFit:        { neutral: 'grey',     primary: 'orange',    secondary: 'purple',    sparkle: 'mint',      brandBG: ['purple',   800] },
  JioGames:      { neutral: 'grey',     primary: 'green',     secondary: 'mint',      sparkle: 'marigold',  brandBG: ['green',    900] },
  JioHealthHub:  { neutral: 'grey',     primary: 'mint',      secondary: 'sky',       sparkle: 'red',       brandBG: ['mint',     2100] },
  JioHome:       { neutral: 'grey',     primary: 'sky',       secondary: 'purple',    sparkle: 'orange',    brandBG: ['purple',   500] },
  JioMart:       { neutral: 'grey',     primary: 'red',       secondary: 'sky',       sparkle: 'green',     brandBG: ['sky',      1000] },
  JioMeals:      { neutral: 'grey',     primary: 'red',       secondary: 'saffron',   sparkle: 'olive',     brandBG: ['olive',    600] },
  JioMessages:   { neutral: 'grey',     primary: 'purple',    secondary: 'yellow',    sparkle: 'green',     brandBG: ['marigold', 1800] },
  JioMobile:     { neutral: 'grey',     primary: 'navi',      secondary: 'sky',       sparkle: 'emerald',   brandBG: ['sky',      1500] },
  JioNews:       { neutral: 'grey',     primary: 'red',       secondary: 'orange',    sparkle: 'sky',       brandBG: ['crimson',  800] },
  JioPC:         { neutral: 'grey',     primary: 'purple',    secondary: 'mint',      sparkle: 'marigold',  brandBG: ['purple',   400] },
  JioSaavn:      { neutral: 'grey',     primary: 'mint',      secondary: 'sky',       sparkle: 'indigo',    brandBG: ['teal',     2100] },
  JioSarthi:     { neutral: 'grey',     primary: 'red',       secondary: 'purple',    sparkle: 'emerald',   brandBG: ['purple',   400] },
  JioStar:       { neutral: 'grey',     primary: 'pink',      secondary: 'purple',    sparkle: 'cobalt',    brandBG: ['reliance', 200] },
  JioThings:     { neutral: 'grey',     primary: 'purple',    secondary: 'mint',      sparkle: 'orange',    brandBG: ['purple',   500] },
  JioTranslate:  { neutral: 'grey',     primary: 'grape',     secondary: 'marigold',  sparkle: 'violet',    brandBG: ['marigold', 1800] },
  JioTV:         { neutral: 'grey',     primary: 'red',       secondary: 'crimson',   sparkle: 'sky',       brandBG: ['crimson',  800] },
  JioWave:       { neutral: 'grey',     primary: 'purple',    secondary: 'sky',       sparkle: 'mint',      brandBG: ['purple',   200] },
  JioWorkspace:  { neutral: 'grey',     primary: 'purple',    secondary: 'reliance',  sparkle: 'marigold',  brandBG: ['reliance', 300] },
  Tira:          { neutral: 'Neutral',  primary: 'Tira',      secondary: 'Pink',      sparkle: 'Peach',     brandBG: ['Neutral',  200], system: { positive: 'Green', negative: 'Red', warning: 'Amber' } },
}

function scaleNameFor(brand, themeName, appearance) {
  const theme = THEMES[themeName] || (brand === 'Tira' ? THEMES.Tira : THEMES.MyJio)
  if (appearance === 'neutral') return theme.neutral
  if (appearance === 'primary' || appearance === 'secondary' ||
      appearance === 'sparkle') return theme[appearance]
  if (appearance === 'brandBG') return theme.brandBG[0]
  // System appearances resolve to a same-named scale unless the theme remaps
  // them (Tira does: positive → Green, negative → Red, warning → Amber).
  return (theme.system && theme.system[appearance]) || appearance
}

/** Only brandBG honours its pinned step at render time. primary/secondary/
 *  sparkle carry a step too, but it is metadata — they anchor on scale.base.
 *  brandBG is the brand's signature background colour, so its exact step is
 *  load-bearing (MyJio = indigo 300, not indigo's base of 600). */
function brandBGPin(themeName) {
  const theme = THEMES[themeName]
  return theme ? theme.brandBG[1] : null
}

// ── Run ────────────────────────────────────────────────────────────────────
try {
  const roots = CONFIG.scope === 'page'
    ? figma.currentPage.children
    : figma.currentPage.selection
  if (!roots.length) {
    return { error: 'Nothing to cascade — select a frame, or set scope to "page".', report }
  }
  for (const r of roots) {
    const dark = readMode(r, COLL.COLOUR_MODE) === 'dark'
    await cascade(r, dark ? 200 : 2500, readMode(r, COLL.APPEARANCE) || 'neutral', 0)
  }
} finally {
  probe.remove()
}

report.summary = report.mode + ': visited ' + report.visited + ', wrote ' + report.writes +
  ', skipped ' + report.skipped + ' fillless' +
  (report.mismatches.length ? ', ' + report.mismatches.length + ' MISMATCHES' : '')
return report
```
