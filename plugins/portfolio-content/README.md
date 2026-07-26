# `@portfolio/mcp-vertex-portfolio-content`

Local mcp-vertex plugin for the public portfolio. Loads at the
canonical `plugins/portfolio-content/` path (the workspace has only
this one plugin, kept local on purpose).

## Tools

| Tool | What it adds |
|---|---|
| `portfolio_architecture` | Returns the layered shape of `src/` (app / core / domain / features / shared / styles) with the on-disk subfolders. |
| `portfolio_features` | Lists every Angular component the features own, grouped by feature. |
| `portfolio_domain` | Surfaces the public domain contracts (`PortfolioPageId`, `CapabilityId`, …) extracted from `src/domain/portfolio.types.ts`. |
| `portfolio_public_audit` | Support tool: scans public templates for forbidden employer/client terms, **per-se forbidden roots** (case-insensitive, separator-collapsed), and `TODO(image)` placeholders. Severity-labelled. |

All tools are **read-only** — no writes, no network.

### Audit finding IDs

| `id` | Severity | Source |
| --- | --- | --- |
| `per-se-root` | `error` | A root in `perSeRoots` appeared in the template. Publish blocker. |
| `private-term` | `error` | A term in `forbiddenTerms` appeared in the template. Publish blocker. |
| `image-todo` | `warning` | `TODO(image): …` placeholder is still in the committed HTML. |
| `duplicated-content` / `missing-content` / `unreadable-content` | `info` | Configuration / I/O diagnostics. |

## Per-se forbidden roots

The audit runs a second pass over the configured `perSeRoots`. A root is matched case-insensitively with separators (`_ . - , /` whitespace) collapsed, so `beateam`, `Beateam`, `BEATEAM-dev`, `beateam.dev`, `bea team`, and `BeateamSpain` all trigger the same `per-se-root` finding. The host config keeps this short and surgical:

```jsonc
"perSeRoots": ["beateam"]
```

Adding a new root is one config line. Removing a root is a breaking editorial change and must be justified in a written proposal.

## Knowledge entries

- `portfolio-architecture` — layered shape + design rules.
- `portfolio-features` — feature catalogue + adding a new feature.
- `portfolio-domain` — contract surface + hard rules.
- `portfolio-public-boundary-en` / `portfolio-public-boundary-es` — publication rules.
- `portfolio-content-runbook` — when to call each tool.

## Layout

```
plugins/portfolio-content/
├── README.md
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── src/
│   ├── index.ts              ← definePlugin(...) — loadable entry
│   ├── public/index.ts       ← barrel: re-exports engines + types
│   └── lib/
│       ├── contracts/interfaces/{architecture,features,domain}.interface.ts
│       ├── services/{architecture,features,domain,audit}.ts ← pure engines
│       └── tools/{architecture-tool,features-tool,domain-tool,audit-tool}.ts
└── tests/
    ├── helpers/{fake-context,in-memory-fs}.ts
    └── portfolio-content.spec.ts
```

## Configuration (`mcp-vertex.config.json`)

```jsonc
"plugins": {
  "portfolio-content": {
    "path": "plugins/portfolio-content/src/index.ts",
    "prefix": "portfolio",
    "options": {
      "contentPaths": [
        "src/app/portfolio-page.html",
        "src/features/contact/contact-page.component.html",
        "src/features/work/work-page.component.html"
      ],
      "forbiddenTerms": [
        "Beateam",
        "Beateamer",
        "Beateams",
        "Beateam Group",
        "Beateam Spain",
        "Beateam App",
        "BeateamApp",
        "BeateamGroup",
        "BeateamSpain",
        "beateam.es",
        "beateam.io",
        "beateam.com",
        "Mazinger",
        "MDM Platform",
        "Gestion de Tarifas"
      ],
      "perSeRoots": ["beateam"],
      "locale": "en"
    }
  }
}
```

## Run it

```bash
bun run mcp:check                 # host boot
bun run mcp:test                  # plugin tests
bun run mcp:typecheck             # plugin typecheck
bun run mcp:all                   # all three gated
```
