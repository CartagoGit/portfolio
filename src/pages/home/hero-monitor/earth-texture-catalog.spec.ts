import { describe, expect, it } from 'vitest';
import { EARTH_TEXTURE_CATEGORIES, EARTH_TEXTURE_OPTIONS, earthCategoryLabel, earthTextureLabel, earthTextureOriginLabel } from './earth-texture-catalog';

describe('earth texture catalog', () => {
	it('owns one unique 30-preset catalogue across five categories', () => {
		expect(EARTH_TEXTURE_OPTIONS).toHaveLength(30);
		expect(new Set(EARTH_TEXTURE_OPTIONS.map(({ id }) => id)).size).toBe(30);
		expect(new Set(EARTH_TEXTURE_OPTIONS.map(({ category }) => category))).toEqual(new Set(EARTH_TEXTURE_CATEGORIES));
	});

	it('localizes every preset, category and origin in all four locales', () => {
		for (const locale of ['en', 'es', 'fr', 'de'] as const) {
			for (const category of EARTH_TEXTURE_CATEGORIES) expect(earthCategoryLabel(locale, category)).toBeTruthy();
			for (const option of EARTH_TEXTURE_OPTIONS) {
				expect(earthTextureLabel(locale, option.id)).toBeTruthy();
				expect(earthTextureOriginLabel(locale, option.id)).toBeTruthy();
			}
		}
	});
});
