# Typography Scale — PRD font-size → Text IR (variant · size · weight)

Use this to turn a PRD/design text spec (a **px size + a weight word**, e.g.
*"extrablack, 16px"*, *"medium 14px caption"*, *"bold 20px section title"*) into the
exact **`Text` component IR** the codegen backend accepts.

**Target IR node** (`codegen_from_ir` / PRD→Code, `@oneui/ui-native`):

```jsonc
{ "kind": "component", "component": "Text",
  "text": "Welcome back",
  "props": { "variant": "headline", "size": "S" } }   // heading → no weight prop
{ "kind": "component", "component": "Text",
  "text": "Order delivered on Tuesday",
  "props": { "variant": "body", "size": "S", "weight": "low" } }  // body/label/code → weight prop
```

`Text` props (only these are real — the catalog check rejects `fontSize`,
`fontWeight`, `color`):

| Prop | Values | Notes |
|------|--------|-------|
| `variant` **(req)** | `display` `headline` `title` `body` `label` `code` | the **role** — carries meaning |
| `size` **(req)** | `XL` `L` `M` `S` `XS` `2XS` `3XS` (uppercase, per-variant subset below) | the size step |
| `weight` | `high` (700) · `medium` (500) · `low` (400) | **ONLY** body/label/code. Ignored for display/headline/title (their weight is fixed by variant+size). |
| `appearance` | `primary` … `neutral` … (9 roles) + `auto` | colour role (default `auto`) |
| `attention` | `high` `medium` `low` `tintedA11y` | emphasis / content-token slot |
| `maxLines` | integer | truncation |

`children` is the text string. Never emit `fontSize`/`fontWeight`/`color`.

---

## Step 1 — normalise the PRD weight word to a number

| PRD word(s) | Weight # | Bucket |
|-------------|----------|--------|
| thin, light | 300 | light → treat as regular |
| regular, normal, book | 400 | **regular** |
| medium | 500 | **medium** |
| semibold, demibold | 600 | → treat as bold |
| bold | 700 | **bold** |
| extrabold, heavy | 800 | **heavy** |
| black, extrablack, ultra | 900 | **black** |

- **black / heavy (≥800)** → the text is a **fixed-weight role** (Display / Headline / Title).
  Do **not** emit a `weight` prop.
- **bold / medium / regular (≤700)** → a **variable-weight role** (Body / Label / Code).
  Emit `weight`: 700→`high`, 500→`medium`, 400→`low`.

## Step 2 — pick variant + size from the px (and the weight bucket)

Master lookup (mobile / S). A px is shared across roles — the **weight bucket** and the
**semantic use** decide the row.

| px | f-step | Black/Heavy (≥800) → fixed-weight role | Bold/Medium/Regular (≤700) → variable-weight role |
|----|--------|----------------------------------------|---------------------------------------------------|
| 48 | f8  | `display` `XL` (900) | — |
| 40 | f7  | `display` `L` (900) | — |
| 36 | f6  | `display` `M` (900) | — |
| 32 | f5  | `display` `S` (900) | — |
| 28 | f4  | `headline` `L` **(desktop only; mobile is 24)** | — |
| 24 | f3  | `headline` `L` (900) | — |
| 20 | f2  | `headline` `M` (900) · `title` `L` (800) | `body` `XL` · `label` `XL` |
| 18 | f1  | — | `body` `L` · `label` `L` |
| 16 | f0  | `headline` `S` (850) · `title` `M` (800) | `body` `M` · `label` `M` · `code` `M` |
| 14 | f-1 | — | `body` `S` · `label` `S` · `code` `S` |
| 12 | f-2 | `title` `S` (750) | `body` `XS` · `label` `XS` · `code` `XS` |
| 10 | f-3 | — | `body` `2XS` · `label` `2XS` · `code` `2XS` |
| 8  | f-4 | — | `label` `3XS` · `code` `3XS` |

**Choosing among fixed-weight candidates at the same px:** pick by exact weight —
900 → `display`/`headline`, 800 → `title`. At 16px, 850 → `headline S`, 800 → `title M`;
for a heavier word (black/extrablack, ~900) take the heaviest available → `headline S`.

