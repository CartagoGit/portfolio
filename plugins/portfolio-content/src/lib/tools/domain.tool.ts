/**
 * `portfolio_domain` tool. Returns the exported contracts found in the
 * domain root at call time.
 */

import { z } from 'zod';

import { toolJson, type IToolRegistration } from '@delendai/core/public';

import type { IFileSystem } from '../../contracts/interfaces/fs.interface';
import { buildDomainMap } from '../services/domain.service';

/** Tool id; the host registers it as `<namespacePrefix>_<id>`. */
export const DOMAIN_TOOL_ID = 'domain';

export interface IBuildDomainToolOptions {
	readonly namespacePrefix: string;
	readonly fs: IFileSystem;
	readonly domainRoot: string;
}

const OUTPUT = z.object({
	ok: z.literal(true),
	domainRoot: z.string(),
	contracts: z.array(
		z.object({
			name: z.string(),
			kind: z.enum(['union', 'interface', 'type', 'const']),
			members: z.array(z.string()),
			sourcePath: z.string(),
			line: z.number(),
		}),
	),
	generatedAt: z.string(),
});

export const buildDomainTool = (
	options: IBuildDomainToolOptions,
): IToolRegistration => ({
	id: DOMAIN_TOOL_ID,
	summary: 'List the exported domain contracts (unions, interfaces, types, consts).',
	tags: ['portfolio', 'domain'],
	register: async (server) => {
		server.registerTool(
			`${options.namespacePrefix}_${DOMAIN_TOOL_ID}`,
			{
				description:
					'Parse every non-spec `.ts` file under the domain root and return its exported unions (with members), interfaces, type aliases and consts. Read from disk at call time; pure read.',
				inputSchema: z.object({
					kind: z.enum(['union', 'interface', 'type', 'const']).optional(),
				}),
				outputSchema: OUTPUT,
			},
			async (args: { kind?: 'union' | 'interface' | 'type' | 'const' }) => {
				const map = await buildDomainMap(
					{ fs: options.fs, domainRoot: options.domainRoot },
					args.kind ? { kind: args.kind } : {},
				);
				return toolJson({ ok: true as const, ...map });
			},
		);
	},
});
