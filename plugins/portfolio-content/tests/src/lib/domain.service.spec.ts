import { describe, expect, it } from 'vitest';

import { buildFsFromFiles } from '../../helpers/in-memory-fs.helper';
import { buildDomainMap, parseDomainSource } from '../../../src/lib/services/domain.service';

const SOURCE = [
	"export type PageId = 'home' | 'work';",
	'export interface IThing {',
	'  readonly id: string;',
	'}',
	'export const LIMIT = 3;',
	"export type Multi =",
	"  | 'a'",
	"  | 'b';",
	'const hidden = 1;',
].join('\n');

describe('domain.service', () => {
	it('parses exported unions, interfaces and consts, not private ones', () => {
		const found = parseDomainSource(SOURCE, 'src/domain/x.ts');
		expect(found.map((c) => c.name)).toEqual(['PageId', 'IThing', 'LIMIT', 'Multi']);
		expect(found[0]?.members).toEqual(['home', 'work']);
		expect(found[3]?.members).toEqual(['a', 'b']);
	});

	it('reads every non-spec ts file under the domain root', async () => {
		const fs = buildFsFromFiles({
			'src/domain/x.ts': SOURCE,
			'src/domain/x.spec.ts': "export type Skipped = 'z';",
		});
		const map = await buildDomainMap({ fs, domainRoot: 'src/domain' });
		expect(map.contracts.map((c) => c.name)).not.toContain('Skipped');
		const unions = await buildDomainMap({ fs, domainRoot: 'src/domain' }, { kind: 'union' });
		expect(unions.contracts.every((c) => c.kind === 'union')).toBe(true);
	});
});
