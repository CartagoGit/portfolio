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
import { siGithub, siNpm } from 'simple-icons';
import { EarthGlobeComponent } from '../earth-globe/earth-globe.component';
import { EarthDepthFacade } from '../earth-globe/earth-depth.facade';
import { HeroMonitorFacade } from './hero-monitor.facade';
import { PUBLIC_LINKS } from '../../../domain/data';
import {
	monitorDestinations,
	primaryTechnologyDestination,
} from '../../../domain/monitor-destinations';
import { TranslatePipe } from '../../../lang/translate.pipe';
import { TranslateService } from '../../../lang/translate.service';
import type {
	IChartOption,
	IChartType,
	IEarthTextureStyle,
	IEffectOption,
	IHeroPanelId,
	ILocale,
	IMonitorDestination,
	IMonitorDestinationKind,
	IMonitorPreview,
	IPublicLink,
	ITechnology,
} from '../../../domain/types';

const DESTINATION_ICON_PATHS: Readonly<Record<IMonitorDestinationKind, string>> = {
	website: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.93 6h-3.17a15.6 15.6 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.93 8ZM12 4c.83 1.17 1.51 2.51 1.98 4h-3.96C10.49 6.51 11.17 5.17 12 4ZM9.62 4.44A15.6 15.6 0 0 0 8.24 8H5.07a8.03 8.03 0 0 1 4.55-3.56ZM4.26 10h3.39a17.1 17.1 0 0 0 0 4H4.26a8.08 8.08 0 0 1 0-4Zm.81 6h3.17a15.6 15.6 0 0 0 1.38 3.56A8.03 8.03 0 0 1 5.07 16ZM12 20c-.83-1.17-1.51-2.51-1.98-4h3.96C13.51 17.49 12.83 18.83 12 20Zm2.38-.44A15.6 15.6 0 0 0 15.76 16h3.17a8.03 8.03 0 0 1-4.55 3.56ZM16.35 14a17.1 17.1 0 0 0 0-4h3.39a8.08 8.08 0 0 1 0 4h-3.39Z',
	repository: siGithub.path,
	documentation: 'M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6v-2H5v-1.3c.3-.2.7-.3 1.2-.3H11v-2H6.2a4 4 0 0 0-1.2.2V5.5c0-.3.2-.5.5-.5h5.5v14h2V5h6c.3 0 .5.2.5.5v7h2v-7a2 2 0 0 0-2-2h-6a2.5 2.5 0 0 0-2 1A2.5 2.5 0 0 0 9.5 3H5Zm9 12-2 2 2 2 5-5-2-2-3 3Z',
	package: siNpm.path,
	release: 'M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3L17.7 7 12 9.7 6.3 7 12 4.3ZM5 8.7l6 3.3v7.2l-6-3.3V8.7Zm8 10.5V12l6-3.3v7.2l-6 3.3Z',
	profile: 'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5 0-9 2.7-9 6v2h18v-2c0-3.3-4-6-9-6Z',
};

/**
 * Interactive hero composition: live monitor with technology rail + sphere.
 */
