# Portfolio visual truth

## Authoritative acceptance method

Visual acceptance is never inferred from a build, unit test or screenshot alone. The executable source of truth is `e2e/visual-truth.spec.ts`; `bun tools/scripts/visual-audit.script.ts` reruns that matrix with named captures in `.cache/visual-audit` and writes `manifest.json`.

The capture and failure key always contains the relevant combination of route, viewport, locale, theme, device class, preset and state.

| Dimension | Contract |
|---|---|
| Routes | home, Work, Lab, Approach, Knowledge, Docker, Demos, Contact |
| Viewports | desktop `1440×900`, laptop `1024×768`, tablet portrait `768×1024`, tablet landscape `1024×600`, smartphone `390×844`, small/coarse `320×568` |
| Themes | dark, light, midnight, ocean, forest, sunset, solar, mono |
| Locales | all 20 canonical locales, including Arabic directionality and CJK fallbacks |
| Globe | all 30 named presets, including origin classification and reset to Earth |
| Interaction | pointer, keyboard, native coarse-touch taps, reduced motion, normal/fullscreen, hover/focus/pressed/selected/loading/success/error/reset |
| Render truth | raster, owned art and procedural/artist-impression assets are identified separately |

## Captured evidence

The audit captures:

- every route in every viewport;
- every globe preset in every viewport;
- the globe and controls in every theme;
- the four priority routes in every locale;
- the 320 px coarse-touch game path and explicit fullscreen owners.

A capture count different from the manifest count fails the audit. Missing images, unresolved content keys, horizontal overflow, zero-area canvases, wrong preset state and inaccessible exit paths also fail with the same named label.

## Human inspection is still required

For each new visual or asset change, inspect the named captures for:

1. correct identity and recognisability at the displayed size;
2. legible text, labels, icons and destination details;
3. visible hover/focus/press/selection feedback;
4. purposeful state transitions and reduced-motion parity;
5. no overlap, clipped controls, accidental empty space or hardcoded permanent colours;
6. truthful geometry, projection, lighting and rotation for every 3D figure;
7. native fullscreen containment and a visible exit without stretched axes or controls;
8. coherent mobile/tablet composition without depending on hover or trapping page scroll.

No build, unit count, screenshot or automation result closes these checks on its own. Human-visible acceptance must be recorded separately.

## Asset truth baseline

- Current raster globe display assets remain the local 4096×2048 set documented in `public/images/ATTRIBUTION.md`.
- Uranus and Neptune are display upscales from licensed 2K sources, not new observed maps.
- Exoplanets are artist impressions, never observations.
- Rugby, sports balls, Saturn and brand/portrait material currently share a shader/canvas boundary; f00004 S2 must replace generic spherical treatment where the visible geometry requires it.
- The 3D model, texture and render catalogue must record source URL, author, licence, local path, file size and use in the same attribution registry.
- DeathBlitz, Tetris, Snake and Minesweeper continue to use their canonical project marks through the tested visual registry.

## Open blockers owned outside S1

- Replace all remaining sphere-like specialty figures with truthful geometry or projection (S2).
- Add a real rendered 3D playable game (S4).
- Remove permanent-colour monitor/detail treatments and complete route-specific motion (S3/S7).
- Finish native copy and RTL/copy parity across all twenty locales (f00002).
- Record visible human acceptance only after the final captures and rendered product are reviewed.

## Visible findings — 2026-11-27

These findings are audit results, not accepted output:

| Capture | Device/theme | Finding | Owner |
|---|---|---|---|
| `preset-desktop-portrait.png` / `preset-small-touch-portrait.png` | desktop and 320 px | The portrait is mapped onto a sphere with an inverted, distorted crop; it does not read as a deliberate independent figure. | f00004 S2 |
| `preset-small-touch-bathymetry.png` and preset control set | 320 px | The sticky close button overlaps preset rows; the pointer route to “Batimetría” was intercepted in the named audit. | f00004 S3 |
| `route-small-touch-lab.png` | 320 × 568 | The hero title and explanatory copy collide, and the first evidence panel starts while the heading remains unreadable. | f00004 S6/S7 |
| `route-small-touch-demos.png` / `coarse-touch-320-demos-penalty.png` | 320 × 568 | The viewport remains usable by touch, but the premium/arcade hierarchy and real game identity need a stronger, complete 3D-led section. | f00004 S4 |
| light, solar and mono globe captures | all light themes | Background detail becomes very low-contrast under the scrim; controls remain token-driven, but the monitor copy still depends on fixed dark treatments. | f00004 S3 |
| all light-theme route captures | light/solar/mono | Hardcoded dark monitor and preview surfaces need a final per-component token audit rather than relying on the theme shell. | f00004 S3/S12 |

## Open blockers owned outside S1
