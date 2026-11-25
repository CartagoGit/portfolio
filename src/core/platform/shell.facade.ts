import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { PUBLIC_LINKS, TECHNOLOGY_MARQUEE } from '../../domain/data.constant';
import type {
	ILanguageOption,
	ILocale,
	IPageComponentId,
	IThemeId,
} from '../../domain/types.interface';
import { TranslateService } from '../../lang/translate.service';
import { detectPreferredLocale, LOCALE_LANGUAGE_GROUPS, persistLocale, resolveLocale } from './locale.helper';
import { buildDescription, buildTitle } from './seo.helper';
import { PAGE_ORDER, routeFor, transitionDirection } from './routing.helper';
import {
	DEFAULT_THEME,
	detectPreferredTheme,
	isTheme,
	type IThemeDefinition,
	persistTheme,
	THEMES,
} from './theme.config';

export { PAGE_ORDER, transitionDirection } from './routing.helper';

const THEME_TRANSITION_MS = 520;

/**
 * Composition root for the portfolio shell.
 *
 * Owns the active locale, theme, navigation state and the open/close
 * signals for both dropdown menus. Pages and shared UI components
 * bind to this facade rather than reaching into `ActivatedRoute`
 * directly.
 */
@Injectable({ providedIn: 'root' })
export class ShellFacade {
	private readonly _route = inject(ActivatedRoute);
	private readonly _router = inject(Router);
	private readonly _document = inject(DOCUMENT);
	private readonly _title = inject(Title);
	private readonly _meta = inject(Meta);
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _translate = inject(TranslateService);

	readonly languages = computed<readonly ILanguageOption[]>(() => {
		const active = this.locale();
		let displayNames: Intl.DisplayNames | undefined;
		try {
			displayNames = new Intl.DisplayNames([active], { type: 'language' });
		} catch {
			displayNames = undefined;
		}
		return LOCALE_LANGUAGE_GROUPS
			.map((group) => {
				const routeLocale = group.locales.includes(active)
					? active
					: group.locales[0];
				return {
					id: routeLocale as ILocale,
					label: group.label,
					detail: displayNames?.of(group.languageTag) ?? group.label,
					flag: group.flag,
				};
			})
			.sort((left, right) => left.label.localeCompare(right.label, 'en', { sensitivity: 'base' }));
	});
	/** Theme definitions surfaced to the dropdown; label/detail come from the
	 * active locale's translation map so the swatch + copy stay in sync. */
	readonly themes = computed<
		ReadonlyArray<
			IThemeDefinition & {
				label: string;
				detail: string;
			}
		>
	>(() => {
		const t = this._translate.translations();
		return THEMES.map((theme) => ({
			...theme,
			label: t.lang.themes[theme.id].label,
			detail: t.lang.themes[theme.id].detail,
		}));
	});
	readonly publicLinks = PUBLIC_LINKS;
	readonly platformLinks = PUBLIC_LINKS.filter(
		(link) => link.group === 'platform'
	);
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
	private _pendingRouteFocus = false;

	constructor() {
		this.theme.set(this._detectInitialTheme());
		this._applyTheme(this.theme(), { animate: false });
		this._route.paramMap.subscribe((params) => {
			const raw = params.get('locale');
			const locale: ILocale = resolveLocale(raw) ?? 'en';
			if (raw && raw !== locale) {
				queueMicrotask(() => void this._router.navigate(routeFor(this.page(), locale), { replaceUrl: true }));
			}
			this._translate.setLocale(locale);
			this._document.documentElement.lang = locale;
			this._document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
			this._refreshSeo();
		});
		this._route.data.subscribe((data) => {
			this.page.set(this._asPage(data['page']));
			this._refreshSeo();
		});
		this._router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
			const child = this._route.firstChild;
			this.page.set(this._asPage(child?.snapshot.data['page']));
			this._refreshSeo();
			if (this._pendingRouteFocus) {
				this._pendingRouteFocus = false;
				queueMicrotask(() => this._document.getElementById('main-content')?.focus({ preventScroll: true }));
			}
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

	scrollToTop(): void {
		if (!isPlatformBrowser(this._platformId)) return;
		const reducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches;
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: reducedMotion ? 'auto' : 'smooth',
		});
	}

	setTransition(target: IPageComponentId): void {
		this._document.documentElement.dataset['transitionDirection'] =
			transitionDirection(this.page(), target);
		this.closeMenus();
		this._pendingRouteFocus = true;
		if (!isPlatformBrowser(this._platformId)) return;
		window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
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
		const routeLocale = this._route.snapshot.paramMap.get('locale');
		if (resolveLocale(routeLocale)) return;
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
