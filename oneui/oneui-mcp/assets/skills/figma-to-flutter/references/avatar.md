# OneUiAvatar (Flutter)

Call `get_component_info({ name: "Avatar", platform: "flutter" })` before composing.
Widget: `OneUiAvatar`. Import: `package:ui_flutter/ui_flutter.dart` only.
Must sit under `OneUiBrandProvider` + `OneUiSurface`.

`content` is `OneUiAvatarContent.image | icon | text`.
`attention` is `OneUiAvatarAttention.high | medium | low`.
`size` is a **string** t-shirt: `'2xs' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | 'custom'`.
`appearance` is a role string (`'secondary'`, `'primary'`, …). Default in the widget is `'secondary'`.

Do **not** put `OneUiText` (or any Body typography widget) in `fallback` or `icon`.
Avatar already paints initials with its own type tokens. `OneUiText` fights that.

## Text / initials — correct

Pass a **person name** (or letters) on `alt`. Avatar derives initials (`Jane Patel` → `JP`).

```dart
OneUiAvatar(
  content: OneUiAvatarContent.text,
  size: 's',
  attention: OneUiAvatarAttention.medium,
  appearance: 'secondary',
  alt: 'Jane Patel',
)
```

`size: '2xs'` and `'xs'` **cannot** show text — the widget demotes those to **icon** (default person glyph). Use `'s'` or larger for initials.

Custom letters only when they are **not** initials from a name — use Flutter `Text`, never `OneUiText`:

```dart
OneUiAvatar(
  content: OneUiAvatarContent.text,
  size: 's',
  alt: 'User',
  fallback: Text('JP'),
)
```

## Image — correct

`content: image` **requires** `src` (https URL or vendored asset path). Without `src` the widget never shows a photo; it uses `icon` → `fallback` → default person.

```dart
OneUiAvatar(
  content: OneUiAvatarContent.image,
  src: 'https://example.com/photo.jpg',
  size: 'l',
  attention: OneUiAvatarAttention.low,
  alt: 'Alex Brown',
)
```

Network failure fallback (optional): `fallback: Text('AB')` — still not `OneUiText`.

No photo URL → use **text** or **icon** mode. Do not emit `content: image` as a “placeholder”.

## Icon — correct

```dart
OneUiAvatar(
  content: OneUiAvatarContent.icon,
  size: 'm',
  alt: 'Account',
)
```

Optional `icon:` is a **glyph widget** (catalog icon), not `OneUiText`.

## Incorrect (do not generate)

```dart
// WRONG — OneUiText overrides Avatar initials styling
OneUiAvatar(
  content: OneUiAvatarContent.text,
  fallback: OneUiText(text: 'JP'),
  size: 's',
  alt: 'Initials avatar',
)

// WRONG — image mode with no src is not an image
OneUiAvatar(
  content: OneUiAvatarContent.image,
  size: 'l',
  fallback: OneUiText(text: 'AB'),
  alt: 'Image fallback avatar',
)
```

`validate_oneui_code(platform: "flutter")` flags both of those patterns.
