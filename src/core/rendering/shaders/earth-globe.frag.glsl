precision highp float;

varying vec2 uv;

uniform sampler2D earthTexture;
uniform vec4 rotation;
uniform int textureEffect;

const float PI = 3.14159265359;

vec3 rotateByQuaternion(vec3 point, vec4 quaternion) {
  vec3 axis = quaternion.xyz;
  vec3 twice = cross(axis, point);
  return point + twice * (2.0 * quaternion.w) + cross(axis, twice) * 2.0;
}

vec3 terrainEffect(vec3 sampled) {
  float luminance = dot(sampled, vec3(0.2126, 0.7152, 0.0722));
  float land = smoothstep(0.27, 0.72, luminance);
  float elevation = clamp(
    luminance * 0.72 + (sampled.r - sampled.b) * 0.18 + (sampled.g - sampled.b) * 0.12,
    0.0,
    1.0
  );
  vec3 ocean = mix(vec3(0.012, 0.07, 0.19), vec3(0.04, 0.31, 0.48), elevation);
  vec3 ground = mix(vec3(0.05, 0.22, 0.14), vec3(0.42, 0.34, 0.19), smoothstep(0.34, 0.68, elevation));
  ground = mix(ground, vec3(0.84, 0.89, 0.86), smoothstep(0.72, 0.92, elevation));
  return mix(ocean, ground, land);
}

vec3 infraredEffect(vec3 sampled) {
  float luminance = dot(sampled, vec3(0.2126, 0.7152, 0.0722));
  vec3 cold = vec3(0.018, 0.16, 0.56);
  vec3 hot = vec3(0.94, 0.16, 0.045);
  return mix(cold, hot, smoothstep(0.12, 0.79, luminance))
    + vec3(0.16, 0.08, 0.0) * pow(luminance, 3.0);
}

void main() {
  vec2 point = uv * 2.0 - 1.0;
  point.y = -point.y;
  float radiusSquared = dot(point, point);
  if (radiusSquared > 1.002) discard;

  float surfaceZ = sqrt(max(0.0, 1.0 - radiusSquared));
  vec3 surface = vec3(point, surfaceZ);
  vec3 rotated = normalize(rotateByQuaternion(surface, rotation));
  float longitude = atan(rotated.x, rotated.z);
  float latitude = asin(clamp(-rotated.y, -1.0, 1.0));
  vec2 spherical = vec2(longitude / (2.0 * PI) + 0.5, 0.5 - latitude / PI);
  vec2 textureUv = vec2(fract(spherical.x), spherical.y);
  vec3 sampled = texture2D(earthTexture, textureUv).rgb;
  vec3 color = sampled;

  if (textureEffect == 2) {
    color = terrainEffect(sampled);
  } else if (textureEffect == 3) {
    color = infraredEffect(sampled);
  }

  float directional = max(0.0, -0.35 * point.x - 0.2 * point.y + 0.92 * surfaceZ);
  float light = 0.4 + 0.6 * directional;
  if (textureEffect == 4) {
    light = 0.9 + 0.1 * directional;
  }
  float rim = pow(1.0 - surfaceZ, 3.0) * 0.11;
  vec3 rimColor = textureEffect == 4
    ? vec3(0.98, 0.38, 0.03)
    : vec3(0.1, 0.48, 0.76);
  color = color * light + rimColor * rim;
  float alpha = 1.0 - smoothstep(0.985, 1.002, radiusSquared);
  gl_FragColor = vec4(color, alpha);
}
