---
id: f00001
title: "Portfolio experience completion"
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
  - "51a18bd"
  - "00444f8"
  - "cdfa1f1"
  - "7ed8cab"
  - "30c26ec"
  - "6416483"
  - "201fcaa"
  - "620db3d"
  - "a35de8d"
---

# f00001 — Portfolio experience completion

## goal

Complete the public portfolio as one coherent, responsive product portfolio: polish the home monitor and interactive globe, finish every route with useful evidence and interactions, keep EN/ES/FR/DE parity, and establish the product-quality gates required before publication is owned by a separate infrastructure proposal.

## why

The portfolio now has a strong visual foundation, but several product-level gaps remain: chart controls are incomplete, the monitor uses inconsistent context states, the globe needs a richer texture catalogue and unambiguous stacking, project evidence is stale, and several routes still look like disconnected demos rather than a deliberate portfolio. The site is itself evidence of frontend quality, so visual discontinuities, mobile overflow, untranslated controls or unreliable interactions directly undermine the product being presented.

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
- A compile/test pass is not a visual pass. Every changed surface must be inspected in a real browser at 1366×768, a tablet viewport and 390×844 in at least two themes: logos/icons must match the destination, plates must not be doubled, text must not overlap icons or break awkwardly inside words, equal cards must remain equal-height, shell layers must remain opaque only where specified, and every animation must be checked at rest, hover, focus and reduced motion.
- Publication belongs to a separate infrastructure proposal and is not part of this product-quality scope.
- A separate low-priority follow-up (`f00002`) owns global locale expansion only after this product programme is complete.

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
- **Files**: `angular.json`, `src/domain/types.interface.ts`, `src/core/rendering/earth-globe.renderer.ts`, `src/core/rendering/shaders`, `src/pages/home/earth-globe`, `src/pages/home/hero-monitor`, `public/images/globe`, `public/images/brand`, `public/images/profile`, `public/images/ATTRIBUTION.md`, `public/icons/projects`
- **Gate**: lint + typecheck + focused unit tests + desktop/mobile Playwright measurements
- **Acceptance**: switching Projects/Technologies preserves the active preview; the toggle has an icon; chart controls fill two complete rows with distinct chart icons; the destination aside never overflows; project logos are normalized as flat marks (no doubled border/plate, no icon-on-icon effect); the globe z-index always beats the inactive monitor; the monitor has no active hover affordance while globe content is frontal; the close action says “Close sphere”; all eight solar planets plus Sun/Moon/Pluto, representative exoplanets, sports/random spheres and a joke/brand collection are selectable; Earth exposes multiple real high-resolution variants; brand wraps use 4K equirectangular assets and owned imagery; Saturn visibly includes correctly oriented rings; every texture is a real/attributed visual, owned brand wrap or a clearly labelled artist impression, never an unexplained synthetic look; GLSL is owned under a typed rendering/shaders boundary and compiles during the browser validation gate instead of living as an unchecked string in TypeScript; sphere, controls and backdrop enter/exit as one coordinated transition without a discrete jump or elements escaping above the backdrop; all monitor controls, descriptions and destination text remain readable without zoom at 1366×768 and 390×844, and overflow uses wrapping or controlled scrolling instead of ellipsis for informative content.
- **Visual correction requirement**: on wide screens the monitor/expanded console consumes available right-side space instead of forcing chart labels, icons and destination text into a tiny laptop; words never break inside ordinary labels to fit, icons never occupy text grid cells, and the destination list scrolls/reflows as a deliberate rail. Texture truth is mandatory: football/basketball/tennis/golf/rugby/volleyball patterns must wrap into canonical balls without seams cutting through panels, logo/banner spheres must remain undistorted/readable, Saturn’s rings keep their correct scale and rotate with the same quaternion/orientation as the planet, exoplanets use visibly plausible high-detail labelled artist impressions, and more Earth modes (day, night, clouds, terrain, bathymetry/topography, infrared/thermal) are available. A 1:1 visual sample audit is required for every preset at rest and after drag.
- review-state: done
- review-implementer: microsoft-mai-code-2
- review-reviewer: cartago-independent-s1-reviewer-20261123
- review-log: approved by cartago-independent-s1-reviewer-20261123 — verified at f29e917, validate exit 0 and tests 38/38 claimed, no recorded run cited — Independent review approved: 14 desktop chart controls, stable previews, 27 texture presets, real/licensed 4K maps and attribution, Saturn rings, brand/portrait wraps, labelled exoplanet art, external typed GLSL, coordinated overlay, 1366x768 and 390x844 readability/no ellipsis/controlled overflow, zero usable horizontal overflow, strict lint/typecheck, 21 test files/38 tests and production+SSR build.

