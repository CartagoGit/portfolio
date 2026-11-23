/**
 * Page introspection. A page is a directory under the pages root; its
 * components are every `*.component.ts` below it, at any depth.
 */

import type {
	IBuildPageMapRequest,
	IPortfolioPage,
	IPortfolioPageComponent,
	IPortfolioPageMap,
} from '../../contracts/interfaces/architecture.interface';
import type { IFileSystem } from '../../contracts/interfaces/fs.interface';
import { joinPath, listDirectories, walkFiles } from './fs.service';

const COMPONENT_RE = /^(.+)\.component\.ts$/;
const PAGE_RE = /\.page\.ts$/;
const SPEC_RE = /\.spec\.ts$/;

const basename = (path: string): string => path.slice(path.lastIndexOf('/') + 1);
const dirname = (path: string): string => path.slice(0, path.lastIndexOf('/'));

const titleCase = (id: string): string =>
	id
		.split(/[-_]/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');

export interface IBuildPageMapOptions {
	readonly fs: IFileSystem;
	readonly pagesRoot: string;
}

const buildPage = async (
	fs: IFileSystem,
	pagesRoot: string,
	id: string,
): Promise<IPortfolioPage> => {
	const path = joinPath(pagesRoot, id);
	const files = (await walkFiles(fs, path)).filter((file) => !SPEC_RE.test(file));
	const components: IPortfolioPageComponent[] = [];
	for (const file of files) {
		const match = COMPONENT_RE.exec(basename(file));
		if (!match) continue;
		const directory = dirname(file);
		const subFeature = directory === path ? undefined : directory.slice(path.length + 1);
		components.push({
			name: `${match[1]}.component`,
			path: file,
			...(subFeature ? { subFeature } : {}),
		});
	}
	const pageFile = files.find(
		(file) => dirname(file) === path && PAGE_RE.test(basename(file)),
	);
	return {
		id,
		label: titleCase(id),
		path,
		...(pageFile ? { pageFile } : {}),
		components,
	};
};

export const buildPageMap = async (
	options: IBuildPageMapOptions,
	request: IBuildPageMapRequest = {},
): Promise<IPortfolioPageMap> => {
	const { fs, pagesRoot } = options;
	const ids = (await listDirectories(fs, pagesRoot)).filter(
		(id) => !request.pageId || id === request.pageId,
	);
	const pages: IPortfolioPage[] = [];
	for (const id of ids) pages.push(await buildPage(fs, pagesRoot, id));
	return { pagesRoot, pages, generatedAt: new Date().toISOString() };
};
