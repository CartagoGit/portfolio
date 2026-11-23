/**
 * File-system adapters and tree walking shared by every service.
 */

import { join } from 'node:path';

import type { IFileSystem } from '../../contracts/interfaces/fs.interface';

const SKIPPED_DIRECTORIES = new Set(['node_modules', 'dist', 'coverage']);

/** Directories never descended into: dot-folders and build output. */
export const isSkippedEntry = (name: string): boolean =>
	name.startsWith('.') || SKIPPED_DIRECTORIES.has(name);

/** Node-backed {@link IFileSystem} anchored to an absolute workspace root. */
export const buildNodeFileSystem = async (
	workspaceRoot: string,
): Promise<IFileSystem> => {
	const loader = await import('node:fs/promises');
	const abs = (relative: string): string => join(workspaceRoot, relative);
	return {
		readDir: async (relative) => {
			const entries = await loader.readdir(abs(relative), { withFileTypes: true });
			return entries.map((entry) => entry.name).sort((a, b) => a.localeCompare(b));
		},
		exists: async (relative) => {
			try {
				await loader.access(abs(relative));
				return true;
			} catch {
				return false;
			}
		},
		isDirectory: async (relative) => {
			try {
				return (await loader.stat(abs(relative))).isDirectory();
			} catch {
				return false;
			}
		},
		readText: async (relative) => loader.readFile(abs(relative), 'utf8'),
	};
};

export const joinPath = (...segments: readonly string[]): string =>
	segments
		.map((segment) => segment.replace(/^\/+|\/+$/g, ''))
		.filter(Boolean)
		.join('/');

/** Names of the immediate sub-directories of `root`, sorted. */
export const listDirectories = async (
	fs: IFileSystem,
	root: string,
): Promise<readonly string[]> => {
	if (!(await fs.isDirectory(root))) return [];
	const found: string[] = [];
	for (const name of await fs.readDir(root)) {
		if (isSkippedEntry(name)) continue;
		if (await fs.isDirectory(joinPath(root, name))) found.push(name);
	}
	return found.sort((a, b) => a.localeCompare(b));
};

/** Every file under `root` (workspace-relative paths), sorted. */
export const walkFiles = async (
	fs: IFileSystem,
	root: string,
): Promise<readonly string[]> => {
	if (!(await fs.isDirectory(root))) return [];
	const files: string[] = [];
	for (const name of await fs.readDir(root)) {
		if (isSkippedEntry(name)) continue;
		const path = joinPath(root, name);
		if (await fs.isDirectory(path)) files.push(...(await walkFiles(fs, path)));
		else files.push(path);
	}
	return files.sort((a, b) => a.localeCompare(b));
};

/** {@link buildNodeFileSystem}, created on first use. */
export const buildLazyFileSystem = (workspaceRoot: string): IFileSystem => {
	let pending: Promise<IFileSystem> | undefined;
	const get = (): Promise<IFileSystem> =>
		(pending ??= buildNodeFileSystem(workspaceRoot));
	return {
		readDir: async (path) => (await get()).readDir(path),
		exists: async (path) => (await get()).exists(path),
		isDirectory: async (path) => (await get()).isDirectory(path),
		readText: async (path) => (await get()).readText(path),
	};
};
