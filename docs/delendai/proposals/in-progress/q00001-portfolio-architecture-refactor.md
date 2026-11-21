---
id: q00001
type: plan
status: in-progress
track: portfolio-architecture
closureGate:
  requirePeerReview: true
  requireAllSlicesDone: true
  requireAllChildrenDone: true
---

# Portfolio architecture refactor

## Outcome

The route shell in `src/app` only composes route views. Every public page belongs to a feature with its own HTML, SCSS, TypeScript and spec. Shared UI is reusable, domain data is immutable, core separates pure logic from explicit platform adapters, and SCSS follows tokens plus BEM blocks.

## Architecture decisions

- `src/app`: bootstrap, providers, routes and page shell only.
- `src/domain`: immutable public portfolio contracts and content.
- `src/core`: renderer, pure state transitions and explicit browser/platform adapters.
- `src/shared`: reusable UI and presentation utilities.
- `src/features`: independently testable portfolio screens.
- `src/styles`: tokens, motion, theme and BEM primitives. Feature styles own their blocks; the shell has no feature selectors after closure.

## Slices

- id: qs1
  title: Extract Home interactive monitor and profile presentation feature
  status: done
  doneWhen: Root template delegates Home; Earth adapter remains in core; feature has tests.
- id: qs2
  title: Extract Work and Approach presentation features
  status: done
  doneWhen: Root template delegates both pages; static data moves to domain; each feature has tests.
- id: qs3
  title: Extract Knowledge and Lab interactive features
  status: done
  doneWhen: Root owns only state facade; chart and capability interactions are feature contracts with tests.
- id: qs4-prep
  title: Add `portfolio_scss_audit` tool and produce the migration map
  status: done
  doneWhen: The `portfolio_scss_audit` tool reports every top-level selector of `src/app/portfolio-page.scss` with a suggested owning feature; the per-slice migration list is reproducible.
- id: qs4a
  title: Migrate hero-monitor selectors out of the shell
  status: pending
  doneWhen: `.orb*`, `.interface-shell*`, `.canvas-*`, `.layer-list`, `.monitor-*`, `.hero-banner`, `.hero-composition` live in `src/features/home/hero-monitor/hero-monitor.component.scss`; the shell drops its copies.
- id: qs4b
  title: Migrate home-intro selectors out of the shell
  status: pending
  doneWhen: `.home-intro*`, `.home-directory*`, `.directory-grid*`, `.explore-banner*`, `.proof-strip*`, `.hero-note` live in `src/features/home/home-intro/home-intro.component.scss`; the shell drops its copies.
- id: qs4c
  title: Migrate work case-grid selectors out of the shell
  status: pending
  doneWhen: `.case-grid`, `.case-card*`, `.case-overlay`, `.case-content*`, `.case-number`, `.case-label`, `.case-link` live in `src/features/work/work-page.component.scss`; the shell drops its copies.
- id: qs4d
  title: Migrate lab, knowledge, contact, docker, demos selectors out of the shell
  status: pending
  doneWhen: `.lab-page*`, `.knowledge-page*`, `.contact-page*`, `.docker-page*`, `.demos-page*`, `.approach-page*` live in their respective feature `*.component.scss`; the shell drops its copies.
- id: qs4e
  title: Migrate shared UI selectors and resolve unmapped blocks
  status: pending
  doneWhen: `.portfolio-header*`, `.portfolio-footer*`, `.command-palette*` live in `src/shared/ui/<component>/<component>.component.scss`; the 50 selectors still flagged `unmapped` by `portfolio_scss_audit` are either mapped to a feature or kept in the shell with a comment explaining why.
- id: qs4f
  title: Shell SCSS down to design tokens + layout only
  status: pending
  doneWhen: `src/app/portfolio-page.scss` ≤ 200 lines, holds only `:host`, design tokens, `.portfolio` / `.route-stage` / `.skip-link` / `.hero` / `.section` / `.section-heading` selectors; the style budget warning is resolved.
- id: qs5
  title: Finalize quality gates and MCP Vertex evidence
  status: pending
  doneWhen: `mcp:check`, `check`, build and tests pass; content audit covers every public feature; proposal evidence is recorded.

## Validation

`bun run mcp:check && bun run check && bun run build && bun run test && git diff --check`

## Evidence

- 2026-07-26: Approach, Work, Knowledge and Lab are isolated feature components. Their templates,
  styles and tests no longer belong to the route shell; the portfolio-content audit now reads
  every extracted public page.
- 2026-07-26: The Earth canvas lifecycle is isolated under the Home feature. Its renderer remains
  a core adapter and the feature owns texture preparation, motion interpolation and animation
  cleanup.
- 2026-07-26: The Home introduction and interactive monitor now delegate from the route shell.
  The monitor owns its state facades, Earth depth behaviour, template, tests and visual layer;
  moving its stylesheet removed the root CSS budget warning without weakening the configured limit.
- 2026-07-26: The route shell now only composes features. Locale persistence, navigation
  direction, theme and SEO coordination are isolated in `core/platform`, while page-local
  interactions remain inside their corresponding features.
- 2026-07-26: `qs4` granularized. `qs4-prep` is done — the new `portfolio_scss_audit` tool
  reports the migration map: 112 top-level selectors across 8 features + shell, with
  50 flagged `unmapped` for the author to resolve. Slices `qs4a` … `qs4f` break the
  migration into the smallest safe diffs (per feature, then shell). See
  `q00004-portfolio-scss-audit-tool.md` for the tool's evidence.
