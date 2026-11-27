import type {
	IContentIndexEntry,
	IContentIndexSnapshot,
	IContentIndexUpdate,
	IContentIndexRequest,
} from '../../contracts/interfaces/content-index.interface';
import type { IFileSystem } from '../../contracts/interfaces/fs.interface';
import { contentDigest } from '../helpers/content-hash.helper';
import { assertWorkspaceRelativePath } from './fs.service';

interface ICachedEntry extends IContentIndexEntry {
	readonly metadataSignature?: string;
}

const validEntry = (value: unknown): value is IContentIndexEntry => {
	if (!value || typeof value !== 'object') return false;
	const entry = value as Record<string, unknown>;
	return typeof entry['path'] === 'string' &&
		typeof entry['digest'] === 'string' &&
		typeof entry['ownerSection'] === 'string' &&
		typeof entry['size'] === 'number' && Number.isFinite(entry['size']);
};

/** Bounded in-memory index; stable metadata avoids rereading unchanged sources. */
export class ContentIndexService {
	private readonly cache = new Map<string, ICachedEntry>();

	constructor(private readonly fs: IFileSystem) {}

	async synchronize(request: IContentIndexRequest): Promise<IContentIndexUpdate> {
		const paths = [...new Set(request.paths.map(assertWorkspaceRelativePath))].sort();
		const requested = new Set(paths);
		const changedPaths: string[] = [];
		const reusedPaths: string[] = [];
		for (const path of paths) {
			const metadata = this.fs.readMetadata ? await this.fs.readMetadata(path) : undefined;
			const metadataSignature = metadata ? `${metadata.size}:${metadata.mtimeMs}` : undefined;
			const prior = this.cache.get(path);
			if (prior && metadataSignature && prior.metadataSignature === metadataSignature) {
				reusedPaths.push(path);
				continue;
			}
			const source = await this.fs.readText(path);
			this.cache.set(path, {
				path,
				digest: contentDigest(source),
				ownerSection: request.ownerSection(path),
				size: metadata?.size ?? new TextEncoder().encode(source).byteLength,
				...(metadata ? { mtimeMs: metadata.mtimeMs } : {}),
				...(metadataSignature ? { metadataSignature } : {}),
			});
			changedPaths.push(path);
		}
		const removedPaths = [...this.cache.keys()].filter((path) => !requested.has(path));
		for (const path of removedPaths) this.cache.delete(path);
		return {
			entries: paths.map((path) => this.cache.get(path)).filter((entry): entry is ICachedEntry => Boolean(entry)),
			changedPaths,
			reusedPaths,
			removedPaths,
		};
	}

	snapshot(): IContentIndexSnapshot {
		return {
			version: 1,
			entries: [...this.cache.values()].map(({ metadataSignature: _signature, ...entry }) => entry),
		};
	}

	/** Returns false for malformed/corrupt snapshots; next sync rebuilds deterministically. */
	restore(snapshot: unknown): boolean {
		if (!snapshot || typeof snapshot !== 'object') return false;
		const candidate = snapshot as { version?: unknown; entries?: unknown };
		if (candidate.version !== 1 || !Array.isArray(candidate.entries) || !candidate.entries.every(validEntry)) return false;
		this.cache.clear();
		for (const entry of candidate.entries as IContentIndexEntry[])
			this.cache.set(entry.path, { ...entry });
		return true;
	}
}
