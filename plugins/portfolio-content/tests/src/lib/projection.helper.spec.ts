import { describe, expect, it } from 'vitest';
import { compactProjection } from '../../../src/lib/helpers/projection.helper';

describe('compactProjection', () => {
	it('applies filter, field projection and explicit pagination metadata', () => {
		const result = compactProjection({
			items: [{ id: 'home', fileCount: 12, detail: 'hidden' }, { id: 'work', fileCount: 8, detail: 'visible' }],
			fields: ['id', 'fileCount'],
			filter: 'work',
			limit: 1,
			tokenBudget: 300,
		});
		expect(result.items).toEqual([{ id: 'work', fileCount: 8 }]);
		expect(result.total).toBe(1);
		expect(result.truncated).toBe(false);
		expect(result.tokenEstimate).toBeLessThanOrEqual(300);
	});

	it('stops before crossing the measured token budget', () => {
		const result = compactProjection({ items: [{ text: 'x'.repeat(2000) }, { text: 'y'.repeat(2000) }], limit: 10, tokenBudget: 128 });
		expect(result.count).toBe(1);
		expect(result.items[0]).toMatchObject({ __truncated: true });
		expect(result.truncated).toBe(true);
		expect(result.nextOffset).toBe(1);
	});
});
