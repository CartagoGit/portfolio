# Portfolio deployment

## Pipeline order

The workflow in `.github/workflows/portfolio-pages.yml` has four dependent jobs:

1. `preparation` — locked Bun install, filename convention, DelendAI configuration/content and local plugin contract.
2. `tests` — strict lint, app/E2E TypeScript, 106+ Angular unit/integration tests and Playwright browser regressions.
3. `build` — production browser + SSR output and a named artifact containing `dist/portfolio`.
4. `deploy` — publishes only `dist/portfolio/browser` to `CartagoGit/CartagoGit.github.io` after every previous job passes.

Pull requests run through `build` but never deploy. Pushes to `develop` or `main`, and manual dispatches, can reach `deploy`.

## Required secret

Create a fine-grained GitHub personal access token with **Contents: read and write** access to `CartagoGit/CartagoGit.github.io`. Store it in this repository as the Actions secret:

- name: `PAGES_DEPLOY_TOKEN`
- scope: `CartagoGit/CartagoGit.github.io`
- permission: repository contents — read/write

The token is never written to this repository, a workflow file or browser output. If it is missing, the deploy job emits an actionable error before downloading or publishing an artifact.

## Local reproduction

```bash
bun install --frozen-lockfile
bun run ci:prepare
bun run ci:test
bun run ci:build
```

`ci:test` starts its own Angular server through Playwright. The production browser tree is `dist/portfolio/browser`; the Node/SSR tree remains `dist/portfolio/server` for server verification and diagnostics.

## Target repository

The external destination is the `main` branch of `CartagoGit/CartagoGit.github.io`. The action publishes at the repository root, disables Jekyll and creates `.nojekyll` in the browser artifact. The portfolio therefore deploys at `https://cartagogit.github.io/` without a subpath/base-href rewrite.

## Failure policy

A failure in any of preparation, tests or build stops the later jobs. Deployment cannot run from a pull request, and the external Pages repository is never updated from an unvalidated browser tree. A failed provider upload leaves the previous Pages revision intact unless the provider reports the opposite in its job log.
