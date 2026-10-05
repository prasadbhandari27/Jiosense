---
name: oneui-definitions
description: >-
  Definitions of OneUI components and micropatterns, plus the legacy colour-token → OneUI surface/appearance mapping — the shared vocabulary for choosing, disambiguating and placing OneUI elements in Figma. Use when deciding which OneUI component or micropattern fits, which of two similar components to reach for, or how a legacy colour/{scale}/{step} fill maps to a OneUI surface + appearance.
category: figma-design
---

# OneUI Definitions

Shared vocabulary for building OneUI screens in Figma. Load the reference you need:

- **oneui-components-definition** — Definitions of every OneUI UI component — what each one is, when to use it, which sibling to reach for instead, and the props that change its meaning. Use whenever choosing, placing, swapping or reviewing a OneUI component in Figma, or when unsure which of two similar components (Icon vs IconContained vs IconButton, Badge vs CounterBadge, Tooltip vs Popover, Switch vs Checkbox, Modal vs BottomSheet vs SideSheet, Spinner vs CircularProgressIndicator, Button vs SingleTextButton) is correct.
  Load via `get_skill_reference("oneui-definitions", "references/oneui-components-definition.md")`.
- **oneui-micropatterns-definition** — Definitions of every OneUI Micropattern — the higher-order layout and interaction patterns that compose OneUI Components into screen-level structures (navigation, selection, chat, content, spatial layout). Use whenever choosing, placing, swapping or reviewing a OneUI Micropattern in Figma, or when unsure which of two similar patterns (HeaderNative vs HeaderWeb, BottomNav vs TabGroup, Select vs ContextMenu, which ChatInput variant, Carousel vs aspect ratio presets, Slot vs Spacer) is correct.
  Load via `get_skill_reference("oneui-definitions", "references/oneui-micropatterns-definition.md")`.
- **oneui-surface-color-token-mapping** — Maps legacy surface colour tokens to OneUI Appearance + Surface variable modes. Given a legacy fill token of the form color/{scaleName}/{step}, determines which `01 Appearance` mode (by looking up the scale name in the active theme's sections) and which `03 Surface` mode (by classifying the step number) to set on the OneUI frame. Handles two step systems: palette steps (multiples of 100) and compact steps (multiples of 10, not 100). Use whenever a reference frame carries a fill with a legacy colour token and the rebuild frame needs the equivalent OneUI modes set.
  Load via `get_skill_reference("oneui-definitions", "references/oneui-surface-color-token-mapping.md")`.

