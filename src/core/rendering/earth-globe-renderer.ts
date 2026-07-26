/** GPU renderer for the interactive Earth; CPU work is deliberately avoided. */
export interface IEarthFrame {
	angle: number;
	axisX: number;
	axisY: number;
	axisZ: number;
	foreground: boolean;
}

interface IGlobeProgram {
	context: WebGLRenderingContext;
	program: WebGLProgram;
	texture: WebGLTexture;
	angle: WebGLUniformLocation;
	axis: WebGLUniformLocation;
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
  uniform float angle;
  uniform vec3 axis;
  const float PI = 3.14159265359;

  void main() {
    vec2 point = uv * 2. - 1.;
    point.y = -point.y;
    float distance = dot(point, point);
    if (distance > 1.) discard;

    vec3 surface = vec3(point, sqrt(1. - distance));
    float cosine = cos(angle);
    float sine = sin(angle);
    vec3 rotated = surface * cosine + cross(axis, surface) * sine + axis * dot(axis, surface) * (1. - cosine);
    float longitude = atan(rotated.x, rotated.z);
    float latitude = asin(clamp(-rotated.y, -1., 1.));
    vec2 textureUv = vec2(fract(longitude / (2. * PI) + .5), .5 - latitude / PI);
    vec3 color = texture2D(earthTexture, textureUv).rgb;
    float light = .34 + .66 * max(0., -.35 * point.x - .2 * point.y + .92 * surface.z);
    gl_FragColor = vec4(color * light, 1.);
  }
`;

/** Draws a true spherical projection at the display resolution using WebGL. */
export function renderEarthFrame(args: {
	canvas: HTMLCanvasElement;
	image: HTMLCanvasElement;
	frame: IEarthFrame;
}): void {
	const { canvas, image, frame } = args;
	const deviceScale = Math.min(window.devicePixelRatio || 1, 2.4);
	const size = Math.min(
		1024,
		Math.max(320, Math.round((canvas.clientWidth || 300) * deviceScale))
	);
	if (canvas.width !== size || canvas.height !== size) {
		canvas.width = size;
		canvas.height = size;
		// Resizing a canvas resets its WebGL state, so the GPU program and texture
		// must be created only after the final drawing buffer size is known.
		programs.delete(canvas);
	}

	const program = getProgram(canvas, image);
	if (!program) return;

	const { context } = program;
	context.viewport(0, 0, size, size);
	context.useProgram(program.program);
	context.uniform1f(program.angle, frame.angle);
	context.uniform3f(program.axis, frame.axisX, frame.axisY, frame.axisZ);
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
	const angle = context.getUniformLocation(program, 'angle');
	const axis = context.getUniformLocation(program, 'axis');
	if (position < 0 || !angle || !axis) return null;

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

	const renderer = { context, program, texture, angle, axis };
	programs.set(canvas, renderer);
	return renderer;
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
