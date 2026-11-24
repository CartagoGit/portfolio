/**
 * Architecture and page introspection contracts. Everything is derived
 * from the directory tree at call time: a layer is a directory under the
 * source root, a page is a directory under the pages root.
 */

export interface IPortfolioLayer {
	/** Directory name (for example the folder under `src/`). */
	readonly id: string;
	readonly root: string;
	/** Immediate sub-directories of `root`. */
	readonly subLayers: readonly string[];
	/** Number of files under `root` (recursive, spec files included). */
	readonly fileCount: number;
}

export interface IPortfolioArchitectureMap {
	readonly sourceRoot: string;
	readonly layers: readonly IPortfolioLayer[];
	readonly generatedAt: string;
}

export interface IBuildArchitectureMapRequest {
	/** Optional layer ids to keep; defaults to every layer. */
	readonly only?: readonly string[];
}

export interface IPortfolioPageComponent {
	readonly name: string;
	readonly path: string;
	/** Directory of the component relative to the page (absent at top level). */
	readonly subFeature?: string;
}

export interface IPortfolioPage {
	readonly id: string;
	/** Title-cased id, derived (never looked up). */
	readonly label: string;
	readonly path: string;
	/** Path of the `*.page.ts` file when the page has one. */
	readonly pageFile?: string;
	readonly components: readonly IPortfolioPageComponent[];
}

export interface IPortfolioPageMap {
	readonly pagesRoot: string;
	readonly pages: readonly IPortfolioPage[];
	readonly generatedAt: string;
}

export interface IBuildPageMapRequest {
	readonly pageId?: string;
}
