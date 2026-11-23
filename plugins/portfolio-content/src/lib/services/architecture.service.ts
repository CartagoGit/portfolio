/**
 * Architecture introspection engine. Returns the canonical layered
 * shape the portfolio follows (`app / core / domain / pages /
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
			'Immutable portfolio contracts (`IPageComponentId`, `ICapabilityId`, …) and bilingual copy/static content.',
	},
	{
		id: 'pages' as PortfolioLayerId,
		label: 'Pages',
		root: 'src/pages',
		subLayers: [],
		responsibility:
			'Independently testable public pages. Each page owns its template, styles, tests, and nested components.',
	},
	{
		id: 'shared',
		label: 'Shared UI',
		root: 'src/shared',
		subLayers: ['ui'],
		responsibility:
			'Reusable UI primitives (header, footer, command palette) consumed by the shell and pages.',
	},
	{
		id: 'styles',
		label: 'Styles',
		root: 'src/styles',
		subLayers: [],
		responsibility:
			'Design tokens, motion, theme primitives. Page styles own their blocks; the shell has no page selectors.',
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
		// engine need to see page/component entries to match them by suffix.
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

const describeFsError = (error: unknown): string =>
	error instanceof Error ? ` ${error.message}` : '';

export const buildArchitectureMap = async (
	options: IBuildArchitectureMapOptions,
	request: IBuildArchitectureMapRequest = {},
): Promise<IPortfolioArchitectureMap> => {
	const { fs } = options;
	const filter = new Set<string>(request.only ?? []);
	const selectedLayers = LAYER_DEFINITIONS.filter(
		(layer) => filter.size === 0 || filter.has(String(layer.id)),
	);
	const missingRoots: string[] = [];

	for (const layer of selectedLayers) {
		if (!(await fs.exists(layer.root)) || !(await fs.isDirectory(layer.root))) {
			missingRoots.push(layer.root);
		}
	}

	if (missingRoots.length > 0) {
		throw new Error(
			`Portfolio architecture roots are missing or are not directories: ${missingRoots.join(', ')}. ` +
				'Restore the canonical directories or update the portfolio-content layer definitions after an intentional move. ' +
				'The legacy src/features root is not a valid replacement for src/pages.',
		);
	}

	const layers: IPortfolioLayer[] = [];
	for (const layer of selectedLayers) {
		let observedSubLayers: string[] = [];
		try {
			const seen = await fs.readDir(layer.root);
			for (const entry of seen) {
				if (entry.startsWith('.')) continue;
				if (await fs.isDirectory(joinPath(layer.root, entry))) {
					observedSubLayers.push(entry);
				}
			}
		} catch (error) {
			throw new Error(
				`Cannot inspect portfolio architecture root "${layer.root}".${describeFsError(error)} ` +
					'Restore read access to the directory or update the portfolio-content layer definition.',
			);
		}
		observedSubLayers.sort((a, b) => a.localeCompare(b));
		layers.push({ ...layer, subLayers: observedSubLayers });
	}

	return {
		layers,
		generatedAt: new Date().toISOString(),
	};
};
