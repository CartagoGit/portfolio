---
id: f00001
title: "Portfolio experience completion and Pages publication"
kind: feat
status: ready
type: proposal
track: portfolio-product
date: 2026-11-22
shipped-in:
  - "f29e917"
  - "691bd52"
  - "de01752"
  - "0383333"
---

# f00001 — Portfolio experience completion and Pages publication

## goal

Complete the public portfolio as one coherent, responsive product portfolio: polish the home monitor and interactive globe, finish every route with useful evidence and interactions, keep EN/ES/FR/DE parity, and ship a gated GitHub Actions pipeline from preparation and tests through build and deployment to the CartagoGit Pages repository.

## why

The portfolio now has a strong visual foundation, but several product-level gaps remain: chart controls are incomplete, the monitor uses inconsistent context states, the globe needs a richer texture catalogue and unambiguous stacking, project evidence is stale, and several routes still look like disconnected demos rather than a deliberate portfolio. The site is itself evidence of frontend quality, so visual discontinuities, mobile overflow, untranslated controls or an unreliable deployment pipeline directly undermine the product being presented.

This proposal turns the requested polish into a dependency-ordered program with observable gates instead of accumulating independent cosmetic patches.

## design

- Preserve the standalone Angular + SSR + signals architecture.
- Use the existing token/theme system and shared shell primitives; do not hardcode route-specific palettes.
- Keep the monitor as one state machine: section choice changes the selector, while the active preview/dashboard remains stable unless the user explicitly changes the view.
- Use semantic destination metadata (`website`, `repository`, `documentation`, `package`, `release`, `profile`) rather than guessing URLs or icons in templates.
- Technology descriptions must explain what the technology is, the problem it solves and how it is used in the visible portfolio work; generic “part of the toolkit” copy is not acceptable.
- Keep globe texture changes GPU-local and lazy, but visual truth outranks asset-count convenience: Earth uses a real cloud map; solar bodies use real/publicly sourced colour maps; sports balls use clean canonical textures; exoplanets without direct imagery use a clearly labelled, attributed artist impression rather than a misleading procedural planet. Every visible map must be recognisably what its label says and retain useful detail at the displayed size.
- Expand the globe as a reusable texture product, not only a planet viewer: include several real high-resolution Earth variants, a distinct joke/brand collection (Cartago logo, Cartago banner, owned portrait imagery and other clearly playful wraps), and visual/source labels for real data, original art, brand content or artist impressions. When a body has important geometry outside the sphere—especially Saturn’s rings—it must be rendered as a coherent ringed object rather than a texture-only circle.
- Treat contact delivery as an integration boundary: use a configured static-safe endpoint; when unconfigured, expose a truthful fallback rather than simulating success.
- Prefer data-driven cards and examples. Project ordering, stack evidence, route animations and preview destinations remain centralized in domain data.
- Keep each language in an owned, lintable structure instead of embedding foreign-language programs inside TypeScript: WebGL shaders live under a dedicated rendering/shaders module, non-TypeScript resources are imported through a typed boundary, reusable calculations/state stay outside the component, and no generated or copied implementation is added when a shared abstraction already owns the behaviour. New source formats must participate in the same validation/build graph and fail visibly on syntax or integration errors.
- Treat readability as product functionality: secondary and compact UI may be quiet, but never smaller than a comfortably readable size; informative text must reflow, wrap, scroll, or use an accessible tooltip instead of disappearing behind `text-overflow: ellipsis`. Ellipsis is allowed only for non-essential repeated labels where the complete value is available on focus/hover and in the accessible name.
- Publish through four independent CI stages: `preparation` → `tests` → `build` → `deploy`.
- A separate low-priority follow-up (`f00002`) owns global locale expansion only after this product/deployment programme is complete.

## non-goals

- Publishing private/client code, employer screenshots, confidential workflows or proprietary business rules.
- Replacing Angular, rewriting the shell architecture, or introducing a UI framework.
- Making external GitHub/npm/Docker traffic a runtime dependency of the rendered portfolio.
- Claiming email delivery without an operator-configured endpoint and verified receipt.
- Migrating the domain from CartagoGit Pages to another host in this proposal.
- Expanding every historical repository: the public work page will curate current, meaningful evidence.

