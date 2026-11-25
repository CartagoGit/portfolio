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
	readonly signalBars = signal<readonly number[]>([42, 68, 36, 84, 57, 76, 48, 92]);
	readonly flowVariant = signal(0);
	readonly latency = signal(48);
	readonly particleSeed = signal(0);
	readonly orbitTilt = signal(0);
	readonly fullscreen = signal(false);
	readonly rotateX = computed(() => `${-this.pointer().y * 13}deg`);
	readonly rotateY = computed(() => `${this.pointer().x * 15}deg`);

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
		this.resetPointer();
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
				this.flowVariant.update((variant) => (variant + 1) % 3);
				break;
			case 'signal':
				this.signalBars.set(this.signalBars().map(() => 30 + Math.round(Math.random() * 65)));
				break;
			case 'latency':
				this.latency.set(12 + Math.round(Math.random() * 120));
				break;
			case 'particles':
				this.particleSeed.update((seed) => seed + 1);
				break;
			case 'orbits':
				this.orbitTilt.update((tilt) => (tilt + 18) % 72);
				break;
		}
		this.signalRevision.update((revision) => revision + 1);
	}

	onStageKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			this.interactScene();
			return;
		}
		if (!event.key.startsWith('Arrow')) return;
		event.preventDefault();
		const pointer = this.pointer();
		this.pointer.set({
			x: Math.max(-1, Math.min(1, pointer.x + (event.key === 'ArrowRight' ? 0.15 : event.key === 'ArrowLeft' ? -0.15 : 0))),
			y: Math.max(-1, Math.min(1, pointer.y + (event.key === 'ArrowDown' ? 0.15 : event.key === 'ArrowUp' ? -0.15 : 0))),
		});
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
		this.resetPointer();
		this.flowVariant.set(0);
		this.signalBars.set([42, 68, 36, 84, 57, 76, 48, 92]);
		this.latency.set(48);
		this.particleSeed.set(0);
		this.orbitTilt.set(0);
		this.signalRevision.update((revision) => revision + 1);
	}

	onTabsKeydown(event: KeyboardEvent): void {
		if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
		event.preventDefault();
		const current = SHOWCASE_TABS.findIndex(({ id }) => id === this.activeScene());
		const direction = event.key === 'ArrowRight' ? 1 : -1;
		const next = (current + direction + SHOWCASE_TABS.length) % SHOWCASE_TABS.length;
		const scene = SHOWCASE_TABS[next];
		if (scene) this.selectScene(scene.id);
	}
}
