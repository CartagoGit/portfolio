---
id: i00002
title: "Portfolio Pages publication to CartagoGit.github.io"
kind: infra
status: ready
type: proposal
track: portfolio-publication
date: 2026-11-23
---

# i00002 — Portfolio Pages publication to CartagoGit.github.io

## goal

Publish the validated Angular browser artifact to CartagoGit.github.io through a four-stage gated GitHub Actions pipeline.

## why

Publication is an independent delivery concern and must not block product completion or locale work. The repository is available as CartagoGit/CartagoGit.github.io, so the pipeline should verify, build and publish it directly after explicit gates.

## non-goals

- Changing the portfolio product design or copy.
- Owning locale expansion, interactions or visual corrections.
- Publishing SSR server code to GitHub Pages; Pages receives only browser output.

## slices

- global_gate: e2e

### S1 — Portable preparation and locked dependency install
- **Status**: pending
- **Files**: `package.json`, `bun.lock`, `tools/check-file-naming.script.ts`, `tsconfig.tools.json`
- **Gate**: type
- acceptance:
  - "Frozen install succeeds in GitHub Actions without machine-specific paths."
  - "Preparation validates naming, configuration, assets and lockfile consistency."
  - "Missing or invalid dependencies fail with actionable evidence."

### S2 — Gated workflow, production artifact and publication
- **Status**: pending
- **Files**: `.github/workflows/portfolio-pages.yml`, `README.md`, `docs/deployment.md`, `angular.json`
- **Gate**: e2e
- acceptance:
  - "Jobs execute in order preparation, tests, build, deploy."
  - "Tests cover lint, typecheck, unit and browser regression gates."
  - "Build emits browser and SSR artifacts, with only browser output deployed."
  - "Deployment targets CartagoGit.github.io main through PAGES_DEPLOY_TOKEN."
  - "A missing credential fails before publication with an actionable message."
  - "The public URL and root assets are verified after deployment."

## acceptance

- Frozen install succeeds in GitHub Actions without machine-specific paths.
- Preparation validates naming, configuration, assets and lockfile consistency.
- Missing or invalid dependencies fail with actionable evidence.
- Jobs execute in order preparation, tests, build, deploy.
- Tests cover lint, typecheck, unit and browser regression gates.
- Build emits browser and SSR artifacts, with only browser output deployed.
- Deployment targets CartagoGit.github.io main through PAGES_DEPLOY_TOKEN.
- A missing credential fails before publication with an actionable message.
- The public URL and root assets are verified after deployment.
