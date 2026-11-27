import type { IGltfModelData, IGltfModelPrimitive } from './gltf-model.loader';
import { GLTF_MODEL_SHADERS } from './shaders/shaders.barrel';

export interface IGltfModelFrame {
	readonly rotation: readonly [number, number, number, number];
}

interface IPrimitiveBuffers {
	readonly positions: WebGLBuffer;
	readonly normals: WebGLBuffer;
	readonly uvs: WebGLBuffer;
	readonly indices: WebGLBuffer;
	readonly primitive: IGltfModelPrimitive;
}

interface IModelProgram {
	readonly context: WebGLRenderingContext;
	readonly program: WebGLProgram;
	readonly vertex: WebGLShader;
	readonly fragment: WebGLShader;
	readonly primitives: readonly IPrimitiveBuffers[];
	readonly diffuse: WebGLTexture;
	readonly normal: WebGLTexture;
	readonly arm: WebGLTexture;
	readonly position: number;
	readonly normalAttribute: number;
	readonly uv: number;
	readonly rotation: WebGLUniformLocation;
	readonly center: WebGLUniformLocation;
	readonly scale: WebGLUniformLocation;
	readonly projection: WebGLUniformLocation;
	readonly model: IGltfModelData;
}

const renderers = new WeakMap<HTMLCanvasElement, GltfModelRenderer>();

export function perspectiveProjection(
	{ fovRadians, aspect, near, far }: {
		readonly fovRadians: number;
		readonly aspect: number;
		readonly near: number;
		readonly far: number;
	},
): Float32Array {
	const focal = 1 / Math.tan(fovRadians / 2);
	return new Float32Array([
		focal / aspect,
		0,
		0,
		0,
		0,
		focal,
		0,
		0,
		0,
		0,
		(far + near) / (near - far),
		-1,
		0,
		0,
		(2 * far * near) / (near - far),
		0,
	]);
}

export function renderGltfFrame(args: {
	canvas: HTMLCanvasElement;
	model: IGltfModelData;
	frame: IGltfModelFrame;
}): boolean {
	let renderer = renderers.get(args.canvas);
	if (!renderer) {
		renderer = new GltfModelRenderer(args.canvas);
		renderers.set(args.canvas, renderer);
	}
	return renderer.render(args.model, args.frame);
}

export function destroyGltfRenderer(canvas: HTMLCanvasElement): void {
	const renderer = renderers.get(canvas);
	if (!renderer) return;
	renderer.destroy();
	renderers.delete(canvas);
}

function compileShader(args: {
	context: WebGLRenderingContext;
	type: number;
	source: string;
}): WebGLShader | null {
	const shader = args.context.createShader(args.type);
	if (!shader) return null;
	args.context.shaderSource(shader, args.source);
	args.context.compileShader(shader);
	if (args.context.getShaderParameter(shader, args.context.COMPILE_STATUS))
		return shader;
	console.error('glTF WebGL shader compilation failed:', args.context.getShaderInfoLog(shader));
	args.context.deleteShader(shader);
	return null;
}

function uploadBuffer(
	{ context, data, target }: {
		readonly context: WebGLRenderingContext;
		readonly data: ArrayBufferView;
		readonly target: number;
	},
): WebGLBuffer | null {
	const buffer = context.createBuffer();
	if (!buffer) return null;
	context.bindBuffer(target, buffer);
	context.bufferData(target, data, context.STATIC_DRAW);
	return buffer;
}

function uploadTexture(
	context: WebGLRenderingContext,
	image: HTMLImageElement,
): WebGLTexture | null {
	const texture = context.createTexture();
	if (!texture) return null;
	context.bindTexture(context.TEXTURE_2D, texture);
	context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
	context.texImage2D(
		context.TEXTURE_2D,
		0,
		context.RGBA,
		context.RGBA,
		context.UNSIGNED_BYTE,
		image,
	);
	context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.REPEAT);
	context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.REPEAT);
	context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR_MIPMAP_LINEAR);
	context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
	context.generateMipmap(context.TEXTURE_2D);
	return texture;
}

function releaseProgram(program: IModelProgram): void {
	const { context } = program;
	for (const primitive of program.primitives) {
		context.deleteBuffer(primitive.positions);
		context.deleteBuffer(primitive.normals);
		context.deleteBuffer(primitive.uvs);
		context.deleteBuffer(primitive.indices);
	}
	context.deleteTexture(program.diffuse);
	context.deleteTexture(program.normal);
	context.deleteTexture(program.arm);
	context.deleteProgram(program.program);
	context.deleteShader(program.vertex);
	context.deleteShader(program.fragment);
}

