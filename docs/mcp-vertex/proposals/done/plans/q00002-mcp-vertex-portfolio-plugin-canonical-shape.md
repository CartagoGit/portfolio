---
id: q00002
type: plan
status: done
track: mcp-vertex-plugin-architecture
closureGate:
  requirePeerReview: false
  requireAllSlicesDone: true
  requireAllChildrenDone: true
---

# Portfolio `portfolio-content` plugin — canonical mcp-vertex shape

## Outcome

The workspace's local mcp-vertex plugin follows the same layered shape
used by the first-party `deps` plugin and the `custom-plugin` example:
a thin `definePlugin` entry, pure engine services, `IToolRegistration`
builders, interfaces, a `public` barrel and vitest tests that boot
the plugin against a fake `IMcpPluginContext`. Tools declare both
`inputSchema` and `outputSchema`; responses go through `toolJson` /
`toolOk` / `toolError` envelopes. Knowledge entries are bilingual
(en + es) and the audit surfaces severity-labelled findings plus an
actionable `nextAction` so an agent can render them inline.

## Architecture decisions

- **Layered shape** — `src/lib/{services,tools,contracts}/…` mirrors
  `plugins/deps/`. The single-file shape (`docs/mcp-vertex/examples/
  custom-plugin/`) is fine for ≤2 trivial tools, but the audit + briefs
  pair already needs shared interfaces, so we adopt the layered shape
  from day one.
- **Testable engine** — `runPortfolioAudit` takes an injectable
  `IPortfolioAuditReader`; tests pass an in-memory map, production
  binds `node:fs/promises` lazily inside `buildFsAuditReader()`.
- **Bilingual knowledge** — three knowledge entries cover the
  publication boundary in English and Spanish plus a runbook that
  explains when to call each tool.
- **Strict contract** — `OptionsSchema` validates every option the
  host passes; the loader rejects misconfigured hosts *before*
  `register()` runs. `outputSchema` mirrors `IPortfolioAuditReport`
  / `IPortfolioCaseStudyBriefResult` so consumers can render typed UI.
- **vitest in place** — `tools/mcp-vertex/portfolio-content/vitest.config.ts`
  scopes the runner to the plugin's `tests/`; new scripts:
  `bun run mcp:test`, `bun run mcp:typecheck`, `bun run mcp:all`.

## Slices

- id: q2s1
  title: Adopt canonical layered shape under `tools/mcp-vertex/portfolio-content/`
  status: done
  doneWhen: `src/{index,public/index}.ts` + `src/lib/{services,tools,contracts}`; legacy `.mjs` archived.
- id: q2s2
  title: Implement `portfolio_content_audit` with typed `outputSchema` and severity
  status: done
  doneWhen: `IPortfolioAuditReport` has `severity.{errors,warnings,info}`, `findings` with location + remediation, bilingual `nextAction`. Engine is side-effect-free.
- id: q2s3
  title: Implement `portfolio_case_study_brief` with bilingual tables
  status: done
  doneWhen: `buildCaseStudyBriefs()` returns `{ en, es }`; `caseStudyBrief()` defaults to `en`.
- id: q2s4
  title: Bilingual knowledge + runbook + tests
  status: done
  doneWhen: 3 knowledge entries (boundary en/es + runbook); 12 vitest specs pass; plugin typecheck clean.
- id: q2s5
  title: Wire scripts + host config + README
  status: done
  doneWhen: `mcp-vertex.config.json` points at the canonical path; `bun run mcp:{test,typecheck,all}` exist; `docs/mcp-vertex/README.md` documents the layout.

## Validation

`bun run mcp:typecheck && bun run mcp:test && bun run mcp:check`

## Evidence

- 2026-07-26: 12/12 vitest specs pass; `tsc --noEmit -p tsconfig.json`
  reports no diagnostics; `bun run mcp:check` boots 22 plugins with
  `localPlugin: true` against the new plugin path.
- 2026-07-26: `tools/mcp-vertex/portfolio-content/src/lib/services/audit.ts`
  exposes a pure `runPortfolioAudit` engine with an injectable reader
  (`IPortfolioAuditReader`); the handler binds `node:fs/promises` via
  `buildFsAuditReader()` at register-time so the engine stays free of
  side effects.
- 2026-07-26: `tools/mcp-vertex/portfolio-content/src/lib/services/briefs.ts`
  returns per-locale tables (`en` + `es`) for six case studies; the
  brief tool defaults to `en` when the caller omits `locale`.
- 2026-07-26: Three knowledge entries
  (`portfolio-content-public-boundary-en`,
  `portfolio-content-public-boundary-es`,
  `portfolio-content-runbook`) cover publication rules in both
  languages and an explicit runbook of when to call each tool.
- 2026-07-26: Legacy single-file plugin archived under
  `tools/mcp-vertex/_legacy/portfolio-content.mjs` and added to
  `.gitignore`. The canonical path is
  `tools/mcp-vertex/portfolio-content/src/index.ts`.
