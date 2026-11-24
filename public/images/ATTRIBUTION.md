# Image attribution

Assets are owned by domain under `brand/`, `games/`, `globe/` and `profile/`. UI marks remain under `public/icons/` and are never duplicated as raster artwork.

## Earth texture without prominent clouds

- `globe/earth-blue-marble-4k.webp` derives from **“Whole world - land and oceans.jpg”** (8192×4096).
- Creator/source: NASA Earth Observatory / NASA Goddard Space Flight Center; combined and scaled by Wikimedia Commons contributor Dbenbenn.
- Source: https://commons.wikimedia.org/wiki/File:Whole_world_-_land_and_oceans.jpg
- License: Public domain (NASA imagery).
- Local changes: resized to 4096×2048, converted to WebP and stripped of metadata while preserving the equirectangular projection.

## Earth texture with realistic clouds

- `globe/earth-clouds-4k.webp` derives from **“Land ocean ice cloud hires.jpg”** (8192×4096).
- Creator/source: NASA Blue Marble 2002, NASA Earth Observatory / NASA Goddard Space Flight Center.
- Source: https://commons.wikimedia.org/wiki/File:Land_ocean_ice_cloud_hires.jpg
- License: Public domain (NASA imagery).
- Local changes: resized to 4096×2048, converted to WebP and stripped of metadata while preserving the equirectangular projection.

## Earth night map and solar-system colour maps

- Files: `globe/earth-night-4k.webp`, `sun-4k.webp`, `moon-4k.webp`, `mercury-4k.webp`, `venus-4k.webp`, `mars-4k.webp`, `jupiter-4k.webp`, `saturn-4k.webp`, `uranus-4k.webp`, `neptune-4k.webp`.
- Creator/source: Solar System Scope texture pack, based on NASA elevation and spacecraft imagery.
- Source: https://www.solarsystemscope.com/textures/
- License: [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/).
- Local changes: resized/converted to WebP; the Uranus and Neptune display copies were upsampled locally from the licensed 2048px source so every interactive raster texture is 4096×2048. The existing equirectangular projection and colour relationship are retained.

## Pluto

- File: `globe/pluto-4k.webp`.
- Creator/source: NASA / Johns Hopkins University Applied Physics Laboratory / Southwest Research Institute, New Horizons global colour mosaic.
- Source: https://commons.wikimedia.org/wiki/File:Pluto_color_mapmosaic.jpg
- License: Public domain.
- Local changes: resized to 4096×2048, converted to WebP and stripped of metadata.

## Exoplanet artist impressions

- Files: `globe/kepler-186f-artist-4k.webp`, `proxima-b-artist-4k.webp`, `trappist-1e-artist-4k.webp`.
- Creator: original Cartago portfolio artwork, generated for this project.
- License: owned by the project author.
- These are explicitly labelled artist impressions. No direct observed surface map exists for these exoplanets, so they are not presented as scientific observations.

## Canonical sports and mirror-ball patterns

- Files: `globe/soccer-canonical-4k.webp`, `basketball-canonical-4k.webp`, `tennis-canonical-4k.webp`, `golf-canonical-4k.webp`, `beach-ball-canonical-4k.webp`, `disco-canonical-4k.webp`.
- Creator: original high-resolution pattern artwork for the Cartago portfolio.
- License: owned by the project author.
- The patterns are canonical visual interpretations, not photographs or third-party logos.

## Cartago brand and portrait

- Files: `brand/cartago-banner.png`, `brand/cartagonova-banner-monitor.webp`, `brand/cartagonova-banner-neon.png`, `profile/mario-cabrero-sf.png` and `icons/cartago.svg`.
- Creator/source: original Cartago project artwork and the portfolio owner's portrait source image.
- License: owned by the project author; third-party redistribution is not granted by this file.
- The globe renderer rasterises the canonical source into a front-projected sphere rather than using repeated texture sheets.

## Canonical game marks

- Files: `games/deathblitz.png`, `games/tetris.png`, `games/snake.png`, `games/minesweeper.png`.
- Sources: the favicons/icon assets published by the corresponding Cartago demos at `https://deathblitz.netlify.app/favicon.png`, `https://cartago-tetris.netlify.app/favicon.ico`, `https://cartago-snake.netlify.app/icon.png` and `https://cartago-minesweeper.netlify.app/icon.png`.
- Ownership: these marks represent the portfolio author's canonical game projects and are reused by the shared Demos/Work visual registry.

## Rendering notes

- Terrain and infrared remain colour treatments of the real cloudless Earth map, preserving the geographic silhouette.
- Saturn's rings are original WebGL geometry rendered with the same quaternion as the sampled planet texture.
