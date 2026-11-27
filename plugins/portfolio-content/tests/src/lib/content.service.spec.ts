import { describe, expect, it } from 'vitest';

import { buildFsFromFiles } from '../../helpers/in-memory-fs.helper';
import { discoverContentPaths } from '../../../src/lib/services/content.service';

const fs = buildFsFromFiles({
	'src/app/page.html': '',
	'src/pages/home/home.page.html': '',
	'src/pages/home/home.page.ts': '',
	'src/pages/legacy/old.html': '',
	'docs/extra.html': '',
});

describe('discoverContentPaths', () => {
	it('finds every html under the roots', async () => {
		const found = await discoverContentPaths({
			fs,
			roots: ['src/app', 'src/pages'],
			includeGlobs: [],
			excludeGlobs: [],
		});
		expect(found).toEqual([
			'src/app/page.html',
			'src/pages/home/home.page.html',
			'src/pages/legacy/old.html',
		]);
	});

	it('applies include and exclude globs', async () => {
		const found = await discoverContentPaths({
			fs,
			roots: ['src/app', 'src/pages'],
			includeGlobs: ['docs/*.html'],
			excludeGlobs: ['src/pages/legacy/**'],
		});
		expect(found).toContain('docs/extra.html');
		expect(found).not.toContain('src/pages/legacy/old.html');
	});
});
