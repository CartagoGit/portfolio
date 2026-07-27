import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
	LANGUAGES,
	PORTFOLIO_COPY,
	PUBLIC_LINKS,
	TECHNOLOGY_MARQUEE,
} from '../../domain/data';
import type { ILocale, IPageComponentId } from '../../domain/types';
import { detectPreferredLocale, persistLocale } from './locale';
import {
	buildDescription,
	buildTitle,
	PAGE_ORDER,
	routeFor,
	transitionDirection,
} from './seo';

export { PAGE_ORDER, transitionDirection } from './seo';

export class ShellFacade {
	private readonly _route = inject(ActivatedRoute);
	private readonly _router = inject(Router);
	private readonly _document = inject(DOCUMENT);
	private readonly _title = inject(Title);
	private readonly _meta = inject(Meta);
	private readonly _platformId = inject(PLATFORM_ID);

	readonly locale = signal<ILocale>('en');
	readonly page = signal<IPageComponentId>('home');
	readonly menuOpen = signal(false);
	readonly localeMenuOpen = signal(false);
	readonly localeMenuClosing = signal(false);
	readonly lightMode = signal(false);
	readonly scrolled = signal(false);
	readonly commandOpen = signal(false);
	readonly publicLinks = PUBLIC_LINKS;
	readonly technologyMarquee = TECHNOLOGY_MARQUEE;
	readonly languages = LANGUAGES;
	readonly copy = computed(() => PORTFOLIO_COPY[this.locale()]);

	constructor() {
		this.lightMode.set(
			this._document.documentElement.getAttribute('data-theme') ===
				'light'
		);
		this._route.paramMap.subscribe((params) => {
			const locale = params.get('locale') === 'es' ? 'es' : 'en';
			this.locale.set(locale);
			this._document.documentElement.lang = locale;
			this._refreshSeo();
		});
		this._route.data.subscribe((data) => {
			this.page.set(this._asPage(data['page']));
			this._refreshSeo();
		});
		this._applyPreferredLocale();
	}

	setTheme(): void {
		const next = !this.lightMode();
		this.lightMode.set(next);
		this._document.documentElement.setAttribute(
			'data-theme',
			next ? 'light' : 'dark'
		);
	}

	setScrolled(scrolled: boolean): void {
		this.scrolled.set(scrolled);
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
		this.menuOpen.set(false);
		this.localeMenuOpen.set(false);
	}

	routeFor(page: IPageComponentId, locale = this.locale()): string[] {
		return routeFor(page, locale);
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
			() => void this._router.navigate(this.routeFor(this.page(), locale))
		);
	}

	private _persistLocale(locale: ILocale): void {
		persistLocale(this._document, locale);
	}
}
