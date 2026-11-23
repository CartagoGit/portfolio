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
	IEarthTextureCategory,
	IEarthTextureOption,
	IEarthTextureOrigin,
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

const CHART_TYPES: readonly IChartType[] = [
	'bars',
	'line',
	'area',
	'dots',
	'pulse',
	'wave',
	'grid',
	'stacked',
	'scatter',
	'radar',
	'donut',
	'heatmap',
	'treemap',
	'stream',
];

const CHART_ICON_PATHS: Readonly<Record<IChartType, string>> = {
	bars: 'M4 20V12h3v8H4Zm6 0V5h3v15h-3Zm6 0V9h4v11h-4Z',
	line: 'M3 18 8 11l4 3 5-9 4 4',
	area: 'M3 19V16l5-6 4 3 5-8 4 4v10H3Z',
	dots: 'M5 16a1 1 0 1 0 .01 0M10 9a1 1 0 1 0 .01 0M15 13a1 1 0 1 0 .01 0M20 6a1 1 0 1 0 .01 0',
	pulse: 'M2 13h4l2-7 4 13 3-10 2 4h5',
	wave: 'M2 14c3-9 5 9 8 0s5 9 8 0 4-5 4-5',
	grid: 'M4 4h16v16H4V4Zm0 5h16M4 15h16M9 4v16m6-16v16',
	stacked: 'M4 20v-6h3v6H4Zm6 0V9h3v11h-3Zm6 0V5h4v15h-4ZM4 12h3m3-5h3m3-4h4',
	scatter: 'M4 18h.01M8 7h.01M12 14h.01M16 5h.01M20 11h.01M18 18h.01',
	radar: 'M12 3 20 9l-3 10H7L4 9l8-6Zm0 0v16M4 9l14 6M7 19l13-10',
	donut: 'M20 12a8 8 0 1 1-8-8v4a4 4 0 1 0 4 4h4Z M12 4h8v8h-4V8h-4V4Z',
	heatmap: 'M4 4h4v4H4V4Zm6 0h4v4h-4V4Zm6 0h4v4h-4V4ZM4 10h4v4H4v-4Zm6 0h4v4h-4v-4Zm6 0h4v4h-4v-4ZM4 16h4v4H4v-4Zm6 0h4v4h-4v-4Zm6 0h4v4h-4v-4Z',
	treemap: 'M4 4h9v10H4V4Zm11 0h5v6h-5V4ZM4 16h9v4H4v-4Zm11-4h5v8h-5v-8Z',
	stream: 'M2 8c4-5 7 4 11 0s7 3 9-1M2 13c4-5 7 4 11 0s7 3 9-1M2 18c4-5 7 4 11 0s7 3 9-1',
};

const CHART_LABELS: Readonly<Record<ILocale, Readonly<Record<IChartType, string>>>> = {
	en: {
		bars: 'Bars', line: 'Line', area: 'Area', dots: 'Dots', pulse: 'Pulse', wave: 'Wave',
		grid: 'Grid', stacked: 'Stacked', scatter: 'Scatter', radar: 'Radar', donut: 'Donut',
		heatmap: 'Heatmap', treemap: 'Treemap', stream: 'Stream',
	},
	es: {
		bars: 'Barras', line: 'Línea', area: 'Área', dots: 'Puntos', pulse: 'Pulso', wave: 'Onda',
		grid: 'Cuadrícula', stacked: 'Apilado', scatter: 'Dispersión', radar: 'Radar', donut: 'Rosquilla',
		heatmap: 'Mapa térmico', treemap: 'Mapa árbol', stream: 'Flujo',
	},
	fr: {
		bars: 'Barres', line: 'Ligne', area: 'Aire', dots: 'Points', pulse: 'Impulsion', wave: 'Onde',
		grid: 'Grille', stacked: 'Empilé', scatter: 'Dispersion', radar: 'Radar', donut: 'Anneau',
		heatmap: 'Carte thermique', treemap: 'Arborescence', stream: 'Flux',
	},
	de: {
		bars: 'Balken', line: 'Linie', area: 'Fläche', dots: 'Punkte', pulse: 'Impuls', wave: 'Welle',
		grid: 'Raster', stacked: 'Gestapelt', scatter: 'Streuung', radar: 'Radar', donut: 'Ring',
		heatmap: 'Wärmekarte', treemap: 'Baumkarte', stream: 'Strom',
	},
};

const CHART_OPTIONS: readonly IChartOption[] = CHART_TYPES.map((id) => ({
	id,
	label: CHART_LABELS.en[id],
	iconPath: CHART_ICON_PATHS[id],
}));

