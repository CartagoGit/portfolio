import { describe, expect, it, vi } from 'vitest';
import { HeroMonitorFacade } from './hero-monitor.facade';

describe('HeroMonitorFacade', () => {
	it('updates the selected panel and randomises its chart', () => {
		const facade = new HeroMonitorFacade();
		facade.setChart('line');
		expect(facade.chartType()).toBe('line');
		expect(facade.chartBars()).toHaveLength(5);
		facade.setTemperature();
		expect(facade.palette()).toBe('heat');
	});

	/**
	 * The helper that picks the next hero panel transition used to
	 * live in src/core/motion/motion.ts. It is now a private detail
	 * of the facade; the same coverage comes from observing
	 * `panelTransition()` while `selectPanel` rotates between two
	 * different panels.
	 */
	it('rotates the hero panel transition between selections', () => {
		const facade = new HeroMonitorFacade();
		facade.panelTransition.set('slide');
		facade.selectPanel('overview');
		const firstTransition = facade.panelTransition();
		facade.panelTransition.set(firstTransition);
		facade.selectPanel('quality');
		const secondTransition = facade.panelTransition();
		expect(secondTransition).not.toBe(firstTransition);
	});

	it('keeps only the latest queued effect and clears it on destroy', () => {
		vi.useFakeTimers();
		try {
			const facade = new HeroMonitorFacade();
			facade.setEffect('shake');
			facade.setEffect('glitch');
			vi.advanceTimersByTime(24);
			expect(facade.effect()).toBe('glitch');

			facade.setEffect('float');
			facade.destroy();
			vi.advanceTimersByTime(24);
			expect(facade.effect()).toBe('idle');
		} finally {
			vi.useRealTimers();
		}
	});

	it('cancels all queued work and remains inert after destroy', () => {
		vi.useFakeTimers();
		try {
			const facade = new HeroMonitorFacade();
			facade.selectPanel('overview');
			facade.setEffect('shake');
			expect(vi.getTimerCount()).toBe(2);

			facade.destroy();
			facade.destroy();
			facade.selectPanel('quality');
			facade.setEffect('glitch');
			vi.runAllTimers();

			expect(facade.activePanel()).toBeNull();
			expect(facade.effect()).toBe('idle');
			expect(vi.getTimerCount()).toBe(0);
		} finally {
			vi.useRealTimers();
		}
	});
});