## slices

- global_gate: lint + typecheck + all tests + production/SSR build + responsive browser audit

### S1 — Monitor state, globe catalogue and chart controls
- **Status**: done
- **Files**: `angular.json`, `src/domain/types.ts`, `src/core/rendering/earth-globe-renderer.ts`, `src/core/rendering/shaders/earth-globe.frag.glsl`, `src/core/rendering/shaders/earth-globe.vert.glsl`, `src/core/rendering/shaders/index.ts`, `src/core/rendering/shaders/raw-assets.d.ts`, `src/pages/home/earth-globe/earth-globe.component.ts`, `src/pages/home/earth-globe/earth-globe.component.html`, `src/pages/home/earth-globe/earth-globe.component.scss`, `src/pages/home/hero-monitor/hero-monitor.component.ts`, `src/pages/home/hero-monitor/hero-monitor.component.html`, `src/pages/home/hero-monitor/hero-monitor.component.scss`, `src/pages/home/hero-monitor/_monitor-accessibility-final.scss`, `public/images/earth-clouds-4k.webp`, `public/images/globe/basketball-canonical-4k.webp`, `public/images/globe/beach-ball-canonical-4k.webp`, `public/images/globe/cartago-banner-4k.webp`, `public/images/globe/cartago-mark-4k.webp`, `public/images/globe/cartago-portrait-4k.webp`, `public/images/globe/disco-canonical-4k.webp`, `public/images/globe/earth-night-4k.webp`, `public/images/globe/golf-canonical-4k.webp`, `public/images/globe/jupiter-4k.webp`, `public/images/globe/kepler-186f-artist-4k.webp`, `public/images/globe/mars-4k.webp`, `public/images/globe/mercury-4k.webp`, `public/images/globe/moon-4k.webp`, `public/images/globe/neptune-2k.webp`, `public/images/globe/pluto-4k.webp`, `public/images/globe/proxima-b-artist-4k.webp`, `public/images/globe/saturn-4k.webp`, `public/images/globe/soccer-canonical-4k.webp`, `public/images/globe/sun-4k.webp`, `public/images/globe/tennis-canonical-4k.webp`, `public/images/globe/trappist-1e-artist-4k.webp`, `public/images/globe/uranus-2k.webp`, `public/images/globe/venus-4k.webp`, `public/images/ATTRIBUTION.md`, `public/icons/projects/keyer.svg`, `public/icons/projects/print-cv.svg`, `public/icons/projects/steam-keys.svg`
- **Gate**: lint + typecheck + focused unit tests + desktop/mobile Playwright measurements
- **Acceptance**: switching Projects/Technologies preserves the active preview; the toggle has an icon; chart controls fill two complete rows with distinct chart icons; the destination aside never overflows; project logos are normalized as flat marks (no doubled border/plate, no icon-on-icon effect); the globe z-index always beats the inactive monitor; the monitor has no active hover affordance while globe content is frontal; the close action says “Close sphere”; all eight solar planets plus Sun/Moon/Pluto, representative exoplanets, sports/random spheres and a joke/brand collection are selectable; Earth exposes multiple real high-resolution variants; brand wraps use 4K equirectangular assets and owned imagery; Saturn visibly includes correctly oriented rings; every texture is a real/attributed visual, owned brand wrap or a clearly labelled artist impression, never an unexplained synthetic look; GLSL is owned under a typed rendering/shaders boundary and compiles during the browser validation gate instead of living as an unchecked string in TypeScript; sphere, controls and backdrop enter/exit as one coordinated transition without a discrete jump or elements escaping above the backdrop; all monitor controls, descriptions and destination text remain readable without zoom at 1366×768 and 390×844, and overflow uses wrapping or controlled scrolling instead of ellipsis for informative content.
- review-state: done
- review-implementer: microsoft-mai-code-2
- review-reviewer: cartago-independent-s1-reviewer-20261123
- review-log: approved by cartago-independent-s1-reviewer-20261123 — verified at f29e917, validate exit 0 and tests 38/38 claimed, no recorded run cited — Independent review approved: 14 desktop chart controls, stable previews, 27 texture presets, real/licensed 4K maps and attribution, Saturn rings, brand/portrait wraps, labelled exoplanet art, external typed GLSL, coordinated overlay, 1366x768 and 390x844 readability/no ellipsis/controlled overflow, zero usable horizontal overflow, strict lint/typecheck, 21 test files/38 tests and production+SSR build.

