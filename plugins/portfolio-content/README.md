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
| `scss_audit` | Which directories' templates use each class selector of a stylesheet. |
| `public_audit` | Forbidden terms, per-se roots and `TODO(image)` placeholders in every discovered `*.html`. |

All tools are read-only: no writes, no network.

### Audit finding IDs

| `id` | Severity | Source |
| --- | --- | --- |
| `per-se-root` | `error` | A root in `perSeRoots` appeared (case-insensitive, separators collapsed). |
| `private-term` | `error` | A term in `forbiddenTerms` appeared. |
| `image-todo` | `warning` | A `TODO(image): ...` placeholder is still committed. |
| `duplicated-content` / `missing-content` / `unreadable-content` | `info` | I/O diagnostics. |

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
the repo root. `@delendai/core/public` resolves through the gitignored
`.cache/delendai-runtime` link (`bun run mcp:link`, or `DELENDAI_PATH`).
