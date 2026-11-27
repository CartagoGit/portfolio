import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EarthDepthFacade } from './earth-depth.facade';

describe('EarthDepthFacade', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
		vi.stubGlobal('cancelAnimationFrame', vi.fn());
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	it('blocks monitor interactions until the globe returns behind it', () => {
		const facade = new EarthDepthFacade();
		expect(facade.blocksMonitor()).toBe(false);
		facade.showInFront();
		expect(facade.blocksMonitor()).toBe(true);
	});

	it('completes the forward transition even when animation frames stall', () => {
		const facade = new EarthDepthFacade();
		facade.showInFront();
		vi.advanceTimersByTime(560);
		expect(facade.state()).toBe('front-ready');
		vi.advanceTimersByTime(50);
		expect(facade.state()).toBe('front');
	});

	it('does not restart a forward transition on pointerdown and click', () => {
		const facade = new EarthDepthFacade();
		facade.showInFront();
		vi.advanceTimersByTime(200);
		facade.showInFront();
		vi.advanceTimersByTime(360);
		expect(facade.state()).toBe('front-ready');
		vi.advanceTimersByTime(50);
		expect(facade.state()).toBe('front');
	});

	it('can return from a transition that is still on its way forward', () => {
		const facade = new EarthDepthFacade();
		facade.showInFront();
		vi.advanceTimersByTime(560);
		facade.returnBehind();
		vi.advanceTimersByTime(610);
		expect(facade.state()).toBe('behind');
	});

	it('does not let a stale forward transition overwrite a return', () => {
		const facade = new EarthDepthFacade();
		facade.showInFront();
		vi.advanceTimersByTime(40);
		facade.returnBehind();
		vi.advanceTimersByTime(610);
		expect(facade.state()).toBe('behind');
	});

	it('completes the spatial transition plus paint fallback', () => {
		const facade = new EarthDepthFacade();
		facade.showInFront();
		vi.advanceTimersByTime(560);
		expect(facade.state()).toBe('front-ready');
		facade.returnBehind();
		vi.advanceTimersByTime(610);
		expect(facade.state()).toBe('behind');
	});
});
