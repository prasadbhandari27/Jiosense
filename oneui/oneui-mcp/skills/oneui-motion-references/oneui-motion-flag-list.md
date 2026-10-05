# Motion — Flag List

Violations to catch in existing motion code, for Jio or any sibling brand. No judgement needed — if you see one of these, it's wrong. Shared by `oneui-motion-review` (applied to one diff) and `oneui-motion-improve` (applied across a whole codebase) — the rule content lives once, here; each skill supplies its own procedure for using it.

**Which brand?** Load `oneui-motion-brand-guidance.md` always. If Jio, also load `jio-motion-rules.md` and `oneui-motion-patterns.md` — the exact values below (bucket allowlists, token names, percentages) live there, not duplicated here.

## Values

- `transition: all`
- A raw `cubic-bezier()`, including as a fallback after a token — no exception; tokens are what swap automatically to this brand's reduced-motion tier (Jio calls it "Subtle"), raw curves can't
- A raw millisecond value not backed by a token (exception: icon animation and indeterminate loops, whose timing is its own choreography)
- Any token outside this brand's own canonical set — Jio's list is in `jio-motion-rules.md` and is the default until a brand defines its own; a token outside that set doesn't exist and silently does nothing

## Motion that doesn't match its bucket

Checked against this brand's own property allowlist (Jio's, from `jio-motion-rules.md`, is the default every brand starts from; a documented brand deviation replaces it, an undocumented one doesn't):

- Scale, position or rotation on a bucket 2 component
- Movement larger than small on a bucket 3 component
- Anticipation used outside bucket 4 or 5

## Entry and exit

- Scaling from zero without opacity going from 0 alongside it
- A large element entering from zero instead of this brand's own starting-scale value for large elements (Jio's: 90%, from `jio-motion-rules.md` — the default until a brand defines its own)
- Exit running at the same duration as entry, instead of one step shorter
- Exit leaving in a different direction from the one it entered from
- A popover, dropdown or tooltip entering from its own center instead of its trigger point (modals are the exception — they stay centered)

## Shape and structure

- Keyframes used for something that only moves from one value to another
- JavaScript animation with no stated justification (Jio: any JS at all without asking first — Jio is CSS-only, no exceptions; a sibling brand may use JS, but the deviation still needs a reason, not just a preference)
- Hover present with no press/tap response alongside it — a motion standard, universal: anything that responds to a pointer arriving must also respond to being pressed (Jio's pattern name for this: Tap)

## Accessibility

Full detail and reasoning in `oneui-motion-accessibility`:

- Hover motion not wrapped in a pointer-gate
- Scale, position or rotation surviving under reduced motion — including on a spinner, indeterminate progress, activity pulse or audio reactivity, none of which are essential
- A loop reporting ongoing work reduced to bare `animation: none` with nothing designed to replace it, where the stopped state reads as broken
- A static fallback claimed as sufficient when it's only the frame `animation: none` happened to leave behind — a fallback has to be designed and commented, not inherited
- An animation that can be switched off whose frame zero isn't its resting pose
- A loop that can run past 5 seconds alongside other content with no pause/stop/hide route and no guarantee it's unmounted when the work ends
- Motion claimed essential without a code comment naming which essential case it resembles

## Purpose

- No purpose can be named for it
- A loop over a state that's already resolved (a favourited heart that keeps beating, a shimmer that never stops) — this is a "remove it" fix, not an accessibility one; suppressing it correctly under reduced motion doesn't redeem it for everyone else
