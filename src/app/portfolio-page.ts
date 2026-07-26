import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, computed, ElementRef, HostListener, inject, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { siAngular, siBun, siCapacitor, siClaude, siDocker, siElectron, siEslint, siFirebase, siGit, siGithub, siGithubactions, siGithubcopilot, siGitlab, siIonic, siJest, siKotlin, siLinux, siMaterialdesign, siMinimax, siModelcontextprotocol, siMongodb, siMongoose, siNestjs, siNodedotjs, siNpm, siNx, siOpencode, siPrettier, siPrimeng, siPrisma, siReact, siReactivex, siSass, siStorybook, siTailwindcss, siTypescript, siVite, siVitest, siVuedotjs, siX, siZod } from 'simple-icons';

type Locale = 'en' | 'es';
type PortfolioPageId = 'home' | 'work' | 'lab' | 'approach' | 'knowledge' | 'docker' | 'demos' | 'contact';
type PlaygroundStep = 'discover' | 'model' | 'build' | 'verify';
type CapabilityId = 'product' | 'architecture' | 'mobile' | 'quality' | 'systems' | 'tooling';
type HeroPanelId = 'overview' | 'workflows' | 'quality' | 'mobile' | 'tooling' | 'delivery';
type TelemetryId = 'product' | 'quality' | 'delivery';
type ChartType = 'bars' | 'line' | 'area' | 'dots' | 'pulse' | 'wave' | 'grid';
type HeroEffect = 'idle' | 'shake' | 'glitch' | 'float' | 'spectrum';
type HeroPalette = 'ocean' | 'heat' | 'lime';

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
  private earthCanvas?: HTMLCanvasElement;
  private earthTexture?: ImageData;
  private earthFrame?: number;
  private earthLastFrameAt?: number;
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
  protected readonly heroPalette = signal<HeroPalette>('ocean');
  protected readonly heroChartBars = signal([42, 67, 52, 83, 71]);
  protected readonly earthSpinning = signal(false);
  protected readonly earthDepth = signal<'behind' | 'leaping-front' | 'front' | 'returning'>('behind');
  protected readonly neonScore = signal(0);
  protected readonly neonTarget = signal(4);
  protected readonly socialIcons = { github: siGithub, npm: siNpm };
  protected readonly heroPanels: readonly { id: HeroPanelId; label: string; metric: string; detail: string; iconPath: string; color: string; iconAsset?: string }[] = [
    { id: 'overview', label: 'Angular', metric: 'UI', detail: 'Framework for structured, reactive web products with SSR and signals.', iconPath: siAngular.path, color: '#ff2d95', iconAsset: '/icons/angular.svg' },
    { id: 'workflows', label: 'TypeScript', metric: 'TS', detail: 'Typed contracts for interfaces, libraries and developer tooling.', iconPath: siTypescript.path, color: '#3178c6' },
    { id: 'quality', label: 'Vitest', metric: 'VT', detail: 'Fast unit and integration testing that keeps frontend behaviour dependable.', iconPath: siVitest.path, color: '#fcc72b' },
    { id: 'mobile', label: 'Ionic + Capacitor', metric: 'MOB', detail: 'A shared product system delivered to web and native mobile surfaces.', iconPath: siIonic.path || siCapacitor.path, color: '#3880ff' },
    { id: 'tooling', label: 'Bun', metric: 'BUN', detail: 'A fast JavaScript runtime and toolkit used to keep local feedback loops short.', iconPath: siBun.path, color: '#f9f1e8' },
    { id: 'delivery', label: 'Docker', metric: 'CTR', detail: 'Containerised delivery for reproducible environments and public image distribution.', iconPath: siDocker.path, color: '#2496ed' },
  ];
  protected readonly technologyMarquee: readonly { label: string; iconPath: string; color: string }[] = [
    { label: 'TypeScript', iconPath: siTypescript.path, color: '#3178c6' }, { label: 'Angular', iconPath: siAngular.path, color: '#ff2d95' }, { label: 'RxJS', iconPath: siReactivex.path, color: '#b7178c' }, { label: 'Ionic', iconPath: siIonic.path, color: '#3880ff' }, { label: 'Capacitor', iconPath: siCapacitor.path, color: '#119eff' }, { label: 'Angular Material', iconPath: siMaterialdesign.path, color: '#757575' }, { label: 'Sass', iconPath: siSass.path, color: '#cc6699' },
    { label: 'Bun', iconPath: siBun.path, color: '#f9f1e1' }, { label: 'Node.js', iconPath: siNodedotjs.path, color: '#339933' }, { label: 'NestJS', iconPath: siNestjs.path, color: '#e0234e' }, { label: 'npm', iconPath: siNpm.path, color: '#cb3837' }, { label: 'Docker', iconPath: siDocker.path, color: '#2496ed' }, { label: 'Git', iconPath: siGit.path, color: '#f05032' }, { label: 'GitLab CI', iconPath: siGitlab.path, color: '#fc6d26' }, { label: 'Vitest', iconPath: siVitest.path, color: '#6e9f18' }, { label: 'Jest', iconPath: siJest.path, color: '#c21325' }, { label: 'GitHub Actions', iconPath: siGithubactions.path, color: '#2088ff' },
    { label: 'Vue', iconPath: siVuedotjs.path, color: '#4fc08d' }, { label: 'React', iconPath: siReact.path, color: '#61dafb' }, { label: 'Electron', iconPath: siElectron.path, color: '#47848f' }, { label: 'Tailwind CSS', iconPath: siTailwindcss.path, color: '#06b6d4' }, { label: 'PrimeNG', iconPath: siPrimeng.path, color: '#dd0031' }, { label: 'Storybook', iconPath: siStorybook.path, color: '#ff4785' }, { label: 'Vite', iconPath: siVite.path, color: '#646cff' }, { label: 'Nx', iconPath: siNx.path, color: '#143055' },
    { label: 'MongoDB', iconPath: siMongodb.path, color: '#47a248' }, { label: 'Mongoose', iconPath: siMongoose.path, color: '#880000' }, { label: 'Prisma', iconPath: siPrisma.path, color: '#2d3748' }, { label: 'Zod', iconPath: siZod.path, color: '#3e67b1' }, { label: 'Firebase', iconPath: siFirebase.path, color: '#dd2c00' }, { label: 'Linux', iconPath: siLinux.path, color: '#fcc624' }, { label: 'Kotlin', iconPath: siKotlin.path, color: '#7f52ff' },
    { label: 'Claude', iconPath: siClaude.path, color: '#d97757' }, { label: 'MiniMax', iconPath: siMinimax.path, color: '#e8e8e8' }, { label: 'Grok', iconPath: siX.path, color: '#e8e8e8' }, { label: 'OpenCode', iconPath: siOpencode.path, color: '#e8e8e8' }, { label: 'GitHub Copilot', iconPath: siGithubcopilot.path, color: '#ffffff' }, { label: 'Model Context Protocol', iconPath: siModelcontextprotocol.path, color: '#ffffff' }, { label: 'ESLint', iconPath: siEslint.path, color: '#4b32c3' }, { label: 'Prettier', iconPath: siPrettier.path, color: '#f7b93e' }, { label: 'GitHub', iconPath: siGithub.path, color: '#ffffff' },
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
      tools: ['Vitest', 'Accessibility', 'Performance'], proof: 'Unit → integration → dependable releases',
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
    () => this.heroPanels.find(({ id }) => id === this.activeHeroPanel()),
  );
  protected readonly heroChartPath = computed(() => {
    const bars = this.heroChartBars();
    const points = bars.map((bar, index) => `${index * 90},${118 - bar}`);
    return `M${points[0]} C30,${118 - bars[0]} 58,${118 - bars[1]} ${points[1]} S148,${118 - bars[2]} ${points[2]} S238,${118 - bars[3]} ${points[3]} S328,${118 - bars[4]} ${points[4]}`;
  });

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
    this.activeHeroPanel.set(null);
    this.heroEffect.set('idle');
    window.setTimeout(() => this.activeHeroPanel.set(panel), 24);
  }

  protected clearHeroPanel(): void {
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
  }

  private prepareEarthTexture(): void {
    if (!isPlatformBrowser(this.platformId) || this.earthTexture || this.earthLoading) return;
    this.earthLoading = true;
    const texture = new Image();
    texture.src = '/images/cartagonova-earth-texture.png';
    texture.onload = () => {
      const source = this.document.createElement('canvas');
      source.width = 1024;
      source.height = 512;
      const context = source.getContext('2d', { willReadFrequently: true });
      if (!context) return;
      context.drawImage(texture, 0, 0, source.width, source.height);
      this.earthTexture = context.getImageData(0, 0, source.width, source.height);
      this.earthLoading = false;
      if (this.earthSpinning() && this.earthFrame === undefined) {
        this.earthLastFrameAt = undefined;
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
    this.renderEarth();
    this.earthFrame = requestAnimationFrame((time) => this.animateEarth(time));
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
    this.earthDepth.set('leaping-front');
    window.setTimeout(() => {
      if (this.earthDepth() === 'leaping-front') this.earthDepth.set('front');
    }, 220);
  }

  protected onEarthControlClick(event: MouseEvent): void {
    event.stopPropagation();
    this.changeEarthMotion();
    this.showEarthInFront();
  }

  protected returnEarthBehind(event?: MouseEvent): void {
    if (this.earthDepth() !== 'front' && this.earthDepth() !== 'leaping-front') return;
    const target = event?.target as HTMLElement | null | undefined;
    if (target?.closest('.earth-motion-control')) return;
    this.earthDepth.set('returning');
    window.setTimeout(() => {
      if (this.earthDepth() === 'returning') this.earthDepth.set('behind');
    }, 240);
  }

  private renderEarth(): void {
    const canvas = this.earthCanvas;
    const texture = this.earthTexture;
    if (!canvas || !texture) return;
    const deviceScale = Math.min(window.devicePixelRatio || 1, 1.75);
    const size = Math.min(560, Math.max(300, Math.round((canvas.clientWidth || 300) * deviceScale)));
    if (canvas.width !== size || canvas.height !== size) {
      canvas.width = size;
      canvas.height = size;
    }
    const context = canvas.getContext('2d');
    if (!context) return;
    const output = context.createImageData(size, size);
    const radius = size / 2;
    const { axisX, axisY, axisZ } = this.earthMotion;
    const angle = this.earthAngle;
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    const textureWidth = texture.width;
    const textureHeight = texture.height;
    for (let py = 0; py < size; py += 1) {
      const y = (py + .5 - radius) / radius;
      for (let px = 0; px < size; px += 1) {
        const x = (px + .5 - radius) / radius;
        const distance = x * x + y * y;
        const outputIndex = (py * size + px) * 4;
        if (distance > 1) continue;
        const z = Math.sqrt(1 - distance);
        const dot = axisX * x + axisY * y + axisZ * z;
        const crossX = axisY * z - axisZ * y;
        const crossY = axisZ * x - axisX * z;
        const crossZ = axisX * y - axisY * x;
        const rotatedX = x * cosine + crossX * sine + axisX * dot * (1 - cosine);
        const rotatedY = y * cosine + crossY * sine + axisY * dot * (1 - cosine);
        const rotatedZ = z * cosine + crossZ * sine + axisZ * dot * (1 - cosine);
        const longitude = Math.atan2(rotatedX, rotatedZ);
        const latitude = Math.asin(Math.max(-1, Math.min(1, -rotatedY)));
        const sourceX = Math.floor(((longitude / (Math.PI * 2) + .5) % 1) * textureWidth);
        const sourceY = Math.max(0, Math.min(textureHeight - 1, Math.floor((.5 - latitude / Math.PI) * textureHeight)));
        const sourceIndex = (sourceY * textureWidth + sourceX) * 4;
        const light = .34 + .66 * Math.max(0, -.35 * x - .2 * y + .92 * z);
        output.data[outputIndex] = texture.data[sourceIndex] * light;
        output.data[outputIndex + 1] = texture.data[sourceIndex + 1] * light;
        output.data[outputIndex + 2] = texture.data[sourceIndex + 2] * light;
        output.data[outputIndex + 3] = 255;
      }
    }
    context.putImageData(output, 0, 0);
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
