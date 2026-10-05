---
name: prd
description: Drop the One UI PRD template into the chat to fill in. Once completed, hand it to /oneui:build-from-prd to generate the screens. Use when the user wants to spec a feature before building.
---

# /oneui:prd

Get the One UI PRD template to fill in — or expand a brief into a filled PRD.

## Prefer for vague asks

If the user gives a **one-liner** or thin notes (“build a TV home”, “ecommerce page”),
use **`/oneui:expand-prd`** / skill `expand-prd` instead of the blank template. That
writes house-style `docs/prds/*.md` (mobile and/or web) and **stops for confirmation**
before Figma.

## Flow (blank template)

Invoke the `oneui-prd` MCP prompt (server `oneui`). It returns the blank PRD template
(Brand & theme, Scope v1 vs Deferred, Screens & flow, Data, References, Acceptance criteria)
plus a worked example.

## Next step

Fill in the template (or confirm an expanded PRD), then either:

- `/oneui:build-from-prd` — generate React / React Native **code**
- `/oneui:prd-to-figma` — recreate as a **Figma** frame on the temporary Untitled file

The build command parses §2 (brand/theme), §3 (scope — Deferred is NOT built),
§4 (screens & flow), and §8 (acceptance criteria = the self-heal stop condition).

## Related
- `/oneui:expand-prd` — brief → filled PRD (confirm before Figma)
- `/oneui:build-from-prd` — consumes the completed template (code).
- `/oneui:prd-to-figma` — consumes the completed template (Figma).
- `get_prd_template` MCP tool / `oneui://prd-template` resource.
