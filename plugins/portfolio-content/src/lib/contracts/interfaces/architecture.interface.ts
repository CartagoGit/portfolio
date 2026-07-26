/**
 * Architecture introspection contracts. The plugin statically walks
 * `src/` to map the layered shape (`app / core / domain / features /
 * shared / styles`) and to surface the public domain contracts an
 * agent needs to reason about features without reading every file.
 *
 * The engine is pure: it takes an {@link IFileSystem} so the audit
 * graph can be tested against an in-memory tree.
 */

import type { IFileSystem } from './fs.interface';

export type PortfolioLayerId =
	| 'app'
	| 'core'
	| 'domain'
	| 'features'
	| 'shared'
	| 'styles';

export interface IPortfolioLayer {
	readonly id: PortfolioLayerId;
	readonly label: string;
	readonly root: string;
	/** Subfolders of `root` that contain ambient code or assets. */
	readonly subLayers: readonly string[];
	/** One-line responsibility summary for agents. */
	readonly responsibility: string;
}

export interface IPortfolioArchitectureMap {
	readonly layers: readonly IPortfolioLayer[];
	readonly generatedAt: string;
}

export interface IBuildArchitectureMapOptions {
	readonly workspaceRoot: string;
	readonly fs: IFileSystem;
}

export interface IBuildArchitectureMapRequest {
	/** Optional layer filter; defaults to all layers. */
	readonly only?: readonly PortfolioLayerId[];
}

/** Re-export for tests that want to type their in-memory fs against the same shape. */
export type { IFileSystem } from './fs.interface';
