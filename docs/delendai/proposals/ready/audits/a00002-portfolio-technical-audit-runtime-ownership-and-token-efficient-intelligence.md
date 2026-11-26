---
id: a00002
title: "Portfolio technical audit, runtime ownership and token-efficient intelligence"
kind: audit
status: ready
type: proposal
track: portfolio-quality
date: 2026-11-23
shipped-in:
  - "f4d9ae1"
  - "fb56d85"
  - "6241bdd"
---

# a00002 — Portfolio technical audit, runtime ownership and token-efficient intelligence

## goal

Align the portfolio's diagnostics, runtime boundaries and test gates with the actual Angular application; remove stale architectural assumptions, make route and browser resources truthful, and provide deterministic incremental queries with bounded token output.

## why

The external audit identified architecture drift between the DelendAI portfolio plugin and the application: diagnostics still target historical src/features and old domain names, route declarations are nominally lazy while PageComponent eagerly imports every page, and SCSS ownership is inferred without a real parser. The same audit highlights lifecycle risks in WebGL and timers, plus full-file scans that waste tokens and cannot prove that only changed project sections were evaluated. These are now product-quality risks, because the portfolio itself demonstrates the engineering claims it makes.

## non-goals

- Redesigning the public portfolio or changing its visual identity.
- Implementing global locale expansion owned by f00002.
- Changing the hosting target or delivery mechanism owned by f00001 S15.
- Vendoring, packaging or configuring external DelendAI distributions.
- Replacing Angular, WebGL, Angular Router or the portfolio-content plugin with a new framework.

## slices

- global_gate: e2e

### S1 — Synchronize portfolio-content with src/pages and current domain contracts
- **Status**: done
- **Files**: `plugins/portfolio-content/src/lib/services/architecture.service.ts`, `plugins/portfolio-content/src/lib/services/pages.service.ts`, `plugins/portfolio-content/src/lib/services/domain.service.ts`, `plugins/portfolio-content/src/index.ts`, `plugins/portfolio-content/tests/src/lib/plugin.spec.ts`, `plugins/portfolio-content/tests/helpers/fake-context.helper.ts`, `delendai.config.json`
- **Gate**: type
- acceptance:
  - "Architecture reports app/core/domain/pages/shared/styles."
  - "Feature discovery accepts page and component roles under src/pages."
  - "Domain parsing uses src/domain/types.interface.ts."
  - "Missing or renamed paths fail with actionable diagnostics."
  - "Plugin registration and host configuration match."
- review-state: done
- review-implementer: Yamato
- review-reviewer: microsoft-mai-code-2
- review-log: approved by microsoft-mai-code-2 — verified at fb56d85, validate exit 0 and tests 41/41 claimed, no recorded run cited; acceptance 5/5: (1) portfolio_architecture derives those six source layers and its service tests passed. (2) buildPageMap discovers *.page.ts and nested *.component.ts; plugin tests passed. (3) Domain service reads the configured domain root and plugin tests confirm exported contracts. (4) Service/plugin tests cover missing roots and failed reads, with mcp:check exit 0. (5) mcp:check registered architecture, features, domain, scss_audit, public_audit and query under the configured prefix. — Independent review of current application/plugin topology; plugin typecheck, all tests and registration passed.

### S2 — Hash-index project content with incremental invalidation
- **Status**: done
- **Files**: `plugins/portfolio-content/src/lib/services/content-index.service.ts`, `plugins/portfolio-content/tests/src/lib/content-index.service.spec.ts`, `plugins/portfolio-content/src/lib/helpers/content-hash.helper.ts`, `plugins/portfolio-content/tests/src/lib/content-hash.helper.spec.ts`, `plugins/portfolio-content/src/contracts/interfaces/content-index.interface.ts`
- **Gate**: type
- acceptance:
  - "The index records stable path, content digest, owner section and size metadata."
  - "Unchanged inputs reuse results."
  - "A changed file invalidates only dependent sections."
  - "Corruption falls back to a deterministic rebuild."
  - "Tests prove no stale output after edits."
- review-state: done
- review-implementer: Cartago
- review-reviewer: microsoft-mai-code-2
- review-log: approved by microsoft-mai-code-2 — independent historical reconciliation verified at f4d9ae1 against the current tree, validate exit 0, 43/43 plugin tests passing, typecheck and mcp:check passing; acceptance 5/5: (1) IContentIndexEntry records stable path, SHA-256 digest, owner section, size and mtime metadata. (2) Metadata signatures reuse unchanged inputs. (3) Section-scoped index instances invalidate only changed owners. (4) Restore rejects corrupt snapshots and synchronization deterministically rebuilds SHA-256 entries. (5) Unit and integration evidence proves fresh changed/reused paths after edits. — Corrected stale proposal references to the actual tests/ and contracts/ locations; the historical human implementation required reconciliation rather than replayed submission.

