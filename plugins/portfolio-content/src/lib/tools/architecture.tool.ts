/**
 * `portfolio_architecture` tool. Maps the layers of the source tree as
 * they exist on disk at call time.
 */

import { z } from 'zod';

import { toolJson, type IToolRegistration } from '@delendai/core/public';

import type { IFileSystem } from '../../contracts/interfaces/fs.interface';
import { buildArchitectureMap } from '../services/architecture.service';

export const ARCHITECTURE_TOOL_ID = 'portfolio_architecture';

export interface IBuildArchitectureToolOptions {
	readonly fs: IFileSystem;
	readonly sourceRoot: string;
}

const OUTPUT = z.object({
	ok: z.literal(true),
	sourceRoot: z.string(),
	layers: z.array(
		z.object({
			id: z.string(),
			root: z.string(),
			subLayers: z.array(z.string()),
			fileCount: z.number(),
		}),
	),
	generatedAt: z.string(),
});

export const buildArchitectureTool = (
	options: IBuildArchitectureToolOptions,
): IToolRegistration => ({
	id: ARCHITECTURE_TOOL_ID,
	summary: 'Map the layers (directories) of the portfolio source tree.',
	tags: ['portfolio', 'architecture'],
	register: async (server) => {
		server.registerTool(
			ARCHITECTURE_TOOL_ID,
			{
				description:
					'List every directory under the source root as a layer, with its sub-directories and file count. Read from disk at call time; pure read.',
				inputSchema: z.object({ only: z.array(z.string()).optional() }),
				outputSchema: OUTPUT,
			},
			async (args: { only?: readonly string[] }) => {
				const map = await buildArchitectureMap(
					{ fs: options.fs, sourceRoot: options.sourceRoot },
					args.only ? { only: args.only } : {},
				);
				return toolJson({ ok: true as const, ...map });
			},
		);
	},
});
