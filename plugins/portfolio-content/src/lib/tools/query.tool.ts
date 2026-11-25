import { z } from 'zod';
import { toolJson, type IToolRegistration } from '@delendai/core/public';
import type { IFileSystem } from '../../contracts/interfaces/fs.interface';
import type { IPortfolioContentOptions } from '../../contracts/interfaces/plugin-options.interface';
import { compactProjection } from '../helpers/projection.helper';
import { ContentIndexService } from '../services/content-index.service';
import { buildArchitectureMap } from '../services/architecture.service';
import { runPublicAudit } from '../services/audit.service';
import { discoverContentPaths } from '../services/content.service';
import { buildDomainMap } from '../services/domain.service';
import { walkFiles } from '../services/fs.service';
import { buildPageMap } from '../services/pages.service';
import { runScssAudit } from '../services/scss-audit.service';

export const QUERY_TOOL_ID = 'query';
type ISection = 'architecture' | 'features' | 'domain' | 'scss' | 'audit';
type ISectionResult = readonly Record<string, unknown>[];

export interface IBuildQueryToolOptions {
	readonly namespacePrefix: string;
	readonly fs: IFileSystem;
	readonly options: IPortfolioContentOptions;
}

const SECTION_PATHS = async (fs: IFileSystem, options: IPortfolioContentOptions, section: ISection): Promise<readonly string[]> => {
	switch (section) {
		case 'architecture': return walkFiles(fs, options.sourceRoot);
		case 'features': return walkFiles(fs, options.pagesRoot);
		case 'domain': return walkFiles(fs, options.domainRoot);
		case 'scss': return [
			options.scssAuditSourcePath,
			...(await Promise.all(options.contentRoots.map((root) => walkFiles(fs, root)))).flat(),
		];
		case 'audit': return discoverContentPaths({ fs, roots: options.contentRoots, includeGlobs: options.contentIncludeGlobs, excludeGlobs: options.contentExcludeGlobs });
	}
};

const ownerFor = (path: string): string => path.split('/').slice(0, 3).join('/');

const buildSection = async (
	options: IBuildQueryToolOptions,
	section: ISection,
): Promise<ISectionResult> => {
	const { fs, options: plugin } = options;
	if (section === 'architecture') return (await buildArchitectureMap({ fs, sourceRoot: plugin.sourceRoot })).layers.map((item) => ({ ...item }));
	if (section === 'features') return (await buildPageMap({ fs, pagesRoot: plugin.pagesRoot })).pages.map((item) => ({ ...item }));
	if (section === 'domain') return (await buildDomainMap({ fs, domainRoot: plugin.domainRoot })).contracts.map((item) => ({ ...item }));
	if (section === 'scss') return (await runScssAudit({ fs }, { sourcePath: plugin.scssAuditSourcePath, templateRoots: plugin.contentRoots })).entries.map((item) => ({ ...item }));
	const paths = await discoverContentPaths({ fs, roots: plugin.contentRoots, includeGlobs: plugin.contentIncludeGlobs, excludeGlobs: plugin.contentExcludeGlobs });
	return (await runPublicAudit({ contentPaths: paths, forbiddenTerms: plugin.forbiddenTerms, perSeRoots: plugin.perSeRoots, locale: plugin.locale, reader: fs })).findings.map((item) => ({ ...item }));
};

const OUTPUT = z.object({
	ok: z.literal(true),
	section: z.enum(['architecture', 'features', 'domain', 'scss', 'audit']),
	items: z.array(z.record(z.string(), z.unknown())),
	count: z.number(),
	total: z.number(),
	offset: z.number(),
	truncated: z.boolean(),
	nextOffset: z.number().optional(),
	tokenEstimate: z.number(),
	cache: z.object({ changedFiles: z.number(), reusedFiles: z.number() }),
});

export const buildQueryTool = (options: IBuildQueryToolOptions): IToolRegistration => {
	const indexes = new Map<ISection, ContentIndexService>();
	const cached = new Map<ISection, ISectionResult>();
	return {
		id: QUERY_TOOL_ID,
		summary: 'Query one portfolio section with field projection, pagination and a measured token budget.',
		tags: ['portfolio', 'query'],
		register: async (server) => {
			server.registerTool(
				`${options.namespacePrefix}_${QUERY_TOOL_ID}`,
				{
					description: 'Select one portfolio section, then filter/project/paginate its compact evidence. Unchanged file metadata reuses the section result without rereading sources.',
					inputSchema: z.object({
						section: z.enum(['architecture', 'features', 'domain', 'scss', 'audit']),
						fields: z.array(z.string()).max(20).optional(),
						filter: z.string().max(200).optional(),
						offset: z.number().int().nonnegative().default(0),
						limit: z.number().int().min(1).max(100).default(20),
						tokenBudget: z.number().int().min(128).max(4096).default(1200),
					}),
					outputSchema: OUTPUT,
				},
				async (args) => {
					const paths = await SECTION_PATHS(options.fs, options.options, args.section);
					const index = indexes.get(args.section) ?? new ContentIndexService(options.fs);
					indexes.set(args.section, index);
					const update = await index.synchronize({ paths, ownerSection: ownerFor });
					let result = cached.get(args.section);
					if (!result || update.changedPaths.length > 0 || update.removedPaths.length > 0) {
						result = await buildSection(options, args.section);
						cached.set(args.section, result);
					}
					const projected = compactProjection({ items: result, fields: args.fields, filter: args.filter, offset: args.offset, limit: args.limit, tokenBudget: args.tokenBudget });
					return toolJson({ ok: true as const, section: args.section, ...projected, cache: { changedFiles: update.changedPaths.length, reusedFiles: update.reusedPaths.length } });
				},
			);
		},
	};
};
