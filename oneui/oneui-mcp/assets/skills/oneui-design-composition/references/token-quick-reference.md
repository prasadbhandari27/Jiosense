# Token Quick Reference

Compact lookup tables for the most commonly needed design tokens. All values shown are S (mobile) / default density. Values scale automatically per breakpoint and density.

---

## Spacing Tokens

All spacing aliases map to dimension f-steps. `Spacing-M` (f0) = base unit.

| Token | F-Step | Mobile Default | Common Use |
|-------|--------|----------------|------------|
| `--Spacing-0` | -- | 0px | Zero gap |
| `--Spacing-0-5` | f-7 | 2px | Hairline gaps |
| `--Spacing-1` | f-6 | 4px | Icon-to-text, micro gaps |
| `--Spacing-1-5` | f-5 | 6px | Tight internal padding |
| `--Spacing-2` | f-4 | 8px | Between chips, small gaps |
| `--Spacing-2-5` | f-3 | 10px | Compact component padding |
| `--Spacing-3` | f-2 | 12px | Small component padding |
| `--Spacing-3-5` | f-1 | 14px | Between related items |
| `--Spacing-4` | f0 | 16px | Standard padding, grid gap |
| `--Spacing-4-5` | f1 | 18px | Between components |
| `--Spacing-5` | f2 | 20px | Comfortable component gap |
| `--Spacing-6` | f3 | 24px | Between component groups |
| `--Spacing-7` | f4 | 28px | Section internal padding |
| `--Spacing-8` | f5 | 32px | Between card groups |
| `--Spacing-9` | f6 | 36px | Section gap |
| `--Spacing-10` | f7 | 40px | Major section gap |
| `--Spacing-12` | f8 | 48px | Page section separator |
| `--Spacing-14` | f9 | 56px | Large separator |
| `--Spacing-16` | f10 | 64px | Major page separator |
| `--Spacing-18` | f11 | 72px | Hero padding |
| `--Spacing-20` | f12 | 80px | Large hero padding |
| `--Spacing-24` | f13 | 96px | Extra-large spacing |
| `--Spacing-28` | f14 | 112px | Cinematic spacing |
| `--Spacing-32` | f15 | 128px | Maximum section spacing |
| `--Spacing-40` | f16 | 160px | Extreme spacing |
| `--Spacing-Margin` | Grid | 16px (mobile) | Page margin (auto per platform) |
| `--Spacing-Gutter` | Grid | 8px (mobile) | Column gutter (auto per platform) |

---

## Typography Tokens

### Display (4 sizes) — Decorative headlines, hero text

| Token | F-Step | Mobile Default | Weight |
|-------|--------|----------------|--------|
| `--Display-XL-FontSize` | f8 | 48px | 900 (`--Display-XL-FontWeight`) |
| `--Display-L-FontSize` | f7 | 40px | 900 (`--Display-L-FontWeight`) |
| `--Display-M-FontSize` | f6 | 36px | 900 (`--Display-M-FontWeight`) |
| `--Display-S-FontSize` | f5 | 32px | 900 (`--Display-S-FontWeight`) |

Display and Headline grow at the L breakpoint (≥991px): Display XL→f12 (80px),
L→f10 (64px), M→f8 (48px), S→f6 (36px).

Line height offset: 0 (tight). Example: `--Display-L-LineHeight: var(--Dimension-f7)` = 40px

### Headline (3 sizes) — Page titles, major section headings

| Token | F-Step | Mobile Default | Weight |
|-------|--------|----------------|--------|
| `--Headline-L-FontSize` | f3 | 24px | 900 |
| `--Headline-M-FontSize` | f2 | 20px | 900 |
| `--Headline-S-FontSize` | f0 | 16px | 850 (optical sizing on) |

Line height offset: 0 (tight).

### Title (3 sizes) — Section headings, card titles

| Token | F-Step | Mobile Default | Weight |
|-------|--------|----------------|--------|
| `--Title-L-FontSize` | f2 | 20px | 800 |
| `--Title-M-FontSize` | f0 | 16px | 800 |
| `--Title-S-FontSize` | f-2 | 12px | 750 (optical sizing on) |

Line height offset: +1. Example: `--Title-M-LineHeight: var(--Dimension-f1)` = 18px

### Body (6 sizes) — Paragraphs, descriptions, helper text

| Token | F-Step | Mobile Default |
|-------|--------|----------------|
| `--Body-XL-FontSize` | f2 | 20px |
| `--Body-L-FontSize` | f1 | 18px |
| `--Body-M-FontSize` | f0 | 16px |
| `--Body-S-FontSize` | f-1 | 14px |
| `--Body-XS-FontSize` | f-2 | 12px |
| `--Body-2XS-FontSize` | f-3 | 10px |

Emphasis weights: `--Body-FontWeight-High: 700`, `--Body-FontWeight-Medium: 500`, `--Body-FontWeight-Low: 400`
Line height offset: +3 rungs up the scale ladder. Example: `--Body-M-LineHeight: var(--Dimension-f2-5)` = 22px (the +3 count crosses the half-step)

