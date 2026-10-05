---
name: build-with-tokens
version: 1.0.0
category: foundations
description: "Build custom, brand-aware React Native components on @oneui/ui-native by reading design tokens by semantic job — so the same component follows brand, theme, density, and surface context with no per-brand code. Use this skill whenever authoring a NEW custom RN component (a bespoke button, card, chip, badge, tile, banner — anything the library doesn't already ship) and you need to know WHICH token to reach for and HOW to consume it: colour via useSurfaceTokens, typography via useTypographyTokens or the library <Text>, motion via useMotion, and the static spacing / shape / stroke / grid / interaction / motion / touchTarget primitives from '@oneui/ui-native/tokens'. Reach for it on questions like 'how do I build a custom component with OneUI tokens on native', 'which token do I use for a border / radius / disabled state / press animation', 'how do I get brand colour into my own View/Pressable', 'what is @oneui/ui-native/tokens', 'why is my custom component grey / not following the brand', or 'how do I make a custom component adapt inside a Surface'. SCOPE: this skill is React-Native-only right now (web/CSS-variable authoring is handled separately). It owns the token-selection + consumption story for custom components. For WHICH surface level a region earns, defer to `surface`; for the [data-surface] / Container remapping mechanism and building surface-aware components, defer to `surface-context`; for using the SHIPPED library components' real props, defer to `oneui`."
---

# Build custom React Native components with OneUI tokens

> **Platform scope:** React Native (`@oneui/ui-native`) only. Web/CSS-variable
> authoring is a separate concern and is not covered here yet.

## The one idea

**Read every visual value from a token, chosen by its semantic *job* — never by the value it happens to render.** A hard-coded `#4B1FD6`, `16`, or `'600'` freezes your component to one brand, one density, one theme. A token (`roles.surfaces.bold`, `spacing['4']`, a `<Text variant="label">`) lets the OneUI foundation resolve the final value for whatever brand, theme, density, and surface the component is dropped into — with zero per-brand logic in your component.

