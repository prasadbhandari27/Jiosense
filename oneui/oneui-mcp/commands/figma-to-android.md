# /oneui:figma-to-android

Generate a JDS Jetpack Compose screen from a Figma frame link via OneUI MCP.

1. Ensure Figma Desktop Bridge is connected (`ensure_figma_bridge`).
2. Call `figma_to_code` with `platform: "android"`, `codegen: true`, absolute `projectRoot`, and `outDir` under `app/src/main/java/...`.
3. Run `validate_oneui_code(platform: "android")` on the generated `.kt`.
4. Follow the `figma-to-android` skill verify loop (gradle → adb screenshot → Figma reference → `verify_android_screen_loop`).

See `skills/figma-to-android/SKILL.md` and `docs/android-figma-codegen-roadmap.md`.
