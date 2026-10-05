# Connecting to the JDS / OneUI private feed

> **This is the first and most important step.** The `@jds4/*` packages
> (`@jds4/oneui-react`, `@jds4/oneui-icons-jio`, the bundler plugins) are NOT on
> public npm. They are mirrored on **Azure Artifacts** and the internal **JFrog**
> registry. Run this check BEFORE `setup_oneui_project` or any install so the MCP
> can live-verify a source instead of trusting whichever `.npmrc` happens to exist.

## Feed identity

| Field | Value |
|---|---|
| Feed name | `JIO-DS-ONE-UI` |
| Organisation | `jio-dsp` |
| Registry URL | `https://jio-dsp.pkgs.visualstudio.com/_packaging/JIO-DS-ONE-UI/npm/registry/` |
| Connect page | `https://jio-dsp.visualstudio.com/DS-Assets/_artifacts/feed/JIO-DS-ONE-UI/connect` |
| Create a PAT | `https://jio-dsp.visualstudio.com/_usersSettings/tokens` |
| JFrog fallback | `https://devopsartifact.jio.com/artifactory/api/npm/jsoi-jds_oneui__dev__npm/` |

## Automatic source policy

1. **Azure first:** the gated MCP writes/refreshed host-scoped Azure auth, routes only
   `@jds4/*` to `JIO-DS-ONE-UI`, and runs a read-only
   `npm view @jds4/oneui-react version`.
2. **JFrog fallback:** only when Azure verification fails, the MCP switches the project
   `@jds4` scope to `jsoi-jds_oneui__dev__npm` and repeats the live lookup. JFrog is
   anonymous but normally requires company Wi-Fi/network or VPN.
3. **Neither works:** the MCP restores Azure as the durable default and blocks install,
   reporting both failures. An off-network user is never left pinned to a VPN-only URL.

The Azure credential is scoped to Azure hosts and is not sent to JFrog. While JFrog is
selected, the MCP runs only its npm child processes with `NPM_CONFIG_STRICT_SSL=false`.
It does not persist `strict-ssl=false` in project/user config and does not weaken Azure
or unrelated npm commands.

> **Two host forms (both kept as backup):**
> - **Primary:** `jio-dsp.pkgs.visualstudio.com` — the form the feed's own "Connect to feed" page generates.
> - **Backup:** `pkgs.dev.azure.com/JIO-DSP` — equivalent modern Azure host.
>
> The generated project `.npmrc` uses the primary host, with the backup included as a
> commented line you can swap to if the primary 401s/404s. The user `~/.npmrc` auth block
> includes credentials for **both** hosts — npm only applies the auth matching the active
> `@jds4:registry=` host, so listing both is harmless and means either form works without
> re-editing. The scoped mapping deliberately preserves the user's normal corporate/public
> registry for every package outside `@jds4/*`. The one rule: the active
> `@jds4:registry=` line and its `:_password=` auth lines must share the
> same host.

## Step 0 — Access paths

- **External/off-network:** use the gated MCP's baked Azure credential.
- **Company network/VPN:** Azure remains primary; anonymous JFrog is the automatic fallback.
- **Local/dev MCP without a baked credential:** use personal Azure feed access, or explicitly
  configure JFrog while on the company network/VPN.

## Situation A′ — gated distribution builds: auto-connect, no PAT needed

On a build of this MCP produced by the gated release pipeline, `check_oneui_registry` carries
its own shared, org-owned Packaging:Read credential and tries Azure first. If Azure fails, it
tries anonymous JFrog and selects it only after a live package read succeeds. **The user never
sees or handles a PAT in this situation.** This only applies to gated distribution builds; a
local/dev build with neither personal Azure auth nor an accessible JFrog route falls through
to the manual situations below.

## The three manual situations

Determine which one applies by checking the project `./.npmrc` and the user `~/.npmrc`
(the `check_oneui_registry` tool does this automatically and tells you the status).

### A. Already connected (`status: connected`)
A supported registry passed a live read: Azure with auth, or anonymous JFrog on the
company network/VPN. Nothing to do — proceed to `setup_oneui_project` / installing packages.

### B. Project set up but new to JDS, or registry set without a token (`status: registry-no-auth` / `not-configured`)
The project may already exist; it just isn't wired to the JDS feed. Do this:

1. **Merge the scoped registry into project `./.npmrc`** (no secret; existing corporate
   registry and unrelated settings must be preserved):
   ```
   ; OneUI/JDS web packages only — preserve the default registry for all other packages.
   @jds4:registry=https://jio-dsp.pkgs.visualstudio.com/_packaging/JIO-DS-ONE-UI/npm/registry/
   always-auth=true
   legacy-peer-deps=true

   ; Azure alternate host:
   ; @jds4:registry=https://pkgs.dev.azure.com/JIO-DSP/_packaging/JIO-DS-ONE-UI/npm/registry/

   ; JFrog fallback (company network / VPN):
   ; @jds4:registry=https://devopsartifact.jio.com/artifactory/api/npm/jsoi-jds_oneui__dev__npm/
   ```
