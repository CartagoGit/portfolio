/**
 * `portfolio-content` — project-local delendai plugin for the public
 * portfolio.
 *
 * Every tool derives its answer from the working tree at call time, so
 * adding a page, a layer or a template needs no plugin change. Tools
 * are registered as (`<namespacePrefix>_<id>`), which is
 * what the host verifies on activation.
 *
 * Activation (host `delendai.config.json`):
 *
 *   { "plugins": { "portfolio-content": {
 *       "path": "plugins/portfolio-content/src/index.ts",
 *       "options": {}
 *   } } }
 */

import { definePlugin } from '@delendai/core/public';

import type { IPortfolioContentOptions } from './contracts/interfaces/plugin-options.interface';
import { buildLazyFileSystem } from './lib/services/fs.service';
import { OptionsSchema } from './lib/services/options.service';
import { buildArchitectureTool } from './lib/tools/architecture.tool';
import { buildAuditTool } from './lib/tools/audit.tool';
import { buildDomainTool } from './lib/tools/domain.tool';
import { buildFeaturesTool } from './lib/tools/features.tool';
import { buildScssAuditTool } from './lib/tools/scss-audit.tool';

const KNOWLEDGE_ARCHITECTURE = `# Portfolio architecture

The portfolio is organised in layers: every directory under the source
root (\`src\` by default) is one layer. Pages live under the pages root,
one directory per page, with a \`*.page.ts\` entry and nested
\`*.component.ts\` files. The domain root holds the immutable exported
contracts.

Nothing here is a fixed list: call \`{prefix}_architecture\`,
\`{prefix}_features\` and \`{prefix}_domain\` to read the current shape
from disk.

## Design rules

1. The app layer only composes pages. No page CSS, logic or selectors.
2. Domain exports are immutable (\`readonly\`).
3. A page is a closed unit; reaching into another page's internals is a
   smell. Extract the shared part into a shared layer.
4. Styles that belong to one page live next to that page.
`;

const PUBLIC_BOUNDARY_EN = `# Public portfolio content boundary

The audit tool refuses to allow these patterns through unverified
material:

- **Employer, client or product names** (current and former). Use
  abstract role descriptions instead ("a logistics platform", "a rates
  microservice").

- **Screenshots** of internal tools, dashboards or client data — even
  anonymised. Use illustrative diagrams instead.
- **Source code** from proprietary codebases. Publicly shared snippets
  (open-source repos linked from \`/work\`) are fine.
- **Business rules, internal data or processes**. Describe the
  *outcome*, never the rule or input.
- **Unreplaced \`TODO(image):\` placeholders** in committed HTML. They
  become \`warning\`-severity findings until a real public asset lands.

Every \`*.html\` template under the configured content roots is
discovered at call time and scanned; a new page needs no registration.
Use \`contentIncludeGlobs\` / \`contentExcludeGlobs\` to adjust the set.

The audit tool reports findings with severity (\`error\` / \`warning\` /
\`info\`), file + line location, and a remediation hint. Treat any
\`error\` finding as a publish blocker.
`;

const PUBLIC_BOUNDARY_ES = `# Frontera del contenido público del portafolio

La herramienta de auditoría bloquea estos patrones cuando el material
no está verificado:

- **Nombres de employers, clientes o productos** (actuales o pasados).
  Usa descripciones abstractas del rol ("una plataforma logística",
  "un microservicio de tarifas").

- **Capturas** de herramientas internas, dashboards o datos de
  cliente, incluso anonimizados. Prefiere diagramas ilustrativos.
- **Código fuente** de repos propietarios. Snippets de proyectos
  open-source enlazados desde \`/work\` están permitidos.
- **Reglas de negocio, datos internos o procesos**. Describe el
  *resultado*, nunca la regla o la entrada.
- **Marcadores \`TODO(image):\` sin reemplazar** en HTML committed.
  Aparecen como findings de severidad \`warning\` hasta que llegue un
  asset público real.

Cada plantilla \`*.html\` bajo las raíces de contenido configuradas se
descubre al llamar a la herramienta y se escanea; una página nueva no
requiere registro. Ajusta el conjunto con \`contentIncludeGlobs\` y
\`contentExcludeGlobs\`.

La herramienta de auditoría devuelve findings con severidad (\`error\` /
\`warning\` / \`info\`), archivo + línea, y una pista de remediación.
Trata cualquier \`error\` como bloqueante de publicación. Los
findings per-se llevan el id \`per-se-root\`; los matches de
\`forbiddenTerms\` llevan el id \`private-term\`.
`;