### S2 — Project and technology destination data
- **Status**: done
- **Files**: `src/domain/monitor-destinations.ts`, `src/domain/data.ts`, `src/domain/monitor-destinations.spec.ts`, `src/pages/home/hero-monitor/hero-monitor.component.ts`, `src/pages/home/hero-monitor/hero-monitor.component.spec.ts`
- **Gate**: destination validation tests + link-shape audit
- **Acceptance**: every highlighted technology has official website/docs/package/repository links where they exist; projects expose repository/site/package/docs/release links verified from public metadata; each technology has specific explanatory copy describing its purpose and relevance, alphabetically ordered; projects use curated importance order; every URL is HTTPS; no guessed route is rendered.
- review-state: done
- review-implementer: microsoft-mai-code-2
- review-reviewer: cartago-independent-s2-reviewer-20261123
- review-log: approved by cartago-independent-s2-reviewer-20261123 — verified at 691bd52, validate exit 0 and tests 42/42 claimed, no recorded run cited — Independent S2 review approved. Verified curated order on public links and hero panels, 41 alphabetically sorted specific technology definitions, domain-backed technology previews, 164 unique HTTPS destinations with anti-bot exceptions only, explicit removal of the DelendAI 404 site and Tanit non-release, HTTPS/duplicate/no-invented-route tests, strict typecheck/lint, 21 test files/42 tests, and production+SSR build.

### S3 — Shell, header, footer and back-to-top
- **Status**: done
- **Files**: `src/shared/ui/header/header.component.ts`, `src/shared/ui/header/header.component.html`, `src/shared/ui/header/header.component.scss`, `src/shared/ui/header/header.component.spec.ts`, `src/shared/ui/footer/footer.component.ts`, `src/shared/ui/footer/footer.component.html`, `src/shared/ui/footer/footer.component.scss`, `src/shared/ui/footer/footer.component.spec.ts`, `src/app/page.html`, `src/app/page.ts`, `src/core/platform/shell.facade.ts`, `src/core/platform/routing.ts`
- **Gate**: shell tests + desktop/mobile Playwright navigation audit
- **Acceptance**: the theme button is stable-width (`Themes` + selected colour dot), selected theme is marked in the menu, footer links are opaque and never expose route content during transitions, back-to-top only scrolls and never changes locale/configuration, route shell remains stable during View Transitions.
- review-state: done
- review-implementer: microsoft-mai-code-2
- review-reviewer: cartago-independent-s3-reviewer-20261123
- review-log: approved by cartago-independent-s3-reviewer-20261123 — verified at de01752, validate exit 0 and tests 43/43 claimed, no recorded run cited — Independent S3 review approved. Theme button is 108px at desktop/mobile, localized Themes label plus active color dot, with one selected menu row. Footer is opaque in all states. Back-to-top is a semantic button wired to reduced-motion-aware scroll only; URL, locale and theme remain unchanged. The route-stage owns main-content across every route and header/footer geometry is unchanged through View Transitions. Strict lint/typecheck, 21 files/43 tests and production+SSR build pass.