**Choosing among variable-weight candidates (`body`/`label`/`code`):** by **use** —
running prose / paragraphs / descriptions / helper text → `body`; any standalone UI
string (button, chip, tab, nav item, badge, form/input label) → `label`; monospace /
code / numeric mono → `code`. Then set `weight` from the bucket.

**No exact px match?** Snap to the nearest row (the scale is discrete: 8·10·12·14·16·18·20·24·28·32·36·40·48).

## Step 3 — emit the IR

- Fixed-weight role → `props: { variant, size }` (omit `weight`).
- Variable-weight role → `props: { variant, size, weight }`.
- Colour: add `appearance` only if the PRD names a role (primary/positive/…); add
  `attention: "low"` for de-emphasised/secondary text. Default `auto`/`medium` otherwise.

---

## Worked examples

| PRD says | Weight # / bucket | Result IR props |
|----------|-------------------|-----------------|
| **"extrablack font, 16px"** | 900 / black → fixed | `{ variant: "headline", size: "S" }` |
| "black 24px page title" | 900 / black → fixed | `{ variant: "headline", size: "L" }` |
| "extrabold 20px section header" | 800 / heavy → fixed | `{ variant: "title", size: "L" }` |
| "bold 20px lead paragraph" | 700 / bold → variable, prose | `{ variant: "body", size: "XL", weight: "high" }` |
| "medium 16px button label" | 500 / medium → variable, UI | `{ variant: "label", size: "M", weight: "medium" }` |
| "regular 14px helper text" | 400 / regular → variable, prose | `{ variant: "body", size: "S", weight: "low" }` |
| "12px muted timestamp" | (unstated → regular) variable, meta | `{ variant: "label", size: "XS", weight: "low", attention: "low" }` |
| "black 48px hero" | 900 / black → fixed | `{ variant: "display", size: "XL" }` |
| "medium 14px mono code" | 500 / medium → variable, mono | `{ variant: "code", size: "S", weight: "medium" }` |

---

## Full per-variant scale (reference)

Verified against the Figma *OneUI Foundations 4.0* specimen (node `3520-145998`,
"S / 360") and the shipped tokens (`packages/tokens/src/css/typography/typography.css`).
`fs` = font-size, `lh` = line-height, both mobile / S.

| variant | sizes → fs / lh (px) · weight |
|---------|--------------------------------|
| `display` | XL 48/48 · L 40/40 · M 36/36 · S 32/32 · **weight 900 (fixed)** |
| `headline` | L 24/24 (900) · M 20/20 (900) · S 16/16 (850) |
| `title` | L 20/22 (800) · M 16/18 (800) · S 12/14 (750) |
| `body` | XL 20/28 · L 18/24 · M 16/22 · S 14/20 · XS 12/18 · 2XS 10/16 · **weight 400/500/700** |
| `label` | XL 20/20 · L 18/18 · M 16/16 · S 14/14 · XS 12/12 · 2XS 10/10 · 3XS 8/8 · **weight 400/500/700** |
| `code` | M 16/20 · S 14/18 · XS 12/16 · 2XS 10/14 · 3XS 8/12 · **weight 400/500/700** · font `--Typography-Font-Code` |

**28 variants** (Display 4 · Headline 3 · Title 3 · Body 6 · Label 7 · Code 5).

### Responsive note
`display` and `headline` are the only roles that grow at `[data-Breakpoint="L"]`
(desktop ≥991px): Headline L 24→**28**, M 20→22, S 16→18; Display XL 48→80, L 40→64,
M 36→48, S 32→36. Author for **mobile** (the values above); the cascade handles the jump.
This is why the deprecated Figma "S" specimen shows Headline-L = 28 (a desktop value).

---

## Note on the Figma→Code auto-resolver

`figma_to_code` derives Text props automatically via `typographyToTextProps`, whose
fontSize→variant heuristic is **coarse** (buckets by ≥30/≥27/≥24…, only emits L/M/S,
never XL/XS/2XS/3XS, and can mislabel — e.g. 24px→headline M when it is Headline **L**).
When you author the IR yourself for **PRD→Code**, use the tables above instead — they
are the accurate mapping. If a Figma-generated screen has wrong type variants, re-map
with this reference.
