---
name: oneui-surface-color-token-mapping
description: >-
  Maps legacy surface colour tokens to OneUI Appearance + Surface variable modes. Given a legacy fill
  token of the form color/{scaleName}/{step}, determines which `01 Appearance` mode (by looking up
  the scale name in the active theme's sections) and which `03 Surface` mode (by classifying the step
  number) to set on the OneUI frame. Handles two step systems: palette steps (multiples of 100) and
  compact steps (multiples of 10, not 100). Use whenever a reference frame carries a fill with a
  legacy colour token and the rebuild frame needs the equivalent OneUI modes set.
---

# Surface colour token mapping — legacy → OneUI

**Global skill.** Loaded automatically by `the `legacy-to-oneui` skill (get_skill "legacy-to-oneui")` and available to
any migration workflow. For the per-component migration routing, see
`get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-migration-figma-agent.md")`.

**Load this skill when:** a reference frame's fill carries a legacy token of the form
`color/{scaleName}/{step}` and you need to determine which `01 Appearance` and `03 Surface` variable
modes to set on the corresponding OneUI frame.

---

## The rule this skill exists to satisfy

**R5 from `the `legacy-to-oneui` skill (get_skill "legacy-to-oneui")` says fills and selection colours on OneUI
instances are read-only.** You never paint a colour onto an OneUI frame. Instead you:

1. Bind the fill to `colour/surface/surface` (the single merged surface variable).
2. Set `01 Appearance` to the correct section (primary, secondary, …).
3. Set `03 Surface` to the correct level (default, minimal, …).

The OneUI alias chain resolves the correct colour from those two modes. This skill tells you **which
modes** to set, derived from the legacy fill token.

---

## Conversion algorithm

```
INPUT:  legacy fill token   →  color/{scaleName}/{step}
        active theme name   →  e.g. "JioAICloud"

STEP 1  Find the theme in the themes lookup table (§ Themes reference).

STEP 2  Find which section owns {scaleName}:
          for each section in [primary, secondary, sparkle, brand-bg, neutral,
                               positive, negative, warning, informative]:
            if theme.{section}.color === scaleName → match

STEP 3  Map section name to OneUI Appearance mode:
          brand-bg → brandBG          (the only rename)
          all others → identity       (primary → primary, neutral → neutral, …)

STEP 4  Classify the step number and map to Surface mode:

          if step % 100 === 0        →  PALETTE STEP   (§ Palette-step mapping)
          else if step % 10 === 0    →  COMPACT STEP   (§ Compact-step mapping)
          else                       →  report INVALID — not on any known grid

STEP 5  On the OneUI frame:
          set  01 Appearance  =  result from step 3
          set  03 Surface     =  result from step 4
          bind fill           →  colour/surface/surface
```

**Appearance is always determined the same way** (steps 1–3) regardless of which step system the
token uses. Only the Surface mode derivation (step 4) branches.

---

## Step-to-surface mapping

### Branch 1 — Palette steps (step is a multiple of 100)

These are the standard 25-step colour scale values (100 through 2500). The surface mode is derived
from the step's position relative to the background.

#### Light mode (`10 Colour mode = light`)

| Legacy step | OneUI `03 Surface` mode | Semantic meaning |
|---:|---|---|
| **2500** | `default` | Page background / root surface |
| **2400** | `minimal` | Lightest visible surface lift |
| **2300** | `subtle` | Soft card / section background |
| **2200** | `moderate` | Mid-emphasis surface |
| **{base}** | `bold` | Brand anchor — the `base` value from the theme section |

#### Dark mode (`10 Colour mode = dark`)

| Legacy step | OneUI `03 Surface` mode | Semantic meaning |
|---:|---|---|
| **200** | `default` | Dark page background / root surface |
| **300** | `minimal` | Lightest visible lift on dark |
| **400** | `subtle` | Soft card on dark |
| **500** | `moderate` | Mid-emphasis surface on dark |
| **{darkerBase}** | `bold` | Brand anchor on dark — the `darkerBase` of the scale |

#### Palette steps that fall outside the standard five

