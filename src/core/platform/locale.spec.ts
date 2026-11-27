import { describe, expect, it } from 'vitest';
import { LOCALE_LANGUAGE_GROUPS, LOCALES, resolveLocale } from './locale.helper';

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

	it('collapses Portuguese regional routes into one visual language group', () => {
		expect(LOCALE_LANGUAGE_GROUPS).toHaveLength(19);
		const portuguese = LOCALE_LANGUAGE_GROUPS.filter(({ locales }) => locales.includes('pt-PT') || locales.includes('pt-BR'));
		expect(portuguese).toHaveLength(1);
		expect(portuguese[0]?.locales).toEqual(['pt-PT', 'pt-BR']);
		expect(LOCALE_LANGUAGE_GROUPS.every(({ flag }) => flag.startsWith('/icons/flags/') && flag.endsWith('.svg'))).toBe(true);
	});
});
