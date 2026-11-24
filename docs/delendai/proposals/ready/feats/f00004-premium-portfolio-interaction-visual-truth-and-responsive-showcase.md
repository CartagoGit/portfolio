---
id: f00004
title: "Premium portfolio interaction, visual truth and responsive showcase"
kind: feat
status: ready
type: proposal
track: portfolio-experience
date: 2026-11-23
---

# f00004 — Premium portfolio interaction, visual truth and responsive showcase

## goal

Turn the portfolio into a consistently premium, truthful and fully interactive product across desktop, tablet and smartphone without losing the current visual foundation.

## why

The accepted proposal history and automated evidence did not fully satisfy the human acceptance bar: several globe presets and object renders are not recognisable enough, monitor controls lack purposeful motion and leave awkward empty space, basic demos do not demonstrate senior 2D/3D interaction, icons are inconsistent across contexts, and device-specific input behaviour is not explicit. The latest human review adds concrete product failures: the home value proposition is too broad, monitor labels and detail badges expose fallback keys, chart controls do not work consistently, custom figures ignore the correct geometry or artwork, the premium demos cannot all be manipulated, and interactive surfaces can trap page scrolling on touch devices. The portfolio must sell the quality of the engineering through the experience itself.

## product brief — 2026-11 human review

- The home introduction must be concise and commercially clear: examples are the proof of the work, and the portfolio itself is the primary evidence. Avoid a generic technology résumé at the expense of that message.
- The dashboard must feel intentionally composed: the banner fills the available header height; the right-side actions consume the newly available width except for the four compact platform links; labels and icons remain legible at their final fitted size.
- Every monitor chart and effect control must be functional, theme-coloured, border-light and animated between states. Preview details must show translated copy—not content-key fallbacks—and must live in the upper part of a scrollable information region.
- Globe and figure rendering must be visually truthful. Personal logo/banner/portrait artwork, rugby and sports geometry, Pluto's silhouette, Saturn's rings and shared orientation are not optional details. Closing the figure always restores Earth, never the previous preset.
- Demos must include six genuinely interactive premium showcases plus a distinct six-game arcade. Pointer, keyboard and touch users must be able to manipulate, reset and understand each experience.
- DeathBlitz, Tetris, Snake and Minesweeper identities must come from their real project/repository artwork. The same canonical mark must be reused everywhere those projects appear.
- Approach, Knowledge, Lab and Docker must not copy one animation wholesale: each route needs a distinct, useful motion signature. Knowledge and Docker also need project-specific identity details.
- Contact delivery must use the concise “Enviar” action with a message icon, and the recipient must be a maintainable internal configuration rather than embedded markup.
- Public assets, tools and render/catalogue files need explicit owners and predictable folders. Interactive work must never make mobile/tablet scrolling dependent on first completing an interaction.
- Every route, theme, hover state and interactive panel must retain a visual and functional contract at desktop, laptop, tablet and small touchscreen widths. Fullscreen and normal-size controls are mandatory for every interactive panel on every input class.

## non-goals

- Replacing Angular, SSR, the current design system or the existing route structure.
- Introducing a heavy UI or 3D framework when native CSS, Canvas, SVG or the existing WebGL boundary is sufficient.
- Publishing private employer/client information or claiming unverifiable LinkedIn details.
- Owning GitHub Pages deployment, which belongs to i00002.
- Completing global locale expansion, which remains owned by f00002.

## slices

- global_gate: e2e

### S1 — Establish human and automated visual truth audit
- **Status**: pending
- **Files**: `docs/portfolio-visual-truth.md`, `e2e/visual-truth.spec.ts`, `tools/scripts/visual-audit.script.ts`
- **Gate**: e2e
- acceptance:
  - "Every globe preset, monitor state, icon and route is captured at desktop, laptop, tablet and smartphone viewports."
  - "The audit names failures with preset, route, theme, viewport and device class instead of relying on screenshots alone."
  - "No visual state is accepted merely because unit tests or build pass."
  - "Documented baselines distinguish real imagery, owned art and procedural/artist-impression visuals."

