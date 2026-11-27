import {
	computed,
	inject,
	Injectable,
	PLATFORM_ID,
	signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { ILocale } from '../domain/types.interface';
import { resolveLocale } from '../core/platform/locale.helper';
import { en } from './en.translation';
import { es } from './es.translation';
import { fr } from './fr.translation';
import { de } from './de.translation';
import { GLOBAL_TRANSLATIONS } from './global.translations';
import type { ITranslationMap } from './types.interface';

/**
 * Translation registry — keyed by locale id.
 *
 * Every locale must satisfy the `ITranslationMap` shape; the type
 * check enforces this at build time. The English map is the
 * canonical fallback used when a key is absent from the active
 * locale.
 */
const TRANSLATIONS: Readonly<Partial<Record<ILocale, ITranslationMap>>> = {
	en,
	es,
	fr,
	de,
	...GLOBAL_TRANSLATIONS,
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
	private readonly _fallback: ITranslationMap = en;
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

	/** Resolves a content-owned term while keeping literal labels truthful. */
	instantOr(key: string, fallback: string): string {
		const resolved = this.instant(key);
		return resolved === key ? fallback : resolved;
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
			const storedLocale = resolveLocale(stored);
			if (storedLocale) return storedLocale;
		} catch {
			/* Storage may be blocked; fall through to the cookie. */
		}
		const match = document.cookie.match(/(?:^|;\s*)cartago_locale=([^;]+)/);
		const cookieLocale = resolveLocale(match?.[1]);
		if (cookieLocale) return cookieLocale;
		const candidate = navigator.languages
			.map(resolveLocale)
			.find((language): language is ILocale => language !== null);
		return candidate ?? 'en';
	}
}
