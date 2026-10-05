# Android IR authoring (`RefinedNode` → Compose)

Shared contract with RN / Figma refine. Every node:

```ts
{ kind: "component" | "surface" | "node", … }
```

Catalog names: `list_components({ platform: "android" })` — usually without `Jds` prefix
(`Button`, `InputField`, `Text`, …). Emitter produces `Jds*`.

---

## Node kinds

### `surface`

```jsonc
{ "kind": "surface", "mode": "default", "appearance": "primary", "children": [ … ] }
```

| mode | Compose |
|------|---------|
| `default` / `ghost` / `minimal` / `subtle` / `moderate` / `bold` / `elevated` | `SurfaceType.*` |

Login page shell → **`default`**. Tinted cards → `subtle`/`bold` + appearance.

### `node`

Structural layout only (`Column`/`Row` intent via name/props when emitter supports;
otherwise children stack). Use for grouping without a catalog component.

### `component`

```jsonc
{
  "kind": "component",
  "component": "Button",
  "text": "Log in",
  "props": { "variant": "bold", "appearance": "primary" },
  "children": [ … ],   // slots / nested
  "slots": { … }       // when catalog expects named slots
}
```

Attention → variant: **high→bold**, **medium→subtle**, **low→ghost**.

Images/Logo: set `props.src` (placeholder or drawable name). PRD path has **no** Figma
asset download unless you also call image tooling.

---

## Login screen mapping (worked)

| UI piece | IR |
|----------|-----|
| Page | `{ kind: "surface", mode: "default", children: [ column ] }` |
| Logo | `{ kind: "component", component: "Logo", props: { src: "…" } }` or `Image` |
| Title | `{ kind: "component", component: "Text", text: "…", props: { variant: "headline", size: "S" } }` |
| Subtitle | `Text` `body`/`S` `weight: "low"` |
| Email | `InputField` + label/placeholder props; harvest slots if present |
| Password | `InputField` + password / visibility props from catalog |
| Forgot | `Button` `variant: "ghost"` or `SingleTextButton` |
| Login CTA | `Button` `variant: "bold"` |
| Divider | `Divider` |
| Sign up | `Text` + ghost `Button` or `SingleTextButton` |
| Field error | nest `InputFeedback` under field / use field feedback props |
| Loading | defer heavy auth state; optional `CircularProgressIndicator` when PRD §3 says so |

**Defer (§3a):** social login, analytics, API wiring, rate-limit UX — stub navigation `{}`
only if needed.

Layout intuition @360: horizontal inset **Dim4 (16)**; field stack **Dim3–Dim4**; section
gaps **Dim4–Dim6**. See `android-tokens.md`.

---

## Field components

Input / RadioField / CheckboxField emitters expect **harvested** slots when refining from
Figma (`__harvested*`). For hand-authored IR, put label / description / feedback /
start / end as props or child components matching `get_component_info` for that field.

---

## After codegen

1. Place/host the composable under `feature/<name>/presentation/screen/` (MVI package — see `android-mvi-architecture.md`).
2. Wire ViewModel → UiState → Screen; no Repository calls from Compose.
3. `validate_oneui_code(platform: "android")`
4. Host under `FoundationTheme`
5. Emulator screenshot vs PRD §6 → `verify_android_screen_loop`
