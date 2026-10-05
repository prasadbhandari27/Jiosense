---
name: prd-to-android
description: Build a JDS Jetpack Compose screen from a PRD (no Figma required). Load android foundation tokens (DimToken @360) and MVI/Clean Architecture guidelines, author RefinedNode IR, call codegen_from_ir(platform:"android"), scaffold feature ViewModel/UseCase layers per android-mvi-architecture, validate, then emulator verify against PRD §6. Use when the user wants Android/Compose code from a PRD, Login/feature brief, or screenshot — not when they have a Figma node (use figma-to-android instead).
---

# PRD → JDS Jetpack Compose (Android)

Authoritative orchestration for **Path B** (text/screenshot → IR → `.kt`).  
Full SSOT: [`docs/PRD-TO-ANDROID.md`](../../docs/PRD-TO-ANDROID.md).

## Never hand-author UI `.kt` first

You are the **IR frontend** for the screen UI. Call:

```
codegen_from_ir({ tree, screenName, platform: "android", write: true, outDir, projectRoot })
```

Only hand-edit UI after validate/verify reports concrete gaps (or a missing catalog component).

**App architecture** (ViewModel / UseCase / Repository / Hilt) is **not** emitted by IR codegen —
author those layers yourself following **`references/android-mvi-architecture.md`**. Wire the
generated composable as a stateless Screen that collects `UiState`.

## Steps

1. **PRD shape** — If input is a generic PRD (no §2 brand / named components), run **`expand-prd`** first and wait for confirmation.
2. **Scaffold** — Need a host? `create_oneui_android_app`. Else use existing Gradle app.
3. **Foundations (mandatory before IR)**  
   - `get_skill("build-with-tokens")` + `get_skill_reference("build-with-tokens", "references/android-tokens.md")`  
   - Know **Dim4 = 16dp** @360 default; margin Dim4; gutter Dim2  
   - `oneui-design-composition` + typography-scale + `surface` + `get_brand_tokens`
   - **`get_skill_reference("prd-to-android", "references/android-mvi-architecture.md")`** — MVI + Clean Architecture (mandatory)
4. **Catalog** — `list_components({ platform: "android" })` + `get_component_info` for every component.
5. **Author IR** — See `references/ir-android.md` (Login mapping included).  
   Kinds: `component` | `surface` | `node`. Attention → variant: high=`bold`, medium=`subtle`, low=`ghost`.
6. **Codegen** — `codegen_from_ir(platform:"android")` → presentation screen UI only.
7. **MVI feature wiring** — Under `feature/<name>/` create presentation (Intent/Action/UiState/Effect/ViewModel), domain, data per `android-mvi-architecture`. Host generated Screen from ViewModel state. Stub UseCases/repos when §3a defers API.
8. **Validate** — `validate_oneui_code(platform:"android")` on Compose UI; self-heal ≤3.
9. **Verify** — installDebug → adb screencap → compare §6 → `verify_android_screen_loop` (cap 5).

## Path A (Figma in §6)

Defer to skill **`figma-to-android`** / `figma_to_code(platform:"android")` for the screen UI.
Still load `android-tokens` + **`android-mvi-architecture`** and wrap the result in the same MVI feature package.

## Related

- Tokens: `build-with-tokens` / `android-tokens`
- Architecture: `references/android-mvi-architecture.md`
- Figma: `figma-to-android`
- Command: `/oneui:build-from-prd` with `platform=android`
- IR guide: `references/ir-android.md`
