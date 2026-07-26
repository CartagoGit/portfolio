/**
 * `@portfolio/mcp-vertex-portfolio-content` — local mcp-vertex plugin
 * for the public portfolio.
 *
 * The plugin's job is to **answer questions about the portfolio
 * codebase** so an agent can navigate the project without re-reading
 * every file. Four read-only tools:
 *
 *   - `portfolio_architecture` — returns the canonical layered shape
 *     of `src/` (app / core / domain / features / shared / styles)
 *     with on-disk subfolders.
 *   - `portfolio_features` — lists every Angular component every
 *     feature owns, grouped by feature.
 *   - `portfolio_domain` — exposes the public domain contracts
 *     (`IPortfolioPageId`, `ICapabilityId`, …) extracted from
 *     `src/domain/portfolio.types.ts`.
 *   - `portfolio_public_audit` — support tool: scans public
 *     templates for forbidden employer/client terms, per-se
 *     forbidden roots (case-insensitive, separator-collapsed),
 *     and image placeholders. Severity-labelled findings.
 *
 * Knowledge entries (bilingual) cover the public-content boundary
 * and a runbook explaining when to call each tool.
 *
 * Activation (host `mcp-vertex.config.json`):
 *
 *   {
 *     "plugins": {
 *       "portfolio-content": {
 *         "path": "plugins/portfolio-content/src/index.ts",
 *         "options": { ... }
 *       }
 *     }
 *   }
 */

import { z } from 'zod';

import { definePlugin } from '@mcp-vertex/core/public';

import { buildArchitectureTool } from './lib/tools/architecture-tool';
import { buildAuditTool } from './lib/tools/audit-tool';
import { buildDomainTool } from './lib/tools/domain-tool';
import { buildFeaturesTool } from './lib/tools/features-tool';

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
			'src/app/portfolio-page.html',
			'src/features/contact/contact-page.component.html',
			'src/features/docker/docker-page.component.html',
			'src/features/demos/demos-page.component.html',
			'src/features/approach/approach-page.component.html',
			'src/features/work/work-page.component.html',
			'src/features/knowledge/knowledge-page.component.html',
			'src/features/lab/lab-page.component.html',
			'src/features/home/home-intro/home-intro.component.html',
			'src/features/home/hero-monitor/hero-monitor.component.html',
			'src/features/home/earth-globe/earth-globe.component.html',
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
});

export type PortfolioContentOptions = z.infer<typeof OptionsSchema>;

const KNOWLEDGE_ARCHITECTURE = `# Portfolio architecture

The portfolio follows a strict layered shape under \`src/\`:

| Layer | Path | Responsibility |
|---|---|---|
| \`app\` | \`src/app\` | Bootstrap, providers, routes, page shell. Composes feature components. |
| \`core\` | \`src/core\` | Renderer, pure state transitions, explicit browser/platform adapters. |
| \`domain\` | \`src/domain\` | Immutable portfolio contracts and bilingual copy/static content. |
| \`features\` | \`src/features\` | Independently testable public pages. Each owns its template, styles, tests, and state. |
| \`shared\` | \`src/shared\` | Reusable UI primitives consumed by the shell and features. |
| \`styles\` | \`src/styles\` | Design tokens, motion, theme primitives. Feature styles own their blocks. |

Use the \`portfolio_architecture\` tool to inspect the on-disk shape
without re-reading the directory by hand.

## Design rules

1. \`src/app\` only composes feature components. No feature CSS, no
   feature logic, no feature selectors.
2. \`src/core\` adapters are pure and side-effect-free except for
   explicit browser adapters (e.g. WebGL, signal-event hookups).
3. \`src/domain\` is immutable: every export is \`readonly\`.
4. \`src/features/*\` is independently testable. A feature is a
   closed unit; reaching into another feature's internals is a smell.
5. \`src/shared\` is reusable. Anything feature-specific belongs in
   the feature.

## Common failure modes

| Symptom | Likely cause |
|---|---|
| New page is not in the audit | Add the page to \`plugins.portfolio-content.options.contentPaths\`. |
| Feature imports another feature's component | Extract the shared part into \`src/shared\`. |
| Shell SCSS keeps growing | A feature selector leaked. Move the block into the feature's own \`.component.scss\`. |
`;

const KNOWLEDGE_FEATURES = `# Portfolio features

Every public page lives under \`src/features/<id>/\`. The canonical
eight features are:

| Feature | Route | Owner |
|---|---|---|
| \`home\` | \`/:locale\` | intro + hero monitor + earth globe |
| \`work\` | \`/:locale/work\` | pinned projects |
| \`approach\` | \`/:locale/approach\` | engineering philosophy |
| \`knowledge\` | \`/:locale/knowledge\` | capability grid + lab playground |
| \`lab\` | \`/:locale/lab\` | interactive playground |
| \`docker\` | \`/:locale/docker\` | containerised projects |
| \`demos\` | \`/:locale/demos\` | live demos |
| \`contact\` | \`/:locale/contact\` | contact form + links |

Use the \`portfolio_features\` tool to enumerate every component the
feature owns (top-level page + sub-feature folders). The tool groups
them by feature so you can answer "what's in the home feature?"
without reading the disk.

## Adding a new feature

1. Create \`src/features/<id>/<id>-page.component.{ts,html,scss,spec.ts}\`.
2. If the feature needs sub-components, put them under
   \`src/features/<id>/<sub-feature>/\`.
3. Wire the route in \`src/app/app.routes.ts\` under the canonical
   \`:locale/<id>\` segment.
4. Append the feature to \`IPortfolioPageId\` in
   \`src/domain/portfolio.types.ts\`.
5. Add the new page's template to the audit's \`contentPaths\`.
`;

