---
name: setup-native
description: Bootstrap OneUI into a React Native project. Runs create_oneui_native_app for a brand-new Expo app, or setup_oneui_project({platform:"reactnative"}) to add OneUI native to an EXISTING React Native app. Manual-only because it installs packages / scaffolds a project.
disable-model-invocation: true
---

# /oneui:setup-native

Bootstrap OneUI Native (`@oneui/ui-native`) — new app or existing app.

## Flow
1. **Ask the user: new app, or existing app?**
2. **New app** → `create_oneui_native_app` (server `oneui`). Needs a `mode`
   (`auto`/`terminal`/`ai`) — see that tool's description for the PAT/feed tradeoffs.
3. **Existing app** → `setup_oneui_project({ platform: "reactnative", mode: ... })` —
   installs `@oneui/ui-native` + `@oneui/icons-jio-native` + `@oneui/native-cdn`,
   writes/updates `oneui.brands.json` (native shape), wires the 4 JioType fonts
   (see below), and returns the `<OneUIBrandProvider>` snippet. Also needs
   `mode` (same three paths).
4. Wire `<OneUIBrandProvider brand="jio" theme="...">` per the returned snippet.
5. Run `npx oneui-native-cdn prefetch` to fetch brand data.

## Fonts
Both flows wire the 4 JioType fonts (Black/Bold/ExtraBlack/Medium) automatically —
no separate step needed. If fonts are missing from an app set up some other way
(or were deleted), run `setup_oneui_native_fonts` on its own — it's idempotent,
safe to re-run, and needs no PAT (the fonts are public). For an Expo app it
patches `app.json` and returns the exact `useFonts()` snippet to paste into the
root layout if one wasn't found automatically; for bare React Native CLI it
patches `react-native.config.js` and tells you to run `npx react-native-asset`.

## Notes
- Both flows are PAT-gated: `@oneui/*` lives on a DIFFERENT private feed
  (`JIO-DS-OneUI-Native`) than the web `@jds4/*` feed (`JIO-DS-ONE-UI`).
- **Never invent or reuse a PAT** — always ask the user for their own.
- `check_oneui_versions` / `update_oneui_packages` keep native packages current later
  (once connected to the native feed).

## Related
- `/oneui:setup` — the web equivalent.
- `/oneui:figma-to-native` — build a screen once setup is done.
- `create_oneui_native_app`, `setup_oneui_project`, `setup_oneui_native_fonts` MCP tools.
