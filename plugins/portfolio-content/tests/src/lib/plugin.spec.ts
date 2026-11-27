import { describe, expect, it } from 'vitest';

import plugin from '../../../src/index';
import { captureHandlers, makeFakeContext } from '../../helpers/fake-context.helper';

describe('portfolio-content plugin', () => {
	it('declares the id and a required optionsSchema', () => {
		expect(plugin.name).toBe('portfolio-content');
		expect(plugin.optionsSchema).toBeDefined();
	});

	it('registers every tool as <namespacePrefix>_<id>', async () => {
		const ctx = makeFakeContext();
		const { toolIds, handlers, knowledgeIds } = await captureHandlers(plugin, ctx);
		expect(toolIds.sort()).toEqual(
			['architecture', 'domain', 'features', 'public_audit', 'scss_audit', 'query'].sort(),
		);
		for (const id of toolIds) {
			expect(handlers.has(`${ctx.namespacePrefix}_${id}`)).toBe(true);
		}
		expect(knowledgeIds).toContain('portfolio-architecture');
	});

	it('substitutes the namespace prefix in knowledge bodies', async () => {
		const ctx = makeFakeContext({}, 'delendai_demo');
		const reg = await plugin.register(ctx);
		const text = JSON.stringify(reg.knowledge ?? []);
		expect(text).not.toContain('{prefix}');
	});
});
