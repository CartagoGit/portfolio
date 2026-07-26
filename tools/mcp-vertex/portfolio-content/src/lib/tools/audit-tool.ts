/**
 * `portfolio_content_audit` tool. Pure registration builder — the
 * `register()` callback binds the configured `contentPaths` /
 * `forbiddenTerms` / `locale` and the FS reader once.
 */

import { z } from 'zod';

import { toolJson, type IToolRegistration } from '@mcp-vertex/core/public';

import { buildFsAuditReader, runPortfolioAudit } from '../services/audit';
import type { IPortfolioAuditReport } from '../contracts/interfaces/audit.interface';

export interface IBuildAuditToolOptions {
	readonly namespacePrefix: string;
	readonly contentPaths: readonly string[];
	readonly forbiddenTerms: readonly string[];
	readonly locale: 'en' | 'es';
}

const FINDING = z.object({
	id: z.string(),
	severity: z.enum(['error', 'warning', 'info']),
	message: z.string(),
	location: z.object({
		contentPath: z.string(),
		line: z.number().optional(),
	}),
	remediation: z.string(),
});

const OUTPUT = z.object({
	ok: z.boolean(),
	contentPaths: z.array(z.string()),
	severity: z.object({
		errors: z.number(),
		warnings: z.number(),
		info: z.number(),
	}),
	findings: z.array(FINDING),
	nextAction: z.string(),
});

export const buildAuditTool = (
	options: IBuildAuditToolOptions,
): IToolRegistration => ({
	id: 'portfolio_content_audit',
	summary:
		'Audit public portfolio content for private-work references and image TODOs.',
	tags: ['portfolio', 'audit'],
	register: async (server) => {
		const reader = buildFsAuditReader();
		server.registerTool(
			`${options.namespacePrefix}_content_audit`,
			{
				description:
					'Scan the configured public portfolio templates. Reports forbidden employer/client terms as `error`-severity findings and `TODO(image): …` placeholders as `warning`-severity findings. Pure read; no writes, no network.',
				inputSchema: z.object({
					/** Optional override for the default `contentPaths`. */
					contentPaths: z.array(z.string()).optional(),
				}),
				outputSchema: OUTPUT,
			},
			async (args: { contentPaths?: readonly string[] }) => {
				const contentPaths = args.contentPaths ?? options.contentPaths;
				const report: IPortfolioAuditReport = await runPortfolioAudit({
					contentPaths,
					forbiddenTerms: options.forbiddenTerms,
					locale: options.locale,
					reader,
				});
				return toolJson(report);
			},
		);
	},
});