### S3 — Section queries and compact token-budgeted responses
- **Status**: done
- **Files**: `plugins/portfolio-content/src/lib/tools/architecture.tool.ts`, `plugins/portfolio-content/src/lib/tools/features.tool.ts`, `plugins/portfolio-content/src/lib/tools/domain.tool.ts`, `plugins/portfolio-content/src/lib/tools/scss-audit.tool.ts`, `plugins/portfolio-content/src/lib/tools/audit.tool.ts`, `plugins/portfolio-content/src/lib/tools/query.tool.ts`, `plugins/portfolio-content/src/lib/helpers/projection.helper.ts`, `plugins/portfolio-content/tests/src/lib/projection.helper.spec.ts`, `plugins/portfolio-content/tests/portfolio-content.spec.ts`
- **Gate**: type
- acceptance:
  - "Every portfolio tool selects a section or field projection."
  - "Responses include counts and concise evidence."
  - "Pagination or truncation metadata is explicit."
  - "Responses remain within a measured token budget."
  - "Queries do not reread unchanged full files."
- review-state: done
- review-implementer: microsoft-mai-code-2
- review-reviewer: Explore-rereview-6241bdd
- review-log: requested_changes by Explore — b3375a0: compactProjection checks item-array size but final tokenEstimate adds count/total/offset/truncated/nextOffset metadata, so the final projection can cross tokenBudget near the boundary. Reproduce with many small items and a tight budget; fix the loop to measure the final envelope and add a regression test that asserts tokenEstimate <= budget at the boundary.
- review-log: resubmitted by microsoft-mai-code-2 — resubmitted; answers the request above: Addressed Explore's review in 6241bdd: the limiter now estimates items plus count/total/offset/truncated/nextOffset and the 128-token boundary has a regression test; 43/43 plugin tests, typecheck and mcp:check pass.
- review-log: approved by Explore-rereview-6241bdd — verified at 6241bdd, validate exit 0 and tests 43/43 claimed, no recorded run cited; acceptance 5/5: (1) All six tools consume the shared PROJECTION_INPUT and apply compactProjection to their primary evidence collection. (2) Every tool returns count/total and field-projected items; the integration spec covers all direct tools. (3) Shared output schema exposes offset/truncated/nextOffset and helper tests cover oversized items. (4) The complete envelope including pagination metadata is measured before each push and the 128-token regression passes. (5) Query reuses ContentIndexService section results and its cache-reuse test remains passing. — Fresh independent verification passed all five criteria and the prior review blocker after commit 6241bdd.

### S4 — Replace nominal lazy routes with real route-level splitting
- **Status**: pending
- **Files**: `src/app/app.routes.ts`, `src/app/app.routes.server.ts`, `src/app/page.component.ts`, `src/app/page.html`, `src/app/page.scss`, `src/app/app.spec.ts`, `angular.json`
- **Gate**: e2e
- acceptance:
  - "The shell does not import all page implementations."
  - "Each route owns a lazy component boundary."
  - "Direct refresh, SSR and prerender preserve locale and navigation."
  - "Production chunks prove page isolation."
  - "Navigation and back-to-top remain correct."

### S5 — Harden WebGL and timer lifecycle ownership
- **Status**: pending
- **Files**: `src/core/rendering/earth-globe.renderer.ts`, `src/core/rendering/earth-globe.renderer.spec.ts`, `src/pages/home/earth-globe/earth-globe.component.ts`, `src/pages/home/hero-monitor/hero-monitor.facade.ts`, `src/pages/home/hero-monitor/hero-monitor.facade.spec.ts`
- **Gate**: e2e
- acceptance:
  - "Destroy cancels animation frames, observers, delayed work and timers."
  - "GPU resources and event listeners are released exactly once."
  - "Context loss pauses rendering safely."
  - "Context restoration rebuilds state safely."
  - "Repeated route and theme entry shows no duplicate loops or leaked listeners."

### S6 — Implement structural SCSS ownership audit
- **Status**: pending
- **Files**: `plugins/portfolio-content/src/lib/services/scss-audit.service.ts`, `plugins/portfolio-content/src/lib/services/scss-audit.parser.ts`, `plugins/portfolio-content/src/lib/services/scss-audit.types.ts`, `plugins/portfolio-content/tests/scss-audit.spec.ts`
- **Gate**: type
- acceptance:
  - "The audit parses imports, use, forward, selectors and custom-property references structurally."
  - "Diagnostics identify actual owner files and reachable partials."
  - "Unresolved collisions include line-level evidence."
  - "Broad regular expressions are not the parser."

### S7 — Add security, accessibility and performance regression gates
- **Status**: pending
- **Files**: `e2e/portfolio.spec.ts`, `e2e/accessibility.spec.ts`, `e2e/performance.spec.ts`, `playwright.config.ts`, `tools/check-public-boundary.script.ts`, `tools/check-bundle-budget.script.ts`, `package.json`
- **Gate**: e2e
- acceptance:
  - "External destinations use safe attributes and HTTPS where required."
  - "Contact and form failures remain truthful."
  - "Route focus and reduced motion are tested."
  - "Horizontal overflow and missing accessible names fail the gate."
  - "Route chunks obey deterministic budgets."
  - "WebGL teardown regressions are detected with named evidence."

