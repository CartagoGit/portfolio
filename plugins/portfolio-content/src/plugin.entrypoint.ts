/**
 * `@portfolio/delendai-portfolio-content` — local delendai plugin
 * for the public portfolio.
 *
 * The plugin's job is to **answer questions about the portfolio
 * codebase** so an agent can navigate the project without re-reading
 * every file. Five read-only tools:
 *
 *   - `portfolio_architecture` — returns the canonical layered shape
 *     of `src/` (app / core / domain / pages / shared / styles)
 *     with on-disk subfolders.
 *   - `portfolio_features` — lists every Angular page and component
 *     under `src/pages`, grouped by page.
 *   - `portfolio_domain` — exposes the public domain contracts
 *     (`IPageComponentId`, `ICapabilityId`, …) extracted from
 *     `src/domain/types.interface.ts`.
 *   - `portfolio_scss_audit` — reads a SCSS file and reports every
 *     top-level selector with a suggested owning page. Used to
 *     keep page styles within their intended owner.
 *   - `portfolio_public_audit` — support tool: scans public
 *     templates for forbidden employer/client terms, per-se
 *     forbidden roots (case-insensitive, separator-collapsed),
 *     and image placeholders. Severity-labelled findings.
 *
 * Knowledge entries (bilingual) cover the public-content boundary
 * and a runbook explaining when to call each tool.
 *
 * Activation (host `delendai.config.json`):
 *
 *   {
 *     "plugins": {
 *       "portfolio-content": {
 *         "path": "plugins/portfolio-content/src/plugin.entrypoint.ts",
 *         "options": { ... }
 *       }
 *     }
 *   }
 */

import { z } from 'zod';

import { definePlugin } from '@delendai/core/public';

import { buildArchitectureTool } from './lib/tools/architecture.tool';
import { buildAuditTool } from './lib/tools/audit.tool';
import { buildDomainTool } from './lib/tools/domain.tool';
import { buildFeaturesTool } from './lib/tools/features.tool';
import { buildScssAuditTool } from './lib/tools/scss-audit.tool';

/**
 * Plugin-level options. Every field is optional; missing fields fall
 * back to the canonical defaults so a host with no options block
 * behaves exactly as before.
 */
export const OptionsSchema = z.object({
	/** Public templates the audit tool should scan. */
	contentPaths: z
		.array(z.string().min(1))
		.min(1)
		.default([
			'src/app/page.html',
			'src/pages/contact/contact.page.html',
			'src/pages/docker/docker.page.html',
			'src/pages/demos/demos.page.html',
			'src/pages/approach/approach.page.html',
			'src/pages/work/work.page.html',
			'src/pages/knowledge/knowledge.page.html',
			'src/pages/lab/lab.page.html',
			'src/pages/home/home-intro/home-intro.component.html',
			'src/pages/home/hero-monitor/hero-monitor.component.html',
			'src/pages/home/earth-globe/earth-globe.component.html',
		]),
	/**
	 * Employer/client names the audit refuses to allow through.
	 * Matched as a case-insensitive substring of the template content.
	 */
	forbiddenTerms: z.array(z.string()).default([]),
	/**
	 * Per-se forbidden roots. Any of these roots appearing in the
	 * template (case-insensitive, even when interspersed with `.`, `_`,
	 * `-`, `,` or whitespace) raises an `error`-severity finding with
	 * id `per-se-root`. Use this for names that MUST NEVER reach the
	 * public site under any form.
	 */
	perSeRoots: z.array(z.string().min(1)).default([]),
	/** Bilingual output of the audit's `nextAction` + knowledge entries. */
	locale: z.enum(['en', 'es']).default('en'),
	/**
	 * Default SCSS file the `portfolio_scss_audit` tool reads when the
	 * caller does not pass `sourcePath`. Defaults to the legacy shell
	 * stylesheet so the migration plan against `qs4` keeps the tool
	 * useful without extra wiring.
	 */
	scssAuditSourcePath: z.string().default('src/app/page.scss'),
});

export type PortfolioContentOptions = z.infer<typeof OptionsSchema>;