const KNOWLEDGE_DOMAIN = `# Portfolio domain contracts

The \`src/domain/\` folder is the single source of truth for the
public portfolio's contracts. The most important exports are:

- \`IPortfolioPageId\` — the union of every public route token.
  Adding a new feature means appending a new id here.
- \`ICapabilityId\` — the six capability buckets the \`/knowledge\`
  page renders.
- \`IHeroPanelId\` / \`ITelemetryId\` — telemetry panes surfaced by the
  home hero monitor.
- \`ILocale\` — the two locales the portfolio ships (\`en\` + \`es\`).
- \`IChartType\` / \`IHeroEffect\` / \`IHeroPalette\` — the visual
  variants the hero monitor accepts.

Use the \`portfolio_domain\` tool to read the canonical contract list
directly from the source. Treat the tool's output as the source of
truth — if the source drifts, the tool drifts with it.

## Hard rules

- Every export in \`src/domain/\` is \`readonly\`. No mutating
  helpers, no class state.
- \`portfolio.data.ts\` exposes the static content (copy, panels,
  telemetry). It imports from \`portfolio.types.ts\` and never the
  other way around.
- Features import domain types by name; they MUST NOT reach into
  internal data structures.
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

The plugin exposes four read-only tools. Use them in this order when
you (an agent) need to orient yourself:

## 1. \`portfolio_architecture\`
Call this first. It returns the six layers of \`src/\` with the
on-disk subfolders. Use it to answer "where does X live?" without
reading the directory by hand.

## 2. \`portfolio_features\`
Call this to enumerate every Angular component the features own.
Combines with \`portfolio_architecture\` to find the file path of a
specific component.

## 3. \`portfolio_domain\`
Call this when you need to know the canonical contract surface
(\`IPortfolioPageId\`, \`ICapabilityId\`, …). The tool reads the source
directly so the output is always in sync with the code.

## 4. \`portfolio_public_audit\`
Call this BEFORE merging any change to a public template. The tool:

- returns \`{ ok, contentPaths, severity, findings, nextAction }\`
- emits \`error\` (\`id: private-term\`) for each \`forbiddenTerms\`
  match
- emits \`warning\` for each \`TODO\(image\): …\` placeholder
- emits \`info\` for missing files / duplicates / IO errors

Surface findings to the user verbatim (the audit emits bilingual
remediation if \`options.locale === 'es'\`); never auto-rewrite them.

## Common failure modes

| Symptom | Likely cause |
|---|---|
| Architecture tool returns an empty layer | The path doesn't exist on disk; check \`src/<layer>\`. |
| Feature tool returns no components | The feature has no \`*.component.ts\` files yet. |
| Domain tool returns empty contracts | \`src/domain/portfolio.types.ts\` is missing or syntax-changed. |
| Audit returns no findings but the page has placeholders | Path missing from \`contentPaths\`; add it. |
`;

type LoadedOptions = PortfolioContentOptions;

export default definePlugin({
	name: 'portfolio-content',
	version: '0.3.0',
	describe:
		'Portfolio codebase introspection: layered architecture, features, domain contracts, and public-content audit. Read-only.',
	optionsSchema: OptionsSchema,
	configExample: {
		summary:
			'Default config for the public portfolio host. Drop the whole block into `mcp-vertex.config.json` under `plugins.portfolio-content.options`.',
		options: {
			contentPaths: [
				'src/app/portfolio-page.html',
				'src/features/contact/contact-page.component.html',
				'src/features/work/work-page.component.html',
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
				buildAuditTool({
					namespacePrefix: ctx.namespacePrefix,
					contentPaths: o.contentPaths,
					forbiddenTerms: o.forbiddenTerms,
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
					title: 'Portfolio features',
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
} from './lib/services/architecture';
export type {
	IBuildArchitectureMapOptions,
	IBuildArchitectureMapRequest,
	IFileSystem,
	IPortfolioArchitectureMap,
	IPortfolioLayer,
	PortfolioLayerId,
} from './lib/contracts/interfaces/architecture.interface';
export { buildArchitectureTool } from './lib/tools/architecture-tool';

export {
	buildFeatureMap,
	KNOWN_FEATURES,
} from './lib/services/features';
export type {
	IBuildFeatureMapRequest,
	IPortfolioFeature,
	IPortfolioFeatureComponent,
	IPortfolioFeatureMap,
	PortfolioFeatureId,
} from './lib/contracts/interfaces/features.interface';
export { buildFeaturesTool } from './lib/tools/features-tool';

export {
	buildDomainMap,
	parseDomainSource,
} from './lib/services/domain';
export type {
	IBuildDomainMapRequest,
	IPortfolioDomainContract,
	IPortfolioDomainMap,
	PortfolioDomainKind,
} from './lib/contracts/interfaces/domain.interface';
export { buildDomainTool } from './lib/tools/domain-tool';

export {
	buildFsPublicAuditReader,
	runPublicAudit,
} from './lib/services/audit';
export type {
	IPublicAuditFinding,
	IPublicAuditOptions,
	IPublicAuditReader,
	IPublicAuditReport,
} from './lib/services/audit';
export { buildAuditTool } from './lib/tools/audit-tool';
