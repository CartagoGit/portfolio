# S16 visual truth audit

Validated against the current `develop` source on 2026-11-23 with the Angular dev server and production build/SSR output.

## Named viewport matrix

| Route | Theme | Viewport | Horizontal overflow | Informative minimum | Icon/text collisions | Broken images | Footer chrome |
|---|---|---:|---:|---:|---:|---:|---|
| Home | light | 1366×768 | 0 px | 12 px | 0 | 0 | transparent, border 0, shadow none |
| Work | light | 1366×768 | 0 px | 12 px | 0 | 0 | transparent, border 0, shadow none |
| Home | light | 768×1024 | 0 px | 12 px | 0 | 0 | transparent, border 0, shadow none |
| Work | light | 768×1024 | 0 px | 12 px | 0 | 0 | transparent, border 0, shadow none |
| Home | light | 390×844 | 0 px | 12 px | 0 | 0 | transparent, border 0, shadow none |
| Work | light | 390×844 | 0 px | 12 px | 0 | 0 | transparent, border 0, shadow none |
| Home | dark | 1366×768 | 0 px | 12 px | 0 | 0 | transparent, border 0, shadow none |
| Work | dark | 1366×768 | 0 px | 12 px | 0 | 0 | transparent, border 0, shadow none |
| Home | dark | 768×1024 | 0 px | 12 px | 0 | 0 | transparent, border 0, shadow none |
| Work | dark | 768×1024 | 0 px | 12 px | 0 | 0 | transparent, border 0, shadow none |
| Home | dark | 390×844 | 0 px | 12 px | 0 | 0 | transparent, border 0, shadow none |
| Work | dark | 390×844 | 0 px | 12 px | 0 | 0 | transparent, border 0, shadow none |

`aria-hidden` decorative project art is excluded from the readable-text minimum. Decorative `GET /capabilities` lettering is intentionally smaller and exposes no content to assistive technology.

## Monitor and globe

- At 1366×768 the frontal monitor measures 802×501 px at x=530/y=171 and ends 32 px above the fixed footer. The resting transform is `none`.
- Selector, chart controls and destination rail report zero icon/text intersection area.
- The monitor offers 14 chart variants in two rows and a controlled destination rail.
- Globe controls mount through `EarthGlobeControlsComponent`; desktop and mobile both report zero overflow for the control panel itself.
- At 390×844 the control panel is 240 px high, arranged as category rail, texture rail, origin, hint and full-width close action. Both rails scroll independently and do not overlap copy.
- All 30 presets load, retain the selected style and report WebGL error `0`; failed network requests: 0.
- Saturn renders the planet and rings inside the same shader/quaternion path. The CSS ring pseudo-elements are disabled.
- Every newly generated map is 4096×2048 and reproducible through `tools/generate-globe-assets.py`.

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
- `typecheck`: pass.
- strict lint: pass.
- unit/integration: 43 files / 98 tests pass.
- production + 32-route SSR prerender: pass.
