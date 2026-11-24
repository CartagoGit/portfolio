/**
 * In-memory `IFileSystem` for plugin tests. The engine treats this
 * as a pure data structure so we can assert on the architecture map
 * without touching the disk.
 */

import type { IFileSystem } from '../../src/contracts/interfaces/fs.interface';

export interface IInMemoryFileSystemInit {
	/** Workspace-relative directory → list of names (files or sub-dirs). */
	readonly dirs: Readonly<Record<string, readonly string[]>>;
	/** Workspace-relative file → text content. */
	readonly files: Readonly<Record<string, string>>;
}

export const buildInMemoryFs = (init: IInMemoryFileSystemInit): IFileSystem => {
	const isDirectory = (path: string): boolean => path in init.dirs;
	const isFile = (path: string): boolean => path in init.files;
	return {
		readDir: async (path) => init.dirs[path] ?? [],
		exists: async (path) => isDirectory(path) || isFile(path),
		isDirectory: async (path) => isDirectory(path),
		readText: async (path) => {
			if (!isFile(path)) throw new Error(`ENOENT: ${path}`);
			return init.files[path] ?? '';
		},
	};
};

/** Builds the directory table from file paths, so specs list files only. */
export const buildFsFromFiles = (
	files: Readonly<Record<string, string>>,
): IFileSystem => {
	const children = new Map<string, Set<string>>();
	for (const file of Object.keys(files)) {
		const parts = file.split('/');
		for (let i = 0; i < parts.length; i += 1) {
			const dir = parts.slice(0, i).join('/');
			const set = children.get(dir) ?? new Set<string>();
			set.add(parts[i] ?? '');
			children.set(dir, set);
		}
	}
	const dirs: Record<string, readonly string[]> = {};
	for (const [dir, names] of children) if (dir !== '') dirs[dir] = [...names];
	return buildInMemoryFs({ dirs, files });
};
