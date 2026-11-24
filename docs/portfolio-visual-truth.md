# Portfolio visual truth

## Acceptance method

Visual acceptance is never inferred from a build. The named Playwright matrix in `e2e/visual-truth.spec.ts` covers:

- desktop: `1440×900`
- laptop: `1024×768`
- tablet portrait: `768×1024`
- smartphone/coarse layout: `390×844`
- routes: home, Work, Lab, Approach, Knowledge, Docker, Demos, Contact
- themes: light, dark, solar, mono
- all twenty canonical locale routes, including Arabic RTL
- every interactive fullscreen owner: monitor, showcase, mini-game arcade and Lab gallery

Failures are reported as `viewport/route`, `theme/globe`, `locale` or `interactive owner`, not as an undifferentiated screenshot delta.

## Current measured evidence — 2026-11-24

- Typecheck: passed (`src`, specs and E2E).
- Strict lint: passed with zero warnings.
- Unit/integration: 54 files / 141 tests passed.
- Browser regression: 7/7 passed.
- Production/SSR build: passed; 160 static routes prerendered.
- 390px Spanish route matrix: zero horizontal overflow.
- Arabic at 390px: `lang="ar"`, `dir="rtl"`, zero horizontal overflow.
- Six showcase tabs, eight mini-games, fourteen labelled chart controls and six globe categories mount without overlap.
- Globe reset and close always return to Earth; Saturn rings share the WebGL quaternion path.

## Assets and identities

- All globe raster files consumed by the renderer use 4096×2048 local display textures.
- Uranus and Neptune are explicitly documented as local 4K display upscales from their licensed 2K sources.
- Rugby uses the prolate shader shape; Pluto uses silhouette/region treatment; sports balls use canonical seam geometry; portrait/banner/logo use front-projected canonical artwork.
- `DeathBlitz`, `Tetris`, `Snake` and `Minesweeper` use favicons published by their corresponding live project deployments and are owned by `demoVisual`.
- The same `demoVisual` registry feeds Work and Demos.
- Product assets are grouped under `brand/`, `games/`, `globe/` and `profile/`; attribution remains in `public/images/ATTRIBUTION.md`.

## Honest boundaries

- Exoplanets are labelled artist impressions, not observations.
- Uranus/Neptune 4K files are upsampled display copies, not newly observed source maps.
- English remains the glossary fallback for technical/long-form copy in newly added locales; primary shell, route, CTA and contact copy is native for all twenty locales.
- No visual slice is considered human-approved solely by this document. Browser evidence must still be reviewed on the rendered product after each intentional visual change.
