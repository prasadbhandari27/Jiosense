# PRD body templates (expand-prd)

Copy the matching block. Fill every `‹…›`. Keep numbering identical to `docs/prds/*.md`.

## Mobile (360)

```markdown
# PRD — ‹Product› ‹Screen›

## 1. Goal

‹One or two sentences: who + what + why (one/two taps).›

## 2. Brand & theme

- Brand: jio
- Theme: ‹jiotv | jiomart | jiocinema | …›
- Mode: light only (v1)
- Platform: **mobile** (360pt)

## 3. Scope — THIS version (v1)

- Single mobile screen (360pt wide), scrollable body + fixed bottom nav (if applicable)
- Real OneUI / Micropatterns components only (no fake chrome)
- ‹HeaderNative + end actions + Avatar + secondary tabs if needed›
- ‹Hero / primary region›
- ‹N content sections›
- BottomNav: ‹tab list with selected›

## 3a. Deferred (later / v2) — DO NOT build now

- ‹API, auth, dark mode, infinite scroll, …›

## 4. Screens & flow

### Screen 1: ‹Name› (route: /‹path›)

- Purpose: ‹…›
- Key content / sections (top → bottom):
  1. **HeaderNative** (`secondaryNav=‹true|false›`)
     - Start: ‹Logo | IconButton back›
     - End: ‹IconButtons + Avatar›
     - Secondary tabs: ‹A (selected) · B · C› (if any)
     - Divider
  2. **‹Section›** — …
  3. …
  N. **BottomNav** — ‹selected›; others idle
- OneUI / Micropatterns components: ‹comma list›
- Surface / attention intent:
  - Page: default
  - ‹Tinted regions: Surface mode + appearance›
  - Primary CTA: high attention
- Primary actions → next:
  - ‹label → /route (stub)›

Flow: ‹entry; what stays in-place; what navigates away›.

## 5. Data

- ‹Selected states, sample titles, counts›

## 6. Constraints (defaults — keep unless you change them)

- OneUI / Micropatterns components only; icons via OneUI icon slots / JioIcon.
- Tinted regions → Surface + Appearance/Surface modes (cascade) — no raw hex fills.
- Tokens / variable modes only; WCAG AA; mobile 360 width.
- Real Carousel + PaginationDots when carousels appear — no fake arrows.

## 7. Acceptance criteria

- PRD checked into `docs/prds/‹slug›.md`
- Scope and section order are clear enough for PRD → design recreation without inventing extra screens beyond §3a
```

## Web (1280)

```markdown
# PRD — ‹Product› ‹Screen› (Web)

## 1. Goal

‹Same product intent, desktop / large-viewport interaction.›

## 2. Brand & theme

- Brand: jio
- Theme: ‹…›
- Mode: light only (v1)
- Platform: **web** (1280 content width)

## 3. Scope — THIS version (v1)

- Single web page (1280pt content width), scrollable main + sticky top header
- Real OneUI / Micropatterns components only (no fake chrome)
- WebHeader / top primary nav (not mobile BottomNav)
- ‹Main layout: hero + rails, or sidebar filters + results grid, …›
- Optional page footer

## 3a. Deferred (later / v2) — DO NOT build now

- ‹Responsive collapse to mobile chrome, auth, live API, dark mode, …›

## 4. Screens & flow

### Screen 1: ‹Name› (route: /‹path›)

- Purpose: ‹…›
- Key content / sections (top → bottom):
  1. **WebHeader** (or Header + primary nav)
     - Logo · primary links ‹…› · search IconButton / Input · Avatar
     - Optional secondary tabs under header
     - Divider
  2. **‹Hero or page title row›** — …
  3. **‹Main›** — e.g. 12-col grid: sidebar filters (ChipGroup / CheckboxField / Slider) + results
  4. **‹Rails / tables / forms›** — …
  5. **Footer** (optional) — links / legal Labels
- OneUI / Micropatterns components: ‹comma list — prefer web-capable set›
- Surface / attention intent:
  - Page: default
  - ‹Cards / hero: Surface modes›
- Primary actions → next:
  - ‹…›

Flow: ‹…›.

## 5. Data

- ‹…›

## 6. Constraints (defaults — keep unless you change them)

- OneUI / Micropatterns components only; icons via OneUI icon slots / JioIcon.
- Tinted regions → Surface + cascade — no raw hex fills.
- Tokens only; WCAG AA; **web content width 1280** (hug height).
- No mobile BottomNav on desktop unless the product is explicitly mobile-web.

## 7. Acceptance criteria

- PRD checked into `docs/prds/‹slug›-web.md`
- Clear enough for PRD → Figma web frame without inventing §3a scope
```

## One-liner expansion cheat sheet

| Brief | Default product theme | Default screen |
|-------|----------------------|----------------|
| “TV home” / “JioTV” | jiotv | Live + rails home |
| “ecommerce” / “shop” | jiomart | PLP or home + cart entry |
| “music home” | jiosaavn | Home + player strip |
| “games home” | jiogames | Home + continue / trending |
| “news” | jionews | Home + top stories |
| “search movies” | jiocinema | Search + filters |
| “smart home” / “devices” | jiohome | Room + device controls |
| “pay” / “send money” | jiopay | Amount + payee flow screen |
| “health checkup” | jiohealth | Book checkup form |
| “astrology” | jioastro | Today home |