If the step is a multiple of 100 but is **not** one of the five standard values
(2500/2400/2300/2200 for light, or 200/300/400/500 for dark) **and** is not the section's
`base`/`darkerBase`:

1. **Check whether it is the brand-bg section's base.** The `brand-bg` section often uses unusual
   steps (e.g. indigo 300 for MyJio). If the step matches `brand-bg.base`, the mapping is
   `01 Appearance = brandBG`, `03 Surface = bold`.
2. **Mid-range steps** (2100, 2000, 1900, … down to the base) have no direct OneUI surface
   equivalent. Report the gap:
   > LOSSY: palette step {N} has no direct surface mode — snapped to `{nearest}`. Original was
   > between `moderate` (2200) and `bold` ({base}).
3. **Never fall back to a raw fill colour.** The conversion must produce an appearance + surface
   mode pair, or be reported as lossy. A hardcoded hex violates R4.

---

### Branch 2 — Compact steps (step is a multiple of 10, not 100)

Some legacy tokens use a compact step numbering (10, 20, 30, 40, 50, 60, …, 90). The appearance
is determined identically (steps 1–3 of the algorithm). The surface mode uses a different scale:

| Compact step | OneUI `03 Surface` mode |
|---:|---|
| **10** | `default` |
| **20** | `minimal` |
| **30** | `subtle` |
| **40** | `moderate` |
| **50 and above** | `bold` |

**"50 and above" means any compact step ≥ 50** — that is 50, 60, 70, 80, 90 — all map to `bold`.

#### Compact-step decision tree (summary)

```
step = 10  →  03 Surface = default
step = 20  →  03 Surface = minimal
step = 30  →  03 Surface = subtle
step = 40  →  03 Surface = moderate
step ≥ 50  →  03 Surface = bold
```

---

### Other surface modes (not step-derived)

These three `03 Surface` modes cannot be determined from the step number alone. Identify them from
the legacy frame's **visual behaviour**, not its fill token:

| OneUI `03 Surface` mode | When to use |
|---|---|
| `ghost` | The legacy frame is an invisible hit area / tap target with no visible fill |
| `elevated` | The legacy frame is a raised panel — fill is typically `default` (white/dark) **plus** an elevation shadow |
| `blend` | The legacy frame blends into its parent surface (no visible edge) |

---

## Section name → OneUI `01 Appearance` mode

| Theme section key (themes.json) | OneUI `01 Appearance` mode |
|---|---|
| `primary` | `primary` |
| `secondary` | `secondary` |
| `sparkle` | `sparkle` |
| `brand-bg` | `brandBG` |
| `neutral` | `neutral` |
| `positive` | `positive` |
| `negative` | `negative` |
| `warning` | `warning` |
| `informative` | `informative` |

Only `brand-bg` → `brandBG` changes spelling. All others are identity mappings.

---

## Disambiguation: same colour in multiple sections

Some themes use the same scale name in more than one section. Example: **MyJio** uses `indigo` for
both `primary` (base 600) and `brand-bg` (base 300).

When the scale name matches multiple sections, disambiguate by **step first, then visual context**:

| Situation | Resolution |
|---|---|
| Step matches exactly one section's `base` | That section, `bold` |
| Step is a standard surface step and matches multiple sections | Use visual context: page backgrounds → `brandBG` or `neutral`; interactive elements → `primary`; accents → `secondary`/`sparkle` |
| Step matches no section's `base` and is a standard surface step | The section whose brand meaning fits the element's purpose |

When ambiguity cannot be resolved, state both candidates and let the designer decide.

---

## Themes reference — Jio brand

Each row lists the scale name and base step for every section. Use this table to look up which
section a legacy `color/{scaleName}/…` token belongs to under a given theme.

### Theme → section colour mapping

