import { isPlatformBrowser } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	inject,
	input,
	type OnDestroy,
	PLATFORM_ID,
	signal,
	ViewEncapsulation,
} from '@angular/core';
import { EarthGlobeComponent } from '../earth-globe/earth-globe.component';
import { EarthDepthFacade } from '../earth-globe/earth-depth.facade';
import { EarthGlobeControlsComponent } from './earth-globe-controls.component';
import {
	chartLabel as catalogChartLabel,
	CHART_OPTIONS,
	CONSOLE_EFFECTS,
	DESTINATION_ICON_PATHS,
	EFFECT_OPTIONS,
} from './hero-monitor.catalog';
import {
	closeSphereLabel as catalogCloseSphereLabel,
	earthCategoryLabel as catalogEarthCategoryLabel,
	earthTextureLabel as catalogEarthTextureLabel,
	earthTextureOriginLabel as catalogEarthTextureOriginLabel,
	EARTH_TEXTURE_CATEGORIES,
	EARTH_TEXTURE_OPTIONS,
} from './earth-texture.catalog';
import { HeroMonitorFacade } from './hero-monitor.facade';
import { PUBLIC_LINKS } from '../../../domain/data.constant';
import {
	monitorDestinations,
	primaryTechnologyDestination,
} from '../../../domain/monitor-destinations.helper';
import { TranslatePipe } from '../../../lang/translate.pipe';
import { TranslateService } from '../../../lang/translate.service';
import { contentKey } from '../../../lang/content-key.helper';
import type {
	IChartType,
	IEarthTextureCategory,
	IEarthTextureStyle,
	IHeroPanelId,
	ILocale,
	IMonitorDestination,
	IMonitorDestinationKind,
	IMonitorPreview,
	IPublicLink,
	ITechnology,
} from '../../../domain/types.interface';

/**
 * Interactive hero composition: live monitor with technology rail + sphere.
 */
@Component({
	selector: 'app-hero-monitor',
	imports: [EarthGlobeComponent, EarthGlobeControlsComponent, TranslatePipe],
	templateUrl: './hero-monitor.component.html',
	styleUrl: './hero-monitor.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		'(document:pointerdown)': '_onDocumentDown($event)',
		'(document:fullscreenchange)': '_onFullscreenChange()',
		'[class.hero-monitor-host--earth-front]': 'earthBlocksMonitor()',
		'[class.hero-monitor-host--fullscreen]': 'monitorFullscreen()',
	},
})
export class HeroMonitorComponent implements OnDestroy {
	readonly locale = input.required<ILocale>();
	readonly technologies = input.required<readonly ITechnology[]>();
	readonly preview = input<IMonitorPreview | null>(null);
	readonly activePreview = signal<IMonitorPreview | null>(null);
	readonly activeSection = signal<'projects' | 'technologies'>('projects');
	readonly previewItems = computed(() => {
		const active = this.activePreview();
		if (!active) return [];
		const panel = this.panels.find(({ label }) => label === active.label);
		const projectDetailKey = panel ? this._projectDetailKey(panel.id) : null;
		return [{
			...active,
			detail: projectDetailKey
				? this._translate.instant(projectDetailKey)
				: active.kind === 'technology'
					? active.detail || this._translate.instant('pages.home.monitorTechnologyDetail', { label: active.label })
					: active.kind === 'project'
						? active.detail
						: this._translate.instant('pages.home.monitorPlatformDetail', { label: active.label }),
			status: active.kind === 'project'
				? this._translate.instant('pages.home.monitorProjectStatus')
				: active.kind === 'platform'
					? this._translate.instant('pages.home.monitorPlatformStatus')
					: this._translate.instant('pages.home.monitorTechnologyStatus'),
		}];
	});
	readonly activeDestinations = computed(() => monitorDestinations(this.activePreview()));
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _translate = inject(TranslateService);
	private readonly _previewSync = effect(() => {
		if (!isPlatformBrowser(this._platformId)) return;
		this.showPreview(this.preview());
	});
	readonly hero = new HeroMonitorFacade();
	private readonly _earth = new EarthDepthFacade();