### S2 — Project and technology destination data
- **Status**: done
- **Files**: `src/domain/monitor-destinations.helper.ts`, `src/domain/data.constant.ts`, `src/domain/monitor-destinations.spec.ts`, `src/pages/home/hero-monitor/hero-monitor.component.ts`, `src/pages/home/hero-monitor/hero-monitor.component.spec.ts`
- **Gate**: destination validation tests + link-shape audit
- **Acceptance**: every highlighted technology has official website/docs/package/repository links where they exist; projects expose repository/site/package/docs/release links verified from public metadata; each technology has specific explanatory copy describing its purpose and relevance, alphabetically ordered; projects use curated importance order; every URL is HTTPS; no guessed route is rendered.
- review-state: done
- review-implementer: microsoft-mai-code-2
- review-reviewer: cartago-independent-s2-reviewer-20261123
- review-log: approved by cartago-independent-s2-reviewer-20261123 — verified at 691bd52, validate exit 0 and tests 42/42 claimed, no recorded run cited — Independent S2 review approved. Verified curated order on public links and hero panels, 41 alphabetically sorted specific technology definitions, domain-backed technology previews, 164 unique HTTPS destinations with anti-bot exceptions only, explicit removal of the DelendAI 404 site and Tanit non-release, HTTPS/duplicate/no-invented-route tests, strict typecheck/lint, 21 test files/42 tests, and production+SSR build.

### S3 — Shell, header, footer and back-to-top
- **Status**: done
- **Files**: `src/shared/ui/header/header.component.ts`, `src/shared/ui/header/header.component.html`, `src/shared/ui/header/header.component.scss`, `src/shared/ui/header/header.component.spec.ts`, `src/shared/ui/footer/footer.component.ts`, `src/shared/ui/footer/footer.component.html`, `src/shared/ui/footer/footer.component.scss`, `src/shared/ui/footer/footer.component.spec.ts`, `src/app/page.html`, `src/app/page.component.ts`, `src/core/platform/shell.facade.ts`, `src/core/platform/routing.helper.ts`
- **Gate**: shell tests + desktop/mobile Playwright navigation audit
- **Acceptance**: the theme button is stable-width (`Themes` + selected colour dot), selected theme is marked in the menu, footer links/buttons are opaque and legible without showing route content, while the footer chrome itself stays transparent/secondary as intended; no footer-wide border or opaque slab is added to solve button contrast, back-to-top only scrolls and never changes locale/configuration, and the route shell remains stable during View Transitions.
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
- **Status**: done
- **Files**: `src/pages/work/work.page.ts`, `src/pages/work/work.page.html`, `src/pages/work/work.page.scss`, `src/pages/work/_work-card-system.scss`, `src/pages/work/work.page.spec.ts`
- **Gate**: work page unit tests + lint/typecheck + desktop/mobile visual audit
- **Acceptance**: project order reflects public-profile importance/status; every card has a real logo, stack, status, repository and applicable site/docs/package/release destinations; cards share one accessibility/responsive contract, but each curated project retains a distinct visual effect inspired by what it does; all technology chips include the corresponding icon, all project marks use the correct logo/asset, and the page expands beyond six headline projects with a verified catalogue of current meaningful work. The shared card system must never flatten the prior custom project visuals into generic rectangles; theme tokens preserve contrast while each effect remains recognisable.
- review-state: done
- review-implementer: microsoft-mai-code-2
- review-reviewer: cartago-independent-s5-reviewer-20261123
- review-log: approved by cartago-independent-s5-reviewer-20261123 — verified at 51a18bd, validate exit 0 and tests 47/47 claimed, no recorded run cited — Independent S5 review approved. Six S2-curated cards render in one shared system with real flat logos, status, stack and verified destinations; stale project collage removed. Accent colors derive from theme tokens/project color, focus/hover/reduced motion are shared, metadata is 12px, desktop/mobile layouts have no usable horizontal overflow, and the directory uses four real platforms. Strict lint/typecheck, 21 files/47 tests and production+SSR build pass.