| # | Theme | primary | secondary | sparkle | brand-bg | neutral |
|---:|---|---|---|---|---|---|
| 1 | MyJio | `indigo` 600 | `saffron` 1500 | `green` 1300 | `indigo` 300 | `grey` 200 |
| 2 | JioAICloud | `sky` 1000 | `marigold` 1800 | `mint` 1600 | `indigo` 300 | `grey` 200 |
| 3 | JioBlackRock | `gold` 1700 | `purple` 800 | `sky` 1000 | `indigo` 300 | `grey` 200 |
| 4 | JioBlast | `green` 1300 | `cobalt` 900 | `lotus` 1300 | `indigo` 300 | `grey` 200 |
| 5 | JioBusiness | `purple` 800 | `reliance` 800 | `mint` 1600 | `indigo` 300 | `grey` 200 |
| 6 | JioCX | `purple` 800 | `navi` 700 | `orange` 1600 | `indigo` 300 | `grey` 200 |
| 7 | JioFinance | `gold_finance` 1600 | `purple` 800 | `sky` 1000 | `indigo` 300 | `grey` 200 |
| 8 | JioFit | `orange` 1600 | `purple` 800 | `mint` 1600 | `indigo` 300 | `grey` 200 |
| 9 | JioGames | `green` 1300 | `mint` 1600 | `marigold` 1800 | `indigo` 300 | `grey` 200 |
| 10 | JioHealthHub | `mint` 1600 | `sky` 1000 | `red` 1100 | `indigo` 300 | `grey` 200 |
| 11 | JioHome | `sky` 1000 | `purple` 800 | `orange` 1600 | `indigo` 300 | `grey` 200 |
| 12 | JioMart | `red` 1100 | `sky` 1000 | `green` 1300 | `indigo` 300 | `grey` 200 |
| 13 | JioMeals | `red` 1100 | `saffron` 1500 | `olive` 1000 | `indigo` 300 | `grey` 200 |
| 14 | JioMessages | `purple` 800 | `yellow` 2100 | `green` 1300 | `indigo` 300 | `grey` 200 |
| 15 | JioMobile | `navi` 700 | `sky` 1000 | `emerald` 1400 | `indigo` 300 | `grey` 200 |
| 16 | JioNews | `red` 1100 | `orange` 1600 | `sky` 1000 | `indigo` 300 | `grey` 200 |
| 17 | JioPC | `purple` 800 | `mint` 1600 | `marigold` 1800 | `indigo` 300 | `grey` 200 |
| 18 | JioSaavn | `mint` 1600 | `sky` 1000 | `indigo` 600 | `indigo` 300 | `grey` 200 |
| 19 | JioSarthi | `red` 1100 | `purple` 800 | `emerald` 1400 | `indigo` 300 | `grey` 200 |
| 20 | JioStar | `pink` 1100 | `purple` 800 | `cobalt` 900 | `indigo` 300 | `grey` 200 |
| 21 | JioThings | `purple` 800 | `mint` 1600 | `orange` 1600 | `indigo` 300 | `grey` 200 |
| 22 | JioTranslate | `grape` 700 | `marigold` 1800 | `violet` 1200 | `indigo` 300 | `grey` 200 |
| 23 | JioTV | `red` 1100 | `crimson` 800 | `sky` 1000 | `indigo` 300 | `grey` 200 |
| 24 | JioWave | `purple` 800 | `sky` 1000 | `mint` 1600 | `indigo` 300 | `grey` 200 |
| 25 | JioWorkspace | `purple` 800 | `reliance` 800 | `marigold` 1800 | `indigo` 300 | `grey` 200 |

**System sections are identical across all Jio themes:**

| Section | colour | base |
|---|---|---|
| `positive` | `positive` | 1300 |
| `negative` | `negative` | 1300 |
| `warning` | `warning` | 1300 |
| `informative` | `informative` | 1300 |

### Legacy-only theme names

Some legacy files use theme names that differ from the OneUI names. When the reference file's theme
name does not match an OneUI theme, use this cross-reference:

| Legacy theme name (themes.json) | OneUI theme name | Notes |
|---|---|---|
| `JioFinance New` | `JioFinance` | Renamed |
| `Finance` | `JioFinance` | Short name |
| `Business` | `JioBusiness` | Short name |
| `Home` | `JioHome` | Short name; duplicate entry in legacy data |
| `Mobile` | `JioMobile` | Short name; duplicate entry in legacy data |
| `Shopping` | `JioMart` | Short name |
| `MyJio Legacy` | `MyJio` | Legacy variant — use MyJio for OneUI |
| `Agriculture` | — | No OneUI equivalent; report as NEEDS_HUMAN_INPUT |
| `JioBlast` | — | No OneUI equivalent; report as NEEDS_HUMAN_INPUT |