### S2 — Make globe textures and 3D objects visually truthful
- **Status**: pending
- **Files**: `src/core/rendering/earth-globe.renderer.ts`, `src/core/rendering/earth-globe.renderer.spec.ts`, `src/core/rendering/shaders/earth-globe.frag.glsl`, `src/pages/home/earth-globe/earth-globe.component.ts`, `src/pages/home/earth-globe/earth-globe.component.html`, `src/pages/home/earth-globe/earth-globe.component.scss`, `public/images/globe/**`, `public/images/ATTRIBUTION.md`
- **Gate**: e2e
- acceptance:
  - "Each planet, sports ball, brand wrap and exoplanet is immediately recognisable at its displayed size."
  - "Every photographic/raster globe map and texture is a documented 4K source (3840px minimum width); procedural/vector materials remain resolution-independent and are identified as such."
  - "Rugby uses a prolate/sport-specific model; football, basketball and tennis use recognisable panel/seam geometry with seamless wrapping rather than a generic noisy sphere."
  - "Pluto has its recognisable brighter region and asymmetrical silhouette treatment; Saturn rings are coherent, correctly scaled and rotate/share orientation with Saturn."
  - "Logo, banner and portrait presets consume the author's canonical portfolio artwork; the portrait fills and crops the figure correctly instead of appearing as an incidental decal."
  - "A separate random-figure section exposes non-spherical and specialty renderers with the corresponding texture, with honest artist-impression labels where observation data is unavailable."
  - "The control copy and category labels never overlap at laptop, tablet or smartphone sizes."
  - "Closing a figure is labelled 'Cerrar figura'; dismissing the panel always resets the active preset and geometry to Earth while leaving rings and specialty state unmounted."
  - "Sports patterns wrap without seams or impossible panel distortion; logo/banner assets remain readable."
  - "Saturn includes coherent rings, correct relative scale and shared orientation/rotation."
  - "Procedural or artist-impression presets are labelled honestly and never masquerade as observed imagery."
  - "Context loss, restoration, destroy and repeated entry remain leak-free."

### S3 — Refine monitor hierarchy, controls and interaction choreography
- **Status**: pending
- **Files**: `src/pages/home/hero-monitor/hero-monitor.component.ts`, `src/pages/home/hero-monitor/hero-monitor.component.html`, `src/pages/home/hero-monitor/hero-monitor.component.scss`, `src/pages/home/hero-monitor/earth-globe-controls.component.ts`, `src/pages/home/hero-monitor/earth-globe-controls.component.html`, `src/pages/home/hero-monitor/earth-globe-controls.component.scss`, `src/pages/home/hero-monitor/hero-monitor-motion.helper.ts`, `src/pages/home/hero-monitor/hero-monitor-motion.spec.ts`
- **Gate**: e2e
- acceptance:
  - "The home introduction uses concise commercial copy centred on 'show me examples' as proof, with the portfolio positioned as evidence rather than a generic slogan."
  - "The monitor header banner occupies the full intended header height; right-side actions expand into the reclaimed space while LinkedIn, GitHub, Docker Hub and npm remain compact."
  - "The section controls include explicit labels and fit-for-space icons for Gráficas, Tecnologías and Proyectos; typography and icon sizes are tuned for desktop, laptop, tablet and smartphone."
  - "Chart controls use theme-derived fills/accents without a generic hard outline; every chart and effect responds consistently and has an animated transition between every source and destination state."
  - "The monitor header uses all available space intentionally; no accidental empty banner column remains."
  - "Technology/project preview content starts at the top of the detail area, offers materially useful descriptive copy and scrolls internally when it exceeds the panel height."
  - "Visible preview text never exposes content keys or unresolved fallback tokens; platform badges use the same visual contract as the surrounding panel."
  - "Section, chart, category, texture and close controls share a cohesive control contract and visible states."
  - "Every control has purposeful hover, focus, press, selection and transition behaviour with reduced-motion parity."
  - "Opening, changing and closing the globe preserves layout and orientation without jumps."
  - "Desktop pointer affordances degrade into explicit touch controls instead of becoming dead interactions."

