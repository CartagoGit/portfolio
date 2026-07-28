import { DOCUMENT } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	inject,
	type OnDestroy,
	type OnInit,
	ViewEncapsulation,
} from '@angular/core';
import { EarthGlobeComponent } from '../earth-globe/earth-globe.component';
import { EarthDepthFacade } from '../earth-globe/earth-depth.facade';
import { HeroMonitorFacade } from './hero-monitor.facade';
import type { IChartType, IHeroEffect } from '../../../domain/types';

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
	imports: [EarthGlobeComponent],
	templateUrl: './hero-monitor.component.html',
	styleUrl: './hero-monitor.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		'(document:pointerdown)': 'onDocumentPointerDown($event)',
	},
})
export class HeroMonitorComponent implements OnDestroy, OnInit {
	readonly hero = new HeroMonitorFacade();
	private readonly _earth = new EarthDepthFacade();
	private readonly _document = inject(DOCUMENT);

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

	ngOnInit(): void {
		// Outside clicks dismiss the orb back behind.
		this._document.addEventListener('pointerdown', this._onDocumentDown);
	}

	ngOnDestroy(): void {
		this.hero.destroy();
		this._document.removeEventListener('pointerdown', this._onDocumentDown);
	}

	private readonly _onDocumentDown = (event: PointerEvent): void => {
		const target = event.target as Element | null;
		if (!target) return;
		if (target.closest('app-hero-monitor')) return;
		this._earth.returnBehind(target);
	};

	onDocumentPointerDown(event: PointerEvent): void {
		this._onDocumentDown(event);
	}

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

	guardMonitorBanner(event: MouseEvent): void {
		if (!this.earthBlocksMonitor()) return;
		event.preventDefault();
		event.stopPropagation();
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
}
