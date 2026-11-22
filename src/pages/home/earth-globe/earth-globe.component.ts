import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
	type AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	effect,
	type ElementRef,
	inject,
	input,
	type OnDestroy,
	PLATFORM_ID,
	signal,
	viewChild,
} from '@angular/core';
import { renderEarthFrame } from '../../../core/rendering/earth-globe-renderer';
import type { IEarthDepth, IEarthTextureStyle } from '../../../domain/types';

type IQuaternion = readonly [x: number, y: number, z: number, w: number];

const DEFAULT_IDLE_SPEED = 0.00016;
const MAX_ANGULAR_SPEED = 0.0038;
const TEXTURE_WIDTH = 4096;
const TEXTURE_HEIGHT = 2048;

function quaternionFromAxis(
	axis: readonly [x: number, y: number, z: number],
	angle: number
): IQuaternion {
	const half = angle / 2;
	const sine = Math.sin(half);
	return [axis[0] * sine, axis[1] * sine, axis[2] * sine, Math.cos(half)];
}

function multiplyQuaternion(left: IQuaternion, right: IQuaternion): IQuaternion {
	const [lx, ly, lz, lw] = left;
	const [rx, ry, rz, rw] = right;
	return [
		lw * rx + lx * rw + ly * rz - lz * ry,
		lw * ry - lx * rz + ly * rw + lz * rx,
		lw * rz + lx * ry - ly * rx + lz * rw,
		lw * rw - lx * rx - ly * ry - lz * rz,
	];
}

