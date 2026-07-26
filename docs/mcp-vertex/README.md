# MCP Vertex for this portfolio

The workspace uses the local checkout at `/home/cartago/_projects/mcp-vertex` while the package is unpublished. The alias is `mcp-vertex-local` in `.vscode/mcp.json`; when MCP Vertex is published, replace only that host command with the published CLI invocation.

The selected plugins are deliberately narrow:

- `proposals` coordinates scoped pieces of portfolio work.
- `memory`, `git`, `search`, `quality` and `docs` help agents retain context and verify changes.
- `portfolio-content` is this workspace's local plugin. It audits public-content boundaries and lists image placeholders, without reading any external or employer workspace.

Run `bun run mcp:check` to validate the local host and configured plugin surface.
