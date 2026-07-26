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
import type { Locale, PortfolioPageId } from '../../domain/portfolio.types';

const PAGE_ORDER: readonly PortfolioPageId[] = [
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
	private readonly route = inject(ActivatedRoute);
	private readonly router = inject(Router);
	private readonly document = inject(DOCUMENT);
	private readonly title = inject(Title);
	private readonly meta = inject(Meta);
	private readonly platformId = inject(PLATFORM_ID);

	readonly locale = signal<Locale>('en');
	readonly page = signal<PortfolioPageId>('home');
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
			this.document.documentElement.getAttribute('data-theme') === 'light'
		);
		this.route.paramMap.subscribe((params) => {
			const locale = params.get('locale') === 'es' ? 'es' : 'en';
			this.locale.set(locale);
			this.document.documentElement.lang = locale;
			this.updateSeo();
		});
		this.route.data.subscribe((data) => {
			this.page.set(this.asPage(data['page']));
			this.updateSeo();
		});
		this.applyPreferredLocale();
	}

	setTheme(): void {
		const next = !this.lightMode();
		this.lightMode.set(next);
		this.document.documentElement.setAttribute(
			'data-theme',
			next ? 'light' : 'dark'
		);
	}

	setScrolled(scrolled: boolean): void {
		this.scrolled.set(scrolled);
	}

	selectLocale(locale: Locale): void {
		this.localeMenuOpen.set(false);
		this.persistLocale(locale);
		void this.router.navigate(this.routeFor(this.page(), locale));
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

	setTransition(target: PortfolioPageId): void {
		const direction =
			PAGE_ORDER.indexOf(target) >= PAGE_ORDER.indexOf(this.page())
				? 'forward'
				: 'backward';
		this.document.documentElement.dataset['transitionDirection'] =
			direction;
		this.menuOpen.set(false);
		this.localeMenuOpen.set(false);
	}

	routeFor(page: PortfolioPageId, locale = this.locale()): string[] {
		return page === 'home' ? ['/', locale] : ['/', locale, page];
	}

	private asPage(page: unknown): PortfolioPageId {
		return typeof page === 'string' &&
			PAGE_ORDER.includes(page as PortfolioPageId)
			? (page as PortfolioPageId)
			: 'home';
	}

	private updateSeo(): void {
		const spanish = this.locale() === 'es';
		const labels: Record<PortfolioPageId, string> = spanish
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
		this.title.setTitle(`Cartago · ${labels[this.page()]}`);
		this.meta.updateTag({ name: 'description', content: description });
	}

	private applyPreferredLocale(): void {
		if (!isPlatformBrowser(this.platformId)) return;
		let saved: string | null = null;
		try {
			saved = localStorage.getItem('cartago-locale');
		} catch {
			/* Storage can be blocked. */
		}
		const cookieLocale = this.document.cookie.match(
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
		const locale: Locale = candidate === 'es' ? 'es' : 'en';
		if (locale !== this.locale()) {
			queueMicrotask(
				() =>
					void this.router.navigate(
						this.routeFor(this.page(), locale)
					)
			);
		}
	}

	private persistLocale(locale: Locale): void {
		if (!isPlatformBrowser(this.platformId)) return;
		try {
			localStorage.setItem('cartago-locale', locale);
		} catch {
			/* Cookie remains a server-readable fallback. */
		}
		this.document.cookie = `cartago_locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
	}
}
