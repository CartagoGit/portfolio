import { describe, expect, it } from 'vitest';

import { buildFsFromFiles } from '../../helpers/in-memory-fs.helper';
import { runPublicAudit } from '../../../src/lib/services/audit.service';

const fs = buildFsFromFiles({
	'a.html': '<p>ok</p>\n<p>Worked at Acme Corp</p>\n<!-- TODO(image): hero -->',
	'b.html': '<p>acme-dev</p>',
});

const base = { forbiddenTerms: ['Acme Corp'], perSeRoots: ['acme'], locale: 'en' as const, reader: fs };

describe('runPublicAudit', () => {
	it('reports private terms, per-se roots and image todos with lines', async () => {
		const report = await runPublicAudit({ ...base, contentPaths: ['a.html'] });
		const ids = report.findings.map((f) => f.id);
		expect(ids).toEqual(['private-term', 'per-se-root', 'image-todo']);
		expect(report.findings[0]?.location.line).toBe(2);
		expect(report.ok).toBe(false);
	});

	it('collapses separators for per-se roots', async () => {
		const report = await runPublicAudit({ ...base, forbiddenTerms: [], contentPaths: ['b.html'] });
		expect(report.findings.map((f) => f.id)).toEqual(['per-se-root']);
	});

	it('flags duplicated and missing paths as info', async () => {
		const report = await runPublicAudit({
			...base,
			forbiddenTerms: [],
			perSeRoots: [],
			contentPaths: ['b.html', 'b.html', 'gone.html'],
		});
		expect(report.findings.map((f) => f.id)).toEqual(['duplicated-content', 'missing-content']);
		expect(report.ok).toBe(true);
	});

	it('localises the next action', async () => {
		const report = await runPublicAudit({ ...base, locale: 'es', contentPaths: ['a.html'] });
		expect(report.nextAction).toContain('employers');
	});
});
