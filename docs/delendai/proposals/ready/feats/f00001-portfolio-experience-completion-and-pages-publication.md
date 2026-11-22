---
id: f00001
title: "Portfolio experience completion and Pages publication"
kind: feat
status: ready
type: proposal
track: portfolio-product
date: 2026-11-22
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
- Keep globe texture changes GPU-local and lazy. Earth uses a high-quality cloud texture; planets, exoplanets and sports/random spheres use deterministic procedural shaders so the catalogue grows without dozens of large downloads.
- Treat contact delivery as an integration boundary: use a configured static-safe endpoint; when unconfigured, expose a truthful fallback rather than simulating success.
- Prefer data-driven cards and examples. Project ordering, stack evidence, route animations and preview destinations remain centralized in domain data.
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
- **Status**: pending
- **Files**: `src/domain/types.ts`, `src/pages/home/earth-globe/earth-globe.component.ts`, `src/pages/home/earth-globe/earth-globe.component.html`, `src/pages/home/earth-globe/earth-globe.component.scss`, `src/pages/home/hero-monitor/hero-monitor.component.ts`, `src/pages/home/hero-monitor/hero-monitor.component.html`, `src/pages/home/hero-monitor/hero-monitor.component.scss`, `src/pages/home/hero-monitor/_monitor-laptop-final.scss`, `src/core/rendering/earth-globe-renderer.ts`
- **Gate**: lint + typecheck + focused unit tests + desktop/mobile Playwright measurements
- **Acceptance**: switching Projects/Technologies preserves the active preview; the toggle has an icon; chart controls fill two complete rows with distinct chart icons; the destination aside never overflows; the globe z-index always beats the inactive monitor; the monitor has no active hover affordance while globe content is frontal; the close action says “Close sphere”; all eight solar planets plus Sun/Moon/Pluto, representative exoplanets and sports/random spheres are selectable.

### S2 — Project and technology destination data
- **Status**: pending
- **Files**: `src/domain/monitor-destinations.ts`, `src/domain/data.ts`, `src/domain/monitor-destinations.spec.ts`
- **Gate**: destination validation tests + link-shape audit
- **Acceptance**: every highlighted technology has official website/docs/package/repository links where they exist; projects expose repository/site/package/docs/release links verified from public metadata; each technology has specific explanatory copy describing its purpose and relevance, alphabetically ordered; projects use curated importance order; every URL is HTTPS; no guessed route is rendered.

### S3 — Shell, header, footer and back-to-top
- **Status**: pending
- **Files**: `src/shared/ui/header/**`, `src/shared/ui/footer/**`, `src/app/page.html`, `src/app/page.ts`, `src/core/platform/shell.facade.ts`, `src/core/platform/routing.ts`
- **Gate**: shell tests + desktop/mobile Playwright navigation audit
- **Acceptance**: the theme button is stable-width (`Themes` + selected colour dot), selected theme is marked in the menu, footer links are opaque and never expose route content during transitions, back-to-top only scrolls and never changes locale/configuration, route shell remains stable during View Transitions.

### S4 — Command palette interaction and motion
- **Status**: pending
- **Files**: `src/shared/ui/command-palette/**`
- **Gate**: component tests + keyboard Playwright audit
- **Acceptance**: no macOS-only visual metaphors are required for commands; command meaning is clear and localized; open/close uses reversible enter/exit animation, focus is trapped/restored, Escape and backdrop close work, reduced-motion is respected.

### S5 — Work page evidence and card system
- **Status**: pending
- **Files**: `src/pages/work/**`
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
- **Acceptance**: route/tab transitions are intentional and coherent, no page has horizontal overflow or clipped interactive content, scrollbars follow theme tokens, reduced-motion disables non-essential motion, and shared effects use existing tokens rather than per-route ad hoc colours/durations.

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
- The globe offers real-cloud Earth, existing Earth variants, Sun/Moon and all planets (including Pluto), exoplanet presets and sports/random balls; presets switch without replacing the rotation state or causing layout shift.
- Work, Approach, Knowledge, Docker, Demos, Lab and Contact are complete, responsive, theme-correct and coherent as one product.
- Public profile evidence is current enough to support the curated order and copy; every destination is verified or intentionally omitted with a truthful reason.
- Footer, back-to-top, locale, command palette and route/tab transitions work without visual jumps or input regressions.
- Contact delivery has a documented, tested integration boundary and never falsely reports success.
- EN/ES/FR/DE remain type-complete and SSR-prerendered.
- Lint, typecheck, all unit/integration tests, browser audits, production build and SSR build pass.
- GitHub Actions executes `preparation → tests → build → deploy` and deploys only after every prior stage succeeds.
- Locale expansion is deferred to `f00002`; `f00001` finishes product work and deployment first.
