import { computed, signal } from '@angular/core';
import type { IEarthDepth } from '../../../domain/types.interface';

const DEPTH_TRANSITION_MS = 560;
const PAINT_FALLBACK_MS = 50;

export class EarthDepthFacade {
	readonly state = signal<IEarthDepth>('behind');
	readonly blocksMonitor = computed(() => this.state() !== 'behind');
	private _generation = 0;
	private _transitionTimer?: number;
	private _paintFrame?: number;
	private _paintFallback?: number;

	showInFront(): void {
		if (this.state() !== 'behind') return;
		const generation = this._restartTransition();
		this.state.set('out-behind');
		this._transitionTimer = window.setTimeout(() => {
			if (generation !== this._generation) return;
			this.state.set('front-ready');
			this._completeAfterPaint({
				generation,
				expected: 'front-ready',
				complete: 'front',
			});
		}, DEPTH_TRANSITION_MS);
	}

	returnBehind(target?: EventTarget | null): void {
		if (this.state() === 'behind') return;
		if (
			target instanceof HTMLElement &&
			target.closest('.hero-monitor__motion-control')
		)
			return;
		const generation = this._restartTransition();
		this.state.set('out-front');
		this._transitionTimer = window.setTimeout(() => {
			if (generation !== this._generation) return;
			this.state.set('behind-ready');
			this._completeAfterPaint({
				generation,
				expected: 'behind-ready',
				complete: 'behind',
			});
		}, DEPTH_TRANSITION_MS);
	}

	destroy(): void {
		this._restartTransition();
	}

	private _restartTransition(): number {
		this._generation += 1;
		if (this._transitionTimer !== undefined)
			window.clearTimeout(this._transitionTimer);
		if (this._paintFrame !== undefined)
			cancelAnimationFrame(this._paintFrame);
		if (this._paintFallback !== undefined)
			window.clearTimeout(this._paintFallback);
		this._transitionTimer = undefined;
		this._paintFrame = undefined;
		this._paintFallback = undefined;
		return this._generation;
	}

	private _completeAfterPaint(transition: {
		generation: number;
		expected: Exclude<IEarthDepth, 'behind' | 'front'>;
		complete: 'behind' | 'front';
	}): void {
		const complete = (): void => {
			if (transition.generation !== this._generation) return;
			if (this.state() !== transition.expected) return;
			this.state.set(transition.complete);
			if (this._paintFrame !== undefined)
				cancelAnimationFrame(this._paintFrame);
			if (this._paintFallback !== undefined)
				window.clearTimeout(this._paintFallback);
			this._paintFrame = undefined;
			this._paintFallback = undefined;
		};
		this._paintFrame = requestAnimationFrame(complete);
		this._paintFallback = window.setTimeout(complete, PAINT_FALLBACK_MS);
	}
}
