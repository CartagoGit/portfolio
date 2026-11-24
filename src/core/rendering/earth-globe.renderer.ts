import type { IEarthTextureStyle } from '../../domain/types.interface';
import { EARTH_GLOBE_SHADERS } from './shaders/shaders.barrel';

/** GPU renderer for the interactive Earth; CPU work is deliberately avoided. */
export interface IEarthFrame {
	angle: number;
	axisX: number;
	axisY: number;
	axisZ: number;
	rotation?: readonly [x: number, y: number, z: number, w: number];
	textureStyle?: IEarthTextureStyle;
	foreground: boolean;
}

interface IGlobeProgram {
	context: WebGLRenderingContext;
	program: WebGLProgram;
	texture: WebGLTexture;
	image: HTMLCanvasElement;
	rotation: WebGLUniformLocation;
	textureEffect: WebGLUniformLocation;
}

const renderers = new WeakMap<HTMLCanvasElement, EarthRenderer>();

/** Draws a frame through a reusable renderer owned by the canvas. */
export function renderEarthFrame(args: {
	canvas: HTMLCanvasElement;
	image: HTMLCanvasElement;
	frame: IEarthFrame;
}): void {
	let renderer = renderers.get(args.canvas);
	if (!renderer) {
		renderer = new EarthRenderer(args.canvas);
		renderers.set(args.canvas, renderer);
	}
	renderer.render(args.image, args.frame);
}

/** WebGL renderer for the interactive globe; CPU work is deliberately avoided. */
export class EarthRenderer {
	private _globeProgram: IGlobeProgram | null = null;

	constructor(private readonly canvas: HTMLCanvasElement) {}

	/** Updates the rendering surface and draws the current frame. */
	public render(image: HTMLCanvasElement, frame: IEarthFrame): void {
		const { canvas } = this;
		const deviceScale = Math.min(Math.max(window.devicePixelRatio || 1, 1.5), 2.8);
		const rect = canvas.getBoundingClientRect();
		const cssSize = Math.max(
			64,
			Math.round(canvas.clientWidth || canvas.offsetWidth || rect.width || 300)
		);
		const size = Math.min(2048, Math.max(512, Math.round(cssSize * deviceScale)));
		if (canvas.width !== size || canvas.height !== size) {
			canvas.width = size;
			canvas.height = size;
			this._globeProgram = null;
		}

		const globeProgram = this.getProgram(image);
		if (!globeProgram) return;

		const { context } = globeProgram;
		const rotation = normalizedFrameRotation(frame);
		context.viewport(0, 0, size, size);
		context.clearColor(0, 0, 0, 0);
		context.clear(context.COLOR_BUFFER_BIT);
		context.useProgram(globeProgram.program);
		context.uniform4f(
			globeProgram.rotation,
			rotation[0],
			rotation[1],
			rotation[2],
			rotation[3]
		);
		context.uniform1i(
			globeProgram.textureEffect,
			textureEffectIndex(frame.textureStyle)
		);
		context.drawArrays(context.TRIANGLE_STRIP, 0, 4);
	}

