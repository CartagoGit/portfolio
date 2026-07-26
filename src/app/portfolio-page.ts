import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import type { OnDestroy } from '@angular/core';
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  CAPABILITIES,
  HERO_PANELS,
  LANGUAGES,
  PUBLIC_LINKS,
  TECHNOLOGY_MARQUEE,
} from '../domain/portfolio/portfolio.data';
import { nextHeroPanelTransition } from '../core/portfolio/motion/portfolio-motion';
import { PortfolioFooterComponent } from '../shared/portfolio/ui/portfolio-footer/portfolio-footer.component';
import { CommandPaletteComponent } from '../shared/portfolio/ui/command-palette/command-palette.component';
import { TechnologyMarqueeComponent } from '../features/portfolio/home/technology-marquee/technology-marquee.component';
import { PortfolioHeaderComponent } from '../shared/portfolio/ui/portfolio-header/portfolio-header.component';
import { ContactPageComponent } from '../features/portfolio/contact/contact-page.component';
import { DockerPageComponent } from '../features/portfolio/docker/docker-page.component';
import { DemosPageComponent } from '../features/portfolio/demos/demos-page.component';
import { ProfileLinksComponent } from '../features/portfolio/home/profile-links/profile-links.component';
import { ApproachPageComponent } from '../features/portfolio/approach/approach-page.component';
import { KnowledgePageComponent } from '../features/portfolio/knowledge/knowledge-page.component';
import { LabPageComponent } from '../features/portfolio/lab/lab-page.component';
import { WorkPageComponent } from '../features/portfolio/work/work-page.component';
import { EarthGlobeComponent } from '../features/portfolio/home/earth-globe/earth-globe.component';
import type {
  CapabilityId,
  ChartType,
  HeroEffect,
  HeroPalette,
  HeroPanelId,
  HeroPanelTransition,
  Locale,
  PortfolioPageId,
} from '../domain/portfolio/portfolio.types';

