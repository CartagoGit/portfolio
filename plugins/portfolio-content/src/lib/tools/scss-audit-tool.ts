/**
 * `portfolio_scss_audit` tool. Reads a SCSS file (typically
 * `src/app/portfolio-page.scss`) and reports every top-level
 * selector with a suggested owning feature. Engine is pure
 * (`runScssAudit`) and binds the FS reader once at register time.
 */

import { z } from 'zod';

import { toolJson, type IToolRegistration } from '@mcp-vertex/core/public';

import { runScssAudit } from '../services/scss-audit';
import type { IFileSystem } from '../contracts/interfaces/fs.interface';
import type { ScssOwnership } from '../contracts/interfaces/scss-audit.interface';

export interface IBuildScssAuditToolOptions {
	readonly namespacePrefix: string;
	readonly defaultSourcePath: string;
}

const OWNERSHIP = z.enum([
	'shell',
	'home',
	'home/hero-monitor',
	'home/earth-globe',
	'home/home-intro',
	'work',
	'approach',
	'knowledge',
	'lab',
	'docker',
	'demos',
	'contact',
	'shared',
	'shared/ui',
	'unmapped',
]) satisfies z.ZodType<ScssOwnership>;

const ENTRY = z.object({
	name: z.string(),
	selector: z.string(),
	line: z.number(),
	ownership: OWNERSHIP,
	target: z.string(),
	rationale: z.string(),
});

const COUNTS = z.object({
	shell: z.number(),
	'home/hero-monitor': z.number(),
	'home/earth-globe': z.number(),
	'home/home-intro': z.number(),
	work: z.number(),
	approach: z.number(),
	knowledge: z.number(),
	lab: z.number(),
	docker: z.number(),
	demos: z.number(),
	contact: z.number(),
	shared: z.number(),
	'shared/ui': z.number(),
	unmapped: z.number(),
});

const OUTPUT = z.object({
	ok: z.literal(true),
	sourcePath: z.string(),
	totalSelectors: z.number(),
	ownershipCounts: COUNTS,
	entries: z.array(ENTRY),
	unmapped: z.array(ENTRY),
	nextAction: z.string(),
});

export const buildScssAuditTool = (
	options: IBuildScssAuditToolOptions,
): IToolRegistration => ({
	id: 'portfolio_scss_audit',
	summary:
		'Audit a SCSS file and report every top-level selector with a suggested owning feature.',
	tags: ['portfolio', 'scss', 'migration'],
	register: async (server) => {
		// Lazy import so the engine stays free of `fs` outside the
		// register-time closure; tests inject their own IFileSystem.
		const loader = await import('node:fs/promises');
		const fs: IFileSystem = {
			readDir: async (workspaceRelative: string) => {
				const entries = await loader.readdir(workspaceRelative, {
					withFileTypes: true,
				});
				return entries.map((entry) => entry.name);
			},
			exists: async (workspaceRelative: string) => {
				try {
					await loader.access(workspaceRelative);
					return true;
				} catch {
					return false;
				}
			},
			isDirectory: async (workspaceRelative: string) => {
				try {
					const stat = await loader.stat(workspaceRelative);
					return stat.isDirectory();
				} catch {
					return false;
				}
			},
			readText: async (workspaceRelative: string) =>
				loader.readFile(workspaceRelative, 'utf8'),
		};

		server.registerTool(
			`${options.namespacePrefix}_scss_audit`,
			{
				description:
					'Read a SCSS file and report every top-level selector with a suggested owning feature (e.g. `.case-card` → `work`, `.orb` → `home/hero-monitor`). Useful for migrating legacy shell SCSS into features. Pure read; no network, no writes.',
				inputSchema: z.object({
					sourcePath: z.string().optional(),
				}),
				outputSchema: OUTPUT,
			},
			async (args: { sourcePath?: string }) => {
				const report = await runScssAudit({
					sourcePath: args.sourcePath ?? options.defaultSourcePath,
					fs,
				});
				return toolJson({ ok: true, ...report });
			},
		);
	},
});
