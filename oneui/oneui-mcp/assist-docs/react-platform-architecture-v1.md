# React platform architecture v1

This document is packaged with `@jds4/oneui-mcp`. It is standalone: a client
must not inspect a parent monorepo to understand the React compiler boundary.

## One server, additive platform ownership

The MCP remains one installable server and one launcher. Platform dispatch is
owned by the server composition root:

```text
figma_to_code
  platform=react       -> registered React adapter
  platform=reactnative -> preserved native pipeline
  future platform      -> separately registered adapter
```

The public tool names, request schemas and response fields do not change.

## Shared authority

These concerns remain shared because their evidence and contracts are not React
syntax:

- Figma capture and Source IR;
- exact identity and diagnosed compatibility recognition;
- `ComponentContract`, the sole component/API/spec authority;
- compiler diagnostics and conservation accounting;
- family evidence and resolved semantic data where it is genuinely common;
- assist protocol schemas that are target-blind.

Shared and core modules never import a concrete platform adapter.

## React-owned implementation

All new React-only implementation belongs under
`packages/mcp/src/platforms/react/`:

- adapter and capability declaration;
- React compile façade;
- React refinement/resolution entrypoints;
- React compound printers and import/file assembly;
- React component snapshot sidecars under `component-meta/`;
- web asset materialization;
- React BrandProvider/theme and project guidance;
- React validation integration;
- assist/analyze/verify orchestration for web projects.

React printers serialize resolved data. They must not infer family meaning from
raw fills, display names, aliases, component properties or child names.

## Preserved React Native path

React Native is intentionally not routed through the new adapter in this
change. Its existing implementation, catalogs, validation rules, KB sources,
fixtures, imports, diagnostics and generated snapshots remain intact. A native
team may opt into `PlatformAdapter` later in a separate reviewed change.

React work must not import or modify:

- native released-export catalogs;
- native validation rules;
- `packages/mcp/assets/native/**`;
- `packages/kb-core/**` or `packages/kb-rn/**`;
- native baseline fixtures or generated native snapshots.

The repository's native-freeze guard verifies those artifacts and normalized
native generator output after the controlled dev merge.

## Packaged knowledge boundary

The npm tarball and plugin zip include this document plus the standalone assist
protocol documents. Consumer agents must not search a parent repository to
understand the React workflow. `oneui-design-composition` and `surface` are the
canonical packaged web composition skills; obsolete duplicate paths are rejected
by distribution validation. The existing plugin-authored native skill is
preserved without moving it into the React module.

## Extension rule

A future Android, Flutter, iOS or other target registers a distinct adapter at
the composition root. It may consume shared capture/contracts/diagnostics, but
it must not change React or native compiler internals to register. A synthetic
adapter test enforces this property.

## Ownership rule

Future React compiler, assist, project, asset and brand work goes under the
React platform directory. Native semantic changes belong to the React Native
team and are not bundled into a React-focused compiler PR. Existing repository
owners remain authoritative; this document does not invent a CODEOWNERS handle.
