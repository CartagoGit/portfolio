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
  vec2 scenePoint = uv * 2.0 - 1.0;
  scenePoint.y = -scenePoint.y;

  bool isSaturn = textureEffect == 5;
  float sphereRadius = isSaturn ? 0.67 : 1.0;
  if (isSaturn) scenePoint *= 1.45;

  vec2 shapeScale = vec2(1.0);
  if (textureEffect == 6) shapeScale = vec2(0.72, 1.0); // prolate rugby ball
  if (textureEffect == 7) shapeScale = vec2(0.97, 1.02); // Pluto's irregular footprint

  vec2 point = scenePoint / sphereRadius / shapeScale;
  float radiusSquared = dot(point, point);
  bool sphereHit = radiusSquared <= 1.002;
  vec4 result = vec4(0.0);

  float sphereFrontZ = 0.0;
  if (sphereHit) {
    float surfaceZ = sqrt(max(0.0, 1.0 - radiusSquared));
    sphereFrontZ = sphereRadius * surfaceZ;
    vec3 surface = vec3(point, surfaceZ);
    vec3 orientedSurface = surface;
    if (isSaturn) {
      orientedSurface = rotateByQuaternion(surface, vec4(0.2474, 0.0, 0.0, 0.9689));
    }
    vec3 rotated = normalize(rotateByQuaternion(orientedSurface, rotation));
    float longitude = atan(rotated.x, rotated.z);
    float latitude = asin(clamp(-rotated.y, -1.0, 1.0));
    vec2 spherical = vec2(longitude / (2.0 * PI) + 0.5, 0.5 - latitude / PI);
    vec2 textureUv = vec2(fract(spherical.x), spherical.y);
    vec3 sampled = texture2D(earthTexture, textureUv).rgb;
    vec3 color = sampled;

    if (textureEffect == 8) {
      vec2 frontUv = vec2(0.5 + point.x * 0.5, 0.5 - point.y * 0.5);
      color = texture2D(earthTexture, clamp(frontUv, 0.001, 0.999)).rgb;
    } else if (textureEffect == 7) {
      vec2 heartPoint = (spherical - vec2(0.51, 0.46)) * vec2(2.8, 4.4);
      float heartMask = 1.0 - smoothstep(0.08, 0.42, length(heartPoint));
      color = mix(color, vec3(0.78, 0.76, 0.66), heartMask * 0.58);
    } else if (textureEffect == 10) {
      float equator = 1.0 - smoothstep(0.012, 0.042, abs(rotated.y));
      float meridian = 1.0 - smoothstep(0.012, 0.045, abs(rotated.x));
      float curve = 1.0 - smoothstep(0.012, 0.045, abs(rotated.x + 0.5 * rotated.z));
      color = mix(color, vec3(0.055, 0.024, 0.018), max(max(equator, meridian), curve));
    } else if (textureEffect == 11) {
      float seam = abs(rotated.y - 0.42 * sin(rotated.x * 3.0));
      color = mix(color, vec3(0.96, 0.94, 0.82), 1.0 - smoothstep(0.018, 0.05, seam));
    } else if (textureEffect == 12) {
      float dimple = smoothstep(0.09, 0.02, abs(fract(spherical.x * 34.0) - 0.5));
      dimple *= smoothstep(0.09, 0.02, abs(fract(spherical.y * 22.0) - 0.5));
      color *= 0.88 + dimple * 0.18;
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
    result = vec4(color, alpha);
  }

  if (isSaturn) {
    vec3 localNormal = normalize(rotateByQuaternion(
      vec3(0.0, 1.0, 0.0),
      vec4(0.2474, 0.0, 0.0, 0.9689)
    ));
    vec3 ringNormal = normalize(rotateByQuaternion(localNormal, rotation));
    float normalZ = ringNormal.z;
    if (abs(normalZ) > 0.025) {
      vec3 rayOrigin = vec3(scenePoint, 3.0);
      float travel = dot(ringNormal, rayOrigin) / normalZ;
      vec3 ringPoint = rayOrigin + vec3(0.0, 0.0, -travel);
      float radial = length(ringPoint);
      float innerRadius = 0.84;
      float outerRadius = 1.42;
      bool ringHit = radial >= innerRadius && radial <= outerRadius;
      if (ringHit) {
        float innerEdge = smoothstep(innerRadius, innerRadius + 0.025, radial);
        float outerEdge = 1.0 - smoothstep(outerRadius - 0.045, outerRadius, radial);
        float fineBand = 0.5 + 0.5 * sin(radial * 122.0 + sin(radial * 31.0));
        float broadBand = 0.5 + 0.5 * sin(radial * 29.0);
        float cassini = 1.0 - smoothstep(0.012, 0.038, abs(radial - 1.205));
        vec3 ringColor = mix(
          vec3(0.36, 0.29, 0.16),
          vec3(0.91, 0.82, 0.57),
          0.24 + fineBand * 0.46 + broadBand * 0.2
        );
        float ringLight = 0.68 + 0.32 * max(0.0, ringNormal.z);
        float ringAlpha = innerEdge * outerEdge * (0.42 + fineBand * 0.24) * (1.0 - cassini * 0.72);
        vec4 ring = vec4(ringColor * ringLight, ringAlpha);
        bool ringInFront = !sphereHit || ringPoint.z > sphereFrontZ + 0.002;
        if (ringInFront) {
          result.rgb = mix(result.rgb, ring.rgb, ring.a);
          result.a = max(result.a, ring.a);
        }
      }
    }
  }

  if (result.a < 0.01) discard;
  gl_FragColor = result;
}