### Label (7 sizes) — Buttons, chips, tabs, navigation, form labels

| Token | F-Step | Mobile Default |
|-------|--------|----------------|
| `--Label-XL-FontSize` | f2 | 20px |
| `--Label-L-FontSize` | f1 | 18px |
| `--Label-M-FontSize` | f0 | 16px |
| `--Label-S-FontSize` | f-1 | 14px |
| `--Label-XS-FontSize` | f-2 | 12px |
| `--Label-2XS-FontSize` | f-3 | 10px |
| `--Label-3XS-FontSize` | f-4 | 8px |

Emphasis weights: `--Label-FontWeight-High: 700`, `--Label-FontWeight-Medium: 500`, `--Label-FontWeight-Low: 400`
Line height offset: 0 (compact). Example: `--Label-M-LineHeight: var(--Dimension-f0)` = 16px

### Code (5 sizes) — Monospace text

| Token | F-Step | Mobile Default |
|-------|--------|----------------|
| `--Code-M-FontSize` | f0 | 16px |
| `--Code-S-FontSize` | f-1 | 14px |
| `--Code-XS-FontSize` | f-2 | 12px |
| `--Code-2XS-FontSize` | f-3 | 10px |
| `--Code-3XS-FontSize` | f-4 | 8px |

Font: `--Typography-Font-Code` (JetBrains Mono). Line height offset: +2.

### Font Families

| Token | Default |
|-------|---------|
| `--Typography-Font-Primary` | JioType Var (Jio brand) / Inter (platform default) |
| `--Typography-Font-Code` | JetBrains Mono, Fira Code, SF Mono, Consolas |

### Letter Spacing

| Token | Value | Use |
|-------|-------|-----|
| `--Typography-LetterSpacing-Tight` | -0.02em | Display headlines |
| `--Typography-LetterSpacing-Normal` | 0 | Default |
| `--Typography-LetterSpacing-Wide` | 0.025em | Uppercase labels |
| `--Typography-LetterSpacing-Wider` | 0.05em | Small caps |

---

## Shape Tokens

| Token | Value | Use |
|-------|-------|-----|
| `--Shape-Pill` | 9999px | Buttons, chips, avatars, toggles |
| `--Shape-0` | 0px | Sharp edges, full-bleed |
| `--Shape-0-5` | f-7 = 2px | Minimal rounding |
| `--Shape-1` | f-6 = 4px | Subtle rounding |
| `--Shape-1-5` | f-5 = 6px | Small element rounding |
| `--Shape-2` | f-4 = 8px | Input fields, small containers |
| `--Shape-2-5` | f-3 = 10px | Medium-small containers |
| `--Shape-3` | f-2 = 12px | Small cards |
| `--Shape-3-5` | f-1 = 14px | Medium cards |
| `--Shape-4` | f0 = 16px | Standard cards, FAB |
| `--Shape-4-5` | f1 = 18px | Large cards, modals |
| `--Shape-5` | f2 = 20px | Large containers |
| `--Shape-5-5` | f2-5 = 22px | Large containers (half-step) |
| `--Shape-6` | f3 = 24px | Extra-large containers |
| `--Shape-7` | f4 = 28px | Hero sections |
| `--Shape-8` | f5 = 32px | Large panels |
| `--Shape-9` | f6 = 36px | Full-width cards |
| `--Shape-10` | f7 = 40px | Maximum scale rounding |

---

## Elevation Tokens

| Token | CSS Value | Use |
|-------|-----------|-----|
| `--Elevation-0` | none | Flat UI (default) |
| `--Elevation-1` | `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)` | Sticky header, card hover |
| `--Elevation-2` | `0 3px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)` | Floating card, tooltip |
| `--Elevation-3` | `0 10px 20px rgba(0,0,0,0.12), 0 3px 6px rgba(0,0,0,0.08)` | FAB, popover, dropdown |
| `--Elevation-4` | `0 15px 25px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.08)` | FAB hover |
| `--Elevation-5` | `0 20px 40px rgba(0,0,0,0.2), 0 8px 16px rgba(0,0,0,0.1)` | Modal, sheet |

---

## Motion Tokens

### Durations

| Token | Value | Use |
|-------|-------|-----|
| `--Motion-Duration-2XS` | 60ms | Rare — supporting part inside a larger choreography only |
| `--Motion-Duration-XS` | 90ms | Rare — supporting part inside a larger choreography only |
| `--Motion-Duration-S` | 135ms | Rare — supporting part inside a larger choreography only |
| `--Motion-Duration-M` | 200ms | Small changes — a hover, a tap, a button scaling down |
| `--Motion-Duration-L` | 300ms | The default |
| `--Motion-Duration-XL` | 450ms | Larger changes — a bottom sheet, a carousel moving |
| `--Motion-Duration-2XL` | 675ms | Larger still |
| `--Motion-Duration-3XL` | 1015ms | Extremely large changes and long choreographies |

