/**
 * Canvas-only renderer for the interactive Earth. Keeping pixel work outside
 * the page component makes its lifecycle and rendering cadence independent.
 */
export interface EarthFrame {
  angle: number;
  axisX: number;
  axisY: number;
  axisZ: number;
  foreground: boolean;
}

export function renderEarthFrame(canvas: HTMLCanvasElement, texture: ImageData, frame: EarthFrame): void {
  const deviceScale = Math.min(window.devicePixelRatio || 1, 2.4);
  const size = Math.min(960, Math.max(640, Math.round((canvas.clientWidth || 300) * deviceScale * (frame.foreground ? 1.14 : 1))));
  if (canvas.width !== size || canvas.height !== size) {
    canvas.width = size;
    canvas.height = size;
  }

  const context = canvas.getContext('2d');
  if (!context) return;

  const output = context.createImageData(size, size);
  const radius = size / 2;
  const cosine = Math.cos(frame.angle);
  const sine = Math.sin(frame.angle);
  const { axisX, axisY, axisZ } = frame;
  const textureWidth = texture.width;
  const textureHeight = texture.height;

  for (let py = 0; py < size; py += 1) {
    const y = (py + .5 - radius) / radius;
    for (let px = 0; px < size; px += 1) {
      const x = (px + .5 - radius) / radius;
      const distance = x * x + y * y;
      const outputIndex = (py * size + px) * 4;
      if (distance > 1) continue;

      const z = Math.sqrt(1 - distance);
      const dot = axisX * x + axisY * y + axisZ * z;
      const crossX = axisY * z - axisZ * y;
      const crossY = axisZ * x - axisX * z;
      const crossZ = axisX * y - axisY * x;
      const rotatedX = x * cosine + crossX * sine + axisX * dot * (1 - cosine);
      const rotatedY = y * cosine + crossY * sine + axisY * dot * (1 - cosine);
      const rotatedZ = z * cosine + crossZ * sine + axisZ * dot * (1 - cosine);
      const longitude = Math.atan2(rotatedX, rotatedZ);
      const latitude = Math.asin(Math.max(-1, Math.min(1, -rotatedY)));
      const sourceX = Math.floor(((longitude / (Math.PI * 2) + .5) % 1) * textureWidth);
      const sourceY = Math.max(0, Math.min(textureHeight - 1, Math.floor((.5 - latitude / Math.PI) * textureHeight)));
      const sourceIndex = (sourceY * textureWidth + sourceX) * 4;
      const light = .34 + .66 * Math.max(0, -.35 * x - .2 * y + .92 * z);
      output.data[outputIndex] = texture.data[sourceIndex] * light;
      output.data[outputIndex + 1] = texture.data[sourceIndex + 1] * light;
      output.data[outputIndex + 2] = texture.data[sourceIndex + 2] * light;
      output.data[outputIndex + 3] = 255;
    }
  }

  context.putImageData(output, 0, 0);
}
