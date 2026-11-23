/**
 * Discovers the public templates to audit at call time: every `*.html`
 * under the configured roots, plus include globs, minus exclude globs.
 */

import type { IFileSystem } from '../../contracts/interfaces/fs.interface';
import { walkFiles } from './fs.service';
import { matchesAnyGlob } from './glob.service';

export interface IDiscoverContentOptions {
	readonly fs: IFileSystem;
	readonly roots: readonly string[];
	readonly includeGlobs: readonly string[];
	readonly excludeGlobs: readonly string[];
}

export const discoverContentPaths = async (
	options: IDiscoverContentOptions,
): Promise<readonly string[]> => {
	const { fs, roots, includeGlobs, excludeGlobs } = options;
	const found = new Set<string>();
	for (const root of roots) {
		for (const file of await walkFiles(fs, root)) {
			if (file.endsWith('.html')) found.add(file);
		}
	}
	if (includeGlobs.length > 0) {
		// Include globs are workspace-relative, so scan the first path
		// segment of every glob (or the whole workspace root when absent).
		const scanRoots = new Set(
			includeGlobs.map((glob) => {
				const literal = glob.split('/').findIndex((part) => /[*?]/.test(part));
				const head = literal < 0 ? glob.split('/').slice(0, -1) : glob.split('/').slice(0, literal);
				return head.join('/');
			}),
		);
		for (const root of scanRoots) {
			const files = root === '' ? [] : await walkFiles(fs, root);
			for (const file of files) {
				if (matchesAnyGlob(file, includeGlobs)) found.add(file);
			}
		}
		for (const glob of includeGlobs) {
			if (!/[*?]/.test(glob) && (await fs.exists(glob))) found.add(glob);
		}
	}
	return [...found]
		.filter((file) => !matchesAnyGlob(file, excludeGlobs))
		.sort((a, b) => a.localeCompare(b));
};