const RUNBOOK = `# Plugin "portfolio-content" runbook

Read-only tools; each one reads the working tree at call time.

1. \`{prefix}_architecture\` — call first: the layers (directories) of
   the source root with sub-layers and file counts.
2. \`{prefix}_features\` — every page directory with its page file and
   nested components. Pass \`pageId\` to narrow to one page.
3. \`{prefix}_domain\` — exported unions, interfaces, types and consts
   of the domain root, parsed from source.
4. \`{prefix}_scss_audit\` — which directories' templates use each
   class selector of a stylesheet.
5. \`{prefix}_public_audit\` — call BEFORE merging a public template
   change. Returns \`{ ok, contentPaths, severity, findings, nextAction }\`
   with \`error\` for forbidden terms and per-se roots and \`warning\` for
   \`TODO(image)\` placeholders. Surface findings verbatim.

## Common failure modes

| Symptom | Likely cause |
|---|---|
| A tool returns nothing for a layer or page | The configured root does not exist; check \`sourceRoot\`, \`pagesRoot\` and \`domainRoot\`. |
| Domain tool returns no contracts | No non-spec \`.ts\` file with exports under \`domainRoot\`. |
| Audit misses a template | It is outside \`contentRoots\`; add a root or an include glob. |
`;

export default definePlugin({
	name: 'portfolio-content',
	version: '0.4.0',
	describe:
		'Portfolio codebase introspection (layers, pages, domain contracts, SCSS ownership) and a public-content audit, all derived from disk at call time. Read-only.',
	optionsSchema: OptionsSchema,
	configExample: {
		summary:
			'Every option is optional. Add `forbiddenTerms` and `perSeRoots` to enable the public-content audit rules.',
		options: {
			forbiddenTerms: ['Example Employer'],
			perSeRoots: ['examplecorp'],
			locale: 'en',
		},
	},
	register(ctx) {
		// The loader already validated `ctx.options` against `OptionsSchema`.
		const o = ctx.options as unknown as IPortfolioContentOptions;
		const lazyFs = buildLazyFileSystem(ctx.workspace.root);
		return {
			tools: [
				buildArchitectureTool({ namespacePrefix: ctx.namespacePrefix, fs: lazyFs, sourceRoot: o.sourceRoot }),
				buildFeaturesTool({ namespacePrefix: ctx.namespacePrefix, fs: lazyFs, pagesRoot: o.pagesRoot }),
				buildDomainTool({ namespacePrefix: ctx.namespacePrefix, fs: lazyFs, domainRoot: o.domainRoot }),
				buildScssAuditTool({
					namespacePrefix: ctx.namespacePrefix,
					fs: lazyFs,
					defaultSourcePath: o.scssAuditSourcePath,
					templateRoots: o.contentRoots,
				}),
				buildAuditTool({ namespacePrefix: ctx.namespacePrefix, fs: lazyFs, options: o }),
			],
			knowledge: [
				{ id: 'portfolio-architecture', title: 'Portfolio architecture', body: KNOWLEDGE_ARCHITECTURE.replaceAll('{prefix}', ctx.namespacePrefix) },
				{ id: 'portfolio-public-boundary-en', title: 'Public portfolio content boundary (English)', body: PUBLIC_BOUNDARY_EN },
				{ id: 'portfolio-public-boundary-es', title: 'Frontera del contenido público (Español)', body: PUBLIC_BOUNDARY_ES },
				{ id: 'portfolio-content-runbook', title: 'Portfolio-content runbook', body: RUNBOOK.replaceAll('{prefix}', ctx.namespacePrefix) },
			],
		};
	},
});
