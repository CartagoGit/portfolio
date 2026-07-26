import { computed, signal } from '@angular/core';
import type { EarthDepth } from '../../../../domain/portfolio/portfolio.types';

export class EarthDepthFacade {
  readonly state = signal<EarthDepth>('behind');
  readonly blocksMonitor = computed(() => this.state() !== 'behind');

  showInFront(): void {
    if (this.state() !== 'behind') return;
    this.state.set('out-behind');
    window.setTimeout(() => {
      if (this.state() !== 'out-behind') return;
      this.state.set('front-ready');
      requestAnimationFrame(() => this.state.set('front'));
    }, 140);
  }

  returnBehind(target?: EventTarget | null): void {
    if (this.state() !== 'front') return;
    if (target instanceof HTMLElement && target.closest('.earth-motion-control')) return;
    this.state.set('out-front');
    window.setTimeout(() => {
      if (this.state() !== 'out-front') return;
      this.state.set('behind-ready');
      requestAnimationFrame(() => this.state.set('behind'));
    }, 140);
  }
}
