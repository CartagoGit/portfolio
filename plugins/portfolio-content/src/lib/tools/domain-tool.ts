/**
 * `portfolio_domain` tool. Returns the public domain contracts
 * (`IPortfolioPageId`, `ICapabilityId`, …) extracted from
 * `src/domain/portfolio.types.ts`. Pure-static (regex over the source).
 */

import { z } from 'zod';

import { toolJson, type IToolRegistration } from '@mcp-vertex/core/public';

import { buildDomainMap } from '../services/domain';
import { buildFsFileSystem } from '../services/architecture';
import type { IFileSystem } from '../contracts/interfaces/fs.interface';

export interface IBuildDomainToolOptions {
	readonly namespacePrefix: string;
}

const CONTRACT = z.object({
	name: z.string(),
	kind: z.enum(['union', 'interface', 'type', 'const']),
	members: z.array(z.string()),
	sourcePath: z.string(),
	line: z.number(),
});

const OUTPUT = z.object({
	ok: z.literal(true),
	contracts: z.array(CONTRACT),
	generatedAt: z.string(),
});

export const buildDomainTool = (
	options: IBuildDomainToolOptions,
): IToolRegistration => ({
	id: 'portfolio_domain',
	summary: 'List the public domain contracts (IPortfolioPageId, ICapabilityId, …) the portfolio features talk to.',
	tags: ['portfolio', 'domain'],
	register: async (server) => {
		const fs: IFileSystem = await buildFsFileSystem();
		server.registerTool(
			`${options.namespacePrefix}_domain`,
			{
				description:
					'Read `src/domain/portfolio.types.ts` and return the exported unions (with members), interfaces, type aliases, and const exports. Pure read; no network.',
				inputSchema: z.object({
					kind: z.enum(['union', 'interface', 'type', 'const']).optional(),
				}),
				outputSchema: OUTPUT,
			},
			async (args: { kind?: 'union' | 'interface' | 'type' | 'const' }) => {
				const map = await buildDomainMap(fs, {
					...(args.kind ? { kind: args.kind } : {}),
				});
				return toolJson({ ok: true, ...map });
			},
		);
	},
});
