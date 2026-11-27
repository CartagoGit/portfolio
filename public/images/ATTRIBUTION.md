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

## Downloaded CC0 glTF objects

The interactive figure catalogue also contains these Poly Haven model packages. Only the raw glTF, binary and texture files below are redistributed. Promotional renders, clay previews and site example images are not copied into this project; portfolio screenshots and display renders are generated locally by the WebGL renderer.

| Asset | Creator(s) | Source | License | Local package | Delivered use |
|---|---|---|---|---|---|
| Gamepad | Josh Dean | https://polyhaven.com/a/gamepad | [CC0](https://polyhaven.com/license) | `globe/models/gamepad/` | Interactive 3D figure `model-gamepad`; locally camera-fitted, rotated and lit from the original triangulated mesh. |
| American Football | Riley Queen | https://polyhaven.com/a/american_football | [CC0](https://polyhaven.com/license) | `globe/models/american-football/` | Interactive 3D figure `model-football`; the photographed leather/PBR package is preserved. |
| Carved Wooden Elephant | Greg Zaal | https://polyhaven.com/a/carved_wooden_elephant | [CC0](https://polyhaven.com/license) | `globe/models/carved-elephant/` | Interactive 3D figure `model-elephant`; the sculpture remains a mesh, not a spherical texture. |
| Moon Rock 02 | Greg Zaal, Rico Cilliers and Jenelle van Heerden | https://polyhaven.com/a/moon_rock_02 | [CC0](https://polyhaven.com/license) | `globe/models/moon-rock/` | Interactive 3D figure `model-moon-rock`; the LOD0 rock mesh and its native diffuse, normal and ARM maps are preserved. |

### Local 3D file inventory

MD5 values identify the exact downloaded bytes currently distributed under `public/images/globe/models/`.

| File | Bytes | MD5 |
|---|---:|---|
| `american-football/american_football.bin` | 140,192 | `c7ddf25fe8b26f86b8cf239ec258416c` |
| `american-football/american_football_1k.gltf` | 2,816 | `891aa7cf6970c39e49857248fa4f58e5` |
| `american-football/textures/american_football_arm_1k.jpg` | 620,658 | `9ef5beb8d8832c97cf94507cdf167360` |
| `american-football/textures/american_football_diff_1k.jpg` | 642,831 | `b4346ba2f947cb089fc5fc715db1f969` |
| `american-football/textures/american_football_nor_gl_1k.jpg` | 1,263,758 | `fdeca2e1e2b19e817088f97f30dc2cd0` |
| `carved-elephant/carved_wooden_elephant.bin` | 69,760 | `5cd91fb8045cc4bbfa0248b8d2f96b5d` |
| `carved-elephant/carved_wooden_elephant_1k.gltf` | 2,791 | `7111471b835ce5ca81e7e54cfb4599d5` |
| `carved-elephant/textures/carved_wooden_elephant_diff_1k.jpg` | 578,022 | `40a5db4e497b0bd9df48800c5ff89376` |
| `carved-elephant/textures/carved_wooden_elephant_nor_gl_1k.jpg` | 564,625 | `5e512920c44490d06f5f0116b9dcaa6d` |
| `carved-elephant/textures/carved_wooden_elephant_rough_1k.jpg` | 648,726 | `711a67787c1e0a1bd6fde82ac8c71aa6` |
| `gamepad/gamepad.bin` | 256,796 | `06f345d9e959c3d265ff6f599b1640db` |
| `gamepad/gamepad_1k.gltf` | 2,728 | `86e6f546e948429591f8de7c3c9cc981` |
| `gamepad/textures/gamepad_arm_1k.jpg` | 510,273 | `67c3c5c000441d0d79a9e14df40d93a3` |
| `gamepad/textures/gamepad_diff_1k.jpg` | 309,469 | `481e2ef26e548cec00140a32dce30ddd` |
| `gamepad/textures/gamepad_nor_gl_1k.jpg` | 241,556 | `0ee54f5549614917728ed1293cc63f64` |
| `moon-rock/moon_rock_02.bin` | 78,928 | `42490de969f582a69518a40e17fe3f53` |
| `moon-rock/moon_rock_02_1k.gltf` | 2,782 | `2237fe252e6a0f4ae26617f749a5c7b6` |
| `moon-rock/textures/moon_rock_02_arm_1k.jpg` | 366,382 | `a99f416adc4a059b2db7c3aa72e8fe92` |
| `moon-rock/textures/moon_rock_02_diff_1k.jpg` | 394,361 | `48a8ec745b864870d38bd69bcf498b8f` |
| `moon-rock/textures/moon_rock_02_nor_gl_1k.jpg` | 675,121 | `3adf62ed6ca7cd2431f27649dbcb7ad6` |

The four packages total **7,372,575 bytes** before filesystem overhead. The 1K glTF packages are loaded only when their figure is selected; at most two decoded model packages are retained in the CPU cache. No image is upscaled and no Poly Haven render is substituted for the live WebGL scene.

## Rendering notes

- Terrain and infrared remain colour treatments of the real cloudless Earth map, preserving the geographic silhouette.
- Saturn's rings are original WebGL geometry rendered with the same quaternion as the sampled planet texture.
