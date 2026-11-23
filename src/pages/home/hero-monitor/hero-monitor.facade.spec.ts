import { describe, expect, it } from 'vitest';
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
});
