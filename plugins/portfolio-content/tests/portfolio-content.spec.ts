import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import plugin from '../src/index';
import { OptionsSchema } from '../src/lib/services/options.service';
import { captureHandlers, makeFakeContext, type ToolHandler } from './helpers/fake-context.helper';

const PREFIX = 'delendai_portfolio';
const TOOLS = ['architecture', 'features', 'domain', 'scss_audit', 'public_audit', 'query'];

let root: string;

const write = (relative: string, text: string): void => {
	const file = join(root, relative);
	mkdirSync(dirname(file), { recursive: true });
	writeFileSync(file, text);
};

const register = async (options: Record<string, unknown> = {}): Promise<Map<string, ToolHandler>> => {
	const ctx = makeFakeContext(OptionsSchema.parse(options), PREFIX);
	const workspace = { root, resolve: (p: string) => join(root, p) };
	const { handlers } = await captureHandlers(plugin, { ...ctx, workspace } as typeof ctx);
	return handlers;
};

const call = async (handlers: Map<string, ToolHandler>, tool: string, args: Record<string, unknown> = {}) => {
	const handler = handlers.get(`${PREFIX}_${tool}`);
	if (!handler) throw new Error(`tool ${tool} not registered`);
	const result = await handler(args);
	return result.structuredContent ?? JSON.parse(result.content[0]?.text ?? '{}');
};

beforeEach(() => {
	root = mkdtempSync(join(tmpdir(), 'portfolio-content-'));
	write('src/app/app.component.ts', 'export class App {}');
	write('src/app/page.scss', '.hero { color: red; }\n.unused { color: blue; }\n');
	write('src/app/app.component.html', '<section class="hero">Hello</section>');
	write('src/pages/home/home.page.ts', 'export class HomePage {}');
	write('src/pages/home/home.page.html', '<p>Built for Acme Corp</p>');
	write('src/domain/profile.model.ts', 'export interface IProfile { readonly name: string }');
});

afterEach(() => rmSync(root, { recursive: true, force: true }));

describe('portfolio-content plugin', () => {
	it('registers every tool under the namespace prefix', async () => {
		const handlers = await register();
		expect([...handlers.keys()].sort()).toEqual(TOOLS.map((t) => `${PREFIX}_${t}`).sort());
	});

	it('answers every tool with an empty argument object', async () => {
		const handlers = await register();
		for (const tool of TOOLS) {
			const result = await call(handlers, tool, tool === 'query' ? { section: 'features' } : {});
			expect(result, tool).toBeTypeOf('object');
		}
	});

	it('reads the tree at call time, so a new page needs no plugin change', async () => {
		const handlers = await register();
		const before = JSON.stringify(await call(handlers, 'features'));
		expect(before).toContain('home');
		expect(before).not.toContain('contact');
		write('src/pages/contact/contact.page.ts', 'export class ContactPage {}');
		expect(JSON.stringify(await call(handlers, 'features'))).toContain('contact');
	});

	it('maps the source directories as layers', async () => {
		const map = JSON.stringify(await call(await register(), 'architecture'));
		for (const layer of ['app', 'pages', 'domain']) expect(map).toContain(layer);
	});

	it('flags a forbidden term in a public template', async () => {
		const handlers = await register({ forbiddenTerms: ['Acme Corp'] });
		expect(JSON.stringify(await call(handlers, 'public_audit'))).toContain('Acme Corp');
	});

	it('projects bounded query evidence and reuses unchanged indexed files', async () => {
		const handlers = await register();
		const first = await call(handlers, 'query', { section: 'features', fields: ['id'], limit: 1, tokenBudget: 400 });
		const second = await call(handlers, 'query', { section: 'features', fields: ['id'], limit: 1, tokenBudget: 400 });
		expect(first.items[0]).toHaveProperty('id');
		expect(Object.keys(first.items[0] ?? {})).toEqual(['id']);
		expect(first.tokenEstimate).toBeLessThanOrEqual(400);
		expect(second.cache.reusedFiles).toBeGreaterThan(0);
	});

	it('projects every direct tool response with the same bounded pagination contract', async () => {
		const handlers = await register({ forbiddenTerms: ['Acme Corp'] });
		const cases = [
			['architecture', 'layers', 'id'],
			['features', 'pages', 'id'],
			['domain', 'contracts', 'name'],
			['scss_audit', 'entries', 'selector'],
			['public_audit', 'findings', 'id'],
		] as const;
		for (const [tool, collection, field] of cases) {
			const result = await call(handlers, tool, { fields: [field], limit: 1, tokenBudget: 400 });
			expect(result[collection], tool).toHaveLength(1);
			expect(Object.keys(result[collection][0] ?? {})).toEqual([field]);
			expect(result.count, tool).toBe(1);
			expect(result.total, tool).toBeGreaterThanOrEqual(1);
			expect(result.tokenEstimate, tool).toBeLessThanOrEqual(400);
			expect(result).toHaveProperty('offset', 0);
			expect(result).toHaveProperty('truncated');
		}
	});
});