interface IPartialModelResources {
	readonly program?: WebGLProgram | null;
	readonly vertex?: WebGLShader | null;
	readonly fragment?: WebGLShader | null;
	readonly buffers?: readonly WebGLBuffer[];
	readonly textures?: readonly WebGLTexture[];
}

function releasePartialResources(
	context: WebGLRenderingContext,
	resources: IPartialModelResources,
): void {
	for (const buffer of resources.buffers ?? []) context.deleteBuffer(buffer);
	for (const texture of resources.textures ?? []) context.deleteTexture(texture);
	if (resources.program) context.deleteProgram(resources.program);
	if (resources.vertex) context.deleteShader(resources.vertex);
	if (resources.fragment) context.deleteShader(resources.fragment);
}

/** WebGL 1 renderer for static, texture-backed glTF 2.0 primitives. */
export class GltfModelRenderer {
	private _program: IModelProgram | null = null;
	private _contextLost = false;
	private _destroyed = false;

	constructor(private readonly canvas: HTMLCanvasElement) {
		canvas.addEventListener('webglcontextlost', this.onContextLost);
		canvas.addEventListener('webglcontextrestored', this.onContextRestored);
	}

	private readonly onContextLost = (event: Event): void => {
		event.preventDefault();
		this._contextLost = true;
		this._program = null;
	};

	private readonly onContextRestored = (): void => {
		this._contextLost = false;
		this._program = null;
	};

