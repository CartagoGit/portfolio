/**
 * `portfolio-content` mcp-vertex local plugin.
 *
 * Two pure tools and three knowledge entries — the canonical
 * "host-local plugin" shape used by other mcp-vertex hosts (see
 * `docs/mcp-vertex/examples/custom-plugin/` for the minimal
 * single-file contract, and `plugins/deps/` for the layered shape).
 *
 * Tools:
 *   - `portfolio_content_audit`    — scan public templates for
 *                                    `TODO(image)` placeholders and
 *                                    forbidden employer/client terms.
 *                                    Pure read; no writes, no network.
 *   - `portfolio_case_study_brief` — return the bilingual writing
 *                                    brief for one featured case study.
 *                                    Pure (no I/O).
 *
 * Knowledge entries (bilingual):
 *   - `portfolio-content-public-boundary-en`
 *   - `portfolio-content-public-boundary-es`
 *   - `portfolio-content-runbook`
 *
 * Options are surfaced via `mcp-vertex.config.json` under
 * `plugins.portfolio-content.options`:
 *
 *   {
 *     "contentPaths": ["src/app/portfolio-page.html", ...],
 *     "forbiddenTerms": ["Beateam", "Mazinger", ...],
 *     "locale": "en" | "es"
 *   }
 */

import { z } from 'zod';

import { definePlugin } from '@mcp-vertex/core/public';

import { buildAuditTool } from './lib/tools/audit-tool';
import { buildBriefTool } from './lib/tools/briefs-tool';
import type { PortfolioLocale } from './lib/contracts/interfaces/briefs.interface';

export const OptionsSchema = z.object({
	contentPaths: z.array(z.string()).min(1).default([
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
	forbiddenTerms: z.array(z.string()).default([]),
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
- **Marcadores \`TODO(image):\` sin reemplazar** en HTML en
  committed. Aparecen como findings de severidad \`warning\` hasta que
  llegue un asset público real.

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

- returns \`{ ok, severity, findings, nextAction }\`
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

export default definePlugin({
	name: 'portfolio-content',
	version: '0.2.0',
	describe:
		'Audit public portfolio content (TODO(image), forbidden employer/client terms) and return bilingual case-study writing briefs. Read-only.',
	optionsSchema: OptionsSchema,
	register(ctx) {
		const parsed = OptionsSchema.safeParse(ctx.options ?? {});
		if (!parsed.success) {
			throw new Error(
				`portfolio-content plugin rejected its options: ${parsed.error.message}`,
			);
		}
		const o = parsed.data;
		const locale: PortfolioLocale = o.locale;

		return {
			tools: [
				buildAuditTool({
					namespacePrefix: ctx.namespacePrefix,
					contentPaths: o.contentPaths,
					forbiddenTerms: o.forbiddenTerms,
					locale,
				}),
				buildBriefTool({
					namespacePrefix: ctx.namespacePrefix,
					defaultLocale: locale,
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

// Public barrel: re-exported types and engine functions so other
// plugins can reuse the audit / brief logic without copying it.
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
export {
	buildAuditTool,
} from './lib/tools/audit-tool';
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
export {
	buildBriefTool,
} from './lib/tools/briefs-tool';
