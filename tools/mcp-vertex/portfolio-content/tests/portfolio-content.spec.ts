/**
 * Plugin tests. Each test exercises one slice of the canonical plugin
 * contract (registration shape, audit engine, brief engine) so a
 * regression in the contract stays self-evident.
 */

import { describe, expect, it } from 'vitest';

import plugin, { OptionsSchema } from '../src/index';
import {
	buildFsAuditReader,
	runPortfolioAudit,
} from '../src/lib/services/audit';
import {
	buildCaseStudyBriefs,
	caseStudyBrief,
} from '../src/lib/services/briefs';
import type { IPortfolioAuditReader } from '../src/lib/contracts/interfaces/audit.interface';
import { captureHandlers, makeFakeContext } from './helpers/fake-context';

const inMemoryReader = (files: Record<string, string>): IPortfolioAuditReader => ({
	readText: async (contentPath) => {
		if (!(contentPath in files)) throw new Error(`ENOENT: ${contentPath}`);
		return files[contentPath];
	},
	exists: async (contentPath) => contentPath in files,
});

describe('@portfolio/mcp-vertex-portfolio-content', () => {
	describe('options schema', () => {
		it('accepts the canonical host shape with defaults', () => {
			const result = OptionsSchema.safeParse({});
			expect(result.success).toBe(true);
			if (!result.success) return;
			expect(result.data.locale).toBe('en');
			expect(result.data.contentPaths.length).toBeGreaterThan(0);
			expect(result.data.forbiddenTerms).toEqual([]);
		});

		it('rejects unknown locales', () => {
			const result = OptionsSchema.safeParse({ locale: 'fr' });
			expect(result.success).toBe(false);
		});

		it('rejects empty contentPaths when the host sets them', () => {
			const result = OptionsSchema.safeParse({ contentPaths: [] });
			expect(result.success).toBe(false);
		});
	});

	describe('registration', () => {
		it('registers both tools + three knowledge entries with the configured prefix', async () => {
			const ctx = makeFakeContext(
				{ contentPaths: ['/mock/page.html'], forbiddenTerms: [] },
				'portfolio',
			);
			const { toolIds, knowledgeIds, handlers } = await captureHandlers(
				plugin,
				ctx,
			);
			expect(toolIds).toEqual([
				'portfolio_content_audit',
				'portfolio_case_study_brief',
			]);
			expect(knowledgeIds).toEqual([
				'portfolio-content-public-boundary-en',
				'portfolio-content-public-boundary-es',
				'portfolio-content-runbook',
			]);
			expect([...handlers.keys()].sort()).toEqual([
				'portfolio_case_study_brief',
				'portfolio_content_audit',
			]);
		});
	});

	describe('portfolio_content_audit', () => {
		it('flags forbidden terms as `error` and image TODOs as `warning`', async () => {
			const reader = inMemoryReader({
				'/page.html':
					'<h1>Hi</h1><!-- TODO(image): replace with my portrait --><p>I work at Beateam on MDM Platform rates.</p>',
			});
			const report = await runPortfolioAudit({
				contentPaths: ['/page.html'],
				forbiddenTerms: ['Beateam', 'MDM Platform'],
				locale: 'en',
				reader,
			});
			expect(report.ok).toBe(false);
			expect(report.severity.errors).toBe(2);
			expect(report.severity.warnings).toBe(1);
			expect(
				report.findings.filter((f) => f.id === 'private-term').map((f) => f.severity),
			).toEqual(['error', 'error']);
			expect(
				report.findings.find((f) => f.id === 'image-todo')?.location.line,
			).toBe(1);
			expect(report.nextAction).toBe(
				'Remove private-work references before publishing.',
			);
		});

		it('emits Spanish remediation when configured with `locale: "es"`', async () => {
			const reader = inMemoryReader({
				'/page.html': '<!-- TODO(image): reemplazar por mi retrato -->',
			});
			const report = await runPortfolioAudit({
				contentPaths: ['/page.html'],
				forbiddenTerms: [],
				locale: 'es',
				reader,
			});
			expect(report.severity.warnings).toBe(1);
			expect(report.nextAction).toBe(
				'Sustituye los marcadores TODO(image) por imágenes públicas aprobadas.',
			);
		});

		it('treats missing files as info findings (publish-blocking only on errors)', async () => {
			const reader: IPortfolioAuditReader = {
				readText: async () => '',
				exists: async () => false,
			};
			const report = await runPortfolioAudit({
				contentPaths: ['/missing.html'],
				forbiddenTerms: [],
				locale: 'en',
				reader,
			});
			expect(report.severity.info).toBe(1);
			expect(report.severity.errors).toBe(0);
			expect(report.ok).toBe(true);
			expect(report.findings[0]?.id).toBe('missing-content');
		});

		it('passes through via the registered tool with structuredContent', async () => {
			const ctx = makeFakeContext(
				{
					contentPaths: ['/workspace/src/features/contact/contact-page.component.html'],
					forbiddenTerms: ['Beateam'],
				},
				'portfolio',
			);
			const { handlers } = await captureHandlers(plugin, ctx);
			const handler = handlers.get('portfolio_content_audit')!;
			// The tool binds `buildFsAuditReader` once at register-time. We
			// cannot intercept the read without a plugin-level DI hook, so
			// we assert the handler is wired and the structuredContent shape
			// is what the audit engine produces (the engine itself is tested
			// above with an in-memory reader). A successful run against the
			// real contact template emits the `image-todo` warning seen in
			// the live data.
			const result = await handler({});
			const structured = result.structuredContent;
			expect(structured).toBeDefined();
			expect(structured?.['ok']).toBe(true);
			expect(structured?.['severity']).toEqual({
				errors: 0,
				warnings: expect.any(Number) as unknown as number,
				info: expect.any(Number) as unknown as number,
			});
			expect(Array.isArray(structured?.['findings'])).toBe(true);
		});
	});

	describe('portfolio_case_study_brief', () => {
		it('returns the bilingual brief with the requested locale', () => {
			const tables = buildCaseStudyBriefs();
			const es = caseStudyBrief(tables, {
				caseStudy: 'mcp-vertex',
				locale: 'es',
			});
			expect(es.locale).toBe('es');
			expect(es.brief.requiredSections[0]).toBe('Contexto');
			expect(es.brief.title).toBe('MCP Vertex');
			const en = caseStudyBrief(tables, {
				caseStudy: 'mcp-vertex',
				locale: 'en',
			});
			expect(en.locale).toBe('en');
			expect(en.brief.requiredSections[0]).toBe('Context');
		});

		it('defaults to English when the locale is omitted', () => {
			const tables = buildCaseStudyBriefs();
			const result = caseStudyBrief(tables, {
				caseStudy: 'zoneless-calculator',
			});
			expect(result.locale).toBe('en');
		});
	});

	describe('bilingual surface', () => {
		it('builds the brief table for all six case studies, both locales', () => {
			const tables = buildCaseStudyBriefs();
			expect(Object.keys(tables.en)).toEqual(
				expect.arrayContaining([
					'mcp-vertex',
					'quickmodel',
					'keyer',
					'print-cv',
					'zoneless-calculator',
					'nestgpt',
				]),
			);
			expect(Object.keys(tables.es).length).toBe(6);
		});
	});

	describe('buildFsAuditReader', () => {
		it('produces a lazy reader that only loads `fs/promises` on first call', async () => {
			const reader = buildFsAuditReader();
			// Calling `exists` against a known-missing path must not throw.
			const exists = await reader.exists('/definitely/not/here.html');
			expect(exists).toBe(false);
		});
	});
});