const KNOWLEDGE_ARCHITECTURE = `# Portfolio architecture

The portfolio follows a strict layered shape under \`src/\`:

| Layer | Path | Responsibility |
|---|---|---|
| \`app\` | \`src/app\` | Bootstrap, providers, routes, page shell. Composes page components. |
| \`core\` | \`src/core\` | Renderer, pure state transitions, explicit browser/platform adapters. |
| \`domain\` | \`src/domain\` | Immutable portfolio contracts and shared static content. |
| \`pages\` | \`src/pages\` | Independently testable public pages and their nested components. |
| \`shared\` | \`src/shared\` | Reusable UI primitives consumed by the shell and pages. |
| \`styles\` | \`src/styles\` | Design tokens, motion and theme primitives. |

Use \`portfolio_architecture\` to inspect the on-disk shape without reading the directory by hand.

## Design rules

1. \`src/app\` only composes public pages and route infrastructure.
2. \`src/core\` owns rendering and explicit platform/browser adapters.
3. \`src/domain\` owns immutable public contracts and static data.
4. \`src/pages/*\` is an independently testable page unit; nested components remain below their owner page.
5. Page-specific code does not move into \`src/shared\` unless it is reused.

## Common failure modes

| Symptom | Likely cause |
|---|---|
| New page is not in the audit | Add the page template to \`contentPaths\`. |
| Page imports another page's internals | Extract a real shared primitive or move the ownership. |
| Shell SCSS keeps growing | Move the page-specific block into its page stylesheet. |
`;

const KNOWLEDGE_FEATURES = `# Portfolio pages

Every public page lives under \`src/pages/<id>/\`. The canonical eight pages are \`home\`, \`work\`, \`approach\`, \`knowledge\`, \`lab\`, \`docker\`, \`demos\` and \`contact\`.

A page normally owns:
- a top-level \`<id>.page.{ts,html,scss,spec.ts}\` entry point;
- nested \`*.component.ts\` files in focused subdirectories;
- page-specific helpers, state and styles below the same page root.

Use \`portfolio_features\` to enumerate both page entry points and nested components without reading the tree by hand.

## Adding a page

1. Create \`src/pages/<id>/<id>.page.{ts,html,scss,spec.ts}\`.
2. Put nested components under \`src/pages/<id>/<owner>/\`.
3. Wire the route in \`src/app/app.routes.ts\`.
4. Append the page id to \`IPageComponentId\` in \`src/domain/types.interface.ts\`.
5. Add the public template to the plugin \`contentPaths\`.
`;

const KNOWLEDGE_DOMAIN = `# Portfolio domain contracts

\`src/domain/types.interface.ts\` is the source of truth for public portfolio contracts.

Important exports include:

- \`IPageComponentId\` — public page identifiers;
- \`ICapabilityId\` — capability buckets rendered by the portfolio;
- \`IHeroPanelId\` / \`ITelemetryId\` — hero-monitor panes and telemetry;
- \`ILocale\` — supported route locales;
- visual unions such as \`IChartType\`, \`IHeroEffect\` and \`IHeroPalette\`.

Use \`portfolio_domain\` to read the contract list directly from that file. Static page or tool knowledge must not become a second source of truth.

## Hard rules

- Domain exports are readonly and mutation-free where applicable.
- \`src/domain/data.constant.ts\` consumes types from \`types.interface.ts\`.
- Pages import public domain types by name and do not reach into unrelated internals.
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

Every public template in \`plugins.portfolio-content.options.contentPaths\`
is scanned. Add a path there whenever a new public page ships.

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

Cada plantilla pública en
\`plugins.portfolio-content.options.contentPaths\` se escanea. Añade una
ruta allí cuando se publique una página nueva.

La herramienta de auditoría devuelve findings con severidad (\`error\` /
\`warning\` / \`info\`), archivo + línea, y una pista de remediación.
Trata cualquier \`error\` como bloqueante de publicación. Los
findings per-se llevan el id \`per-se-root\`; los matches de
\`forbiddenTerms\` llevan el id \`private-term\`.
`;

const RUNBOOK = `# Plugin "portfolio-content" runbook

The plugin exposes five read-only tools. Use them in this order when you need to orient yourself:

## 1. \`portfolio_architecture\`
Returns the current \`app/core/domain/pages/shared/styles\` shape and fails with an actionable diagnostic when a canonical root is missing.

## 2. \`portfolio_features\`
Enumerates \`*.page.ts\` and nested \`*.component.ts\` files below \`src/pages/<id>/\`.

## 3. \`portfolio_domain\`
Reads the canonical contracts from \`src/domain/types.interface.ts\`.

## 4. \`portfolio_scss_audit\`
Analyzes SCSS ownership and structure for the configured source path.

## 5. \`portfolio_public_audit\`
Scans every configured public template before a publishing change.

## Failure semantics

- Missing architecture roots are errors, never false-green empty layers.
- Missing requested pages and missing \`src/pages\` are actionable errors.
- A missing domain source fails instead of silently returning stale contracts.
- Stale \`src/features\` or \`src/domain/portfolio.types.interface.ts\` paths are not fallbacks.
`;

