import { computed, signal } from '@angular/core';
import { nextHeroPanelTransition } from '../../../core/motion/portfolio-motion';
import { HERO_PANELS } from '../../../domain/portfolio.data';
import type {
	IChartType,
	IHeroEffect,
	IHeroPalette,
	IHeroPanelId,
	IHeroPanelTransition,
} from '../../../domain/portfolio.types';

export class HeroMonitorFacade {
	readonly panels = HERO_PANELS;
	readonly activePanel = signal<IHeroPanelId | null>(null);
	readonly chartType = signal<IChartType>('bars');
	readonly effect = signal<IHeroEffect>('idle');
	readonly panelTransition = signal<IHeroPanelTransition>('slide');
	readonly panelChanging = signal(false);
	readonly palette = signal<IHeroPalette>('ocean');
	readonly chartBars = signal([42, 67, 52, 83, 71]);
	readonly selectedPanel = computed(() =>
		this.panels.find(({ id }) => id === this.activePanel())
	);
	readonly chartPath = computed(() => {
		const bars = this.chartBars();
		const points = bars.map((bar, index) => `${index * 90},${118 - bar}`);
		// `chartBars` is initialised with five entries, so indexes 0-4 are
		// always defined. The non-null assertions are guarded by that invariant.
		return `M${points[0]} C30,${118 - bars[0]!} 58,${118 - bars[1]!} ${points[1]} S148,${118 - bars[2]!} ${points[2]} S238,${118 - bars[3]!} ${points[3]} S328,${118 - bars[4]!} ${points[4]}`;
	});
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
			Array.from({ length: 5 }, (_, index) =>
				Math.round(28 + Math.random() * 62 + index * 1.5)
			)
		);
	}
	setEffect(effect: Exclude<IHeroEffect, 'idle'>): void {
		this.effect.set('idle');
		window.setTimeout(() => this.effect.set(effect), 24);
	}
	setTemperature(): void {
		this.palette.set('heat');
		this.randomizeChart();
	}
	setPalette(palette: IHeroPalette): void {
		this.palette.set(palette);
		this.randomizeChart();
	}
	gradient(value: number): string {
		if (this.palette() === 'heat') {
			if (value >= 80) return 'linear-gradient(to top, #ff4d4d, #ffcf4a)';
			if (value >= 60) return 'linear-gradient(to top, #ff9f1c, #ffe16b)';
			if (value >= 42) return 'linear-gradient(to top, #24b6ff, #74e5ff)';
			return 'linear-gradient(to top, #2856a6, #48b8ff)';
		}
		if (this.palette() === 'lime')
			return 'linear-gradient(to top, #256c5d, #d8ff78)';
		return 'linear-gradient(to top, #1678ff, #32c8ff)';
	}
	destroy(): void {
		if (this._panelTimer !== undefined)
			window.clearTimeout(this._panelTimer);
	}
}
