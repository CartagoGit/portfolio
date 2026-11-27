import { describe, expect, it } from 'vitest';
import { nextRovingIndex } from './hero-monitor-motion.helper';

describe('hero monitor motion keyboard helper', () => {
	it('wraps one-dimensional tab navigation', () => {
		expect(nextRovingIndex({ key: 'ArrowRight', current: 5, count: 6 })).toBe(0);
		expect(nextRovingIndex({ key: 'ArrowLeft', current: 0, count: 6 })).toBe(5);
		expect(nextRovingIndex({ key: 'Home', current: 3, count: 6 })).toBe(0);
		expect(nextRovingIndex({ key: 'End', current: 2, count: 6 })).toBe(5);
	});

	it('moves by visual column count in a two-column preset grid', () => {
		expect(nextRovingIndex({ key: 'ArrowDown', current: 1, count: 7, columns: 2 })).toBe(3);
		expect(nextRovingIndex({ key: 'ArrowUp', current: 0, count: 7, columns: 2 })).toBe(5);
		expect(nextRovingIndex({ key: 'Enter', current: 2, count: 7, columns: 2 })).toBeNull();
		expect(nextRovingIndex({ key: 'ArrowRight', current: 0, count: 0 })).toBeNull();
	});
});
