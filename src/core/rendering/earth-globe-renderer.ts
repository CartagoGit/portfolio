import type { IEarthTextureStyle } from '../../domain/types';

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
	rotation: WebGLUniformLocation;
	textureStyle: WebGLUniformLocation;
}

const programs = new WeakMap<HTMLCanvasElement, IGlobeProgram | null>();

const vertexShader = `
  attribute vec2 position;
  varying vec2 uv;
  void main() {
    uv = position * .5 + .5;
    gl_Position = vec4(position, 0., 1.);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 uv;
  uniform sampler2D earthTexture;
  uniform vec4 rotation;
  uniform int textureStyle;
  const float PI = 3.14159265359;

  vec3 rotateByQuaternion(vec3 point, vec4 quaternion) {
    vec3 axis = quaternion.xyz;
    vec3 twice = cross(axis, point);
    return point + twice * (2.0 * quaternion.w) + cross(axis, twice) * 2.0;
  }

  void main() {
    vec2 point = uv * 2. - 1.;
    point.y = -point.y;
    float distance = dot(point, point);
    if (distance > 1.) discard;

    vec3 surface = vec3(point, sqrt(max(0., 1. - distance)));
    vec3 rotated = rotateByQuaternion(surface, rotation);
    float longitude = atan(rotated.x, rotated.z);
    float latitude = asin(clamp(-rotated.y, -1., 1.));
    vec2 textureUv = vec2(fract(longitude / (2. * PI) + .5), .5 - latitude / PI);
    vec3 color = texture2D(earthTexture, textureUv).rgb;
    float luminance = dot(color, vec3(.2126, .7152, .0722));

    if (textureStyle == 1) {
      vec3 ocean = vec3(.055, .18, .31);
      vec3 land = vec3(.47, .32, .13);
      vec3 ice = vec3(.79, .92, .96);
      float landMask = smoothstep(.24, .72, color.r + color.g * .34 - color.b * .48);
      color = mix(ocean, land, landMask);
      color = mix(color, ice, smoothstep(.74, .94, luminance) * .42);
      color = mix(color, vec3(.08, .42, .55), smoothstep(.03, .22, abs(color.b - color.r)) * .28);
    } else if (textureStyle == 2) {
      vec3 cold = vec3(.025, .18, .56);
      vec3 warm = vec3(.92, .18, .055);
      color = mix(cold, warm, smoothstep(.16, .78, luminance));
      color += vec3(.12, .03, .0) * pow(luminance, 3.);
    }

    float light = .34 + .66 * max(0., -.35 * point.x - .2 * point.y + .92 * surface.z);
    float rim = pow(1. - surface.z, 3.) * .16;
    color = color * light + vec3(.12, .52, .8) * rim;
    float alpha = 1. - smoothstep(.975, 1., distance);
    gl_FragColor = vec4(color, alpha);
  }
`;

/** Draws a true spherical projection at the display resolution using WebGL. */
export function renderEarthFrame(args: {
	canvas: HTMLCanvasElement;
	image: HTMLCanvasElement;
	frame: IEarthFrame;
}): void {
	const { canvas, image, frame } = args;
	const deviceScale = Math.min(Math.max(window.devicePixelRatio || 1, 1.5), 2.8);
	// Use the physical layout box. CSS transforms scale the finished pixels but
	// must not force a WebGL buffer reallocation and quality drop mid-transition.
	const rect = canvas.getBoundingClientRect();
	const cssSize = Math.max(
		64,
		Math.round(canvas.clientWidth || canvas.offsetWidth || rect.width || 300)
	);
	const size = Math.min(
		2048,
		Math.max(512, Math.round(cssSize * deviceScale))
	);
	if (canvas.width !== size || canvas.height !== size) {
		canvas.width = size;
		canvas.height = size;
		programs.delete(canvas);
	}

	const globeProgram = getProgram(canvas, image);
	if (!globeProgram) return;

	const { context } = globeProgram;
	const rotation = normalizedFrameRotation(frame);
	context.viewport(0, 0, size, size);
	context.useProgram(globeProgram.program);
	context.uniform4f(globeProgram.rotation, rotation[0], rotation[1], rotation[2], rotation[3]);
	context.uniform1i(globeProgram.textureStyle, textureStyleIndex(frame.textureStyle));
	context.drawArrays(context.TRIANGLE_STRIP, 0, 4);
}

function getProgram(
	canvas: HTMLCanvasElement,
	image: HTMLCanvasElement
): IGlobeProgram | null {
	const cached = programs.get(canvas);
	if (cached !== undefined) return cached;

	const context = canvas.getContext('webgl', {
		alpha: true,
		antialias: true,
		premultipliedAlpha: false,
	});
	if (!context) {
		programs.set(canvas, null);
		return null;
	}

	const vertex = compileShader({
		context,
		type: context.VERTEX_SHADER,
		source: vertexShader,
	});
	const fragment = compileShader({
		context,
		type: context.FRAGMENT_SHADER,
		source: fragmentShader,
	});
	if (!vertex || !fragment) return null;
	const program = context.createProgram();
	const texture = context.createTexture();
	if (!program || !texture) return null;

	context.attachShader(program, vertex);
	context.attachShader(program, fragment);
	context.linkProgram(program);
	if (!context.getProgramParameter(program, context.LINK_STATUS)) return null;

	const position = context.getAttribLocation(program, 'position');
	const rotation = context.getUniformLocation(program, 'rotation');
	const textureStyle = context.getUniformLocation(program, 'textureStyle');
	if (position < 0 || !rotation || !textureStyle) return null;

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
	// The shader maps texture V=0 to the screen's north pole, so source rows
	// must stay in their original top-to-bottom order.
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
	const anisotropy = context.getExtension('EXT_texture_filter_anisotropic');
	if (anisotropy) {
		context.texParameterf(
			context.TEXTURE_2D,
			anisotropy.TEXTURE_MAX_ANISOTROPY_EXT,
			context.getParameter(anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT)
		);
	}
	context.uniform1i(context.getUniformLocation(program, 'earthTexture'), 0);

	const renderer = { context, program, texture, rotation, textureStyle };
	programs.set(canvas, renderer);
	return renderer;
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

function textureStyleIndex(style: IEarthTextureStyle | undefined): number {
	return style === 'terrain' ? 1 : style === 'infrared' ? 2 : 0;
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
	return context.getShaderParameter(shader, context.COMPILE_STATUS)
		? shader
		: null;
}
