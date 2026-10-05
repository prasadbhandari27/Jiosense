# Responsive application root v1

The source Figma frame width is evidence for capture, generation comparison and visual
verification. It is not a production page-width instruction.

## Required behavior

- A generated application root fills its available viewport: `width: 100%` and an
  appropriate minimum block size such as `min-height: 100dvh`.
- A mobile frame captured at 320px, 360px, 390px or 430px remains usable across the
  supported mobile-width range.
- Grid margins, gutters, density and typography adapt through OneUI tokens and runtime
  breakpoint context.
- Contract-backed fixed component sizes may remain fixed. Horizontal content rails may
  retain item widths and scroll. These are not permission to freeze the page root.
- The exact source viewport is used by the render/verification harness so comparisons
  remain controlled.

## Forbidden inference

Unless the user explicitly requests a fixed device mockup or embedded device shell, an
agent must not copy the Figma root width into:

- application-root `width` or `max-width`;
- a centered shell whose maximum width equals the source frame;
- `min-width` or overflow rules that prevent narrower devices;
- a forced `data-Breakpoint` value solely because the reference used that breakpoint.

For example, a 360px reference does not authorize:

```css
.app-shell {
  max-width: 360px;
  margin-inline: auto;
}
```

A normal fluid web root is structurally equivalent to:

```css
html,
body,
#root {
  margin: 0;
  width: 100%;
  min-height: 100%;
}

.app-shell {
  width: 100%;
  min-height: 100dvh;
}
```

The concrete implementation may use OneUI layout components and tokens instead of this
CSS. The invariant is fluid root ownership, not these exact declarations.

## Verification

Render the same generated screen at the reference width and at least one narrower or
wider supported mobile width. A fixed-width device shell is allowed only when the user
requested one; record that decision separately from compiler fidelity.
