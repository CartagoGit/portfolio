import {
	computed,
	inject,
	Injectable,
	PLATFORM_ID,
	signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { ILocale } from '../domain/types';
import { en } from './en';
import { es } from './es';
import type { ITranslationMap } from './types';

/**
 * Translation registry — keyed by locale id.
 *
 * Every locale must satisfy the `ITranslationMap` shape; the type
 * check enforces this at build time. The English map is the
 * canonical fallback used when a key is absent from the active
 * locale.
 */
const TRANSLATIONS: Readonly<Record<ILocale, ITranslationMap>> = {
	en,
	es,
};

/**
 * Nested-path resolver for translation keys.
 *
 * `resolve(t, 'chrome.header.navWork')` walks the translation map
 * using dot notation. Returns `undefined` if any segment is missing
 * or if a non-leaf segment is requested.
 */
function resolve(map: unknown, path: string): string | undefined {
	const segments = path.split('.');
	let cursor: unknown = map;
	for (const segment of segments) {
		if (
			cursor === null ||
			cursor === undefined ||
			typeof cursor !== 'object'
		) {
			return undefined;
		}
		cursor = (cursor as Record<string, unknown>)[segment];
	}
	return typeof cursor === 'string' ? cursor : undefined;
}

/**
 * `{name}`-style placeholder substitution. The pipe accepts an
 * `args` record; this helper substitutes `{key}` occurrences with
 * `args[key]`, coercing non-string values via `String()`.
 */
function interpolate(template: string, args?: Record<string, unknown>): string {
	if (!args) return template;
	return template.replace(/\{(\w+)\}/g, (match, name: string) =>
		name in args ? String(args[name]) : match
	);
}

/**
 * Translation service for the portfolio.
 *
 * Mirrors the `t(key, args)` API of `@ngx-translate/core` but is
 * implemented with Angular signals so it composes naturally with
 * the rest of the shell facade. Locale is persisted in
 * `localStorage` and a cookie so SSR hydration agrees with the
 * visitor's choice.
 */
@Injectable({ providedIn: 'root' })
export class TranslateService {
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _fallback: ITranslationMap = TRANSLATIONS.en;
	private readonly _localeSignal = signal<ILocale>(
		this._detectInitialLocale()
	);

	readonly locale = this._localeSignal.asReadonly();
	readonly translations = computed<ITranslationMap>(
		() => TRANSLATIONS[this._localeSignal()] ?? this._fallback
	);

	/**
	 * Resolves `key` against the active locale and returns a
	 * signal whose value updates whenever the locale changes.
	 */
	t(key: string, args?: Record<string, unknown>) {
		return computed(() => {
			const map = this.translations();
			const primary = resolve(map, key);
			const template = primary ?? resolve(this._fallback, key) ?? key;
			return interpolate(template, args);
		});
	}

	/** Synchronous read used in non-reactive contexts (tests, factories). */
	instant(key: string, args?: Record<string, unknown>): string {
		const map = TRANSLATIONS[this._localeSignal()] ?? this._fallback;
		const primary = resolve(map, key);
		const template = primary ?? resolve(this._fallback, key) ?? key;
		return interpolate(template, args);
	}

	/**
	 * Updates the active locale and persists the choice. The header
	 * dropdown is the only call site; routing is handled by the
	 * shell facade so URL and cookie stay in sync.
	 */
	setLocale(locale: ILocale): void {
		if (this._localeSignal() === locale) return;
		this._localeSignal.set(locale);
		if (!isPlatformBrowser(this._platformId)) return;
		try {
			window.localStorage.setItem('cartago-locale', locale);
		} catch {
			/* Storage may be blocked; the cookie layer is the SSR fallback. */
		}
		document.cookie = `cartago_locale=${locale}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
	}

	/** Reads the locale that should be active on first paint. */
	private _detectInitialLocale(): ILocale {
		if (!isPlatformBrowser(this._platformId)) return 'en';
		try {
			const stored = window.localStorage.getItem('cartago-locale');
			if (stored === 'en' || stored === 'es') return stored;
		} catch {
			/* Storage may be blocked; fall through to the cookie. */
		}
		const match = document.cookie.match(/(?:^|;\s*)cartago_locale=([^;]+)/);
		const cookie = match?.[1];
		if (cookie === 'en' || cookie === 'es') return cookie;
		const candidate = navigator.languages
			.find(
				(language) =>
					language.toLowerCase().startsWith('es') ||
					language.toLowerCase().startsWith('en')
			)
			?.slice(0, 2);
		return candidate === 'es' ? 'es' : 'en';
	}
}
