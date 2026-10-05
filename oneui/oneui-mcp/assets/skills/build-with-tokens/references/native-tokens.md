# React Native token reference (`@oneui/ui-native`)

Field-by-field catalogue for authoring custom components. Two sources: **static**
(`@oneui/ui-native/tokens`) and **runtime hooks** (`@oneui/ui-native/theme`).

Resolved example values below are the **mobile-default** (`platform: 'mobile'`,
`density: 'default'`) for static tokens; runtime values depend on the active
brand/theme/density.

---

## A. Static primitives — `@oneui/ui-native/tokens`

Context-independent constants. Safe at module scope (`StyleSheet.create`).

```ts
import {
  spacing, shape, stroke, grid, interaction,
  motion, touchTarget, dimension, dimensionDesktop, component,
} from '@oneui/ui-native/tokens';
```

> **`spacing` / `shape` / `motion` are also on the resolved theme** — inside a themed tree prefer `useOneUITheme().spacing` / `.shape` / `.motion` (resolved for the active platform × density). The rest (`stroke` / `grid` / `interaction` / `touchTarget` / `dimension` / `component`) are **static-only** — they have no runtime hook and are not on the theme object, so this import is the only source for them. Never substitute a hard-coded literal.

### `spacing` — responsive numeric scale (aliases the dimension steps)
Keys: `'0' '0-5' '1' '1-5' '2' '2-5' '3' '3-5' '4' '4-5' '5' '5-5' '6' '7' '8' '9' '10' '12' '14' '16' '18' '20' '24' '28' '32' '40'` plus `'Margin'` / `'Gutter'`.
Mobile-default px: `'0'→0, '0-5'→2, '1'→4, '2'→8, '3'→12, '4'→16, '5'→20, '6'→24, '8'→32, '10'→40 …`; `Margin→16`, `Gutter→8`.
Inside a themed tree, `useOneUITheme().spacing[key]` is the same key resolved for the active platform × density.

### `shape` — radius scale + standalone Pill
Keys: `'0'…'10'` (numeric ramp, derives from dimension steps) + `Pill` (`9999`, standalone constant — **not** part of the ramp).
Mobile-default px: `'1'→4, '2'→8, '3'→12, '4'→16, '5'→20, '6'→24, '8'→32, '10'→40`.

### `stroke` — border widths (mirrors web `--Stroke-*`)
Fixed: `None→0, S→0.5, M→1, L→1.5, XL→2, '2XL'→3`.
Dimension-aliased (mobile-default px): `'3XL'→4, '4XL'→6, '5XL'→8, '6XL'→10, '7XL'→12, '8XL'→14, '9XL'→16`.
The `3XL`+ steps resolve against the mobile dimension scale, so their px differ from web's desktop-breakpoint values — same platform split as `spacing`/`shape`.

### `grid` — mobile-default breakpoint
`grid.columns → 4`, `grid.maxWidth → null` (web `none`), `grid.margin → 16`, `grid.gutter → 8`.
(`columns`/`maxWidth` are per-breakpoint on web; this static export is the mobile value.)

### `interaction` — shared interaction constants
`interaction.disabledOpacity → 0.3` (mirrors `--Disabled-Opacity`).
`interaction.focusOutlineWidth → 2` (mirrors `--Focus-Outline-Width`).
> The focus-outline **colour** and the halo-gap (`--Focus-Outline` / `--Surface-Halo-Gap` on web) are **not** exported for native — mobile touch surfaces render no focus halo. Do not attempt a web-style focus ring.

### `motion` — duration ramps (ms)
`motion.duration.discreet` → `{ micro: 50, short: 100, medium: 150, long: 200 }`.
`motion.duration.expressive` → `{ short: 250, medium: 350, long: 500, xlong: 700 }`.
Use these for **timing** transitions (`Animated.timing`). For **press/gesture springs**, use `useMotion()` (below), not a duration.

### `touchTarget` — WCAG minimums (px)
`{ min: 44, minCompact: 40, minOpen: 48 }`.

### `component` — fixed structural dimensions
`component.height.topBar → 52`, `component.width.leftNav → 240` / `leftNavCollapsed → 60`, `component.maxHeight.dialog → 300`.

