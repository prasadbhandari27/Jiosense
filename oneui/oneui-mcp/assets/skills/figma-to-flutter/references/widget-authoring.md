# Flutter widget authoring (catalog dump mistakes)

Load this **before writing any showcase / PRD / Figma screen**. Then
`get_component_info({ name, platform: "flutter" })` for each widget.
`validate_oneui_code(platform: "flutter")` after.

Avatar details: `references/avatar.md`.

## No invented props — treat `unknown-prop` as a hard error

Every OneUi* prop name you write must come from `get_component_info({ name,
platform: "flutter" })` or `list_components({ platform: "flutter" })` for that
exact widget — never from memory, from the React/RN prop name, or from a
similarly-named widget. `validate_oneui_code(platform: "flutter")` cross-checks
every named argument against the real, current `ui_flutter` constructor and
emits `unknown-prop` for anything it doesn't recognize (severity `warning`, so
it won't silently block you — but it means the code is about to compile-error
or render wrong, not that it's safe to ignore). Before shipping generated
code: if `unknown-prop` fires, fix the prop, don't dismiss the warning — a
generated demo with a fabricated prop is worse than one that's incomplete,
because it looks confident and is wrong.

## Spacing

`getSpacingTokenPx(spacingName: 'M'|'S'|…, platform, density, platformsConfig)`
and `getDimensionValue(step: '120'|…)` are the token APIs.

**Allowed:** `EdgeInsets.all(_space(context, 'M'))`, `EdgeInsets.fromLTRB(inset, …)`
when `inset` comes from those helpers.

**Forbidden:** `EdgeInsets.all(16)`, `EdgeInsets.only(left: 8)` — numeric literals.

Prefer `OneUiSurface(padding: EdgeInsets.all(_space(context, 'M')))` for cards.

## Progress

Default **max is 100** (CPI and LPI).

```dart
// 62%
OneUiCircularProgressIndicator(variant: 'determinate', value: 62, semanticsLabel: 'Setup 62 percent')
OneUiLinearProgressIndicator(type: 'determinate', value: 45, semanticsLabel: 'Download 45 percent')

// WRONG — 0.45 with max 100 is 0.45%, not 45%
OneUiLinearProgressIndicator(type: 'determinate', value: 0.45)
```

If you pass a 0–1 fraction you **must** set `max: 1`.

## Toast

Static `OneUiToast(...)` is a **card**, not the toaster.

```dart
// App root (with BrandProvider / Surface)
OneUiToastProvider(
  child: /* MaterialApp / screens */,
)

OneUiToastScope.of(context).add(
  title: 'Plan updated',
  description: 'Your family pack is active.',
  type: OneUiToastType.positive,
);
```

Do not call `OneUiToastScope.of` unless `OneUiToastProvider` is an ancestor.

## Image / IconRemote

If the screen has photos, emit **`OneUiImage(src: …, alt: …)`**. Do not title a
section “Image” and skip the widget.

`OneUiIconRemote` is only for a **remote URL glyph**, not a substitute for Image.

```dart
OneUiImage(src: 'https://example.com/hero.jpg', alt: 'Plan hero')
```

## SelectableSingleTextButton

Label is **at most 2 characters** (language codes, `5G`, `HI`). Not a filter chip.

```dart
OneUiSelectableSingleTextButton(label: '5G', selected: true, onSelectedChange: …)
// WRONG: label: 'Filter: 5G'
```

Use `OneUiChip` / `OneUiSelectableButton` for longer selectable copy.

## Independent selection state

Do **not** bind two controls to one field.

- RadioField and SegmentedControl → separate `String`s
- CheckboxGroup membership and a standalone CheckboxField → separate bools / lists

## Tooltip on touch targets

`OneUiTooltip` defaults to `trigger: 'hover'`. On a touch device there is no
hover, and a plain tap's press-release interval is shorter than the open
delay, so `_scheduleClose` cancels the pending open timer before it fires —
the tooltip never opens on tap (only a long-press past the delay does).

```dart
// WRONG on mobile — tap never opens it, only a long-press does
OneUiTooltip(content: …, child: OneUiIcon(icon: 'info', size: 's'))

// correct — explicit click trigger for touch-primary affordances
OneUiTooltip(trigger: 'click', content: …, child: OneUiIcon(icon: 'info', size: 's'))
```

`content` can be a plain `String` or a widget (`OneUiText`, etc.) — as of the
`one_ui_tooltip.dart` fix that establishes a `neutral`/`bold` `OneUiSurface`
context around the popup body, both resolve the correct on-bold contrast
against the tooltip's own chrome. If you're vendoring an **older**
`ui_flutter` build that predates this fix, `OneUiText` content will render
using the ambient *page* surface colour instead (often invisible against the
tooltip's dark chrome) — in that case pass a plain `String` (or a `Text` with
an explicit color) instead of `OneUiText`.

