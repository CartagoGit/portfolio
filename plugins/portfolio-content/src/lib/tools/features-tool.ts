/**
 * `portfolio_features` tool. Returns the components in `src/features/`
 * grouped by feature, so an agent can answer "what's in the home
 * feature?" without reading the disk by hand.
 */

import { z } from 'zod';

import { toolJson, type IToolRegistration } from '@mcp-vertex/core/public';

import { buildFeatureMap, KNOWN_FEATURES } from '../services/features';
import { buildFsFileSystem } from '../services/architecture';
import type { IFileSystem } from '../contracts/interfaces/fs.interface';

export interface IBuildFeaturesToolOptions {
	readonly namespacePrefix: string;
}

const COMPONENT = z.object({
	name: z.string(),
	path: z.string(),
	subFeature: z.string().optional(),
});

const FEATURE = z.object({
	id: z.string(),
	label: z.string(),
	path: z.string(),
	components: z.array(COMPONENT),
});

const OUTPUT = z.object({
	ok: z.literal(true),
	features: z.array(FEATURE),
	generatedAt: z.string(),
});

export const buildFeaturesTool = (
	options: IBuildFeaturesToolOptions,
): IToolRegistration => ({
	id: 'portfolio_features',
	summary: 'List every Angular component the portfolio features own.',
	tags: ['portfolio', 'features'],
	register: async (server) => {
		const fs: IFileSystem = await buildFsFileSystem();
		server.registerTool(
			`${options.namespacePrefix}_features`,
			{
				description:
					'Walk `src/features/<id>/` and return every `*.component.ts` the feature owns (top-level page component + sub-feature folders). Pure read.',
				inputSchema: z.object({
					featureId: z.enum(KNOWN_FEATURES as readonly [string, ...string[]]).optional(),
				}),
				outputSchema: OUTPUT,
			},
			async (args: { featureId?: string }) => {
				const map = await buildFeatureMap(fs, {
					...((args.featureId as (typeof KNOWN_FEATURES)[number] | undefined)
						? { featureId: args.featureId as (typeof KNOWN_FEATURES)[number] }
						: {}),
				});
				return toolJson({ ok: true, ...map });
			},
		);
	},
});
