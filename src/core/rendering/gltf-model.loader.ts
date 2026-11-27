export interface IGltfModelBounds {
	readonly min: readonly [number, number, number];
	readonly max: readonly [number, number, number];
	readonly center: readonly [number, number, number];
	readonly scale: number;
}

export interface IGltfModelPrimitive {
	readonly positions: Float32Array;
	readonly normals: Float32Array;
	readonly uvs: Float32Array;
	readonly indices: Uint16Array;
	readonly bounds: IGltfModelBounds;
}

export interface IGltfModelData {
	readonly primitives: readonly IGltfModelPrimitive[];
	readonly diffuse: HTMLImageElement;
	readonly normal: HTMLImageElement;
	readonly arm: HTMLImageElement;
	readonly source: string;
	readonly scale: number;
	readonly center: readonly [number, number, number];
}

interface IGltfAccessor {
	readonly bufferView: number;
	readonly byteOffset?: number;
	readonly componentType: number;
	readonly count: number;
	readonly type: 'SCALAR' | 'VEC2' | 'VEC3' | 'VEC4' | 'MAT4';
	readonly min?: readonly number[];
	readonly max?: readonly number[];
}

interface IGltfBufferView {
	readonly buffer: number;
	readonly byteOffset?: number;
	readonly byteLength: number;
	readonly byteStride?: number;
}

interface IGltfTextureReference {
	readonly index: number;
}

interface IGltfMaterial {
	readonly normalTexture?: IGltfTextureReference;
	readonly pbrMetallicRoughness?: {
		readonly baseColorTexture?: IGltfTextureReference;
		readonly metallicRoughnessTexture?: IGltfTextureReference;
	};
}

interface IGltfPrimitive {
	readonly attributes: Readonly<Record<string, number>>;
	readonly indices: number;
	readonly material?: number;
	readonly mode?: number;
}

interface IGltfDocument {
	readonly scene: number;
	readonly scenes: ReadonlyArray<{ readonly nodes: readonly number[] }>;
	readonly nodes: ReadonlyArray<{ readonly mesh?: number; readonly children?: readonly number[] }>;
	readonly meshes: ReadonlyArray<{ readonly primitives: readonly IGltfPrimitive[] }>;
	readonly materials: readonly IGltfMaterial[];
	readonly textures: ReadonlyArray<{ readonly source: number }>;
	readonly images: ReadonlyArray<{ readonly uri: string }>;
	readonly buffers: ReadonlyArray<{ readonly uri: string }>;
	readonly bufferViews: readonly IGltfBufferView[];
	readonly accessors: readonly IGltfAccessor[];
}

export interface IGltfLoadOptions {
	readonly fetcher?: typeof fetch;
	readonly imageLoader?: (url: string) => Promise<HTMLImageElement>;
}

const COMPONENT_COUNTS = {
	SCALAR: 1,
	VEC2: 2,
	VEC3: 3,
	VEC4: 4,
	MAT4: 16,
} as const;

function ensureOk(response: Response, source: string): Response {
	if (!response.ok) throw new Error(`Unable to load glTF resource ${source}: ${response.status}`);
	return response;
}

function imageFromUrl(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.decoding = 'async';
		image.onload = () => resolve(image);
		image.onerror = () => reject(new Error(`Unable to load glTF texture: ${url}`));
		image.src = url;
	});
}

function componentSize(componentType: number): number {
	if (componentType === 5123) return Uint16Array.BYTES_PER_ELEMENT;
	if (componentType === 5125) return Uint32Array.BYTES_PER_ELEMENT;
	if (componentType === 5126) return Float32Array.BYTES_PER_ELEMENT;
	throw new Error(`Unsupported glTF component type: ${componentType}`);
}

function readNumber(args: { view: DataView; componentType: number; offset: number }): number {
	if (args.componentType === 5123) return args.view.getUint16(args.offset, true);
	if (args.componentType === 5125) return args.view.getUint32(args.offset, true);
	return args.view.getFloat32(args.offset, true);
}

