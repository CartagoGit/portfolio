/**
 * Public barrel for `portfolio-content`: the default export is the
 * loadable plugin; the rest exposes engines and types for reuse.
 */
export { default } from '../index';

export { OptionsSchema } from '../lib/services/options.service';
export { buildArchitectureMap } from '../lib/services/architecture.service';
export { buildPageMap } from '../lib/services/pages.service';
export { buildDomainMap, parseDomainSource } from '../lib/services/domain.service';
export { discoverContentPaths } from '../lib/services/content.service';
export { runPublicAudit } from '../lib/services/audit.service';
export { runScssAudit } from '../lib/services/scss-audit.service';
export { buildLazyFileSystem, buildNodeFileSystem } from '../lib/services/fs.service';
export { globToRegExp, matchesAnyGlob } from '../lib/services/glob.service';

export { buildArchitectureTool } from '../lib/tools/architecture.tool';
export { buildFeaturesTool } from '../lib/tools/features.tool';
export { buildDomainTool } from '../lib/tools/domain.tool';
export { buildScssAuditTool } from '../lib/tools/scss-audit.tool';
export { buildAuditTool } from '../lib/tools/audit.tool';

export type { IFileSystem } from '../contracts/interfaces/fs.interface';
export type { IPortfolioContentOptions } from '../contracts/interfaces/plugin-options.interface';
