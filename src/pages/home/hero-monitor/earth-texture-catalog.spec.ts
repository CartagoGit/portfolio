import { describe, expect, it } from 'vitest';
import { LOCALES } from '../../../core/platform/locale.helper';
import { closeSphereLabel, EARTH_TEXTURE_CATEGORIES, EARTH_TEXTURE_OPTIONS, earthCategoryLabel, earthTextureLabel, earthTextureOriginLabel } from './earth-texture.catalog';

describe('earth texture catalog', () => {
	it('owns one unique 34-preset catalogue across six categories', () => {
		expect(EARTH_TEXTURE_OPTIONS).toHaveLength(34);
		expect(new Set(EARTH_TEXTURE_OPTIONS.map(({ id }) => id)).size).toBe(34);
		expect(new Set(EARTH_TEXTURE_OPTIONS.map(({ category }) => category))).toEqual(new Set(EARTH_TEXTURE_CATEGORIES));
		expect(EARTH_TEXTURE_OPTIONS.filter(({ category }) => category === 'figures').map(({ id }) => id)).toEqual([
			'rugby', 'beach-ball', 'disco', 'model-gamepad', 'model-football', 'model-elephant', 'model-moon-rock',
		]);
	});

	it('localizes every preset, category, origin and close action in all 20 locales', () => {
		expect(LOCALES).toHaveLength(20);
		for (const { id: locale } of LOCALES) {
			for (const category of EARTH_TEXTURE_CATEGORIES) expect(earthCategoryLabel(locale, category)).toBeTruthy();
			for (const option of EARTH_TEXTURE_OPTIONS) {
				expect(earthTextureLabel(locale, option.id), `${locale}/${option.id} label`).toBeTruthy();
				expect(earthTextureOriginLabel(locale, option.id), `${locale}/${option.id} origin`).toBeTruthy();
			}
			expect(closeSphereLabel(locale)).toBeTruthy();
		}
	});
});
