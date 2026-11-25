import { describe, expect, it, vi } from 'vitest';
import { destroyEarthRenderer, renderEarthFrame } from './earth-globe.renderer';

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

	it('releases owned GPU resources and listeners exactly once', () => {
		const canvas = document.createElement('canvas');
		Object.defineProperty(canvas, 'clientWidth', { value: 320 });
		const texture = document.createElement('canvas');
		const shader = {} as WebGLShader;
		const program = {} as WebGLProgram;
		const textureHandle = {} as WebGLTexture;
		const buffer = {} as WebGLBuffer;
		const deletes = {
			shader: vi.fn(),
			program: vi.fn(),
			texture: vi.fn(),
			buffer: vi.fn(),
		};
		const context = {
			VERTEX_SHADER: 1,
			FRAGMENT_SHADER: 2,
			COMPILE_STATUS: 3,
			LINK_STATUS: 4,
			ARRAY_BUFFER: 5,
			STATIC_DRAW: 6,
			FLOAT: 7,
			TEXTURE0: 8,
			TEXTURE_2D: 9,
			TEXTURE_MIN_FILTER: 10,
			TEXTURE_MAG_FILTER: 11,
			LINEAR_MIPMAP_LINEAR: 12,
			LINEAR: 13,
			TEXTURE_WRAP_S: 14,
			TEXTURE_WRAP_T: 15,
			REPEAT: 16,
			CLAMP_TO_EDGE: 17,
			UNPACK_FLIP_Y_WEBGL: 18,
			RGBA: 19,
			UNSIGNED_BYTE: 20,
			COLOR_BUFFER_BIT: 21,
			TRIANGLE_STRIP: 22,
			createShader: vi.fn(() => shader),
			shaderSource: vi.fn(),
			compileShader: vi.fn(),
			getShaderParameter: vi.fn(() => true),
			createProgram: vi.fn(() => program),
			createTexture: vi.fn(() => textureHandle),
			createBuffer: vi.fn(() => buffer),
			attachShader: vi.fn(),
			linkProgram: vi.fn(),
			getProgramParameter: vi.fn(() => true),
			getAttribLocation: vi.fn(() => 0),
			getUniformLocation: vi.fn(() => ({}) as WebGLUniformLocation),
			bindBuffer: vi.fn(),
			bufferData: vi.fn(),
			useProgram: vi.fn(),
			enableVertexAttribArray: vi.fn(),
			vertexAttribPointer: vi.fn(),
			activeTexture: vi.fn(),
			bindTexture: vi.fn(),
			pixelStorei: vi.fn(),
			texParameteri: vi.fn(),
			texImage2D: vi.fn(),
			generateMipmap: vi.fn(),
			getExtension: vi.fn(() => null),
			uniform1i: vi.fn(),
			viewport: vi.fn(),
			clearColor: vi.fn(),
			clear: vi.fn(),
			uniform4f: vi.fn(),
			drawArrays: vi.fn(),
			isContextLost: vi.fn(() => false),
			deleteShader: deletes.shader,
			deleteProgram: deletes.program,
			deleteTexture: deletes.texture,
			deleteBuffer: deletes.buffer,
		} as unknown as WebGLRenderingContext;
		canvas.getContext = vi.fn(() => context) as unknown as typeof canvas.getContext;

		renderEarthFrame({
			canvas,
			image: texture,
			frame: { angle: 0, axisX: 0, axisY: 1, axisZ: 0, rotation: [0, 0, 0, 1], foreground: true },
		});
		destroyEarthRenderer(canvas);
		destroyEarthRenderer(canvas);

		expect(deletes.shader).toHaveBeenCalledTimes(2);
		expect(deletes.program).toHaveBeenCalledTimes(1);
		expect(deletes.texture).toHaveBeenCalledTimes(1);
		expect(deletes.buffer).toHaveBeenCalledTimes(1);
	});
});
