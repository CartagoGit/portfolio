import { describe, expect, it } from 'vitest';

import { globToRegExp, matchesAnyGlob } from '../../../src/lib/services/glob.service';

describe('glob.service', () => {
	it('crosses directories with ** and stays in a segment with *', () => {
		expect(globToRegExp('src/**/*.html').test('src/a/b/c.html')).toBe(true);
		expect(globToRegExp('src/**/*.html').test('src/c.html')).toBe(true);
		expect(globToRegExp('src/*.html').test('src/a/c.html')).toBe(false);
	});

	it('escapes regexp metacharacters and supports ?', () => {
		expect(globToRegExp('a.b').test('axb')).toBe(false);
		expect(globToRegExp('a?.html').test('ab.html')).toBe(true);
	});

	it('matches any of several globs', () => {
		expect(matchesAnyGlob('x/y.html', ['z/*.html', 'x/*.html'])).toBe(true);
		expect(matchesAnyGlob('x/y.html', [])).toBe(false);
	});
});
