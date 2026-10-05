# Copy-ready React Native recipe — custom button from tokens

A complete custom button that is **not** from the library, built entirely from
tokens following the two-source split:

- **Runtime hooks** (brand / theme / surface aware): `<Container mode>` + `useSurfaceTokens`
  for colour, library `<Text>` for typography, `useMotion` + `useReduceMotion` for the
  press spring, `useElevation` for the raised shadow.
- **Static primitives** from `@oneui/ui-native/tokens`: `shape` (radius), `stroke`
  (border width), `interaction` (disabled opacity). These are context-independent —
  they never change per brand/theme/surface, so they are safe at any scope.

It has **zero literals** — no hard-coded colour, size, radius, opacity, or duration.

## Pattern: fill via `<Container mode>`, not a leaf `backgroundColor`

This recipe paints the fill with a **`<Container mode="…">`** and clips it to the
radius token with `overflow: 'hidden'`, instead of setting `backgroundColor` from
`useSurfaceTokens(...).surfaces.bold` directly on the pressable. The payoff: the
inner `<Text>` **auto-resolves its on-fill colour** from the Container's surface
context (a `bold` container flips its children's text to the on-bold colour, a
`subtle` container to the tinted-a11y colour) — you never branch
`isSolid ? onBoldContent.high : content.tintedA11y` by hand. The `<Text>`'s
`appearance` + `attention` props are all it needs.

```tsx
import React, { useRef } from 'react';
import { Animated, Pressable, type GestureResponderEvent, type ViewStyle } from 'react-native';
import {
  useSurfaceTokens,
  useMotion,
  useReduceMotion,
  useElevation,
} from '@oneui/ui-native/theme';
import { Container } from '@oneui/ui-native/components/Container';
import { Text } from '@oneui/ui-native/components/Text';
import { shape, stroke, interaction } from '@oneui/ui-native/tokens';

export type TokenButtonVariant = 'solid' | 'tonal' | 'outline' | 'ghost' | 'elevated';

export interface TokenButtonProps {
  children: string;
  variant?: TokenButtonVariant;
  /** Appearance role resolved against the active brand + surface. */
  appearance?: 'primary' | 'secondary' | 'neutral';
  fullWidth?: boolean;
  disabled?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
}

type SurfaceMode = 'bold' | 'subtle' | 'ghost' | 'minimal' | 'elevated';
type TextAttention = 'high' | 'medium' | 'low' | 'tintedA11y';

interface VariantSpec {
  mode: SurfaceMode;
  attention: TextAttention;
  /** Border stroke token to draw around the pill, if any. */
  border?: 'medium' | 'low';
  /** Casts a drop shadow to lift the button off the page. */
  raised?: boolean;
}

/**
 * Map each variety to a surface mode + the matching on-fill text attention.
 * `elevated` uses `minimal` (a light-gray raised surface) rather than the
 * `elevated` mode, which on a white page resolves back to white and disappears —
 * paired with a hairline stroke + drop shadow so it reads as a lifted card.
 */
const VARIANTS: Record<TokenButtonVariant, VariantSpec> = {
  solid: { mode: 'bold', attention: 'tintedA11y' },
  tonal: { mode: 'subtle', attention: 'tintedA11y' },
  outline: { mode: 'ghost', attention: 'tintedA11y', border: 'medium' },
  ghost: { mode: 'ghost', attention: 'tintedA11y' },
  elevated: { mode: 'minimal', attention: 'high', border: 'low', raised: true },
};

export function TokenButton({
  children,
  variant = 'solid',
  appearance = 'primary',
  fullWidth = true,
  disabled = false,
  onPress,
}: TokenButtonProps) {
  const role = useSurfaceTokens(appearance);
  const motion = useMotion();
  const reduceMotion = useReduceMotion();
  const elevation = useElevation();
  const spec = VARIANTS[variant];

  const scale = useRef(new Animated.Value(1)).current;
  const restScale = fullWidth ? motion.tapScale.fullWidth : motion.tapScale.default;
  const animate = (to: number, cfg: { speed: number; bounciness: number }) => {
    if (reduceMotion || disabled) return;
    Animated.spring(scale, { toValue: to, useNativeDriver: true, speed: cfg.speed, bounciness: cfg.bounciness }).start();
  };

  // Drop shadow for the elevated variant — every value is a token, never a
  // literal. The shadow/elevation come from useElevation() (brand + platform
  // resolved); the wrapper carries the same radius + surface fill so the shadow
  // is crisply shaped on iOS and casts via elevation on Android.
  const raisedLevel = elevation.byLevel[3];
  const raisedShadow: ViewStyle = spec.raised
    ? {
        borderRadius: shape['4'],
        backgroundColor: role.surfaces.minimal,
        ...raisedLevel.ios,
        elevation: raisedLevel.androidElevation,
      }
    : {};

  // Stroke tokens live under `content` (role.content.strokeMedium / strokeLow).
  const borderColor =
    spec.border === 'medium' ? role.content.strokeMedium : spec.border === 'low' ? role.content.strokeLow : undefined;

  return (
    <Animated.View
      style={[
        { transform: [{ scale }] },
        fullWidth ? { alignSelf: 'stretch' } : { alignSelf: 'flex-start' },
        raisedShadow,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => animate(restScale, motion.spring.pressIn)}
        onPressOut={() => animate(1, motion.spring.pressOut)}
        style={{
          borderRadius: shape['4'],
          overflow: 'hidden',
          // Press feedback is the token-driven scale spring above; disabled dim
          // is the shared interaction token — no literal opacities.
          opacity: disabled ? interaction.disabledOpacity : 1,
          ...(borderColor ? { borderWidth: stroke.L, borderColor } : {}),
        }}
      >
        <Container
          mode={spec.mode}
          appearance={appearance}
          direction="row"
          align="center"
          justify="center"
          paddingY="4"
          paddingX="6"
        >
          <Text variant="label" size="L" weight="high" appearance={appearance} attention={spec.attention}>
            {children}
          </Text>
        </Container>
      </Pressable>
    </Animated.View>
  );
}
```