### S8 — Reconcile audit documentation and proposal ownership
- **Status**: pending
- **Files**: `plugins/portfolio-content/README.md`, `docs/architecture-audit.md`, `docs/delendai/README.md`, `docs/delendai/proposals/ready/feats/f00001-portfolio-experience-completion-and-pages-publication.md`, `docs/delendai/proposals/blocked/f00002-global-locale-expansion-and-browser-language-resolution.md`
- **Gate**: lint
- acceptance:
  - "Documentation matches the page and component topology."
  - "The cache/index contract and token budget are documented."
  - "Runtime lifecycle owners are explicit."
  - "Stale proposal references are updated or superseded."
  - "The proposal depends on f00001 publication without duplicating f00002 locale scope."

### S9 — Fail-closed public audit and workspace path boundary
- **Status**: pending
- **Files**: `plugins/portfolio-content/src/lib/services/fs.service.ts`, `plugins/portfolio-content/src/lib/services/audit.service.ts`, `plugins/portfolio-content/src/lib/tools/audit.tool.ts`, `plugins/portfolio-content/tests/portfolio-content.spec.ts`
- **Gate**: type
- acceptance:
  - "Missing content roots, unreadable files and zero discovered templates make the public audit non-ok, not info-only."
  - "Every filesystem path supplied to the plugin is normalised and proven to remain below workspaceRoot."
  - "Path traversal, absolute escapes and symlink-like escape cases fail with a deterministic error."
  - "The audit reports coverage counts separately from findings and exposes nextAction as a publish-blocking condition when coverage is incomplete."
  - "The host tool schema keeps ok false for missing/escape paths while preserving private-content findings."

## external audit follow-up — 2026-11-25

CI/publication findings belong to the publication workstream and are not duplicated here. Runtime-quality work remains: S2/S3 incremental indexes, S4 route splitting, S5 WebGL lifecycle, S6 SCSS structural parser, S7 security/performance gates and S9 fail-closed/path-safe public audit.

- The public audit's old `info` treatment for missing/unreadable coverage is a blocker under S9, not a permissive success.
- `buildNodeFileSystem` must enforce a workspace boundary for every relative operation.
- Nominal lazy routes and GPU resource release remain unfinished despite UI-level evidence.
- Token-budgeted output must be measured in tests, not described only in documentation.

## acceptance

- Architecture reports app/core/domain/pages/shared/styles.
- Feature discovery accepts page and component roles under src/pages.
- Domain parsing uses src/domain/types.interface.ts.
- Missing or renamed paths fail with actionable diagnostics.
- Plugin registration and host configuration match.
- The index records stable path, content digest, owner section and size metadata.
- Unchanged inputs reuse results.
- A changed file invalidates only dependent sections.
- Corruption falls back to a deterministic rebuild.
- Tests prove no stale output after edits.
- Every portfolio tool selects a section or field projection.
- Responses include counts and concise evidence.
- Pagination or truncation metadata is explicit.
- Responses remain within a measured token budget.
- Queries do not reread unchanged full files.
- The shell does not import all page implementations.
- Each route owns a lazy component boundary.
- Direct refresh, SSR and prerender preserve locale and navigation.
- Production chunks prove page isolation.
- Navigation and back-to-top remain correct.
- Destroy cancels animation frames, observers, delayed work and timers.
- GPU resources and event listeners are released exactly once.
- Context loss pauses rendering safely.
- Context restoration rebuilds state safely.
- Repeated route and theme entry shows no duplicate loops or leaked listeners.
- The audit parses imports, use, forward, selectors and custom-property references structurally.
- Diagnostics identify actual owner files and reachable partials.
- Unresolved collisions include line-level evidence.
- Broad regular expressions are not the parser.
- External destinations use safe attributes and HTTPS where required.
- Contact and form failures remain truthful.
- Route focus and reduced motion are tested.
- Horizontal overflow and missing accessible names fail the gate.
- Route chunks obey deterministic budgets.
- WebGL teardown regressions are detected with named evidence.
- Documentation matches the page and component topology.
- The cache/index contract and token budget are documented.
- Runtime lifecycle owners are explicit.
- Stale proposal references are updated or superseded.
- The proposal depends on f00001 publication without duplicating f00002 locale scope.
- Missing content roots, unreadable files and zero discovered templates make the public audit non-ok, not info-only.
- Every filesystem path supplied to the plugin is normalised and proven to remain below workspaceRoot.
- Path traversal, absolute escapes and symlink-like escape cases fail with a deterministic error.
- The audit reports coverage counts separately from findings and exposes nextAction as a publish-blocking condition when coverage is incomplete.
- The host tool schema keeps ok false for missing/escape paths while preserving private-content findings.
