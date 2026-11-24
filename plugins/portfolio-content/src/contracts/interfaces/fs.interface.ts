/**
 * Narrow read-only file-system port shared by every introspection
 * service. All paths are workspace-relative with `/` separators; the
 * production adapter anchors them to the workspace root, tests inject
 * an in-memory tree.
 */
export interface IFileSystem {
	readonly readDir: (workspaceRelative: string) => Promise<readonly string[]>;
	readonly exists: (workspaceRelative: string) => Promise<boolean>;
	readonly isDirectory: (workspaceRelative: string) => Promise<boolean>;
	readonly readText: (workspaceRelative: string) => Promise<string>;
}