	readonly activePanel = this.hero.activePanel;
	readonly chartType = this.hero.chartType;
	readonly effect = this.hero.effect;
	readonly panelTransition = this.hero.panelTransition;
	readonly panelChanging = this.hero.panelChanging;
	readonly palette = this.hero.palette;
	readonly chartBars = this.hero.chartBars;
	readonly chartPath = this.hero.chartPath;
	readonly selectedPanel = this.hero.selectedPanel;
	readonly panels = this.hero.panels;
	readonly earthDepth = this._earth.state;
	readonly earthBlocksMonitor = this._earth.blocksMonitor;
	readonly earthControlsVisible = computed(() => {
		const depth = this.earthDepth();
		return depth === 'front-ready' || depth === 'front' || depth === 'out-front';
	});
	readonly monitorExpanded = signal(false);
	readonly monitorFullscreen = signal(false);
	readonly chartChanging = signal(false);
	readonly earthPreview = signal(false);
	readonly earthTexture = signal<IEarthTextureStyle>('clouds');
	readonly earthTextureCategories = EARTH_TEXTURE_CATEGORIES;
	readonly earthTextureOptions = EARTH_TEXTURE_OPTIONS;
	readonly earthTextureCategory = signal<IEarthTextureCategory>('earth');
	readonly visibleEarthTextureOptions = computed(() =>
		this.earthTextureOptions.filter(
			({ category }) => category === this.earthTextureCategory()
		)
	);
	private _monitorHovered = false;
	private _monitorOpening = false;
	private _monitorOpenTimer?: number;
	private _monitorCloseTimer?: number;
	private _consoleEffectFrame?: number;
	private _consoleEffectTimer?: number;
	private _chartTransitionTimer?: number;
	private readonly _earthReturnSync = effect(() => {
		if (this.earthBlocksMonitor()) {
			this._monitorHovered = false;
			this._monitorOpening = false;
			if (this._monitorOpenTimer !== undefined) {
				window.clearTimeout(this._monitorOpenTimer);
				this._monitorOpenTimer = undefined;
			}
			this.monitorExpanded.set(false);
			return;
		}
		if (
			this.earthDepth() === 'behind' &&
			this.monitorExpanded() &&
			!this._monitorHovered
		)
			this._queueMonitorClose();
	});

	readonly chartOptions = CHART_OPTIONS;
	readonly effectOptions = EFFECT_OPTIONS;

	readonly platformLinks = PUBLIC_LINKS.filter((link) => link.group === 'platform');
	readonly consoleEffects = CONSOLE_EFFECTS;
	readonly consoleEffect = signal('none');

	ngOnDestroy(): void {
		this.hero.destroy();
		this._earth.destroy();
		if (this._monitorOpenTimer !== undefined)
			window.clearTimeout(this._monitorOpenTimer);
		if (this._monitorCloseTimer !== undefined)
			window.clearTimeout(this._monitorCloseTimer);
		if (this._consoleEffectFrame !== undefined)
			cancelAnimationFrame(this._consoleEffectFrame);
		if (this._consoleEffectTimer !== undefined)
			window.clearTimeout(this._consoleEffectTimer);
		if (this._chartTransitionTimer !== undefined)
			window.clearTimeout(this._chartTransitionTimer);
		this._previewSync.destroy();
		this._earthReturnSync.destroy();
	}

	enterMonitor(): void {
		if (!isPlatformBrowser(this._platformId)) return;
		if (this.earthBlocksMonitor()) return;
		this._monitorHovered = true;
		if (this._monitorCloseTimer !== undefined) {
			window.clearTimeout(this._monitorCloseTimer);
			this._monitorCloseTimer = undefined;
		}
		if (this.monitorExpanded()) return;
		this._monitorOpening = true;
		this.monitorExpanded.set(true);
		this._monitorOpenTimer = window.setTimeout(() => {
			this._monitorOpenTimer = undefined;
			this._monitorOpening = false;
			if (!this._monitorHovered) this.leaveMonitor();
		}, 720);
	}

