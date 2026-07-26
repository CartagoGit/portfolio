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
	protected readonly _hero = new HeroMonitorFacade();
	protected readonly _earth = new EarthDepthFacade();

	protected readonly _activePanel = this._hero.activePanel;
	protected readonly _chartType = this._hero.chartType;
	protected readonly _effect = this._hero.effect;
	protected readonly _panelTransition = this._hero.panelTransition;
	protected readonly _panelChanging = this._hero.panelChanging;
	protected readonly _palette = this._hero.palette;
	protected readonly _chartBars = this._hero.chartBars;
	protected readonly _chartPath = this._hero.chartPath;
	protected readonly _selectedPanel = this._hero.selectedPanel;
	protected readonly _panels = this._hero.panels;
	protected readonly _earthDepth = this._earth.state;
	protected readonly _earthBlocksMonitor = this._earth.blocksMonitor;
	protected readonly _chartOptions: ReadonlyArray<{
		id: IChartType;
		label: string;
	}> = [
		{ id: 'bars', label: 'Velocity' },
		{ id: 'line', label: 'Signals' },
		{ id: 'area', label: 'Coverage' },
		{ id: 'dots', label: 'Dots' },
		{ id: 'pulse', label: 'Pulse' },
		{ id: 'wave', label: 'Wave' },
		{ id: 'grid', label: 'Grid' },
	];
	protected readonly _effectOptions: ReadonlyArray<{
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

	protected _selectPanel(panel: IHeroPanelId): void {
		this._hero.selectPanel(panel);
	}

	protected _clearPanel(): void {
		this._hero.clearPanel();
	}

	protected _setChart(type: IChartType): void {
		this._hero.setChart(type);
	}

	protected _randomizeChart(): void {
		this._hero.randomizeChart();
	}

	protected _setEffect(effect: Exclude<IHeroEffect, 'idle'>): void {
		this._hero.setEffect(effect);
	}

	protected _setTemperature(): void {
		this._hero.setTemperature();
	}

	protected _gradient(value: number): string {
		return this._hero.gradient(value);
	}

	protected _showEarthInFront(event: MouseEvent): void {
		event.stopPropagation();
		this._earth.showInFront();
	}

	protected _guardMonitorBanner(event: MouseEvent): void {
		if (!this._earthBlocksMonitor()) return;
		event.preventDefault();
		event.stopPropagation();
	}

	protected _returnEarthBehind(event?: MouseEvent): void {
		if (this._isEarthTarget(event?.relatedTarget)) return;
		this._earth.returnBehind(event?.target);
	}

	private _isEarthTarget(target: EventTarget | null | undefined): boolean {
		return target instanceof Element && target.closest('.orb-one') !== null;
	}
}