### S4 — Build premium interactive showcases and a purposeful mini-game arcade
- **Status**: pending
- **Files**: `src/pages/demos/demos.page.ts`, `src/pages/demos/demos.page.html`, `src/pages/demos/demos.page.scss`, `src/pages/demos/demos.page.spec.ts`, `src/pages/demos/showcase/**`, `src/pages/demos/games/**`, `src/lang/types.interface.ts`, `src/lang/en.content.ts`, `src/lang/es.content.ts`, `src/lang/fr.content.ts`, `src/lang/de.content.ts`
- **Gate**: e2e
- acceptance:
  - "A premium showcase tab system appears above the compact demo and game layers."
  - "Six visually substantial showcases ship; depth 3D is drag/touch manipulable, data flow can be rerouted/paused, live signal can be tuned, and three additional interactions explore related engineering ideas."
  - "The showcase layer includes a compact explanation of the engineering problem, reset, keyboard/touch alternatives and an animated transition between tabs."
  - "A separate arcade section ships six varied mini-games using the portfolio's product visual language and project-real identities."
  - "Every mini-game supports a clear start/restart loop, score and/or lives, tabs, keyboard controls where useful, direct touch controls and a visual result state that invites another round."
  - "Premium showcases and games expose fullscreen/normal-size controls without blocking vertical page scrolling outside the active fullscreen experience."
  - "Project-like game cards use animated backgrounds with the same quality bar as Work while preserving a distinct game identity."
  - "All visible and ARIA copy stays in EN/ES/FR/DE parity; missing copy fails parity checks."

### S5 — Create one canonical icon and visual-identity system
- **Status**: pending
- **Files**: `src/shared/ui/icons/**`, `src/domain/visual-icons.constant.ts`, `src/pages/work/work-visuals.constant.ts`, `src/pages/work/work-project-visual.component.ts`, `src/pages/work/work-project-visual.component.scss`, `src/pages/docker/docker.page.html`, `src/pages/docker/docker.page.scss`, `src/shared/ui/footer/footer.component.html`, `src/pages/demos/demo-visuals.constant.ts`, `public/images/projects/**`, `public/images/ATTRIBUTION.md`
- **Gate**: type
- acceptance:
  - "Docker, GitHub, platform, project and game identities resolve through one canonical registry rather than ad hoc icon variants."
  - "DeathBlitz, Tetris, Snake and Minesweeper use artwork taken from the corresponding canonical repository/project identity, with source attribution and repository links, not generic glyph substitutes."
  - "The same project/platform uses the same mark, colour, stroke and accessible label everywhere."
  - "No icon is duplicated, mirrored incorrectly or detached from its destination context."
  - "Missing registry entries fail tests instead of silently rendering fallback glyphs."

### S6 — Adapt every interaction for desktop, laptop, tablet and touchscreen
- **Status**: pending
- **Files**: `src/core/platform/device-capabilities.helper.ts`, `src/core/platform/device-capabilities.spec.ts`, `src/styles/motion/_device-interaction.scss`, `src/shared/ui/fullscreen/**`, `src/app/page.ts`, `src/app/page.html`, `src/app/page.scss`, `e2e/device-matrix.spec.ts`
- **Gate**: e2e
- acceptance:
  - "Pointer, hover, coarse-touch and viewport class contracts are testable and deterministic."
  - "Desktop/laptop keeps precision affordances; tablet and smartphone replace them with direct manipulation and larger targets."
  - "Unusable hover, tilt, drag or 3D interactions have functional alternatives rather than merely hidden controls."
  - "Every interactive panel, showcase, game and dashboard monitor has an explicit fullscreen button and a normal-size/exit button in all device modes."
  - "Fullscreen owns gesture capture only while active; normal mode never traps vertical touch scrolling, and a persistent exit path remains keyboard-, pointer- and touch-accessible."
  - "Named tests cover laptop, tablet portrait, 390px smartphone and a very-small/coarse-touch state without horizontal overflow or inaccessible actions."
  - "All themes are exercised with the same controls and no contrast/legibility regressions."

### S7 — Extend intentional, route-specific motion across every portfolio page
- **Status**: pending
- **Files**: `src/styles/motion/**`, `src/pages/work/work.page.scss`, `src/pages/approach/approach.page.scss`, `src/pages/knowledge/knowledge.page.scss`, `src/pages/lab/lab.page.scss`, `src/pages/docker/docker.page.scss`, `src/pages/contact/contact.page.scss`
- **Gate**: e2e
- acceptance:
  - "Every page uses a coherent enter, reveal, hover, focus and state-transition vocabulary without visual noise."
  - "Approach gives each item a distinct useful motion signature inspired by project-card quality, not one duplicated effect."
  - "Knowledge badges carry the corresponding canonical project icon beneath/within each technology grouping."
  - "Docker's maintained/updated badges are legible and theme-consistent; each badge gets a distinct Docker-specific hover response."
  - "Lab contains substantially more varied, dynamic and attractive experiments, not additional styling of one repeated playground."
  - "Repeated motion consumes shared tokens and primitives; page SCSS does not duplicate last-wins effects."
  - "Project-specific visual signatures are preserved while neighbouring pages gain equally polished interaction."
  - "Reduced-motion produces complete, readable final states with no broken choreography."
  - "Tablet and mobile motion remain performant and do not block scrolling or input."

