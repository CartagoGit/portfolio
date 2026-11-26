/**
 * `portfolio_features` tool. Lists every page directory with the
 * components found below it, read from disk at call time.
 */

import { z } from 'zod';

import { toolJson, type IToolRegistration } from '@delendai/core/public';

import type { IFileSystem } from '../../contracts/interfaces/fs.interface';
import { buildPageMap } from '../services/pages.service';
import { compactProjection, type IProjectionArguments, PROJECTION_INPUT, PROJECTION_OUTPUT } from '../helpers/projection.helper';

/** Tool id; the host registers it as `<namespacePrefix>_<id>`. */
export const FEATURES_TOOL_ID = 'features';

export interface IBuildFeaturesToolOptions {
	readonly namespacePrefix: string;
	readonly fs: IFileSystem;
	readonly pagesRoot: string;
}

const OUTPUT = z.object({
	ok: z.literal(true),
	pagesRoot: z.string(),
	pages: z.array(z.record(z.string(), z.unknown())),
	generatedAt: z.string(),
	...PROJECTION_OUTPUT,
});

export const buildFeaturesTool = (
	options: IBuildFeaturesToolOptions,
): IToolRegistration => ({
	id: FEATURES_TOOL_ID,
	summary: 'List every page directory and the components it owns.',
	tags: ['portfolio', 'features'],
	register: async (server) => {
		server.registerTool(
			`${options.namespacePrefix}_${FEATURES_TOOL_ID}`,
			{
				description:
					'Walk the pages root and return, per page directory, its `*.page.ts` file and every nested `*.component.ts`. Read from disk at call time; pure read.',
				inputSchema: z.object({ pageId: z.string().optional(), ...PROJECTION_INPUT }),
				outputSchema: OUTPUT,
			},
			async (args: { pageId?: string } & IProjectionArguments) => {
				const map = await buildPageMap(
					{ fs: options.fs, pagesRoot: options.pagesRoot },
					args.pageId ? { pageId: args.pageId } : {},
				);
				const { items: pages, ...projection } = compactProjection({ items: map.pages.map((page) => ({ ...page })), ...args });
				return toolJson({ ok: true as const, ...map, pages, ...projection });
			},
		);
	},
});