## Tooltip placement vs. adjacent content

Per the Figma API table (`position` is a plain component property — `bottom`
is the first/default value, with no separate "avoid collisions" prop),
`OneUiTooltip` places its popup exactly where `position` says and does **not**
avoid sibling widgets. Its own collision logic
(`resolveTooltipCollisionPlacement` in `engine/tooltip_position_resolve.dart`)
only flips the side when the popup would run off the **screen edge** — it has
no idea a button row sits a `SizedBox` below the trigger in the same
`Column`. Leaving `position` at its default `bottom` when the trigger is
immediately followed by more interactive content (a button row, another
control) makes the popup render on top of that content, and — because tooltip
text and an opaque control beneath it now occupy the same pixels — the text
reads as cut off / illegible even though nothing was actually clipped.

```dart
// WRONG — default position:'bottom' has ~8px offset before the next Wrap of
// buttons; the popup (often 2 lines) overlaps them
OneUiTooltip(
  content: const OneUiText(text: 'Opens the full component catalog', ...),
  child: OneUiButton(label: 'Hover for tooltip', onPressed: () {}),
),
SizedBox(height: g5),
Wrap(children: [OneUiButton(label: 'Open modal', ...), ...]),

// correct — pick a position that points away from what follows, and leave
// a generous gap (not the tight g5 used between unrelated inline controls)
OneUiTooltip(
  position: 'top',
  content: const OneUiText(text: 'Opens the full component catalog', ...),
  child: OneUiButton(label: 'Hover for tooltip', onPressed: () {}),
),
SizedBox(height: g8),
Wrap(children: [OneUiButton(label: 'Open modal', ...), ...]),
```

When generating a tooltip trigger, look at what comes immediately before and
after it in the layout and choose `position` to point at the side with more
open space — do not leave it at the default just because the API table lists
`bottom` first.

## Chip selected appearance

`OneUiChip` / `OneUiChipGroup` default `appearance` is **`secondary`**, not
`primary`, when there is no parent `OneUiSurface` setting a parent appearance.
A selected filter chip left at the default renders low-contrast
Secondary-Bold tokens instead of the expected Primary-Bold look.

```dart
// WRONG — resolves to secondary-bold (looks dark/low-contrast when selected)
OneUiChipGroup(value: [_filter], onValueChange: …, children: […])

// correct — explicit primary appearance for a "selected filter" affordance
OneUiChipGroup(appearance: 'primary', value: [_filter], onValueChange: …, children: […])
```

`OneUiChipGroup.value`/`onValueChange` are typed `List<String>?` /
`ValueChanged<List<String>>` **unconditionally** — even when `multiple: false`
(single-select just constrains the list to at most one entry). There is no
bare-`String` overload.

```dart
// WRONG — single-select does not mean value becomes a String
String? _filter;
OneUiChipGroup(value: _filter, onValueChange: (String v) => setState(() => _filter = v), children: […])

// correct — always a List<String>, even for single-select
List<String> _filter = [];
OneUiChipGroup(
  value: _filter,
  onValueChange: (v) => setState(() => _filter = List<String>.from(v)),
  children: […],
)
```

## Carousel pagination reads ambient state, not props

`OneUiCarouselPagination` takes no `activePage` / `onActivePageChange` — its
only params are `appearance`, `ariaLabel`, `autoplay`, `testId`. Page position
is owned exclusively by `OneUiCarouselRoot` and read by descendants (dots,
slides) via the ambient `OneUiCarouselScope`, the same pattern as
`OneUiTabsRoot`/`OneUiTabPanel`. Passing `activePage`/`onActivePageChange` to
`Pagination` itself is an `unknown-prop` / compile error.

```dart
// WRONG — Pagination has no activePage/onActivePageChange params
OneUiCarouselPagination(activePage: _page, onActivePageChange: (p) => setState(() => _page = p))

// correct — state lives on Root; Pagination just reads the ambient scope
OneUiCarouselRoot(
  ariaLabel: 'Promotions carousel',
  activePage: _page,
  onActivePageChange: (p) => setState(() => _page = p),
  children: [
    OneUiCarouselSlide(...),
    const OneUiCarouselPagination(),
  ],
)
```

## Object-typed callbacks (Slider, Tabs) need an explicit cast

`OneUiSlider.value`/`onValueChange` are typed `Object?` /
`void Function(Object value)` (not `double`) because the same widget also
supports range mode (`List<double>`). `OneUiTabsRoot`/`OneUiTabGroup.value`/
`onValueChange` are similarly `Object?` (`OneUiTabsValue`). Both require an
explicit cast in the callback — don't "simplify" it away, the un-cast value is
`Object` and won't assign to a typed local.