### `dimension` / `dimensionDesktop` — the modular source scale
The step map that `spacing` and `shape` alias (`dimension` = mobile, `dimensionDesktop` = desktop). Reach for these only when you need the raw step; prefer `spacing`/`shape`.

---

## B. Runtime hooks — `@oneui/ui-native/theme`

Brand / theme / surface / density aware. Call at render time.

### `useSurfaceTokens(appearance?)` → `NativeRoleTokens`
`appearance` is a `ComponentAppearance` role (`'primary' | 'secondary' | 'neutral' | 'sparkle' | 'brand-bg' | 'positive' | 'negative' | 'warning' | 'informative'`; defaults to `'neutral'`). Resolves against the nearest `<Container>` surface.

```ts
const roles = useSurfaceTokens('primary');
roles.surfaces      // { default, ghost, minimal, subtle, moderate, bold, elevated }  (hex strings)
roles.content       // { high, medium, low, tinted, tintedA11y, strokeMedium, strokeLow }
roles.onBoldContent // same content keys, resolved for text sitting ON this role's bold fill
roles.onSubtleContent
roles.states        // { hover, pressed, boldHover, boldPressed, subtleHover, subtlePressed }
roles.stateLayers   // same keys, as rgba overlay strings
```
Attention → fill mapping: **high** = `surfaces.bold` + `onBoldContent.high`; **medium** = `surfaces.subtle` + `content.tintedA11y`; **low** = transparent + `content.tintedA11y`.
Fallback: an unconfigured role falls back `appearance → primary → neutral`.

### `useTypographyTokens(role, size, options?)` → `NativeTypeStyle`
`role`: `'display' | 'headline' | 'title' | 'body' | 'label' | 'code'`. `size` narrows per role (e.g. `label`: `'XL'|'L'|'M'|'S'|'XS'|'2XS'|'3XS'`). `options.emphasis` (`'high'|'medium'|'low'`) for body/label/code.
```ts
const t = useTypographyTokens('label', 'M', { emphasis: 'medium' });
// { fontSize, lineHeight, fontWeight, fontFamily, weightViaFontFamily?, letterSpacing? }
```
> If `weightViaFontFamily` is true, the weight is carried by the `fontFamily` — omit `fontWeight` on `<Text>` to avoid Android synthetic bolding.
Prefer the library `<Text variant="label" size="M">` — it applies these metrics for you; use the hook only when styling a raw text node.

### `useMotion()` → `ResolvedNativeMotion`
```ts
const motion = useMotion();
motion.tapScale        // { xs, default, fullWidth }  press-scale targets
motion.spring          // { pressIn: {speed,bounciness}, pressOut: {speed,bounciness} }
motion.duration        // resolved duration bundle
motion.offset / motion.easings / motion.distances / motion.spinner
```
This is the **same** bundle the built-in `Button` animates with; a brand/accessibility preset can retune it via the provider's `motionOverrides`.

### `useReduceMotion()` → `boolean`
OS "reduce motion" setting. Every animation must early-return when true.

### `useElevation()` → resolved elevation
Brand + platform shadow/elevation values for RN `shadow*` / `elevation`.

### `useOneUITheme()` → `OneUINativeTheme`
The whole resolved theme (escape hatch / for reference tables):
`theme.spacing`, `theme.shape` (density-resolved `Record<key, number>`), `theme.typography` (all roles × sizes), `theme.motion`, `theme.elevation`, `theme.materials`, `theme.rootRoles` (`Record<role, NativeRoleTokens>` at the page root), `theme.meta` (`{ theme, density, platform, brandHash, configuredRoles }`), plus the raw `theme.themeConfig` / `theme.rootParentStep` / `theme.darkMode` engine inputs.
> **Not on the theme:** `stroke`, `interaction`, `touchTarget`, `grid`, `component`, `dimension`. These are static-only constants — get them from `@oneui/ui-native/tokens`, never off `theme`.

---

## C. Provider

Everything above requires an ancestor `<OneUIBrandProvider brand={…} mode="light|dark">`. In an app that's mounted once at the root; in isolation (a demo screen) mount your own.
