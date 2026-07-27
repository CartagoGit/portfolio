---
id: q00005
type: plan
status: done
track: mcp-vertex-plugin-architecture
closureGate:
  requirePeerReview: false
  requireAllSlicesDone: true
  requireAllChildrenDone: true
---

# Sync `portfolio-content` plugin with the post-refactor shell

## Outcome

The `portfolio-content` plugin stays usable after the
`e7bbf13 refactor: complet base refactor` (and follow-up commits)
restructured the route shell from `src/app/portfolio-page.{ts,html,scss}`
into `src/app/page.{ts,html,scss}` + eight siblings under
`src/app/_composition/`. The plugin's:

- default `scssAuditSourcePath` now points at `src/app/page.scss`;
- `scripts/scss-smoke.ts` audits every shell partial and prints a
  per-file ownership report plus a roll-up;
- the spec file is updated to the new default;
- the `mcp-vertex.config.json` `contentPaths` already pointed at
  `src/app/page.html` (the rename was already integrated by the
  refactor commit).

The audit confirms the shell composition is now organised by
**feature responsibility** — each partial already groups the
selectors that belong to one or two features. The per-feature
slices (`qs4a` … `qs4f`) line up with the per-partial granularity.

## Architecture decisions

- **Audit, don't migrate** — the plugin stays read-only. The next
  slice author runs `bun run plugins/portfolio-content/scripts/scss-smoke.ts`
  to see the per-partial ownership and decides which selectors move.
- **Per-partial granularity** — the smoke walks every partial under
  `src/app/_composition/` so the author can claim one partial at a
  time. `_monitor.scss` already groups `.orb*`, `.interface-*`,
  `.canvas-*` → `home/hero-monitor`; the smoke prints this row.
- **One default, one path** — the option `scssAuditSourcePath`
  defaults to the entry point (`src/app/page.scss`); for the per-
  partial view, callers pass `sourcePath` per invocation.

## Slices

- id: q5s1
  title: Default `scssAuditSourcePath` to `src/app/page.scss`
  status: done
  doneWhen: `OptionsSchema.scssAuditSourcePath.default` is the new entry point.
- id: q5s2
  title: Extend `scss-smoke.ts` to audit every shell partial
  status: done
  doneWhen: The smoke walks `page.scss` + 8 partials under `_composition/` and prints a roll-up.
- id: q5s3
  title: Sync the test expectation
  status: done
  doneWhen: `tests/portfolio-content.spec.ts` asserts the new default.
- id: q5s4
  title: Update the `mcp-vertex.config.json` contentPaths
  status: done
  doneWhen: The `contentPaths` entry for the audit tool uses `src/app/page.html` (already integrated by `e7bbf13`).

## Validation

`bun run mcp:test && bun run plugins/portfolio-content/scripts/scss-smoke.ts`

## Evidence

- 2026-07-27: 26/26 vitest specs green.
- 2026-07-27: Smoke audit on the live shell — 124 selectors across
  nine partials. Ownership roll-up:

  | Ownership | Count |
  |---|---|
  | shell | 7 |
  | home/hero-monitor | 24 |
  | home/home-intro | 7 |
  | home/earth-globe | 1 |
  | work | 10 |
  | lab | 11 |
  | knowledge | 7 |
  | contact | 5 |
  | docker | 2 |
  | unmapped | 50 |
  | **total** | **124** |

  Per-partial ownership lines up with the per-feature slices from
  `q00001` (e.g. `_monitor.scss` → `home/hero-monitor`; `_telemetry.scss`
  → `lab`; `_operational.scss` → `knowledge` + `contact` + `docker`).