interface IEarthLocalLabels {
	categories: Readonly<Record<IEarthTextureCategory, string>>;
	presets: Readonly<Record<IEarthTextureStyle, string>>;
	origins: Readonly<Record<IEarthTextureOrigin, string>>;
	closeSphere: string;
}

const EARTH_TEXTURE_LABELS: Readonly<Record<ILocale, IEarthLocalLabels>> = {
	en: {
		categories: { earth: 'Earth', planets: 'Planets', exoplanets: 'Exoplanets', balls: 'Balls', playful: 'Brand & faces' },
		presets: {
			clouds: 'Real clouds', natural: 'Cloudless natural', night: 'City lights', terrain: 'Relief', infrared: 'Infrared', sun: 'Sun',
			moon: 'Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto',
			'kepler-186f': 'Kepler-186f · artist impression', 'proxima-b': 'Proxima b · artist impression', 'trappist-1e': 'TRAPPIST-1e · artist impression',
			soccer: 'Football', basketball: 'Basketball', tennis: 'Tennis', golf: 'Golf', 'beach-ball': 'Beach ball', disco: 'Disco ball',
			'cartago-mark': 'Cartago mark', 'cartago-banner': 'Cartago banner', portrait: 'Cartago portrait',
		},
		origins: { observed: 'Observed/derived source map', artist: 'Artist impression — not an observation', canonical: 'Original canonical pattern', owned: 'Owned Cartago content' },
		closeSphere: 'Close sphere',
	},
	es: {
		categories: { earth: 'Tierra', planets: 'Planetas', exoplanets: 'Exoplanetas', balls: 'Pelotas', playful: 'Marca y caras' },
		presets: {
			clouds: 'Nubes reales', natural: 'Natural sin nubes', night: 'Luces nocturnas', terrain: 'Relieve', infrared: 'Infrarrojo', sun: 'Sol',
			moon: 'Luna', mercury: 'Mercurio', venus: 'Venus', mars: 'Marte', jupiter: 'Júpiter', saturn: 'Saturno', uranus: 'Urano', neptune: 'Neptuno', pluto: 'Plutón',
			'kepler-186f': 'Kepler-186f · impresión artística', 'proxima-b': 'Próxima b · impresión artística', 'trappist-1e': 'TRAPPIST-1e · impresión artística',
			soccer: 'Fútbol', basketball: 'Baloncesto', tennis: 'Tenis', golf: 'Golf', 'beach-ball': 'Pelota de playa', disco: 'Bola de discoteca',
			'cartago-mark': 'Logotipo Cartago', 'cartago-banner': 'Banner Cartago', portrait: 'Retrato Cartago',
		},
		origins: { observed: 'Mapa observado o derivado de datos', artist: 'Impresión artística — no es una observación', canonical: 'Patrón canónico original', owned: 'Contenido propio de Cartago' },
		closeSphere: 'Cerrar esfera',
	},
	fr: {
		categories: { earth: 'Terre', planets: 'Planètes', exoplanets: 'Exoplanètes', balls: 'Ballons', playful: 'Marque et visages' },
		presets: {
			clouds: 'Nuages réels', natural: 'Naturel sans nuages', night: 'Lumières nocturnes', terrain: 'Relief', infrared: 'Infrarouge', sun: 'Soleil',
			moon: 'Lune', mercury: 'Mercure', venus: 'Vénus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturne', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluton',
			'kepler-186f': 'Kepler-186f · illustration', 'proxima-b': 'Proxima b · illustration', 'trappist-1e': 'TRAPPIST-1e · illustration',
			soccer: 'Football', basketball: 'Basket-ball', tennis: 'Tennis', golf: 'Golf', 'beach-ball': 'Ballon de plage', disco: 'Boule disco',
			'cartago-mark': 'Marque Cartago', 'cartago-banner': 'Bannière Cartago', portrait: 'Portrait Cartago',
		},
		origins: { observed: 'Carte observée ou dérivée de données', artist: 'Illustration — pas une observation', canonical: 'Motif canonique original', owned: 'Contenu Cartago original' },
		closeSphere: 'Fermer la sphère',
	},
	de: {
		categories: { earth: 'Erde', planets: 'Planeten', exoplanets: 'Exoplaneten', balls: 'Bälle', playful: 'Marke und Gesichter' },
		presets: {
			clouds: 'Echte Wolken', natural: 'Natürlich ohne Wolken', night: 'Nachtlichter', terrain: 'Relief', infrared: 'Infrarot', sun: 'Sonne',
			moon: 'Mond', mercury: 'Merkur', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptun', pluto: 'Pluto',
			'kepler-186f': 'Kepler-186f · Künstlerdarstellung', 'proxima-b': 'Proxima b · Künstlerdarstellung', 'trappist-1e': 'TRAPPIST-1e · Künstlerdarstellung',
			soccer: 'Fußball', basketball: 'Basketball', tennis: 'Tennis', golf: 'Golf', 'beach-ball': 'Wasserball', disco: 'Discokugel',
			'cartago-mark': 'Cartago-Marke', 'cartago-banner': 'Cartago-Banner', portrait: 'Cartago-Porträt',
		},
		origins: { observed: 'Beobachtete oder abgeleitete Karte', artist: 'Künstlerdarstellung — keine Beobachtung', canonical: 'Originales kanonisches Muster', owned: 'Eigene Cartago-Inhalte' },
		closeSphere: 'Kugel schließen',
	},
};

