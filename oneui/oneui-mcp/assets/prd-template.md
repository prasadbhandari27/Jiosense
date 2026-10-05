# OneUI PRD Template

Fill this in and hand it to **`/oneui-build-from-prd`** (paste the whole filled template as the
`prd` argument). Each section maps to a specific MCP step — brand→tokens, scope→don't over-build,
screens→composition + components, constraints→invariants, acceptance→the self-heal stop condition.

The scope split (v1 vs Deferred) is what stops the agent from over-building. Be explicit.

---

## Blank template (copy, fill in)

```markdown
# PRD — <Feature / page name>

## 1. Goal

One or two sentences: what we're building and for whom.

## 2. Brand & theme

- Brand: <jio | reliance | tira | swadesh | …> (default: jio)
- Theme: <jiomart, jio-finance, jio-home, …>
- Mode: <both | light only>
- Platform: <react | reactnative | android> (default: react)
- Viewport: <mobile 360 | desktop 1280> (android / mobile → **360**)

## 3. Scope — THIS version (v1)

What must actually work now. Be explicit about depth.

- …

## 3a. Deferred (later / v2) — DO NOT build now

- …

## 4. Screens & flow

Happy-path journey, in order. Repeat the block per screen.

### Screen <n>: <name> (route: /<path>)

- Purpose: …
- Key content / sections: …
- OneUI components: <list, or "MCP to choose">
- Surface / attention intent: <optional — e.g. default page, one bold CTA>
- Primary actions → next: <button label → destination route>

Flow: Screen 1 → Screen 2 → …

## 5. Data

- sample data, assets, custom shape if relevant.

## 6. Visual references

One line per reference, as `<resolvable path or Figma link> → Screen <n> (route: /<path>)`.
Give a real file path (relative to the project) for each screenshot, not a vague label —
on **reactnative** and **android**, the build's final step screenshots the running screen
and reads it next to this image (`verify_native_screen_loop` / `verify_android_screen_loop`).
A rough mock is fine (semantic compare, not pixel-exact); just make sure the path resolves.
Omit a line if a screen has no reference.

- ./refs/<screen>.png → Screen <n> (route: /<path>)
- <figma-link?node-id=…> → Screen <n> (route: /<path>)

## 7. Constraints (defaults — keep unless you change them)

- **react:** OneUI components only (`@jds4/oneui-react`); icons via `@jds4/oneui-icons-jio`.
- **reactnative:** `@oneui/ui-native` only; tokens via theme / static tokens — no literals.
- **android:** `com.jds.components` / foundation only; `DimToken` / `Appearance` / `Surface` —
  no literal dp/hex; load `android-tokens` before IR; prefer `codegen_from_ir(platform:"android")`.
- Build through the OneUI MCP (invariants → skills → components → validate → self-heal).
- Tokens only, no literals; WCAG AA compliant; responsive / 360 mobile when Platform is android.

## 8. Acceptance criteria

- Done when … (renders, passes `validate_oneui_code` for the chosen platform, primary actions
  navigate or stub cleanly, theme colours accurate; native/android also pass device verify vs §6)
```

---

## Worked example (the e-commerce flow, filled in)

```markdown
# PRD — Jio Commerce flow (v1)

## 1. Goal

A shopping flow inside the Commerce tab: browse products → cart → payment → success.
v1 demonstrates the wired happy-path flow only.

## 2. Brand & theme

- Brand: jio
- Theme: jiomart
- Mode: both

## 3. Scope — v1

- Product listing with product cards + "Add to cart"
- Cart: address form (fields only), item summary, payment summary
- Payment: payment-option selection
- Mock "payment successful" page
- Order successful page
- All primary buttons wired to navigate the happy path

## 3a. Deferred (v2) — DO NOT build now

- Form validation, real merchant/payment integration, inventory, auth, error/empty states

## 4. Screens & flow

### Screen 1: Product Listing (route: /commerce)

- Purpose: browse + add products
- Content: grid of product cards (image, title, price, Add to cart); theme switcher top-right
- Components: Container/Grid, product card (Surface + Image + Text + Button), Button; switcher (MCP to choose: SelectableButton group / Tabs / Menu)
- Actions: "Add to cart" → add item; cart icon → /commerce/cart

### Screen 2: Cart (route: /commerce/cart)

- Content: item summary list, address form (InputFields), payment summary (totals)
- Components: ListItem, InputField, Surface (summary card), Button
- Actions: "Proceed to payment" → /commerce/payment

### Screen 3: Payment (route: /commerce/payment)

- Content: payment options (UPI/card/…), order total
- Components: Radio / SelectableButton group, Surface, Button
- Actions: "Pay now" → /commerce/payment/success (mock)

### Screen 4: Payment Successful (route: /commerce/payment/success)

- Content: success confirmation (positive/sparkle), amount
- Actions: "Continue" → /commerce/order-confirmed

### Screen 5: Order Successful (route: /commerce/order-confirmed)

- Content: order placed, mock order id, summary
- Actions: "Continue shopping" → /commerce

Flow: Listing → Cart → Payment → Payment Success → Order Success

## 5. Data

- Mock: hardcoded product list + mock order id; no backend, random product images.

## 6. Visual references

- ./refs/product-listing.png → Screen 1 (route: /commerce)
- ./refs/cart.png → Screen 2 (route: /commerce/cart)

## 7. Constraints

- OneUI components only; icons via <Icon>; MCP-driven; tokens only; WCAG AA compliant; responsive.

## 8. Acceptance criteria

- Each page renders with OneUI components and passes validate_oneui_code.
- Every primary button navigates per the flow (happy path).
```
