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

const TEXTURE_SOURCES: Readonly<Record<IEarthTextureStyle, string>> = {
	clouds: '/images/earth-clouds-4k.webp',
	natural: '/images/earth-blue-marble-4k.webp',
	night: '/images/globe/earth-night-4k.webp',
	terrain: '/images/globe/earth-topography-v2.webp',
	bathymetry: '/images/globe/earth-bathymetry-v2.webp',
	infrared: '/images/globe/earth-thermal-v2.webp',
	sun: '/images/globe/sun-4k.webp',
	moon: '/images/globe/moon-4k.webp',
	mercury: '/images/globe/mercury-4k.webp',
	venus: '/images/globe/venus-4k.webp',
	mars: '/images/globe/mars-4k.webp',
	jupiter: '/images/globe/jupiter-4k.webp',
	saturn: '/images/globe/saturn-4k.webp',
	uranus: '/images/globe/uranus-2k.webp',
	neptune: '/images/globe/neptune-2k.webp',
	pluto: '/images/globe/pluto-4k.webp',
	'kepler-186f': '/images/globe/kepler-186f-artist-v2.webp',
	'proxima-b': '/images/globe/proxima-b-artist-v2.webp',
	'trappist-1e': '/images/globe/trappist-1e-artist-v2.webp',
	soccer: '/images/globe/soccer-canonical-v2.webp',
	basketball: '/images/globe/basketball-canonical-v2.webp',
	tennis: '/images/globe/tennis-canonical-v2.webp',
	golf: '/images/globe/golf-canonical-v2.webp',
	'beach-ball': '/images/globe/beach-ball-canonical-v2.webp',
	disco: '/images/globe/disco-canonical-4k.webp',
	rugby: '/images/globe/rugby-canonical-v2.webp',
	volleyball: '/images/globe/volleyball-canonical-v2.webp',
	'cartago-mark': '/images/globe/cartago-mark-v2.webp',
	'cartago-banner': '/images/globe/cartago-banner-v2.webp',
	portrait: '/images/globe/cartago-portrait-4k.webp',
};

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
	readonly textureStyle = input<IEarthTextureStyle>('clouds');
	private readonly _document = inject(DOCUMENT);
	private readonly _platformId = inject(PLATFORM_ID);
	private _canvas?: HTMLCanvasElement;
	private _texture?: HTMLCanvasElement;
	private readonly _textures = new Map<IEarthTextureStyle, HTMLCanvasElement>();
	private readonly _loadingTextures = new Set<IEarthTextureStyle>();
	private _destroyed = false;
	private _frame?: number;
	private _lastAt?: number;
	private _spinning = false;
	private _idleSpeed = 0.00016;
	private _rotation: IQuaternion = [0, 0, 0, 1];
	private _angularVelocity = { x: 0, y: 0.00016 };
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
	private readonly _textureStyleSync = effect(() => {
		const style = this.textureStyle();
		if (this._spinning) this._prepare(style);
	});

	ngAfterViewInit(): void {
		this._canvas = this.canvasRef()?.nativeElement;
		if (this._spinning) this.start();
	}

	start(): void {
		if (!isPlatformBrowser(this._platformId)) return;
		this._spinning = true;
		this.active.set(true);
		this._prepare(this.textureStyle());
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
		this._destroyed = true;
		this.stop();
		this._depthSync.destroy();
		this._textureStyleSync.destroy();
	}

	private _prepare(style: IEarthTextureStyle): void {
		if (!isPlatformBrowser(this._platformId) || this._destroyed) return;
		const cached = this._textures.get(style);
		if (cached) {
			this._texture = cached;
			this.active.set(true);
			this._resumeAnimation();
			return;
		}
		if (this._loadingTextures.has(style)) return;
		this._texture = undefined;
		this.active.set(false);
		this._loadTexture(style);
	}

	private _loadTexture(style: IEarthTextureStyle): void {
		this._loadingTextures.add(style);
		const image = new Image();
		image.decoding = 'async';
		image.onload = () => {
			this._loadingTextures.delete(style);
			if (this._destroyed) return;
			const source = this._document.createElement('canvas');
			source.width = image.naturalWidth;
			source.height = image.naturalHeight;
			const context = source.getContext('2d');
			if (!context) return;
			context.imageSmoothingEnabled = true;
			context.imageSmoothingQuality = 'high';
			context.drawImage(image, 0, 0);
			this._textures.set(style, source);
			if (this.textureStyle() === style) {
				this._texture = source;
				this.active.set(true);
				this._resumeAnimation();
			}
		};
		image.onerror = () => {
			this._loadingTextures.delete(style);
			console.error(`Unable to load globe texture: ${TEXTURE_SOURCES[style]}`);
		};
		image.src = TEXTURE_SOURCES[style];
	}

	private _resumeAnimation(): void {
		if (this._spinning && this._texture && this._frame === undefined)
			this._animate(performance.now());
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
		return Math.min(0.0038, Math.max(-0.0038, range.value));
	}
}