function decodeAccessor(args: {
	document: IGltfDocument;
	buffers: readonly ArrayBuffer[];
	index: number;
}): Float32Array | Uint16Array | Uint32Array {
	const { document, buffers, index } = args;
	const accessor = document.accessors[index];
	if (!accessor) throw new Error(`Missing glTF accessor ${index}`);
	const bufferView = document.bufferViews[accessor.bufferView];
	if (!bufferView) throw new Error(`Missing glTF buffer view ${accessor.bufferView}`);
	const buffer = buffers[bufferView.buffer];
	if (!buffer) throw new Error(`Missing glTF buffer ${bufferView.buffer}`);
	const components = COMPONENT_COUNTS[accessor.type];
	if (!components) throw new Error(`Unsupported glTF accessor type: ${accessor.type}`);
	const scalarSize = componentSize(accessor.componentType);
	const stride = bufferView.byteStride ?? scalarSize * components;
	const start = (bufferView.byteOffset ?? 0) + (accessor.byteOffset ?? 0);
	const viewStart = bufferView.byteOffset ?? 0;
	const viewEnd = viewStart + bufferView.byteLength;
	const dataEnd = start + Math.max(0, accessor.count - 1) * stride + scalarSize * components;
	if (stride < scalarSize * components || start < viewStart || dataEnd > viewEnd || dataEnd > buffer.byteLength)
		throw new Error(`glTF accessor ${index} exceeds its buffer view`);
	const values = new Array<number>(accessor.count * components);
	const view = new DataView(buffer);
	for (let item = 0; item < accessor.count; item += 1) {
		for (let component = 0; component < components; component += 1) {
			values[item * components + component] = readNumber({
				view,
				componentType: accessor.componentType,
				offset: start + item * stride + component * scalarSize,
			});
		}
	}
	if (accessor.componentType === 5126) return new Float32Array(values);
	if (accessor.componentType === 5123) return new Uint16Array(values);
	return new Uint32Array(values);
}

function boundsFor(positions: Float32Array): IGltfModelBounds {
	const min: [number, number, number] = [Infinity, Infinity, Infinity];
	const max: [number, number, number] = [-Infinity, -Infinity, -Infinity];
	for (let offset = 0; offset < positions.length; offset += 3) {
		for (let axis = 0; axis < 3; axis += 1) {
			const value = positions[offset + axis] ?? 0;
			if (value < (min[axis] ?? Infinity)) min[axis] = value;
			if (value > (max[axis] ?? -Infinity)) max[axis] = value;
		}
	}
	const center: [number, number, number] = [
		(min[0] + max[0]) / 2,
		(min[1] + max[1]) / 2,
		(min[2] + max[2]) / 2,
	];
	const longest = Math.max(max[0] - min[0], max[1] - min[1], max[2] - min[2]) || 1;
	return { min, max, center, scale: 1.9 / longest };
}

function meshIndices(document: IGltfDocument): number[] {
	const result: number[] = [];
	const visit = (nodeIndex: number): void => {
		const node = document.nodes[nodeIndex];
		if (!node) return;
		if (node.mesh !== undefined) result.push(node.mesh);
		for (const child of node.children ?? []) visit(child);
	};
	for (const root of document.scenes[document.scene]?.nodes ?? []) visit(root);
	return result;
}

function textureUrl(args: {
	document: IGltfDocument;
	baseUrl: URL;
	texture: IGltfTextureReference | undefined;
}): string | null {
	const { document, baseUrl, texture } = args;
	if (!texture) return null;
	const source = document.textures[texture.index]?.source;
	const image = source === undefined ? undefined : document.images[source];
	return image ? new URL(image.uri, baseUrl).toString() : null;
}

