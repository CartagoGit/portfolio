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

The accepted proposal history and automated evidence did not fully satisfy the human acceptance bar: several globe presets and object renders are not recognisable enough, monitor controls lack purposeful motion and leave awkward empty space, basic demos do not demonstrate senior 2D/3D interaction, icons are inconsistent across contexts, and device-specific input behaviour is not explicit. The portfolio must sell the quality of the engineering through the experience itself.

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
  - "Sports patterns wrap without seams or impossible panel distortion; logo/banner assets remain readable."
  - "Saturn includes coherent rings, correct relative scale and shared orientation/rotation."
  - "Procedural or artist-impression presets are labelled honestly and never masquerade as observed imagery."
  - "Context loss, restoration, destroy and repeated entry remain leak-free."

### S3 — Refine monitor hierarchy, controls and interaction choreography
- **Status**: pending
- **Files**: `src/pages/home/hero-monitor/hero-monitor.component.ts`, `src/pages/home/hero-monitor/hero-monitor.component.html`, `src/pages/home/hero-monitor/hero-monitor.component.scss`, `src/pages/home/hero-monitor/earth-globe-controls.component.ts`, `src/pages/home/hero-monitor/earth-globe-controls.component.html`, `src/pages/home/hero-monitor/earth-globe-controls.component.scss`, `src/pages/home/hero-monitor/hero-monitor-motion.helper.ts`, `src/pages/home/hero-monitor/hero-monitor-motion.spec.ts`
- **Gate**: e2e
- acceptance:
  - "The monitor header uses all available space intentionally; no accidental empty banner column remains."
  - "Section, chart, category, texture and close controls share a cohesive control contract and visible states."
  - "Every control has purposeful hover, focus, press, selection and transition behaviour with reduced-motion parity."
  - "Opening, changing and closing the globe preserves layout and orientation without jumps."
  - "Desktop pointer affordances degrade into explicit touch controls instead of becoming dead interactions."

### S4 — Build a premium interactive showcase above the basic demos
- **Status**: pending
- **Files**: `src/pages/demos/demos.page.ts`, `src/pages/demos/demos.page.html`, `src/pages/demos/demos.page.scss`, `src/pages/demos/demos.page.spec.ts`, `src/pages/demos/showcase/**`, `src/lang/types.interface.ts`, `src/lang/en.content.ts`, `src/lang/es.content.ts`, `src/lang/fr.content.ts`, `src/lang/de.content.ts`
- **Gate**: e2e
- acceptance:
  - "A premium showcase tab system appears above the existing compact demo/game layer."
  - "At least three visually substantial interactive showcases ship, including a 3D depth scene, a 2D generative/data scene and a polished simulation/game."
  - "Each showcase explains the engineering problem, supports reset and keyboard/touch input, and adapts when hover-only behaviour is unavailable."
  - "The existing simple demos remain available as a lower-complexity exploration layer."
  - "All visible and ARIA copy stays in EN/ES/FR/DE parity."

### S5 — Create one canonical icon and visual-identity system
- **Status**: pending
- **Files**: `src/shared/ui/icons/**`, `src/domain/visual-icons.constant.ts`, `src/pages/work/work-visuals.constant.ts`, `src/pages/work/work-project-visual.component.ts`, `src/pages/work/work-project-visual.component.scss`, `src/pages/docker/docker.page.html`, `src/pages/docker/docker.page.scss`, `src/shared/ui/footer/footer.component.html`, `src/pages/demos/demo-visuals.constant.ts`
- **Gate**: type
- acceptance:
  - "Docker, GitHub, project and game identities resolve through one canonical registry rather than ad hoc icon variants."
  - "The same project/platform uses the same mark, colour, stroke and accessible label everywhere."
  - "No icon is duplicated, mirrored incorrectly or detached from its destination context."
  - "Missing registry entries fail tests instead of silently rendering fallback glyphs."

### S6 — Adapt interactions explicitly for laptop, tablet and smartphone
- **Status**: pending
- **Files**: `src/core/platform/device-capabilities.helper.ts`, `src/core/platform/device-capabilities.spec.ts`, `src/styles/motion/_device-interaction.scss`, `src/app/page.ts`, `src/app/page.html`, `src/app/page.scss`, `e2e/device-matrix.spec.ts`
- **Gate**: e2e
- acceptance:
  - "Pointer, hover, coarse-touch and viewport class contracts are testable and deterministic."
  - "Desktop/laptop keeps precision affordances; tablet and smartphone replace them with direct manipulation and larger targets."
  - "Unusable hover, tilt, drag or 3D interactions have functional alternatives rather than merely hidden controls."
  - "Named tests cover representative laptop, tablet portrait and 390px smartphone states without overflow or inaccessible actions."