### Which API each value comes from (all verified against the library)

| Value | Source | Kind |
| --- | --- | --- |
| fill colour | `<Container mode={spec.mode} appearance>` | runtime (surface context) |
| text colour | `<Text appearance attention>` — auto-resolved on the Container's fill | runtime |
| border **colour** | `role.content.strokeMedium` / `.strokeLow` | runtime |
| border **width** | `stroke.L` (1.5) | static |
| corner radius | `shape['4']` (16) | static |
| disabled opacity | `interaction.disabledOpacity` (0.3) | static |
| press spring | `motion.tapScale.fullWidth`/`.default` + `motion.spring.pressIn`/`.pressOut`; gated by `useReduceMotion()` | runtime |
| raised shadow | `useElevation().byLevel[3]` → `.ios` (spread) + `.androidElevation` | runtime |

## Why this survives a brand switch

The component stores no colour, size, font, radius, or duration. It reads role
tokens (`useSurfaceTokens` / `<Container mode>`), library type metrics (`<Text>`),
motion + elevation tokens (`useMotion` / `useElevation`), and the static
shape / stroke / interaction scales. When the brand, theme, density, or the
surrounding `<Container>` changes, the resolved values change — the component's
code does not.

## Elevation is a hook, never hand-rolled

The raised shadow comes from `useElevation().byLevel[3]` — `.ios` spreads
`shadowColor`/`shadowOffset`/`shadowOpacity`/`shadowRadius`, and `.androidElevation`
is the Android value. **Never** assemble a shadow from `spacing` tokens + a literal
`shadowOpacity` / `elevation` number; that reinvents (and desyncs from) the brand's
elevation ramp. `byLevel` is keyed by level `0–5`.

## Simpler alternative: leaf `backgroundColor` fill

When you don't want a nested `<Container>`, paint the fill directly on the
pressable from `useSurfaceTokens(...).surfaces.*` — but then you resolve the text
colour yourself (`onBoldContent.high` on a bold fill, `content.tintedA11y` on a
tinted one). The runnable `CustomButton` in `apps/native-components-sample`
(`src/components/CustomButton.tsx`) shows this leaf pattern:

```tsx
const roles = useSurfaceTokens(appearance);
// on the pressable:
backgroundColor: pressed ? roles.states.boldPressed : roles.surfaces.bold,
// on the label:
<Text style={{ color: roles.onBoldContent.high }} />
```

Prefer the `<Container mode>` fill (above) when the fill wraps text/icons — it
removes the manual on-colour branch.

## Placing it on a tinted / dark region

Wrap the region in `<Container mode="…">`, never a raw `<View background>`:

```tsx
<Container mode="bold" appearance="primary" paddingX="4" paddingY="4">
  <TokenButton appearance="primary" variant="outline">Adapts to the bold surface</TokenButton>
</Container>
```

The outer `<Container>` establishes the surface-context boundary; `useSurfaceTokens`
and the inner `<Container mode>` inside `TokenButton` then resolve against the bold
surface automatically (text flips to the on-bold colour, the outline picks the right tint).

## The one non-library primitive

`Pressable` (and `Animated`) come from `react-native` — a *custom* pressable has
no library equivalent (the library ships finished `Button` / `IconButton`, not a
bare pressable). Every other UI element (`Text`, `Container`, …) comes from
`@oneui/ui-native`. Reach for the shipped `Button` first; hand-roll only when you
genuinely need bespoke behaviour. `validate_oneui_code`'s `forbidden-rn-primitive`
flag on this `Pressable` import is the accepted false-positive for custom-primitive
authoring.
