/**
 * `portfolio_scss_audit` tool. Reports which directories' templates use
 * each class selector of a stylesheet.
 */

import { z } from 'zod';

import { toolJson, type IToolRegistration } from '@delendai/core/public';

import type { IFileSystem } from '../../contracts/interfaces/fs.interface';
import { runScssAudit } from '../services/scss-audit.service';

export const SCSS_AUDIT_TOOL_ID = 'portfolio_scss_audit';

export interface IBuildScssAuditToolOptions {
	readonly fs: IFileSystem;
	readonly defaultSourcePath: string;
	readonly templateRoots: readonly string[];
}

const OUTPUT = z.object({
	ok: z.boolean(),
	sourcePath: z.string(),
	totalSelectors: z.number(),
	counts: z.object({ unused: z.number(), single: z.number(), shared: z.number() }),
	entries: z.array(
		z.object({
			selector: z.string(),
			className: z.string(),
			line: z.number(),
			owners: z.array(z.string()),
			status: z.enum(['unused', 'single', 'shared']),
		}),
	),
	nextAction: z.string(),
	error: z.string().optional(),
});

export const buildScssAuditTool = (
	options: IBuildScssAuditToolOptions,
): IToolRegistration => ({
	id: SCSS_AUDIT_TOOL_ID,
	summary: 'Report which directories use each class selector of a stylesheet.',
	tags: ['portfolio', 'scss'],
	register: async (server) => {
		server.registerTool(
			SCSS_AUDIT_TOOL_ID,
			{
				description:
					'Read a SCSS file and report, for each class selector, the directories whose templates use it (unused, single owner or shared). Ownership comes from the templates on disk at call time. Pure read.',
				inputSchema: z.object({ sourcePath: z.string().optional() }),
				outputSchema: OUTPUT,
			},
			async (args: { sourcePath?: string }) => {
				const sourcePath = args.sourcePath ?? options.defaultSourcePath;
				if (!(await options.fs.exists(sourcePath))) {
					return toolJson({
						ok: false,
						sourcePath,
						totalSelectors: 0,
						counts: { unused: 0, single: 0, shared: 0 },
						entries: [],
						nextAction: 'Pass an existing `sourcePath`.',
						error: `File not found: ${sourcePath}`,
					});
				}
				const report = await runScssAudit(
					{ fs: options.fs },
					{ sourcePath, templateRoots: options.templateRoots },
				);
				return toolJson({ ok: true, ...report });
			},
		);
	},
});
