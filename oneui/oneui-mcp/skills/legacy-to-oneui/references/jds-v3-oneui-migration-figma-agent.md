---
name: jds-v3-oneui-migration-figma-agent
description: >-
  Orchestrator for converting a JDS v3 (Jio Testlab Library) reference file into a OneUI-based
  design file in Figma. Use whenever swapping, auditing or prop-mapping legacy JDS components to
  OneUI — buttons, form controls, navigation, overlays, badges, media, lists and micropatterns.
  Routes to the one behaviour-grouped mapping skill that owns the tables; never loads all at once.
---

# JDS v3 → OneUI migration (Figma Agent orchestrator)

You are converting a **JDS v3 (Jio Testlab Library) reference file into a OneUI design file**:
swap instances to OneUI library components, map every prop and variant value, and apply each
component's migration checklist. Wrong swaps render fine and are wrong — follow the tables.

## How to load skills (critical)

Figma Agent custom skills are separate files. When this orchestrator tells you to load a sibling,
**use the Skill tool** with the exact `/custom-skills:…` name below. Do **not** assume mapping
tables are already in context.

**Do not load every skill at once.** Identify the component on the selection, then load **only**
the behaviour group that owns it:

> Load `/custom-skills:X` when migrating component Y.

Skills are grouped **by behaviour**, so one load usually covers the whole cluster you are working
on (e.g. all buttons, or all form controls). Skill names must match **exactly**.

## Always start here

1. Identify the **JDS component name(s)** on the selection, or named in the user's request.
2. Find it in the routing table and load that **one** skill.
3. Follow that skill's Overview, Props Mapping, value maps, lossy notes and Migration Checklist.
4. Finish one behaviour group before loading the next. Do not stack unrelated skills.
5. **Never invent** prop names, variant values, or "close enough" mappings. Where a skill marks a
   feature lossy or lost, say so instead of substituting something similar.

## Routing — load X when migrating Y

| JDS / OneUI components | Skill to load |
|---|---|
| `Button`, `IconButton`, `SingleTextButton`, `SelectableButton`, `SelectableIconButton`, `SelectableSingleTextButton`, `ButtonGroup`, `SearchTrigger` | `get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-actions-and-triggers.md")` |
| `Checkbox`, `CheckboxIndeterminate`, `CheckboxField`, `Radio`, `Switch` | `get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-form-controls.md")` |
| `Input`, `Select` | `get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-form-fields.md")` |
| `Chip`, `SegmentedControl`, `.SegmentedItem`, `Tabs`, `TabGroup` | `get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-selection-controls.md")` |
| `Header`, `HeaderNative`, `HeaderWeb`, `BottomNavigation` | `get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-navigation.md")` |
| `BottomSheet`, `Modal`, `Dialog`, `SideSheet` | `get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-overlays.md")` |
| `Toast`, `Tooltip`, `Tip`, `TipItem` | `get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-feedback.md")` |
| `Badge`, `CounterBadge`, `IndicatorBadge`, `CircularProgressIndicator`, `LinearProgressIndicator`, `Spinner` | `get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-status-indicators.md")` |
| `Icon`, `IconContained`, `IconContainedSemantic`, `Image`, `Avatar`, `Logo`, `Text`, `Label` (standalone) | `get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-media-and-identity.md")` |
| `Breadcrumbs`, `Breadcrumb`, `BreadcrumbItem`, `Divider`, `Scrim`, `Overlay` | `get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-structure-and-separators.md")` |
| `ListItem`, `StackedListItem`, `StackedList`, `ContextMenu`, `Carousel`, `CarouselImage` | `get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-lists-and-collections.md")` |
| `Accordion`, `AccordionItem`, `AccordionHeader`, `Accordion Semantic`, `Pagination`, `PaginationButton`, `.PaginationItem`, `PaginationDots` | `get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-disclosure-and-paging.md")` |
| Surface fill tokens — `color/{scaleName}/{step}` on any frame | `get_skill_reference("oneui-definitions", "references/oneui-surface-color-token-mapping.md")` |

Each skill opens with a **Components in this skill** index — jump to the component, do not read the
whole file.

Some skills also open with **Explicit mapping rules**, which **override** the general mapping tables
in that file. Read that section before placing the component. Cross-cutting ones to know:

- **HeaderNative owns the status bar** — never place a standalone Status Bar beside it
  (`get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-navigation.md")`).
- **Icons: clickability first, then background** — clickable → IconButton, non-clickable on a
  container → IconContained, otherwise Icon. Owned by
  `get_skill_reference("oneui-definitions", "references/oneui-components-definition.md")`; prop tables in
  `get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-media-and-identity.md")`.
- **Checkbox before CheckboxField** — CheckboxField only for a required indicator, info icon, or
  validation message (`get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-form-controls.md")`).
- **There is no OneUI Text component** — standalone text is a native Figma TEXT node with a shipped
  TextStyle applied. Map it from the legacy Label's `Variant` + `Emphasis`, never from raw px
  (`get_skill_reference("legacy-to-oneui", "references/jds-v3-oneui-media-and-identity.md")`).
- **Surface fills are never painted directly** — read the legacy frame's `color/{scale}/{step}`
  token, look up which theme section owns that scale, map the step to a surface level, and set
  `01 Appearance` + `03 Surface` modes instead. Bind fill to `colour/surface/surface`. Handles
  both palette steps (multiples of 100) and compact steps (multiples of 10)
  (`get_skill_reference("oneui-definitions", "references/oneui-surface-color-token-mapping.md")`).

## Converting a reference file (recommended order)

Work behaviour group by behaviour group so each skill is loaded once:

1. **Audit** — list every JDS component in the file and bucket it against the table above.
2. **Structure first** — headers, navigation, dividers, scrims. The page frame settles before the
   content inside it moves.
3. **Content and collections** — lists, accordions, carousels, pagination.
4. **Interactive controls** — buttons and triggers, then form controls and fields, then chips /
   segmented / tabs.
5. **Decoration and status last** — icons, images, avatars, badges, progress.
6. **Overlays and feedback** — sheets, modals, toasts, tooltips.
7. **Then apply foundations.** Component swaps do not fix colour: after the tree is OneUI, load
   `the `oneui-figma-foundations` skill (get_skill "oneui-figma-foundations")` to set variable modes, Brand bindings and
   the parent-step cascade, and to verify.

## Recurring migration rules (all groups)

- **`Emphasis` → `attention`** is the most common rename, but **defaults differ** (JDS `Medium` vs
  OneUI `high`). Set `attention` explicitly rather than relying on the default.
- **Size scales shrink** on several components. Use the skill's lossy map; never invent a size.
- Prefer OneUI **instance-swap / slot props** over overriding nested children in the layer tree.
- OneUI often has **no static `Disabled` variant** — follow the per-component note.
- JDS families frequently **collapse into one OneUI component** (separate indeterminate checkbox,
  separate accordion header, breadcrumb items). Expect merges, not 1:1 renames.
- Micropatterns (`Select`, `SearchTrigger`, `BottomNavigation`, `ListItem`, `Carousel`) live in
  **OneUI Micropatterns**; the rest live in **OneUI Components**. Trust the skill's library note.
- Record every **lost JDS-only prop** and every **new OneUI-only prop** in your report so the
  designer can decide, instead of silently dropping behaviour.

## If a component is not in the table

Stop and tell the user it has no mapping skill yet. Do not guess from a similar name, and do not
map it out of a skill that does not explicitly cover it.
