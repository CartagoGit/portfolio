import { afterEach, describe, expect, it, vi } from 'vitest';
import { ArcadeRafLoop } from './arcade-raf-loop.helper';

const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;

afterEach(() => {
	globalThis.requestAnimationFrame = originalRequestAnimationFrame;
	globalThis.cancelAnimationFrame = originalCancelAnimationFrame;
});

describe('ArcadeRafLoop', () => {
	it('passes elapsed real time and stops scheduling exactly once', () => {
		const callbacks: FrameRequestCallback[] = [];
		const request = vi.fn((callback: FrameRequestCallback) => {
			callbacks.push(callback);
			return callbacks.length;
		});
		const cancel = vi.fn();
		globalThis.requestAnimationFrame = request;
		globalThis.cancelAnimationFrame = cancel;
		const deltas: number[] = [];
		const loop = new ArcadeRafLoop((delta) => deltas.push(delta));
		loop.start();
		callbacks[0]?.(100);
		callbacks[1]?.(270);
		expect(deltas).toEqual([0, 170]);
		loop.stop();
		expect(loop.running()).toBe(false);
		expect(cancel).toHaveBeenCalledTimes(1);
	});
});
