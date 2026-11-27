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
- **Status**: review
- **Files**: `docs/portfolio-visual-truth.md`, `e2e/visual-truth.spec.ts`, `tools/scripts/visual-audit.script.ts`
- **Gate**: e2e
- acceptance:
  - "Every globe preset, monitor state, icon and route is captured at desktop, laptop, tablet and smartphone viewports."
  - "The audit names failures with preset, route, theme, viewport and device class instead of relying on screenshots alone."
  - "No visual state is accepted merely because unit tests or build pass."
  - "Documented baselines distinguish real imagery, owned art and procedural/artist-impression visuals."
  - "The executable matrix covers six viewports (1440×900, 1024×768, 768×1024, 1024×600, 390×844 and 320×568 coarse touch), all eight themes and all 20 locales; named captures include all 34 globe presets and every route."
  - "Every interactive state is exercised with pointer, keyboard and native touch as applicable, including hover/focus/press, loading/error/success, reset, reduced motion and fullscreen exit."
- review-state: in_review
- review-implementer: microsoft-mai-code-2

### S2 — Make globe textures and 3D objects visually truthful
- **Status**: review
- **Files**: `src/domain/types.interface.ts`, `src/core/rendering/gltf-model.loader.ts`, `src/core/rendering/gltf-model.renderer.ts`, `src/core/rendering/gltf-model-renderer.spec.ts`, `src/core/rendering/earth-globe.renderer.ts`, `src/core/rendering/earth-globe-renderer.spec.ts`, `src/core/rendering/shaders/**`, `src/pages/home/earth-globe/**`, `src/pages/home/hero-monitor/earth-texture.catalog.ts`, `src/pages/home/hero-monitor/earth-texture-catalog.spec.ts`, `src/pages/home/hero-monitor/hero-monitor.component.html`, `src/pages/home/hero-monitor/hero-monitor.component.spec.ts`, `src/lang/types.interface.ts`, `src/lang/en.translation.ts`, `src/lang/es.translation.ts`, `src/lang/fr.translation.ts`, `src/lang/de.translation.ts`, `src/lang/secondary-locales.types.ts`, `src/lang/secondary-priority.overlays.ts`, `src/lang/secondary-locales/*.translation.ts`, `e2e/portfolio.spec.ts`, `e2e/visual-truth.spec.ts`, `tools/scripts/visual-audit.script.ts`, `tools/check-file-naming.script.ts`, `docs/portfolio-visual-truth.md`, `public/images/globe/**`, `public/images/ATTRIBUTION.md`
- **Gate**: e2e
- acceptance:
  - "Each planet, sports ball, brand wrap and exoplanet is immediately recognisable at its displayed size."
  - "Every photographic/raster globe map and texture is a documented 4K source (3840px minimum width); procedural/vector materials remain resolution-independent and are identified as such."
  - "Rugby uses a prolate/sport-specific model; football, basketball and tennis use recognisable panel/seam geometry with seamless wrapping rather than a generic noisy sphere."
  - "Pluto has its recognisable brighter region and asymmetrical silhouette treatment; Saturn rings are coherent, correctly scaled and rotate/share orientation with Saturn."
  - "Logo, banner and portrait presets consume the author's canonical portfolio artwork; the portrait fills and crops the figure correctly instead of appearing as an incidental decal."
  - "A separate random-figure section exposes non-spherical and specialty renderers with the corresponding texture, with honest artist-impression labels where observation data is unavailable."
  - "The figure catalogue consumes real CC0/non-restrictive 3D models, renders and PBR textures from downloaded sources, optimized locally and attributed with author, licence, source, bytes and use; it is not limited to shader variations of a sphere."
  - "At least one downloaded model is rendered as its own triangulated object with truthful lighting, bounds, camera fit and pointer/keyboard/touch orientation; a stylised fallback is distinct and labelled."
  - "The control copy and category labels never overlap at laptop, tablet or smartphone sizes."
  - "Closing a figure is labelled 'Cerrar figura'; dismissing the panel always resets the active preset and geometry to Earth while leaving rings and specialty state unmounted."
  - "Sports patterns wrap without seams or impossible panel distortion; logo/banner assets remain readable."
  - "Saturn includes coherent rings, correct relative scale and shared orientation/rotation."
  - "Procedural or artist-impression presets are labelled honestly and never masquerade as observed imagery."
  - "Context loss, restoration, destroy and repeated entry remain leak-free."