	leaveMonitor(): void {
		if (!isPlatformBrowser(this._platformId)) return;
		this._monitorHovered = false;
		if (this._monitorOpening || this.earthDepth() !== 'behind') return;
		this._queueMonitorClose();
	}

	protected readonly _onDocumentDown = (event: PointerEvent): void => {
		const target = event.target as Element | null;
		if (!target) return;
		if (target.closest('app-hero-monitor')) return;
		if (this.earthBlocksMonitor()) this._resetEarthPreset();
		this._earth.returnBehind(target);
	};

	/**
	 * Motion-control button: randomise the spin direction and bring the orb
	 * forward. The orb stays forward until the user dismisses it via a
	 * pointerdown outside the host.
	 */
	showEarthInFront(event: MouseEvent): void {
		event.stopPropagation();
		this._collapseMonitorForEarth();
		this._earth.showInFront();
	}

	/**
	 * Click on the orb itself — same effect as the motion control: bring it
	 * forward and the underlying EarthGlobeComponent will pick up the spin
	 * the moment its depth reaches 'front'.
	 */
	handleOrbClick(event: MouseEvent): void {
		event.stopPropagation();
		if (
			this._earth.state() === 'behind' ||
			this._earth.state() === 'behind-ready'
		) {
			this._collapseMonitorForEarth();
			this._earth.showInFront();
		}
	}

	enterOrb(): void {
		this.earthPreview.set(true);
	}

	leaveOrb(): void {
		this.earthPreview.set(false);
	}

	guardMonitorBanner(event: MouseEvent): void {
		if (!this.earthBlocksMonitor()) return;
		event.preventDefault();
		event.stopPropagation();
	}

	dismissEarth(event: MouseEvent): void {
		event.stopPropagation();
		this._resetEarthPreset();
		this._earth.returnBehind(event.currentTarget);
	}

	/**
	 * Click on the monitor shell (chromium or dashboard area) outside the
	 * globe and the motion button triggers a return.
	 */
	handleShellInteraction(event: MouseEvent): void {
		const target = event.target as Element | null;
		if (!target) return;
		if (target.closest('.hero-monitor__orb--one')) return;
		if (target.closest('.hero-monitor__motion-control')) return;
		if (target.closest('button')) return;
		if (target.closest('a')) return;
		if (target.closest('input, textarea, select')) return;
		this._earth.returnBehind(target);
	}

	showPreview(preview: IMonitorPreview | null): void {
		if (preview) {
			this.activePreview.set(preview);
			this.enterMonitor();
			return;
		}
		this.leaveMonitor();
	}

	showDashboard(): void {
		this.activePreview.set(null);
		this.hero.clearPanel();
		this.enterMonitor();
	}

	showLinkPreview(link: IPublicLink): void {
		this.showPreview({
			kind: link.group,
			label: link.label,
			detail: link.detail ?? this._translate.instant(
				link.group === 'project'
					? 'pages.home.monitorExternalProjectDetail'
					: 'pages.home.monitorPlatformDetail',
				{ label: link.label }
			),
			href: link.href,
			status: link.group === 'platform' ? 'Public platform' : 'Featured project',
			stack: link.group === 'platform'
				? [this._translate.instant('pages.home.monitorPublicProfile')]
				: [this._translate.instant('pages.home.monitorOpenSource')],
			imageSrc: link.imageSrc,
			iconPath: link.iconPath,
			color: link.color,
			destinations: link.destinations,
		});
	}

	selectSection(section: 'projects' | 'technologies'): void {
		this.activeSection.set(section);
	}

