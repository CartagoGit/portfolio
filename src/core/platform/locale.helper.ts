import type { ILocale } from '../../domain/types.interface';

/**
 * Storage and cookie identifiers used to remember the visitor's preferred
 * locale. Centralising them avoids magic strings drifting across the shell
 * facade, the SSR middleware and the consent banner.
 */
export const LOCALE_STORAGE_KEY = 'cartago-locale';
export const LOCALE_COOKIE_NAME = 'cartago_locale';
export const LOCALE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export const LOCALE_COOKIE_ATTRS =
	`Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax` as const;

const LOCALE_DEFINITIONS = [
	{ id: 'en', flag: '🇺🇸', label: 'English', detail: 'Global English' },
	{ id: 'es', flag: '🇪🇸', label: 'Español', detail: 'España' },
	{ id: 'fr', flag: '🇫🇷', label: 'Français', detail: 'France' },
	{ id: 'de', flag: '🇩🇪', label: 'Deutsch', detail: 'Deutschland' },
	{ id: 'it', flag: '🇮🇹', label: 'Italiano', detail: 'Italia' },
	{ id: 'pt-PT', flag: '🇵🇹', label: 'Português', detail: 'Portugal' },
	{ id: 'pt-BR', flag: '🇧🇷', label: 'Português', detail: 'Brasil' },
	{ id: 'ru', flag: '🇷🇺', label: 'Русский', detail: 'Россия' },
	{ id: 'uk', flag: '🇺🇦', label: 'Українська', detail: 'Україна' },
	{ id: 'pl', flag: '🇵🇱', label: 'Polski', detail: 'Polska' },
	{ id: 'hr', flag: '🇭🇷', label: 'Hrvatski', detail: 'Hrvatska' },
	{ id: 'tr', flag: '🇹🇷', label: 'Türkçe', detail: 'Türkiye' },
	{ id: 'ar', flag: '🇸🇦', label: 'العربية', detail: 'العربية · RTL' },
	{ id: 'hi', flag: '🇮🇳', label: 'हिन्दी', detail: 'भारत' },
	{ id: 'bn', flag: '🇧🇩', label: 'বাংলা', detail: 'বাংলাদেশ' },
	{ id: 'zh-CN', flag: '🇨🇳', label: '中文', detail: '简体 · 中国' },
	{ id: 'zh-TW', flag: '🇹🇼', label: '中文', detail: '繁體 · 台灣' },
	{ id: 'ja', flag: '🇯🇵', label: '日本語', detail: '日本' },
	{ id: 'ko', flag: '🇰🇷', label: '한국어', detail: '대한민국' },
	{ id: 'id', flag: '🇮🇩', label: 'Bahasa Indonesia', detail: 'Indonesia' },
] as const satisfies ReadonlyArray<{
	id: ILocale;
	flag: string;
	label: string;
	detail: string;
}>;

const SUPPORTED_LOCALES = LOCALE_DEFINITIONS.map(({ id }) => id);

export function isLocale(value: unknown): value is ILocale {
	return (
		typeof value === 'string' &&
		(SUPPORTED_LOCALES as readonly string[]).includes(value)
	);
}

/** Resolves browser and regional language tags to one canonical route locale. */
export function resolveLocale(value: unknown): ILocale | null {
	if (typeof value !== 'string') return null;
	const normalized = value.trim().replaceAll('_', '-');
	if (!normalized) return null;
	if (isLocale(normalized)) return normalized;

	let locale: Intl.Locale;
	try {
		locale = new Intl.Locale(normalized);
	} catch {
		return null;
	}

	const language = locale.language.toLowerCase();
	const region = locale.region?.toUpperCase();
	const script = locale.script;
	if (language === 'pt')
		return !region || region === 'BR' ? 'pt-BR' : 'pt-PT';
	if (language === 'zh') {
		if (script === 'Hant' || region === 'TW' || region === 'HK' || region === 'MO')
			return 'zh-TW';
		return 'zh-CN';
	}
	return isLocale(language) ? language : null;
}

/**
 * Browser-side locale resolver. Reads from localStorage first, then from the
 * cookie set by the SSR middleware, and finally from the navigator's preferred
 * language. Returns `null` when none of the sources hold a usable value.
 */
