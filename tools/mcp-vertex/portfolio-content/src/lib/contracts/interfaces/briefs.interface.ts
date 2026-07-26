/**
 * Case-study brief contracts. The brief is the writer's outline for one
 * non-confidential case study; the values must stay free of employer
 * names, client screenshots, source code, business rules or proprietary
 * data — see the `portfolio-content-public-boundary-*` knowledge entries.
 */

export type PortfolioCaseStudyId =
	| 'mcp-vertex'
	| 'quickmodel'
	| 'keyer'
	| 'print-cv'
	| 'zoneless-calculator'
	| 'nestgpt';

export interface IPortfolioCaseStudyBrief {
	readonly id: PortfolioCaseStudyId;
	readonly title: string;
	readonly focus: string;
	readonly brief: string;
	readonly requiredSections: readonly string[];
}

export type PortfolioLocale = 'en' | 'es';

export interface IPortfolioCaseStudyBriefResult {
	readonly ok: true;
	readonly locale: PortfolioLocale;
	readonly brief: IPortfolioCaseStudyBrief;
}

export interface IPortfolioCaseStudyBriefRequest {
	readonly caseStudy: PortfolioCaseStudyId;
	readonly locale?: PortfolioLocale;
}
