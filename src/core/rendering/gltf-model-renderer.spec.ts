import { afterEach, describe, expect, it, vi } from 'vitest';
import { type IGltfModelData, loadGltfModel } from './gltf-model.loader';
import {
	destroyGltfRenderer,
	GltfModelRenderer,
	perspectiveProjection,
	renderGltfFrame,
} from './gltf-model.renderer';

interface IGltfFixture {
	readonly gltf: Record<string, unknown>;
	readonly binary: ArrayBuffer;
}

function syntheticGltf(options: { readonly useUint32?: boolean } = {}): IGltfFixture {
	const positions = new Float32Array([-1, 0, 0, 0, 1, 0, 1, 0, 0]);
	const normals = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1]);
	const uvs = new Float32Array([0, 0, 0.5, 1, 1, 0]);
	const indexBytes = new Uint8Array(options.useUint32
		? new Uint32Array([0, 1, 2]).buffer
		: new Uint16Array([0, 1, 2]).buffer);
	const views = [
		new Uint8Array(positions.buffer),
		new Uint8Array(normals.buffer),
		new Uint8Array(uvs.buffer),
		indexBytes,
	];
	const offsets: number[] = [];
	let byteLength = 0;
	for (const view of views) {
		byteLength = Math.ceil(byteLength / 4) * 4;
		offsets.push(byteLength);
		byteLength += view.byteLength;
	}
	const bytes = new Uint8Array(byteLength);
	views.forEach((view, index) => bytes.set(view, offsets[index] ?? 0));
	const gltf = {
		scene: 0,
		scenes: [{ nodes: [0] }],
		nodes: [{ mesh: 0 }],
		meshes: [{ primitives: [{ attributes: { POSITION: 0, NORMAL: 1, TEXCOORD_0: 2 }, indices: 3, material: 0 }] }],
		materials: [{
			normalTexture: { index: 0 },
			pbrMetallicRoughness: {
				baseColorTexture: { index: 1 },
				metallicRoughnessTexture: { index: 2 },
			},
		}],
		textures: [{ source: 0 }, { source: 1 }, { source: 2 }],
		images: [
			{ uri: 'textures/normal.jpg' },
			{ uri: 'textures/diffuse.jpg' },
			{ uri: 'textures/arm.jpg' },
		],
		buffers: [{ uri: 'mesh.bin', byteLength }],
		bufferViews: views.map((view, index) => ({
			buffer: 0,
			byteOffset: offsets[index],
			byteLength: view.byteLength,
		})),
		accessors: [
			{ bufferView: 0, componentType: 5126, count: 3, type: 'VEC3', min: [-1, 0, 0], max: [1, 1, 0] },
			{ bufferView: 1, componentType: 5126, count: 3, type: 'VEC3' },
			{ bufferView: 2, componentType: 5126, count: 3, type: 'VEC2' },
			{ bufferView: 3, componentType: options.useUint32 ? 5125 : 5123, count: 3, type: 'SCALAR' },
		],
	};
	return { gltf, binary: bytes.buffer };
}

function loaderOptions(fixture: IGltfFixture): {
	readonly fetcher: typeof fetch;
	readonly imageLoader: (url: string) => Promise<HTMLImageElement>;
	readonly images: string[];
} {
	const images: string[] = [];
	const fetcher = vi.fn(async (input: RequestInfo | URL) => {
		const url = String(input);
		return url.endsWith('.gltf')
			? new Response(JSON.stringify(fixture.gltf), { status: 200 })
			: new Response(fixture.binary, { status: 200 });
	}) as unknown as typeof fetch;
	const imageLoader = async (url: string): Promise<HTMLImageElement> => {
		images.push(url);
		return globalThis.document.createElement('img');
	};
	return { fetcher, imageLoader, images };
}

function fakeModel(): IGltfModelData {
	return {
		primitives: [{
			positions: new Float32Array([-1, 0, 0, 0, 1, 0, 1, 0, 0]),
			normals: new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1]),
			uvs: new Float32Array([0, 0, 0.5, 1, 1, 0]),
			indices: new Uint16Array([0, 1, 2]),
			bounds: {
				min: [-1, 0, 0],
				max: [1, 1, 0],
				center: [0, 0.5, 0],
				scale: 0.95,
			},
		}],
		diffuse: globalThis.document.createElement('img'),
		normal: globalThis.document.createElement('img'),
		arm: globalThis.document.createElement('img'),
		source: '/models/test.gltf',
		center: [0, 0.5, 0],
		scale: 0.95,
	};
}

interface IFakeWebGlOptions {
	readonly link?: boolean;
	readonly textureFailureAt?: number;
}

