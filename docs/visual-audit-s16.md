# S16 visual truth audit

Validated against the current `develop` source on 2026-11-24 with Angular, Playwright, production and SSR output.

## Named viewport matrix

The executable matrix lives in `e2e/visual-truth.spec.ts` and covers all eight routes at four device classes: 1440×900 desktop, 1024×768 laptop, 768×1024 tablet and 390×844 smartphone. It names failures by viewport/route, rejects unresolved `pages.*`/`content.*` copy, checks broken images and requires zero horizontal overflow.

## Monitor and globe

- At 1366×768 the frontal monitor measures 802×501 px at x=530/y=171 and ends 32 px above the fixed footer. The resting transform is `none`.
- Selector, chart controls and destination rail report zero icon/text intersection area.
- The monitor offers 14 chart variants in two rows and a controlled destination rail.
- Globe controls mount through `EarthGlobeControlsComponent`; desktop and mobile both report zero overflow for the control panel itself.
- At 390×844 the control panel is 240 px high, arranged as category rail, texture rail, origin, hint and full-width close action. Both rails scroll independently and do not overlap copy.
- All 30 presets load, retain the selected style and report WebGL error `0`; failed network requests: 0.
- Saturn renders the planet and rings inside the same shader/quaternion path. The CSS ring pseudo-elements are disabled.
- Every newly generated map is 4096×2048 and reproducible through `tools/generators/generate-globe-assets.py`.

## Active-theme evidence

| Theme | Scrim | Panel | Active control |
|---|---|---|---|
| light | `rgba(236, 244, 255, .76)` | light surface | cyan-border + dark ink |
| dark | `rgba(1, 7, 15, .84)` | dark surface | cyan-border + light ink |
| solar | `rgba(255, 245, 219, .78)` | warm surface | amber-border + dark ink |
| mono | `rgba(246, 248, 250, .8)` | white/graphite surface | graphite-border + dark ink |

The scrim value exactly matches the active theme token in all four cases; controls no longer fall back to user-agent gray/black.

## Work catalogue

- Six primary projects retain the curated order and verified destinations.
- Four verified public demos extend the page beyond the six primary cards.
- Every technology chip renders a semantic SVG plus its localized label (19/19 at the audited state).
- Six `data-project` modes produce six distinct background systems and mount six focused visual components: network, API route, model stack, terminal/lacing, print paper and vault.
- `DemosPage` and `WorkPage` share one `demoVisual` registry; no mark or path is duplicated.

## Technical gate

- `git diff --check`: pass.
- typecheck (`app`, specs, E2E): pass.
- strict lint (`src`, tests, E2E, tools): pass.
- unit/integration: 54 files / 141 tests pass.
- browser regression: 7/7 pass.
- new named visual matrix: `e2e/visual-truth.spec.ts`.
- production + 160-route SSR prerender: pass.

## Corrective pass — 2026-11-26

- At 390×844 the monitor no longer scales the full 780 px desktop composition down to unreadable text. The header becomes a 56 px control plus banner row followed by two explicit 44 px platform/action rows.
- Project/technology selection is a 66 px horizontal rail; each button is at least 56 × 132 px. Chart controls use four columns at 12 px labels and 44 px targets. Destinations stay in a horizontal snap rail with 12 px labels.
- Globe controls use a one-column panel with 46 px 2-column category/texture buttons. Origin/hint occupy their own rows and the close action is sticky, full-width and 44 px on the fifth row.
- Browser measurement confirms the close action remains inside the 844 px viewport, the globe selects Saturn, and dismiss restores the monitor. `S16-01 mobile monitor and globe controls are readable and touchable` passes.
- Desktop and mobile visual review confirms Earth clouds, Saturn/rings, rugby geometry, football pattern and Cartago logo/portrait presets remain recognisable; the shader owns these shape-specific paths rather than relying on a generic sphere alone.
- Human status: **ready for visible approval**. The automated evidence removes the prior measured mobile failures; `review-state` must remain `changes_requested` until the user accepts the visible result.

- Visual matrix: the eight route/theme/fullscreen/S16 tests passed in one run; the twenty-locale deep matrix passed separately in 4.0 minutes under one worker. Total evidence: **9/9 visual tests** green across the two invocations.
