import { describe, expect, it, vi } from 'vitest';
import { renderEarthFrame } from './earth-globe.renderer';

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

		renderEarthFrame({
			canvas,
			image: texture,
			frame: {
				angle: 0,
				axisX: 0,
				axisY: 1,
				axisZ: 0,
				foreground: false,
			},
		});
		expect(canvas.width).toBeGreaterThanOrEqual(320);
		expect(requestedSizes[0]).toBe(canvas.width);
	});

	it('caps the drawing buffer at a crisp 2048 pixels', () => {
		const canvas = document.createElement('canvas');
		Object.defineProperty(canvas, 'clientWidth', { value: 1600 });
		const texture = document.createElement('canvas');
		canvas.getContext = vi.fn(() => null) as typeof canvas.getContext;

		renderEarthFrame({
			canvas,
			image: texture,
			frame: {
				angle: 0,
				axisX: 0,
				axisY: 1,
				axisZ: 0,
				rotation: [0, 0, 0, 1],
				textureStyle: 'terrain',
				foreground: true,
			},
		});
		expect(canvas.width).toBe(2048);
		expect(canvas.height).toBe(2048);
	});
});