function fakeWebGl(options: IFakeWebGlOptions = {}): {
	readonly context: WebGLRenderingContext;
	readonly deletes: { shader: ReturnType<typeof vi.fn>; program: ReturnType<typeof vi.fn>; texture: ReturnType<typeof vi.fn>; buffer: ReturnType<typeof vi.fn> };
	readonly createBuffer: ReturnType<typeof vi.fn>;
	readonly createTexture: ReturnType<typeof vi.fn>;
	readonly drawElements: ReturnType<typeof vi.fn>;
} {
	let textureIndex = 0;
	const locations = new Map<string, WebGLUniformLocation>();
	const deletes = { shader: vi.fn(), program: vi.fn(), texture: vi.fn(), buffer: vi.fn() };
	const createBuffer = vi.fn(() => ({}));
	const createTexture = vi.fn(() => {
		textureIndex += 1;
		return textureIndex === options.textureFailureAt ? null : ({});
	});
	const drawElements = vi.fn();
	const context = {
		VERTEX_SHADER: 1,
		FRAGMENT_SHADER: 2,
		COMPILE_STATUS: 3,
		LINK_STATUS: 4,
		ARRAY_BUFFER: 5,
		ELEMENT_ARRAY_BUFFER: 6,
		STATIC_DRAW: 7,
		FLOAT: 8,
		TEXTURE_2D: 9,
		TEXTURE0: 10,
		TEXTURE1: 11,
		TEXTURE2: 12,
		UNPACK_FLIP_Y_WEBGL: 13,
		RGBA: 14,
		UNSIGNED_BYTE: 15,
		TEXTURE_WRAP_S: 16,
		TEXTURE_WRAP_T: 17,
		REPEAT: 18,
		TEXTURE_MIN_FILTER: 19,
		TEXTURE_MAG_FILTER: 20,
		LINEAR_MIPMAP_LINEAR: 21,
		LINEAR: 22,
		COLOR_BUFFER_BIT: 32,
		DEPTH_BUFFER_BIT: 64,
		DEPTH_TEST: 23,
		LEQUAL: 24,
		CULL_FACE: 25,
		BLEND: 26,
		TRIANGLES: 27,
		UNSIGNED_SHORT: 28,
		createShader: vi.fn(() => ({})),
		shaderSource: vi.fn(),
		compileShader: vi.fn(),
		getShaderParameter: vi.fn(() => true),
		getShaderInfoLog: vi.fn(() => ''),
		createProgram: vi.fn(() => ({})),
		attachShader: vi.fn(),
		linkProgram: vi.fn(),
		getProgramParameter: vi.fn(() => options.link !== false),
		getProgramInfoLog: vi.fn(() => 'link failed'),
		getAttribLocation: vi.fn((_program: WebGLProgram, name: string) => ({ position: 0, normal: 1, uv: 2 }[name] ?? -1)),
		getUniformLocation: vi.fn((_program: WebGLProgram, name: string) => {
			if (!locations.has(name)) locations.set(name, {});
			return locations.get(name) ?? null;
		}),
		createBuffer,
		createTexture,
		bindBuffer: vi.fn(),
		bufferData: vi.fn(),
		bindTexture: vi.fn(),
		pixelStorei: vi.fn(),
		texImage2D: vi.fn(),
		texParameteri: vi.fn(),
		generateMipmap: vi.fn(),
		useProgram: vi.fn(),
		uniform1i: vi.fn(),
		uniform1f: vi.fn(),
		uniform3f: vi.fn(),
		uniform4f: vi.fn(),
		uniformMatrix4fv: vi.fn(),
		viewport: vi.fn(),
		clearColor: vi.fn(),
		clearDepth: vi.fn(),
		clear: vi.fn(),
		enable: vi.fn(),
		disable: vi.fn(),
		depthFunc: vi.fn(),
		activeTexture: vi.fn(),
		enableVertexAttribArray: vi.fn(),
		vertexAttribPointer: vi.fn(),
		drawElements,
		isContextLost: vi.fn(() => false),
		deleteShader: deletes.shader,
		deleteProgram: deletes.program,
		deleteTexture: deletes.texture,
		deleteBuffer: deletes.buffer,
	} as unknown as WebGLRenderingContext;
	return { context, deletes, createBuffer, createTexture, drawElements };
}

