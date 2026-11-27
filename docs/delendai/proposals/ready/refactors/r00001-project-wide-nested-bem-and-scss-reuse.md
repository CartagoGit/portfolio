---
id: r00001
title: "Project-wide nested BEM and SCSS reuse"
kind: refactor
status: ready
type: proposal
track: portfolio-architecture
date: 2026-11-27
---

# r00001 — Project-wide nested BEM and SCSS reuse

## goal

Make every application SCSS file follow the same nested BEM ownership model, reuse the shared responsive/motion/state primitives and fail the build when flat, duplicated or invalid BEM selectors regress into the project.

## why

The portfolio currently mixes three stylesheet styles: true nested BEM (`.block { &__element { ... } }`), flat BEM selectors (`.block__element { ... }`), and last-wins refinement partials. That combination makes ownership hard to see, lets the same selector accumulate across files, and permits invalid mixed selectors to compile silently. A portfolio that sells frontend architecture should demonstrate one predictable SCSS contract.

## why this design

The component or feature remains the ownership boundary. CSS nesting expresses that relationship directly; `&__` and `&--` are checked mechanically; shared breakpoints, state transitions and interaction geometry move to `src/styles/` mixins instead of being copied into page files. The current `f00004 S3` owns the interactive monitor, so this proposal verifies that slice and owns the remaining SCSS areas without duplicating work.

## non-goals

- Redesigning page visuals or changing copy/content.
- Replacing Angular encapsulation, CSS Grid/Flexbox or the current theme-token system.
- Inventing a new naming scheme: this proposal standardizes existing BEM plus modifiers.
- Rewriting already-shared token, keyframe and motion files when their ownership is already correct.
- Moving behavior or markup only to make a stylesheet pass; BEM refactors must preserve templates, states and accessibility.

## slices

- global_gate: lint + typecheck + all tests + production/SSR build + responsive browser audit

### S1 — Define and enforce the SCSS architecture contract
- **Status**: pending
- **Files**: `src/styles/**`, `tools/check-bem-boundaries.script.ts`, `tools/check-bem-boundaries.baseline.json`, `package.json`, `docs/architecture-s17.md`
- **Gate**: type
- acceptance:
  - "One documented nesting contract is used: app/component owner → BEM block → `&__element` / `&--modifier`; keyframes and token definitions remain root-owned."
  - "A deterministic checker rejects flat BEM declarations outside a BEM owner, invalid mixed selectors, duplicate selectors in the same effective block and unapproved feature-style leakage into shell SCSS."
  - "The checker runs through strict/package quality gates and reports file plus line with a concrete rewrite hint."

### S2 — Normalize app shell and shared UI styles
- **Status**: pending
- **Files**: `src/app/*.scss`, `src/shared/ui/**/*.scss`
- **Gate**: e2e
- acceptance:
  - "Header, footer, command palette, evidence cards and fullscreen evidence own nested BEM blocks with reusable state/motion primitives."
  - "The route shell contains layout and shell primitives only; no page or component descendants are appended as flat selector piles."
  - "All 20 locales, keyboard focus and shell fullscreen/search interactions preserve their current behavior."

### S3 — Normalize Home styles outside the interactive monitor
- **Status**: pending
- **Files**: `src/pages/home/earth-globe/**/*.scss`, `src/pages/home/home-intro/**/*.scss`, `src/pages/home/profile-links/**/*.scss`, `src/pages/home/technology-marquee/**/*.scss`
- **Gate**: e2e
- acceptance:
  - "Earth, introduction, profile links and marquee use component-owned nested BEM and share only tokens/motion primitives from `src/styles/`."
  - "The globe keeps loading/error/ready states and touch affordances at all six viewports."
  - "The monitor refactor delivered by `f00004 S3` is included in the final BEM audit but is not duplicated by this slice."

### S4 — Normalize Work, Approach and Knowledge style systems
- **Status**: pending
- **Files**: `src/pages/work/**/*.scss`, `src/pages/approach/**/*.scss`, `src/pages/knowledge/**/*.scss`
- **Gate**: e2e
- acceptance:
  - "The final card/tab primitives have one owner; refinement partials with duplicated selectors are merged or given a single scoped responsibility."
  - "Project, capability and knowledge cards share hover/focus/pressed/reduced-motion primitives without flattening their visual identities."
  - "No flat repeated BEM selectors remain across the three style systems."

### S5 — Normalize Demos showcases and game styles
- **Status**: pending
- **Files**: `src/pages/demos/**/*.scss`
- **Gate**: e2e
- acceptance:
  - "Showcase, arcade shell, control pad and every compact/arcade game use nested BEM with shared layout, metrics, board and action mixins."
  - "Repeated 600px/landscape/mobile rules are represented once in the demos interaction primitives."
  - "All games, fullscreen owners and the future 3D game preserve direct pointer, keyboard and touch controls."

### S6 — Normalize Lab and experiment styles
- **Status**: pending
- **Files**: `src/pages/lab/**/*.scss`
- **Gate**: e2e
- acceptance:
  - "Lab page and every playground own nested BEM blocks and consume the shared playground system rather than repeating control/status geometry."
  - "Responsive/fullscreen evidence remains scroll-safe and aspect-ratio-correct."
  - "Reduced motion and high-contrast state selectors stay explicit and tested."

### S7 — Normalize Contact and Docker styles
- **Status**: pending
- **Files**: `src/pages/contact/**/*.scss`, `src/pages/docker/**/*.scss`
- **Gate**: e2e
- acceptance:
  - "Contact form/portrait and Docker cards use one nested BEM block per feature/component with shared state and focus primitives."
  - "Theme, hover and fullscreen-independent responsive states remain identical or visibly improved."

## dependency graph

- S1 defines the checker and canonical rules before any broad migration is accepted.
- `f00004 S3` delivers the interactive monitor's own nested BEM consolidation; r00001 S3 verifies but does not duplicate that ownership.
- S2–S7 are independent after S1 because their file sets are disjoint.
- Final closure requires all checks plus the human/automated visual matrix from `f00004`.

## risks

- **Cascade drift:** nesting can compile to a different selector if a parent has state/modifier syntax. Mitigation: before/after Playwright captures and selector-level unit checks.
- **Visual-only refactor hiding stale rules:** repeated partials are audited and merged only when the source selector is proven to have one owner.
- **Too-strict checker:** Sass pseudo classes, data-state selectors and keyframes are explicitly allowed; the gate checks only block ownership and duplicated effective declarations.

## acceptance

- Every SCSS file under `src/` follows one documented nested BEM/reuse contract, while tokens, keyframes and global reset remain correctly root-scoped.
- Flat BEM declarations, invalid mixed-class selectors and duplicated effective rules fail a named quality check.
- Shared responsive, state, focus and motion patterns are owned once under `src/styles/` or one component system partial.
- The checker and style audit report zero BEM regressions across the application.
- Strict lint/typecheck, unit/integration tests, the complete Playwright matrix, 160-route prerender and bundle budgets all pass after the refactor.