### S7 — Extend intentional motion across every portfolio page
- **Status**: pending
- **Files**: `src/styles/motion/**`, `src/pages/work/work.page.scss`, `src/pages/approach/approach.page.scss`, `src/pages/knowledge/knowledge.page.scss`, `src/pages/lab/lab.page.scss`, `src/pages/contact/contact.page.scss`
- **Gate**: e2e
- acceptance:
  - "Every page uses a coherent enter, reveal, hover, focus and state-transition vocabulary without visual noise."
  - "Repeated motion consumes shared tokens and primitives; page SCSS does not duplicate last-wins effects."
  - "Project-specific visual signatures are preserved while neighbouring pages gain equally polished interaction."
  - "Reduced-motion produces complete, readable final states with no broken choreography."
  - "Tablet and mobile motion remain performant and do not block scrolling or input."

### S8 — Enrich profile evidence and keep tools in clean ownership folders
- **Status**: pending
- **Files**: `src/domain/data.constant.ts`, `docs/profile-evidence.md`, `tools/scripts/**`, `tools/checks/**`, `docs/architecture-s17.md`
- **Gate**: type
- acceptance:
  - "Public GitHub and LinkedIn evidence is represented accurately, concisely and with explicit source dates."
  - "Project ordering, achievements and links use verifiable public metadata without inventing private detail."
  - "Automation is organised into scripts and checks by role instead of accumulating unrelated files at tools root."
  - "Repeated data and helpers have one owner with direct tests and no conflicting copies."

## acceptance

- Every globe preset, monitor state, icon and route is captured at desktop, laptop, tablet and smartphone viewports.
- The audit names failures with preset, route, theme, viewport and device class instead of relying on screenshots alone.
- No visual state is accepted merely because unit tests or build pass.
- Documented baselines distinguish real imagery, owned art and procedural/artist-impression visuals.
- Each planet, sports ball, brand wrap and exoplanet is immediately recognisable at its displayed size.
- Sports patterns wrap without seams or impossible panel distortion; logo/banner assets remain readable.
- Saturn includes coherent rings, correct relative scale and shared orientation/rotation.
- Procedural or artist-impression presets are labelled honestly and never masquerade as observed imagery.
- Context loss, restoration, destroy and repeated entry remain leak-free.
- The monitor header uses all available space intentionally; no accidental empty banner column remains.
- Section, chart, category, texture and close controls share a cohesive control contract and visible states.
- Every control has purposeful hover, focus, press, selection and transition behaviour with reduced-motion parity.
- Opening, changing and closing the globe preserves layout and orientation without jumps.
- Desktop pointer affordances degrade into explicit touch controls instead of becoming dead interactions.
- A premium showcase tab system appears above the existing compact demo/game layer.
- At least three visually substantial interactive showcases ship, including a 3D depth scene, a 2D generative/data scene and a polished simulation/game.
- Each showcase explains the engineering problem, supports reset and keyboard/touch input, and adapts when hover-only behaviour is unavailable.
- The existing simple demos remain available as a lower-complexity exploration layer.
- All visible and ARIA copy stays in EN/ES/FR/DE parity.
- Docker, GitHub, project and game identities resolve through one canonical registry rather than ad hoc icon variants.
- The same project/platform uses the same mark, colour, stroke and accessible label everywhere.
- No icon is duplicated, mirrored incorrectly or detached from its destination context.
- Missing registry entries fail tests instead of silently rendering fallback glyphs.
- Pointer, hover, coarse-touch and viewport class contracts are testable and deterministic.
- Desktop/laptop keeps precision affordances; tablet and smartphone replace them with direct manipulation and larger targets.
- Unusable hover, tilt, drag or 3D interactions have functional alternatives rather than merely hidden controls.
- Named tests cover representative laptop, tablet portrait and 390px smartphone states without overflow or inaccessible actions.
- Every page uses a coherent enter, reveal, hover, focus and state-transition vocabulary without visual noise.
- Repeated motion consumes shared tokens and primitives; page SCSS does not duplicate last-wins effects.
- Project-specific visual signatures are preserved while neighbouring pages gain equally polished interaction.
- Reduced-motion produces complete, readable final states with no broken choreography.
- Tablet and mobile motion remain performant and do not block scrolling or input.
- Public GitHub and LinkedIn evidence is represented accurately, concisely and with explicit source dates.
- Project ordering, achievements and links use verifiable public metadata without inventing private detail.
- Automation is organised into scripts and checks by role instead of accumulating unrelated files at tools root.
- Repeated data and helpers have one owner with direct tests and no conflicting copies.