type LoadedOptions = PortfolioContentOptions;

export default definePlugin({
	name: 'portfolio-content',
	version: '0.3.0',
	describe:
		'Portfolio codebase introspection: layered architecture, pages, domain contracts, and public-content audit. Read-only.',
	optionsSchema: OptionsSchema,
	configExample: {
		summary:
			'Default config for the public portfolio host. Drop the whole block into `delendai.config.json` under `plugins.portfolio-content.options`.',
		options: {
			contentPaths: [
				'src/app/page.html',
				'src/pages/contact/contact.page.html',
				'src/pages/work/work.page.html',
			],
			forbiddenTerms: [
				'Beateam',
				'Mazinger',
				'MDM Platform',
				'Gestion de Tarifas',
			],
			locale: 'en',
		},
	},
	register(ctx) {
		// The loader already validated `ctx.options` against
		// `OptionsSchema`; this cast is safe and avoids a redundant parse.
		const o = ctx.options as LoadedOptions;

		return {
			tools: [
				buildArchitectureTool({ namespacePrefix: ctx.namespacePrefix }),
				buildFeaturesTool({ namespacePrefix: ctx.namespacePrefix }),
				buildDomainTool({ namespacePrefix: ctx.namespacePrefix }),
				buildScssAuditTool({
					namespacePrefix: ctx.namespacePrefix,
					defaultSourcePath: o.scssAuditSourcePath,
				}),
				buildAuditTool({
					namespacePrefix: ctx.namespacePrefix,
					contentPaths: o.contentPaths,
					forbiddenTerms: o.forbiddenTerms,
					perSeRoots: o.perSeRoots,
					locale: o.locale,
				}),
			],
			knowledge: [
				{
					id: 'portfolio-architecture',
					title: 'Portfolio architecture',
					body: KNOWLEDGE_ARCHITECTURE,
				},
				{
					id: 'portfolio-features',
					title: 'Portfolio pages',
					body: KNOWLEDGE_FEATURES,
				},
				{
					id: 'portfolio-domain',
					title: 'Portfolio domain contracts',
					body: KNOWLEDGE_DOMAIN,
				},
				{
					id: 'portfolio-public-boundary-en',
					title: 'Public portfolio content boundary (English)',
					body: PUBLIC_BOUNDARY_EN,
				},
				{
					id: 'portfolio-public-boundary-es',
					title: 'Frontera del contenido público (Español)',
					body: PUBLIC_BOUNDARY_ES,
				},
				{
					id: 'portfolio-content-runbook',
					title: 'Portfolio-content runbook',
					body: RUNBOOK,
				},
			],
		};
	},
});

// Public barrel: re-exported engine functions and types so the
// architectural introspection can be reused by other plugins or
// scripts without copying them.
export {
	buildArchitectureMap,
	buildFsFileSystem,
} from './lib/services/architecture.service';
export type {
	IBuildArchitectureMapOptions,
	IBuildArchitectureMapRequest,
	IFileSystem,
	IPortfolioArchitectureMap,
	IPortfolioLayer,
	PortfolioLayerId,
} from './lib/contracts/interfaces/architecture.interface';
export { buildArchitectureTool } from './lib/tools/architecture.tool';

export {
	buildFeatureMap,
	KNOWN_FEATURES,
} from './lib/services/features.service';
export type {
	IBuildFeatureMapRequest,
	IPortfolioFeature,
	IPortfolioFeatureComponent,
	IPortfolioFeatureMap,
	PortfolioFeatureId,
} from './lib/contracts/interfaces/features.interface';
export { buildFeaturesTool } from './lib/tools/features.tool';

export {
	buildDomainMap,
	parseDomainSource,
} from './lib/services/domain.service';
export type {
	IBuildDomainMapRequest,
	IPortfolioDomainContract,
	IPortfolioDomainMap,
	PortfolioDomainKind,
} from './lib/contracts/interfaces/domain.interface';
export { buildDomainTool } from './lib/tools/domain.tool';

export {
	buildFsPublicAuditReader,
	runPublicAudit,
} from './lib/services/audit.service';
export type {
	IPublicAuditFinding,
	IPublicAuditOptions,
	IPublicAuditReader,
	IPublicAuditReport,
} from './lib/services/audit.service';
export { buildAuditTool } from './lib/tools/audit.tool';
