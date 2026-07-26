# `@portfolio/mcp-vertex-portfolio-content`

Local mcp-vertex plugin for the public portfolio. Activated by
`mcp-vertex.config.json` under `plugins.portfolio-content`; loaded by the
host script (`tools/scripts/host/host-server.script.ts` in the mcp-vertex
repo) when `bun run mcp:check` runs.

## Tools

| Tool | Input | Output (structuredContent) |
|---|---|---|
| `portfolio_content_audit` | `{ contentPaths?: readonly string[] }` | `{ ok, contentPaths, severity: { errors, warnings, info }, findings[], nextAction }` |
| `portfolio_case_study_brief` | `{ caseStudy: enum, locale?: 'en' \| 'es' }` | `{ ok: true, locale, brief: { id, title, focus, brief, requiredSections } }` |

Both tools are **read-only** — no network effects, no writes.

## Knowledge entries

- `portfolio-content-public-boundary-en` — English-only publication rules
- `portfolio-content-public-boundary-es` — reglas en español
- `portfolio-content-runbook` — when to use each tool

## Layout

```
src/
├── index.ts              ← definePlugin(...) — loadable entry
├── public/index.ts       ← barrel: re-exports engine + types
└── lib/
    ├── contracts/interfaces/{audit,briefs}.interface.ts
    ├── services/{audit,briefs}.ts   ← pure engine (DI via interfaces)
    └── tools/{audit-tool,briefs-tool}.ts ← IToolRegistration builders
tests/
├── helpers/fake-context.ts
└── portfolio-content.spec.ts
```

## Configuration (`mcp-vertex.config.json`)

```jsonc
"plugins": {
  "portfolio-content": {
    "path": "tools/mcp-vertex/portfolio-content/src/index.ts",
    "prefix": "portfolio",
    "options": {
      "contentPaths": [
        "src/features/home/home-intro/home-intro.component.html",
        "..."
      ],
      "forbiddenTerms": ["Beateam", "Mazinger", "MDM Platform", "Gestion de Tarifas"],
      "locale": "en"
    }
  }
}
```

## Run it

```bash
bun run mcp:check                 # host boot
bun run --cwd tools/mcp-vertex/portfolio-content test    # plugin tests
bun run --cwd tools/mcp-vertex/portfolio-content typecheck
```