---

## Worked examples

### Example 1 — palette step, primary minimal (light mode)

**Reference frame fill:** `color/sky/2400`
**Active theme:** JioAICloud

1. Look up JioAICloud → primary.color = `sky`
2. `sky` → **primary** section → `01 Appearance = primary`
3. Step 2400: `2400 % 100 === 0` → **palette step** → `03 Surface = minimal`

**Result:** `01 Appearance = primary`, `03 Surface = minimal`

### Example 2 — palette step, bold primary

**Reference frame fill:** `color/sky/1000`
**Active theme:** JioAICloud

1. JioAICloud primary = `sky`, base = **1000**
2. `sky` → **primary** section
3. Step 1000: palette step, matches primary's base → `03 Surface = bold`

**Result:** `01 Appearance = primary`, `03 Surface = bold`

### Example 3 — compact step, secondary subtle

**Reference frame fill:** `color/marigold/30`
**Active theme:** JioAICloud

1. JioAICloud secondary.color = `marigold`
2. `marigold` → **secondary** section → `01 Appearance = secondary`
3. Step 30: `30 % 100 !== 0`, `30 % 10 === 0` → **compact step** → `03 Surface = subtle`

**Result:** `01 Appearance = secondary`, `03 Surface = subtle`

### Example 4 — compact step, bold (50+)

**Reference frame fill:** `color/mint/60`
**Active theme:** JioAICloud

1. JioAICloud sparkle.color = `mint`
2. `mint` → **sparkle** section → `01 Appearance = sparkle`
3. Step 60: compact step, 60 ≥ 50 → `03 Surface = bold`

**Result:** `01 Appearance = sparkle`, `03 Surface = bold`

### Example 5 — compact step, default

**Reference frame fill:** `color/sky/10`
**Active theme:** JioAICloud

1. JioAICloud primary.color = `sky`
2. `sky` → **primary** section → `01 Appearance = primary`
3. Step 10: compact step → `03 Surface = default`

**Result:** `01 Appearance = primary`, `03 Surface = default`

### Example 6 — palette step, neutral

**Reference frame fill:** `color/grey/2400`
**Active theme:** JioAICloud

1. JioAICloud neutral.color = `grey`
2. `grey` → **neutral** section → `01 Appearance = neutral`
3. Step 2400: palette step → `03 Surface = minimal`

**Result:** `01 Appearance = neutral`, `03 Surface = minimal`

### Example 7 — palette step, system colour

**Reference frame fill:** `color/negative/1300`
**Active theme:** any Jio theme

1. Scale name `negative` → **negative** section (system, same across all themes)
2. negative.base = 1300 → step 1300 = base → `03 Surface = bold`

**Result:** `01 Appearance = negative`, `03 Surface = bold`

### Example 8 — palette step, brand-bg disambiguation

**Reference frame fill:** `color/indigo/300`
**Active theme:** MyJio

1. MyJio: primary.color = `indigo` (base 600), brand-bg.color = `indigo` (base 300)
2. `indigo` matches **both** primary and brand-bg
3. Step 300 = brand-bg's base (not primary's base of 600) → brand-bg wins
4. `01 Appearance = brandBG`, `03 Surface = bold`

**Result:** `01 Appearance = brandBG`, `03 Surface = bold`

### Example 9 — palette step, unmapped intermediate

**Reference frame fill:** `color/sky/1800`
**Active theme:** JioAICloud

1. JioAICloud primary = `sky`, base = 1000
2. Step 1800: palette step, not 2500/2400/2300/2200 and not base (1000)
3. Report:
   > LOSSY: palette step 1800 has no direct surface mode — between `moderate` (2200) and
   > `bold` (1000). Snapped to `moderate`.

---

## Integration with the rebuild workflow

### Where this skill fits

This skill is loaded automatically by `the `legacy-to-oneui` skill (get_skill "legacy-to-oneui")` in Phase 0. It tells
you which modes to set on frames you build during R2 Phase C. It does not replace the foundations
workflow; it feeds into it.

