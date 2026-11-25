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

	it('flags duplicates as info and treats missing coverage as a blocker', async () => {
		const report = await runPublicAudit({
			...base,
			forbiddenTerms: [],
			perSeRoots: [],
			contentPaths: ['b.html', 'b.html', 'gone.html'],
		});
		expect(report.findings.map((f) => f.id)).toEqual(['duplicated-content', 'missing-content']);
		expect(report.coverage).toEqual({ requested: 3, read: 1, missing: 1, unreadable: 0, duplicates: 1 });
		expect(report.ok).toBe(false);
	});

	it('fails closed when discovery returns no templates', async () => {
		const report = await runPublicAudit({ ...base, forbiddenTerms: [], perSeRoots: [], contentPaths: [] });
		expect(report.ok).toBe(false);
		expect(report.findings[0]?.id).toBe('coverage-empty');
		expect(report.nextAction).toContain('no readable content');
	});

	it('rejects workspace traversal deterministically', async () => {
		await expect(runPublicAudit({ ...base, contentPaths: ['../secret.html'] }))
			.rejects.toThrow('Path escapes workspace boundary: ../secret.html');
	});
});
