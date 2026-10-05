---
name: figma-to-android
version: 0.1.0
visibility: public
description: >
  Turn a Figma frame into a runnable, visually-verified JDS Jetpack Compose
  (Kotlin) screen. Drives figma_to_code(platform:"android", codegen=true),
  certifies with validate_oneui_code(platform:"android"), then builds on an
  emulator, screenshots, and compares against the Figma frame — hand-authoring
  fixes for visual mismatches. Use whenever building an Android screen FROM a
  Figma design (figma.com URL with node-id), or debugging extract → refine →
  download-assets → Compose codegen → validate → build → screenshot → fix.
---

# Figma → JDS Jetpack Compose (Android)

`figma_to_code(platform:"android", codegen:true)` extracts a Figma frame and
writes a catalog-grounded `.kt` Compose screen plus a temporary `.json` sidecar
(raw hierarchy — debug aid). This skill drives that pipeline and the mandatory
verify loop. `validate_oneui_code(platform:"android")` clean is necessary but
NOT sufficient — always run build → screenshot → compare → fix.

## Prerequisites

- **Figma Desktop** open on the target file with the **Bridge plugin connected**.
- **`FIGMA_ACCESS_TOKEN`** for image download.
- An Android/Gradle app with JDS (`com.jds:components` + foundation) and themes
  registered (`FoundationTheme` / `registerAppThemes` / `./gradlew generateDesignTokens`).
- Emulator or device with `adb` (prefer emulator).

## Pipeline

1. **Extract** — props + Modes via Desktop Bridge (`ensure_figma_bridge`).
2. **Refine** — same native refine/semantics as RN (`kind: component|surface|node`).
3. **Download images** — rasters only (not icons) → `app/src/main/res/drawable/` as `R.drawable.*`.
4. **Codegen** — `generateComposeScreen` → `<Class>.kt` + `<Class>.json` sidecar.
5. **Validate** — `validate_oneui_code(platform:"android")` (catalog + no literal dp/hex).
6. **Build, screenshot, compare, hand-fix** — mandatory (see below).

## Invocation

```
figma_to_code(
  figmaUrl,                 // must include ?node-id=...
  platform: "android",
  brand, subBrand,          // recorded; theme wiring is Gradle/create_oneui_android_app
  codegen: true,            // default for android
  outDir: "app/src/main/java/com/jio/jiostore",
  projectRoot: "<absolute path to Android app>",
  assetsDir: "app/src/main/res/drawable",
)
```

Lib/tests (no MCP): `runAndroidFigmaToCode({ figmaUrl, projectRoot, outDir })`
from `@jds4/oneui-mcp` internal `src/lib/androidFigmaPipeline.ts`.

## Mapping notes

- Spacing → `FoundationTheme.dimension(DimToken.*)` — **Dim4 = 16dp @360 default** (full table: `get_skill("build-with-tokens")` → `android-tokens`)
- Surfaces → foundation `Surface(type, appearance)` / IR `kind: surface`
- Components → catalog `Jds*(attributes = Jds*Attributes(...))`
- Button sizes: Figma `6/8/10/12` → `XS/S/M/L`; Avatar `2XL` → `XL2`
- Slots: Icon/Text/Image attributes coerced to `JdsSlot` when evidence exists
- Gaps → `// TODO(…)` — never invent literal dp/hex
- **No Figma?** Use skill `prd-to-android` / `codegen_from_ir(platform:"android")` after loading android-tokens.

## Build, screenshot & hand-fix loop

1. Host the composable (MainActivity / NavHost).
2. `./gradlew installDebug`
3. `adb exec-out screencap -p > .oneui-verify/actual.png`
4. Figma frame screenshot → `.oneui-verify/reference.png`
5. Compare; list concrete mismatches; edit the `.kt`
6. `validate_oneui_code(platform:"android")` then `verify_android_screen_loop`
7. Cap **5** iterations. If not converged → `NEEDS_HUMAN_INPUT`

Never declare done on validate alone.
