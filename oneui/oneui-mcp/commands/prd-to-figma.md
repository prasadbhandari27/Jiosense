---
name: prd-to-figma
description: Recreate a filled OneUI PRD (docs/prds/<name>.md or <name>-web.md) as a Figma mobile (360) or web (1280) screen on the shared temporary Untitled file using real OneUI / Micropatterns components. Use when the user wants a PRD built as a Figma frame (not code).
---

# /oneui:prd-to-figma

Recreate a **filled** PRD as a Figma **mobile or web** screen on the temporary working file.

## Prerequisite

PRD must already look like `docs/prds/jioastro-home.md` or `docs/prds/jiohealth-book-checkup-web.md` (§1–§7).  
One-liners / thin briefs → **`/oneui:expand-prd`** first, wait for user confirmation, then this command.

## Flow

1. Invoke the `oneui-prd-to-figma` MCP prompt (server `oneui`) with:
   - `prd` — path like `docs/prds/jiogames-home.md` / `docs/prds/<slug>-web.md` **or** the filled PRD markdown
   - optional `targetFile` — defaults to the Untitled temp file
2. **Always** call `get_skill("prd-to-figma")` and follow it end-to-end.
3. Detect platform: filename `-web.md` or §2 `Platform: web` → **1280** + WebHeader; else **360** + typical mobile chrome.
4. For any tinted region, also call `get_skill("figma-surface-cascade")`.
5. Build with Figma MCP (`use_figma`, `search_design_system`, `upload_assets`,
   `get_screenshot`) — real component instances only.
6. Save `docs/prds/refs/<prd-basename>-rebuild.png` and return the frame URL.

## Defaults

- Target: `https://www.figma.com/design/Ors8Y9cGtm1J1YelpT0I51/Untitled` (Page 1, right of existing)
- Frame: **360** wide (mobile) or **1280** wide (web / `*-web.md`); hug height
- Web: WebHeader, no BottomNav by default; prefer 2-column forms on 1280
- WebHeader: set nested PrimaryNav `⛔️=1440`, resize to 1280 + FILL (never leave default 360)
- Never clone PluginGen / reference frames — recreate from PRD only
- No fake chrome / hex fills on surfaces / fake carousel arrows

## Related

- Skill `prd-to-figma` (authoritative rules)
- Skill `expand-prd` / `/oneui:expand-prd` — brief → PRD mobile + web (before this)
- Skill `figma-surface-cascade` (tinted surfaces)
- Web exemplars: `docs/prds/jiohealth-book-checkup-web.md`, `docs/prds/jiohome-device-control-web.md`, `docs/prds/jiomart-home-web.md`
- `/oneui:prd` — blank PRD template
- `/oneui:build-from-prd` — PRD → **code** (React / RN), not Figma
