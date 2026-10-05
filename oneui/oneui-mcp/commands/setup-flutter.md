---
name: setup-flutter
description: >
  Install the OneUI Flutter library into an existing Flutter app, or scaffold a new app.
  Triggers (existing app — run immediately, do not ask for extra prompts):
  "Install OneUI Flutter library", "Install the OneUI Flutter package",
  "Setup OneUI library in my Flutter project", "add ui_flutter", "vendor OneUI Flutter".
  Calls check_oneui_registry(platform flutter) then setup_oneui_project(platform flutter, mode auto, brand jio, subBrand jio).
  New empty folder → create_oneui_flutter_app instead.
---

# /oneui:setup-flutter

Install **OneUI Flutter** (`package:ui_flutter` from Azure `@jds4/oneui-flutter`).

## Existing app (default)

If the user already has a Flutter project (or names a path):

1. `check_oneui_registry({ platform: "flutter" })`
2. `setup_oneui_project({ platform: "flutter", mode: "auto", brand: "jio", subBrand: "jio", projectRoot: <absolute app path or cwd> })`
3. Confirm:
   - `vendor/ui_flutter/pubspec.yaml`
   - `pubspec.yaml` has `ui_flutter: path: vendor/ui_flutter`
   - `flutter pub get` succeeded
4. If `mode:"auto"` cannot authenticate: **stop**. Tell them to use `mode:"terminal"` (they run npm pack) or `mode:"ai"` with their PAT. **Never invent a PAT.**

Do not unpack the MCP `.tgz` into the Flutter app. Do not wait for a 5-step prompt.

Then they can build pages (`OneUiBrandProvider` + `OneUiSurface`, import `package:ui_flutter/ui_flutter.dart`).

## New app

Ask only if there is **no** Flutter project: `create_oneui_flutter_app` with `projectName` and `mode: "auto"`.

## Related

- `/oneui:setup` — web · `/oneui:setup-native` — React Native · `/oneui:setup-android` — Compose.