@Component({
	selector: 'app-hero-monitor',
	imports: [EarthGlobeComponent, TranslatePipe],
	templateUrl: './hero-monitor.component.html',
	styleUrl: './hero-monitor.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		'(document:pointerdown)': '_onDocumentDown($event)',
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
					? this._translate.instant('pages.home.monitorTechnologyDetail', { label: active.label })
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
	readonly monitorExpanded = signal(false);
	readonly earthPreview = signal(false);
	readonly earthTexture = signal<IEarthTextureStyle>('natural');
	readonly earthTextureOptions = [
		{ id: 'natural', labelKey: 'pages.home.earthTextureNatural' },
		{ id: 'terrain', labelKey: 'pages.home.earthTextureTerrain' },
		{ id: 'infrared', labelKey: 'pages.home.earthTextureInfrared' },
	] as const;
	private _monitorHovered = false;
	private _monitorOpening = false;
	private _monitorOpenTimer?: number;
	private _monitorCloseTimer?: number;
	private readonly _earthReturnSync = effect(() => {
		if (
			this.earthDepth() === 'behind' &&
			this.monitorExpanded() &&
			!this._monitorHovered
		)
			this._queueMonitorClose();
	});

	readonly chartOptions: readonly IChartOption[] = [
		{ id: 'bars', label: 'Bars' },
		{ id: 'line', label: 'Line' },
		{ id: 'area', label: 'Area' },
		{ id: 'dots', label: 'Dots' },
		{ id: 'pulse', label: 'Pulse' },
		{ id: 'wave', label: 'Wave' },
		{ id: 'grid', label: 'Grid' },
	];

	readonly effectOptions: readonly IEffectOption[] = [
		{ id: 'shake', symbol: '≈' },
		{ id: 'glitch', symbol: '⌘' },
		{ id: 'float', symbol: '↟' },
		{ id: 'spectrum', symbol: '◈' },
	];

	readonly platformLinks = PUBLIC_LINKS.filter((link) => link.group === 'platform');
	readonly consoleEffects = [
		{ id: 'palette', symbol: '◉', labelKey: 'pages.home.monitorEffectPalette' },
		{ id: 'shake', symbol: '≈', labelKey: 'pages.home.monitorEffectShake' },
		{ id: 'glitch', symbol: '⌘', labelKey: 'pages.home.monitorEffectGlitch' },
		{ id: 'float', symbol: '↟', labelKey: 'pages.home.monitorEffectFloat' },
		{ id: 'blur', symbol: '◌', labelKey: 'pages.home.monitorEffectBlur' },
		{ id: 'pulse', symbol: '✦', labelKey: 'pages.home.monitorEffectPulse' },
		{ id: 'spectrum', symbol: '◈', labelKey: 'pages.home.monitorEffectSpectrum' },
	] as const;
	readonly consoleEffect = signal('none');

	ngOnDestroy(): void {
		this.hero.destroy();
		this._earth.destroy();
		if (this._monitorOpenTimer !== undefined)
			window.clearTimeout(this._monitorOpenTimer);
		if (this._monitorCloseTimer !== undefined)
			window.clearTimeout(this._monitorCloseTimer);
		this._previewSync.destroy();
		this._earthReturnSync.destroy();
	}

	enterMonitor(): void {
		if (!isPlatformBrowser(this._platformId)) return;
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
		this._earth.returnBehind(target);
	};

	/**
	 * Motion-control button: randomise the spin direction and bring the orb
	 * forward. The orb stays forward until the user dismisses it via a
	 * pointerdown outside the host.
	 */
	showEarthInFront(event: MouseEvent): void {
		event.stopPropagation();
		this.enterMonitor();
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
		this.activePreview.set(null);
		if (section === 'technologies') this.hero.clearPanel();
	}

	previewTechnology(technology: ITechnology, event?: Event): void {
		event?.preventDefault();
		this.showPreview({
			kind: 'technology',
			label: technology.label,
			detail: technology.detail ?? '',
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
			detail: this._translate.instant(this._projectDetailKey(panel.id)),
			href: panel.href,
			status: this._translate.instant('pages.home.monitorProjectStatus'),
			stack: panel.stack,
			imageSrc: panel.iconAsset,
			color: panel.color,
			destinations: panel.destinations,
		});
	}

	private _projectDetailKey(id: IHeroPanelId): string {
		const keys: Record<IHeroPanelId, string> = {
			overview: 'pages.home.panelOverviewDetail',
			workflows: 'pages.home.panelWorkflowsDetail',
			quality: 'pages.home.panelQualityDetail',
			mobile: 'pages.home.panelMobileDetail',
			tooling: 'pages.home.panelToolingDetail',
			delivery: 'pages.home.panelDeliveryDetail',
		};
		return keys[id];
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
		const key: Record<IChartType, string> = {
			bars: 'pages.home.monitorChartBars',
			line: 'pages.home.monitorChartLine',
			area: 'pages.home.monitorChartArea',
			dots: 'pages.home.monitorChartDots',
			pulse: 'pages.home.monitorChartPulse',
			wave: 'pages.home.monitorChartWave',
			grid: 'pages.home.monitorChartGrid',
		};
		return this._translate.instant(key[type]);
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

	destinationIconPath(kind: IMonitorDestinationKind): string {
		return DESTINATION_ICON_PATHS[kind];
	}

	technologyHref(label: string): string | undefined {
		return primaryTechnologyDestination(label)?.href;
	}

	selectEarthTexture(style: IEarthTextureStyle, event: Event): void {
		event.stopPropagation();
		this.earthTexture.set(style);
	}

	triggerConsoleEffect(id: string): void {
		if (id === 'palette') {
			this.hero.setPalette(this.palette() === 'ocean' ? 'heat' : this.palette() === 'heat' ? 'lime' : 'ocean');
			return;
		}
		this.consoleEffect.set('none');
		window.setTimeout(() => this.consoleEffect.set(id), 20);
		this.consoleEffect.set(id);
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
}