	public render(model: IGltfModelData, frame: IGltfModelFrame): boolean {
		if (this._destroyed || this._contextLost) return false;
		const size = this.resize();
		const gpu = this.getProgram(model);
		if (!gpu || gpu.context.isContextLost?.()) return false;
		const { context } = gpu;
		const quaternion = this.normalizedRotation(frame.rotation);
		context.viewport(0, 0, size, size);
		context.clearColor(0, 0, 0, 0);
		context.clearDepth(1);
		context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
		context.enable(context.DEPTH_TEST);
		context.depthFunc(context.LEQUAL);
		context.disable(context.CULL_FACE);
		context.disable(context.BLEND);
		context.useProgram(gpu.program);
		context.uniform4f(gpu.rotation, quaternion[0], quaternion[1], quaternion[2], quaternion[3]);
		context.uniform3f(gpu.center, model.center[0], model.center[1], model.center[2]);
		context.uniform1f(gpu.scale, model.scale);
		context.uniformMatrix4fv(gpu.projection, false, perspectiveProjection({
			fovRadians: Math.PI / 4.8,
			aspect: 1,
			near: 0.1,
			far: 20,
		}));
		context.activeTexture(context.TEXTURE0);
		context.bindTexture(context.TEXTURE_2D, gpu.diffuse);
		context.activeTexture(context.TEXTURE1);
		context.bindTexture(context.TEXTURE_2D, gpu.normal);
		context.activeTexture(context.TEXTURE2);
		context.bindTexture(context.TEXTURE_2D, gpu.arm);
		for (const primitive of gpu.primitives) {
			context.bindBuffer(context.ARRAY_BUFFER, primitive.positions);
			context.enableVertexAttribArray(gpu.position);
			context.vertexAttribPointer(gpu.position, 3, context.FLOAT, false, 0, 0);
			context.bindBuffer(context.ARRAY_BUFFER, primitive.normals);
			context.enableVertexAttribArray(gpu.normalAttribute);
			context.vertexAttribPointer(gpu.normalAttribute, 3, context.FLOAT, false, 0, 0);
			context.bindBuffer(context.ARRAY_BUFFER, primitive.uvs);
			context.enableVertexAttribArray(gpu.uv);
			context.vertexAttribPointer(gpu.uv, 2, context.FLOAT, false, 0, 0);
			context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, primitive.indices);
			context.drawElements(
				context.TRIANGLES,
				primitive.primitive.indices.length,
				context.UNSIGNED_SHORT,
				0,
			);
		}
		return true;
	}

	public destroy(): void {
		if (this._destroyed) return;
		this._destroyed = true;
		this.releaseProgram();
		this._contextLost = true;
		this.canvas.removeEventListener('webglcontextlost', this.onContextLost);
		this.canvas.removeEventListener('webglcontextrestored', this.onContextRestored);
	}

	private resize(): number {
		const rect = this.canvas.getBoundingClientRect();
		const cssSize = Math.max(
			128,
			Math.round(this.canvas.clientWidth || this.canvas.offsetWidth || rect.width || 480),
		);
		const scale = Math.min(Math.max(window.devicePixelRatio || 1, 1.5), 2.2);
		const size = Math.min(1536, Math.max(512, Math.round(cssSize * scale)));
		if (this.canvas.width !== size || this.canvas.height !== size) {
			this.canvas.width = size;
			this.canvas.height = size;
			this.releaseProgram();
		}
		return size;
	}

	private getProgram(model: IGltfModelData): IModelProgram | null {
		if (this._program?.model === model) return this._program;
		this.releaseProgram();
		const context = this.canvas.getContext('webgl', {
			alpha: true,
			antialias: true,
			premultipliedAlpha: false,
		});
		if (!context) return null;
		let vertex: WebGLShader | null = null;
		let fragment: WebGLShader | null = null;
		let program: WebGLProgram | null = null;
		const ownedBuffers: WebGLBuffer[] = [];
		const ownedTextures: WebGLTexture[] = [];
		const fail = (): null => {
			releasePartialResources(context, {
				program,
				vertex,
				fragment,
				buffers: ownedBuffers,
				textures: ownedTextures,
			});
			return null;
		};
		try {
			vertex = compileShader({ context, type: context.VERTEX_SHADER, source: GLTF_MODEL_SHADERS.vertex });
			fragment = compileShader({ context, type: context.FRAGMENT_SHADER, source: GLTF_MODEL_SHADERS.fragment });
			if (!vertex || !fragment) return fail();
			program = context.createProgram();
			if (!program) return fail();
			context.attachShader(program, vertex);
			context.attachShader(program, fragment);
			context.linkProgram(program);
			if (!context.getProgramParameter(program, context.LINK_STATUS)) {
				console.error('glTF WebGL program link failed:', context.getProgramInfoLog(program));
				return fail();
			}
			const position = context.getAttribLocation(program, 'position');
			const normalAttribute = context.getAttribLocation(program, 'normal');
			const uv = context.getAttribLocation(program, 'uv');
			const rotation = context.getUniformLocation(program, 'rotation');
			const center = context.getUniformLocation(program, 'modelCenter');
			const scale = context.getUniformLocation(program, 'modelScale');
			const projection = context.getUniformLocation(program, 'projection');
			const diffuseTexture = context.getUniformLocation(program, 'diffuseTexture');
			const normalTexture = context.getUniformLocation(program, 'normalTexture');
			const armTexture = context.getUniformLocation(program, 'armTexture');
			if (position < 0 || normalAttribute < 0 || uv < 0 || !rotation || !center || !scale || !projection || !diffuseTexture || !normalTexture || !armTexture)
				return fail();
			const primitiveBuffers: IPrimitiveBuffers[] = [];
			for (const primitive of model.primitives) {
				const positions = uploadBuffer({ context, data: primitive.positions, target: context.ARRAY_BUFFER });
				const normals = uploadBuffer({ context, data: primitive.normals, target: context.ARRAY_BUFFER });
				const uvs = uploadBuffer({ context, data: primitive.uvs, target: context.ARRAY_BUFFER });
				const indices = uploadBuffer({ context, data: primitive.indices, target: context.ELEMENT_ARRAY_BUFFER });
				for (const resource of [positions, normals, uvs, indices]) if (resource) ownedBuffers.push(resource);
				if (!positions || !normals || !uvs || !indices) return fail();
				primitiveBuffers.push({ positions, normals, uvs, indices, primitive });
			}
			const diffuse = uploadTexture(context, model.diffuse);
			const normal = uploadTexture(context, model.normal);
			const arm = uploadTexture(context, model.arm);
			for (const resource of [diffuse, normal, arm]) if (resource) ownedTextures.push(resource);
			if (primitiveBuffers.length === 0 || !diffuse || !normal || !arm) return fail();
			context.useProgram(program);
			context.uniform1i(diffuseTexture, 0);
			context.uniform1i(normalTexture, 1);
			context.uniform1i(armTexture, 2);
			this._program = {
				context,
				program,
				vertex,
				fragment,
				primitives: primitiveBuffers,
				diffuse,
				normal,
				arm,
				position,
				normalAttribute,
				uv,
				rotation,
				center,
				scale,
				projection,
				model,
			};
			return this._program;
		} catch (error) {
			console.error('glTF WebGL setup failed:', error);
			return fail();
		}
	}

	private normalizedRotation(rotation: IGltfModelFrame['rotation']): IGltfModelFrame['rotation'] {
		const length = Math.hypot(...rotation) || 1;
		return [rotation[0] / length, rotation[1] / length, rotation[2] / length, rotation[3] / length];
	}

	private releaseProgram(): void {
		if (this._program) releaseProgram(this._program);
		this._program = null;
	}
}
