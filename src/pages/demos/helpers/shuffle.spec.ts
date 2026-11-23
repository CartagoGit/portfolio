import { shuffleValues } from './shuffle';

describe('shuffleValues', () => {
	it('returns a Fisher-Yates copy without mutating the source', () => {
		const source = [1, 2, 3];
		const shuffled = shuffleValues(source, () => 0);
		expect(shuffled).toEqual([2, 3, 1]);
		expect(source).toEqual([1, 2, 3]);
		expect(shuffled).not.toBe(source);
	});
});
