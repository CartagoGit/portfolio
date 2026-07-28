/**
 * Theme registry for the portfolio.
 *
 * The portfolio ships eight colour palettes; the user picks one
 * through the header dropdown and the choice is persisted across
 * reloads via `localStorage` + a cookie so SSR hydration stays in
 * sync with the visitor's preference.
 *
 * `IThemeId` is mirrored in `domain/types.ts` for cross-layer
 * convenience; this module owns the runtime list, the persistence
 * helpers and the data-theme attribute contract.
 */

export const THEME_STORAGE_KEY = 'cartago-theme';
export const THEME_COOKIE_NAME = 'cartago_theme';
export const THEME_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
export const THEME_COOKIE_ATTRS =
	`Path=/; Max-Age=${THEME_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax` as const;

/** All supported theme identifiers. Mirrors `IThemeId` in domain types. */
export type IThemeId =
	| 'dark'
	| 'light'
	| 'midnight'
	| 'ocean'
	| 'forest'
	| 'sunset'
	| 'solar'
	| 'mono';

export interface IThemeDefinition {
	id: IThemeId;
	/** Primary colour used as the swatch and as `--cyan` token. */
	primary: string;
	/** Accent colour used as the secondary token (`--lime`). */
	accent: string;
	/** Color-scheme declaration for native form controls + scrollbars. */
	scheme: 'dark' | 'light';
}

export const THEMES: readonly IThemeDefinition[] = [
	{
		id: 'dark',
		primary: '#32c8ff',
		accent: '#b9ef73',
		scheme: 'dark',
	},
	{
		id: 'light',
		primary: '#0863e6',
		accent: '#527b10',
		scheme: 'light',
	},
	{
		id: 'midnight',
		primary: '#7d5cff',
		accent: '#32c8ff',
		scheme: 'dark',
	},
	{
		id: 'ocean',
		primary: '#0fb4ff',
		accent: '#a7ffeb',
		scheme: 'dark',
	},
	{
		id: 'forest',
		primary: '#41c47c',
		accent: '#ffd166',
		scheme: 'dark',
	},
	{
		id: 'sunset',
		primary: '#ff7a59',
		accent: '#ffd166',
		scheme: 'dark',
	},
	{
		id: 'solar',
		primary: '#ffb454',
		accent: '#ff5d8f',
		scheme: 'light',
	},
	{
		id: 'mono',
		primary: '#9aa4b2',
		accent: '#e8e8e8',
		scheme: 'light',
	},
] as const;

const SUPPORTED_THEMES: readonly IThemeId[] = THEMES.map((theme) => theme.id);

export function isTheme(value: unknown): value is IThemeId {
	return (
		typeof value === 'string' &&
		(SUPPORTED_THEMES as readonly string[]).includes(value)
	);
}

export const DEFAULT_THEME: IThemeId = 'dark';

/**
 * Resolves the theme that should be active on first paint. Reads
 * from localStorage, then the SSR cookie, then falls back to the
 * caller-supplied default. Browser-only path.
 */
// The (storage, cookie, default) signature is part of the unit-test
// surface and intentionally takes three parameters: SSR passes
// `null` for both injected sources, while the browser path passes
// `window.localStorage` and `document.cookie`. Splitting them into
// smaller helpers would push the conditional logic to the call site.
// eslint-disable-next-line @typescript-eslint/max-params
export function detectPreferredTheme(
	storage: Storage | null,
	cookie: string | null,
	defaultTheme: IThemeId = DEFAULT_THEME
): IThemeId {
	try {
		const stored = storage?.getItem(THEME_STORAGE_KEY);
		if (isTheme(stored)) return stored;
	} catch {
		/* Storage may be blocked; fall through to the cookie. */
	}
	const match = cookie?.match(
		new RegExp(`(?:^|;\\s*)${THEME_COOKIE_NAME}=([^;]+)`)
	);
	const cookieValue = match?.[1];
	if (isTheme(cookieValue)) return cookieValue;
	return defaultTheme;
}

/**
 * Persists the theme to localStorage + cookie. Browser-only path;
 * the guard makes the call a no-op during SSR so the constructor
 * can safely invoke this without crashing the prerender pipeline.
 */
export function persistTheme(theme: IThemeId): void {
	if (typeof window === 'undefined' || typeof document === 'undefined') return;
	try {
		window.localStorage.setItem(THEME_STORAGE_KEY, theme);
	} catch {
		/* Storage may be blocked; the cookie is the SSR fallback. */
	}
	document.cookie = `${THEME_COOKIE_NAME}=${theme}; ${THEME_COOKIE_ATTRS}`;
}
