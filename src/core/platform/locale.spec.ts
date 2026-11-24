import { describe, expect, it } from 'vitest';
import { LOCALES, resolveLocale } from './locale.helper';

describe('locale registry', () => {
	it('exposes all twenty canonical route locales', () => {
		expect(LOCALES.map(({ id }) => id)).toEqual([
			'en', 'es', 'fr', 'de', 'it', 'pt-PT', 'pt-BR',
			'ru', 'uk', 'pl', 'hr', 'tr', 'ar', 'hi', 'bn',
			'zh-CN', 'zh-TW', 'ja', 'ko', 'id',
		]);
	});

	it.each([
		['en-GB', 'en'],
		['es-MX', 'es'],
		['pt', 'pt-BR'],
		['pt-AO', 'pt-PT'],
		['zh-Hans-SG', 'zh-CN'],
		['zh-Hant-HK', 'zh-TW'],
		['uk-UA', 'uk'],
		['ar-EG', 'ar'],
		['ko_KR', 'ko'],
	])('resolves %s to %s', (candidate, expected) => {
		expect(resolveLocale(candidate)).toBe(expected);
	});

	it('falls back only at the resolver boundary', () => {
		expect(resolveLocale('xx-YY')).toBeNull();
		expect(resolveLocale('')).toBeNull();
		expect(resolveLocale(undefined)).toBeNull();
	});
});
