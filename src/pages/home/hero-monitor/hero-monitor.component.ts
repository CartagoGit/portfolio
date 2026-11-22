import {
	ChangeDetectionStrategy,
	Component,
	type OnDestroy,
	signal,
	ViewEncapsulation,
	input,
} from '@angular/core';
import { EarthGlobeComponent } from '../earth-globe/earth-globe.component';
import { EarthDepthFacade } from '../earth-globe/earth-depth.facade';
import { HeroMonitorFacade } from './hero-monitor.facade';
import type { IChartOption, IEffectOption, IMonitorPreview } from '../../../domain/types';

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
		'(document:pointerdown)': '_onDocumentDown($event)',
	},
})
export class HeroMonitorComponent implements OnDestroy {
	readonly preview = input<IMonitorPreview | null>(null);
	readonly activePreview = signal<IMonitorPreview | null>(null);
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

	ngOnDestroy(): void {
		this.hero.destroy();
		this._earth.destroy();
		if (this._monitorOpenTimer !== undefined)
			window.clearTimeout(this._monitorOpenTimer);
		if (this._monitorCloseTimer !== undefined)
			window.clearTimeout(this._monitorCloseTimer);
	}

	enterMonitor(): void {
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
		this._monitorHovered = false;
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
		this.activePreview.set(preview);
		if (preview) this.enterMonitor();
		else this.leaveMonitor();
	}
}
