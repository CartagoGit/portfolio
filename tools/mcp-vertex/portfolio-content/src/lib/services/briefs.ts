/**
 * Pure case-study brief factory. Pure (no I/O): every value lives in
 * code so the writer can iterate without round-tripping to a CMS.
 * Bilingual: `locale: 'en' | 'es'` switches the visible strings.
 *
 * The audit-tool wrapper calls `buildCaseStudyBriefs` once per
 * `register()` to produce `{ en, es }` tables, then `caseStudyBrief()`
 * picks the active locale.
 */

import type {
	IPortfolioCaseStudyBrief,
	IPortfolioCaseStudyBriefRequest,
	IPortfolioCaseStudyBriefResult,
	PortfolioCaseStudyId,
	PortfolioLocale,
} from '../contracts/interfaces/briefs.interface';

interface IRawBrief {
	readonly title: string;
	readonly focus: string;
	readonly brief: string;
	readonly requiredSections: readonly string[];
}

const CASE_STUDIES_EN: Readonly<Record<PortfolioCaseStudyId, IRawBrief>> = {
	'mcp-vertex': {
		title: 'MCP Vertex',
		focus: 'TypeScript engineering',
		brief:
			'Explain the plugin-oriented MCP server core through typed contracts, extensibility, documentation and tooling automation.',
		requiredSections: [
			'Context',
			'Architecture',
			'Extensibility',
			'Typed contracts',
			'Testing strategy',
			'Result',
		],
	},
	quickmodel: {
		title: 'QuickModel',
		focus: 'TypeScript architecture',
		brief:
			'Explain data modelling and serialization through explicit contracts, useful type boundaries and a pragmatic developer experience.',
		requiredSections: [
			'Context',
			'Problem',
			'API design',
			'Type safety',
			'Tests',
			'Result',
		],
	},
	keyer: {
		title: 'Keyer',
		focus: 'Developer tooling',
		brief:
			'Explain a CLI and library through its workflow, safe defaults, package distribution and the trade-offs behind its interface.',
		requiredSections: [
			'Context',
			'Workflow',
			'CLI design',
			'Distribution',
			'Testing strategy',
			'Result',
		],
	},
	'print-cv': {
		title: 'Print CV',
		focus: 'Product interface',
		brief:
			'Explain the public interface through information hierarchy, validation, print constraints and end-to-end confidence.',
		requiredSections: [
			'Context',
			'Information design',
			'Validation',
			'Print behaviour',
			'E2E testing',
			'Result',
		],
	},
	'zoneless-calculator': {
		title: 'Zoneless Calculator',
		focus: 'Angular architecture',
		brief:
			'Explain explicit Angular reactivity through signals, standalone components, tests and measured performance decisions.',
		requiredSections: [
			'Context',
			'Architecture',
			'Signals',
			'Testing strategy',
			'Performance',
			'Result',
		],
	},
	nestgpt: {
		title: 'NestGpt',
		focus: 'Backend integration',
		brief:
			'Explain an API integration through clear boundaries, service design and responsible handling of an AI provider dependency.',
		requiredSections: [
			'Context',
			'Architecture',
			'Integration boundary',
			'Failure handling',
			'Testing strategy',
			'Result',
		],
	},
};

const CASE_STUDIES_ES: Readonly<Record<PortfolioCaseStudyId, IRawBrief>> = {
	'mcp-vertex': {
		title: 'MCP Vertex',
		focus: 'Ingeniería TypeScript',
		brief:
			'Explica el núcleo de servidor MCP orientado a plugins mediante contratos tipados, extensibilidad, documentación y automatización de tooling.',
		requiredSections: [
			'Contexto',
			'Arquitectura',
			'Extensibilidad',
			'Contratos tipados',
			'Estrategia de tests',
			'Resultado',
		],
	},
	quickmodel: {
		title: 'QuickModel',
		focus: 'Arquitectura TypeScript',
		brief:
			'Explica el modelado y la serialización de datos mediante contratos explícitos, boundaries de tipos útiles y una experiencia de desarrollo pragmática.',
		requiredSections: [
			'Contexto',
			'Problema',
			'Diseño de API',
			'Type safety',
			'Tests',
			'Resultado',
		],
	},
	keyer: {
		title: 'Keyer',
		focus: 'Tooling para developers',
		brief:
			'Explica un CLI y librería mediante su flujo de trabajo, defaults seguros, distribución del paquete y los trade-offs detrás de su interfaz.',
		requiredSections: [
			'Contexto',
			'Workflow',
			'Diseño del CLI',
			'Distribución',
			'Estrategia de tests',
			'Resultado',
		],
	},
	'print-cv': {
		title: 'Print CV',
		focus: 'Interfaz de producto',
		brief:
			'Explica la interfaz pública mediante jerarquía de información, validación, restricciones de impresión y confianza end-to-end.',
		requiredSections: [
			'Contexto',
			'Diseño de información',
			'Validación',
			'Comportamiento de impresión',
			'Testing E2E',
			'Resultado',
		],
	},
	'zoneless-calculator': {
		title: 'Zoneless Calculator',
		focus: 'Arquitectura Angular',
		brief:
			'Explica la reactividad explícita en Angular mediante signals, standalone components, tests y decisiones de rendimiento medidas.',
		requiredSections: [
			'Contexto',
			'Arquitectura',
			'Signals',
			'Estrategia de tests',
			'Rendimiento',
			'Resultado',
		],
	},
	nestgpt: {
		title: 'NestGpt',
		focus: 'Integración backend',
		brief:
			'Explica una integración con una API mediante boundaries claros, diseño de servicio y manejo responsable de la dependencia con un proveedor de IA.',
		requiredSections: [
			'Contexto',
			'Arquitectura',
			'Límite de integración',
			'Manejo de fallos',
			'Estrategia de tests',
			'Resultado',
		],
	},
};

const TABLES: Readonly<Record<PortfolioLocale, Readonly<Record<PortfolioCaseStudyId, IRawBrief>>>> = {
	en: CASE_STUDIES_EN,
	es: CASE_STUDIES_ES,
};

export const buildCaseStudyBriefs = (): Readonly<
	Record<PortfolioLocale, Readonly<Record<PortfolioCaseStudyId, IPortfolioCaseStudyBrief>>>
> => {
	const rendered = {} as Record<
		PortfolioLocale,
		Record<PortfolioCaseStudyId, IPortfolioCaseStudyBrief>
	>;
	for (const locale of ['en', 'es'] as const) {
		rendered[locale] = {} as Record<PortfolioCaseStudyId, IPortfolioCaseStudyBrief>;
		for (const id of Object.keys(TABLES[locale]) as PortfolioCaseStudyId[]) {
			const raw = TABLES[locale][id];
			rendered[locale][id] = { id, ...raw };
		}
	}
	return rendered;
};

export const caseStudyBrief = (
	tables: Readonly<
		Record<PortfolioLocale, Readonly<Record<PortfolioCaseStudyId, IPortfolioCaseStudyBrief>>>
	>,
	request: IPortfolioCaseStudyBriefRequest,
): IPortfolioCaseStudyBriefResult => {
	const locale: PortfolioLocale = request.locale ?? 'en';
	const brief = tables[locale][request.caseStudy];
	return { ok: true, locale, brief };
};
