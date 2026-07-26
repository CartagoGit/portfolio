/**
 * Shared file-system interface used by every introspection engine.
 * Kept narrow on purpose — the engines only need readDir, exists,
 * readText, and a directory test.
 */
export interface IFileSystem {
	readonly readDir: (workspaceRelative: string) => Promise<readonly string[]>;
	readonly exists: (workspaceRelative: string) => Promise<boolean>;
	readonly isDirectory: (workspaceRelative: string) => Promise<boolean>;
	readonly readText: (workspaceRelative: string) => Promise<string>;
}
