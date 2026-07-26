import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import type { ElementRef, OnDestroy } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { renderEarthFrame } from '../../../../core/portfolio/rendering/earth-globe-renderer';
import type { EarthDepth } from '../../../../domain/portfolio/portfolio.types';

@Component({
  selector: 'app-earth-globe',
  templateUrl: './earth-globe.component.html',
  styleUrl: './earth-globe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EarthGlobeComponent implements OnDestroy {
  readonly depth = input.required<EarthDepth>();
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private canvas?: HTMLCanvasElement;
  private texture?: HTMLCanvasElement;
  private frame?: number;
  private lastAt?: number;
  private angle = 0;
  private loading = false;
  private spinning = false;
  private readonly motion = {
    speed: 0.00016,
    targetSpeed: 0.00016,
    axisX: 0.13,
    axisY: -0.95,
    axisZ: 0.28,
    targetAxisX: 0.13,
    targetAxisY: -0.95,
    targetAxisZ: 0.28,
  };
  @ViewChild('canvas') set canvasRef(value: ElementRef<HTMLCanvasElement> | undefined) {
    this.canvas = value?.nativeElement;
    if (this.canvas) this.prepare();
  }
  start(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.spinning = true;
    this.prepare();
    if (this.texture && this.frame === undefined) this.animate(performance.now());
  }
  stop(): void {
    this.spinning = false;
    if (this.frame !== undefined) cancelAnimationFrame(this.frame);
    this.frame = undefined;
    this.lastAt = undefined;
  }
  changeMotion(): void {
    const direction = this.motion.targetSpeed >= 0 ? -1 : 1;
    this.motion.targetSpeed = direction * (0.00014 + Math.random() * 0.00032);
    this.motion.targetAxisX = -0.78 + Math.random() * 1.56;
    this.motion.targetAxisY = -0.84 + Math.random() * 1.68;
    this.motion.targetAxisZ = -0.68 + Math.random() * 1.36;
    this.start();
  }
  ngOnDestroy(): void {
    this.stop();
  }
  private prepare(): void {
    if (!isPlatformBrowser(this.platformId) || this.texture || this.loading) return;
    this.loading = true;
    const image = new Image();
    image.src = '/images/cartagonova-earth-texture-hd.png';
    image.onload = () => {
      const source = this.document.createElement('canvas');
      source.width = 2048;
      source.height = 1024;
      const context = source.getContext('2d');
      if (!context) return;
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(image, 0, 0, source.width, source.height);
      this.texture = source;
      this.loading = false;
      if (this.spinning && this.frame === undefined) this.animate(performance.now());
    };
    image.onerror = () => {
      this.loading = false;
    };
  }
  private animate(now: number): void {
    if (!this.spinning) {
      this.frame = undefined;
      return;
    }
    const delta = Math.min(48, now - (this.lastAt ?? now));
    this.lastAt = now;
    const blend = 1 - Math.exp(-delta / 620);
    this.motion.speed += (this.motion.targetSpeed - this.motion.speed) * blend;
    this.motion.axisX += (this.motion.targetAxisX - this.motion.axisX) * blend;
    this.motion.axisY += (this.motion.targetAxisY - this.motion.axisY) * blend;
    this.motion.axisZ += (this.motion.targetAxisZ - this.motion.axisZ) * blend;
    const length = Math.hypot(this.motion.axisX, this.motion.axisY, this.motion.axisZ);
    this.motion.axisX /= length;
    this.motion.axisY /= length;
    this.motion.axisZ /= length;
    this.angle += this.motion.speed * delta;
    if (this.canvas && this.texture)
      renderEarthFrame(this.canvas, this.texture, {
        angle: this.angle,
        axisX: this.motion.axisX,
        axisY: this.motion.axisY,
        axisZ: this.motion.axisZ,
        foreground: ['front-ready', 'front', 'out-front'].includes(this.depth()),
      });
    this.frame = requestAnimationFrame((time) => this.animate(time));
  }
}
