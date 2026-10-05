---
name: expand-prd
description: Expand any brief (one-liner or thin notes) into a filled OneUI PRD under docs/prds/ for mobile and/or web, then stop for confirmation before Figma. Use when the user wants a screen designed from a vague ask, or before prd-to-figma when the PRD is incomplete.
---

# /oneui:expand-prd

Turn a brief into a house-style PRD (`docs/prds/*.md`), then wait for confirmation.

## Flow

1. Invoke / load skill **`expand-prd`** (`get_skill("expand-prd")` when using OneUI MCP).
2. Infer platform(s): default **both** mobile + web unless the user specifies one.
3. Write `docs/prds/<slug>.md` and/or `docs/prds/<slug>-web.md` matching exemplars
   (`jioastro-home`, `jiocinema-search`, `jiohome-device-control`, …).
4. **STOP** — summarize paths + assumptions; ask the user to confirm.
5. Only after confirm → `/oneui:prd-to-figma` / skill `prd-to-figma`
   (mobile 360 · web **1280** width).

## Pasteable invoke

```
Expand this into OneUI PRDs (mobile + web), write under docs/prds/, then wait for my OK before Figma:

<brief here>
```

## Related

- Skill `expand-prd` (authoritative)
- `/oneui:prd` — blank template only
- `/oneui:prd-to-figma` — Figma after a **confirmed** filled PRD
- `/oneui:build-from-prd` — code, not Figma
