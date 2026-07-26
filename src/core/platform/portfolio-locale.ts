import type { ILocale } from '../../domain/portfolio.types';

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

const SUPPORTED_LOCALES: readonly ILocale[] = ['en', 'es'];

export function isLocale(value: unknown): value is ILocale {
	return (
		typeof value === 'string' &&
		(SUPPORTED_LOCALES as readonly string[]).includes(value)
	);
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
	const candidate =
		stored ??
		cookieLocale ??
		navigator.languages
			.find(
				(language) =>
					language.toLowerCase().startsWith('es') ||
					language.toLowerCase().startsWith('en')
			)
			?.slice(0, 2) ??
		null;
	return isLocale(candidate) ? candidate : null;
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