export function detectPreferredLocale(doc: Document): ILocale | null {
	if (typeof window === 'undefined') return null;
	let stored: string | null = null;
	try {
		stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
	} catch {
		/* Storage may be blocked (private mode, sandboxed iframe). */
	}
	const cookieLocale = readLocaleCookie(doc);
	const storedLocale = resolveLocale(stored);
	if (storedLocale) return storedLocale;
	const cookieResolved = resolveLocale(cookieLocale);
	if (cookieResolved) return cookieResolved;
	return navigator.languages
		.map(resolveLocale)
		.find((language): language is ILocale => language !== null) ?? null;
}

/**
 * Persists the locale on both localStorage and the cookie so the SSR layer
 * and the next browser navigation agree on the visitor's preference.
 */
export function persistLocale(doc: Document, locale: ILocale): void {
	if (typeof window === 'undefined') return;
	try {
		window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
	} catch {
		/* Cookie remains a server-readable fallback. */
	}
	doc.cookie = `${LOCALE_COOKIE_NAME}=${locale}; ${LOCALE_COOKIE_ATTRS}`;
}

/// Reads the locale cookie using `document.cookie`. The caller must guarantee
/// the document is available (browser-only path).
export function readLocaleCookie(doc: Document): string | null {
	return (
		doc.cookie.match(
			new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE_NAME}=([^;]+)`)
		)?.[1] ?? null
	);
}

/**
 * Locale registry mirroring the canonical set the runtime supports.
 * Native labels and region details remain stable across the UI; this
 * module is the single source of truth for runtime routing and the selector.
 */
export const LOCALES = LOCALE_DEFINITIONS;

export interface ILocaleLanguageGroup {
	readonly key: string;
	readonly locales: readonly ILocale[];
	readonly label: string;
	readonly languageTag: string;
	readonly flag: string;
}

export const LOCALE_LANGUAGE_GROUPS: readonly ILocaleLanguageGroup[] = [
	{ key: 'ar', locales: ['ar'], label: 'العربية', languageTag: 'ar', flag: '/icons/flags/ar.svg' },
	{ key: 'bn', locales: ['bn'], label: 'বাংলা', languageTag: 'bn', flag: '/icons/flags/bn.svg' },
	{ key: 'zh-cn', locales: ['zh-CN'], label: '中文（简体）', languageTag: 'zh-Hans', flag: '/icons/flags/zh-cn.svg' },
	{ key: 'zh-tw', locales: ['zh-TW'], label: '中文（繁體）', languageTag: 'zh-Hant', flag: '/icons/flags/zh-tw.svg' },
	{ key: 'hr', locales: ['hr'], label: 'Hrvatski', languageTag: 'hr', flag: '/icons/flags/hr.svg' },
	{ key: 'de', locales: ['de'], label: 'Deutsch', languageTag: 'de', flag: '/icons/flags/de.svg' },
	{ key: 'en', locales: ['en'], label: 'English', languageTag: 'en', flag: '/icons/flags/en.svg' },
	{ key: 'es', locales: ['es'], label: 'Español', languageTag: 'es', flag: '/icons/flags/es.svg' },
	{ key: 'fr', locales: ['fr'], label: 'Français', languageTag: 'fr', flag: '/icons/flags/fr.svg' },
	{ key: 'hi', locales: ['hi'], label: 'हिन्दी', languageTag: 'hi', flag: '/icons/flags/hi.svg' },
	{ key: 'id', locales: ['id'], label: 'Bahasa Indonesia', languageTag: 'id', flag: '/icons/flags/id.svg' },
	{ key: 'it', locales: ['it'], label: 'Italiano', languageTag: 'it', flag: '/icons/flags/it.svg' },
	{ key: 'ja', locales: ['ja'], label: '日本語', languageTag: 'ja', flag: '/icons/flags/ja.svg' },
	{ key: 'ko', locales: ['ko'], label: '한국어', languageTag: 'ko', flag: '/icons/flags/ko.svg' },
	{ key: 'pl', locales: ['pl'], label: 'Polski', languageTag: 'pl', flag: '/icons/flags/pl.svg' },
	{ key: 'pt', locales: ['pt-PT', 'pt-BR'], label: 'Português', languageTag: 'pt', flag: '/icons/flags/pt.svg' },
	{ key: 'ru', locales: ['ru'], label: 'Русский', languageTag: 'ru', flag: '/icons/flags/ru.svg' },
	{ key: 'tr', locales: ['tr'], label: 'Türkçe', languageTag: 'tr', flag: '/icons/flags/tr.svg' },
	{ key: 'uk', locales: ['uk'], label: 'Українська', languageTag: 'uk', flag: '/icons/flags/uk.svg' },
];
