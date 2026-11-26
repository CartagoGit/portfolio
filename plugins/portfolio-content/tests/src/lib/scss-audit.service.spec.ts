import { describe, expect, it } from 'vitest';

import { buildFsFromFiles } from '../../helpers/in-memory-fs.helper';
import { runScssAudit } from '../../../src/lib/services/scss-audit.service';

const fs = buildFsFromFiles({
	'src/app/page.scss': `@use 'tokens';
@use 'missing/theme';
.a { color: red; }
.b { margin: 0.5rem; }
.c {}
/* .d { } */`,
	'src/app/_tokens.scss': `@use 'palette';
.token { color: var(--token); }`,
	'src/styles/palette/_index.scss': ':root { --token: red; }',
	'src/pages/one/one.html': '<div class="a b"></div>',
	'src/pages/two/two.html': '<section>\n  <div class="b"></div>\n</section>',
});

describe('runScssAudit', () => {
	it('classifies selectors by how many directories use them', async () => {
		const report = await runScssAudit(
			{ fs },
			{ sourcePath: 'src/app/page.scss', templateRoots: ['src/pages'] },
		);
		const byClass = Object.fromEntries(report.entries.map((e) => [e.className, e.status]));
		expect(byClass).toEqual({ a: 'single', b: 'shared', c: 'unused' });
		expect(report.counts).toEqual({ unused: 1, single: 1, shared: 1 });
		expect(report.entries.find((e) => e.className === 'b')?.owners).toEqual([
			'src/pages/one',
			'src/pages/two',
		]);
		expect(report.entries.find((e) => e.className === 'b')?.ownerLocations).toEqual([
			{ directory: 'src/pages/one', filePath: 'src/pages/one/one.html', line: 1 },
			{ directory: 'src/pages/two', filePath: 'src/pages/two/two.html', line: 2 },
		]);
	});

	it('resolves reachable partials transitively and preserves unresolved line evidence', async () => {
		const report = await runScssAudit(
			{ fs },
			{ sourcePath: 'src/app/page.scss', templateRoots: ['src/pages'] },
		);
		expect(report.dependencies).toEqual([
			{ kind: 'use', target: 'tokens', line: 1, importedBy: 'src/app/page.scss', depth: 0, resolvedPath: 'src/app/_tokens.scss' },
			{ kind: 'use', target: 'missing/theme', line: 2, importedBy: 'src/app/page.scss', depth: 0 },
			{ kind: 'use', target: 'palette', line: 1, importedBy: 'src/app/_tokens.scss', depth: 1, resolvedPath: 'src/styles/palette/_index.scss' },
		]);
		expect(report.nextAction).toContain('Resolve missing SCSS partials');
	});
});
