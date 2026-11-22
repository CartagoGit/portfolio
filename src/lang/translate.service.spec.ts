import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TranslateService } from './translate.service';

const storage = new Map<string, string>();
const localStorageStub: Storage = {
	get length() {
		return storage.size;
	},
	clear: () => storage.clear(),
	getItem: (key) => storage.get(key) ?? null,
	key: (index) => Array.from(storage.keys())[index] ?? null,
	removeItem: (key) => storage.delete(key),
	setItem: (key, value) => storage.set(key, String(value)),
};

describe('TranslateService', () => {
	beforeEach(() => {
		storage.clear();
		Object.defineProperty(window, 'localStorage', {
			configurable: true,
			value: localStorageStub,
		});
		// Clear any persisted locale so each test starts from a
		// deterministic English baseline.
		try {
			window.localStorage.removeItem('cartago-locale');
		} catch {
			/* Storage may be unavailable in the test sandbox. */
		}
		document.cookie = 'cartago_locale=; Path=/; Max-Age=0';
		TestBed.resetTestingModule();
		TestBed.configureTestingModule({});
	});

	afterEach(() => {
		TestBed.resetTestingModule();
	});

	it('defaults to English when no persisted locale exists', () => {
		const service = TestBed.inject(TranslateService);
		expect(service.locale()).toBe('en');
		expect(service.instant('chrome.header.navWork')).toBe('Projects');
	});

	it('returns the Spanish string when the locale flips to es', () => {
		const service = TestBed.inject(TranslateService);
		service.setLocale('es');
		expect(service.locale()).toBe('es');
		expect(service.instant('chrome.header.navWork')).toBe('Proyectos');
	});

	it.each([
		['fr', 'Projets'],
		['de', 'Projekte'],
	] as const)('restores the %s persisted locale', (locale, expected) => {
		window.localStorage.setItem('cartago-locale', locale);
		const service = TestBed.inject(TranslateService);
		expect(service.locale()).toBe(locale);
		expect(service.instant('chrome.header.navWork')).toBe(expected);
	});

	it('falls back to English for keys missing in the active locale', () => {
		const service = TestBed.inject(TranslateService);
		service.setLocale('es');
		expect(service.instant('chrome.footer.tagline')).toContain('Cartago');
	});

	it('returns the key itself when the path is unresolved', () => {
		const service = TestBed.inject(TranslateService);
		expect(service.instant('chrome.does.not.exist')).toBe(
			'chrome.does.not.exist'
		);
	});

	it('exposes a signal-based t() that updates on locale change', () => {
		const service = TestBed.inject(TranslateService);
		const signal = service.t('chrome.header.navWork');
		expect(signal()).toBe('Projects');
		service.setLocale('es');
		expect(signal()).toBe('Proyectos');
	});

	it('persists the locale to localStorage on setLocale', () => {
		const service = TestBed.inject(TranslateService);
		service.setLocale('es');
		expect(window.localStorage.getItem('cartago-locale')).toBe('es');
		expect(document.cookie).toContain('cartago_locale=es');
	});
});
