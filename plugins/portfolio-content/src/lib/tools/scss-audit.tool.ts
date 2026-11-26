/**
 * `portfolio_scss_audit` tool. Reports which directories' templates use
 * each class selector of a stylesheet.
 */

import { z } from 'zod';

import { toolJson, type IToolRegistration } from '@delendai/core/public';

import type { IFileSystem } from '../../contracts/interfaces/fs.interface';
import { runScssAudit } from '../services/scss-audit.service';
import { compactProjection, type IProjectionArguments, PROJECTION_INPUT, PROJECTION_OUTPUT } from '../helpers/projection.helper';

/** Tool id; the host registers it as `<namespacePrefix>_<id>`. */
export const SCSS_AUDIT_TOOL_ID = 'scss_audit';

export interface IBuildScssAuditToolOptions {
	readonly namespacePrefix: string;
	readonly fs: IFileSystem;
	readonly defaultSourcePath: string;
	readonly templateRoots: readonly string[];
}

const OUTPUT = z.object({
	ok: z.boolean(),
	sourcePath: z.string(),
	totalSelectors: z.number(),
	counts: z.object({ unused: z.number(), single: z.number(), shared: z.number() }),
	entries: z.array(z.record(z.string(), z.unknown())),
	dependencies: z.array(
		z.object({
			kind: z.enum(['use', 'forward', 'import']),
			target: z.string(),
			line: z.number(),
			resolvedPath: z.string().optional(),
		}),
	),
	customProperties: z.array(
		z.object({
			name: z.string(),
			line: z.number(),
			kind: z.enum(['definition', 'reference']),
		}),
	),
	nextAction: z.string(),
	error: z.string().optional(),
	...PROJECTION_OUTPUT,
});

export const buildScssAuditTool = (
	options: IBuildScssAuditToolOptions,
): IToolRegistration => ({
	id: SCSS_AUDIT_TOOL_ID,
	summary: 'Report which directories use each class selector of a stylesheet.',
	tags: ['portfolio', 'scss'],
	register: async (server) => {
		server.registerTool(
			`${options.namespacePrefix}_${SCSS_AUDIT_TOOL_ID}`,
			{
				description:
					'Read a SCSS file and report, for each class selector, the directories whose templates use it (unused, single owner or shared). Ownership comes from the templates on disk at call time. Pure read.',
				inputSchema: z.object({ sourcePath: z.string().optional(), ...PROJECTION_INPUT }),
				outputSchema: OUTPUT,
			},
			async (args: { sourcePath?: string } & IProjectionArguments) => {
				const sourcePath = args.sourcePath ?? options.defaultSourcePath;
				if (!(await options.fs.exists(sourcePath))) {
					return toolJson({
						ok: false,
						sourcePath,
						totalSelectors: 0,
						counts: { unused: 0, single: 0, shared: 0 },
						entries: [],
						dependencies: [],
						customProperties: [],
						nextAction: 'Pass an existing `sourcePath`.',
						error: `File not found: ${sourcePath}`,
						count: 0,
						total: 0,
						offset: args.offset ?? 0,
						truncated: false,
						tokenEstimate: 0,
					});
				}
				const report = await runScssAudit(
					{ fs: options.fs },
					{ sourcePath, templateRoots: options.templateRoots },
				);
				const { items: entries, ...projection } = compactProjection({ items: report.entries.map((entry) => ({ ...entry })), ...args });
				return toolJson({ ok: true, ...report, entries, ...projection });
			},
		);
	},
});
