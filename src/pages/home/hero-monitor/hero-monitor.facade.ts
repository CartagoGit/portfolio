import { computed, signal } from '@angular/core';
import { HERO_PANELS } from '../../../domain/data';
import type {
	IChartType,
	IHeroEffect,
	IHeroPalette,
	IHeroPanelId,
	IHeroPanelTransition,
} from '../../../domain/types';

const HERO_PANEL_TRANSITIONS: readonly IHeroPanelTransition[] = [
	'slide',
	'flip',
	'scan',
];

/**
 * Picks a different `IHeroPanelTransition` than the one currently on
 * the panel. The hero panel cycle has three transitions, so any
 * choice returns one of the other two; `random` is injectable so
 * the helper can be unit-tested deterministically.
 */
function nextHeroPanelTransition(
	current: IHeroPanelTransition,
	random: () => number = Math.random
): IHeroPanelTransition {
	const candidates = HERO_PANEL_TRANSITIONS.filter(
		(transition) => transition !== current
	);
	// `candidates` is always non-empty: we filter out only the single
	// `current` entry, and HERO_PANEL_TRANSITIONS has three members.
	// The non-null assertion on `first` documents this invariant.
	const [first] = candidates;
	if (first === undefined) {
		throw new Error(
			'nextHeroPanelTransition: HERO_PANEL_TRANSITIONS invariant broken'
		);
	}
	const index = Math.floor(random() * candidates.length);
	return candidates[index] ?? first;
}

const CHART_VIEWBOX_HEIGHT = 118;
const CHART_X_STEP = 90;
const CHART_BAR_COUNT = 5;
const CHART_BAR_MIN = 28;
const CHART_BAR_RANGE = 62;
const CHART_BAR_BONUS_PER_INDEX = 1.5;
const DEFAULT_CHART_BARS: readonly number[] = [42, 67, 52, 83, 71];

/** Heat palette: each entry pairs a CSS-pixel breakpoint with the gradient
 * applied to bars at or above it. Lower breakpoints fall through to the
 * catch-all at the bottom of the heat branch. */
const HEAT_PALETTE_GRADIENTS: ReadonlyArray<readonly [number, string]> = [
	[80, 'linear-gradient(to top, #ff4d4d, #ffcf4a)'],
	[60, 'linear-gradient(to top, #ff9f1c, #ffe16b)'],
	[42, 'linear-gradient(to top, #24b6ff, #74e5ff)'],
];
const HEAT_PALETTE_FALLBACK = 'linear-gradient(to top, #2856a6, #48b8ff)';

const PALETTE_GRADIENTS: Readonly<Record<IHeroPalette, string>> = {
	ocean: 'linear-gradient(to top, #1678ff, #32c8ff)',
	heat: HEAT_PALETTE_FALLBACK,
	lime: 'linear-gradient(to top, #256c5d, #d8ff78)',
};

function gradientForHeat(value: number): string {
	for (const [breakpoint, gradient] of HEAT_PALETTE_GRADIENTS) {
		if (value >= breakpoint) return gradient;
	}
	return HEAT_PALETTE_FALLBACK;
}

/**
 * Builds the SVG path for the hero monitoring chart. The curve is
 * composed of one M-anchor plus four cubic-bezier smooth joins; the
 * control points are placed in CSS-pixel coordinates mirrored
 * around the segment midpoint. The chart always renders exactly
 * five bars — any missing value falls back to the mid-canvas
 * baseline so the path still closes.
 */
export function buildChartPath(bars: readonly number[]): string {
	const point = (index: number): string =>
		`${index * CHART_X_STEP},${CHART_VIEWBOX_HEIGHT - (bars[index] ?? 0)}`;
	const value = (index: number): number =>
		CHART_VIEWBOX_HEIGHT - (bars[index] ?? 0);
	return [
		`M${point(0)}`,
		`C30,${value(0)} 58,${value(1)} ${point(1)}`,
		`S148,${value(2)} ${point(2)}`,
		`S238,${value(3)} ${point(3)}`,
		`S328,${value(4)} ${point(4)}`,
	].join(' ');
}

export class HeroMonitorFacade {
	readonly panels = HERO_PANELS;
	readonly activePanel = signal<IHeroPanelId | null>(null);
	readonly chartType = signal<IChartType>('bars');
	readonly effect = signal<IHeroEffect>('idle');
	readonly panelTransition = signal<IHeroPanelTransition>('slide');
	readonly panelChanging = signal(false);
	readonly palette = signal<IHeroPalette>('ocean');
	readonly chartBars = signal<readonly number[]>(DEFAULT_CHART_BARS);
	readonly selectedPanel = computed(() =>
		this.panels.find(({ id }) => id === this.activePanel())
	);
	readonly chartPath = computed(() => buildChartPath(this.chartBars()));
	private _panelTimer?: number;
	selectPanel(panel: IHeroPanelId): void {
		if (this.activePanel() === panel) return;
		if (this._panelTimer !== undefined)
			window.clearTimeout(this._panelTimer);
		this.panelTransition.set(
			nextHeroPanelTransition(this.panelTransition())
		);
		this.effect.set('idle');
		this.panelChanging.set(true);
		this.activePanel.set(null);
		this._panelTimer = window.setTimeout(() => {
			this._panelTimer = undefined;
			this.activePanel.set(panel);
			requestAnimationFrame(() => this.panelChanging.set(false));
		}, 24);
	}
	clearPanel(): void {
		if (this._panelTimer !== undefined)
			window.clearTimeout(this._panelTimer);
		this._panelTimer = undefined;
		this.panelChanging.set(false);
		this.activePanel.set(null);
		this.effect.set('idle');
	}
	setChart(type: IChartType): void {
		this.chartType.set(type);
		this.randomizeChart();
	}
	randomizeChart(): void {
		this.chartBars.set(
			Array.from({ length: CHART_BAR_COUNT }, (_, index) =>
				Math.round(
					CHART_BAR_MIN +
						Math.random() * CHART_BAR_RANGE +
						index * CHART_BAR_BONUS_PER_INDEX
				)
			)
		);
	}
	setEffect(effect: Exclude<IHeroEffect, 'idle'>): void {
		this.effect.set('idle');
		window.setTimeout(() => this.effect.set(effect), 24);
	}
	setTemperature(): void {
		this.setPalette('heat');
	}
	setPalette(palette: IHeroPalette): void {
		this.palette.set(palette);
		this.randomizeChart();
	}
	gradient(value: number): string {
		return this.palette() === 'heat'
			? gradientForHeat(value)
			: PALETTE_GRADIENTS[this.palette()];
	}
	destroy(): void {
		if (this._panelTimer !== undefined)
			window.clearTimeout(this._panelTimer);
	}
}
