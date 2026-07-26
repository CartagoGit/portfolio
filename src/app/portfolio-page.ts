import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, computed, HostListener, inject, PLATFORM_ID, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

type Locale = 'en' | 'es';
type PortfolioPageId = 'home' | 'work' | 'lab' | 'approach' | 'knowledge' | 'docker' | 'demos' | 'contact';
type PlaygroundStep = 'discover' | 'model' | 'build' | 'verify';
type CapabilityId = 'product' | 'architecture' | 'mobile' | 'quality' | 'systems' | 'tooling';
type HeroPanelId = 'overview' | 'workflows' | 'quality' | 'mobile';
type TelemetryId = 'product' | 'quality' | 'delivery';
type ChartType = 'bars' | 'line' | 'area';

interface Capability {
  id: CapabilityId;
  eyebrow: string;
  title: string;
  detail: string;
  tools: string[];
  proof: string;
}

interface LanguageOption {
  id: Locale;
  label: string;
  detail: string;
}

@Component({
  selector: 'app-portfolio-page',
  imports: [RouterLink],
  templateUrl: './portfolio-page.html',
  styleUrl: './portfolio-page.scss',
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
  protected readonly activeHeroPanel = signal<HeroPanelId>('overview');
  protected readonly neonScore = signal(0);
  protected readonly neonTarget = signal(4);
  protected readonly heroLayers = signal(['Angular 22', 'TypeScript', 'Ionic', 'Capacitor', 'MCP Vertex', 'Testing']);
  protected readonly heroPanels: readonly { id: HeroPanelId; label: string; metric: string; detail: string; icon: string }[] = [
    { id: 'overview', label: 'Angular products', metric: 'v22', detail: 'Signals · SSR · UI architecture', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/angular.svg' },
    { id: 'workflows', label: 'TypeScript tools', metric: 'MCP', detail: 'Vertex · QuickModel · Keyer', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/typescript.svg' },
    { id: 'quality', label: 'Quality system', metric: 'E2E', detail: 'Vitest · Playwright · A11y', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/playwright.svg' },
    { id: 'mobile', label: 'Mobile delivery', metric: 'iOS+', detail: 'Ionic · Capacitor · Android', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/ionic.svg' },
  ];
  protected readonly languages: readonly LanguageOption[] = [
    { id: 'en', label: 'English', detail: 'US + UK' },
    { id: 'es', label: 'Español', detail: 'España' },
  ];

  protected readonly capabilities: Capability[] = [
    {
      id: 'product', eyebrow: '01 / Product interfaces', title: 'Operational by design.',
      detail: 'Interfaces for people who use them all day: dense information, clear next actions and graceful empty states.',
      tools: ['Angular', 'SCSS', 'Responsive UI'], proof: 'Workflow interfaces · complex forms · interaction design',
    },
    {
      id: 'architecture', eyebrow: '02 / Angular architecture', title: 'Explicitly reactive.',
      detail: 'Standalone components, signals and typed boundaries make state changes understandable, testable and fast.',
      tools: ['Angular 22', 'Signals', 'Zoneless'], proof: 'Zoneless Calculator · production Angular patterns',
    },
    {
      id: 'mobile', eyebrow: '03 / Mobile delivery', title: 'One product, more surfaces.',
      detail: 'Web workflows designed for touch, constrained space and release-ready Android delivery — not simply shrunk desktop screens.',
      tools: ['Ionic', 'Capacitor', 'Android'], proof: 'Web + Android operational delivery',
    },
    {
      id: 'quality', eyebrow: '04 / Testing & quality', title: 'Confidence is a feature.',
      detail: 'A focused testing pyramid, semantic HTML and performance budgets keep product work reliable as it grows.',
      tools: ['Vitest', 'Playwright', 'A11y'], proof: 'Unit → integration → end-to-end',
    },
    {
      id: 'systems', eyebrow: '05 / Design systems', title: 'Consistent, not repetitive.',
      detail: 'Flexible primitives turn a visual language into reusable, accessible interfaces without flattening every screen into a template.',
      tools: ['Tokens', 'CDK', 'Storybook'], proof: 'Reusable UI patterns · states · responsive rules',
    },
    {
      id: 'tooling', eyebrow: '06 / Developer tooling', title: 'The frontend has an engine room.',
      detail: 'Typed contracts, CLIs and MCP tooling turn repeated engineering work into dependable workflows for teams and agents.',
      tools: ['TypeScript', 'MCP', 'Docker'], proof: 'MCP Vertex · QuickModel · Keyer',
    },
  ];

  protected readonly selectedCapability = computed(
    () => this.capabilities.find(({ id }) => id === this.activeCapability()) ?? this.capabilities[0],
  );
  protected readonly selectedHeroPanel = computed(
    () => this.heroPanels.find(({ id }) => id === this.activeHeroPanel()) ?? this.heroPanels[0],
  );

  protected readonly playgroundSteps: readonly { id: PlaygroundStep; label: string; hint: string }[] = [
    { id: 'discover', label: 'Discover', hint: 'Understand the person and the workflow.' },
    { id: 'model', label: 'Model', hint: 'Make state and constraints explicit.' },
    { id: 'build', label: 'Build', hint: 'Compose a useful, responsive interface.' },
    { id: 'verify', label: 'Verify', hint: 'Test the journey before shipping.' },
  ];
  protected readonly playgroundMessage = computed(() => {
    if (this.playgroundComplete()) return 'Loop complete — the product workflow is in a deliberate order.';
    return 'Drag the steps into the order in which a product should be shipped.';
  });
  protected readonly playgroundComplete = computed(() => this.playgroundOrder().every(
    (step, index) => step === this.playgroundSteps[index].id,
  ));

  protected readonly telemetry = [
    { id: 'product' as const, label: 'Product signal', title: 'A dashboard should reveal a decision.', value: '98%', valueLabel: 'workflow clarity', kpis: [['12', 'active patterns'], ['4.2h', 'saved per flow'], ['3', 'surfaces']], bars: [34, 46, 42, 68, 61, 78, 88, 96], note: 'Signals are grouped by workflow, not by a vanity metric.' },
    { id: 'quality' as const, label: 'Quality signal', title: 'Quality is a visible operating metric.', value: '94%', valueLabel: 'critical flow coverage', kpis: [['0', 'blocking a11y issues'], ['18', 'checked states'], ['1.8s', 'interaction budget']], bars: [55, 58, 71, 67, 79, 85, 89, 94], note: 'Testing, semantics and performance share the same delivery conversation.' },
    { id: 'delivery' as const, label: 'Delivery signal', title: 'One interface, more than one surface.', value: '2×', valueLabel: 'web + Android delivery', kpis: [['7', 'release checkpoints'], ['3', 'deployment paths'], ['99.9%', 'workflow availability']], bars: [30, 38, 58, 55, 72, 69, 84, 91], note: 'Responsive product work considers the next device before it becomes a rewrite.' },
  ] as const;
  protected readonly selectedTelemetry = computed(
    () => this.telemetry.find(({ id }) => id === this.activeTelemetry()) ?? this.telemetry[0],
  );

  protected readonly copy = computed(() => this.locale() === 'en' ? {
    navWork: 'Selected work', navLab: 'Frontend lab', navAbout: 'Approach',
    availability: 'Available for thoughtful product work', viewWork: 'View selected work', contact: 'Start a conversation',
    role: 'Frontend engineer building operational web and mobile products.',
    intro: 'I combine product-focused frontend development with TypeScript architecture, testing and developer tooling.',
  } : {
    navWork: 'Trabajo seleccionado', navLab: 'Laboratorio', navAbout: 'Enfoque',
    availability: 'Disponible para proyectos de producto', viewWork: 'Ver trabajo seleccionado', contact: 'Hablemos',
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
    this.activeHeroPanel.set(panel);
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
