import {
	ChangeDetectionStrategy,
	Component,
	type OnDestroy,
	ViewEncapsulation,
} from '@angular/core';
import { EarthGlobeComponent } from '../earth-globe/earth-globe.component';
import { EarthDepthFacade } from '../earth-globe/earth-depth.facade';
import { HeroMonitorFacade } from './hero-monitor.facade';
import type {
	IChartType,
	IHeroEffect,
	IHeroPanelId,
} from '../../../domain/portfolio.types';

@Component({
	selector: 'app-hero-monitor',
	imports: [EarthGlobeComponent],
	templateUrl: './hero-monitor.component.html',
	styleUrl: './hero-monitor.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class HeroMonitorComponent implements OnDestroy {
	// Composition root: two facades that own the monitor's state.
	private readonly _hero = new HeroMonitorFacade();
	private readonly _earth = new EarthDepthFacade();

	// Public mirrors so the template can render the signals without exposing
	// the private facades. The re-exported `Signal<T>` keeps the original
	// reference equality, so changes propagate without manual syncing.
	readonly earth = this._earth;
	readonly activePanel = this._hero.activePanel;
	readonly chartType = this._hero.chartType;
	readonly effect = this._hero.effect;
	readonly panelTransition = this._hero.panelTransition;
	readonly panelChanging = this._hero.panelChanging;
	readonly palette = this._hero.palette;
	readonly chartBars = this._hero.chartBars;
	readonly chartPath = this._hero.chartPath;
	readonly selectedPanel = this._hero.selectedPanel;
	readonly panels = this._hero.panels;
	readonly earthDepth = this._earth.state;
	readonly earthBlocksMonitor = this._earth.blocksMonitor;

	readonly chartOptions: ReadonlyArray<{ id: IChartType; label: string }> = [
		{ id: 'bars', label: 'Velocity' },
		{ id: 'line', label: 'Signals' },
		{ id: 'area', label: 'Coverage' },
		{ id: 'dots', label: 'Dots' },
		{ id: 'pulse', label: 'Pulse' },
		{ id: 'wave', label: 'Wave' },
		{ id: 'grid', label: 'Grid' },
	];

	readonly effectOptions: ReadonlyArray<{
		id: Exclude<IHeroEffect, 'idle'>;
		symbol: string;
	}> = [
		{ id: 'shake', symbol: '≈' },
		{ id: 'glitch', symbol: '⌘' },
		{ id: 'float', symbol: '↟' },
		{ id: 'spectrum', symbol: '◈' },
	];

	ngOnDestroy(): void {
		this._hero.destroy();
	}

	selectPanel(panel: IHeroPanelId): void {
		this._hero.selectPanel(panel);
	}

	clearPanel(): void {
		this._hero.clearPanel();
	}

	setChart(type: IChartType): void {
		this._hero.setChart(type);
	}

	randomizeChart(): void {
		this._hero.randomizeChart();
	}

	setEffect(effect: Exclude<IHeroEffect, 'idle'>): void {
		this._hero.setEffect(effect);
	}

	setTemperature(): void {
		this._hero.setTemperature();
	}

	gradient(value: number): string {
		return this._hero.gradient(value);
	}

	showEarthInFront(event: MouseEvent): void {
		event.stopPropagation();
		this._earth.showInFront();
	}

	guardMonitorBanner(event: MouseEvent): void {
		if (!this.earthBlocksMonitor()) return;
		event.preventDefault();
		event.stopPropagation();
	}

	returnEarthBehind(event?: MouseEvent): void {
		if (this._isEarthTarget(event?.relatedTarget)) return;
		this._earth.returnBehind(event?.target);
	}

	private _isEarthTarget(target: EventTarget | null | undefined): boolean {
		return target instanceof Element && target.closest('.orb-one') !== null;
	}
}