```dart
// correct — cast is required, not optional cleanup
OneUiSlider(
  value: _volume,
  onValueChange: (v) => setState(() => _volume = v as double),
  min: 0, max: 100,
)

OneUiTabsRoot(
  value: _tab,
  onValueChange: (v) => setState(() => _tab = v as String),
  child: …,
)
```

`OneUiTouchSlider.value`/`onValueChange` are plain `double?` /
`void Function(double)` — no cast needed there; don't copy the `Slider` cast
pattern onto `TouchSlider` by habit.

## BottomNavigation must sit inside a Surface

`OneUiBottomNavigation` paints no background of its own — it reads its
selected/unselected label and icon colors from the ambient
`OneUiSurfaceScope`. Placed directly in `Scaffold.bottomNavigationBar`
wrapped only in `SafeArea` (no `OneUiSurface` ancestor), the selected
label resolves a light-surface text color and becomes invisible against a
manually dark-painted background.

```dart
// WRONG — no Surface ancestor, selected label unreadable
bottomNavigationBar: SafeArea(
  top: false,
  child: OneUiBottomNavigation(value: _tab, onValueChange: …, children: […]),
),

// correct — wrap in a Surface matching the intended background
bottomNavigationBar: SafeArea(
  top: false,
  child: OneUiSurface(
    mode: 'bold',
    child: OneUiBottomNavigation(value: _tab, onValueChange: …, children: […]),
  ),
),
```

## Text inputs are controlled — no `TextEditingController` on InputField

`OneUiInputField` (and `OneUiCheckboxField`/`OneUiRadioField`) take
`value`/`defaultValue`/`onChanged` only — there is **no `controller` prop**.
(`OneUiInput` is the one exception that does accept `controller`; check
`get_component_info` per widget rather than assuming parity.) Creating a
`TextEditingController` for `OneUiInputField` and copying its `.text` in
`onChanged` is dead-weight state duplication left over from stock Flutter
`TextField` habits — it compiles (nothing reads the controller except your
own code), so it won't be caught by `validate_oneui_code`, but it's a code
smell that confuses the next reader into thinking the controller does
something.

```dart
// WRONG — TextEditingController is never actually wired to the widget
final _emailController = TextEditingController();
OneUiInputField(
  value: _emailController.text,
  onChanged: (v) => setState(() => _emailController.text = v),
)

// correct — plain controlled state
String _email = '';
OneUiInputField(
  value: _email,
  onChanged: (v) => setState(() => _email = v),
)
```

## Layout fidelity — match Figma's exact spacing/padding/alignment

Do not eyeball a gap as "roughly medium" — read the Figma frame's actual
spacing token and reproduce it with the real helper, not a nearby-looking
literal.

```dart
double _space(BuildContext context, String tail) {
  return getSpacingTokenPx(
    spacingName: tail,
    platform: OneUiScope.of(context).platformId,
    density: OneUiScope.of(context).density,
    platformsConfig: OneUiScope.of(context).platformsFoundationConfig,
  );
}

// correct — gap and padding each resolved from their own Figma token
Column(
  children: [
    OneUiText(text: 'Plan summary', variant: OneUiTextVariant.title, size: 'M'),
    SizedBox(height: _space(context, 'S')),
    OneUiSurface(
      mode: 'subtle',
      padding: EdgeInsets.all(_space(context, 'M')),
      child: /* … */,
    ),
  ],
)
```

- Every `SizedBox(height:/width:)` used purely for spacing must resolve
  through `_space`/`getSpacingTokenPx` — a bare numeric `SizedBox(height: 12)`
  is the same class of literal as a numeric `EdgeInsets`, it's just not caught
  by `validate_oneui_code` (which only checks `EdgeInsets`).
- Match `crossAxisAlignment`/`mainAxisAlignment` to what Figma's auto-layout
  actually shows (`center`, `spaceBetween`, …) — don't default every `Row`/
  `Column` to `start` because that's what the generic layout-wrap emits.
  `OneUiSurface`'s own internal layout is handled for you; only the
  **arrangement of your own children** needs this attention.
- `Shape`/corner-radius on non-interactive containers should come from the
  component's own default (`OneUiSurface`, `OneUiCard`-equivalents) — don't
  hand-roll a `BorderRadius.circular(12)` on a `Container` standing in for a
  card; use the real surface/card widget instead (see "OneUI widgets only" in
  `SKILL.md`).

## Image / asset handling — how downloaded Figma images map to widgets