/** Loads a static glTF 2.0 model without introducing a 3D framework. */
export async function loadGltfModel(
	documentUrl: string,
	options: IGltfLoadOptions = {},
): Promise<IGltfModelData> {
	const fetcher = options.fetcher ?? fetch;
	const imageLoader = options.imageLoader ?? imageFromUrl;
	const source = new URL(documentUrl, globalThis.location?.href ?? 'http://localhost/');
	const document = (await ensureOk(
		await fetcher(source.toString()),
		documentUrl,
	).json()) as IGltfDocument;
	const buffers = await Promise.all(
		document.buffers.map(async (buffer) =>
			ensureOk(await fetcher(new URL(buffer.uri, source).toString()), buffer.uri).arrayBuffer(),
		),
	);
	const primitives: IGltfModelPrimitive[] = [];
	for (const meshIndex of meshIndices(document)) {
		const mesh = document.meshes[meshIndex];
		if (!mesh) continue;
		for (const primitive of mesh.primitives) {
			if (primitive.mode !== undefined && primitive.mode !== 4)
				throw new Error(`Unsupported glTF primitive mode in ${documentUrl}`);
			const positionIndex = primitive.attributes['POSITION'];
			const normalIndex = primitive.attributes['NORMAL'];
			const uvIndex = primitive.attributes['TEXCOORD_0'];
			if (positionIndex === undefined || normalIndex === undefined || uvIndex === undefined)
				throw new Error(`Incomplete glTF primitive in ${documentUrl}`);
			const positions = decodeAccessor({ document, buffers, index: positionIndex });
			const normals = decodeAccessor({ document, buffers, index: normalIndex });
			const uvs = decodeAccessor({ document, buffers, index: uvIndex });
			const rawIndices = decodeAccessor({ document, buffers, index: primitive.indices });
			if (!(positions instanceof Float32Array) || !(normals instanceof Float32Array) || !(uvs instanceof Float32Array))
				throw new Error(`Unsupported glTF attribute format in ${documentUrl}`);
			if (!(rawIndices instanceof Uint16Array || rawIndices instanceof Uint32Array))
				throw new Error(`Unsupported glTF index format in ${documentUrl}`);
			const vertexCount = positions.length / 3;
			if (positions.length === 0 || normals.length !== vertexCount * 3 || uvs.length !== vertexCount * 2 || rawIndices.length % 3 !== 0)
				throw new Error(`Inconsistent glTF primitive buffers in ${documentUrl}`);
			let highestIndex = 0;
			let invalidIndex = false;
			for (const value of rawIndices) {
				highestIndex = Math.max(highestIndex, value);
				if (value >= vertexCount) invalidIndex = true;
			}
			if (invalidIndex)
				throw new Error(`glTF index out of range in ${documentUrl}`);
			const indices = rawIndices instanceof Uint16Array ? rawIndices : highestIndex <= 0xffff ? Uint16Array.from(rawIndices) : rawIndices;
			if (!(indices instanceof Uint16Array))
				throw new Error(`glTF model ${documentUrl} requires 32-bit indices unsupported by WebGL 1`);
			primitives.push({ positions, normals, uvs, indices, bounds: boundsFor(positions) });
		}
	}
	if (primitives.length === 0) throw new Error(`No renderable mesh in glTF ${documentUrl}`);
	const firstMaterial = document.materials.find(Boolean);
	const pbr = firstMaterial?.pbrMetallicRoughness;
	const diffuseUrl = textureUrl({ document, baseUrl: source, texture: pbr?.baseColorTexture });
	const normalUrl = textureUrl({ document, baseUrl: source, texture: firstMaterial?.normalTexture });
	const armUrl = textureUrl({ document, baseUrl: source, texture: pbr?.metallicRoughnessTexture });
	if (!diffuseUrl || !normalUrl || !armUrl)
		throw new Error(`glTF model ${documentUrl} must provide diffuse, normal and ARM textures`);
	const [diffuse, normal, arm] = await Promise.all([
		imageLoader(diffuseUrl),
		imageLoader(normalUrl),
		imageLoader(armUrl),
	]);
	const bounds = primitives.map(({ bounds }) => bounds);
	const min = [0, 1, 2].map((axis) => Math.min(...bounds.map((item) => item.min[axis] ?? Infinity))) as [number, number, number];
	const max = [0, 1, 2].map((axis) => Math.max(...bounds.map((item) => item.max[axis] ?? -Infinity))) as [number, number, number];
	const center: [number, number, number] = [
		(min[0] + max[0]) / 2,
		(min[1] + max[1]) / 2,
		(min[2] + max[2]) / 2,
	];
	const longest = Math.max(max[0] - min[0], max[1] - min[1], max[2] - min[2]) || 1;
	return {
		primitives,
		diffuse,
		normal,
		arm,
		source: documentUrl,
		center,
		scale: 1.9 / longest,
	};
}
