import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, inject, OnDestroy, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CAPABILITIES, HERO_PANELS, LANGUAGES, PLAYGROUND_STEPS, SOCIAL_ICONS, TECHNOLOGY_MARQUEE, TELEMETRY } from './portfolio/portfolio.data';
import { renderEarthFrame } from './portfolio/earth-globe-renderer';
import { nextHeroPanelTransition } from './portfolio/portfolio-motion';
import type { CapabilityId, ChartType, HeroEffect, HeroPalette, HeroPanelId, HeroPanelTransition, Locale, PlaygroundStep, PortfolioPageId, TelemetryId } from './portfolio/portfolio.types';

@Component({
  selector: 'app-portfolio-page',
  imports: [RouterLink],
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
  private earthCanvas?: HTMLCanvasElement;
  private earthTexture?: HTMLImageElement;
  private earthFrame?: number;
  private earthLastFrameAt?: number;
  private earthLastRenderAt?: number;
  private readonly earthRenderInterval = 1000 / 60;
  private heroPanelTimer?: number;
  private earthAngle = 0;
  private readonly earthMotion = {
    speed: .00016,
    targetSpeed: .00016,
    axisX: .13,
    axisY: -.95,
    axisZ: .28,
    targetAxisX: .13,
    targetAxisY: -.95,
    targetAxisZ: .28,
  };
  private earthLoading = false;

  protected readonly locale = signal<Locale>('en');
  protected readonly page = signal<PortfolioPageId>('home');
  protected readonly menuOpen = signal(false);
  protected readonly localeMenuOpen = signal(false);
  protected readonly localeMenuClosing = signal(false);
  protected readonly lightMode = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly activeCapability = signal<CapabilityId>('product');
  protected readonly labState = signal<'all' | 'focus' | 'motion'>('all');
  protected readonly activeTelemetry = signal<TelemetryId>('product');
  protected readonly chartType = signal<ChartType>('bars');
  protected readonly commandOpen = signal(false);
  protected readonly formSent = signal(false);
  protected readonly playgroundProgress = signal(0);
  protected readonly playgroundRuns = signal(0);
  protected readonly draggedStep = signal<PlaygroundStep | null>(null);
  protected readonly playgroundOrder = signal<PlaygroundStep[]>(['build', 'discover', 'verify', 'model']);
  protected readonly activeHeroPanel = signal<HeroPanelId | null>(null);
  protected readonly heroChartType = signal<ChartType>('bars');
  protected readonly heroEffect = signal<HeroEffect>('idle');
  protected readonly heroPanelTransition = signal<HeroPanelTransition>('slide');
  protected readonly heroPanelChanging = signal(false);
  protected readonly heroPalette = signal<HeroPalette>('ocean');
  protected readonly heroChartBars = signal([42, 67, 52, 83, 71]);
  protected readonly earthSpinning = signal(false);
  protected readonly earthDepth = signal<'behind' | 'out-behind' | 'front-ready' | 'front' | 'out-front' | 'behind-ready'>('behind');
  protected readonly neonScore = signal(0);
  protected readonly neonTarget = signal(4);
  protected readonly socialIcons = SOCIAL_ICONS;
  protected readonly heroPanels = HERO_PANELS;
  protected readonly technologyMarquee = TECHNOLOGY_MARQUEE;
  protected readonly languages = LANGUAGES;

  protected readonly capabilities = CAPABILITIES;

  protected readonly selectedCapability = computed(
    () => this.capabilities.find(({ id }) => id === this.activeCapability()) ?? this.capabilities[0],
  );
  protected readonly selectedHeroPanel = computed(
    () => this.heroPanels.find(({ id }) => id === this.activeHeroPanel()),
  );
  protected readonly heroChartPath = computed(() => {
    const bars = this.heroChartBars();
    const points = bars.map((bar, index) => `${index * 90},${118 - bar}`);
    return `M${points[0]} C30,${118 - bars[0]} 58,${118 - bars[1]} ${points[1]} S148,${118 - bars[2]} ${points[2]} S238,${118 - bars[3]} ${points[3]} S328,${118 - bars[4]} ${points[4]}`;
  });

  protected readonly playgroundSteps = PLAYGROUND_STEPS;
  protected readonly playgroundMessage = computed(() => {
    if (this.playgroundComplete()) return 'Loop complete — the product workflow is in a deliberate order.';
    return 'Drag the steps into the order in which a product should be shipped.';
  });
  protected readonly playgroundComplete = computed(() => this.playgroundOrder().every(
    (step, index) => step === this.playgroundSteps[index].id,
  ));

  protected readonly telemetry = TELEMETRY;
  protected readonly selectedTelemetry = computed(
    () => this.telemetry.find(({ id }) => id === this.activeTelemetry()) ?? this.telemetry[0],
  );

  protected readonly copy = computed(() => this.locale() === 'en' ? {
    navWork: 'Selected work', navLab: 'Frontend lab', navAbout: 'Approach',
    availability: 'Available for thoughtful product work', viewWork: 'View examples', contact: 'Start a conversation',
    role: 'Frontend engineer building operational web and mobile products.',
    intro: 'I combine product-focused frontend development with TypeScript architecture, testing and developer tooling.',
  } : {
    navWork: 'Trabajo seleccionado', navLab: 'Laboratorio', navAbout: 'Enfoque',
    availability: 'Disponible para proyectos de producto', viewWork: 'Ver ejemplos', contact: 'Hablemos',
    role: 'Frontend engineer que construye productos web y móviles operacionales.',
    intro: 'Combino desarrollo frontend orientado a producto con arquitectura TypeScript, testing y tooling para developers.',
  });

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
      this.page.set(page === 'work' || page === 'lab' || page === 'approach' || page === 'knowledge' || page === 'docker' || page === 'demos' || page === 'contact' ? page : 'home');
      this.updateSeo();
    });
    this.applyPreferredLocale();
  }

  @ViewChild('earthCanvas')
  set earthCanvasRef(canvas: ElementRef<HTMLCanvasElement> | undefined) {
    this.earthCanvas = canvas?.nativeElement;
    if (this.earthCanvas) this.prepareEarthTexture();
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
    this.heroChartBars.set(Array.from({ length: 5 }, (_, index) => Math.round(28 + Math.random() * 62 + index * 1.5)));
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

  protected startEarthSpin(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.earthSpinning.set(true);
    this.prepareEarthTexture();
    if (this.earthTexture && this.earthFrame === undefined) {
      this.earthLastFrameAt = undefined;
      this.earthLastRenderAt = undefined;
      this.animateEarth(performance.now());
    }
  }

  protected stopEarthSpin(): void {
    this.earthSpinning.set(false);
    if (this.earthFrame !== undefined) {
      cancelAnimationFrame(this.earthFrame);
      this.earthFrame = undefined;
    }
    this.earthLastFrameAt = undefined;
    this.earthLastRenderAt = undefined;
  }

  private prepareEarthTexture(): void {
    if (!isPlatformBrowser(this.platformId) || this.earthTexture || this.earthLoading) return;
    this.earthLoading = true;
    const texture = new Image();
    texture.src = '/images/cartagonova-earth-texture-hd.png';
    texture.onload = () => {
      this.earthTexture = texture;
      this.earthLoading = false;
      if (this.earthSpinning() && this.earthFrame === undefined) {
        this.earthLastFrameAt = undefined;
        this.earthLastRenderAt = undefined;
        this.animateEarth(performance.now());
      }
    };
    texture.onerror = () => { this.earthLoading = false; };
  }

  private animateEarth(now: number): void {
    if (!this.earthSpinning()) {
      this.earthFrame = undefined;
      return;
    }
    const previous = this.earthLastFrameAt ?? now;
    const delta = Math.min(48, now - previous);
    this.earthLastFrameAt = now;
    const blend = 1 - Math.exp(-delta / 620);
    this.earthMotion.speed += (this.earthMotion.targetSpeed - this.earthMotion.speed) * blend;
    this.earthMotion.axisX += (this.earthMotion.targetAxisX - this.earthMotion.axisX) * blend;
    this.earthMotion.axisY += (this.earthMotion.targetAxisY - this.earthMotion.axisY) * blend;
    this.earthMotion.axisZ += (this.earthMotion.targetAxisZ - this.earthMotion.axisZ) * blend;
    const axisLength = Math.hypot(this.earthMotion.axisX, this.earthMotion.axisY, this.earthMotion.axisZ);
    this.earthMotion.axisX /= axisLength;
    this.earthMotion.axisY /= axisLength;
    this.earthMotion.axisZ /= axisLength;
    this.earthAngle += this.earthMotion.speed * delta;
    if (this.earthLastRenderAt === undefined || now - this.earthLastRenderAt >= this.earthRenderInterval) {
      this.earthLastRenderAt = now;
      this.renderEarth();
    }
    this.earthFrame = requestAnimationFrame((time) => this.animateEarth(time));
  }

  ngOnDestroy(): void {
    this.stopEarthSpin();
    if (this.heroPanelTimer !== undefined) window.clearTimeout(this.heroPanelTimer);
  }

  protected changeEarthMotion(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const direction = this.earthMotion.targetSpeed >= 0 ? -1 : 1;
    this.earthMotion.targetSpeed = direction * (.00014 + Math.random() * .00032);
    this.earthMotion.targetAxisX = -.78 + Math.random() * 1.56;
    this.earthMotion.targetAxisY = -.84 + Math.random() * 1.68;
    this.earthMotion.targetAxisZ = -.68 + Math.random() * 1.36;
    if (!this.earthSpinning()) this.startEarthSpin();
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
    this.changeEarthMotion();
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

  private renderEarth(): void {
    const canvas = this.earthCanvas;
    const texture = this.earthTexture;
    if (!canvas || !texture) return;
    const inFront = this.earthDepth() === 'front-ready' || this.earthDepth() === 'front' || this.earthDepth() === 'out-front';
    const { axisX, axisY, axisZ } = this.earthMotion;
    renderEarthFrame(canvas, texture, { angle: this.earthAngle, axisX, axisY, axisZ, foreground: inFront });
  }

  protected setTelemetry(metric: TelemetryId): void {
    this.activeTelemetry.set(metric);
  }

  protected setChartType(type: ChartType): void {
    this.chartType.set(type);
  }

  protected hitNeonTarget(index: number): void {
    if (index !== this.neonTarget()) return;
    const score = this.neonScore() + 1;
    this.neonScore.set(score);
    this.neonTarget.set((index + 2 + score * 3) % 9);
  }

  protected playStep(step: PlaygroundStep): void {
    const expected = this.playgroundSteps[this.playgroundProgress()]?.id;
    if (step !== expected) {
      this.playgroundProgress.set(0);
      return;
    }
    const next = this.playgroundProgress() + 1;
    if (next === this.playgroundSteps.length) {
      this.playgroundProgress.set(next);
      this.playgroundRuns.update((runs) => runs + 1);
      return;
    }
    this.playgroundProgress.set(next);
  }

  protected startDrag(step: PlaygroundStep): void {
    this.draggedStep.set(step);
  }

  protected dropStep(target: PlaygroundStep): void {
    const dragged = this.draggedStep();
    if (!dragged || dragged === target) return;
    this.playgroundOrder.update((order) => {
      const next = [...order];
      const from = next.indexOf(dragged);
      const to = next.indexOf(target);
      next.splice(from, 1);
      next.splice(to, 0, dragged);
      return next;
    });
    this.draggedStep.set(null);
    if (this.playgroundOrder().every((step, index) => step === this.playgroundSteps[index].id)) {
      this.playgroundRuns.update((runs) => runs + 1);
    }
  }

  protected playgroundStep(step: PlaygroundStep) {
    return this.playgroundSteps.find(({ id }) => id === step) ?? this.playgroundSteps[0];
  }

  protected resetPlayground(): void {
    this.playgroundProgress.set(0);
    this.playgroundOrder.set(['build', 'discover', 'verify', 'model']);
    this.draggedStep.set(null);
  }

  protected submitContact(event: SubmitEvent): void {
    event.preventDefault();
    this.formSent.set(true);
  }

  protected routeFor(page: PortfolioPageId, locale = this.locale()): string[] {
    return page === 'home' ? ['/', locale] : ['/', locale, page];
  }

  protected setTransition(target: PortfolioPageId): void {
    const order: PortfolioPageId[] = ['home', 'work', 'lab', 'approach', 'knowledge', 'docker', 'demos', 'contact'];
    const direction = order.indexOf(target) >= order.indexOf(this.page()) ? 'forward' : 'backward';
    this.document.documentElement.dataset['transitionDirection'] = direction;
    this.menuOpen.set(false);
    this.localeMenuOpen.set(false);
  }

  private updateSeo(): void {
    const section = this.page();
    const spanish = this.locale() === 'es';
    const labels: Record<PortfolioPageId, string> = spanish
      ? { home: 'Frontend product engineer', work: 'Proyectos destacados', lab: 'Laboratorio frontend', approach: 'Enfoque', knowledge: 'Conocimientos', docker: 'Docker', demos: 'Demos', contact: 'Contacto' }
      : { home: 'Frontend product engineer', work: 'Pinned projects', lab: 'Frontend lab', approach: 'Approach', knowledge: 'Knowledge', docker: 'Docker', demos: 'Demos', contact: 'Contact' };
    const description = spanish
      ? 'Portfolio de Mario Cabrero Volarich: frontend de producto, Angular, TypeScript, móvil y tooling.'
      : 'Mario Cabrero Volarich’s portfolio: product frontend, Angular, TypeScript, mobile delivery and developer tooling.';
    this.title.setTitle(`Cartago · ${labels[section]}`);
    this.meta.updateTag({ name: 'description', content: description });
  }

  private applyPreferredLocale(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    let saved: string | null = null;
    try { saved = localStorage.getItem('cartago-locale'); } catch { /* Storage can be blocked. */ }
    const cookieLocale = this.document.cookie.match(/(?:^|; )cartago_locale=([^;]+)/)?.[1];
    const candidate = saved ?? cookieLocale ?? navigator.languages.find((language) => language.startsWith('es') || language.startsWith('en'))?.slice(0, 2) ?? 'en';
    const locale: Locale = candidate === 'es' ? 'es' : 'en';
    if (locale !== this.locale()) {
      queueMicrotask(() => void this.router.navigate(this.routeFor(this.page(), locale)));
    }
  }

  private persistLocale(locale: Locale): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try { localStorage.setItem('cartago-locale', locale); } catch { /* Cookie remains a server-readable fallback. */ }
    this.document.cookie = `cartago_locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }

  protected closeMenu(): void { this.menuOpen.set(false); }
}
