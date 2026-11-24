import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';

type IShowcaseScene = 'depth' | 'flow' | 'signal';

interface IShowcaseTab {
	readonly id: IShowcaseScene;
	readonly index: string;
	readonly labelKey: string;
}

const SHOWCASE_TABS: readonly IShowcaseTab[] = [
	{ id: 'depth', index: '01', labelKey: 'pages.demos.showcaseTabDepth' },
	{ id: 'flow', index: '02', labelKey: 'pages.demos.showcaseTabFlow' },
	{ id: 'signal', index: '03', labelKey: 'pages.demos.showcaseTabSignal' },
];

@Component({
	selector: 'app-demos-showcase',
	imports: [TranslatePipe],
	templateUrl: './showcase.component.html',
	styleUrl: './showcase.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseComponent {
	readonly tabs = SHOWCASE_TABS;
	readonly activeScene = signal<IShowcaseScene>('depth');
	readonly pointer = signal({ x: 0, y: 0 });
	readonly signalRevision = signal(0);
	readonly rotateX = computed(() => `${-this.pointer().y * 13}deg`);
	readonly rotateY = computed(() => `${this.pointer().x * 15}deg`);

	selectScene(scene: IShowcaseScene): void {
		this.activeScene.set(scene);
		this.resetPointer();
	}

	moveScene(event: PointerEvent): void {
		const target = event.currentTarget;
		if (!(target instanceof HTMLElement)) return;
		const bounds = target.getBoundingClientRect();
		this.pointer.set({
			x: ((event.clientX - bounds.left) / Math.max(1, bounds.width) - 0.5) * 2,
			y: ((event.clientY - bounds.top) / Math.max(1, bounds.height) - 0.5) * 2,
		});
	}

	resetPointer(): void {
		this.pointer.set({ x: 0, y: 0 });
	}

	resetScene(): void {
		this.resetPointer();
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
