/**
 * Public barrel for `@mcp-vertex/portfolio-content`. Mirrors the
 * `plugins/<name>/src/public/index.ts` shape used by first-party
 * plugins (deps, audit, …): the default export is the loadable
 * plugin; this barrel exposes the engine + types for programmatic
 * reuse by other tools or downstream plugins.
 */
export { default } from '../index';

export {
	buildFsAuditReader,
	runPortfolioAudit,
} from '../lib/services/audit';
export type {
	IPortfolioAuditFinding,
	IPortfolioAuditOptions,
	IPortfolioAuditReader,
	IPortfolioAuditReport,
	IPortfolioAuditSeverityCounts,
	PortfolioAuditSeverity,
	PortfolioAuditFindingId,
} from '../lib/contracts/interfaces/audit.interface';
export {
	buildAuditTool,
	type IBuildAuditToolOptions,
} from '../lib/tools/audit-tool';
export {
	buildCaseStudyBriefs,
	caseStudyBrief,
} from '../lib/services/briefs';
export type {
	IPortfolioCaseStudyBrief,
	IPortfolioCaseStudyBriefRequest,
	IPortfolioCaseStudyBriefResult,
	PortfolioCaseStudyId,
	PortfolioLocale,
} from '../lib/contracts/interfaces/briefs.interface';
export {
	buildBriefTool,
	type IBuildBriefToolOptions,
} from '../lib/tools/briefs-tool';
