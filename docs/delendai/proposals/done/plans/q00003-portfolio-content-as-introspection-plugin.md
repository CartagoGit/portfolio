---
id: q00003
type: plan
status: done
track: mcp-vertex-plugin-architecture
closureGate:
  requirePeerReview: false
  requireAllSlicesDone: true
  requireAllChildrenDone: true
---

# Portfolio plugin — relocate to `plugins/` and refocus on codebase introspection

## Outcome

The local mcp-vertex plugin lives at the canonical
`plugins/portfolio-content/` location (matching the monorepo's
`plugins/<name>/` shape) and its value to an agent is **answering
questions about the portfolio codebase**, not just scanning public
templates. Four read-only tools:

| Tool | What it does |
|---|---|
| `portfolio_architecture` | Returns the canonical layered shape of `src/` (app / core / domain / features / shared / styles) with on-disk subfolders. |
| `portfolio_features` | Lists every Angular component every feature owns, grouped by feature. |
| `portfolio_domain` | Surfaces the public domain contracts (`PortfolioPageId`, `CapabilityId`, …) extracted from `src/domain/portfolio.types.ts`. |
| `portfolio_public_audit` | Support tool: scans public templates for forbidden employer/client terms and `TODO(image)` placeholders. Severity-labelled. |

The audit stays as a support tool — it covers a real pre-publish gate
— but the plugin's *primary* value is introspection, not content
gating.

## Architecture decisions

- **Canonical location** — `plugins/portfolio-content/`, mirroring
  `plugins/deps/`, `plugins/audit/`, and the monorepo's flat
  `plugins/<name>/` convention. `tools/mcp-vertex/portfolio-content/`
  is gone.
- **Pure engines, DI everywhere** — every engine takes an
  `IFileSystem` interface so tests run against an in-memory map and
  production binds `node:fs/promises` lazily. The audit engine takes
  an `IPublicAuditReader` for the same reason. No plugin code calls
  `fs` directly.
- **Bilingual knowledge** — six knowledge entries cover architecture,
  features, domain, the public boundary in en + es, and a runbook.
- **Smoke test** — `plugins/portfolio-content/scripts/smoke.ts`
  boots the plugin and invokes the three introspection tools against
  the *real* `src/`, validating the engine reads the workspace
  correctly.
- **No legacy** — the previous single-file plugin and the previous
  `tools/mcp-vertex/portfolio-content/` location are both deleted
  outright. No `_legacy/`, no archive.

## Slices

- id: q3s1
  title: Relocate plugin to `plugins/portfolio-content/`
  status: done
  doneWhen: Plugin loads from `plugins/portfolio-content/src/index.ts`; old `tools/mcp-vertex/portfolio-content/` removed.
- id: q3s2
  title: Refocus plugin on codebase introspection
  status: done
  doneWhen: Four read-only tools; `portfolio_architecture` / `portfolio_features` / `portfolio_domain` answer the "where does X live?" question; audit stays as support.
- id: q3s3
  title: Build the three introspection engines
  status: done
  doneWhen: `buildArchitectureMap`, `buildFeatureMap`, `buildDomainMap` are pure, testable, and produce stable output.
- id: q3s4
  title: Wire tests + scripts + config
  status: done
  doneWhen: 17 vitest specs; `bun run mcp:{check,test,typecheck,all}` green; `mcp-vertex.config.json` points at the canonical path; `.gitignore` excludes plugin `node_modules/`.
- id: q3s5
  title: Smoke test against real workspace
  status: done
  doneWhen: `scripts/smoke.ts` boots the plugin and surfaces 6 architecture layers + 11 features (home:5, work:1, …) + 8+ domain contracts on the live tree.

## Validation

`bun run mcp:all && bun run plugins/portfolio-content/scripts/smoke.ts`

## Evidence

- 2026-07-26: Plugin relocated to `plugins/portfolio-content/`. Old
  path `tools/mcp-vertex/portfolio-content/` removed; `.gitignore`
  updated to exclude the new location's `node_modules/`. The
  `mcp-vertex.config.json` `path:` now points at
  `plugins/portfolio-content/src/index.ts`.
- 2026-07-26: 17/17 vitest specs green (architecture engine, features
  engine, domain engine, audit engine, registration shape, all four
  tools via fake context).
- 2026-07-26: `bun tools/check-mcp-vertex.mjs` boots the host with
  22 plugins loaded; `localPlugin: true` for `portfolio-content`.
- 2026-07-26: Smoke test (`plugins/portfolio-content/scripts/smoke.ts`)
  exercises the three introspection tools against the *live* tree:
  6 architecture layers, features `home:5, work:1, approach:1,
  knowledge:1, lab:1, docker:1, demos:1, contact:1`, and domain
  contracts `PortfolioPageId(8)`, `CapabilityId(6)`, `HeroPanelId(6)`,
  `ChartType(7)`, etc.
- 2026-07-26: Six knowledge entries — `portfolio-architecture`,
  `portfolio-features`, `portfolio-domain`,
  `portfolio-public-boundary-en`, `portfolio-public-boundary-es`,
  `portfolio-content-runbook` — cover the layered shape, the
  feature catalogue, the contract surface, the publication rules in
  both languages, and an explicit runbook.
