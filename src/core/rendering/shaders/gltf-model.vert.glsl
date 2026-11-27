precision highp float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform vec4 rotation;
uniform vec3 modelCenter;
uniform float modelScale;
uniform mat4 projection;

varying vec2 textureUv;
varying vec3 viewNormal;
varying vec3 viewPosition;

vec3 rotateByQuaternion(vec3 point, vec4 quaternion) {
  vec3 axis = quaternion.xyz;
  vec3 twice = cross(axis, point);
  return point + twice * (2.0 * quaternion.w) + cross(axis, twice) * 2.0;
}

void main() {
  vec3 centered = (position - modelCenter) * modelScale;
  vec3 rotated = rotateByQuaternion(centered, rotation);
  vec3 normalRotated = rotateByQuaternion(normal, rotation);
  viewPosition = vec3(rotated.x, rotated.y, rotated.z - 3.4);
  viewNormal = normalize(normalRotated);
  textureUv = uv;
  gl_Position = projection * vec4(viewPosition, 1.0);
}