function normalizeQuaternion(value: IQuaternion): IQuaternion {
	const length = Math.hypot(...value) || 1;
	return [value[0] / length, value[1] / length, value[2] / length, value[3] / length];
}

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
	readonly preview = input(false);
	readonly textureStyle = input<IEarthTextureStyle>('natural');
	private readonly _document = inject(DOCUMENT);
	private readonly _platformId = inject(PLATFORM_ID);
	private _canvas?: HTMLCanvasElement;
	private _texture?: HTMLCanvasElement;
	private _frame?: number;
	private _lastAt?: number;
	private _loading = false;
	private _spinning = false;
	private _idleSpeed = DEFAULT_IDLE_SPEED;
	private _rotation: IQuaternion = [0, 0, 0, 1];
	private _angularVelocity = { x: 0, y: DEFAULT_IDLE_SPEED };
	private _drag?: {
		pointerId: number;
		x: number;
		y: number;
		at: number;
		radius: number;
	};
	readonly active = signal(false);
	readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
	private readonly _depthSync = effect(() => {
		if (this.depth() === 'front-ready' || this.depth() === 'front' || this.preview())
			this.start();
		if ((this.depth() === 'behind-ready' || this.depth() === 'behind') && !this.preview())
			this.stop();
	});

	ngAfterViewInit(): void {
		this._canvas = this.canvasRef()?.nativeElement;
		if (this._spinning) this.start();
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
		const direction = this._idleSpeed >= 0 ? -1 : 1;
		this._idleSpeed = direction * (0.00013 + Math.random() * 0.0002);
		this._angularVelocity.x += -0.00015 + Math.random() * 0.0003;
		this._angularVelocity.y = this._clampVelocity({
			value: this._angularVelocity.y * 0.45 + this._idleSpeed * 0.55,
		});
		if (this.depth() === 'front') this.start();
	}

	beginDrag(event: PointerEvent): void {
		if (!this._isInteractive()) return;
		event.preventDefault();
		event.stopPropagation();
		const host = event.currentTarget;
		if (!(host instanceof HTMLElement)) return;
		this._drag = {
			pointerId: event.pointerId,
			x: event.clientX,
			y: event.clientY,
			at: event.timeStamp,
			radius: Math.max(120, host.getBoundingClientRect().width / 2),
		};
		host.setPointerCapture(event.pointerId);
		this.start();
	}

	rotateFromDrag(event: PointerEvent): void {
		if (!this._drag || event.pointerId !== this._drag.pointerId) return;
		event.preventDefault();
		event.stopPropagation();
		const deltaX = event.clientX - this._drag.x;
		const deltaY = event.clientY - this._drag.y;
		if (Math.hypot(deltaX, deltaY) < 0.25) return;
		const elapsed = Math.max(6, event.timeStamp - this._drag.at);
		const yaw = deltaX / this._drag.radius;
		const pitch = -deltaY / this._drag.radius;
		const immediateX = this._clampVelocity({ value: pitch / elapsed });
		const immediateY = this._clampVelocity({ value: yaw / elapsed });
		this._angularVelocity.x = this._angularVelocity.x * 0.32 + immediateX * 0.68;
		this._angularVelocity.y = this._angularVelocity.y * 0.32 + immediateY * 0.68;
		const rotationDelta = multiplyQuaternion(
			quaternionFromAxis([1, 0, 0], pitch),
			quaternionFromAxis([0, 1, 0], yaw)
		);
		this._rotation = normalizeQuaternion(multiplyQuaternion(rotationDelta, this._rotation));
		this._drag.x = event.clientX;
		this._drag.y = event.clientY;
		this._drag.at = event.timeStamp;
		this.start();
	}

	endDrag(event: PointerEvent): void {
		if (!this._drag || event.pointerId !== this._drag.pointerId) return;
		event.preventDefault();
		event.stopPropagation();
		const host = event.currentTarget;
		if (host instanceof HTMLElement && host.hasPointerCapture(event.pointerId))
			host.releasePointerCapture(event.pointerId);
		if (event.timeStamp - this._drag.at > 90) {
			this._angularVelocity.x = 0;
			this._angularVelocity.y = this._idleSpeed;
		}
		this._drag = undefined;
	}

	ngOnDestroy(): void {
		this.stop();
		this._depthSync.destroy();
	}

	private _prepare(): void {
		if (!isPlatformBrowser(this._platformId) || this._texture || this._loading)
			return;
		this._loading = true;
		const image = new Image();
		image.decoding = 'async';
		image.src = '/images/earth-blue-marble-4k.webp';
		image.onload = () => {
			const source = this._document.createElement('canvas');
			source.width = TEXTURE_WIDTH;
			source.height = TEXTURE_HEIGHT;
			const context = source.getContext('2d');
			if (!context) {
				this._loading = false;
				return;
			}
			context.imageSmoothingEnabled = true;
			context.imageSmoothingQuality = 'high';
			context.drawImage(image, 0, 0, source.width, source.height);
			this._texture = source;
			this._loading = false;
			if (this._spinning && this._frame === undefined)
				this._animate(performance.now());
		};
		image.onerror = () => {
			if (image.src.endsWith('earth-blue-marble-4k.webp')) {
				image.src = '/images/cartagonova-earth-texture-hd.png';
				return;
			}
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
		if (!this._drag) {
			this._angularVelocity.x *= Math.exp(-delta / 820);
			this._angularVelocity.y +=
				(this._idleSpeed - this._angularVelocity.y) *
				(1 - Math.exp(-delta / 1900));
			const rotationDelta = multiplyQuaternion(
				quaternionFromAxis([1, 0, 0], this._angularVelocity.x * delta),
				quaternionFromAxis([0, 1, 0], this._angularVelocity.y * delta)
			);
			this._rotation = normalizeQuaternion(multiplyQuaternion(rotationDelta, this._rotation));
		}
		if (this._canvas && this._texture)
			renderEarthFrame({
				canvas: this._canvas,
				image: this._texture,
				frame: {
					angle: 0,
					axisX: 0,
					axisY: 1,
					axisZ: 0,
					rotation: this._rotation,
					textureStyle: this.textureStyle(),
					foreground: ['front-ready', 'front', 'out-front'].includes(this.depth()),
				},
			});
		this._frame = requestAnimationFrame((time) => this._animate(time));
	}

	private _isInteractive(): boolean {
		return isPlatformBrowser(this._platformId) && this.depth() === 'front';
	}

	private _clampVelocity(range: { value: number }): number {
		return Math.min(MAX_ANGULAR_SPEED, Math.max(-MAX_ANGULAR_SPEED, range.value));
	}
}