### S6 — Approach page visual system and content
- **Status**: done
- **Files**: `src/pages/approach/approach.page.ts`, `src/pages/approach/approach.page.html`, `src/pages/approach/approach.page.scss`, `src/pages/approach/_approach-capability-system.scss`, `src/pages/approach/approach.page.spec.ts`
- **Gate**: approach page unit tests + responsive Playwright audit
- **Acceptance**: capability panels never visually jump or clip across selection; every capability has a coherent icon/example/proof; text is concise, relevant and attractive; transitions, focus and theme changes preserve layout and contrast.
- review-state: done
- review-implementer: microsoft-mai-code-2
- review-reviewer: cartago-independent-s6-reviewer-20261124
- review-log: approved by cartago-independent-s6-reviewer-20261124 — verified at 00444f8, validate exit 0 and tests 48/48 claimed, no recorded run cited — Independent S6 review approved. All six capabilities now expose icon, practical example and proof; panel is fixed/scroll-safe at 560px desktop/mobile with no selection jump, tabs support roving tabindex plus Arrow/Home/End focus, and theme/reduced-motion styles preserve contrast. Browser audit at 1366x768 and 390x844 passed, along with strict lint/typecheck, 21 files/48 tests and production+SSR build.

### S7 — Knowledge page examples and related projects
- **Status**: done
- **Files**: `src/pages/knowledge/knowledge.page.ts`, `src/pages/knowledge/knowledge.page.html`, `src/pages/knowledge/knowledge.page.scss`, `src/pages/knowledge/_knowledge-card-system.scss`, `src/pages/knowledge/knowledge.page.spec.ts`
- **Gate**: knowledge tests + link validation + responsive audit
- **Acceptance**: every knowledge area has a related icon, short practical example and verified links to relevant public projects; cards share dimensions and state treatment and remain readable at 390px.
- review-state: done
- review-implementer: microsoft-mai-code-2
- review-reviewer: cartago-independent-s7-reviewer-20261124
- review-log: approved by cartago-independent-s7-reviewer-20261124 — verified at cdfa1f1, validate exit 0 and tests 48/48 claimed, no recorded run cited — Independent S7 review approved. Six areas have distinct icons, specific portfolio examples and two verified HTTPS project links each; a shared 3/2/1-column card system keeps equal 400px mobile height, 12px+ informative text and accessible nav, with theme tokens and reduced motion. Desktop/mobile audit passed, strict lint/typecheck, 21 files/48 tests and production+SSR build.

### S8 — Docker page product catalogue
- **Status**: done
- **Files**: `src/pages/docker/docker.page.ts`, `src/pages/docker/docker.page.html`, `src/pages/docker/docker.page.scss`, `src/pages/docker/docker.page.spec.ts`
- **Gate**: Docker page tests + external destination validation + responsive audit
- **Acceptance**: the page explains the public Docker toolchain, exposes each important image with use case and command, links to Docker Hub and source, and adapts all cards/terminal examples to the active theme.
- review-state: done
- review-implementer: microsoft-mai-code-2
- review-reviewer: cartago-independent-s8-reviewer-20261127
- review-log: approved by cartago-independent-s8-reviewer-20261127 — verified at 7ed8cab, validate exit 0 and tests 48/48 claimed, no recorded run cited — Independent S8 review approved. Six real Docker Hub images have verified GitHub source links, truthful status, use case, stack and exact pull commands. Tokenized terminal/card UI adapts to themes, uses 12px minimum metadata, two/one-column responsive grids and reduced motion. Desktop/mobile audits and strict lint/typecheck, 21 files/48 tests and production+SSR build pass.

