precision highp float;

uniform sampler2D diffuseTexture;
uniform sampler2D normalTexture;
uniform sampler2D armTexture;

varying vec2 textureUv;
varying vec3 viewNormal;
varying vec3 viewPosition;

void main() {
  vec3 base = texture2D(diffuseTexture, textureUv).rgb;
  vec3 detail = texture2D(normalTexture, textureUv).xyz * 2.0 - 1.0;
  vec3 material = texture2D(armTexture, textureUv).rgb;
  float roughness = clamp(material.g, 0.12, 0.98);
  float metallic = clamp(material.b, 0.0, 1.0);
  float occlusion = mix(0.72, 1.0, material.r);
  vec3 normal = normalize(viewNormal * 0.82 + detail * 0.18);
  vec3 light = normalize(vec3(-0.45, 0.78, 1.0));
  vec3 view = normalize(-viewPosition);
  vec3 halfVector = normalize(light + view);
  float diffuse = max(dot(normal, light), 0.0);
  float specular = pow(max(dot(normal, halfVector), 0.0), mix(96.0, 12.0, roughness));
  vec3 ambient = base * 0.28;
  vec3 direct = base * diffuse * mix(0.92, 0.62, metallic) * occlusion;
  vec3 highlight = mix(vec3(0.34), base, metallic) * specular * (0.12 + metallic * 0.74);
  gl_FragColor = vec4(ambient + direct + highlight, 1.0);
}
