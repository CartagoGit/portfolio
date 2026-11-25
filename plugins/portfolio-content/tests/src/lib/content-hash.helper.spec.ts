import { describe, expect, it } from 'vitest';
import { contentDigest } from '../../../src/lib/helpers/content-hash.helper';

describe('contentDigest', () => {
	it('is stable and changes for exact source changes', () => {
		expect(contentDigest('same')).toBe(contentDigest('same'));
		expect(contentDigest('same')).not.toBe(contentDigest('Same'));
		expect(contentDigest('same')).toMatch(/^[a-f0-9]{64}$/);
	});
});
