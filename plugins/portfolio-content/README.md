# `@portfolio/delendai-portfolio-content`

Local DelendAI plugin for the public portfolio. Plugin id
`portfolio-content`, tool prefix `portfolio`. Every tool reads the
working tree at call time: no page, layer or label list is hardcoded,
so adding a page or a layer needs no plugin change.

## Tools

Served as `<core prefix>_<plugin prefix>_<id>`, for example
`delendai_portfolio_architecture`.

| Id | What it reports |
|---|---|
| `architecture` | Every directory under `sourceRoot` as a layer, with sub-layers and file counts. |
| `features` | Every directory under `pagesRoot` with its `*.page.ts` and nested `*.component.ts`. |
| `domain` | Exported unions, interfaces, types and consts parsed from `domainRoot`. |
| `scss_audit` | Structural SCSS dependencies, custom properties and template ownership. |
| `public_audit` | Forbidden terms, per-se roots, placeholders and fail-closed coverage diagnostics. |
| `query` | Section query with field projection, pagination, measured token budget and metadata cache reuse. |

All tools are read-only: no writes, no network. The Node file-system adapter rejects absolute paths, `..` traversal and symlink escapes outside the workspace root.

### Incremental index

`ContentIndexService` records path, SHA-256 digest, owner section, byte size and mtime. A section query reuses unchanged entries by metadata and rebuilds deterministically after a changed or corrupt snapshot. Changed files invalidate only their recorded owner.

### Audit finding IDs

| `id` | Severity | Source |
| --- | --- | --- |
| `per-se-root` | `error` | A root in `perSeRoots` appeared (case-insensitive, separators collapsed). |
| `private-term` | `error` | A term in `forbiddenTerms` appeared. |
| `image-todo` | `warning` | A `TODO(image): ...` placeholder is still committed. |
| `coverage-empty` / `missing-content` / `unreadable-content` | `error` | Publish-blocking incomplete coverage. |
| `duplicated-content` | `info` | Duplicate input path. |

## Options

Every option has a default, so an empty `options` block works. The
`optionsSchema` is required for project-local plugins.

| Option | Default | Meaning |
|---|---|---|
| `sourceRoot` | `src` | Its sub-directories are the layers. |
| `pagesRoot` | `src/pages` | Its sub-directories are the pages. |
| `domainRoot` | `src/domain` | Where domain contracts are parsed from. |
| `contentRoots` | `["src/app", "src/pages"]` | Scanned recursively for `*.html`. |
| `contentIncludeGlobs` / `contentExcludeGlobs` | `[]` | Add or remove audited templates. |
| `forbiddenTerms` | `[]` | Case-insensitive substrings. |
| `perSeRoots` | `[]` | Roots banned in any form. |
| `locale` | `en` | `en` or `es` remediation text. |
| `scssAuditSourcePath` | `src/app/page.scss` | Default stylesheet of `scss_audit`. |

## Knowledge entries

`portfolio-architecture`, `portfolio-public-boundary-en`,
`portfolio-public-boundary-es` and `portfolio-content-runbook`.

## Layout

```
plugins/portfolio-content/
├── README.md
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── src/
│   ├── index.ts                  <- definePlugin(...)
│   ├── public/index.ts           <- barrel
│   ├── contracts/interfaces/*.interface.ts
│   └── lib/{services,tools}/
└── tests/
    ├── helpers/
    └── src/lib/*.spec.ts
```

## Configuration (`delendai.config.json`)

```jsonc
"portfolio-content": {
  "path": "plugins/portfolio-content/src/index.ts",
  "prefix": "portfolio",
  "options": {
    "forbiddenTerms": ["..."],
    "perSeRoots": ["..."],
    "locale": "en"
  }
}
```

## Develop

`bun run mcp:test`, `bun run mcp:typecheck` and `bun run mcp:check` from
the repo root. `@delendai/core/public` resolves through
`node_modules/@delendai/core`, which `bun install` links to the machine's
stable DelendAI (`bun run mcp:link`; `DELENDAI_PATH` picks another install).

### Projection and token budget

Every tool accepts the shared `fields`, `filter`, `offset`, `limit` and
`tokenBudget` inputs. `tokenBudget` defaults to 1200 and is bounded to
128–4096 tokens. `compactProjection` estimates each candidate against the
complete output envelope—items plus `count`, `total`, `offset`,
`truncated` and `nextOffset`—before appending another item, so the emitted
`tokenEstimate` cannot exceed the requested budget because metadata was
omitted from the loop. When one projected item is too large, the response
uses a concise `__truncated` placeholder with the original keys instead
of silently returning unrelated evidence.
