/**
 * `portfolio_architecture` tool. Returns the canonical layered shape
 * of the portfolio codebase so an agent can answer "where does X
 * live?" without reading the disk.
 */

import { z } from 'zod';

import { toolJson, type IToolRegistration } from '@mcp-vertex/core/public';

import {
	buildArchitectureMap,
	buildFsFileSystem,
} from '../services/architecture';
import type { IFileSystem } from '../contracts/interfaces/architecture.interface';

export interface IBuildArchitectureToolOptions {
	readonly namespacePrefix: string;
}

const LAYER = z.object({
	id: z.string(),
	label: z.string(),
	root: z.string(),
	subLayers: z.array(z.string()),
	responsibility: z.string(),
});

const OUTPUT = z.object({
	ok: z.literal(true),
	layers: z.array(LAYER),
	generatedAt: z.string(),
});

export const buildArchitectureTool = (
	options: IBuildArchitectureToolOptions,
): IToolRegistration => ({
	id: 'portfolio_architecture',
	summary: 'Map the layered shape of the portfolio codebase (app / core / domain / features / shared / styles).',
	tags: ['portfolio', 'architecture'],
	register: async (server) => {
		const fs: IFileSystem = await buildFsFileSystem();
		server.registerTool(
			`${options.namespacePrefix}_architecture`,
			{
				description:
					'Return the canonical layered shape of the portfolio codebase. Each layer lists its workspace-relative root and the subfolders that exist on disk. Pure read; no writes, no network.',
				inputSchema: z.object({
					only: z
						.array(z.enum(['app', 'core', 'domain', 'features', 'shared', 'styles']))
						.optional(),
				}),
				outputSchema: OUTPUT,
			},
			async (args: { only?: readonly ('app' | 'core' | 'domain' | 'features' | 'shared' | 'styles')[] }) => {
				const map = await buildArchitectureMap(
					{ workspaceRoot: '.', fs },
					args.only ? { only: args.only } : {},
				);
				return toolJson({ ok: true, ...map });
			},
		);
	},
});