### S4 — Command palette interaction and motion
- **Status**: done
- **Files**: `src/shared/ui/command-palette/command-palette.component.ts`, `src/shared/ui/command-palette/command-palette.component.html`, `src/shared/ui/command-palette/command-palette.component.scss`, `src/shared/ui/command-palette/command-palette.component.spec.ts`, `src/pages/lab/lab.page.html`, `src/pages/lab/lab.page.scss`
- **Gate**: component tests + keyboard Playwright audit
- **Acceptance**: no macOS-only visual metaphors are required for commands; command meaning is clear and localized; open/close uses reversible enter/exit animation, focus is trapped/restored, Escape and backdrop close work, reduced-motion is respected.
- review-state: done
- review-implementer: microsoft-mai-code-2
- review-reviewer: cartago-independent-s4-reviewer-20261123
- review-log: approved by cartago-independent-s4-reviewer-20261123 — verified at 0383333, validate exit 0 and tests 47/47 claimed, no recorded run cited — Independent S4 review approved. Always-mounted palette uses reversible motion, inert/ARIA state, body scroll lock, focus entry/trap/restore, Escape/backdrop close, localized search, semantic RouterLinks and platform-neutral Enter hints; reduced motion is 0.01ms. Lab trigger has no macOS metaphor. Desktop/mobile browser audits passed, as did strict lint/typecheck, 21 files/47 tests and production+SSR build.

### S5 — Work page evidence and card system
- **Status**: pending
- **Files**: `src/pages/work/work.page.ts`, `src/pages/work/work.page.html`, `src/pages/work/work.page.scss`, `src/pages/work/_work-card-system.scss`, `src/pages/work/work.page.spec.ts`
- **Gate**: work page unit tests + lint/typecheck + desktop/mobile visual audit
- **Acceptance**: project order reflects public-profile importance/status; every card has a real logo, stack, status, repository and applicable site/docs/package/release destinations; cards share one interaction and motion system; colours derive from active theme plus project accent without breaking contrast.

### S6 — Approach page visual system and content
- **Status**: pending
- **Files**: `src/pages/approach/**`
- **Gate**: approach page unit tests + responsive Playwright audit
- **Acceptance**: capability panels never visually jump or clip across selection; every capability has a coherent icon/example/proof; text is concise, relevant and attractive; transitions, focus and theme changes preserve layout and contrast.

### S7 — Knowledge page examples and related projects
- **Status**: pending
- **Files**: `src/pages/knowledge/**`
- **Gate**: knowledge tests + link validation + responsive audit
- **Acceptance**: every knowledge area has a related icon, short practical example and verified links to relevant public projects; cards share dimensions and state treatment and remain readable at 390px.

### S8 — Docker page product catalogue
- **Status**: pending
- **Files**: `src/pages/docker/**`
- **Gate**: Docker page tests + external destination validation + responsive audit
- **Acceptance**: the page explains the public Docker toolchain, exposes each important image with use case and command, links to Docker Hub and source, and adapts all cards/terminal examples to the active theme.

### S9 — Demos catalogue and mini-games
- **Status**: pending
- **Files**: `src/pages/demos/**`
- **Gate**: demo/game unit tests + keyboard/touch Playwright audit
- **Acceptance**: interactive examples appear in tabs before project links; every external project gets its correct logo; memory text is never reversed; additional compact games/examples exist; all games support keyboard/touch, reduced motion and reset; controls and state transitions are visible and consistent.

### S10 — Contact copy, portrait and delivery
- **Status**: pending
- **Files**: `src/pages/contact/**`, `src/app/app.config.ts`, `docs/contact-delivery.md`
- **Gate**: contact tests + typecheck + endpoint contract test + mobile audit
- **Acceptance**: portrait treatment is deliberate rather than a plain square; copy is concise and specific; submission sends via a configured static-safe endpoint, validates email/message, reports honest success/error, has a fallback that never claims a message was sent, and exposes no secret in the browser bundle.

### S11 — Lab examples, playgrounds and graph exploration
- **Status**: pending
- **Files**: `src/pages/lab/**`
- **Gate**: lab tests + interaction/performance audit
- **Acceptance**: the lab contains multiple useful frontend examples (motion, drag/drop, data visualisation, state, accessibility, forms, concurrency), multiple playgrounds rather than one linear exercise, substantially more chart options than three, useful job-relevant explanations, and responsive controls with visible focus/reduced-motion support.

