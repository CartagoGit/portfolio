import { ChangeDetectionStrategy, Component, computed, effect, inject, type OnDestroy, signal } from '@angular/core';
import { FullscreenCoordinatorService } from '../../../core/platform/fullscreen-coordinator.service';
import { TranslatePipe } from '../../../lang/translate.pipe';

type IShowcaseScene = 'depth' | 'flow' | 'signal' | 'latency' | 'particles' | 'orbits';

interface IShowcaseTab {
	readonly id: IShowcaseScene;
	readonly index: string;
	readonly labelKey: string;
}

const SHOWCASE_TABS: readonly IShowcaseTab[] = [
	{ id: 'depth', index: '01', labelKey: 'pages.demos.showcaseTabDepth' },
	{ id: 'flow', index: '02', labelKey: 'pages.demos.showcaseTabFlow' },
	{ id: 'signal', index: '03', labelKey: 'pages.demos.showcaseTabSignal' },
	{ id: 'latency', index: '04', labelKey: 'pages.demos.showcaseTabLatency' },
	{ id: 'particles', index: '05', labelKey: 'pages.demos.showcaseTabParticles' },
	{ id: 'orbits', index: '06', labelKey: 'pages.demos.showcaseTabOrbits' },
];
const INITIAL_SIGNAL_BARS = [42, 68, 36, 84, 57, 76, 48, 92] as const;

@Component({
	selector: 'app-demos-showcase',
	imports: [TranslatePipe],
	templateUrl: './showcase.component.html',
	styleUrl: './showcase.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { '(document:fullscreenchange)': 'syncFullscreen()' },
})
export class ShowcaseComponent implements OnDestroy {
	readonly tabs = SHOWCASE_TABS;
	readonly activeScene = signal<IShowcaseScene>('depth');
	readonly pointer = signal({ x: 0, y: 0 });
	readonly signalRevision = signal(0);
	readonly signalBars = signal<readonly number[]>(INITIAL_SIGNAL_BARS);
	readonly flowVariant = signal(0);
	readonly latency = signal(48);
	readonly particleSeed = signal(0);
	readonly orbitTilt = signal(0);
	readonly fullscreen = signal(false);
	readonly rotateX = computed(() => `${-this.pointer().y * 13}deg`);
	readonly rotateY = computed(() => `${this.pointer().x * 15}deg`);
	readonly sceneLabelKey = computed(() =>
		SHOWCASE_TABS.find(({ id }) => id === this.activeScene())?.labelKey
		?? 'pages.demos.showcaseTabDepth',
	);
	readonly sceneReadout = computed(() => {
		switch (this.activeScene()) {
			case 'depth':
				return `X ${this.pointer().x.toFixed(2)} · Y ${this.pointer().y.toFixed(2)}`;
			case 'flow':
				return `${String(this.flowVariant() + 1).padStart(2, '0')} / 03`;
			case 'signal': {
				const average = this.signalBars().reduce((total, value) => total + value, 0) / this.signalBars().length;
				return `AVG ${Math.round(average)}%`;
			}
			case 'latency':
				return `${this.latency()} ms`;
			case 'particles':
				return `FIELD ${String(this.particleSeed() + 1).padStart(2, '0')}`;
			case 'orbits':
				return `${this.orbitTilt()}°`;
		}
	});

	private readonly _fullscreenCoordinator = inject(FullscreenCoordinatorService);
	private _fullscreenTarget?: HTMLElement;
	private readonly _fullscreenSync = effect(() => {
		const activeTarget = this._fullscreenCoordinator.active();
		const target = this._fullscreenTarget;
		if (target) this.fullscreen.set(activeTarget === target);
	});
	private _dragging = false;

	ngOnDestroy(): void {
		if (this._fullscreenTarget)
			this._fullscreenCoordinator.deactivate(this._fullscreenTarget);
		this._fullscreenSync.destroy();
	}

	selectScene(scene: IShowcaseScene): void {
		this.activeScene.set(scene);
	}

	moveScene(event: PointerEvent): void {
		if (!this._dragging || this.activeScene() !== 'depth') return;
		const target = event.currentTarget;
		if (!(target instanceof HTMLElement)) return;
		const bounds = target.getBoundingClientRect();
		this.pointer.set({
			x: ((event.clientX - bounds.left) / Math.max(1, bounds.width) - 0.5) * 2,
			y: ((event.clientY - bounds.top) / Math.max(1, bounds.height) - 0.5) * 2,
		});
	}

