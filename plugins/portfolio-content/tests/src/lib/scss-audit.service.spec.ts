import { describe, expect, it } from 'vitest';

import { buildFsFromFiles } from '../../helpers/in-memory-fs.helper';
import { runScssAudit } from '../../../src/lib/services/scss-audit.service';

const fs = buildFsFromFiles({
	'src/app/page.scss': '.a { color: red; }\n.b { margin: 0.5rem; }\n.c {}\n/* .d { } */',
	'src/pages/one/one.html': '<div class="a b"></div>',
	'src/pages/two/two.html': '<div class="b"></div>',
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
	});
});
