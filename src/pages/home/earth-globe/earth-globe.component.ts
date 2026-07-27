import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
	type AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	type ElementRef,
	inject,
	input,
	type OnDestroy,
	PLATFORM_ID,
	signal,
	viewChild,
} from '@angular/core';
import { renderEarthFrame } from '../../../core/rendering/earth-globe-renderer';
import type { IEarthDepth } from '../../../domain/types';

@Component({
	selector: 'app-earth-globe',
	templateUrl: './earth-globe.component.html',
	styleUrl: './earth-globe.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'(pointerdown)': 'beginDrag($event)',
		'(pointermove)': 'rotateFromDrag($event)',
		'(pointerup)': 'endDrag($event)',
		'(pointercancel)': 'endDrag($event)',
	},
})
export class EarthGlobeComponent implements AfterViewInit, OnDestroy {
	readonly depth = input.required<IEarthDepth>();
	private readonly _document = inject(DOCUMENT);
	private readonly _platformId = inject(PLATFORM_ID);
	private _canvas?: HTMLCanvasElement;
	private _texture?: HTMLCanvasElement;
	private _frame?: number;
	private _lastAt?: number;
	private _angle = 0;
	private _loading = false;
	private _spinning = false;
	private _drag?: {
		pointerId: number;
		x: number;
		y: number;
		at: number;
	};
	readonly active = signal(false);
	private readonly _motion = {
		speed: 0.00016,
		targetSpeed: 0.00016,
		axisX: 0.13,
		axisY: -0.95,
		axisZ: 0.28,
		targetAxisX: 0.13,
		targetAxisY: -0.95,
		targetAxisZ: 0.28,
	};
	readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

	ngAfterViewInit(): void {
		this._canvas = this.canvasRef()?.nativeElement;
		if (this._canvas) this._prepare();
	}
	start(): void {
		if (!isPlatformBrowser(this._platformId)) return;
		this._spinning = true;
		this.active.set(true);
		this._prepare();
		if (this._texture && this._frame === undefined)
			this._animate(performance.now());
	}
	stop(): void {
		this._spinning = false;
		this.active.set(false);
		if (this._frame !== undefined) cancelAnimationFrame(this._frame);
		this._frame = undefined;
		this._lastAt = undefined;
	}
	changeMotion(): void {
		const direction = this._motion.targetSpeed >= 0 ? -1 : 1;
		this._motion.targetSpeed =
			direction * (0.00014 + Math.random() * 0.00032);
		this._motion.targetAxisX = -0.78 + Math.random() * 1.56;
		this._motion.targetAxisY = -0.84 + Math.random() * 1.68;
		this._motion.targetAxisZ = -0.68 + Math.random() * 1.36;
		this.start();
	}

	beginDrag(event: PointerEvent): void {
		if (!this._isInteractive()) return;
		event.preventDefault();
		event.stopPropagation();
		this._drag = {
			pointerId: event.pointerId,
			x: event.clientX,
			y: event.clientY,
			at: event.timeStamp,
		};
		const host = event.currentTarget;
		if (host instanceof HTMLElement)
			host.setPointerCapture(event.pointerId);
		this.start();
	}

	rotateFromDrag(event: PointerEvent): void {
		if (!this._drag || event.pointerId !== this._drag.pointerId) return;
		event.preventDefault();
		event.stopPropagation();
		const deltaX = event.clientX - this._drag.x;
		const deltaY = event.clientY - this._drag.y;
		const distance = Math.hypot(deltaX, deltaY);
		if (distance < 0.5) return;
		const elapsed = Math.max(8, event.timeStamp - this._drag.at);
		const dominant =
			Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : -deltaY;
		const direction = Math.sign(dominant) || 1;
		const intensity = Math.min(
			0.0028,
			Math.max(0.00018, (distance / elapsed) * 0.012)
		);
		this._motion.targetSpeed = direction * intensity;
		this._motion.targetAxisX = this._clamp({
			value: -deltaY / distance,
			min: -0.88,
			max: 0.88,
		});
		this._motion.targetAxisY = this._clamp({
			value: deltaX / distance,
			min: -0.96,
			max: 0.96,
		});
		this._motion.targetAxisZ = this._clamp({
			value: (deltaX + deltaY) / distance / 2,
			min: -0.62,
			max: 0.62,
		});
		this._drag = {
			pointerId: event.pointerId,
			x: event.clientX,
			y: event.clientY,
			at: event.timeStamp,
		};
		this.start();
	}

	endDrag(event: PointerEvent): void {
		if (!this._drag || event.pointerId !== this._drag.pointerId) return;
		event.preventDefault();
		event.stopPropagation();
		const host = event.currentTarget;
		if (
			host instanceof HTMLElement &&
			host.hasPointerCapture(event.pointerId)
		)
			host.releasePointerCapture(event.pointerId);
		this._drag = undefined;
	}

	ngOnDestroy(): void {
		this.stop();
	}
	private _prepare(): void {
		if (
			!isPlatformBrowser(this._platformId) ||
			this._texture ||
			this._loading
		)
			return;
		this._loading = true;
		const image = new Image();
		image.src = '/images/cartagonova-earth-texture-hd.png';
		image.onload = () => {
			const source = this._document.createElement('canvas');
			source.width = 2048;
			source.height = 1024;
			const context = source.getContext('2d');
			if (!context) return;
			context.imageSmoothingEnabled = true;
			context.imageSmoothingQuality = 'high';
			context.drawImage(image, 0, 0, source.width, source.height);
			this._texture = source;
			this._loading = false;
			if (this._spinning && this._frame === undefined)
				this._animate(performance.now());
		};
		image.onerror = () => {
			this._loading = false;
		};
	}
	private _animate(now: number): void {
		if (!this._spinning) {
			this._frame = undefined;
			return;
		}
		const delta = Math.min(48, now - (this._lastAt ?? now));
		this._lastAt = now;
		const blend = 1 - Math.exp(-delta / 620);
		this._motion.speed +=
			(this._motion.targetSpeed - this._motion.speed) * blend;
		this._motion.axisX +=
			(this._motion.targetAxisX - this._motion.axisX) * blend;
		this._motion.axisY +=
			(this._motion.targetAxisY - this._motion.axisY) * blend;
		this._motion.axisZ +=
			(this._motion.targetAxisZ - this._motion.axisZ) * blend;
		const length = Math.hypot(
			this._motion.axisX,
			this._motion.axisY,
			this._motion.axisZ
		);
		this._motion.axisX /= length;
		this._motion.axisY /= length;
		this._motion.axisZ /= length;
		this._angle += this._motion.speed * delta;
		if (this._canvas && this._texture)
			renderEarthFrame({
				canvas: this._canvas,
				image: this._texture,
				frame: {
					angle: this._angle,
					axisX: this._motion.axisX,
					axisY: this._motion.axisY,
					axisZ: this._motion.axisZ,
					foreground: ['front-ready', 'front', 'out-front'].includes(
						this.depth()
					),
				},
			});
		this._frame = requestAnimationFrame((time) => this._animate(time));
	}

	private _isInteractive(): boolean {
		return isPlatformBrowser(this._platformId) && this.depth() === 'front';
	}

	private _clamp(range: { value: number; min: number; max: number }): number {
		return Math.min(range.max, Math.max(range.min, range.value));
	}
}