- review-state: in_review
- review-implementer: microsoft-mai-code-2

### S3 — Refine monitor hierarchy, controls and interaction choreography
- **Status**: pending
- **Files**: `src/pages/home/hero-monitor/hero-monitor.component.ts`, `src/pages/home/hero-monitor/hero-monitor.component.html`, `src/pages/home/hero-monitor/hero-monitor.component.scss`, `src/pages/home/hero-monitor/earth-globe-controls.component.ts`, `src/pages/home/hero-monitor/earth-globe-controls.component.html`, `src/pages/home/hero-monitor/earth-globe-controls.component.scss`, `src/pages/home/hero-monitor/hero-monitor-motion.helper.ts`, `src/pages/home/hero-monitor/hero-monitor-motion.spec.ts`, `src/pages/home/hero-monitor/_monitor-accessibility-final.scss`, `src/pages/home/hero-monitor/hero-monitor-motion.spec.ts`, `src/pages/home/hero-monitor/_monitor-accessibility-final.scss`, `src/pages/home/hero-monitor/_home-refinement.scss`, `src/pages/home/hero-monitor/_console-header-final.scss`, `src/pages/home/hero-monitor/_monitor-laptop-final.scss`, `e2e/visual-truth.spec.ts`, `tools/scripts/visual-audit.script.ts`
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
  - "A distinct seventh arcade game is a real rendered 3D experience: imported or original 3D geometry, camera/projection, 3D collision or targeting, score/lives/result, restart, fullscreen and keyboard/touch controls; CSS perspective alone does not qualify."
  - "Every mini-game supports a clear start/restart loop, score and/or lives, tabs, keyboard controls where useful, direct touch controls and a visual result state that invites another round."
  - "Premium showcases and games expose fullscreen/normal-size controls without blocking vertical page scrolling outside the active fullscreen experience."
  - "Project-like game cards use animated backgrounds with the same quality bar as Work while preserving a distinct game identity."
  - "All visible and ARIA copy stays in EN/ES/FR/DE parity; missing copy fails parity checks."
  - "All visible and ARIA game/showcase copy owns native strings or reviewed locale overlays for all 20 shipped locales; RTL and CJK layout receive explicit visual coverage rather than translation fallbacks."

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
  - "Named tests also cover tablet landscape and 320px coarse touch; button geometry, control overlap, touch hit targets and vertical page scroll are observed in both normal and fullscreen states."
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

## human review — 2026-11-25 blocker follow-up

The earlier implementation improved test volume and structure, but human review still rejects several surfaces because they look complete without behaving meaningfully. This follow-up is an explicit acceptance blocker:

- Fullscreen hides the shell header/footer and all unrelated route controls. Outside the active surface is inert and visually suppressed; only the active surface owns focus, pointer capture and scroll.
- “Fullscreen” and “reset” are icon-only controls using shared marks. Reset sits beside fullscreen. A route or card collection must never become fullscreen merely because it contains one interactive child.
- A fullscreen canvas preserves native aspect ratio and one uniform scale. Monitor uses a fixed logical canvas; showcases/games/Lab use contain frames. No axis, font, icon or child control may stretch independently.
- The command palette stops being a Lab command and becomes a global search entry in the header next to locale/theme. Search covers routes, projects, technologies, demos, Docker images and experiments, with links/actions and localized snippets.
- Approach is a showcase of process, not a demo: no fullscreen controls. Tabs, cards, icons and selected panels must each have distinct, useful animation; icon geometry and alignment must be visually correct in every state.
- Work, Demos, package/code cards and project-related badges share the same canonical identity registry and animated-card vocabulary, including the real Tetris mark and project-specific motions.
- Docker status badges are one legible component with distinct Docker-native hover motion per image; animation must explain state and identity rather than decorate text.
- Lab experiments must be useful and manipulable, not static illustrations. Every displayed control exposes meaningful state, resets and a result. Empty/simple demos are replaced with purposeful interactions.
- Demos has functional premium showcases and a genuine arcade section with varied games, scores/lives, tabs and working inputs. No showcase or game ships as animation-only.
- Monitor previews explain every technology/project substantively, expose complete destinations in a scroll-safe rail and use the active theme. Labels never fall below the visible information; generic “badge at top right” styling is forbidden.
- Globe objects are not texture names around one sphere. Rugby, balls, planets, Saturn, brand marks and portrait have explicit geometry/projection/lighting/input contracts; the visible object returns to Earth after close while preserving the last figure during exit motion.

