/**
 * In-memory `IFileSystem` for plugin tests. The engine treats this
 * as a pure data structure so we can assert on the architecture map
 * without touching the disk.
 */

import type { IFileSystem } from '../../src/lib/contracts/interfaces/fs.interface';

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
