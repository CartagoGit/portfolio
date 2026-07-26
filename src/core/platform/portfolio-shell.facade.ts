import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
	LANGUAGES,
	PORTFOLIO_COPY,
	PUBLIC_LINKS,
	TECHNOLOGY_MARQUEE,
} from '../../domain/portfolio.data';
import type { ILocale, IPortfolioPageId } from '../../domain/portfolio.types';

const PAGE_ORDER: readonly IPortfolioPageId[] = [
	'home',
	'work',
	'lab',
	'approach',
	'knowledge',
	'docker',
	'demos',
	'contact',
];

export class PortfolioShellFacade {
	private readonly _route = inject(ActivatedRoute);
	private readonly _router = inject(Router);
	private readonly _document = inject(DOCUMENT);
	private readonly _title = inject(Title);
	private readonly _meta = inject(Meta);
	private readonly _platformId = inject(PLATFORM_ID);

	readonly locale = signal<ILocale>('en');
	readonly page = signal<IPortfolioPageId>('home');
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
			this._document.documentElement.getAttribute('data-theme') === 'light'
		);
		this._route.paramMap.subscribe((params) => {
			const locale = params.get('locale') === 'es' ? 'es' : 'en';
			this.locale.set(locale);
			this._document.documentElement.lang = locale;
			this._updateSeo();
		});
		this._route.data.subscribe((data) => {
			this.page.set(this._asPage(data['page']));
			this._updateSeo();
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
		void this._router.navigate(this.routeFor(this.page(), locale));
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

	setTransition(target: IPortfolioPageId): void {
		const direction =
			PAGE_ORDER.indexOf(target) >= PAGE_ORDER.indexOf(this.page())
				? 'forward'
				: 'backward';
		this._document.documentElement.dataset['transitionDirection'] =
			direction;
		this.menuOpen.set(false);
		this.localeMenuOpen.set(false);
	}

	routeFor(page: IPortfolioPageId, locale = this.locale()): string[] {
		return page === 'home' ? ['/', locale] : ['/', locale, page];
	}

	private _asPage(page: unknown): IPortfolioPageId {
		return typeof page === 'string' &&
			PAGE_ORDER.includes(page as IPortfolioPageId)
			? (page as IPortfolioPageId)
			: 'home';
	}

	private _updateSeo(): void {
		const spanish = this.locale() === 'es';
		const labels: Record<IPortfolioPageId, string> = spanish
			? {
					home: 'Frontend product engineer',
					work: 'Proyectos destacados',
					lab: 'Laboratorio frontend',
					approach: 'Enfoque',
					knowledge: 'Conocimientos',
					docker: 'Docker',
					demos: 'Demos',
					contact: 'Contacto',
				}
			: {
					home: 'Frontend product engineer',
					work: 'Pinned projects',
					lab: 'Frontend lab',
					approach: 'Approach',
					knowledge: 'Knowledge',
					docker: 'Docker',
					demos: 'Demos',
					contact: 'Contact',
				};
		const description = spanish
			? 'Portfolio de Mario Cabrero Volarich: frontend de producto, Angular, TypeScript, móvil y tooling.'
			: 'Mario Cabrero Volarich’s portfolio: product frontend, Angular, TypeScript, mobile delivery and developer tooling.';
		this._title.setTitle(`Cartago · ${labels[this.page()]}`);
		this._meta.updateTag({ name: 'description', content: description });
	}

	private _applyPreferredLocale(): void {
		if (!isPlatformBrowser(this._platformId)) return;
		let saved: string | null = null;
		try {
			saved = localStorage.getItem('cartago-locale');
		} catch {
			/* Storage can be blocked. */
		}
		const cookieLocale = this._document.cookie.match(
			/(?:^|; )cartago_locale=([^;]+)/
		)?.[1];
		const candidate =
			saved ??
			cookieLocale ??
			navigator.languages
				.find(
					(language) =>
						language.startsWith('es') || language.startsWith('en')
				)
				?.slice(0, 2) ??
			'en';
		const locale: ILocale = candidate === 'es' ? 'es' : 'en';
		if (locale !== this.locale()) {
			queueMicrotask(
				() =>
					void this._router.navigate(
						this.routeFor(this.page(), locale)
					)
			);
		}
	}

	private _persistLocale(locale: ILocale): void {
		if (!isPlatformBrowser(this._platformId)) return;
		try {
			localStorage.setItem('cartago-locale', locale);
		} catch {
			/* Cookie remains a server-readable fallback. */
		}
		this._document.cookie = `cartago_locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
	}
}
