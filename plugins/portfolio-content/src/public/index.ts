/**
 * Public barrel for `@portfolio/mcp-vertex-portfolio-content`. Mirrors
 * the canonical `plugins/<name>/src/public/index.ts` shape: the
 * default export is the loadable plugin; this barrel exposes the
 * engines + types for programmatic reuse.
 */
export { default } from '../index';

export {
	buildArchitectureMap,
	buildFsFileSystem,
} from '../lib/services/architecture';
export type {
	IBuildArchitectureMapOptions,
	IBuildArchitectureMapRequest,
	IFileSystem,
	IPortfolioArchitectureMap,
	IPortfolioLayer,
	PortfolioLayerId,
} from '../lib/contracts/interfaces/architecture.interface';
export { buildArchitectureTool } from '../lib/tools/architecture-tool';

export {
	buildFeatureMap,
	KNOWN_FEATURES,
} from '../lib/services/features';
export type {
	IBuildFeatureMapRequest,
	IPortfolioFeature,
	IPortfolioFeatureComponent,
	IPortfolioFeatureMap,
	PortfolioFeatureId,
} from '../lib/contracts/interfaces/features.interface';
export { buildFeaturesTool } from '../lib/tools/features-tool';

export {
	buildDomainMap,
	parseDomainSource,
} from '../lib/services/domain';
export type {
	IBuildDomainMapRequest,
	IPortfolioDomainContract,
	IPortfolioDomainMap,
	PortfolioDomainKind,
} from '../lib/contracts/interfaces/domain.interface';
export { buildDomainTool } from '../lib/tools/domain-tool';

export {
	buildFsPublicAuditReader,
	runPublicAudit,
} from '../lib/services/audit';
export type {
	IPublicAuditFinding,
	IPublicAuditOptions,
	IPublicAuditReader,
	IPublicAuditReport,
} from '../lib/services/audit';
export { buildAuditTool } from '../lib/tools/audit-tool';