2. **Add the auth token to your USER `~/.npmrc`** (this is where the secret lives, so it
   never gets committed). It carries auth for BOTH host forms as a backup — npm only uses
   the one matching your active `registry=`. Copy this block in, then replace **all four**
   `[BASE64_ENCODED_PERSONAL_ACCESS_TOKEN]` values with your Base64 PAT:
   ```
   ; begin auth token
   ; --- primary host (jio-dsp.pkgs.visualstudio.com) ---
   //jio-dsp.pkgs.visualstudio.com/_packaging/JIO-DS-ONE-UI/npm/registry/:username=JIO-DSP
   //jio-dsp.pkgs.visualstudio.com/_packaging/JIO-DS-ONE-UI/npm/registry/:_password=[BASE64_ENCODED_PERSONAL_ACCESS_TOKEN]
   //jio-dsp.pkgs.visualstudio.com/_packaging/JIO-DS-ONE-UI/npm/registry/:email=npm requires email to be set but doesn't use the value
   //jio-dsp.pkgs.visualstudio.com/_packaging/JIO-DS-ONE-UI/npm/:username=JIO-DSP
   //jio-dsp.pkgs.visualstudio.com/_packaging/JIO-DS-ONE-UI/npm/:_password=[BASE64_ENCODED_PERSONAL_ACCESS_TOKEN]
   //jio-dsp.pkgs.visualstudio.com/_packaging/JIO-DS-ONE-UI/npm/:email=npm requires email to be set but doesn't use the value
   ; --- backup host (pkgs.dev.azure.com/JIO-DSP) ---
   //pkgs.dev.azure.com/JIO-DSP/_packaging/JIO-DS-ONE-UI/npm/registry/:username=JIO-DSP
   //pkgs.dev.azure.com/JIO-DSP/_packaging/JIO-DS-ONE-UI/npm/registry/:_password=[BASE64_ENCODED_PERSONAL_ACCESS_TOKEN]
   //pkgs.dev.azure.com/JIO-DSP/_packaging/JIO-DS-ONE-UI/npm/registry/:email=npm requires email to be set but doesn't use the value
   //pkgs.dev.azure.com/JIO-DSP/_packaging/JIO-DS-ONE-UI/npm/:username=JIO-DSP
   //pkgs.dev.azure.com/JIO-DSP/_packaging/JIO-DS-ONE-UI/npm/:_password=[BASE64_ENCODED_PERSONAL_ACCESS_TOKEN]
   //pkgs.dev.azure.com/JIO-DSP/_packaging/JIO-DS-ONE-UI/npm/:email=npm requires email to be set but doesn't use the value
   ; end auth token
   ```
3. **Create + encode the PAT** (see "Creating a Personal Access Token" below).
4. Re-run the registry check. It verifies the effective `@jds4` route and performs a
   read-only `npm view @jds4/oneui-react version` before permitting installation. A
   `401 Unauthorized` later means the token expired — regenerate and repeat.

### C. Brand-new user, nothing set up (`status: not-configured`)
Same as B, plus: create the project first (`setup_oneui_project` handles framework
detection). The agent SHOULD write the project `./.npmrc` from the values above, then
ask the user to create the PAT and add the auth block to `~/.npmrc`. Do not install
packages until the token is in place.

## Creating a Personal Access Token (PAT)

1. Go to **`https://jio-dsp.visualstudio.com/_usersSettings/tokens`**.
2. Create a token with **Packaging → Read & write** scope.
3. **Base64-encode** the token.

   **macOS / Linux** — safe method (no shell history):
   ```
   node -e "require('readline').createInterface({input:process.stdin,output:process.stdout,historySize:0}).question('PAT> ',p => { b64=Buffer.from(p.trim()).toString('base64');console.log(b64);process.exit(); })"
   ```
   Paste the PAT, press Enter, copy the Base64 output.

   **Windows** — instead of hand-editing, you can run:
   ```
   vsts-npm-auth -config .npmrc
   ```
   This adds an Azure Artifacts token to your user-level `~/.npmrc` automatically. You
   don't need to re-run it every time — only when npm returns `401 Unauthorized`.
4. Replace **both** `[BASE64_ENCODED_PERSONAL_ACCESS_TOKEN]` values in `~/.npmrc` with the
   Base64 string from step 3.

## Installing the packages (once connected) — get the NEWEST version

The `latest` dist-tag can lag behind the newest alpha (it pointed at `0.1.0-alpha.0` while
`alpha.5` was newest). So **do NOT** rely on a bare `npm install @jds4/oneui-react` or `@latest`.
Resolve the highest published version from the full versions list and pin it:

```bash
# 1. List all published versions (highest semver wins, incl. prereleases)
npm view @jds4/oneui-react versions --json     # → […, "0.1.0-alpha.5"]
# 2. Install that exact version; resolve each package independently
npm install @jds4/oneui-react@0.1.0-alpha.5 @jds4/oneui-icons-jio@0.1.0-alpha.5
npm install -D @jds4/oneui-vite-plugin@<its-newest>   # (or webpack/next/esbuild plugin)
```

Or just call the MCP's `setup_oneui_project` (or `update_oneui_packages`) — it does exactly
this: resolves each package's highest published version and installs it pinned.

## Security rules (for the agent)

- **NEVER** print, echo, or log a real token value in a tool response — that lands in the
  agent transcript/conversation logs regardless of where the token came from. A real token is
  only ever written to disk (`.npmrc`), never placed in text shown to the user.
- **NEVER commit a real PAT.** On a gated distribution build, the shared credential is baked
  in at build time from a CI secret and never appears in the git source tree; it is only ever
  written to a local `.npmrc` on the machine running the tool.
- On the manual path (situations A/B/C below), the token still comes only from the user — when
  showing the auth block, use the `[BASE64_ENCODED_PERSONAL_ACCESS_TOKEN]` placeholder and ask
  the user to substitute their own token.
- If you write a project `./.npmrc`, also ensure `.npmrc` is in `.gitignore` if a token
  could ever end up there.
