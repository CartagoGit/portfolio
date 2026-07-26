import type { OnDestroy } from '@angular/core';
import {
	ChangeDetectionStrategy,
	Component,
	ViewEncapsulation,
} from '@angular/core';
import { EarthGlobeComponent } from '../earth-globe/earth-globe.component';
import { EarthDepthFacade } from '../earth-globe/earth-depth.facade';
import { HeroMonitorFacade } from './hero-monitor.facade';
import type {
	ChartType,
	HeroEffect,
	HeroPanelId,
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
	protected readonly hero = new HeroMonitorFacade();
	protected readonly earth = new EarthDepthFacade();

	protected readonly activePanel = this.hero.activePanel;
	protected readonly chartType = this.hero.chartType;
	protected readonly effect = this.hero.effect;
	protected readonly panelTransition = this.hero.panelTransition;
	protected readonly panelChanging = this.hero.panelChanging;
	protected readonly palette = this.hero.palette;
	protected readonly chartBars = this.hero.chartBars;
	protected readonly chartPath = this.hero.chartPath;
	protected readonly selectedPanel = this.hero.selectedPanel;
	protected readonly panels = this.hero.panels;
	protected readonly earthDepth = this.earth.state;
	protected readonly earthBlocksMonitor = this.earth.blocksMonitor;
	protected readonly chartOptions: readonly {
		id: ChartType;
		label: string;
	}[] = [
		{ id: 'bars', label: 'Velocity' },
		{ id: 'line', label: 'Signals' },
		{ id: 'area', label: 'Coverage' },
		{ id: 'dots', label: 'Dots' },
		{ id: 'pulse', label: 'Pulse' },
		{ id: 'wave', label: 'Wave' },
		{ id: 'grid', label: 'Grid' },
	];
	protected readonly effectOptions: readonly {
		id: Exclude<HeroEffect, 'idle'>;
		symbol: string;
	}[] = [
		{ id: 'shake', symbol: '≈' },
		{ id: 'glitch', symbol: '⌘' },
		{ id: 'float', symbol: '↟' },
		{ id: 'spectrum', symbol: '◈' },
	];

	ngOnDestroy(): void {
		this.hero.destroy();
	}

	protected selectPanel(panel: HeroPanelId): void {
		this.hero.selectPanel(panel);
	}

	protected clearPanel(): void {
		this.hero.clearPanel();
	}

	protected setChart(type: ChartType): void {
		this.hero.setChart(type);
	}

	protected randomizeChart(): void {
		this.hero.randomizeChart();
	}

	protected setEffect(effect: Exclude<HeroEffect, 'idle'>): void {
		this.hero.setEffect(effect);
	}

	protected setTemperature(): void {
		this.hero.setTemperature();
	}

	protected gradient(value: number): string {
		return this.hero.gradient(value);
	}

	protected showEarthInFront(event: MouseEvent): void {
		event.stopPropagation();
		this.earth.showInFront();
	}

	protected guardMonitorBanner(event: MouseEvent): void {
		if (!this.earthBlocksMonitor()) return;
		event.preventDefault();
		event.stopPropagation();
	}

	protected returnEarthBehind(event?: MouseEvent): void {
		this.earth.returnBehind(event?.target);
	}
}
