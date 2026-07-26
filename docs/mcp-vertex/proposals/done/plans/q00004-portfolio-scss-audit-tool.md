---
id: q00004
type: plan
status: done
track: mcp-vertex-plugin-architecture
closureGate:
  requirePeerReview: false
  requireAllSlicesDone: true
  requireAllChildrenDone: true
---

# `portfolio_scss_audit` tool — actionable SCSS introspection

## Outcome

The plugin now offers a **fifth** tool, `portfolio_scss_audit`, that
reads a SCSS file (typically the legacy `src/app/portfolio-page.scss`)
and reports every top-level selector with a suggested owning feature
and target file. The output is the actionable map for slicing the
`qs4` migration of the shell SCSS — every selector falls into one of
three buckets:

1. **Mapped** to a feature (`home/hero-monitor`, `work`, `lab`, …) →
   the slice that owns the block.
2. **Shell** (`portfolio`, `route-stage`, `skip-link`, `hero`, …) →
   stays in the route shell.
3. **Unmapped** — author decides; the report flags them so the
   migration plan can resolve them before slicing.

Family inheritance is built in: a `.orb-one` block inherits the
ownership of the `.orb` block that appears earlier in the source —
no manual mapping table per descendant.

## Architecture decisions

- **Pure engine** — `runScssAudit` takes an `IFileSystem` (the same
  contract every other engine uses). Tests run against an in-memory
  map; production binds `node:fs/promises` lazily inside the tool
  builder so the engine stays side-effect-free.
- **Forward-declaration ownership** — `known` accumulates owners as
  we walk the source top-to-bottom. This means the tool needs no
  per-host configuration; the ownership map is the source of truth.
- **Top-level selector only** — the regex deliberately skips nested
  combinators (` `, `>`, `+`, `~`, `:`, `.`) so a `.hero::before` is
  not considered a separate migration target. The *containing*
  selector (`.hero`) is the one to migrate; the descendants follow.
- **Default option** — `options.scssAuditSourcePath` defaults to
  `src/app/portfolio-page.scss` so `mcp-vertex` users get the legacy
  shell report on first run without extra wiring.

## Slices

- id: q4s1
  title: Add `scss-audit` engine + contract
  status: done
  doneWhen: `services/scss-audit.ts` + `contracts/interfaces/scss-audit.interface.ts` with `IScssAuditReport`, `IScssSelectorEntry`, `ScssOwnership`.
- id: q4s2
  title: Add `portfolio_scss_audit` tool
  status: done
  doneWhen: `tools/scss-audit-tool.ts` registered with `inputSchema` + `outputSchema`; documented in `index.ts`.
- id: q4s3
  title: Add `scssAuditSourcePath` option
  status: done
  doneWhen: `OptionsSchema` accepts the option with a sensible default; loader passes it to the tool builder.
- id: q4s4
  title: Vitest coverage
  status: done
  doneWhen: 4 new specs for the audit engine (classification, family inheritance, unmapped flag, line order).

## Validation

`bun run mcp:typecheck && bun run mcp:test && bun run plugins/portfolio-content/scripts/scss-smoke.ts`

## Evidence

- 2026-07-26: `portfolio_scss_audit` tool shipped. 26/26 vitest specs
  green (4 new specs for the SCSS audit engine).
- 2026-07-26: Real SCSS audit of `src/app/portfolio-page.scss` (the
  legacy `qs4` target) reports **112 top-level selectors** across
  the eight features and the shell:

  | Ownership | Count |
  |---|---|
  | shell | 8 |
  | home/hero-monitor | 18 |
  | home/earth-globe | 1 |
  | home/home-intro | 7 |
  | work | 9 |
  | knowledge | 5 |
  | lab | 9 |
  | docker | 1 |
  | contact | 4 |
  | unmapped | 50 |
  | **total** | **112** |

  62 of the 112 selectors are now mappable to a feature; the
  remaining 50 are flagged as `unmapped` so the migration plan can
  resolve them per-slice. The `home/hero-monitor` slice is the
  biggest migration target (18 selectors — `.orb*`, `.interface-*`,
  `.canvas-*`, `.layer-list`).
- 2026-07-26: `bun run plugins/portfolio-content/scripts/scss-smoke.ts`
  prints the full report. The author can now sit at the migration
  plan and slice `qs4` by ownership row.