function canvasWithContext(context: WebGLRenderingContext): HTMLCanvasElement {
	const canvas = globalThis.document.createElement('canvas');
	Object.defineProperty(canvas, 'clientWidth', { configurable: true, value: 320 });
	canvas.getContext = vi.fn(() => context) as unknown as typeof canvas.getContext;
	return canvas;
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('loadGltfModel', () => {
	it('decodes interleaved-independent accessors, bounds and all PBR texture URLs', async () => {
		const fixture = syntheticGltf();
		const options = loaderOptions(fixture);
		const model = await loadGltfModel('https://assets.example/models/sample.gltf', options);

		expect(model.primitives).toHaveLength(1);
		expect(model.primitives[0]?.positions).toEqual(new Float32Array([-1, 0, 0, 0, 1, 0, 1, 0, 0]));
		expect(model.primitives[0]?.indices).toEqual(new Uint16Array([0, 1, 2]));
		expect(model.center).toEqual([0, 0.5, 0]);
		expect(model.scale).toBeCloseTo(0.95);
		expect(options.images).toEqual([
			'https://assets.example/models/textures/diffuse.jpg',
			'https://assets.example/models/textures/normal.jpg',
			'https://assets.example/models/textures/arm.jpg',
		]);
	});

	it('converts safe uint32 indices to WebGL 1 uint16 indices', async () => {
		const model = await loadGltfModel(
			'https://assets.example/models/sample.gltf',
			loaderOptions(syntheticGltf({ useUint32: true })),
		);
		expect(model.primitives[0]?.indices).toBeInstanceOf(Uint16Array);
		expect(Array.from(model.primitives[0]?.indices ?? [])).toEqual([0, 1, 2]);
	});

	it('rejects incomplete primitives and out-of-range indices', async () => {
		const incomplete = syntheticGltf();
		const primitive = (incomplete.gltf['meshes'] as Array<{ primitives: Array<{ attributes: Record<string, number> }> }>)[0]?.primitives[0];
		if (primitive) delete primitive.attributes['NORMAL'];
		await expect(loadGltfModel(
			'https://assets.example/models/incomplete.gltf',
			loaderOptions(incomplete),
		)).rejects.toThrow('Incomplete glTF primitive');

		const invalidIndex = syntheticGltf({ useUint32: true });
		new DataView(invalidIndex.binary).setUint32(96, 3, true);
		await expect(loadGltfModel(
			'https://assets.example/models/invalid-index.gltf',
			loaderOptions(invalidIndex),
		)).rejects.toThrow('index out of range');
	});
});

describe('GltfModelRenderer', () => {
	it('produces a finite perspective matrix', () => {
		const projection = perspectiveProjection({ fovRadians: Math.PI / 3, aspect: 16 / 9, near: 0.1, far: 100 });
		expect(Array.from(projection).every(Number.isFinite)).toBe(true);
		expect(projection[0]).toBeCloseTo((1 / Math.tan(Math.PI / 6)) / (16 / 9));
		expect(projection[5]).toBeCloseTo(1 / Math.tan(Math.PI / 6));
		expect(projection[11]).toBe(-1);
	});

	it('uploads one complete mesh and releases every resource idempotently', () => {
		const fake = fakeWebGl();
		const canvas = canvasWithContext(fake.context);
		const renderer = new GltfModelRenderer(canvas);
		const removeListener = vi.spyOn(canvas, 'removeEventListener');

		expect(renderer.render(fakeModel(), { rotation: [0, 0, 0, 1] })).toBe(true);
		expect(fake.createBuffer).toHaveBeenCalledTimes(4);
		expect(fake.createTexture).toHaveBeenCalledTimes(3);
		expect(fake.drawElements).toHaveBeenCalledTimes(1);

		renderer.destroy();
		renderer.destroy();
		expect(fake.deletes.buffer).toHaveBeenCalledTimes(4);
		expect(fake.deletes.texture).toHaveBeenCalledTimes(3);
		expect(fake.deletes.program).toHaveBeenCalledTimes(1);
		expect(fake.deletes.shader).toHaveBeenCalledTimes(2);
		expect(removeListener).toHaveBeenCalledTimes(2);
		expect(renderer.render(fakeModel(), { rotation: [0, 0, 0, 1] })).toBe(false);
	});

	it('releases a partial setup if texture upload fails', () => {
		const fake = fakeWebGl({ textureFailureAt: 2 });
		const canvas = canvasWithContext(fake.context);
		const renderer = new GltfModelRenderer(canvas);

		expect(renderer.render(fakeModel(), { rotation: [0, 0, 0, 1] })).toBe(false);
		expect(fake.deletes.buffer).toHaveBeenCalledTimes(4);
		expect(fake.deletes.texture).toHaveBeenCalledTimes(2);
		expect(fake.deletes.program).toHaveBeenCalledTimes(1);
		expect(fake.deletes.shader).toHaveBeenCalledTimes(2);
		renderer.destroy();
		expect(fake.deletes.program).toHaveBeenCalledTimes(1);
	});

	it('rebuilds after context restoration and removes the canvas renderer on destroy', () => {
		const fake = fakeWebGl();
		const canvas = canvasWithContext(fake.context);
		const model = fakeModel();
		expect(renderGltfFrame({ canvas, model, frame: { rotation: [0, 0, 0, 1] } })).toBe(true);
		const lost = new Event('webglcontextlost', { cancelable: true });
		canvas.dispatchEvent(lost);
		expect(lost.defaultPrevented).toBe(true);
		expect(renderGltfFrame({ canvas, model, frame: { rotation: [0, 0, 0, 1] } })).toBe(false);
		canvas.dispatchEvent(new Event('webglcontextrestored'));
		expect(renderGltfFrame({ canvas, model, frame: { rotation: [0, 0, 0, 1] } })).toBe(true);
		destroyGltfRenderer(canvas);
		destroyGltfRenderer(canvas);
		expect(canvas.getContext).toHaveBeenCalledTimes(2);
		expect(fake.deletes.buffer).toHaveBeenCalledTimes(4);
	});
});