Always write the Moderate token above — never `-Subtle` by hand. `--Motion-Duration-Subtle-{2XS..3XL}` (same steps, smaller values) is swapped in automatically under `prefers-reduced-motion: reduce`.

### Easing

| Token | Value | Use |
|-------|-------|-----|
| `--Motion-Easing-Entrance-Moderate` | `cubic-bezier(0.25, 0.8, 0.5, 1)` | Elements entering view |
| `--Motion-Easing-Exit-Moderate` | `cubic-bezier(0.7, 0.1, 0.9, 0.7)` | Elements leaving view |
| `--Motion-Easing-Transition-Moderate` | `cubic-bezier(0.5, 0, 0.3, 1)` | General property transitions |
| `--Motion-Easing-Bounce-Moderate` | `cubic-bezier(0.2, 1.4, 0.3, 1)` | Overshoot / emphasis |
| `--Motion-Easing-Linear` | `linear` | Continuous animations (e.g. a fling release) |

Each has a `-Subtle` counterpart (same name, `-Subtle` suffix) swapped in automatically under `prefers-reduced-motion: reduce` — never hand-pick it.

---

## Color Role Tokens (11 Appearance Roles)

Each role generates tokens with this pattern: `--{Role}-{Mode}-{OnColour}`

| Role | CSS Prefix | Purpose |
|------|-----------|---------|
| Primary | `--Primary-*` | Main brand accent, action color |
| Secondary | `--Secondary-*` | Supporting accent, selection color |
| Tertiary | `--Tertiary-*` | Third accent (rarely used) |
| Quaternary | `--Quaternary-*` | Fourth accent (rarely used) |
| Neutral | `--Neutral-*` | Grayscale, de-emphasized UI |
| Sparkle | `--Sparkle-*` | Celebration, success, delight |
| Brand-Bg | `--Brand-Bg-*` | Brand background accent |
| Positive | `--Positive-*` | Success, confirmation (green) |
| Negative | `--Negative-*` | Error, destructive (red) |
| Warning | `--Warning-*` | Caution, attention (amber) |
| Informative | `--Informative-*` | Neutral info (blue) |

### Common Token Suffixes per Role

Use the unified role-explicit tokens. Every role exposes the same suffix set; substitute any role prefix from the table above.

| Suffix | Token Example | Purpose |
|--------|--------------|---------|
| `-Bold` | `--Primary-Bold` | Bold fill (button bg, chip bg, hero surface) |
| `-Bold-High` | `--Primary-Bold-High` | High-emphasis text on bold fill |
| `-Bold-Medium` | `--Primary-Bold-Medium` | Medium-emphasis text on bold fill |
| `-Bold-TintedA11y` | `--Primary-Bold-TintedA11y` | Accessible tinted text on bold fill |
| `-Subtle` | `--Primary-Subtle` | Subtle tinted fill (card bg, chip bg) |
| `-Moderate` | `--Primary-Moderate` | Mid-weight tinted fill |
| `-Minimal` | `--Primary-Minimal` | Minimal tinted fill (alternating row) |
| `-High` | `--Primary-High` | High-emphasis text on default/light surface |
| `-Medium-Text` | `--Primary-Medium-Text` | Medium-emphasis text |
| `-Low` | `--Primary-Low` | Low-emphasis text (timestamps, metadata) |
| `-Tinted` | `--Primary-Tinted` | Decorative accent text |
| `-TintedA11y` | `--Primary-TintedA11y` | Accessible accent text (≥4.5:1) |
| `-Stroke-Medium` | `--Primary-Stroke-Medium` | Default border |
| `-Stroke-Low` | `--Primary-Stroke-Low` | Subtle border |
| `-Hover` / `-Pressed` | `--Primary-Hover` | Hover/pressed overlay (default surface) |
| `-Bold-Hover` / `-Bold-Pressed` | `--Primary-Bold-Hover` | Hover/pressed on bold fills |
| `-Subtle-Hover` / `-Subtle-Pressed` | `--Primary-Subtle-Hover` | Hover/pressed on subtle fills |

---

## Stroke Tokens

| Token | Value | Use |
|-------|-------|-----|
| `--Stroke-None` | 0px | No border |
| `--Stroke-S` | 0.5px | Hairline borders |
| `--Stroke-M` | 1px | Standard borders |
| `--Stroke-L` | 1.5px | Medium borders |
| `--Stroke-XL` | 2px | Emphasis borders, focus rings |

## Border Color Tokens

| Token | Use |
|-------|-----|
| `--Border-Subtle` | Subtle card borders, dividers |
| `--Border-Default` | Standard input borders |

## Text Color Tokens

| Token | Use |
|-------|-----|
| `--Text-High` | Primary text (near-black on light) |
| `--Text-Medium` | Secondary text (medium grey) |
| `--Text-Low` | Tertiary text, captions (light grey) |
| `--Text-OnBold-High` | Text on bold surfaces (white on dark) |
