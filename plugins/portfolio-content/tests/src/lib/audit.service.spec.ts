import { describe, expect, it } from 'vitest';

import { buildFsFromFiles } from '../../helpers/in-memory-fs.helper';
import { runPublicAudit } from '../../../src/lib/services/audit.service';
import { WorkspaceBoundaryError } from '../../../src/lib/services/fs.service';

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
		expect(report.coverage).toEqual({ requested: 3, read: 1, missing: 1, unreadable: 0, invalid: 0, duplicates: 1 });
		expect(report.ok).toBe(false);
	});

	it('fails closed when discovery returns no templates', async () => {
		const report = await runPublicAudit({ ...base, forbiddenTerms: [], perSeRoots: [], contentPaths: [] });
		expect(report.ok).toBe(false);
		expect(report.findings[0]?.id).toBe('coverage-empty');
		expect(report.nextAction).toContain('no readable content');
	});

	it('rejects workspace traversal as a deterministic finding', async () => {
		const report = await runPublicAudit({ ...base, contentPaths: ['../secret.html'] });
		expect(report.ok).toBe(false);
		expect(report.coverage.invalid).toBe(1);
		expect(report.findings[0]?.id).toBe('path-escape');
	});

	it('records path escapes and preserves findings from readable content', async () => {
		const report = await runPublicAudit({
			...base,
			contentPaths: ['a.html', '../secret.html', 'b.html'],
		});
		expect(report.ok).toBe(false);
		expect(report.findings.map((finding) => finding.id)).toEqual(expect.arrayContaining([
			'private-term',
			'path-escape',
			'per-se-root',
		]));
		expect(report.coverage).toEqual({ requested: 3, read: 2, missing: 0, unreadable: 0, invalid: 1, duplicates: 0 });
		expect(report.nextAction).toContain('coverage is incomplete');
	});

	it('converts a reader boundary failure into a path finding and continues', async () => {
		const reader = {
			exists: async (path: string) => {
				if (path === 'escape/secret.html') throw new WorkspaceBoundaryError(path);
				return path === 'a.html';
			},
			readText: async (path: string) => path === 'a.html'
				? '<p>Acme Corp</p>'
				: Promise.reject(new Error('not readable')),
		};
		const report = await runPublicAudit({
			...base,
			reader,
			perSeRoots: [],
			contentPaths: ['escape/secret.html', 'a.html'],
		});
		expect(report.coverage).toEqual({ requested: 2, read: 1, missing: 0, unreadable: 0, invalid: 1, duplicates: 0 });
		expect(report.findings.map((finding) => finding.id)).toEqual(['path-escape', 'private-term']);
	});

	it('normalizes safe paths before duplicate tracking', async () => {
		const report = await runPublicAudit({
			...base,
			forbiddenTerms: [],
			perSeRoots: [],
			contentPaths: ['./b.html', 'b.html'],
		});
		expect(report.coverage).toEqual({ requested: 2, read: 1, missing: 0, unreadable: 0, invalid: 0, duplicates: 1 });
		expect(report.findings.map((finding) => finding.id)).toEqual(['duplicated-content']);
	});

	it('reports unreadable files without claiming complete coverage', async () => {
		const reader = {
			exists: async () => true,
			readText: async () => { throw new Error('permission denied'); },
		};
		const report = await runPublicAudit({ ...base, reader, contentPaths: ['locked.html'] });
		expect(report.ok).toBe(false);
		expect(report.coverage).toEqual({ requested: 1, read: 0, missing: 0, unreadable: 1, invalid: 0, duplicates: 0 });
		expect(report.findings[0]?.id).toBe('unreadable-content');
		expect(report.nextAction).toContain('no readable content');
	});
});
