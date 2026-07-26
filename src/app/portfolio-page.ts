import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	HostListener,
	inject,
	PLATFORM_ID,
	signal,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
	LANGUAGES,
	PUBLIC_LINKS,
	TECHNOLOGY_MARQUEE,
} from '../domain/portfolio.data';
import { PortfolioFooterComponent } from '../shared/ui/portfolio-footer/portfolio-footer.component';
import { CommandPaletteComponent } from '../shared/ui/command-palette/command-palette.component';
import { PortfolioHeaderComponent } from '../shared/ui/portfolio-header/portfolio-header.component';
import { ContactPageComponent } from '../features/contact/contact-page.component';
import { DockerPageComponent } from '../features/docker/docker-page.component';
import { DemosPageComponent } from '../features/demos/demos-page.component';
import { ApproachPageComponent } from '../features/approach/approach-page.component';
import { KnowledgePageComponent } from '../features/knowledge/knowledge-page.component';
import { LabPageComponent } from '../features/lab/lab-page.component';
import { WorkPageComponent } from '../features/work/work-page.component';
import { HeroMonitorComponent } from '../features/home/hero-monitor/hero-monitor.component';
import { HomeIntroComponent } from '../features/home/home-intro/home-intro.component';
import type { Locale, PortfolioPageId } from '../domain/portfolio.types';

@Component({
	selector: 'app-portfolio-page',
	imports: [
		PortfolioFooterComponent,
		CommandPaletteComponent,
		PortfolioHeaderComponent,
		ContactPageComponent,
		DockerPageComponent,
		DemosPageComponent,
		ApproachPageComponent,
		KnowledgePageComponent,
		LabPageComponent,
		WorkPageComponent,
		HeroMonitorComponent,
		HomeIntroComponent,
	],
	templateUrl: './portfolio-page.html',
	styleUrl: './portfolio-page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioPage {
	private readonly route = inject(ActivatedRoute);
	private readonly router = inject(Router);
	private readonly document = inject(DOCUMENT);
	private readonly title = inject(Title);
	private readonly meta = inject(Meta);
	private readonly platformId = inject(PLATFORM_ID);

	protected readonly locale = signal<Locale>('en');
	protected readonly page = signal<PortfolioPageId>('home');
	protected readonly menuOpen = signal(false);
	protected readonly localeMenuOpen = signal(false);
	protected readonly localeMenuClosing = signal(false);
	protected readonly lightMode = signal(false);
	protected readonly scrolled = signal(false);
	protected readonly commandOpen = signal(false);
	protected readonly publicLinks = PUBLIC_LINKS;
	protected readonly technologyMarquee = TECHNOLOGY_MARQUEE;
	protected readonly languages = LANGUAGES;

	protected readonly copy = computed(() =>
		this.locale() === 'en'
			? {
					navWork: 'Selected work',
					navLab: 'Frontend lab',
					navAbout: 'Approach',
					availability: 'Available for thoughtful product work',
					viewWork: 'View examples',
					contact: 'Start a conversation',
					role: 'Frontend engineer building operational web and mobile products.',
					intro: 'I combine product-focused frontend development with TypeScript architecture, testing and developer tooling.',
				}
			: {
					navWork: 'Trabajo seleccionado',
					navLab: 'Laboratorio',
					navAbout: 'Enfoque',
					availability: 'Disponible para proyectos de producto',
					viewWork: 'Ver ejemplos',
					contact: 'Hablemos',
					role: 'Frontend engineer que construye productos web y móviles operacionales.',
					intro: 'Combino desarrollo frontend orientado a producto con arquitectura TypeScript, testing y tooling para developers.',
				}
	);

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
			const page = data['page'];
			this.page.set(
				page === 'work' ||
					page === 'lab' ||
					page === 'approach' ||
					page === 'knowledge' ||
					page === 'docker' ||
					page === 'demos' ||
					page === 'contact'
					? page
					: 'home'
			);
			this.updateSeo();
		});
		this.applyPreferredLocale();
	}

	protected setTheme(): void {
		const next = !this.lightMode();
		this.lightMode.set(next);
		this.document.documentElement.setAttribute(
			'data-theme',
			next ? 'light' : 'dark'
		);
	}

	@HostListener('window:scroll')
	protected onWindowScroll(): void {
		this.scrolled.set(window.scrollY > 20);
	}

	protected selectLocale(locale: Locale): void {
		this.localeMenuOpen.set(false);
		this.persistLocale(locale);
		void this.router.navigate(this.routeFor(this.page(), locale));
	}

	protected toggleLocaleMenu(): void {
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

	protected toggleMenu(): void {
		this.menuOpen.update((value) => !value);
	}

	protected routeFor(
		page: PortfolioPageId,
		locale = this.locale()
	): string[] {
		return page === 'home' ? ['/', locale] : ['/', locale, page];
	}

	protected setTransition(target: PortfolioPageId): void {
		const order: PortfolioPageId[] = [
			'home',
			'work',
			'lab',
			'approach',
			'knowledge',
			'docker',
			'demos',
			'contact',
		];
		const direction =
			order.indexOf(target) >= order.indexOf(this.page())
				? 'forward'
				: 'backward';
		this.document.documentElement.dataset['transitionDirection'] =
			direction;
		this.menuOpen.set(false);
		this.localeMenuOpen.set(false);
	}

	private updateSeo(): void {
		const section = this.page();
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
		this.title.setTitle(`Cartago · ${labels[section]}`);
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

	protected closeMenu(): void {
		this.menuOpen.set(false);
	}
}
