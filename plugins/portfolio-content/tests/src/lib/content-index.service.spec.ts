import { describe, expect, it, vi } from 'vitest';
import type { IFileSystem } from '../../../src/contracts/interfaces/fs.interface';
import { ContentIndexService } from '../../../src/lib/services/content-index.service';

function indexedFs(initial: Record<string, string>): IFileSystem & { set(path: string, value: string, mtime: number): void } {
	const files = new Map(Object.entries(initial));
	const mtimes = new Map([...files].map(([path], index) => [path, index + 1]));
	return {
		readDir: vi.fn(async () => []),
		exists: vi.fn(async (path) => files.has(path)),
		isDirectory: vi.fn(async () => false),
		readText: vi.fn(async (path) => files.get(path) ?? ''),
		readMetadata: vi.fn(async (path) => ({ size: (files.get(path) ?? '').length, mtimeMs: mtimes.get(path) ?? 0 })),
		set(path, value, mtime) { files.set(path, value); mtimes.set(path, mtime); },
	};
}

describe('ContentIndexService', () => {
	it('reuses unchanged inputs and invalidates only changed sections', async () => {
		const fs = indexedFs({ 'src/pages/home/home.html': '<p>one</p>', 'src/pages/work/work.html': '<p>two</p>' });
		const index = new ContentIndexService(fs);
		const request = { paths: ['src/pages/home/home.html', 'src/pages/work/work.html'], ownerSection: (path: string) => path.split('/')[2] ?? 'unknown' };
		const first = await index.synchronize(request);
		const second = await index.synchronize(request);
		fs.set('src/pages/work/work.html', '<p>changed</p>', 9);
		const third = await index.synchronize(request);
		expect(first.changedPaths).toHaveLength(2);
		expect(second.reusedPaths).toHaveLength(2);
		expect(third.changedPaths).toEqual(['src/pages/work/work.html']);
		expect(third.reusedPaths).toEqual(['src/pages/home/home.html']);
		expect(third.entries.find(({ path }) => path.endsWith('work.html'))?.ownerSection).toBe('work');
	});

	it('rejects corrupt snapshots and deterministically rebuilds on the next sync', async () => {
		const fs = indexedFs({ 'src/pages/home/home.html': '<p>one</p>' });
		const index = new ContentIndexService(fs);
		expect(index.restore({ version: 1, entries: [{ digest: 42 }] })).toBe(false);
		const update = await index.synchronize({ paths: ['src/pages/home/home.html'], ownerSection: () => 'home' });
		expect(update.entries[0]?.digest).toMatch(/^[a-f0-9]{64}$/);
	});
});
