# JioSense — home security app prototype

A mobile-first PWA prototype, built as one HTML file. Every UI component comes from the OneUI
design system (CSS ports of `oneui-Button`, `oneui-Chip`, `oneui-Badge`, `oneui-Text`,
`oneui-Avatar`, `oneui-Input` and so on, all driven by `data-*` attributes; tokens in
`oneui/jio-brand-tokens.css`).

## Setup after cloning

```bash
git config core.hooksPath githooks
```

This turns on `githooks/pre-commit`, which copies `home-app-oneui.html` → `index.html` on every
commit that touches the app. Without it the Maze link stops updating.

Preview with any static server from the repo root, e.g. `npx serve -l 3456`, then open
`/home-app-oneui.html`.

## Files

- `home-app-oneui.html` — the app (edit this one).
- `index.html` — exact copy of the app, served at `/Jiosense/`. Never edit by hand; the hook keeps it in sync.
- `sw.js` — service worker. Bump `var CACHE = 'jiosense-vNNN'` on every change.
- `assets/` — images. Generated camera stills live here too (`kitchen-maid-*`, `living-*`).
- `oneui/` — OneUI brand tokens.

## Links

- Maze test link: https://prasadbhandari27.github.io/Jiosense/?fresh=1 (starts at onboarding, first-day Home)
- Share link that opens on Activity: https://prasadbhandari27.github.io/Jiosense/?v=share#events
- Any screen opens directly with `#<screen-name>` (e.g. `#events`, `#home-new`, `#home-new-unknown`).

## Working rules

- **Push every change.** Commit and push to `main` of `prasadbhandari27/Jiosense` (SSH remote) without waiting to be asked, so the Pages and Maze links stay current.
- After pushing, wait ~40s for GitHub Pages and confirm the live `/Jiosense/` matches `home-app-oneui.html` (curl it with a cache-busting query and diff).
- **Light mode only.** When working from a reference image, rebuild the design in light mode — never copy dark colours from it.
- Use OneUI components and tokens; don't invent ad-hoc UI.
- Never put credentials or tokens in commands or files. Don't commit `.claude/`.
- Stage specific files; include any new asset the page references (Pages is case-sensitive, so missing files 404).

## Activity timeline data (inside `home-app-oneui.html`)

- Events live in `LOCATIONS[].alerts` as `{type, priority, cam, day, mins, who?, img?, t, …}`. `day:0` is today.
- Today only shows events up to the phone's clock. The top cards are timed with `minsAgo(n)` and flagged `keep:true` so they always lead the list.
- The rest of today is a scripted day (Aarav, Hamid, Limmi, the maid), written as clock times with `at(h, m)` and shifted as a block to end just before the 4th card.
- Useful flags:
  - `grp` + `headline`: several records form one card with a custom title.
  - `unit:'activities'`: counter wording (default "clips").
  - `thumb:true`: show a clip thumbnail (and no avatar) even for a known person.
  - `since` / `until`: the card's time range.
  - `solo:true`: never merge into a combined card.
  - `alert:true`: compact card with an Alert badge.
  - `noFootage:true`: the detail screen shows a "No footage" panel.
- `priority:'high'` (or an unknown person) = high importance: the big card, a red badge and a place in the stack under the week strip.
- Event-specific images must be listed in `PER_EVENT`, otherwise `CAM_STILL` replaces them with the camera's default frame.
- Known people are in `KNOWN_PEOPLE`; photos are in `WHO_PHOTO` (`assets/people/`).

## Onboarding flow (inside `home-app-oneui.html`)

splash → `ob-login` (OTP sheet) → `ob-loading` (camera search, auto-advances) → steps in `OB_FLOW`:

1. `ob-camselect` — "Camera found" hero per camera (`FOUND_CAMS`), Next / Exit setup (→ splash).
2. `ob-cam-room` — "Where is this camera?" room picker (saves `state.camRooms`). **Out of `OB_FLOW` for now**; the room is confirmed on Step 4.
3. `ob-cam-view` — live view + "Camera adjustment tips" animated card (pure CSS/SVG).
   → `ob-device-ready` "Scanning your room" (not a step; replaces itself via `__routerReplace`).
4. `ob-cam-check` — Step 3 layout: live view (scan), "Looks like your <room>" row (room sheet), then lighting result (fails first, inline fix, "check again"). `primeCamCheck()`.
5. `ob-privacy` → first-day Home.

Hidden for now, code kept: problem sheet on `ob-loading` (`PROBLEM_SHEET_ON`), household step (`ob-household`, out of `OB_FLOW`), TrueView/support on Step 1 (`FOUND_EXTRAS_ON`).