	private getProgram(image: HTMLCanvasElement): IGlobeProgram | null {
		const cached = this._globeProgram;
		if (cached) {
			if (cached.image !== image) {
				uploadTexture({ context: cached.context, texture: cached.texture, image });
				cached.image = image;
			}
			return cached;
		}

		const context = this.canvas.getContext('webgl', {
			alpha: true,
			antialias: true,
			premultipliedAlpha: false,
		});
		if (!context) return null;

		const vertex = compileShader({
			context,
			type: context.VERTEX_SHADER,
			source: EARTH_GLOBE_SHADERS.vertex,
		});
		const fragment = compileShader({
			context,
			type: context.FRAGMENT_SHADER,
			source: EARTH_GLOBE_SHADERS.fragment,
		});
		if (!vertex || !fragment) return null;

		const program = context.createProgram();
		const texture = context.createTexture();
		if (!program || !texture) return null;

		context.attachShader(program, vertex);
		context.attachShader(program, fragment);
		context.linkProgram(program);
		if (!context.getProgramParameter(program, context.LINK_STATUS)) {
			console.error('WebGL program link failed:', context.getProgramInfoLog(program));
			return null;
		}

		const position = context.getAttribLocation(program, 'position');
		const rotation = context.getUniformLocation(program, 'rotation');
		const textureEffect = context.getUniformLocation(program, 'textureEffect');
		if (position < 0 || !rotation || !textureEffect) return null;

		const buffer = context.createBuffer();
		if (!buffer) return null;
		context.bindBuffer(context.ARRAY_BUFFER, buffer);
		context.bufferData(
			context.ARRAY_BUFFER,
			new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
			context.STATIC_DRAW
		);
		context.useProgram(program);
		context.enableVertexAttribArray(position);
		context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0);
		context.activeTexture(context.TEXTURE0);
		context.bindTexture(context.TEXTURE_2D, texture);
		context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, false);
		context.texParameteri(
			context.TEXTURE_2D,
			context.TEXTURE_MIN_FILTER,
			context.LINEAR_MIPMAP_LINEAR
		);
		context.texParameteri(
			context.TEXTURE_2D,
			context.TEXTURE_MAG_FILTER,
			context.LINEAR
		);
		context.texParameteri(
			context.TEXTURE_2D,
			context.TEXTURE_WRAP_S,
			context.REPEAT
		);
		context.texParameteri(
			context.TEXTURE_2D,
			context.TEXTURE_WRAP_T,
			context.CLAMP_TO_EDGE
		);
		context.texImage2D(
			context.TEXTURE_2D,
			0,
			context.RGBA,
			context.RGBA,
			context.UNSIGNED_BYTE,
			image
		);
		context.generateMipmap(context.TEXTURE_2D);
		applyAnisotropicFilter(context, texture);
		context.uniform1i(context.getUniformLocation(program, 'earthTexture'), 0);

		this._globeProgram = {
			context,
			program,
			texture,
			image,
			rotation,
			textureEffect,
		};
		return this._globeProgram;
	}
}

function applyAnisotropicFilter(
	context: WebGLRenderingContext,
	texture: WebGLTexture
): void {
	const anisotropy = context.getExtension('EXT_texture_filter_anisotropic');
	if (!anisotropy) return;
	context.bindTexture(context.TEXTURE_2D, texture);
	context.texParameterf(
		context.TEXTURE_2D,
		anisotropy.TEXTURE_MAX_ANISOTROPY_EXT,
		context.getParameter(anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT)
	);
}

function uploadTexture(args: {
	context: WebGLRenderingContext;
	texture: WebGLTexture;
	image: HTMLCanvasElement;
}): void {
	const { context, texture, image } = args;
	context.activeTexture(context.TEXTURE0);
	context.bindTexture(context.TEXTURE_2D, texture);
	context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, false);
	context.texImage2D(
		context.TEXTURE_2D,
		0,
		context.RGBA,
		context.RGBA,
		context.UNSIGNED_BYTE,
		image
	);
	context.generateMipmap(context.TEXTURE_2D);
	applyAnisotropicFilter(context, texture);
}

function normalizedFrameRotation(
	frame: IEarthFrame
): readonly [number, number, number, number] {
	if (frame.rotation) {
		const length = Math.hypot(...frame.rotation) || 1;
		return [
			frame.rotation[0] / length,
			frame.rotation[1] / length,
			frame.rotation[2] / length,
			frame.rotation[3] / length,
		];
	}
	const axisLength = Math.hypot(frame.axisX, frame.axisY, frame.axisZ) || 1;
	const half = frame.angle / 2;
	const sine = Math.sin(half);
	return [
		(frame.axisX / axisLength) * sine,
		(frame.axisY / axisLength) * sine,
		(frame.axisZ / axisLength) * sine,
		Math.cos(half),
	];
}

function textureEffectIndex(style: IEarthTextureStyle | undefined): number {
	switch (style) {
		case 'terrain':
			return 2;
		case 'infrared':
			return 3;
		case 'sun':
			return 4;
		case 'saturn':
			return 5;
		case 'rugby':
			return 6;
		case 'pluto':
			return 7;
		case 'cartago-mark':
		case 'cartago-banner':
		case 'portrait':
			return 8;
		case 'soccer':
			return 9;
		case 'basketball':
			return 10;
		case 'tennis':
			return 11;
		case 'golf':
			return 12;
		default:
			return 0;
	}
}

function compileShader(args: {
	context: WebGLRenderingContext;
	type: number;
	source: string;
}): WebGLShader | null {
	const { context, type, source } = args;
	const shader = context.createShader(type);
	if (!shader) return null;
	context.shaderSource(shader, source);
	context.compileShader(shader);
	if (context.getShaderParameter(shader, context.COMPILE_STATUS)) return shader;
	console.error('WebGL shader compilation failed:', context.getShaderInfoLog(shader));
	context.deleteShader(shader);
	return null;
}
