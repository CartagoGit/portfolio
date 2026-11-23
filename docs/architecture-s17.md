# S17 component ownership and reuse

## Cohesive owners

| Surface | Owner | Boundary |
|---|---|---|
| Route composition | `DemosPageComponent`, `ContactPageComponent`, `LabPageComponent`, `WorkPageComponent` | Routes compose focused pieces and localized data; page classes do not own multiple game/form/playground state machines. |
| Hero orchestration | `HeroMonitorComponent` | Preview selection, monitor expansion, depth transitions and console state. |
| Chart/destination metadata | `hero-monitor-catalog.ts` | Pure labels, icon paths and effect registries; directly tested. |
| Globe metadata | `earth-texture-catalog.ts` | 30 typed presets, categories, locale labels and origin labels; directly tested. |
| Globe controls | `EarthGlobeControlsComponent` | Category tabs, texture buttons, ARIA state and close emission. Parent owns only the selected values. |
| Globe rendering | `EarthGlobeComponent` + `EarthRenderer` | Quaternion/input lifecycle is separate from WebGL upload, shader compilation and frame rendering. |
| Work visual art | `WorkProjectVisualComponent` | Six decorative project modes with one typed `IHeroPanelId` contract. |
| Work technology marks | `work-visuals.ts` | One lookup translates technology terms into semantic SVG/color pairs. |
| Demo marks | `demo-visuals.ts` | Shared mark ownership for Work and Demos catalogues. |
| Contact delivery | `ContactDeliveryService` | HTTP boundary, timeout and fallback state separate from the form component. |
| Lab interactions | dashboard/workflow/motion/accessibility/concurrency components | One state machine or calculation domain per child; route remains composition-only. |

## SCSS ownership

The monitor cascade now loads four concern-owned partials:

1. `home-refinement` — visual hierarchy shared across monitor sections.
2. `console-header-final` — header/platform/console chrome geometry.
3. `monitor-laptop-final` — physical laptop, orb and desktop/mobile spatial contract.
4. `monitor-accessibility-final` — readable labels, overflow, chart representations and globe overlay.

The former runtime imports for `console-final` and `console-layout-final` were removed because their rules had no remaining independent owner after the physical layout and chrome contracts were established.

## Reuse and testability

- `demoVisual(title)` is consumed by both Demos and Work.
- Technology chip marks are resolved once by `workTechnologyVisual(label)` rather than encoded in the template.
- Earth labels and options are no longer embedded in `HeroMonitorComponent`.
- Globe controls now test category/texture output without constructing the full monitor.
- Project visual modes are directly tested for all six `IHeroPanelId` values.
- The extracted catalogues have direct integrity/parity tests.
- Route/page tests still cover composition and localized output at 43 files / 98 tests.

## Review rationale

A boundary was accepted when it represented one reason to change: visual catalogue data, GPU rendering, control state, delivery integration or project decoration. Extraction was not based on line-count targets alone; it keeps templates and state with the component that owns the interaction while moving pure algorithms and registries to directly testable helpers.