const EARTH_TEXTURE_CATEGORIES: readonly IEarthTextureCategory[] = [
	'earth', 'planets', 'exoplanets', 'balls', 'playful',
];

const EARTH_TEXTURE_OPTIONS = [
	{ id: 'clouds', category: 'earth', origin: 'observed' },
	{ id: 'natural', category: 'earth', origin: 'observed' },
	{ id: 'night', category: 'earth', origin: 'observed' },
	{ id: 'terrain', category: 'earth', origin: 'observed' },
	{ id: 'infrared', category: 'earth', origin: 'observed' },
	{ id: 'sun', category: 'planets', origin: 'observed' },
	{ id: 'moon', category: 'planets', origin: 'observed' },
	{ id: 'mercury', category: 'planets', origin: 'observed' },
	{ id: 'venus', category: 'planets', origin: 'observed' },
	{ id: 'mars', category: 'planets', origin: 'observed' },
	{ id: 'jupiter', category: 'planets', origin: 'observed' },
	{ id: 'saturn', category: 'planets', origin: 'observed' },
	{ id: 'uranus', category: 'planets', origin: 'observed' },
	{ id: 'neptune', category: 'planets', origin: 'observed' },
	{ id: 'pluto', category: 'planets', origin: 'observed' },
	{ id: 'kepler-186f', category: 'exoplanets', origin: 'artist' },
	{ id: 'proxima-b', category: 'exoplanets', origin: 'artist' },
	{ id: 'trappist-1e', category: 'exoplanets', origin: 'artist' },
	{ id: 'soccer', category: 'balls', origin: 'canonical' },
	{ id: 'basketball', category: 'balls', origin: 'canonical' },
	{ id: 'tennis', category: 'balls', origin: 'canonical' },
	{ id: 'golf', category: 'balls', origin: 'canonical' },
	{ id: 'beach-ball', category: 'balls', origin: 'canonical' },
	{ id: 'disco', category: 'balls', origin: 'canonical' },
	{ id: 'cartago-mark', category: 'playful', origin: 'owned' },
	{ id: 'cartago-banner', category: 'playful', origin: 'owned' },
	{ id: 'portrait', category: 'playful', origin: 'owned' },
] as const satisfies readonly IEarthTextureOption[];

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
		'[class.hero-monitor-host--earth-front]': 'earthBlocksMonitor()',
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
	readonly earthControlsVisible = computed(() => {
		const depth = this.earthDepth();
		return depth === 'front-ready' || depth === 'front' || depth === 'out-front';
	});
	readonly monitorExpanded = signal(false);
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
		return CHART_LABELS[this.locale()][type];
	}

	earthCategoryLabel(category: IEarthTextureCategory): string {
		return EARTH_TEXTURE_LABELS[this.locale()].categories[category];
	}

	earthTextureLabel(style: IEarthTextureStyle): string {
		return EARTH_TEXTURE_LABELS[this.locale()].presets[style];
	}

	earthTextureOriginLabel(style: IEarthTextureStyle): string {
		const origin = this.earthTextureOptions.find(({ id }) => id === style)?.origin;
		return origin ? EARTH_TEXTURE_LABELS[this.locale()].origins[origin] : '';
	}

	closeSphereLabel(): string {
		return EARTH_TEXTURE_LABELS[this.locale()].closeSphere;
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
		const option = this.earthTextureOptions.find(({ id }) => id === style);
		if (option) this.earthTextureCategory.set(option.category);
	}

	selectEarthTextureCategory(
		category: IEarthTextureCategory,
		event: Event
	): void {
		event.stopPropagation();
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
}
