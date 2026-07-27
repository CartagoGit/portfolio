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
import type {
	IChartType,
	IHeroEffect,
	IHeroPanelId,
} from '../../../domain/types';

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
	// Composition root: two facades that own the monitor's state.
	private readonly _hero = new HeroMonitorFacade();
	private readonly _earth = new EarthDepthFacade();
	private readonly _document = inject(DOCUMENT);
	private _returnTimer: ReturnType<typeof setTimeout> | null = null;
	private _userInteracted = false;

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

	ngOnInit(): void {
		// Defensive: if a user clicks anywhere outside the monitor while the
		// orb is on top, the globe should glide back behind. Using a document
		// listener avoids the orb getting stuck after a stray click on the
		// header, footer or the rest of the page.
		this._document.addEventListener('pointerdown', this._onDocumentDown);
	}

	ngOnDestroy(): void {
		this._hero.destroy();
		this._cancelReturn();
		this._document.removeEventListener('pointerdown', this._onDocumentDown);
	}

	private readonly _onDocumentDown = (event: PointerEvent): void => {
		const target = event.target as Element | null;
		if (!target) return;
		if (target.closest('app-hero-monitor')) return;
		if (this._earth.state() !== 'behind' && this._earth.state() !== 'behind-ready') {
			this._userInteracted = false;
		}
		this._earth.returnBehind(target);
	};

	onDocumentPointerDown(event: PointerEvent): void {
		// The host-level handler delegates to the same logic; kept as a method
		// so Angular lifecycle / template binding stay obvious.
		this._onDocumentDown(event);
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
		this._cancelReturn();
		this._userInteracted = true;
		this._earth.showInFront();
	}

	/**
	 * Pointerdown on the orb counts as the user wanting to interact with the
	 * sphere itself; lock it in front so the subsequent mouseleave/drag does
	 * not flip it back behind the monitor.
	 */
	lockGlobeInFront(event: PointerEvent): void {
		event.stopPropagation();
		this._cancelReturn();
		if (
			this._earth.state() === 'behind' ||
			this._earth.state() === 'behind-ready'
		) {
			this._userInteracted = true;
			this._earth.showInFront();
		}
	}

	/**
	 * Clicking the visible orb behind the monitor should bring it forward —
	 * the same gesture as the motion control, but on the sphere itself.
	 * When the globe is already in front, the pointer drag inside EarthGlobeComponent
	 * takes precedence and this stopPropagation prevents the canvas click
	 * from leaking to the shell click handler.
	 */
	handleOrbClick(event: MouseEvent): void {
		event.stopPropagation();
		if (
			this._earth.state() === 'behind' ||
			this._earth.state() === 'behind-ready'
		) {
			this._cancelReturn();
			this._userInteracted = true;
			this._earth.showInFront();
		}
	}

	guardMonitorBanner(event: MouseEvent): void {
		if (!this.earthBlocksMonitor()) return;
		event.preventDefault();
		event.stopPropagation();
	}

	/**
	 * Returns the orb behind the monitor with a small grace period. The delay
	 * gives the cursor time to slip to a neighbouring element (the orb when
	 * the orb-on-top is hovered, the canvas while dragging, etc.) without the
	 * depth flipping back and forth on every pixel.
	 *
	 * Skipped when the user has explicitly grabbed the globe — once you've
	 * committed to looking at it we leave the orb on top until you dismiss
	 * it via clicking on the monitor, the motion button, or somewhere else.
	 */
	scheduleReturnBehind(event?: MouseEvent): void {
		if (event && this._isEarthTarget(event.relatedTarget as Element | null))
			return;
		if (this._userInteracted) return;
		this._cancelReturn();
		this._returnTimer = setTimeout(() => {
			this._returnTimer = null;
			this._earth.returnBehind(event?.target ?? null);
		}, 180);
	}
	/**
	 * Reset the lock once the globe has been dismissed so a future auto-return
	 * is allowed.
	 */
	private _onEarthReturned(): void {
		this._userInteracted = false;
	}
	private _cancelReturn(): void {
		if (this._returnTimer !== null) {
			clearTimeout(this._returnTimer);
			this._returnTimer = null;
		}
	}

	/**
	 * Click anywhere on the monitor shell that is NOT the globe, the motion
	 * control, or a meaningful interactive control should release the globe
	 * back behind the monitor. Anything inside the chrome stays put.
	 */
	handleShellInteraction(event: MouseEvent): void {
		const target = event.target as Element | null;
		if (!target) return;
		if (target.closest('.orb-one')) return;
		if (target.closest('.earth-motion-control')) return;
		if (target.closest('button')) return;
		if (target.closest('a')) return;
		if (target.closest('input, textarea, select')) return;
		this._cancelReturn();
		if (this._earth.state() !== 'behind' && this._earth.state() !== 'behind-ready') {
			this._userInteracted = false;
		}
		this._earth.returnBehind(target);
	}

	private _isEarthTarget(target: Element | null | undefined): boolean {
		return !!target && target.closest('.orb-one') !== null;
	}
}
