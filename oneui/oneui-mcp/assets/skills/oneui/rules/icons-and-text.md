# Icons & Text

Confirm icon names and the exact `appearance`/`emphasis`/`size` enums with `get_component_info Icon`.

## Use an icon wherever the pattern expects one — skipping it is as wrong as overusing it

Every generated screen (PRD→code, Figma→code, or hand-authored) should carry icons at the SAME
density a real OneUI screen would — no more, no less. Check each of these UI patterns and add the
icon if the pattern is present; don't invent one if it isn't:

- **Navigation / chrome:** back arrow, close (X), menu (hamburger), search glass, more (kebab/ellipsis).
- **List / row leading or trailing affordance:** a `leading` icon identifying the row's type (folder,
  file, person, settings…), a `trailing` disclosure `chevron-right` on any row that navigates deeper.
- **Primary/secondary actions:** a supporting icon in a `Button`'s `start`/`end` slot when the action
  has an obvious glyph (download, share, add, delete, edit) — omit it for plain-verb actions
  ("Continue", "Save") that don't have a canonical icon.
- **Status / feedback:** `check-circle` (positive), `alert-circle`/`x-circle` (negative), `alert-triangle`
  (warning), `info` (informative) — always via the matching semantic `appearance`, never decorative.
- **Empty states / banners:** a single representative icon, not one per line of copy.

**What NOT to do:** don't add an icon to every list row, every menu label, or every paragraph just
because one CAN be added — that's exactly what "Icons in/near text are dividers, not decoration"
(below) already forbids. If a plain text row/button has no navigational, status, or type-identifying
role, it gets no icon.

## The `Icon` prop is `icon` (not `name`), from the OneUI icon package only

Import icons exclusively from `@jds4/oneui-icons-jio` (web) / `@oneui/icons-jio-native` (native). External icon libraries are banned (the validator flags `external-icon-import`).

**Incorrect:**
```tsx
import { Search } from "lucide-react"
<Icon name="search" />                    {/* wrong prop + external lib */}
<Search className="w-5 h-5" />
```

**Correct:**
```tsx
<Icon icon="search" />                     {/* semantic name via the `icon` prop */}
```

## Don't size icons with utility classes — use `size` / `emphasis`

Icons resolve their dimensions from tokens. Manual `w-/h-`/`size-*` classes break the scale.

**Incorrect:**
```tsx
<Icon icon="info" className="w-4 h-4" />
```

**Correct:**
```tsx
<Icon icon="info" size="5" emphasis="medium" />   {/* size = spacing-index preset; default '5' = 20px */}
```

## `sparkle` is rare; `neutral` is the default workhorse

`appearance="sparkle"` marks celebration / promotion moments — keep it to ~1–2 per viewport. General and decorative icons are `neutral`. Status icons use semantic roles (`positive`/`negative`/`warning`/`informative`).

**Incorrect:**
```tsx
<Icon icon="chevron-right" appearance="sparkle" />   {/* chrome is not a celebration */}
```

**Correct:**
```tsx
<Icon icon="gift" appearance="sparkle" />            {/* a real moment */}
<Icon icon="chevron-right" appearance="neutral" />   {/* chrome */}
<Icon icon="check-circle" appearance="positive" />   {/* status */}
```

## Body text stays neutral — only links are tinted

Text color comes from the neutral content tokens (`--Text-High` / `--Text-Medium` / `--Text-Low`). The *only* routine exception is a link, which uses a tinted / secondary appearance. Don't tint paragraphs, headings, or labels for emphasis — use weight/size or a `<Surface>` instead.

**Incorrect:**
```tsx
<Text style={{ color: 'var(--Primary-High)' }}>Important note</Text>   {/* tinted body text */}
```

**Correct:**
```tsx
<Text>Important note</Text>                              {/* neutral */}
<a className="link">Learn more</a>                        {/* link → tinted/secondary */}
```

Icons may use `emphasis="tinted"` / `tintedA11y` for theme-aware accenting (e.g. a tinted icon button); that's an *icon* affordance, not a license to tint text.

## Icons in/near text are dividers, not decoration

Use icons to separate or label content (leading/trailing slots), not to ornament every line. Pass them through component slots (`start`/`end`) rather than positioning them manually.

```tsx
<Button start="search">Search</Button>     {/* slot, not a manually placed icon */}
<ListItem leading={<Icon icon="folder" appearance="neutral" />}>Documents</ListItem>
```
