export interface IContentIndexEntry {
	readonly path: string;
	readonly digest: string;
	readonly ownerSection: string;
	readonly size: number;
	readonly mtimeMs?: number;
}

export interface IContentIndexSnapshot {
	readonly version: 1;
	readonly entries: readonly IContentIndexEntry[];
}

export interface IContentIndexUpdate {
	readonly entries: readonly IContentIndexEntry[];
	readonly changedPaths: readonly string[];
	readonly reusedPaths: readonly string[];
	readonly removedPaths: readonly string[];
}

export interface IContentIndexRequest {
	readonly paths: readonly string[];
	readonly ownerSection: (path: string) => string;
}
