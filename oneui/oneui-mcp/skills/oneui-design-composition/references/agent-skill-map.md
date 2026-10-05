# Agent → skill grounding (composition stack)

Authoritative composition judgment lives in `oneui-design-composition` (+ `surface` for surface-level choice). Specialist agents in multi-agent UI tools should **read different sections / companion skills**, not invent parallel rules.

| Agent | Primary skills | Focus within composition |
|---|---|---|
| Design Director | `surface`, `oneui-design-composition` §1–4 | Mood, density, palette intensity, surface budget, type/media treatment |
| Layout Architect | `oneui-design-composition` §2, §6–7 + catalog | Ordered page regions, grid, navigation shell |
| Blueprint Planner | `oneui-design-composition` refs (`composition-patterns`, typography, voice) | Section structures + content |
| Layout-IR Planner | composition + typography + catalog | Typed fallback layout architecture |
| Layout/IA Specialist | blueprints / navigation-patterns | Reorder/swap sections, nav, responsiveness |
| Art Direction Specialist | `surface` + brand color roles (§4) | Surfaces, appearances, media treatments |
| Content Strategy Specialist | voice + typography roles (§5) | Headings, body, CTA hierarchy |
| Code Generator | `oneui` + composition + `surface` + catalog | Final OneUI composition in code |
| Design Critic | composition + `surface` + typography | Hierarchy, attention budget, rhythm, polish |
| Tone Repair | voice | Copy rewrite without layout change |
| Section Picker | blueprints + voice | Regenerate one selected section |
| Edit Node | catalog + voice | Targeted IR edits |

**Do not** fork twelve divergent composition skills. Keep one composition + one surface skill; route agents via this map and the existing reference files.
