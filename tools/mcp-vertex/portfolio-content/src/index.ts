/**
 * `@portfolio/mcp-vertex-portfolio-content` — local mcp-vertex plugin
 * for the public portfolio.
 *
 * Two read-only tools and three knowledge entries. The plugin follows
 * the canonical mcp-vertex plugin contract:
 *
 *   - `name` is the bare loader id (`portfolio-content`); the host
 *     loader expands it to `@mcp-vertex/portfolio-content` →
 *     `mcp-portfolio-content` → `portfolio-content` per
 *     `resolvePluginSpecifier`. The host config below points at this
 *     file via `path:`, so the specifier chain is skipped — but the
 *     `name` is still the contract surface.
 *   - `optionsSchema` is validated by the loader BEFORE `register()`
 *     runs. We never re-parse it ourselves (the loader already does).
 *   - Every tool declares both `inputSchema` and `outputSchema` and
 *     uses `toolJson` from `@mcp-vertex/core/public` for the
 *     `structuredContent` envelope.
 *   - `configExample` is rendered by the docs site on the
 *     `/plugins/portfolio-content` page so the host can copy/paste it.
 *
 * Activation:
 *
 *   {
 *     "plugins": {
 *       "portfolio-content": {
 *         "path": "tools/mcp-vertex/portfolio-content/src/index.ts",
 *         "options": { ... }
 *       }
 *     }
 *   }
 */

import { z } from 'zod';

import { definePlugin } from '@mcp-vertex/core/public';

import { buildAuditTool } from './lib/tools/audit-tool';
import { buildBriefTool } from './lib/tools/briefs-tool';

/**
 * Plugin-level options. Every field is optional; missing fields fall
 * back to the canonical defaults so a host that ships no options block
 * behaves exactly as before. This is the OCP seam: the plugin's engine
 * stays stable, hosts that need to override paths / terms / language
 * pass typed values through `plugins.portfolio-content.options`.
 */
export const OptionsSchema = z.object({
	/** Workspace-relative templates to audit. Default: every public page. */
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
	/** Employer/client names the audit refuses to allow through. */
	forbiddenTerms: z.array(z.string()).default([]),
	/** Bilingual output: `nextAction` + knowledge entry. */
	locale: z.enum(['en', 'es']).default('en'),
});

export type PortfolioContentOptions = z.infer<typeof OptionsSchema>;

const PUBLIC_BOUNDARY_EN = `# Public portfolio content boundary

The portfolio is a public artifact. The audit tool refuses to allow these
patterns through unverified material:

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

El portafolio es un artefacto público. La herramienta de auditoría bloquea
estos patrones cuando el material no está verificado:

- **Nombres de employers, clientes o productos** (actuales o pasados).
  Usa descripciones abstractas del rol ("una plataforma logística", "un
  microservicio de tarifas").
- **Capturas** de herramientas internas, dashboards o datos de cliente,
  incluso anonimizados. Prefiere diagramas ilustrativos.
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
Trata cualquier \`error\` como bloqueante de publicación.
`;

const RUNBOOK = `# Portfolio-content runbook

Two read-only tools cover everything an agent needs:

## \`portfolio_content_audit\`
Call this *before merging any change to a public template* (or right
after) and gate the publish on \`report.ok === true\`. The tool:

- returns \`{ ok, contentPaths, severity, findings, nextAction }\`
- emits \`error\` for each \`forbiddenTerm\` match
- emits \`warning\` for each \`TODO\(image\): …\` placeholder
- emits \`info\` for missing files / duplicates / IO errors

Surface findings to the user verbatim (the audit emits bilingual
remediation if \`options.locale === 'es'\`); never auto-rewrite them.

## \`portfolio_case_study_brief\`
Call this when starting a new case-study write-up. It returns the
bilingual outline (\`title / focus / brief / requiredSections\`). The
required sections must all show up in the published case study —
nothing more, nothing less.

## Common failure modes

| Symptom | Likely cause |
|---|---|
| Audit returns no findings but the page has old placeholders | Path missing from \`contentPaths\`; add it. |
| Private term keeps reappearing in audit | A new place in the template; update the page, not the term list. |
| Brief is empty | Unknown \`caseStudy\` id; enum is the source of truth. |
`;

/**
 * Loader-parsed options (the loader has already validated against
 * `OptionsSchema`; we type the cast locally so consumers see the
 * narrowed shape).
 */
type LoadedOptions = PortfolioContentOptions;

export default definePlugin({
	name: 'portfolio-content',
	version: '0.2.0',
	describe:
		'Audit public portfolio content (TODO(image), forbidden employer/client terms) and return bilingual case-study writing briefs. Read-only.',
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
		// The loader already validated `ctx.options` against `OptionsSchema`,
		// so this cast is safe. A runtime re-parse would be redundant.
		const o = ctx.options as LoadedOptions;

		return {
			tools: [
				buildAuditTool({
					namespacePrefix: ctx.namespacePrefix,
					contentPaths: o.contentPaths,
					forbiddenTerms: o.forbiddenTerms,
					locale: o.locale,
				}),
				buildBriefTool({
					namespacePrefix: ctx.namespacePrefix,
					defaultLocale: o.locale,
				}),
			],
			knowledge: [
				{
					id: 'portfolio-content-public-boundary-en',
					title: 'Public portfolio content boundary (English)',
					body: PUBLIC_BOUNDARY_EN,
				},
				{
					id: 'portfolio-content-public-boundary-es',
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

// Public barrel: re-exported engine functions and types so the audit
// and brief logic can be reused by other plugins or scripts without
// copying them.
export {
	buildFsAuditReader,
	runPortfolioAudit,
} from './lib/services/audit';
export type {
	IPortfolioAuditFinding,
	IPortfolioAuditOptions,
	IPortfolioAuditReader,
	IPortfolioAuditReport,
	IPortfolioAuditSeverityCounts,
	PortfolioAuditSeverity,
	PortfolioAuditFindingId,
} from './lib/contracts/interfaces/audit.interface';
export { buildAuditTool } from './lib/tools/audit-tool';
export {
	buildCaseStudyBriefs,
	caseStudyBrief,
} from './lib/services/briefs';
export type {
	IPortfolioCaseStudyBrief,
	IPortfolioCaseStudyBriefRequest,
	IPortfolioCaseStudyBriefResult,
	PortfolioCaseStudyId,
	PortfolioLocale,
} from './lib/contracts/interfaces/briefs.interface';
export { buildBriefTool } from './lib/tools/briefs-tool';
