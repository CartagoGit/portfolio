import { describe, expect, it } from 'vitest';

import { buildFsFromFiles } from '../../helpers/in-memory-fs.helper';
import { buildArchitectureMap } from '../../../src/lib/services/architecture.service';

const fs = buildFsFromFiles({
	'src/core/a.ts': '',
	'src/core/http/b.ts': '',
	'src/shared/c.ts': '',
	'src/main.ts': '',
});

describe('buildArchitectureMap', () => {
	it('derives layers from the directories on disk', async () => {
		const map = await buildArchitectureMap({ fs, sourceRoot: 'src' });
		expect(map.layers.map((layer) => layer.id)).toEqual(['core', 'shared']);
	});

	it('lists sub-layers and reflects a new directory with no config', async () => {
		const grown = buildFsFromFiles({ 'src/core/http/b.ts': '', 'src/extra/x.ts': '' });
		const map = await buildArchitectureMap({ fs: grown, sourceRoot: 'src' });
		expect(map.layers.map((layer) => layer.id)).toEqual(['core', 'extra']);
		const core = map.layers.find((layer) => layer.id === 'core');
		expect(JSON.stringify(core)).toContain('http');
	});

	it('returns no layers when the root is missing', async () => {
		const map = await buildArchitectureMap({ fs, sourceRoot: 'nope' });
		expect(map.layers).toEqual([]);
	});
});
