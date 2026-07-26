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

The route shell in `src/app` only coordinates route, locale, theme and page state. Every public page belongs to a feature with its own HTML, SCSS, TypeScript and spec. Shared UI is reusable, domain data is immutable, core is framework-agnostic and SCSS follows tokens plus BEM blocks.

## Architecture decisions

- `src/app`: bootstrap, providers, routes and page shell only.
- `src/domain`: immutable public portfolio contracts and content.
- `src/core`: renderer, pure state transitions and browser adapters.
- `src/shared`: reusable UI and presentation utilities.
- `src/features`: independently testable portfolio screens.
- `src/styles`: tokens, motion, theme and BEM primitives. Feature styles own their blocks; the shell has no feature selectors after closure.

## Slices

- id: qs1
  title: Extract Home interactive monitor and profile presentation feature
  status: in-progress
  doneWhen: Root template delegates Home; Earth adapter remains in core; feature has tests.
- id: qs2
  title: Extract Work and Approach presentation features
  status: done
  doneWhen: Root template delegates both pages; static data moves to domain; each feature has tests.
- id: qs3
  title: Extract Knowledge and Lab interactive features
  status: done
  doneWhen: Root owns only state facade; chart and capability interactions are feature contracts with tests.
- id: qs4
  title: Remove legacy shell SCSS and establish BEM style layers
  status: pending
  doneWhen: Feature selectors leave `portfolio-page.scss`; style budget warning is resolved without altering user configuration.
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
