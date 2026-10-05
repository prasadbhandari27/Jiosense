---
description: Redesign legacy JDS / Testlab Figma screens into OneUI components
---

# /oneui:jds-to-oneui-figma

Rebuild legacy JDS screens as OneUI in Figma.

1. Load skill `jds-to-oneui-figma` and `references/jds-to-oneui-component-map.json`.
2. Detect single frames vs a **multi-screen container**; inventory visible children (x-sorted).
3. Place rebuilds: per-screen below sources, **or** one `{container} — OneUI` row below the container with shells in flow order.
4. Import real OneUI / Micropatterns components only; annotate `[GAP]` for `design_create` rows (OTP, Date, …).
5. Apply Theme on root + `figma-surface-cascade` on tinted regions.
6. Update map inventory / `rebuildExample`; return rebuild frame URLs + remaining gaps.

Examples:

```
# Single / few screens
Convert these JDS screens to OneUI in TestFile, placed below the sources:
https://www.figma.com/design/Ors8Y9cGtm1J1YelpT0I51/TestFile?node-id=275-22028
https://www.figma.com/design/Ors8Y9cGtm1J1YelpT0I51/TestFile?node-id=275-22110
https://www.figma.com/design/Ors8Y9cGtm1J1YelpT0I51/TestFile?node-id=275-21719
Legacy library: https://www.figma.com/design/SjyssHuM5x8fcnriezopvK/Jio-Testlab-Library

# Full flow container (all child screens)
Convert all screens in this container to OneUI and place a OneUI row below it:
https://www.figma.com/design/Ors8Y9cGtm1J1YelpT0I51/TestFile?node-id=295-33010
```
