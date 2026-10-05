---
name: prd-to-android
description: Build a JDS Jetpack Compose (.kt) screen from a PRD via IR → codegen_from_ir(platform:"android"). Use when targeting Android/Compose without a Figma node.
---

# /oneui:prd-to-android

1. Ensure PRD is OneUI-shaped (`/oneui:expand-prd` if needed).
2. Follow skill **`prd-to-android`**: load **`build-with-tokens` → `references/android-tokens.md`** and **`references/android-mvi-architecture.md`** (MVI + Clean Architecture), then catalog, author IR, `codegen_from_ir(platform:"android")`, scaffold feature ViewModel/UseCase layers, validate, `verify_android_screen_loop`.
3. Or invoke MCP prompt `oneui-build-from-prd` with `platform: "android"`.

Docs: `packages/mcp/docs/PRD-TO-ANDROID.md`, `packages/mcp/docs/android-mvi-architecture.md`.