### S9 — Demos catalogue and mini-games
- **Status**: done
- **Files**: `src/domain/data.constant.ts`, `src/domain/types.interface.ts`, `src/lang/types.interface.ts`, `src/lang/content/en.content.ts`, `src/lang/content/es.content.ts`, `src/lang/content/fr.content.ts`, `src/lang/content/de.content.ts`, `src/pages/demos/demos.page.ts`, `src/pages/demos/demos.page.html`, `src/pages/demos/demos.page.scss`, `src/pages/demos/demos.page.spec.ts`, `src/pages/demos/_demos-interaction-system.scss`, `src/pages/demos/games/demo-games.component.ts`, `src/pages/demos/games/demo-games.component.html`, `src/pages/demos/games/demo-games.component.scss`, `src/pages/demos/games/demo-games.component.spec.ts`, `src/pages/demos/games/reflex-game.component.ts`, `src/pages/demos/games/reflex-game.component.html`, `src/pages/demos/games/reflex-game.component.scss`, `src/pages/demos/games/reflex-game.component.spec.ts`, `src/pages/demos/games/reaction-game.component.ts`, `src/pages/demos/games/reaction-game.component.html`, `src/pages/demos/games/reaction-game.component.scss`, `src/pages/demos/games/reaction-game.component.spec.ts`, `src/pages/demos/games/memory-game.component.ts`, `src/pages/demos/games/memory-game.component.html`, `src/pages/demos/games/memory-game.component.scss`, `src/pages/demos/games/memory-game.component.spec.ts`, `src/pages/demos/helpers/shuffle.helper.ts`, `src/pages/demos/helpers/shuffle.spec.ts`
- **Gate**: demo/game unit tests + keyboard/touch Playwright audit
- **Acceptance**: interactive examples appear in tabs before project links; every external project gets its correct logo; memory text is never reversed; additional compact games/examples exist; all games support keyboard/touch, reduced motion and reset; controls and state transitions are visible and consistent; the page only composes catalog and tab UI, while each game, reusable state helper and shared style contract has a focused component/helper owner with isolated tests.
- review-state: done
- review-implementer: microsoft-mai-code-2
- review-reviewer: explore-independent-s9-reviewer-20261123
- review-log: approved by explore-independent-s9-reviewer-20261123 — verified at 30c26ec, validate exit 0 and tests 55/55 claimed, no recorded run cited

### S10 — Contact copy, portrait and delivery
- **Status**: done
- **Files**: `src/app/app.config.ts`, `docs/contact-delivery.md`, `src/lang/types.interface.ts`, `src/lang/content/en.content.ts`, `src/lang/content/es.content.ts`, `src/lang/content/fr.content.ts`, `src/lang/content/de.content.ts`, `src/lang/translate.service.spec.ts`, `src/shared/ui/header/header.component.spec.ts`, `src/pages/demos/games/memory-game.component.spec.ts`, `src/pages/contact/contact.page.ts`, `src/pages/contact/contact.page.html`, `src/pages/contact/contact.page.scss`, `src/pages/contact/contact.page.spec.ts`, `src/pages/contact/contact-delivery.config.ts`, `src/pages/contact/contact-delivery.service.ts`, `src/pages/contact/contact-delivery.service.spec.ts`, `src/pages/contact/contact-form/contact-form.component.ts`, `src/pages/contact/contact-form/contact-form.component.html`, `src/pages/contact/contact-form/contact-form.component.scss`, `src/pages/contact/contact-form/contact-form.component.spec.ts`, `src/pages/contact/contact-portrait/contact-portrait.component.ts`, `src/pages/contact/contact-portrait/contact-portrait.component.html`, `src/pages/contact/contact-portrait/contact-portrait.component.scss`, `src/pages/contact/contact-portrait/contact-portrait.component.spec.ts`
- **Gate**: contact tests + typecheck + endpoint contract test + mobile audit
- **Acceptance**: portrait treatment is deliberate rather than a plain square; copy is concise and specific; submission sends via a configured static-safe endpoint, validates email/message, reports honest success/error, has a fallback that never claims a message was sent, and exposes no secret in the browser bundle.
- review-state: done
- review-implementer: microsoft-mai-code-2
- review-reviewer: explore-independent-s10-reviewer-20261123
- review-log: approved by explore-independent-s10-reviewer-20261123 — verified at 6416483, validate exit 0 and tests 62/62 claimed, no recorded run cited