### S12 — Route transitions, responsive system and shared motion tokens
- **Status**: pending
- **Files**: `src/app/page.scss`, `src/styles.scss`, `src/styles/motion/**`, `src/styles/keyframes/**`, `src/styles/tokens/**`
- **Gate**: lint/typecheck + 1366x768 and 390x844 Playwright audits on every route
- **Acceptance**: route/tab transitions are intentional and coherent, no page has horizontal overflow or clipped interactive content, scrollbars follow theme tokens, reduced-motion disables non-essential motion, shared effects use existing tokens rather than per-route ad hoc colours/durations, and the minimum visual size, contrast and overflow strategy for labels, navigation, cards and supporting copy are validated on desktop/mobile without relying on ellipsis to hide information.

### S13 — Full i18n parity and accessible copy
- **Status**: pending
- **Files**: `src/lang/**`, `src/app/app.routes.server.ts`, `src/server.ts`
- **Gate**: i18n parity tests + typecheck + prerender EN/ES/FR/DE
- **Acceptance**: EN/ES/FR/DE render the correct locale from the URL even with another saved preference, all visible/ARIA labels are localized, server headers/prerender agree with route locale, and no untranslated English functional labels appear in non-English routes.

### S14 — Regression, accessibility and responsive tests
- **Status**: pending
- **Files**: `tools/**`, `plugins/portfolio-content/**`, `e2e/**`
- **Gate**: all tests + browser smoke suite
- **Acceptance**: regression coverage includes monitor state persistence, globe stacking/return, texture catalogue, destination metadata, footer opacity/back-to-top locale, project ordering, theme adaptation, command-palette focus, all route tabs and mobile overflow. Browser checks produce named failure evidence rather than screenshots alone.

### S15 — CI/CD: preparation, tests, build, deploy
- **Status**: pending
- **Files**: `.github/workflows/**`, `README.md`, `docs/deployment.md`, `angular.json`, `package.json`
- **Gate**: workflow syntax validation + local reproduction of all jobs
- **Acceptance**: jobs run in order `preparation` → `tests` → `build` → `deploy`; preparation validates lockfile/config/assets, tests run lint/typecheck/unit/browser checks, build emits production SSR/browser artifacts, deploy publishes the browser artifact to `CartagoGit/CartagoGit.github.io` on the intended branch, required token/secret is documented and missing credentials fail with an actionable message; no deploy occurs after a failed gate.

## dependency graph

- S2 feeds S1, S5, S7, S8 and S9.
- S1 establishes monitor interactions before route-wide transition testing.
- S5–S10 can proceed independently after S2 data is stable.
- S3 and S4 establish shell interactions before S12 global motion/overflow validation.
- S13 consumes all new UI keys after route work lands.
- S14 validates all slices and must be green before S15 deployment.
- S15 is the final gate of this product programme; publication is blocked until every earlier acceptance gate passes.
- `f00002` depends on a completed/published `f00001` and is intentionally the final language-expansion programme.

## acceptance

- All requested monitor behaviours are correct: stable preview across section switching, iconized toggle, two chart rows, readable destination links, richer globe presets, visible close action, truthful lower monitor stacking and no active-hover residue.
- Technology previews provide a real definition and practical use statement per technology, not generic filler text.
- The globe offers real-cloud Earth, several additional real Earth variants, Sun/Moon and all planets (including Pluto), exoplanet artist impressions labelled as such, real/canonical sports-ball patterns, and a branded/joke/portrait collection; Saturn renders real rings, preset origin is explicit, assets are high-resolution/lazy-loaded, orientation survives texture changes, and no preset causes layout shift.
- Work, Approach, Knowledge, Docker, Demos, Lab and Contact are complete, responsive, theme-correct and coherent as one product.
- Public profile evidence is current enough to support the curated order and copy; every destination is verified or intentionally omitted with a truthful reason.
- Footer, back-to-top, locale, command palette and route/tab transitions work without visual jumps or input regressions.
- Contact delivery has a documented, tested integration boundary and never falsely reports success.
- EN/ES/FR/DE remain type-complete and SSR-prerendered; visible and ARIA text is readable at the supported viewport sizes, and informative content is never silently truncated.
- Lint, typecheck, all unit/integration tests, browser audits, production build and SSR build pass.
- GitHub Actions executes `preparation → tests → build → deploy` and deploys only after every prior stage succeeds.
- Locale expansion is deferred to `f00002`; `f00001` finishes product work and deployment first.