`figma_to_code` downloads raster nodes (photos, illustrations) to
`assetsDir` (default `assets/figma/`) and backfills `props.src` with the
resulting path or URL before codegen runs. Icons are never downloaded — they
resolve through `JioIconCatalog` by glyph name instead.

```dart
// Downloaded Figma photo — always OneUiImage, always both src and alt
OneUiImage(src: 'assets/figma/hero_banner.png', alt: 'Family plan hero')

// A remote glyph (rare) — OneUiIconRemote, NOT a substitute for a photo.
// Its only props are src/size/color/tintRaster/onError/onLoad — there is NO
// semanticsLabel/alt, and the widget sets excludeFromSemantics: true internally,
// so it is invisible to screen readers. Wrap it to give it an accessible name.
Semantics(
  label: 'Promo',
  image: true,
  child: OneUiIconRemote(src: 'https://cdn.example.com/icons/promo.svg'),
)
```

- If image download failed (see "Known fidelity gaps" in `SKILL.md`) the
  printer emits `assets/figma/placeholder.png` and a codegen warning — check
  the warning, don't assume every `src` is a real asset just because the file
  compiles.
- Register downloaded assets in `pubspec.yaml` under `flutter: assets:` (or
  reference their absolute URL directly if they were left as REST URLs) —
  a `src` pointing at a path Flutter doesn't know about renders blank at
  runtime with no compile-time error.
- Never name a section "Image" or "Photo" in a screen's comments/structure and
  then skip constructing `OneUiImage` — that's the same class of bug as the
  documented Image/IconRemote gap above.

## Typography-variant selection — matching Figma text styles

Figma text styles map to `OneUiTextVariant` + a variant-scoped `size` string,
not a single flat size scale (see the mapping table in `SKILL.md`).

```dart
// Figma "Headline/L" text style
OneUiText(text: 'Welcome back', variant: OneUiTextVariant.headline, size: 'L')

// Figma "Body/M", medium weight
OneUiText(text: 'Your plan renews on 12 Sep', variant: OneUiTextVariant.body,
    size: 'M', weight: OneUiTextWeight.medium)
```

- Pick `variant` from the Figma text style's family (Display/Headline/Title/
  Body/Label/Code), then pick `size` only from that variant's real list —
  `title` and `headline` share `kOneUiTextTitleSizes` (`S`/`M`/`L`, no `XL`);
  requesting a size outside a variant's list silently snaps to the nearest
  valid step (`_nearestInSubset`), so a screen that "looks a size off" from
  Figma is often this snapping, not a token bug.
- Reach for `weight`/`attention` (`OneUiTextWeight.high/medium/low`,
  `OneUiTextAttention.high/medium/low/tintedA11y`) instead of any literal
  `FontWeight`/`Color` — never wrap plain `Text` with manual `TextStyle` when
  `OneUiText` covers the same visual with the design-system's own resolution.
- Do not invent an `appearance` value on `OneUiText` beyond
  `kOneUiTextAppearances` (`auto`, `primary`, `neutral`, `secondary`,
  `sparkle`, `brand-bg`, `positive`, `negative`, `warning`, `informative`).

## Spacing-scale correctness — never a literal `EdgeInsets`

This generalizes the printer-level rule in `SKILL.md`'s Must-not-generate list
to everything you hand-author, not just what the pipeline emits:

```dart
// WRONG — numeric literal, invisible to brand/density changes
Padding(padding: EdgeInsets.all(12), child: …)
Container(margin: EdgeInsets.symmetric(horizontal: 16), child: …)

// correct — resolves through the same dimension cascade as web/RN
Padding(padding: EdgeInsets.all(_space(context, 'M')), child: …)
Container(margin: EdgeInsets.symmetric(horizontal: _space(context, 'L')), child: …)
```

- This applies to **every** spacing call, not just the ones inside generated
  screens — a hand-written helper widget, a custom card wrapper, a bespoke
  list separator, all go through `getSpacingTokenPx`/`getDimensionValue`.
- If you don't have a `BuildContext` handy (e.g. inside a `CustomPainter`),
  resolve the value once in the parent widget's `build` and pass it down as a
  parameter — do not fall back to a literal because the context isn't in scope.

## App chrome (every screen)

```dart
await JioIconCatalog.instance.ensureLoaded();
await ensureOneUiBrandDefaultsLoaded();
runApp(OneUiBrandProvider(
  mode: 'light',
  child: OneUiToastProvider(
    child: MaterialApp(
      home: OneUiSurface(mode: kSurfaceDefault, child: …),
    ),
  ),
));
```

Import only `package:ui_flutter/ui_flutter.dart` (plus `package:flutter/widgets.dart` / `material.dart` for layout).
