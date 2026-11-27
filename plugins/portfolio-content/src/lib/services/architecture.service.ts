/**
 * Architecture introspection. A layer is a directory under the source
 * root; its sub-layers are its immediate sub-directories. Nothing is
 * listed that is not on disk.
 */

import type {
	IBuildArchitectureMapRequest,
	IPortfolioArchitectureMap,
	IPortfolioLayer,
} from '../../contracts/interfaces/architecture.interface';
import type { IFileSystem } from '../../contracts/interfaces/fs.interface';
import { joinPath, listDirectories, walkFiles } from './fs.service';

export interface IBuildArchitectureMapOptions {
	readonly fs: IFileSystem;
	readonly sourceRoot: string;
}

export const buildArchitectureMap = async (
	options: IBuildArchitectureMapOptions,
	request: IBuildArchitectureMapRequest = {},
): Promise<IPortfolioArchitectureMap> => {
	const { fs, sourceRoot } = options;
	const only = new Set(request.only ?? []);
	const layers: IPortfolioLayer[] = [];
	for (const id of await listDirectories(fs, sourceRoot)) {
		if (only.size > 0 && !only.has(id)) continue;
		const root = joinPath(sourceRoot, id);
		layers.push({
			id,
			root,
			subLayers: await listDirectories(fs, root),
			fileCount: (await walkFiles(fs, root)).length,
		});
	}
	return { sourceRoot, layers, generatedAt: new Date().toISOString() };
};
