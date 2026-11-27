import earthGlobeFragmentShader from './earth-globe.frag.glsl';
import earthGlobeVertexShader from './earth-globe.vert.glsl';
import gltfModelFragmentShader from './gltf-model.frag.glsl';
import gltfModelVertexShader from './gltf-model.vert.glsl';

export const EARTH_GLOBE_SHADERS = Object.freeze({
	fragment: earthGlobeFragmentShader,
	vertex: earthGlobeVertexShader,
});

export const GLTF_MODEL_SHADERS = Object.freeze({
	fragment: gltfModelFragmentShader,
	vertex: gltfModelVertexShader,
});