## additional slices

### S9 — Shell-independent fullscreen, global search and interaction isolation
- **Status**: pending
- **Files**: `src/shared/ui/fullscreen/**`, `src/shared/ui/header/**`, `src/shared/ui/command-palette/**`, `src/core/platform/shell.facade.ts`, `src/app/page.html`, `src/styles.scss`, `e2e/fullscreen-isolation.spec.ts`
- **Gate**: e2e
- acceptance:
  - "Header/footer disappear and page-level controls become inert while fullscreen is active."
  - "Only the selected surface owns focus, pointer/touch capture and vertical scroll; Escape and an icon-only exit remain always reachable."
  - "Global search lives beside locale selection, searches every route/project/technology/demo/Docker/Lab item and supports keyboard navigation, touch and localized empty states."
  - "Lab no longer owns a command-palette trigger."
  - "Fullscreen and reset use one icon vocabulary and reset never appears as a text-heavy primary button."

### S10 — Premium route motion, canonical cards and truthful interactions
- **Status**: pending
- **Files**: `src/pages/approach/**`, `src/pages/work/**`, `src/pages/docker/**`, `src/pages/demos/**`, `src/pages/lab/**`, `src/domain/demo-visuals.constant.ts`, `src/styles/motion/**`
- **Gate**: e2e
- acceptance:
  - "Approach has no fullscreen control; tab hover, selected transition, panel background and icon use six distinct purposeful systems."
  - "Work experiment cards, Demos external cards and package/directory cards share the same animated evidence component while preserving destination-specific identity."
  - "Every premium showcase and Lab control changes meaningful state through pointer, keyboard and touch."
  - "Demos includes a second tabbed arcade layer with distinct mini-games, score/lives/result states and complete reset/start loops."
  - "Docker status badges are legible in every theme and each image has a distinct Docker-specific hover signature."

### S11 — Monitor evidence and globe geometry truth
- **Status**: pending
- **Files**: `src/pages/home/hero-monitor/**`, `src/pages/home/earth-globe/**`, `src/core/rendering/**`, `src/domain/data.constant.ts`, `src/lang/**`, `public/images/globe/**`
- **Gate**: e2e
- acceptance:
  - "Every monitor technology and project owns localized multi-paragraph explanatory content, not one generic sentence; the destination rail exposes all rows through controlled scroll."
  - "The status/badge UI follows the same spacing, typography and theme contract as surrounding monitor content."
  - "Rugby rotates on its own prolate orientation; all sports/brand/portrait/figure objects have truthful geometry or projection and are draggable in three axes."
  - "Closing keeps the selected figure throughout exit motion, then resets the parked renderer to Earth before the next opening."
  - "Raster sources meet documented resolution/origin claims and branded artwork is recognisable at displayed size."

### S12 — Audit and failure-proof visual acceptance
- **Status**: pending
- **Files**: `e2e/visual-truth.spec.ts`, `e2e/search.spec.ts`, `e2e/fullscreen-isolation.spec.ts`, `docs/portfolio-visual-truth.md`, `docs/architecture-s17.md`
- **Gate**: e2e
- acceptance:
  - "The matrix proves header/footer hidden, unrelated elements inert, focus exit visible and zero deformation for every fullscreen owner."
  - "Named browser evidence checks every Demos/Lab control, search results, locale rows, Approach transitions and Docker hovers."
  - "A green build alone never closes visual slices; named route/theme/device outcomes remain required."
  - "Final acceptance records all 20 locales, all eight themes, six viewports, all 34 figure presets, the new 3D game and every route-specific animation; only i00002 S2 deployment remains open afterwards."

## exhaustive human brief — 2026-11-27 expansion

- Review every section step by step; every card/control owns hover, focus, press, selected, loading and result motion where those states exist.
- No permanent accent or dark/light surface is acceptable when it contradicts the active theme; every remaining literal colour must be intentional technical imagery, not generic component paint.
- The portfolio must show original engineering range through useful sections, downloads/assets, rendered figures and games—not repeated decorative motion.
- A 3D game and downloaded model/texture/render assets must be lightweight, lazy-loaded, attributed and verified across desktop, laptop, tablet landscape/portrait and smartphone.
- Proposal closure must leave only deployment jobs/workflow work in `i00002 S2`; product, visual, asset, locale and interaction blockers must be done or intentionally retired by an explicit replacement proposal.
