/**
 * Architecture introspection engine. Returns the canonical layered
 * shape the portfolio follows (`app / core / domain / features /
 * shared / styles`) plus the subfolders that exist under each layer
 * at the time of the call. Pure-static: no symbol resolution, just
 * `readDir` walks.
 *
 * The map is the ground truth for any agent that needs to answer
 * "where does X live in this codebase?" without reading the disk.
 */

import type {
	IBuildArchitectureMapOptions,
	IBuildArchitectureMapRequest,
	IPortfolioArchitectureMap,
	IPortfolioLayer,
	PortfolioLayerId,
} from '../contracts/interfaces/architecture.interface';
import type { IFileSystem } from '../contracts/interfaces/fs.interface';

const LAYER_DEFINITIONS: readonly IPortfolioLayer[] = [
	{
		id: 'app',
		label: 'Route shell',
		root: 'src/app',
		subLayers: [],
		responsibility:
			'Bootstrap, providers, routes, and the page shell that composes feature components.',
	},
	{
		id: 'core',
		label: 'Core',
		root: 'src/core',
		subLayers: ['motion', 'platform', 'rendering'],
		responsibility:
			'Renderer, pure state transitions, and explicit browser/platform adapters (no Angular feature code).',
	},
	{
		id: 'domain',
		label: 'Domain',
		root: 'src/domain',
		subLayers: [],
		responsibility:
			'Immutable portfolio contracts (`IPortfolioPageId`, `ICapabilityId`, …) and bilingual copy/static content.',
	},
	{
		id: 'features',
		label: 'Features',
		root: 'src/features',
		subLayers: [],
		responsibility:
			'Independently testable public pages. Each feature owns its template, styles, tests, and state.',
	},
	{
		id: 'shared',
		label: 'Shared UI',
		root: 'src/shared',
		subLayers: ['ui'],
		responsibility:
			'Reusable UI primitives (header, footer, command palette) consumed by the shell and features.',
	},
	{
		id: 'styles',
		label: 'Styles',
		root: 'src/styles',
		subLayers: [],
		responsibility:
			'Design tokens, motion, theme primitives. Feature styles own their blocks; the shell has no feature selectors.',
	},
];

const joinPath = (root: string, ...segments: readonly string[]): string => {
	const cleaned = [root, ...segments].map((s) => s.replace(/^\/+|\/+$/g, ''));
	return cleaned.filter(Boolean).join('/');
};
const _pathHelpers = { joinPath };
export { _pathHelpers as pathHelpers };

export const buildFsFileSystem = async (): Promise<IFileSystem> => {
	// Lazy import so the engine stays free of `fs` when tests inject
	// their own IFileSystem (an in-memory map).
	const loader = await import('node:fs/promises');
	const readDir = async (workspaceRelative: string): Promise<readonly string[]> => {
		const entries = await loader.readdir(workspaceRelative, { withFileTypes: true });
		// Return BOTH directories and files — consumers like the feature
		// engine need to see `*.component.ts` entries to match them
		// against `COMPONENT_RE`. The caller filters by name.
		return entries.map((entry) => entry.name);
	};
	const exists = async (workspaceRelative: string): Promise<boolean> => {
		try {
			await loader.access(workspaceRelative);
			return true;
		} catch {
			return false;
		}
	};
	const isDirectory = async (workspaceRelative: string): Promise<boolean> => {
		try {
			const stat = await loader.stat(workspaceRelative);
			return stat.isDirectory();
		} catch {
			return false;
		}
	};
	const readText = async (workspaceRelative: string): Promise<string> =>
		loader.readFile(workspaceRelative, 'utf8');
	return { readDir, exists, isDirectory, readText };
};

export const buildArchitectureMap = async (
	options: IBuildArchitectureMapOptions,
	request: IBuildArchitectureMapRequest = {},
): Promise<IPortfolioArchitectureMap> => {
	const { fs } = options;
	const filter = new Set<PortfolioLayerId>(request.only ?? []);
	const layers: IPortfolioLayer[] = [];

	for (const layer of LAYER_DEFINITIONS) {
		if (filter.size > 0 && !filter.has(layer.id)) continue;

		if (!(await fs.exists(layer.root))) {
			// Layer missing on disk — still surfaced so the agent knows
			// the canonical structure even when the tree is incomplete.
			layers.push({ ...layer, subLayers: [] });
			continue;
		}

		let observedSubLayers: readonly string[] = layer.subLayers;
		try {
			const seen = await fs.readDir(layer.root);
			const expected = new Set(layer.subLayers);
			const merged = new Set<string>(expected);
			for (const entry of seen) {
				if (expected.has(entry)) continue;
				// Skip node_modules / hidden dirs.
				if (entry.startsWith('.')) continue;
				merged.add(entry);
			}
			observedSubLayers = [...merged].sort((a, b) => a.localeCompare(b));
		} catch {
			observedSubLayers = layer.subLayers;
		}

		layers.push({ ...layer, subLayers: observedSubLayers });
	}

	return {
		layers,
		generatedAt: new Date().toISOString(),
	};
};
