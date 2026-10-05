---
name: expand-prd
description: >
  Expand any brief (one-liner, rough notes, or incomplete PRD) into a filled
  OneUI PRD matching docs/prds/*.md — for mobile and/or web — then STOP for
  human confirmation before Figma. Use when the user says "build an ecommerce
  page", "TV home screen", "make a PRD", "expand this brief", "restructure the
  PRD", hands a one-line ask before design, or before prd-to-figma when the
  input lacks §1–§7 structure. Owns PRD authoring only; after confirmation
  hand off to `prd-to-figma` (Figma) or `/oneui:build-from-prd` (code).
---

# Expand brief → filled OneUI PRD

**First step** of the design path. Never jump to Figma or codegen until the
human confirms the written PRD(s).

```text
brief / one-liner / thin PRD
        │
        ▼
  expand-prd  →  docs/prds/<slug>[-web].md   (STOP — ask confirm)
        │
        ▼ (user says "looks good" / "go" / "generate figma")
  prd-to-figma  →  Figma frame(s)
```

## When to run

| Input | Action |
|-------|--------|
| One-liner (“build a TV home”, “ecommerce page”) | **Always** expand first |
| Partial notes / bullet dump | Expand + fill gaps; mark assumptions |
| Already matches `docs/prds/*.md` §1–§7 | Skip expand; offer `prd-to-figma` |
| User says “PRD then Figma” / “design from this idea” | Expand → confirm → Figma |

## Hard rules

1. **STOP after writing PRDs** — show paths + short summary; ask for confirmation.
   Do **not** call `prd-to-figma` / `use_figma` until the user confirms.
2. **Match the house style** — same section order and density as
   `docs/prds/jioastro-home.md`, `jiocinema-search.md`, `jiohome-device-control.md`, etc.
3. **Real OneUI components only** in §3 / §4 — name HeaderNative, ChipGroup,
   SegmentedControl, Surface, BottomNav, WebHeader, … never “fake search bar”.
4. **§3a Deferred is mandatory** — list what you are *not* building so later
   steps do not invent it.
5. **Platforms** — produce mobile and/or web as specified (default below).
6. **One primary screen per file** for Figma handoff (multi-screen flows =
   multiple files, or clearly numbered screens in one file if the user wants a flow).

## Platform defaults

| User says | Produce |
|-----------|---------|
| nothing / “screen” / “page” | **Both** mobile + web PRDs |
| “mobile” / “app” / “RN” / “native” | Mobile only |
| “web” / “desktop” / “responsive web” | Web only |
| “both” | Both |

| | Mobile | Web |
|--|--------|-----|
| Filename | `docs/prds/<slug>.md` | `docs/prds/<slug>-web.md` |
| Frame (for later Figma) | **360** × hug | **1280** × hug (desktop content width) |
| Chrome | HeaderNative + BottomNav (typical) | WebHeader / top nav; **no** BottomNav unless product is mobile-web |
| Density | Compact rails, thumb reach | Wider grids, side-by-side filters, denser tables ok |

Slug: lowercase kebab from product + screen, e.g. `jiotv-home`, `jiomart-plp-web`.

## Workflow

Copy and track:

```
Expand-PRD progress:
- [ ] 1. Parse brief + platform intent
- [ ] 2. Read 1–2 exemplar PRDs from docs/prds/ (same product family if any)
- [ ] 3. Draft §1–§7 (mobile and/or web)
- [ ] 4. Write file(s) under docs/prds/
- [ ] 5. Summarize + ask confirmation (STOP)
- [ ] 6. On confirm only → load prd-to-figma per file
```

### 1. Parse the brief

Extract or invent (and **label as assumption**):

- Product / brand (default **jio** + theme guess: jiomart, jiotv, jiocinema, …)
- Screen purpose (home, search, filters, control, checkout…)
- Must-have sections (hero, rails, filters, forms…)
- Platform(s)

If the brief is only a product name (“JioTV”), assume a **home** discovery screen.

### 2. Read exemplars

Skim the closest existing files for tone and component vocabulary:

- Homes: `jioastro-home.md`, `jiogames-home.md`, `jionews-home.md`, `jiosaavn-home.md`, `jiotv-home.md`
- Search / filters: `jiocinema-search.md`, `jiomart-filters.md`
- Controls / flows: `jiohome-device-control.md`, `jiopay-send-money.md`, `jiohealth-book-checkup.md`

### 3. Author the PRD

Use the template in [references/template.md](references/template.md).
Required sections (same numbering as exemplars used for Figma):

| § | Content |
|---|---------|
| 1 Goal | 1–2 sentences: who + what + why |
| 2 Brand & theme | brand, theme slug, mode (default light only v1) |
| 3 Scope v1 | Single screen size, real components, chrome list |
| 3a Deferred | Explicit non-goals |
| 4 Screens & flow | Numbered sections **top → bottom** with component names + sample copy |
| 5 Data | Stub labels, counts, selected states |
| 6 Constraints *or* Visual references | Tokens, Surface cascade, width; optional refs paths |
| 7 Acceptance | Checked into `docs/prds/…`; clear enough for recreation |

**Section 4 quality bar** (this is what Figma consumes):

- Ordered list `1. **Header…** 2. **Hero…** … N. **BottomNav / footer**`
- Exact tab / chip / button labels
- Surface modes (`subtle`, `bold`, …) where tinted
- Attention levels for CTAs (high / medium / low)
- Stub routes for primary actions

**Web-specific §4 cues:**

- Prefer **WebHeader** / primary+secondary top nav over HeaderNative+BottomNav
- Wider content: 2–4 column grids, filter **sidebar** or top ChipGroup + results
- Footer legal / links optional; sticky page header ok
- Call out breakpoint intent: desktop 1280 content (mobile-web is a separate PRD)

### 4. Write files

```bash
# examples
docs/prds/acme-shop-home.md        # mobile
docs/prds/acme-shop-home-web.md    # web
```

Do not invent `docs/prds/refs/` assets yet unless the user provided images.

### 5. Confirmation message (mandatory)

After writing, reply with roughly:

```markdown
## PRDs ready for review

- Mobile: `docs/prds/<slug>.md` — <one-line summary>
- Web: `docs/prds/<slug>-web.md` — <one-line summary>

### Assumptions
- …

### Deferred (not in v1)
- …

Confirm to generate Figma frames (`prd-to-figma`), or tell me what to change.
```

**STOP.** Wait for explicit go-ahead.

### 6. After confirmation

For each confirmed file:

1. `get_skill("prd-to-figma")` (and `figma-surface-cascade` for tinted regions)
2. Mobile → 360-wide frame; Web → **1280**-wide frame (override prd-to-figma’s 360 default; name frame `… (web from PRD)`)
3. Same temporary file / placement rules as `prd-to-figma`

## Anti-patterns

- Jumping to Figma from a one-liner
- Vague §4 (“some cards and a button”) — always name components + copy
- Building §3a Deferred items “because they’re nice”
- Web PRD that only duplicates mobile chrome (BottomNav on desktop)
- Skipping Surface intent on tinted heroes/cards

## Related

- Exemplars: `docs/prds/*.md`
- Blank MCP template: `packages/mcp/assets/prd-template.md` / `/oneui:prd`
- Figma: skill `prd-to-figma` · command `/oneui:prd-to-figma`
- Code: `/oneui:build-from-prd`
- Composition judgment: `oneui-design-composition` · `surface`
