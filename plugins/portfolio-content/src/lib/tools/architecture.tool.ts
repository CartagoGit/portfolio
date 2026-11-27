/**
 * `portfolio_architecture` tool. Maps the layers of the source tree as
 * they exist on disk at call time.
 */

import { z } from 'zod';

import { toolJson, type IToolRegistration } from '@delendai/core/public';

import type { IFileSystem } from '../../contracts/interfaces/fs.interface';
import { buildArchitectureMap } from '../services/architecture.service';
import { compactProjection, type IProjectionArguments, PROJECTION_INPUT, PROJECTION_OUTPUT } from '../helpers/projection.helper';

/** Tool id; the host registers it as `<namespacePrefix>_<id>`. */
export const ARCHITECTURE_TOOL_ID = 'architecture';

export interface IBuildArchitectureToolOptions {
	readonly namespacePrefix: string;
	readonly fs: IFileSystem;
	readonly sourceRoot: string;
}

const OUTPUT = z.object({
	ok: z.literal(true),
	sourceRoot: z.string(),
	layers: z.array(z.record(z.string(), z.unknown())),
	generatedAt: z.string(),
	...PROJECTION_OUTPUT,
});

export const buildArchitectureTool = (
	options: IBuildArchitectureToolOptions,
): IToolRegistration => ({
	id: ARCHITECTURE_TOOL_ID,
	summary: 'Map the layers (directories) of the portfolio source tree.',
	tags: ['portfolio', 'architecture'],
	register: async (server) => {
		server.registerTool(
			`${options.namespacePrefix}_${ARCHITECTURE_TOOL_ID}`,
			{
				description:
					'List every directory under the source root as a layer, with its sub-directories and file count. Read from disk at call time; pure read.',
				inputSchema: z.object({ only: z.array(z.string()).optional(), ...PROJECTION_INPUT }),
				outputSchema: OUTPUT,
			},
			async (args: { only?: readonly string[] } & IProjectionArguments) => {
				const map = await buildArchitectureMap(
					{ fs: options.fs, sourceRoot: options.sourceRoot },
					args.only ? { only: args.only } : {},
				);
				const { items: layers, ...projection } = compactProjection({ items: map.layers.map((layer) => ({ ...layer })), ...args });
				return toolJson({ ok: true as const, ...map, layers, ...projection });
			},
		);
	},
});
