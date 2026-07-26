/**
 * `portfolio_case_study_brief` tool. Pure registration builder —
 * `buildCaseStudyBriefs()` runs once at `register()` time, then
 * `caseStudyBrief()` is a fast lookup.
 */

import { z } from 'zod';

import { toolJson, type IToolRegistration } from '@mcp-vertex/core/public';

import {
	buildCaseStudyBriefs,
	caseStudyBrief,
} from '../services/briefs';
import type {
	PortfolioCaseStudyId,
} from '../contracts/interfaces/briefs.interface';

export interface IBuildBriefToolOptions {
	readonly namespacePrefix: string;
	readonly defaultLocale: 'en' | 'es';
}

const BRIEF = z.object({
	id: z.string(),
	title: z.string(),
	focus: z.string(),
	brief: z.string(),
	requiredSections: z.array(z.string()),
});

const OUTPUT = z.object({
	ok: z.literal(true),
	locale: z.enum(['en', 'es']),
	brief: BRIEF,
});

export const buildBriefTool = (
	options: IBuildBriefToolOptions,
): IToolRegistration => {
	const tables = buildCaseStudyBriefs();
	return {
		id: 'portfolio_case_study_brief',
		summary:
			'Return the public, non-confidential narrative structure for one featured portfolio case study.',
		tags: ['portfolio', 'brief'],
		register: async (server) => {
			server.registerTool(
				`${options.namespacePrefix}_case_study_brief`,
				{
					description:
						'Fetch the bilingual writing brief for a featured portfolio case study. The brief lists the public-friendly sections the writer must cover without leaking employer names, screenshots, source code, business rules or data.',
					inputSchema: z.object({
						caseStudy: z.enum([
							'mcp-vertex',
							'quickmodel',
							'keyer',
							'print-cv',
							'zoneless-calculator',
							'nestgpt',
						] satisfies readonly PortfolioCaseStudyId[]),
						locale: z.enum(['en', 'es']).optional(),
					}),
					outputSchema: OUTPUT,
				},
				async (args: {
					caseStudy: PortfolioCaseStudyId;
					locale?: 'en' | 'es';
				}) => {
					const result = caseStudyBrief(tables, {
						caseStudy: args.caseStudy,
						...(args.locale ? { locale: args.locale } : {}),
					});
					return toolJson(result);
				},
			);
		},
	};
};
