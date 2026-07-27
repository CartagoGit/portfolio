import { computed, signal } from '@angular/core';
import type { IEarthDepth } from '../../../domain/types';

export class EarthDepthFacade {
	readonly state = signal<IEarthDepth>('behind');
	readonly blocksMonitor = computed(() => this.state() !== 'behind');

	showInFront(): void {
		// Idempotent: snap to a fresh transition chain regardless of the current
		// state. Without this, any hover/move during an in-flight transition is
		// silently dropped.
		if (this.state() === 'front') return;
		this.state.set('out-behind');
		window.setTimeout(() => {
			if (this.state() !== 'out-behind') return;
			this.state.set('front-ready');
			requestAnimationFrame(() => this.state.set('front'));
		}, 140);
	}

	returnBehind(target?: EventTarget | null): void {
		// Only return when the orb is fully on top; the brief grace transitions
		// are owned by the orchestrator (typically `_cancelReturn`) and we must
		// not interrupt them with a competing return.
		if (this.state() !== 'front') return;
		if (
			target instanceof HTMLElement &&
			target.closest('.earth-motion-control')
		)
			return;
		this.state.set('out-front');
		window.setTimeout(() => {
			if (this.state() !== 'out-front') return;
			this.state.set('behind-ready');
			requestAnimationFrame(() => this.state.set('behind'));
		}, 140);
	}
}
