# S14 regression and responsive evidence

Date: 2026-11-27

S14 is backed by named assertions rather than screenshot-only evidence. The full Playwright matrix ran with two workers and finished with **28/28 tests passing** in 5.9 minutes.

## Named product coverage

| Evidence | Requirement covered |
|---|---|
| `S14-01` | Monitor preview and section state remain stable; destinations are present, HTTPS and readable. |
| `S14-02` | Globe stacking, catalogue, active theme tokens, close/return and 30 presets remain stable. |
| `S14-03` | Work preserves project order, project identity, six distinct visual modes and iconized chips. |
| `S14-04` | Route scroll, footer surfaces, back-to-top, locale and URL preserve state. |
| `S14-05` | Command palette traps focus, supports navigation and restores focus to its trigger. |
| `S14-06` | Approach and Demos tab systems are keyboard usable; mobile route overflow remains controlled. |
| `S14-07` | Contact remains viewport-sized with truthful delivery and layered portrait evidence. |
| `A11Y-01` | Route navigation restores focus to truthful content. |
| `A11Y-02` | All eight routes stay contained and accessible-named at 390 × 844. |
| `SEC-01` / `SEC-02` | External links are safe; contact failure never claims success and exposes the mail fallback. |
| `MOTION-01` | Reduced motion disables the evidence-card orbit. |
| `WEBGL-01` | Repeated route entry owns one canvas and leaves no stale globe node. |
| `visual truth: desktop/laptop/tablet/smartphone` | Every route is checked at 1440, 1024, 768 and 390 pixel widths for assets, i18n keys and overflow. |
| `visual truth: all themes` | Light, dark, solar and mono keep monitor/globe controls inside the active token system. |
| `visual truth: fullscreen exit path` | Monitor, Showcase, compact games and Lab retain explicit fullscreen exit paths and aspect ratios. |
| `visual truth: twenty locales` | Priority routes stay contained in all 20 deep locales at 390 pixels. |

## Product interaction matrix

The same run also covered:

- six real arcade games, including score/state and 44 px mobile controls;
- eight compact laboratory games and six Showcase scenes;
- Lab fullscreen evidence panels without host-ratio changes;
- keyboard, pointer and touch input paths.

## Non-browser gates

The current integrated evidence is:

- app suite: **379/379 tests** across 66 files;
- portfolio-content plugin: **51/51 tests** across 15 files;
- production build: **160 static routes prerendered**;
- bundle budget: **29 JS chunks**, initial ≤ 360000 bytes, product lazy ≤ 260000 bytes and the shared 20-locale corpus ≤ 760000 bytes;
- strict lint/typecheck and MCP host activation: passing.

S16 remains the separate human visual/product gate. S14 proves regression coverage and named failure evidence; it does not replace visible approval of the S16 visual corrections.
