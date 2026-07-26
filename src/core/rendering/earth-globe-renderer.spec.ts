import { describe, expect, it } from 'vitest';
import { renderEarthFrame } from './earth-globe-renderer';

describe('renderEarthFrame', () => {
	it('sizes the canvas before requesting the WebGL context', () => {
		const canvas = document.createElement('canvas');
		Object.defineProperty(canvas, 'clientWidth', { value: 320 });
		const texture = document.createElement('canvas');
		const requestedSizes: number[] = [];
		canvas.getContext = ((kind: string) => {
			if (kind === 'webgl') requestedSizes.push(canvas.width);
			return null;
		}) as typeof canvas.getContext;

		renderEarthFrame(canvas, texture, {
			angle: 0,
			axisX: 0,
			axisY: 1,
			axisZ: 0,
			foreground: false,
		});
		expect(canvas.width).toBeGreaterThanOrEqual(320);
		expect(requestedSizes[0]).toBe(canvas.width);
	});
});
