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
import { HeroMonitorFacade } from './hero-monitor.facade';
import { PUBLIC_LINKS } from '../../../domain/data';
import { TranslatePipe } from '../../../lang/translate.pipe';
import { TranslateService } from '../../../lang/translate.service';
import type {
	IChartOption,
	IEffectOption,
	IHeroPanelId,
	ILocale,
	IMonitorPreview,
	IPublicLink,
	ITechnology,
} from '../../../domain/types';

/**
 * Interactive hero composition: live monitor with technology rail + sphere.
 *
 * Globe behaviour (per latest spec):
 *  - The orb stays parked behind the monitor until the user commits. It does
 *    NOT show textures or spin until then.
 *  - The orb comes to the front only when the user clicks the orb itself or
 *    presses the motion-control button inside the monitor.
 *  - A click anywhere outside the host dismisses the orb back behind.
 *  - The depth transitions out-behind -> front-ready -> front animate the
 *    scale of the sphere so the perceived growth happens towards the centre.
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
					: this._translate.instant('pages.home.monitorPlatformDetail', { label: active.label }),
			status: active.kind === 'project'
				? this._translate.instant('pages.home.monitorProjectStatus')
				: active.kind === 'platform'
					? this._translate.instant('pages.home.monitorPlatformStatus')
					: this._translate.instant('pages.home.monitorTechnologyStatus'),
		}];
	});
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
	private _monitorHovered = false;
	private _monitorOpening = false;
	private _monitorOpenTimer?: number;
	private _monitorCloseTimer?: number;

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
		{ id: 'palette', symbol: '◉', label: 'Cycle colour' },
		{ id: 'shake', symbol: '≈', label: 'Shake' },
		{ id: 'glitch', symbol: '⌘', label: 'Glitch' },
		{ id: 'float', symbol: '↟', label: 'Float' },
		{ id: 'blur', symbol: '◌', label: 'Blur pulse' },
		{ id: 'pulse', symbol: '✦', label: 'Glow pulse' },
		{ id: 'spectrum', symbol: '◈', label: 'Spectrum' },
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
	}

	enterMonitor(): void {
		if (!isPlatformBrowser(this._platformId)) return;
		this._monitorHovered = true;
		if (this._monitorCloseTimer !== undefined)
			window.clearTimeout(this._monitorCloseTimer);
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
		if (this.activePreview()) return;
		if (this._monitorOpening) return;
		if (this._monitorCloseTimer !== undefined)
			window.clearTimeout(this._monitorCloseTimer);
		this._monitorCloseTimer = window.setTimeout(() => {
			if (!this._monitorHovered) this.monitorExpanded.set(false);
			this._monitorCloseTimer = undefined;
		}, 180);
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

	showLinkPreview(link: IPublicLink): void {
		this.showPreview({
			kind: link.group,
			label: link.label,
			detail: link.detail ?? `Open ${link.label}.`,
			href: link.href,
			status: link.group === 'platform' ? 'Public platform' : 'Featured project',
			stack: link.group === 'platform' ? ['Public profile'] : ['Open source'],
			imageSrc: link.imageSrc,
			iconPath: link.iconPath,
			color: link.color,
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
			href: this._technologyHref(technology.label),
			status: this._translate.instant('pages.home.monitorTechnologyStatus'),
			stack: [technology.label],
			iconPath: technology.iconPath,
			color: technology.color,
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

	private _technologyHref(label: string): string {
		const urls: Record<string, string> = {
			Angular: 'https://angular.dev',
			TypeScript: 'https://www.typescriptlang.org',
			RxJS: 'https://rxjs.dev',
			Ionic: 'https://ionicframework.com',
			Capacitor: 'https://capacitorjs.com',
			Sass: 'https://sass-lang.com',
			Bun: 'https://bun.sh',
			Docker: 'https://www.docker.com',
			Vitest: 'https://vitest.dev',
			Jest: 'https://jestjs.io',
			Vue: 'https://vuejs.org',
			React: 'https://react.dev',
		};
		return urls[label] ?? 'https://github.com/CartagoGit';
	}

	previewKindLabel(kind: IMonitorPreview['kind']): string {
		const key = kind === 'project'
			? 'pages.home.monitorProjects'
			: kind === 'technology'
				? 'pages.home.monitorTechnologies'
				: 'pages.home.monitorPlatforms';
		return this._translate.instant(key);
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
}
