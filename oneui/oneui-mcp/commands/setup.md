---
name: setup
description: Connect the project to a verified JDS package source and bootstrap One UI into it. Runs check_oneui_registry first (Azure with baked PAT, then anonymous internal JFrog fallback) then setup_oneui_project (installs @jds4/oneui-react + icons + bundler plugin, writes oneui.brands.json). Use when starting a fresh OneUI web project. Manual-only because it installs packages.
disable-model-invocation: true
---

# /oneui:setup

Connect to the JDS feed and bootstrap One UI (web).

## Flow
1. **`check_oneui_registry`** (server `oneui`) — tries Azure Artifacts (`JIO-DS-ONE-UI`) first, then the anonymous internal JFrog mirror on company network/VPN. It selects a source only after a live package lookup. If neither works, follow the returned PAT/network/CA guidance. **Never** paste or log a real PAT into chat.
2. Once connected, **`setup_oneui_project`** — detects framework + package manager, installs `@jds4/oneui-react` + `@jds4/oneui-icons-jio` + the bundler plugin (pinned to highest published versions), and writes `oneui.brands.json`.
3. Wire the provider snippet the tool returns (`<BrandProvider brand="jio">` + the `styles` / icons side-effect imports).

## Inputs the user can give inline
- Brands to seed (default `["jio"]`).
- Whether to actually install (vs dry-run).

## Notes
- For a **new React Native app**, use `create_oneui_native_app` instead — it emits a CLI command for the user to run in their own terminal (the PAT stays out of the MCP).
- For adding OneUI **native** to an EXISTING React Native app, use `setup_oneui_project` with `platform: "reactnative"` (see `/oneui:setup-native`).
- `check_oneui_versions` / `update_oneui_packages` keep packages current later.

## Related
- `/oneui:build-from-prd` — build once setup is done.
- `check_oneui_registry`, `setup_oneui_project`, `create_oneui_native_app` MCP tools.
