import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PUBLIC_LINKS, TECHNOLOGY_MARQUEE } from '../../domain/data';
import type {
	ILanguageOption,
	ILocale,
	IPageComponentId,
	IThemeId,
} from '../../domain/types';
import { TranslateService } from '../../lang/translate.service';
import { detectPreferredLocale, LOCALES, persistLocale } from './locale';
import { buildDescription, buildTitle } from './seo';
import { PAGE_ORDER, routeFor, transitionDirection } from './routing';
import {
	DEFAULT_THEME,
	detectPreferredTheme,
	isTheme,
	type IThemeDefinition,
	persistTheme,
	THEMES,
} from './theme';

export { PAGE_ORDER, transitionDirection } from './routing';

const THEME_TRANSITION_MS = 520;

/**
 * Composition root for the portfolio shell.
 *
 * Owns the active locale, theme, navigation state and the open/close
 * signals for both dropdown menus. Pages and shared UI components
 * bind to this facade rather than reaching into `ActivatedRoute`
 * directly.
 */
export class ShellFacade {
	private readonly _route = inject(ActivatedRoute);
	private readonly _router = inject(Router);
	private readonly _document = inject(DOCUMENT);
	private readonly _title = inject(Title);
	private readonly _meta = inject(Meta);
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _translate = inject(TranslateService);

	readonly languages = computed<readonly ILanguageOption[]>(() => {
		const t = this._translate.translations();
		return LOCALES.map((locale) => ({
			id: locale.id,
			label: t.lang.languages[locale.id].label,
			detail: t.lang.languages[locale.id].detail,
			flag: locale.flag,
		}));
	});
	/** Theme definitions surfaced to the dropdown; label/detail come from the
	 * active locale's translation map so the swatch + copy stay in sync. */
	readonly themes = computed<
		ReadonlyArray<IThemeDefinition & {
			label: string;
			detail: string;
		}>
	>(() => {
		const t = this._translate.translations();
		return THEMES.map((theme) => ({
			...theme,
			label: t.lang.themes[theme.id].label,
			detail: t.lang.themes[theme.id].detail,
		}));
	});
	readonly publicLinks = PUBLIC_LINKS;
	readonly technologyMarquee = TECHNOLOGY_MARQUEE;

	readonly locale = this._translate.locale;
	readonly page = signal<IPageComponentId>('home');
	readonly menuOpen = signal(false);
	readonly localeMenuOpen = signal(false);
	readonly localeMenuClosing = signal(false);
	readonly themeMenuOpen = signal(false);
	readonly themeMenuClosing = signal(false);
	/** Command palette visibility — opened from the lab page. */
	readonly commandOpen = signal(false);

	readonly theme = signal<IThemeId>(DEFAULT_THEME);

	constructor() {
		this.theme.set(this._detectInitialTheme());
		this._applyTheme(this.theme(), { animate: false });
		this._route.paramMap.subscribe((params) => {
			const raw = params.get('locale');
			const locale: ILocale = raw === 'es' ? 'es' : 'en';
			this._translate.setLocale(locale);
			this._document.documentElement.lang = locale;
			this._refreshSeo();
		});
		this._route.data.subscribe((data) => {
			this.page.set(this._asPage(data['page']));
			this._refreshSeo();
		});
		this._applyPreferredLocale();
	}

	/**
	 * Sets the active theme, applies the `data-theme` attribute and
	 * triggers the cross-theme transition. Persists the choice on
	 * the browser side via `localStorage` + a cookie so SSR
	 * hydration matches.
	 */
	setTheme(theme: IThemeId | { readonly id: IThemeId }): void {
		const id = typeof theme === 'string' ? theme : theme.id;
		if (!isTheme(id)) return;
		this.themeMenuOpen.set(false);
		this.themeMenuClosing.set(false);
		if (id === this.theme()) return;
		this.theme.set(id);
		this._applyTheme(id, { animate: true });
	}

	toggleThemeMenu(): void {
		if (this.themeMenuOpen()) {
			this.themeMenuClosing.set(true);
			window.setTimeout(() => {
				this.themeMenuOpen.set(false);
				this.themeMenuClosing.set(false);
			}, 180);
			return;
		}
		this.themeMenuClosing.set(false);
		this.themeMenuOpen.set(true);
	}

	closeMenus(): void {
		this.menuOpen.set(false);
		this.localeMenuOpen.set(false);
		this.themeMenuOpen.set(false);
	}

	selectLocale(locale: ILocale): void {
		this.localeMenuOpen.set(false);
		this._persistLocale(locale);
		void this._router.navigate(routeFor(this.page(), locale));
	}

	toggleLocaleMenu(): void {
		if (this.localeMenuOpen()) {
			this.localeMenuClosing.set(true);
			window.setTimeout(() => {
				this.localeMenuOpen.set(false);
				this.localeMenuClosing.set(false);
			}, 180);
			return;
		}
		this.localeMenuClosing.set(false);
		this.localeMenuOpen.set(true);
	}

	toggleMenu(): void {
		this.menuOpen.update((value) => !value);
	}

	setTransition(target: IPageComponentId): void {
		this._document.documentElement.dataset['transitionDirection'] =
			transitionDirection(this.page(), target);
		this.closeMenus();
	}

	private _asPage(page: unknown): IPageComponentId {
		return typeof page === 'string' &&
			(PAGE_ORDER as readonly string[]).includes(page)
			? (page as IPageComponentId)
			: 'home';
	}

	private _refreshSeo(): void {
		this._title.setTitle(buildTitle(this.locale(), this.page()));
		this._meta.updateTag({
			name: 'description',
			content: buildDescription(this.locale()),
		});
	}

	private _applyPreferredLocale(): void {
		if (!isPlatformBrowser(this._platformId)) return;
		const locale = detectPreferredLocale(this._document);
		if (!locale || locale === this.locale()) return;
		queueMicrotask(
			() => void this._router.navigate(routeFor(this.page(), locale))
		);
	}

	private _persistLocale(locale: ILocale): void {
		persistLocale(this._document, locale);
	}

	private _detectInitialTheme(): IThemeId {
		if (!isPlatformBrowser(this._platformId)) return DEFAULT_THEME;
		return detectPreferredTheme(
			window.localStorage,
			document.cookie,
			DEFAULT_THEME
		);
	}

	private _applyTheme(id: IThemeId, { animate }: { animate: boolean }): void {
		const root = this._document.documentElement;
		root.setAttribute('data-theme', id);
		if (!animate || !isPlatformBrowser(this._platformId)) {
			persistTheme(id);
			return;
		}
		root.setAttribute('data-theme-transition', '1');
		window.setTimeout(() => {
			root.removeAttribute('data-theme-transition');
		}, THEME_TRANSITION_MS);
		persistTheme(id);
	}
}