If your custom component looks **grey when you expected brand colour**, that is almost never a bug — it means the active brand maps that role to a neutral scale (e.g. Tira's `primary` *is* the Neutral greyscale). The token system is working; pick a role that carries colour (`secondary`, `positive`, …) or check the brand.

## Two token sources — pick by what the value *is*

OneUI native splits tokens into two entries. Choosing the wrong one is the most common mistake.

| The value is… | Read it from | Why |
| --- | --- | --- |
| **context-independent** — a fixed border *width*, a duration, a touch-target min, a grid/structural dimension | `@oneui/ui-native/tokens` (**static** import) | Safe at module scope in `StyleSheet.create({…})` — it never changes per brand/theme/surface. |
| **brand / theme / surface aware** — any colour, type metric, elevation, motion spring | a **runtime hook** on `@oneui/ui-native` | Must be read at render time so it adapts to the active brand and the surrounding `<Container>`. |
| **context-independent BUT also on the resolved theme** — spacing, radius (shape), duration ramps | either — prefer `useOneUITheme()` inside a themed tree | The theme returns them already resolved for the active platform × density; the static export is the un-themed default. |

```ts
// STATIC — module scope is fine
import { spacing, shape, stroke, interaction, touchTarget } from '@oneui/ui-native/tokens';

// RUNTIME — inside the component, via hooks.
// Hooks and the brand provider live on /theme; components on /components/<Name>.
import {
  useSurfaceTokens, useTypographyTokens, useMotion, useReduceMotion,
  useElevation, useOneUITheme,
} from '@oneui/ui-native/theme';
import { Text } from '@oneui/ui-native/components/Text';
import { Container } from '@oneui/ui-native/components/Container';
```

> **Never import from the bare `@oneui/ui-native` barrel.** Metro does not reliably tree-shake, so
> a single barrel import anywhere in an app pulls all 52 components into the bundle and cancels the
> saving for every other file — measured at ~508 KB for one `OneUIBrandProvider` line alone. Use
> `@oneui/ui-native/theme` for the provider and hooks, `@oneui/ui-native/components/<Name>` per
> component, and `@oneui/ui-native/tokens` for the static primitives. Only `Surface` and
> `COMPONENT_APPEARANCE_ROLES` have no deep export and legitimately stay on the barrel.

> **`stroke` / `interaction` / `touchTarget` / `grid` / `component` / `dimension` have no runtime hook** — the theme object does not carry them, so `@oneui/ui-native/tokens` is their only source. (`spacing` / `shape` / `motion` are the exception — they *are* on `useOneUITheme()`, resolved for the active platform × density; prefer the hook for those inside a themed tree.) Never inline a literal in place of one of these static constants.

Full field-by-field catalogue (every static key + every hook's return shape + resolved example values): **`references/native-tokens.md`**.

## Choose the token by job

| Job | Reach for |
| --- | --- |
| Container / tinted region background | `<Container mode="subtle" appearance="primary">` — **never** a raw `<View>` background |
| Fill **that wraps text/icons** (preferred) | `<Container mode="bold" appearance>` + `overflow:'hidden'` clip — the inner `<Text>` then auto-resolves its on-fill colour |
| Fill on a bare leaf (no children) | `useSurfaceTokens(appearance).surfaces.bold` / `.subtle` — then set the on-colour yourself |
| Text / icon colour | on a `<Container mode>` fill: `<Text appearance attention>` (auto) — on a leaf fill: `useSurfaceTokens(appearance).onBoldContent.high` / `.content.tintedA11y` |
| Elevation / shadow | `useElevation().byLevel[N].ios` (spread) + `.androidElevation` — **never** hand-roll `shadow*` from literals |
| Typography | library `<Text variant="label" size="M">`, or `useTypographyTokens('label','M')` for raw metrics |
| Padding / gap / size | `useOneUITheme().spacing['4']` (density-resolved, preferred) — or `spacing['4']` static |
| Corner radius | `useOneUITheme().shape['3']` / `.shape.Pill` — or `shape['3']` static |
| Border **colour** (surface-aware) | `useSurfaceTokens(appearance).content.strokeMedium` / `.strokeLow` — **runtime** |
| Border **width** | `stroke.M` (1) / `stroke.L` (1.5) — **static only**, no runtime equivalent |
| Press / gesture animation | `useMotion()` → `tapScale` + `spring.pressIn/pressOut`; gate with `useReduceMotion()` |
| Disabled opacity | `interaction.disabledOpacity` (0.3) — **static only**, no runtime equivalent |
| Min touch target | `touchTarget.min` (44) — **static only**, no runtime equivalent |

## Surface discipline (non-negotiable)

A custom component earns its brand colour **only if colour is read from `useSurfaceTokens` and any tinted region is a `<Container mode="…">`**. `<Container>` establishes the surface-context boundary; children calling `useSurfaceTokens` then resolve against *that* surface automatically (a `bold` container flips its children's `high` text to the on-bold colour, etc.). A raw `<View style={{ backgroundColor }}>` is **outside** that cascade — children will not remap and will mis-contrast. `Surface` is an internal primitive and is not exported; always use `<Container>`.

*(WHICH surface level to use → `surface`. HOW the remapping works / building deeply surface-aware components → `surface-context`.)*

## Rules that keep a custom component brand-safe

1. **No literals** — zero hard-coded colours, px, font sizes/weights/line-heights, radii, or durations. Every value traces to a token (`stroke.L`, `interaction.disabledOpacity`, `shape['4']`, …), never an inlined constant.
2. **Colour is always runtime** — `useSurfaceTokens(appearance)`; never a static hex, never `theme.rootRoles[...]` hand-reached for a leaf (that's the escape hatch, not the norm). Border *colours* are colours: `content.strokeMedium` / `.strokeLow`, resolved at render time.
3. **Elevation is always runtime** — `useElevation()`. Never assemble `shadowOffset`/`shadowOpacity`/`shadowRadius`/`elevation` from spacing tokens + a literal opacity; that reinvents (and desyncs from) the brand's elevation ramp.
4. **Typography pairs metrics** — prefer the library `<Text variant/size>`; if you must style raw, size + lineHeight + weight + family come together from `useTypographyTokens`.
5. **Only `View` / `ScrollView` / `Pressable` / `Animated` from `react-native`** — every other UI element comes from `@oneui/ui-native`. A *custom pressable* is the one legitimate bare primitive (the library ships finished `Button`/`IconButton`, not a bare pressable).
6. **Honour reduced motion** — any animation checks `useReduceMotion()`.

## What is deliberately NOT available on native

The web focus system (`--Focus-Outline` colour + `--Surface-Halo-Gap`) is **not** exported for React Native — mobile touch surfaces render no keyboard focus halo, so there is no consumer. `interaction.focusOutlineWidth` and `interaction.disabledOpacity` *are* exported as constants for parity. Don't try to build a web-style focus ring from tokens on native.

## Copy-ready recipe

A complete, **zero-literal** custom button — the `TokenButton` — lives in **`references/recipes.md`**: multi-variant (solid/tonal/outline/ghost/elevated), fill via `<Container mode>` so the label auto-resolves its on-fill colour, border colour from `content.strokeMedium/Low`, border width from `stroke.L`, disabled dim from `interaction.disabledOpacity`, press spring from `useMotion()` + `useReduceMotion()`, and the raised shadow from `useElevation().byLevel[N]`. The simpler leaf-`backgroundColor` variant is the runnable `apps/native-components-sample` `CustomButton`.

## Related skills

- **`surface`** — decide *which* surface level a region earns.
- **`surface-context`** — the `<Container>` / `[data-surface]` remapping mechanism; building surface-aware components.
- **`oneui`** — using the real props of the *shipped* library components (compose these before hand-rolling).
