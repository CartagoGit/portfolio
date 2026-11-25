import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	type OnDestroy,
	output,
	signal,
} from '@angular/core';
import { FullscreenCoordinatorService } from '../../core/platform/fullscreen-coordinator.service';
import { TranslatePipe } from '../../lang/translate.pipe';
import { FullscreenPanelDirective } from '../../shared/ui/fullscreen-panel.directive';
import { AccessibilityPlaygroundComponent } from './accessibility-playground/accessibility-playground.component';
import { ConcurrencyPlaygroundComponent } from './concurrency-playground/concurrency-playground.component';
import { DataPlaygroundComponent } from './data-playground/data-playground.component';
import { LabDashboardComponent } from './lab-dashboard/lab-dashboard.component';
import { MotionPlaygroundComponent } from './motion-playground/motion-playground.component';
import { ResponsivePlaygroundComponent } from './responsive-playground/responsive-playground.component';
import { StateMachinePlaygroundComponent } from './state-machine-playground/state-machine-playground.component';
import { WorkflowPlaygroundComponent } from './workflow-playground/workflow-playground.component';

@Component({
	selector: 'app-lab-page',
	imports: [
		AccessibilityPlaygroundComponent,
		ConcurrencyPlaygroundComponent,
		DataPlaygroundComponent,
		FullscreenPanelDirective,
		LabDashboardComponent,
		MotionPlaygroundComponent,
		ResponsivePlaygroundComponent,
		StateMachinePlaygroundComponent,
		TranslatePipe,
		WorkflowPlaygroundComponent,
	],
	templateUrl: './lab.page.html',
	styleUrl: './lab.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { '(document:fullscreenchange)': 'syncFullscreen()' },
})
export class LabPageComponent implements OnDestroy {
	private readonly _fullscreenCoordinator = inject(FullscreenCoordinatorService);
	readonly commandRequested = output<void>();
	readonly signalStrength = signal(42);
	readonly packetPath = signal(0);
	readonly queue = signal<readonly string[]>(['A-01', 'B-02', 'C-03']);
	readonly galleryFullscreen = signal(false);
	readonly fullscreenCard = signal<'tune' | 'route' | 'queue' | null>(null);
	private _fullscreenTarget?: HTMLElement;
	private readonly _fullscreenSync = effect(() => {
		const activeTarget = this._fullscreenCoordinator.active();
		const target = this._fullscreenTarget;
		if (!target) return;
		const active = activeTarget === target;
		this.galleryFullscreen.set(active);
		this.fullscreenCard.set(active
			? (target.dataset['experiment'] as 'tune' | 'route' | 'queue')
			: null);
	});

	tuneSignal(): void {
		this.signalStrength.set(18 + Math.round(Math.random() * 78));
	}

	routePacket(): void {
		this.packetPath.update((path) => (path + 1) % 3);
	}

	enqueue(): void {
		this.queue.update((queue) => [...queue.slice(-4), `X-${String(queue.length + 1).padStart(2, '0')}`]);
	}

	dequeue(): void {
		this.queue.update((queue) => queue.slice(1));
	}

	async toggleGalleryFullscreen(event: MouseEvent): Promise<void> {
		const gallery = (event.currentTarget as Element | null)?.closest<HTMLElement>('.lab-page__signal-card');
		const card = gallery?.dataset['experiment'] as 'tune' | 'route' | 'queue' | undefined;
		if (!gallery || !card) return;
		this._fullscreenTarget = gallery;
		if (this._fullscreenCoordinator.active() === gallery)
			this._fullscreenCoordinator.deactivate(gallery);
		else
			this._fullscreenCoordinator.activate(gallery);
		this.galleryFullscreen.set(this._fullscreenCoordinator.active() === gallery);
		this.fullscreenCard.set(this.galleryFullscreen() ? card : null);
	}

	syncFullscreen(): void {
		const target = this._fullscreenTarget;
		if (!target) return;
		const active = this._fullscreenCoordinator.active() === target;
		this.galleryFullscreen.set(active);
		this.fullscreenCard.set(active
			? (target.dataset['experiment'] as 'tune' | 'route' | 'queue')
			: null);
	}

	ngOnDestroy(): void {
		if (this._fullscreenTarget)
			this._fullscreenCoordinator.deactivate(this._fullscreenTarget);
		this._fullscreenSync.destroy();
	}
}
