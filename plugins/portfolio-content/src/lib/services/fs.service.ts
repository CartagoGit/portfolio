/**
 * File-system adapters and tree walking shared by every service.
 */

import { isAbsolute, relative, resolve, win32 } from 'node:path';
import { normalize as normalizePosix } from 'node:path/posix';
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
	const root = await loader.realpath(resolve(workspaceRoot));
	const lexical = (relativePath: string): string => {
		const safePath = assertWorkspaceRelativePath(relativePath);
		const target = resolve(root, safePath);
		if (!isInside(root, target)) throw new WorkspaceBoundaryError(relativePath);
		return target;
	};
	const real = async (relativePath: string): Promise<string> => {
		const target = lexical(relativePath);
		const canonical = await loader.realpath(target);
		if (!isInside(root, canonical)) throw new WorkspaceBoundaryError(relativePath);
		return canonical;
	};
	return {
		readDir: async (relativePath) => {
			const entries = await loader.readdir(await real(relativePath), { withFileTypes: true });
			return entries.map((entry) => entry.name).sort((a, b) => a.localeCompare(b));
		},
		exists: async (relativePath) => {
			lexical(relativePath);
			try {
				await real(relativePath);
				return true;
			} catch (error) {
				if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false;
				throw error;
			}
		},
		isDirectory: async (relativePath) => {
			try {
				return (await loader.stat(await real(relativePath))).isDirectory();
			} catch (error) {
				if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false;
				throw error;
			}
		},
		readMetadata: async (relativePath) => {
			const stat = await loader.stat(await real(relativePath));
			return { size: stat.size, mtimeMs: stat.mtimeMs };
		},
		readText: async (relativePath) => loader.readFile(await real(relativePath), 'utf8'),
	};
};

export class WorkspaceBoundaryError extends Error {
	constructor(path: string) {
		super(`Path escapes workspace boundary: ${path}`);
		this.name = 'WorkspaceBoundaryError';
	}
}

/** Validates and canonicalizes a workspace-relative `/` path. */
export const assertWorkspaceRelativePath = (path: string): string => {
	const slashPath = path.replaceAll('\\', '/');
	if (
		path.includes('\0') ||
		isAbsolute(path) ||
		win32.isAbsolute(path) ||
		slashPath.startsWith('/') ||
		slashPath.split('/').includes('..')
	)
		throw new WorkspaceBoundaryError(path);
	const normalized = normalizePosix(slashPath);
	if (normalized === '..' || normalized.startsWith('../'))
		throw new WorkspaceBoundaryError(path);
	return normalized === '.' ? '' : normalized.replace(/^\.\//, '');
};

const isInside = (root: string, target: string): boolean => {
	const pathFromRoot = relative(root, target);
	return pathFromRoot === '' || (!pathFromRoot.startsWith('..') && !isAbsolute(pathFromRoot));
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
	root = assertWorkspaceRelativePath(root);
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
	root = assertWorkspaceRelativePath(root);
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
		readMetadata: async (path) => {
			const fs = await get();
			if (!fs.readMetadata) throw new Error('File metadata is unavailable.');
			return fs.readMetadata(path);
		},
		readText: async (path) => (await get()).readText(path),
	};
};