### S11 — Lab examples, playgrounds and graph exploration
- **Status**: done
- **Files**: `src/lang/types.interface.ts`, `src/lang/content/en.content.ts`, `src/lang/content/es.content.ts`, `src/lang/content/fr.content.ts`, `src/lang/content/de.content.ts`, `src/pages/lab/lab.page.ts`, `src/pages/lab/lab.page.html`, `src/pages/lab/lab.page.scss`, `src/pages/lab/lab.page.spec.ts`, `src/pages/lab/_lab-playground-system.scss`, `src/pages/lab/helpers/chart-geometry.helper.ts`, `src/pages/lab/helpers/chart-geometry.spec.ts`, `src/pages/lab/helpers/contrast-ratio.helper.ts`, `src/pages/lab/helpers/contrast-ratio.spec.ts`, `src/pages/lab/lab-dashboard/lab-dashboard.component.ts`, `src/pages/lab/lab-dashboard/lab-dashboard.component.html`, `src/pages/lab/lab-dashboard/lab-dashboard.component.scss`, `src/pages/lab/lab-dashboard/lab-dashboard.component.spec.ts`, `src/pages/lab/workflow-playground/workflow-playground.component.ts`, `src/pages/lab/workflow-playground/workflow-playground.component.html`, `src/pages/lab/workflow-playground/workflow-playground.component.scss`, `src/pages/lab/workflow-playground/workflow-playground.component.spec.ts`, `src/pages/lab/motion-playground/motion-playground.component.ts`, `src/pages/lab/motion-playground/motion-playground.component.html`, `src/pages/lab/motion-playground/motion-playground.component.scss`, `src/pages/lab/motion-playground/motion-playground.component.spec.ts`, `src/pages/lab/accessibility-playground/accessibility-playground.component.ts`, `src/pages/lab/accessibility-playground/accessibility-playground.component.html`, `src/pages/lab/accessibility-playground/accessibility-playground.component.scss`, `src/pages/lab/accessibility-playground/accessibility-playground.component.spec.ts`, `src/pages/lab/concurrency-playground/concurrency-playground.component.ts`, `src/pages/lab/concurrency-playground/concurrency-playground.component.html`, `src/pages/lab/concurrency-playground/concurrency-playground.component.scss`, `src/pages/lab/concurrency-playground/concurrency-playground.component.spec.ts`
- **Gate**: lab tests + interaction/performance audit
- **Acceptance**: the lab contains multiple useful frontend examples (motion, drag/drop, data visualisation, state, accessibility, forms, concurrency), multiple playgrounds rather than one linear exercise, substantially more chart options than three, useful job-relevant explanations, and responsive controls with visible focus/reduced-motion support.
- review-state: done
- review-implementer: microsoft-mai-code-2
- review-reviewer: explore-independent-s11-reviewer-20261123
- review-log: approved by explore-independent-s11-reviewer-20261123 — verified at 201fcaa, validate exit 0 and tests 71/71 claimed, no recorded run cited

### S12 — Route transitions, responsive system and shared motion tokens
- **Status**: done
- **Files**: `src/app/app.config.ts`, `src/app/page.scss`, `src/styles.scss`, `src/styles/motion/_theme-transition.scss`, `src/styles/motion/_view-transitions.scss`, `src/styles/tokens/_durations.scss`, `src/styles/tokens/_index.scss`, `src/styles/tokens/_themes.scss`, `src/shared/ui/header/header.component.scss`, `src/shared/ui/footer/footer.component.scss`, `src/pages/home/home-intro/home-intro.component.scss`, `src/pages/home/profile-links/profile-links.component.scss`, `src/pages/home/hero-monitor/_monitor-accessibility-final.scss`, `src/pages/knowledge/_knowledge-card-system.scss`, `docs/visual-audit-s12.md`
- **Gate**: lint/typecheck + 1366x768 and 390x844 Playwright audits on every route
- **Acceptance**: route/tab transitions are intentional and coherent, no page has horizontal overflow or clipped interactive content, scrollbars follow theme tokens, reduced-motion disables non-essential motion, shared effects use existing tokens rather than per-route ad hoc colours/durations, and the minimum visual size, contrast and overflow strategy for labels, navigation, cards and supporting copy are validated on desktop/tablet/mobile without relying on ellipsis to hide information. Named browser captures/measurements must cover every route at 1366×768, a tablet viewport and 390×844 in at least a light and a dark theme, and no “build passed” status can close a slice without this visual audit.
- **Evidence**: `docs/visual-audit-s12.md` records 48 named dark/light route measurements at 1366×768, 768×1024 and 390×844: no document overflow, no rendered informative text below 12px, transparent footer chrome and zero transition errors under a 14-navigation stress pass.
- **S16 handoff**: Home destination and Lab chart rails are intentional local scrollers; final wider monitor composition, physical icon/text collision review, globe presentation and project-specific Work effects remain explicitly blocking in S16 before S14 certification.
- review-state: done
- review-implementer: microsoft-mai-code-2
- review-reviewer: explore-independent-s12-rereview-20261123
- review-log: approved by explore-independent-s12-rereview-20261123 — verified at 620db3d, validate exit 0 and tests 71/71 claimed, no recorded run cited

