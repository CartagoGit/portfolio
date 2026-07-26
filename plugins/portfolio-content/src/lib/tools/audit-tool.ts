/**
 * `portfolio_public_audit` tool (support). Read-only scan of public
 * templates for forbidden terms and `TODO(image)` placeholders.
 * Severity-labelled; bilingual remediation.
 */

import { z } from 'zod';

import { toolJson, type IToolRegistration } from '@mcp-vertex/core/public';

import {
	buildFsPublicAuditReader,
	runPublicAudit,
} from '../services/audit';

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
	id: 'portfolio_public_audit',
	summary:
		'Audit public portfolio templates for forbidden employer/client terms and TODO(image) placeholders.',
	tags: ['portfolio', 'audit'],
	register: async (server) => {
		const reader = await buildFsPublicAuditReader();
		server.registerTool(
			`${options.namespacePrefix}_public_audit`,
			{
				description:
					'Scan the configured public templates. Reports forbidden employer/client terms as `error`-severity findings, per-se forbidden roots (case-insensitive, separator-collapsed) as `error`-severity findings, and `TODO(image): …` placeholders as `warning`-severity findings. Pure read; no writes, no network.',
				inputSchema: z.object({
					contentPaths: z.array(z.string()).optional(),
				}),
				outputSchema: OUTPUT,
			},
			async (args: { contentPaths?: readonly string[] }) => {
				const contentPaths = args.contentPaths ?? options.contentPaths;
				const report = await runPublicAudit({
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