	previewTechnology(technology: ITechnology, event?: Event): void {
		event?.preventDefault();
		this.showPreview({
			kind: 'technology',
			label: technology.label,
			detail: this.technologyDetail(technology.label),
			status: this._translate.instant('pages.home.monitorTechnologyStatus'),
			stack: [technology.label],
			iconPath: technology.iconPath,
			color: technology.color,
			destinations: technology.destinations,
		});
	}

	previewProject(panelId: IHeroPanelId): void {
		const panel = this.panels.find(({ id }) => id === panelId);
		if (!panel) return;
		this.showPreview({
			kind: 'project',
			label: panel.label,
			detail: this.projectDetail(panel.id),
			href: panel.href,
			status: this.projectStatus(panel.id),
			stack: panel.stack,
			imageSrc: panel.iconAsset,
			color: panel.color,
			destinations: panel.destinations,
		});
	}

	selectChart(type: IChartType): void {
		if (type === this.chartType()) {
			this.hero.randomizeChart();
			return;
		}
		if (this._chartTransitionTimer !== undefined)
			window.clearTimeout(this._chartTransitionTimer);
		this.chartChanging.set(true);
		this._chartTransitionTimer = window.setTimeout(() => {
			this.hero.setChart(type);
			this.chartChanging.set(false);
			this._chartTransitionTimer = undefined;
		}, 120);
	}

	async toggleMonitorFullscreen(event: MouseEvent): Promise<void> {
		event.stopPropagation();
		if (!isPlatformBrowser(this._platformId)) return;
		const monitor = (event.currentTarget as Element | null)?.closest<HTMLElement>('.hero-monitor');
		try {
			if (document.fullscreenElement) await document.exitFullscreen();
			else if (monitor?.requestFullscreen) await monitor.requestFullscreen();
			else this.monitorFullscreen.update((expanded) => !expanded);
		} catch {
			this.monitorFullscreen.update((expanded) => !expanded);
		}
	}

	protected readonly _onFullscreenChange = (): void => {
		if (isPlatformBrowser(this._platformId))
			this.monitorFullscreen.set(Boolean(document.fullscreenElement));
	};

	/**
	 * Update the active panel and sync the preview state.
	 * @param panelId The ID of the panel to activate.
	 */
	activatePanel(panelId: IHeroPanelId): void {
		this.hero.selectPanel(panelId);
		const panel = this.panels.find(({ id }) => id === panelId);
		if (!panel) return;
		this.showPreview({
			kind: 'project',
			label: panel.label,
			detail: this._translate.instant(this._projectDetailKey(panel.id)),
			href: panel.href,
			status: this.projectStatus(panel.id),
			stack: panel.stack,
			imageSrc: panel.iconAsset,
			color: panel.color,
			destinations: panel.destinations,
		});
	}

	private _projectDetailKey(id: IHeroPanelId): string {
		return `content.projects.${id}.detail`;
	}

	projectDetail(id: IHeroPanelId): string {
		return this._translate.instant(this._projectDetailKey(id));
	}

	projectStatus(id: IHeroPanelId): string {
		return this._translate.instant(`content.projects.${id}.status`);
	}

	technologyDetail(label: string): string {
		return this._translate.instantOr(
			`content.technologies.${contentKey(label)}`,
			this._translate.instant('pages.home.monitorTechnologyDetail', { label }),
		);
	}

	termLabel(value: string): string {
		return this._translate.instantOr(`content.terms.${contentKey(value)}`, value);
	}

	previewKindLabel(kind: IMonitorPreview['kind']): string {
		const key = kind === 'project'
			? 'pages.home.monitorProjects'
			: kind === 'technology'
				? 'pages.home.monitorTechnologies'
				: 'pages.home.monitorPlatforms';
		return this._translate.instant(key);
	}

	chartLabel(type: IChartType): string {
		return catalogChartLabel(this.locale(), type);
	}

	earthCategoryLabel(category: IEarthTextureCategory): string {
		return catalogEarthCategoryLabel(this.locale(), category);
	}

