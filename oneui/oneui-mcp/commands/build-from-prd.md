---
name: build-from-prd
description: Build a OneUI-compliant screen from a PRD or free-text feature description. Orchestrates invariants → skills → components → brand → codegen → validate → self-heal → device verify. Platforms: react (web), reactnative, android (Jetpack Compose).
---

# /oneui:build-from-prd

Build a OneUI / JDS screen from a requirement, end to end.

## Flow

Invoke the `oneui-build-from-prd` MCP prompt (server `oneui`) with the user's requirement
and a `platform` (`react` | `reactnative` | `android`). **Platform-branched** — selects
runtime, scaffold, codegen path, and validator. Do not shortcut it:

0. **Parse the PRD** — obey §2 brand/theme, build §3 (skip §3a Deferred), wire §4 flow, §8 = stop condition. If the PRD names Compose/`Jds*`/`create_oneui_android_app`, use `platform="android"`. If it names SafeAreaView/ScrollView/"React Native", use `reactnative`.
1. **`get_core_invariants()`**
2. **Skills** — `oneui-design-composition` / `surface` / `surface-context` / `oneui` (+ component `rules/*`).
   - **reactnative:** also `figma-to-native` when Path A; load `build-with-tokens` → `native-tokens` for custom work.
   - **android:** **mandatory** `get_skill("build-with-tokens")` + **`references/android-tokens.md`** (Dim4=16dp @360) **and** `prd-to-android` → **`references/android-mvi-architecture.md`** **before** IR; then `prd-to-android` Path B or `figma-to-android` Path A. After codegen, scaffold MVI feature package (ViewModel/UseCase/Repository).
3. **`list_components({ platform })`** + `get_component_info(name, platform)` — real props only.
4. **`get_brand_tokens(brand, true)`**
5. **Codegen (platform-branched):**
   - **Path A — Figma in §6** → `figma_to_code({ url, platform, codegen: true, brand })`.
   - **Path B — text/screenshot only:**
     - **reactnative / android:** Author `RefinedNode` IR → `codegen_from_ir({ tree, screenName, platform, write: true })`. **Do NOT hand-author TSX/Kotlin** as the default.
     - **react (web):** Hand-author from scaffold until web IR emitter ships.
6. **`validate_oneui_code(code, platform)`** — self-heal up to 3 passes.
7. **Device verify (native + android):** build → screenshot OUTPUT → compare to PRD §6 (semantic). RN: `verify_native_screen_loop`. Android: `verify_android_screen_loop`. Cap 5 → `NEEDS_HUMAN_INPUT`.

## Inputs

- Free-text description **or** completed OneUI PRD (`/oneui:prd` / `expand-prd`).
- Brand (default `jio`), route/screen name.
- **Platform** — `react` | `reactnative` | `android`.  
  Aliases: `native`/`rn`/`expo`/`ios`/`mobile` → `reactnative`.  
  `android` / `compose` / `kotlin` → **android** (not RN).

## Related

- `/oneui:prd-to-android` — Android-only orchestration skill entry
- `/oneui:prd` · `/oneui:expand-prd` · `/oneui:prd-to-figma` · `/oneui:figma-to-android`
- Docs: `packages/mcp/docs/PRD-TO-ANDROID.md`