### S8 — Complete evidence, delivery, asset and tooling ownership
- **Status**: pending
- **Files**: `src/domain/data.constant.ts`, `src/pages/contact/**`, `src/core/services/contact-delivery.service.ts`, `src/lang/**`, `public/**`, `docs/profile-evidence.md`, `tools/scripts/**`, `tools/checks/**`, `docs/architecture-s17.md`, `README.md`
- **Gate**: type
- acceptance:
  - "Public GitHub and LinkedIn evidence is represented accurately, concisely and with explicit source dates."
  - "Project ordering, achievements and links use verifiable public metadata without inventing private detail."
  - "The contact action reads simply 'Enviar' (or the locale equivalent) with a message icon in front, and the delivery target is an internal configurable environment/constant rather than view markup."
  - "Contact delivery uses the owner's verified public contact address by default, with a documented single configuration point for future changes and no secret committed to the repository."
  - "Public assets are reorganised into owned, predictable folders for profile, projects, games, globe, icons and attribution; references go through tested registries or stable paths."
  - "Automation is organised into scripts and checks by role instead of accumulating unrelated files at tools root."
  - "Repeated data and helpers have one owner with direct tests and no conflicting copies."

## acceptance

- Every globe preset, monitor state, icon and route is captured at desktop, laptop, tablet and smartphone viewports.
- The audit names failures with preset, route, theme, viewport and device class instead of relying on screenshots alone.
- No visual state is accepted merely because unit tests or build pass.
- Documented baselines distinguish real imagery, owned art and procedural/artist-impression visuals.
- Each planet, sports ball, brand wrap and exoplanet is immediately recognisable at its displayed size.
- Every photographic/raster globe map and texture is a documented 4K source (3840px minimum width); procedural/vector materials remain resolution-independent and are identified as such.
- Rugby uses a prolate/sport-specific model; football, basketball and tennis use recognisable panel/seam geometry with seamless wrapping rather than a generic noisy sphere.
- Pluto has its recognisable brighter region and asymmetrical silhouette treatment; Saturn rings are coherent, correctly scaled and rotate/share orientation with Saturn.
- Logo, banner and portrait presets consume the author's canonical portfolio artwork; the portrait fills and crops the figure correctly instead of appearing as an incidental decal.
- A separate random-figure section exposes non-spherical and specialty renderers with the corresponding texture, with honest artist-impression labels where observation data is unavailable.
- The control copy and category labels never overlap at laptop, tablet or smartphone sizes.
- Closing a figure is labelled 'Cerrar figura'; dismissing the panel always resets the active preset and geometry to Earth while leaving rings and specialty state unmounted.
- Sports patterns wrap without seams or impossible panel distortion; logo/banner assets remain readable.
- Saturn includes coherent rings, correct relative scale and shared orientation/rotation.
- Procedural or artist-impression presets are labelled honestly and never masquerade as observed imagery.
- Context loss, restoration, destroy and repeated entry remain leak-free.
- The home introduction uses concise commercial copy centred on 'show me examples' as proof, with the portfolio positioned as evidence rather than a generic slogan.
- The monitor header banner occupies the full intended header height; right-side actions expand into the reclaimed space while LinkedIn, GitHub, Docker Hub and npm remain compact.
- The section controls include explicit labels and fit-for-space icons for Gráficas, Tecnologías and Proyectos; typography and icon sizes are tuned for desktop, laptop, tablet and smartphone.
- Chart controls use theme-derived fills/accents without a generic hard outline; every chart and effect responds consistently and has an animated transition between every source and destination state.
- The monitor header uses all available space intentionally; no accidental empty banner column remains.
- Technology/project preview content starts at the top of the detail area, offers materially useful descriptive copy and scrolls internally when it exceeds the panel height.
- Visible preview text never exposes content keys or unresolved fallback tokens; platform badges use the same visual contract as the surrounding panel.
- Section, chart, category, texture and close controls share a cohesive control contract and visible states.
- Every control has purposeful hover, focus, press, selection and transition behaviour with reduced-motion parity.
- Opening, changing and closing the globe preserves layout and orientation without jumps.
- Desktop pointer affordances degrade into explicit touch controls instead of becoming dead interactions.
- A premium showcase tab system appears above the compact demo and game layers.
- Six visually substantial showcases ship; depth 3D is drag/touch manipulable, data flow can be rerouted/paused, live signal can be tuned, and three additional interactions explore related engineering ideas.
- The showcase layer includes a compact explanation of the engineering problem, reset, keyboard/touch alternatives and an animated transition between tabs.
- A separate arcade section ships six varied mini-games using the portfolio's product visual language and project-real identities.
- Every mini-game supports a clear start/restart loop, score and/or lives, tabs, keyboard controls where useful, direct touch controls and a visual result state that invites another round.
- Premium showcases and games expose fullscreen/normal-size controls without blocking vertical page scrolling outside the active fullscreen experience.
- Project-like game cards use animated backgrounds with the same quality bar as Work while preserving a distinct game identity.
- All visible and ARIA copy stays in EN/ES/FR/DE parity; missing copy fails parity checks.
- Docker, GitHub, platform, project and game identities resolve through one canonical registry rather than ad hoc icon variants.
- DeathBlitz, Tetris, Snake and Minesweeper use artwork taken from the corresponding canonical repository/project identity, with source attribution and repository links, not generic glyph substitutes.
- The same project/platform uses the same mark, colour, stroke and accessible label everywhere.
- No icon is duplicated, mirrored incorrectly or detached from its destination context.
- Missing registry entries fail tests instead of silently rendering fallback glyphs.
- Pointer, hover, coarse-touch and viewport class contracts are testable and deterministic.
- Desktop/laptop keeps precision affordances; tablet and smartphone replace them with direct manipulation and larger targets.
- Unusable hover, tilt, drag or 3D interactions have functional alternatives rather than merely hidden controls.
- Every interactive panel, showcase, game and dashboard monitor has an explicit fullscreen button and a normal-size/exit button in all device modes.
- Fullscreen owns gesture capture only while active; normal mode never traps vertical touch scrolling, and a persistent exit path remains keyboard-, pointer- and touch-accessible.
- Named tests cover laptop, tablet portrait, 390px smartphone and a very-small/coarse-touch state without horizontal overflow or inaccessible actions.
- All themes are exercised with the same controls and no contrast/legibility regressions.
- Every page uses a coherent enter, reveal, hover, focus and state-transition vocabulary without visual noise.
- Approach gives each item a distinct useful motion signature inspired by project-card quality, not one duplicated effect.
- Knowledge badges carry the corresponding canonical project icon beneath/within each technology grouping.
- Docker's maintained/updated badges are legible and theme-consistent; each badge gets a distinct Docker-specific hover response.
- Lab contains substantially more varied, dynamic and attractive experiments, not additional styling of one repeated playground.
- Repeated motion consumes shared tokens and primitives; page SCSS does not duplicate last-wins effects.
- Project-specific visual signatures are preserved while neighbouring pages gain equally polished interaction.
- Reduced-motion produces complete, readable final states with no broken choreography.
- Tablet and mobile motion remain performant and do not block scrolling or input.
- Public GitHub and LinkedIn evidence is represented accurately, concisely and with explicit source dates.
- Project ordering, achievements and links use verifiable public metadata without inventing private detail.
- The contact action reads simply 'Enviar' (or the locale equivalent) with a message icon in front, and the delivery target is an internal configurable environment/constant rather than view markup.
- Contact delivery uses the owner's verified public contact address by default, with a documented single configuration point for future changes and no secret committed to the repository.
- Public assets are reorganised into owned, predictable folders for profile, projects, games, globe, icons and attribution; references go through tested registries or stable paths.
- Automation is organised into scripts and checks by role instead of accumulating unrelated files at tools root.
- Repeated data and helpers have one owner with direct tests and no conflicting copies.
- The commercial home copy, monitor labels/details, all globe figures, six premium showcases, six arcade games and route-specific motion satisfy the 2026-11 human review at all target device classes.
- Public assets and tools have documented, tested ownership; contact recipient configuration has one internal source of truth.
- Public/product work remains independent from i00002 publication and makes no unrequested changes to DelendAI or CI infrastructure.