	earthTextureLabel(style: IEarthTextureStyle): string {
		return catalogEarthTextureLabel(this.locale(), style);
	}

	earthTextureOriginLabel(style: IEarthTextureStyle): string {
		return catalogEarthTextureOriginLabel(this.locale(), style);
	}

	closeSphereLabel(): string {
		return catalogCloseSphereLabel(this.locale());
	}

	destinationKindLabel(kind: IMonitorDestinationKind): string {
		const key: Record<IMonitorDestinationKind, string> = {
			website: 'pages.home.monitorWebsite',
			repository: 'pages.home.monitorRepository',
			documentation: 'pages.home.monitorDocumentation',
			package: 'pages.home.monitorPackage',
			release: 'pages.home.monitorRelease',
			profile: 'pages.home.monitorPublicProfile',
		};
		return this._translate.instant(key[kind]);
	}

	destinationDisplayLabel(destination: IMonitorDestination): string {
		if (destination.kind !== 'documentation') return destination.label;
		const url = new URL(destination.href);
		const path = decodeURIComponent(url.pathname).replace(/\/$/, '');
		return path ? `${url.hostname}${path}` : url.hostname;
	}

	destinationLocationLabel(destination: IMonitorDestination): string {
		const host = new URL(destination.href).hostname.replace(/^www\./, '');
		return `${this.destinationKindLabel(destination.kind)} · ${host}`;
	}

	destinationIconPath(kind: IMonitorDestinationKind): string {
		return DESTINATION_ICON_PATHS[kind];
	}

	technologyHref(label: string): string | undefined {
		return primaryTechnologyDestination(label)?.href;
	}

	selectEarthTexture(style: IEarthTextureStyle, event?: Event): void {
		event?.stopPropagation();
		this.earthTexture.set(style);
		const option = this.earthTextureOptions.find(({ id }) => id === style);
		if (option) this.earthTextureCategory.set(option.category);
	}

	selectEarthTextureCategory(
		category: IEarthTextureCategory,
		event?: Event
	): void {
		event?.stopPropagation();
		this.earthTextureCategory.set(category);
	}

	triggerConsoleEffect(id: string): void {
		if (id === 'palette') {
			this.hero.setPalette(
				this.palette() === 'ocean'
					? 'heat'
					: this.palette() === 'heat'
						? 'lime'
						: 'ocean'
			);
			return;
		}
		if (this._consoleEffectFrame !== undefined)
			cancelAnimationFrame(this._consoleEffectFrame);
		if (this._consoleEffectTimer !== undefined)
			window.clearTimeout(this._consoleEffectTimer);
		this.consoleEffect.set('none');
		this._consoleEffectFrame = requestAnimationFrame(() => {
			this._consoleEffectFrame = undefined;
			this.consoleEffect.set(id);
			this._consoleEffectTimer = window.setTimeout(() => {
				this.consoleEffect.set('none');
				this._consoleEffectTimer = undefined;
			}, 1_150);
		});
	}

	private _queueMonitorClose(): void {
		if (this._monitorCloseTimer !== undefined)
			window.clearTimeout(this._monitorCloseTimer);
		this._monitorCloseTimer = window.setTimeout(() => {
			if (!this._monitorHovered && this.earthDepth() === 'behind')
				this.monitorExpanded.set(false);
			this._monitorCloseTimer = undefined;
		}, 180);
	}

	private _collapseMonitorForEarth(): void {
		this._monitorHovered = false;
		this._monitorOpening = false;
		if (this._monitorOpenTimer !== undefined) {
			window.clearTimeout(this._monitorOpenTimer);
			this._monitorOpenTimer = undefined;
		}
		if (this._monitorCloseTimer !== undefined) {
			window.clearTimeout(this._monitorCloseTimer);
			this._monitorCloseTimer = undefined;
		}
		this.monitorExpanded.set(false);
	}

	private _resetEarthPreset(): void {
		this.earthTexture.set('clouds');
		this.earthTextureCategory.set('earth');
	}
}