	beginScene(event: PointerEvent): void {
		if (this.activeScene() !== 'depth') return;
		this._dragging = true;
		(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
		this.moveScene(event);
	}

	endScene(event: PointerEvent): void {
		this._dragging = false;
		const target = event.currentTarget as HTMLElement;
		if (target.hasPointerCapture?.(event.pointerId)) target.releasePointerCapture(event.pointerId);
	}

	interactScene(): void {
		switch (this.activeScene()) {
			case 'depth':
				this.pointer.set({ x: Math.random() * 1.6 - 0.8, y: Math.random() * 1.2 - 0.6 });
				break;
			case 'flow':
				this.stepFlow(1);
				break;
			case 'signal':
				this.signalBars.set(this.signalBars().map((value, index) =>
					30 + ((value + this.signalRevision() * 11 + index * 7) % 66),
				));
				break;
			case 'latency':
				this.latency.set(12 + Math.round(Math.random() * 120));
				break;
			case 'particles':
				this.particleSeed.update((seed) => seed + 1);
				break;
			case 'orbits':
				this.stepOrbit(1);
				break;
		}
		this.signalRevision.update((revision) => revision + 1);
	}

	onStageKeydown(event: KeyboardEvent): void {
		if (event.target instanceof HTMLElement && event.target.closest('button')) return;
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			this.interactScene();
			return;
		}
		if (!event.key.startsWith('Arrow')) return;
		event.preventDefault();
		const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
		if (this.activeScene() === 'depth') {
			const pointer = this.pointer();
			this.pointer.set({
				x: Math.max(-1, Math.min(1, pointer.x + (event.key === 'ArrowRight' ? 0.15 : event.key === 'ArrowLeft' ? -0.15 : 0))),
				y: Math.max(-1, Math.min(1, pointer.y + (event.key === 'ArrowDown' ? 0.15 : event.key === 'ArrowUp' ? -0.15 : 0))),
			});
			return;
		}
		this.stepScene(direction);
	}

	stepScene(direction: 1 | -1): void {
		switch (this.activeScene()) {
			case 'flow':
				this.stepFlow(direction);
				break;
			case 'signal':
				this.signalBars.set(direction > 0
					? [...this.signalBars().slice(1), this.signalBars()[0] ?? 42]
					: [this.signalBars().at(-1) ?? 92, ...this.signalBars().slice(0, -1)]);
				break;
			case 'latency':
				this.latency.update((latency) => Math.max(12, Math.min(132, latency + direction * 8)));
				break;
			case 'particles':
				this.particleSeed.update((seed) => Math.max(0, seed + direction));
				break;
			case 'orbits':
				this.stepOrbit(direction);
				break;
			case 'depth':
				break;
		}
		this.signalRevision.update((revision) => revision + 1);
	}

	async toggleFullscreen(event: MouseEvent): Promise<void> {
		const showcase = (event.currentTarget as Element | null)?.closest<HTMLElement>('.showcase__stage');
		if (!showcase) return;
		this._fullscreenTarget = showcase;
		if (this._fullscreenCoordinator.active() === showcase)
			this._fullscreenCoordinator.deactivate(showcase);
		else
			this._fullscreenCoordinator.activate(showcase);
		this.fullscreen.set(this._fullscreenCoordinator.active() === showcase);
	}

	syncFullscreen(): void {
		if (this._fullscreenTarget)
			this.fullscreen.set(this._fullscreenCoordinator.active() === this._fullscreenTarget);
	}

	resetPointer(): void {
		this.pointer.set({ x: 0, y: 0 });
	}

	resetScene(): void {
		switch (this.activeScene()) {
			case 'depth':
				this.resetPointer();
				break;
			case 'flow':
				this.flowVariant.set(0);
				break;
			case 'signal':
				this.signalBars.set(INITIAL_SIGNAL_BARS);
				break;
			case 'latency':
				this.latency.set(48);
				break;
			case 'particles':
				this.particleSeed.set(0);
				break;
			case 'orbits':
				this.orbitTilt.set(0);
				break;
		}
		this.signalRevision.update((revision) => revision + 1);
	}

	onTabsKeydown(event: KeyboardEvent, index: number): void {
		const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
		if (!delta && event.key !== 'Home' && event.key !== 'End') return;
		event.preventDefault();
		const nextIndex = event.key === 'Home'
			? 0
			: event.key === 'End'
				? this.tabs.length - 1
				: (index + delta + this.tabs.length) % this.tabs.length;
		const scene = this.tabs[nextIndex];
		if (!scene) return;
		const tabs = (event.currentTarget as HTMLElement | null)
			?.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
		this.selectScene(scene.id);
		queueMicrotask(() => tabs?.[nextIndex]?.focus());
	}

	private stepFlow(direction: 1 | -1): void {
		this.flowVariant.update((variant) => (variant + direction + 3) % 3);
	}

	private stepOrbit(direction: 1 | -1): void {
		this.orbitTilt.update((tilt) => (tilt + direction * 18 + 72) % 72);
	}
}