### S13 — Full i18n parity and accessible copy
- **Status**: done
- **Files**: `docs/i18n-audit-s13.md`, `src/app/app.routes.server.spec.ts`, `src/app/app.routes.server.ts`, `src/app/page.html`, `src/app/page.component.ts`, `src/core/platform/seo.helper.ts`, `src/lang/content-key.spec.ts`, `src/lang/content-key.helper.ts`, `src/lang/content/de.content.ts`, `src/lang/content/en.content.ts`, `src/lang/content/es.content.ts`, `src/lang/content/fr.content.ts`, `src/lang/content/pages-de.content.ts`, `src/lang/content/pages-fr.content.ts`, `src/lang/i18n-parity.spec.ts`, `src/lang/types.interface.ts`, `src/pages/approach/approach.page.html`, `src/pages/approach/approach.page.spec.ts`, `src/pages/approach/approach.page.ts`, `src/pages/docker/docker.page.html`, `src/pages/docker/docker.page.spec.ts`, `src/pages/docker/docker.page.ts`, `src/pages/home/hero-monitor/hero-monitor.component.html`, `src/pages/home/hero-monitor/hero-monitor.component.spec.ts`, `src/pages/home/hero-monitor/hero-monitor.component.ts`, `src/pages/home/profile-links/profile-links.component.spec.ts`, `src/pages/home/profile-links/profile-links.component.ts`, `src/pages/home/technology-marquee/technology-marquee.component.ts`, `src/pages/knowledge/knowledge.page.html`, `src/pages/knowledge/knowledge.page.spec.ts`, `src/pages/knowledge/knowledge.page.ts`, `src/pages/work/work.page.html`, `src/pages/work/work.page.spec.ts`, `src/pages/work/work.page.ts`
- **Gate**: i18n parity tests + typecheck + prerender EN/ES/FR/DE
- **Acceptance**: EN/ES/FR/DE render the correct locale from the URL even with another saved preference, all visible/ARIA labels—including S5–S11 project details, Work/Approach/Knowledge/Docker/Demos/Lab examples, status/provenance labels and newly added game copy—are localized, server headers/prerender agree with route locale, and no untranslated English visible text appears in non-English routes except immutable brand, project, package and technology names.
- review-state: done
- review-implementer: microsoft-mai-code-2
- review-reviewer: explore-independent-s13-reviewer-20261123
- review-log: approved by explore-independent-s13-reviewer-20261123 — verified at a35de8d, validate exit 0 and tests 87/87 claimed, no recorded run cited

### S14 — Regression, accessibility and responsive tests
- **Status**: pending
- **Files**: `docs/regression-audit-s14.md`, `e2e/portfolio.spec.ts`, `e2e/quality-gates.spec.ts`, `e2e/visual-truth.spec.ts`, `e2e/arcade-games.spec.ts`, `e2e/demos-laboratory.spec.ts`, `e2e/lab-fullscreen-evidence.spec.ts`, `tools/check-public-boundary.script.ts`, `tools/check-bundle-budget.script.ts`, `plugins/portfolio-content`, `package.json`
- **Gate**: all tests + browser smoke suite
- **Evidence**: `docs/regression-audit-s14.md` maps every S14 requirement to a named test; the complete Playwright run is 27/27 passing, including all routes, four responsive viewports, four themes, twenty deep locales and repeated WebGL entry.
- **Acceptance**: regression coverage includes monitor state persistence, globe stacking/return, texture catalogue, destination metadata, footer opacity/back-to-top locale, project ordering, theme adaptation, command-palette focus, all route tabs and mobile overflow; browser checks produce named failure evidence rather than screenshots alone.
```
