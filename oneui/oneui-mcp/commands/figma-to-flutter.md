---
name: figma-to-flutter
description: Generate a OneUI Flutter (Dart) screen from a Figma frame via figma_to_code(platform:"flutter"). Manual-only.
disable-model-invocation: true
---

# /oneui:figma-to-flutter

Generate a Dart screen from a Figma frame link via OneUI MCP (`platform: "flutter"`).

1. Ensure the app already has `ui_flutter` vendored (`/oneui:setup-flutter`).
2. Ensure Figma Desktop Bridge is connected (`ensure_figma_bridge`).
3. Call `figma_to_code` with `platform: "flutter"`, `codegen: true`, absolute `projectRoot`, `outDir` `lib/screens`.
4. Run `validate_oneui_code(platform: "flutter")` on the generated `.dart`.
5. Avatars, progress, toast, Image, 2-char selectable text, token EdgeInsets:
   `get_skill_reference("figma-to-flutter", "references/widget-authoring.md")` and `references/avatar.md`.
6. Follow the `figma-to-flutter` skill verify loop (`flutter run` → screenshot → `verify_flutter_screen_loop`).

Do **not** call `figma_to_flutter` — that tool is not on this server. Use `figma_to_code`.