| Rebuild step | This skill's role |
|---|---|
| R2 Phase A — inventory | Read each frame's fill tokens from the reference; note `color/{scale}/{step}` and classify each step as palette or compact |
| R2 Phase B — map | Run the conversion algorithm for each fill; record the result in the mapping table's `Prop-mapping source` column as `oneui-surface-color-token-mapping` |
| R2 Phase C — build | Set `01 Appearance` and `03 Surface` on each frame you create; bind fill to `colour/surface/surface` |
| R4 — token binding audit | Verify every frame fill is bound to `colour/surface/surface` (not a raw hex). The audit's `OWNED` class flags unbound fills on your frames |
| R5 — no restyle | On OneUI component instances, do not set fills. Appearance/Surface modes on instances are fine — only fill/stroke/effects are read-only |

### What you set vs what you do NOT set

| DO set on the frame | Do NOT set |
|---|---|
| `01 Appearance` mode | Raw fill colour (hex, RGB) |
| `03 Surface` mode | `15 Brand` or `13.2 Theme` on instances (these inherit from root) |
| Fill binding → `colour/surface/surface` | Fill overrides on OneUI component instances |

### Parent-step cascade

After setting Appearance and Surface on a frame, the **parent-step cascade** must be applied to its
children. The frame's resolved step becomes the `16 Parent range` / `17 Parent ≤1200` /
`18 Parent >1200` value for its direct children. See `get_skill_reference("oneui-figma-foundations", "references/oneui-figma-cascade.md")`.

---

## Reading legacy fill tokens from Figma

Use this script in `evaluate_script` to extract the fill tokens from a reference frame's
descendants. It returns the bound variable paths so you can feed them into the conversion algorithm.

```javascript
const frame = await figma.getNodeByIdAsync(REFERENCE_FRAME_ID);
const fills = [];

for (const node of [frame, ...frame.findAll(() => true)]) {
  if (!Array.isArray(node.fills)) continue;
  for (let i = 0; i < node.fills.length; i++) {
    const f = node.fills[i];
    if (f.type !== "SOLID") continue;
    const bv = f.boundVariables && f.boundVariables.color;
    if (!bv) continue;
    try {
      const v = await figma.variables.getVariableByIdAsync(bv.id);
      if (v && v.name) {
        fills.push({
          nodeId: node.id,
          nodeName: node.name,
          fillIndex: i,
          variablePath: v.name,
          visible: node.visible,
        });
      }
    } catch (e) {}
  }
}

return JSON.stringify(fills, null, 2);
```

The returned `variablePath` will be of the form `color/{scaleName}/{step}` for legacy tokens. Parse
and classify with:

```
const match = variablePath.match(/^color\/([^/]+)\/(\d+)$/);
if (match) {
  const scaleName = match[1];
  const step = Number(match[2]);
  const branch = step % 100 === 0 ? "palette" : step % 10 === 0 ? "compact" : "invalid";
}
```

---

## Migration checklist

- [ ] Identify the active theme on the reference file (from root frame modes or file metadata)
- [ ] For every frame with a fill in the reference, read the bound variable path
- [ ] Parse each `color/{scaleName}/{step}` token
- [ ] Classify the step: palette (multiple of 100) or compact (multiple of 10, not 100)
- [ ] Look up the scale name in the theme table to find the section (primary/secondary/…)
- [ ] Map section → `01 Appearance` mode (brand-bg → brandBG; all others identity)
- [ ] Map step → `03 Surface` mode using the correct branch:
  - Palette: 2500→default, 2400→minimal, 2300→subtle, 2200→moderate, base→bold
  - Compact: 10→default, 20→minimal, 30→subtle, 40→moderate, ≥50→bold
- [ ] On the OneUI frame: set `01 Appearance`, set `03 Surface`, bind fill to `colour/surface/surface`
- [ ] Report any step that does not match a standard surface level as LOSSY
- [ ] Report any scale name that matches multiple sections, with the disambiguation used
- [ ] Run the parent-step cascade on children after setting Surface modes
- [ ] Verify through the R4 token-binding audit that no raw fills remain
