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
});
