# S17 component ownership and reuse

## Cohesive owners

| Surface | Owner | Boundary |
|---|---|---|
| Route composition | `DemosPageComponent`, `ContactPageComponent`, `LabPageComponent`, `WorkPageComponent` | Routes compose focused pieces and localized data; page classes do not own multiple game/form/playground state machines. |
| Hero orchestration | `HeroMonitorComponent` | Preview selection, monitor expansion, depth transitions and console state. |
| Chart/destination metadata | `hero-monitor.catalog.ts` | Pure labels, icon paths and effect registries; directly tested. |
| Globe metadata | `earth-texture.catalog.ts` | 30 typed presets, categories, locale labels and origin labels; directly tested. |
| Globe controls | `EarthGlobeControlsComponent` | Category tabs, texture buttons, ARIA state and close emission. Parent owns only the selected values. |
| Globe rendering | `EarthGlobeComponent` + `EarthRenderer` | The component owns input, RAF, texture LRU and route teardown; the renderer owns WebGL upload, shader compilation, context listeners and idempotent GPU release. |
| Runtime teardown | `HeroMonitorFacade` + fullscreen coordinator owners | Queued panel/effect timers and frames are cancelled and cleared; destroyed facades reject late scheduling. Named WEBGL-01 evidence proves repeated route entry owns one canvas and no stale node. |
| Work visual art | `WorkProjectVisualComponent` | Six decorative project modes with one typed `IHeroPanelId` contract. |
| Work technology marks | `work-visuals.constant.ts` | One lookup translates technology terms into semantic SVG/color pairs. |
| Demo marks | `demo-visuals.constant.ts` | Shared mark ownership for Work and Demos catalogues. |
| Contact delivery | `ContactDeliveryService` | HTTP boundary, timeout and fallback state separate from the form component. |
| Lab interactions | dashboard/workflow/motion/accessibility/concurrency components | One state machine or calculation domain per child; route remains composition-only. |
| Fullscreen control | `src/styles/motion/_index.scss` mixin `fullscreen-control` | One icon-only geometry/aria contract; each feature chooses the smallest interactive target. |
| Globe texture cache | `EarthGlobeComponent` | Quaternion/input owns loading and a four-entry LRU budget; the renderer only uploads/draws the current canvas. |
| Public visual assets | `public/images/{brand,games,globe,profile}` | Domain-owned folders; no root-level brand/portrait/globe files. |
| Demos interaction | `DemosPageComponent`, `ArcadeGamesComponent`, `DemoGamesComponent`, `ShowcaseComponent` | The route composes a six-game arcade, six-scene showcase and eight compact laboratory games; each game owns state while shared shells and control primitives own interaction mechanics. |
| Docker visual identity | `PUBLIC_LINKS` | The Docker Hub mark is resolved once from the platform catalogue and reused by footer, Work directory and Docker cards; templates do not carry a duplicate path. |

## SCSS ownership

The monitor cascade now loads four concern-owned partials:

1. `home-refinement` — visual hierarchy shared across monitor sections.
2. `console-header-final` — header/platform/console chrome geometry.
3. `monitor-laptop-final` — physical laptop, orb and desktop/mobile spatial contract.
4. `monitor-accessibility-final` — readable labels, overflow, chart representations and globe overlay.

The former `console-final` and `console-layout-final` partials are deleted because no runtime import or independent owner remained. The active cascade contains only `home-refinement`, `console-header-final`, `monitor-laptop-final` and `monitor-accessibility-final`.

## Reuse and testability

- `demoVisual(title)` is consumed by both Demos and Work.
- Technology chip marks are resolved once by `workTechnologyVisual(label)` rather than encoded in the template.
- Docker cards consume the `PUBLIC_LINKS` Docker visual instead of hardcoding an asset path.
- Earth labels and options are no longer embedded in `HeroMonitorComponent`.
- Globe controls now test category/texture output without constructing the full monitor.
- Project visual modes are directly tested for all six `IHeroPanelId` values.
- The extracted catalogues have direct integrity/parity tests.
- Route/page specs remain part of the full app test matrix and cover composition plus localized output.
- Fullscreen targets only the interactive surface: monitor, showcase stage, active game board or individual Lab experiment card.
- `e2e/visual-truth.spec.ts` names viewport/route/theme/locale failures separately from functional smoke tests.

## Tool ownership

- `tools/check-*.script.ts` files own validation gates and remain flat, discoverable entry points.
- `tools/generators/` owns reproducible asset generation; the duplicate root generator is removed.
- `tools/link-delendai-core.script.ts` owns optional local tooling linkage.
- Product scripts in `package.json` compose these owners into `check`, `quality` and `mcp` gates; templates and services do not shell out to tooling.

## Review rationale

A boundary was accepted when it represented one reason to change: visual catalogue data, GPU rendering, control state, delivery integration or project decoration. Extraction was not based on line-count targets alone; it keeps templates and state with the component that owns the interaction while moving pure algorithms and registries to directly testable helpers.
