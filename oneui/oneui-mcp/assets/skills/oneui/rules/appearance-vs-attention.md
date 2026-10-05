# Appearance vs Attention

`appearance` and `attention` are **two different props** that compose. Confusing them is the most common OneUI mistake. Confirm a component's exact enums with `get_component_info`.

- **`appearance`** = the *color role*: `primary` `secondary` `neutral` `sparkle` `brand-bg` `positive` `negative` `warning` `informative` (default `auto` → resolves to `primary`). It answers *which palette*.
- **`attention`** = the *emphasis level*: `high | medium | low`. It answers *how loud*. It maps to a visual variant:

| attention | variant | fill | text |
| --- | --- | --- | --- |
| `high` | `bold` | `--{Role}-Bold` | `--{Role}-Bold-High` |
| `medium` | `subtle` | `--{Role}-Subtle` | `--{Role}-TintedA11y` |
| `low` | `ghost` | transparent | `--{Role}-TintedA11y` |

## A "secondary button" is `attention="medium"`, not `appearance="secondary"`

The single most important distinction. A lower-emphasis button keeps its color role and drops its attention. `appearance="secondary"` recolors the button into the *secondary accent role* — that is not what "secondary button" means.

**Incorrect:**
```tsx
<Button appearance="secondary">Cancel</Button>   {/* recolors to the accent role */}
```

**Correct:**
```tsx
<Button attention="high">Save</Button>      {/* the one primary CTA — bold */}
<Button attention="medium">Cancel</Button>  {/* secondary emphasis — subtle, still primary role */}
<Button attention="low">Skip</Button>       {/* tertiary — ghost */}
```

Why: button hierarchy is an *emphasis* decision (`attention`), not a *color* decision. `appearance` stays `auto`/`primary` for standard actions.

## `secondary` appearance is for non-forward / accent elements

Use the `secondary` color role on controls that **don't move the user forward** — chips, sliders, selected states, links, secondary-tinted cards — not on buttons to demote them.

**Incorrect:**
```tsx
<Button appearance="secondary" attention="high">Continue</Button>  {/* a CTA is primary */}
```

**Correct:**
```tsx
<Button attention="high">Continue</Button>                {/* forward action → primary */}
<Chip appearance="secondary">Selected filter</Chip>       {/* accent, non-forward */}
<Slider appearance="secondary" />                          {/* interaction, not navigation */}
```

## Input `attention` is `medium | high` only — never `low`

`Input` (and `TextArea`) deliberately omit `low`: a transparent field on the default surface would be undiscoverable. `medium` is outlined (default); `high` is a filled neutral background.

**Incorrect:**
```tsx
<Input attention="low" placeholder="Email" />   {/* not a valid value */}
```

**Correct:**
```tsx
<Input attention="medium" placeholder="Email" />            {/* outlined (default) */}
<Input attention="high" shape="pill" type="search" />        {/* filled — e.g. a prominent search */}
```

## `IconButton`: a bare icon is `attention="low"`; `medium`/`high` draw a filled circle

`IconButton` defaults to `attention="high"` — a filled circular background behind the glyph. The attention level *is* the presence of that circle: `low` (ghost) is a **bare icon with no background surface**; `medium` (subtle fill) and `high` (bold fill) **always** render the circular background. So choose the level by whether you want the chip/circle, not by color.

**Incorrect:**
```tsx
<IconButton icon="close" aria-label="Close" />               {/* defaults to high → filled circle where a bare icon was intended */}
<IconButton aria-label="Close"><Icon icon="close" /></IconButton>  {/* icon nested as a child */}
```

**Correct:**
```tsx
<IconButton icon="close" attention="low" aria-label="Close" />      {/* bare glyph, no circle — e.g. a header/toolbar action */}
<IconButton icon="favorite" attention="medium" aria-label="Save" /> {/* subtle filled circle */}
<IconButton icon="add" attention="high" aria-label="Add" />         {/* bold filled circle */}
```

Pass the icon through the `icon` prop as a semantic name or an IconComponent (native: `icon={IcClose}`) — never as a nested `<Icon>` child (`IconButton` is a leaf; children are not its API). `aria-label` is mandatory — it is the only accessible name.

## Don't set `variant` by hand when `attention` expresses intent

`attention` resolves to the `bold|subtle|ghost` variant for you and keeps the surface-context remapping correct. Reach for `variant` only when you have a specific reason; otherwise express intent with `attention`.

**Incorrect:**
```tsx
<Button variant="bold">Save</Button>
<Button variant="bold">Save and add another</Button>   {/* two competing bold CTAs */}
```

**Correct:**
```tsx
<Button attention="high">Save</Button>
<Button attention="medium">Save and add another</Button>
```

Why: attention budget — roughly one `high` focal point per viewport, the rest `medium`/`low`. See the `surface` and `oneui-design-composition` skills for how much attention a region should earn.

## Semantic roles are for status, not decoration

`positive | negative | warning | informative` communicate state; `sparkle` is celebration; `brand-bg` is a brand moment. Don't use them as generic accents.

```tsx
<Badge appearance="negative">Failed</Badge>        {/* status */}
<Badge appearance="sparkle">New</Badge>            {/* rare celebration moment */}
```
