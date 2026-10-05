# @jds4/oneui-mcp

A [Model Context Protocol](https://modelcontextprotocol.io) server for the **One UI / JDS** design system.

It lets an AI coding agent (Claude Code, Cursor, VS Code, Zed, …) build **React (web)**, **React Native**, **Android (Compose)**, and **Flutter (Dart / `package:ui_flutter`)** products that follow OneUI rules: install/update the packages, load design skills, look up
component APIs, tokens, and brands, and ground every decision in the design system.

> **Scope:** one MCP process (`oneui`) for every platform. Pass `platform: "flutter"` on `list_components`, `figma_to_code`, `validate_oneui_code`, and `setup_oneui_project`. There is no separate `oneui-flutter` server.
> **Status:** Phases 0–4 shipped — scaffold, lifecycle tools, knowledge/components/brands, validator (`validate_oneui_code`), Figma → code, and the `/oneui-build-from-prd` orchestration prompt.

## Design principles

- **Self-contained & offline.** Knowledge is a versioned snapshot baked into `assets/`.
  No network, no API keys, no LLM calls inside the server.
- **Zero monorepo dependency at runtime.** The published package imports only
  `@modelcontextprotocol/sdk` + `zod`. Project-lifecycle logic is *vendored* (copied) from
  `@jds4/oneui-init`; the snapshot is generated at authoring time and committed.
- **The coding agent is the LLM.** This server supplies facts, rules, and deterministic
  actions — it never generates UI itself.

## Tools

| Group | Tool |
| --- | --- |
| Registry | `check_oneui_registry`, `get_registry_setup` — verify Azure, then fall back to internal JFrog (**run first**) |
| Lifecycle (web) | `setup_oneui_project`, `check_oneui_versions`, `update_oneui_packages` |
| Lifecycle (native) | `create_oneui_native_app` — emit the `@oneui/create-native-app` CLI command for the user to run in their terminal |
| Lifecycle (android) | `create_oneui_android_app` — scaffold a new native Android (Kotlin/Compose) app from the baked `JdsExternalApp` template |
| Lifecycle (flutter) | `create_oneui_flutter_app` / `setup_oneui_project({ platform: "flutter" })` — vendor `@jds4/oneui-flutter` → `vendor/ui_flutter`, Dart import `package:ui_flutter/ui_flutter.dart`. Consumer walkthrough: `docs/deployment-guide/flutter/MCP-SETUP.md` |
| Knowledge | `search_design_system`, `list_skills`, `get_skill`, `get_skill_reference`, `get_core_invariants` |
| Components | `list_components`, `get_component_info`, `request_component` — file a missing-component gap with the DS team via Teams |
| Brands | `list_brands`, `get_brand_tokens`, `get_brand_design_spec`, `get_surface_guide` |
| Validator | `validate_oneui_code` — inline-surface-paint, legacy-token, unknown-prop, hardcoded-font (Babel AST) |
| Figma | `figma_to_code` — deterministic compile + bounded render/repair; `figma_download_images`; `ensure_figma_bridge`; visual verification tools |

Prompt: `/oneui-build-from-prd` — orchestrates the full search → write → validate → self-heal loop.

> **First-time setup:** the `@jds4/*` packages are not on public npm. The MCP tries
> Azure Artifacts (`JIO-DS-ONE-UI`) first with its gated distribution credential, then
> the anonymous `jsoi-jds_oneui__dev__npm` JFrog mirror when the user is on company
> network/VPN. `check_oneui_registry` merges only the `@jds4` scope and live-verifies
> the selected source before installation.

Read-only resources mirror the snapshot: `oneui://invariants`, `oneui://surface-guide`,
`oneui://registry-setup`, `oneui://skills/{name}`, `oneui://components/{slug}`, `oneui://brands/{slug}`.

## Natural Figma screen requests

The user can simply say: “Create this Figma screen in React using OneUI: <node URL>.” By
default the client calls `figma_to_code`, uses its deterministic output, and follows the
returned bounded render-and-repair contract. Web output must import
`@jds4/oneui-react/styles` exactly once and mount the requested `BrandProvider`.

The source frame dimensions belong to the verification harness. Generated application roots
remain fluid; a 360px Figma frame must not become a production `max-width: 360px` wrapper unless
the user explicitly requests a fixed device shell.

### Hybrid extraction — REST fallback (no Desktop required)

All Figma tools accept **`extractSource: "auto" | "bridge" | "rest"`** (default `"auto"`).

- **`"auto"`** — uses the Desktop Bridge when connected; falls back to Figma REST when the
  bridge is unavailable and `FIGMA_ACCESS_TOKEN`/`FIGMA_TOKEN` is set. REST mode recovers
  `appearance`/`surface` from the **OneUI Stamp plugin** (`@jds4/figma-stamp-plugin` /
  `packages/figma-stamp-plugin` — writes
  variable names into `sharedPluginData`). Unstamped nodes receive no surface info.
- **`"bridge"`** — bridge only; fails immediately if not connected.
- **`"rest"`** — REST only; requires a PAT; never touches the Desktop bridge.

When REST is used, the identity block includes `- **Extractor:** rest` plus
`- **stamped:** true|false`. If **`stamped: false`**, `figma_to_code` returns
`STAMP_OR_BRIDGE_REQUIRED` and **writes no screen** — the agent must ask the user to connect
the Desktop Bridge or stamp the frame, then retry. Pass `allowUnstampedRest: true` only when
the user explicitly accepts degraded defaults. When stamps are present, the response also
prepends a `## ⚠️ Degraded extraction` warning (semantics frozen at stamp-time). Live variable
modes still require the bridge. See [`docs/FIGMA-TO-CODE.md`](docs/FIGMA-TO-CODE.md).

### Experimental assisted composition (opt-in)

Assisted composition is hidden from normal MCP discovery. To evaluate it, explicitly set:

```bash
export ONEUI_MCP_ENABLE_ASSIST_COMPOSE=true
```

and restart the MCP client. This adds `figma_analyze_screen`, `verify_assisted_screen`, and
`oneui://assist/{slug}` to the runtime surface and changes the server instructions to an
analyzer-first workflow. Any unset value, `false`, `1`, or malformed value leaves the MCP in
deterministic-only mode. The MCP still does not host a model or route automatically.

## Develop

```bash
npm install            # installs deps and builds (prepare → tsc)
npm run build:snapshot # regenerate assets/ from the monorepo (authoring-time only)
npm run build          # compile src → dist
node scripts/smoke.mjs # local stdio protocol smoke test
```

## Snapshot

`scripts/build-snapshot.mjs` reads monorepo sources and writes `assets/`:

| Asset | Source |
| --- | --- |
| `skills/` + `skills-index.json` | `.claude/skills/*` |
| `invariants.md` | `packages/shared/src/agent/knowledgeSources.ts` (`CORE_INVARIANTS`) |
| `surface-guide.md` | `docs/surface-context-awareness.md` |
| `components/` + `components-index.json` | `docs/components/generated/*.docs.json` |
| `brand-tokens/` + `brands-index.json` | `cdn-dist/brands/*` |
| `brand-specs/` | `docs/exports/*.DESIGN.md` |
| `native/` (components) | `@jds/kb-rn` via `npm run build:native-snapshot` |
| `search-corpus.json` | all of the above |

The published artifact ships the runtime, snapshot assets, optional assist protocol documents and
sanitized regression evidence required by the supported cached assist flow. It has no runtime
dependency on this monorepo.

## Install as a plugin (recommended)

This package also ships as the **`oneui` Claude Code plugin** ("One UI Coding") — one install
bundles the MCP server with agent-native skills, 9 `/oneui:*` slash commands, and an advisory
validator hook. See **[INSTALL.md](INSTALL.md)** for the full guide. Quick start (local path):

```text
/plugin marketplace add /absolute/path/to/packages/mcp
/plugin install oneui
```

Build first so `dist/` exists: `npm install && npm run build:plugin`.

**Commands:** `/oneui:build-from-prd`, `/oneui:prd`, `/oneui:expand-prd`, `/oneui:prd-to-figma`, `/oneui:figma-to-native`, `/oneui:figma-to-android`, `/oneui:setup`,
`/oneui:setup-native`, `/oneui:validate`, `/oneui:install-rules`.

## Registering as a standalone MCP

For Cursor / VS Code / Zed (or without the plugin). See `TESTING.md` / `INSTALL.md`:

```bash
npm install -g ./releases/jds4-oneui-mcp-0.1.0-alpha.9.tgz

# Claude Code
claude mcp add oneui -- oneui-mcp

# Cursor — add to .cursor/mcp.json
# { "mcpServers": { "oneui": { "command": "oneui-mcp", "args": [] } } }
```
