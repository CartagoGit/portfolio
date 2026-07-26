# Cartago portfolio

An Angular 22, zoneless and SSR/SSG portfolio for Mario Cabrero Volarich. It presents product-focused frontend work alongside Angular architecture and TypeScript tooling.

## Run locally

```bash
bun install
bun start
```

The public routes are `/en` and `/es`. Build the production SSR output with:

```bash
bun run build
bun run serve:ssr:portfolio
```

## MCP Vertex, local while unpublished

`mcp-vertex.config.json` and `.vscode/mcp.json` use the local checkout at `/home/cartago/_projects/mcp-vertex`. The VS Code host is named `mcp-vertex-local`; change that host command to the published CLI only when the package is released.

`portfolio-content` is the project-local plugin in `tools/mcp-vertex/`. It provides a public-content audit and case-study briefs, and must not receive employer code, screenshots, data or names.

```bash
bun run mcp:check
```

## Content and images

The current imagery is deliberately temporary stock material. Each replacement is marked inline as `TODO(image)` in `src/app/portfolio-page.html`. Do not add employer or client details: professional experience stays anonymous and pattern-focused.
