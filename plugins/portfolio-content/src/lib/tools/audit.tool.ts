/**
 * `portfolio_public_audit` tool. Scans every public template found at
 * call time for forbidden terms and `TODO(image)` placeholders.
 */

import { z } from 'zod';

import { toolJson, type IToolRegistration } from '@delendai/core/public';

import type { IFileSystem } from '../../contracts/interfaces/fs.interface';
import type { IPortfolioContentOptions } from '../../contracts/interfaces/plugin-options.interface';
import { runPublicAudit } from '../services/audit.service';
import { discoverContentPaths } from '../services/content.service';

export const AUDIT_TOOL_ID = 'portfolio_public_audit';

export interface IBuildAuditToolOptions {
	readonly fs: IFileSystem;
	readonly options: IPortfolioContentOptions;
}

const FINDING = z.object({
	id: z.string(),
	severity: z.enum(['error', 'warning', 'info']),
	message: z.string(),
	location: z.object({ contentPath: z.string(), line: z.number().optional() }),
	remediation: z.string(),
});

const OUTPUT = z.object({
	ok: z.boolean(),
	contentPaths: z.array(z.string()),
	severity: z.object({ errors: z.number(), warnings: z.number(), info: z.number() }),
	findings: z.array(FINDING),
	nextAction: z.string(),
});

export const buildAuditTool = (
	deps: IBuildAuditToolOptions,
): IToolRegistration => ({
	id: AUDIT_TOOL_ID,
	summary: 'Audit the public portfolio templates for forbidden terms and TODO(image) placeholders.',
	tags: ['portfolio', 'audit'],
	register: async (server) => {
		server.registerTool(
			AUDIT_TOOL_ID,
			{
				description:
					'Discover every `*.html` template under the configured content roots (plus include/exclude globs) and report forbidden employer/client terms and per-se roots as errors and `TODO(image)` placeholders as warnings. Pure read.',
				inputSchema: z.object({ contentPaths: z.array(z.string()).optional() }),
				outputSchema: OUTPUT,
			},
			async (args: { contentPaths?: readonly string[] }) => {
				const o = deps.options;
				const contentPaths =
					args.contentPaths ??
					(await discoverContentPaths({
						fs: deps.fs,
						roots: o.contentRoots,
						includeGlobs: o.contentIncludeGlobs,
						excludeGlobs: o.contentExcludeGlobs,
					}));
				const report = await runPublicAudit({
					contentPaths,
					forbiddenTerms: o.forbiddenTerms,
					perSeRoots: o.perSeRoots,
					locale: o.locale,
					reader: deps.fs,
				});
				return toolJson(report);
			},
		);
	},
});
