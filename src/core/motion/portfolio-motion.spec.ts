import { nextHeroPanelTransition } from './portfolio-motion';

describe('nextHeroPanelTransition', () => {
	it('never repeats the current animation', () => {
		expect(nextHeroPanelTransition('slide', () => 0)).toBe('flip');
		expect(nextHeroPanelTransition('slide', () => 0.99)).toBe('scan');
		expect(nextHeroPanelTransition('scan', () => 0)).toBe('slide');
	});
});
