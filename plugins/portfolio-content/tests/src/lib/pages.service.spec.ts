import { describe, expect, it } from 'vitest';

import { buildFsFromFiles } from '../../helpers/in-memory-fs.helper';
import { buildPageMap } from '../../../src/lib/services/pages.service';

const fs = buildFsFromFiles({
	'src/pages/home/home.page.ts': '',
	'src/pages/home/hero/hero.component.ts': '',
	'src/pages/home/hero/hero.component.spec.ts': '',
	'src/pages/contact/contact.page.ts': '',
});

describe('buildPageMap', () => {
	it('derives pages and nested components from disk', async () => {
		const map = await buildPageMap({ fs, pagesRoot: 'src/pages' });
		expect(map.pages.map((page) => page.id)).toEqual(['contact', 'home']);
		const home = map.pages.find((page) => page.id === 'home');
		expect(home?.pageFile).toBe('src/pages/home/home.page.ts');
		expect(home?.components).toEqual([
			{ name: 'hero.component', path: 'src/pages/home/hero/hero.component.ts', subFeature: 'hero' },
		]);
	});

	it('filters by page id', async () => {
		const map = await buildPageMap({ fs, pagesRoot: 'src/pages' }, { pageId: 'contact' });
		expect(map.pages.map((page) => page.id)).toEqual(['contact']);
	});
});
