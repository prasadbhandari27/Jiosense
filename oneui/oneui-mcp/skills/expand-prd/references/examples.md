# expand-prd — worked examples

## Example A — one-liner → both platforms

**User:** `build a tv home screen`

**Agent does:**

1. Platforms: both (default)
2. Writes:
   - `docs/prds/jiotv-home.md` (mobile 360) — if missing or regenerating
   - `docs/prds/jiotv-home-web.md` (web 1280)
3. Stops with confirmation summary
4. Only after “go” → `prd-to-figma` on each file (360 then 1280)

**Do not:** open Figma on the one-liner alone.

## Example B — mobile only

**User:** `mobile app screen for grocery filters`

**Agent does:**

1. Platform: mobile only
2. Writes `docs/prds/jiomart-filters.md` style PRD (ChipGroup, SegmentedControl, Slider, sticky Apply Button)
3. Confirms; then Figma 360

## Example C — already filled PRD

**User:** `recreate docs/prds/jioastro-home.md in Figma`

**Agent does:**

1. Detects full §1–§7 → **skip** expand-prd
2. Load `prd-to-figma` immediately

## Example D — thin pasted notes

**User:**
```
pay screen
- amount
- who to pay
- confirm
```

**Agent does:**

1. Expand into `docs/prds/jiopay-send-money.md`-style structure with named components (InputField, Avatar payee list, Button Confirm)
2. List assumptions (brand jio / theme jiopay / light)
3. Confirm before Figma