@Component({
  selector: 'app-portfolio-page',
  imports: [
    RouterLink,
    PortfolioFooterComponent,
    CommandPaletteComponent,
    PortfolioHeaderComponent,
    ContactPageComponent,
    DockerPageComponent,
    DemosPageComponent,
    ProfileLinksComponent,
    ApproachPageComponent,
    KnowledgePageComponent,
    LabPageComponent,
    WorkPageComponent,
    EarthGlobeComponent,
    TechnologyMarqueeComponent,
  ],
  templateUrl: './portfolio-page.html',
  styleUrl: './portfolio-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioPage implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly platformId = inject(PLATFORM_ID);
  private heroPanelTimer?: number;

  protected readonly locale = signal<Locale>('en');
  protected readonly page = signal<PortfolioPageId>('home');
  protected readonly menuOpen = signal(false);
  protected readonly localeMenuOpen = signal(false);
  protected readonly localeMenuClosing = signal(false);
  protected readonly lightMode = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly activeCapability = signal<CapabilityId>('product');
  protected readonly commandOpen = signal(false);
  protected readonly formSent = signal(false);
  protected readonly activeHeroPanel = signal<HeroPanelId | null>(null);
  protected readonly heroChartType = signal<ChartType>('bars');
  protected readonly heroEffect = signal<HeroEffect>('idle');
  protected readonly heroPanelTransition = signal<HeroPanelTransition>('slide');
  protected readonly heroPanelChanging = signal(false);
  protected readonly heroPalette = signal<HeroPalette>('ocean');
  protected readonly heroChartBars = signal([42, 67, 52, 83, 71]);
  protected readonly earthDepth = signal<
    'behind' | 'out-behind' | 'front-ready' | 'front' | 'out-front' | 'behind-ready'
  >('behind');
  protected readonly neonScore = signal(0);
  protected readonly neonTarget = signal(4);
  protected readonly publicLinks = PUBLIC_LINKS;
  protected readonly heroPanels = HERO_PANELS;
  protected readonly technologyMarquee = TECHNOLOGY_MARQUEE;
  protected readonly languages = LANGUAGES;

  protected readonly capabilities = CAPABILITIES;

  protected readonly selectedCapability = computed(
    () =>
      this.capabilities.find(({ id }) => id === this.activeCapability()) ?? this.capabilities[0],
  );
  protected readonly selectedHeroPanel = computed(() =>
    this.heroPanels.find(({ id }) => id === this.activeHeroPanel()),
  );
  protected readonly heroChartPath = computed(() => {
    const bars = this.heroChartBars();
    const points = bars.map((bar, index) => `${index * 90},${118 - bar}`);
    return `M${points[0]} C30,${118 - bars[0]} 58,${118 - bars[1]} ${points[1]} S148,${118 - bars[2]} ${points[2]} S238,${118 - bars[3]} ${points[3]} S328,${118 - bars[4]} ${points[4]}`;
  });

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
          intro:
            'I combine product-focused frontend development with TypeScript architecture, testing and developer tooling.',
        }
      : {
          navWork: 'Trabajo seleccionado',
          navLab: 'Laboratorio',
          navAbout: 'Enfoque',
          availability: 'Disponible para proyectos de producto',
          viewWork: 'Ver ejemplos',
          contact: 'Hablemos',
          role: 'Frontend engineer que construye productos web y móviles operacionales.',
          intro:
            'Combino desarrollo frontend orientado a producto con arquitectura TypeScript, testing y tooling para developers.',
        },
  );

  constructor() {
    this.lightMode.set(this.document.documentElement.getAttribute('data-theme') === 'light');
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
          : 'home',
      );
      this.updateSeo();
    });
    this.applyPreferredLocale();
  }

  protected setTheme(): void {
    const next = !this.lightMode();
    this.lightMode.set(next);
    this.document.documentElement.setAttribute('data-theme', next ? 'light' : 'dark');
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

  protected setCapability(id: CapabilityId): void {
    this.activeCapability.set(id);
  }

  protected setHeroPanel(panel: HeroPanelId): void {
    if (this.activeHeroPanel() === panel) return;
    if (this.heroPanelTimer !== undefined) window.clearTimeout(this.heroPanelTimer);
    this.heroPanelTransition.set(nextHeroPanelTransition(this.heroPanelTransition()));
    this.heroEffect.set('idle');
    this.heroPanelChanging.set(true);
    this.activeHeroPanel.set(null);
    this.heroPanelTimer = window.setTimeout(() => {
      this.heroPanelTimer = undefined;
      this.activeHeroPanel.set(panel);
      requestAnimationFrame(() => this.heroPanelChanging.set(false));
    }, 24);
  }

  protected clearHeroPanel(): void {
    if (this.heroPanelTimer !== undefined) window.clearTimeout(this.heroPanelTimer);
    this.heroPanelTimer = undefined;
    this.heroPanelChanging.set(false);
    this.activeHeroPanel.set(null);
    this.heroEffect.set('idle');
  }

  protected setHeroChart(type: ChartType): void {
    this.heroChartType.set(type);
    this.randomizeHeroChart();
  }

  protected randomizeHeroChart(): void {
    this.heroChartBars.set(
      Array.from({ length: 5 }, (_, index) => Math.round(28 + Math.random() * 62 + index * 1.5)),
    );
  }

  protected setHeroEffect(effect: Exclude<HeroEffect, 'idle'>): void {
    this.heroEffect.set('idle');
    window.setTimeout(() => this.heroEffect.set(effect), 24);
  }

  protected setHeroPalette(palette: HeroPalette): void {
    this.heroPalette.set(palette);
    this.randomizeHeroChart();
  }

  protected setHeroTemperature(): void {
    this.heroPalette.set('heat');
    this.randomizeHeroChart();
  }

  protected chartBarGradient(value: number): string {
    if (this.heroPalette() === 'heat') {
      if (value >= 80) return 'linear-gradient(to top, #ff4d4d, #ffcf4a)';
      if (value >= 60) return 'linear-gradient(to top, #ff9f1c, #ffe16b)';
      if (value >= 42) return 'linear-gradient(to top, #24b6ff, #74e5ff)';
      return 'linear-gradient(to top, #2856a6, #48b8ff)';
    }
    if (this.heroPalette() === 'lime') return 'linear-gradient(to top, #256c5d, #d8ff78)';
    return 'linear-gradient(to top, #1678ff, #32c8ff)';
  }

  ngOnDestroy(): void {
    if (this.heroPanelTimer !== undefined) window.clearTimeout(this.heroPanelTimer);
  }

  protected showEarthInFront(): void {
    if (this.earthDepth() !== 'behind') return;
    this.earthDepth.set('out-behind');
    window.setTimeout(() => {
      if (this.earthDepth() !== 'out-behind') return;
      this.earthDepth.set('front-ready');
      requestAnimationFrame(() => this.earthDepth.set('front'));
    }, 140);
  }

  protected onEarthControlClick(event: MouseEvent): void {
    event.stopPropagation();
    this.showEarthInFront();
  }

  protected returnEarthBehind(event?: MouseEvent): void {
    if (this.earthDepth() !== 'front') return;
    const target = event?.target as HTMLElement | null | undefined;
    if (target?.closest('.earth-motion-control')) return;
    this.earthDepth.set('out-front');
    window.setTimeout(() => {
      if (this.earthDepth() !== 'out-front') return;
      this.earthDepth.set('behind-ready');
      requestAnimationFrame(() => this.earthDepth.set('behind'));
    }, 140);
  }

  protected hitNeonTarget(index: number): void {
    if (index !== this.neonTarget()) return;
    const score = this.neonScore() + 1;
    this.neonScore.set(score);
    this.neonTarget.set((index + 2 + score * 3) % 9);
  }

  protected submitContact(event: SubmitEvent): void {
    event.preventDefault();
    this.formSent.set(true);
  }

  protected routeFor(page: PortfolioPageId, locale = this.locale()): string[] {
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
    const direction = order.indexOf(target) >= order.indexOf(this.page()) ? 'forward' : 'backward';
    this.document.documentElement.dataset['transitionDirection'] = direction;
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
    const cookieLocale = this.document.cookie.match(/(?:^|; )cartago_locale=([^;]+)/)?.[1];
    const candidate =
      saved ??
      cookieLocale ??
      navigator.languages
        .find((language) => language.startsWith('es') || language.startsWith('en'))
        ?.slice(0, 2) ??
      'en';
    const locale: Locale = candidate === 'es' ? 'es' : 'en';
    if (locale !== this.locale()) {
      queueMicrotask(() => void this.router.navigate(this.routeFor(this.page(), locale)));
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
