import {
	ChangeDetectionStrategy,
	Component,
	output,
	signal,
} from '@angular/core';
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
export class LabPageComponent {
	readonly commandRequested = output<void>();
	readonly signalStrength = signal(42);
	readonly packetPath = signal(0);
	readonly queue = signal<readonly string[]>(['A-01', 'B-02', 'C-03']);
	readonly galleryFullscreen = signal(false);
	readonly fullscreenCard = signal<'tune' | 'route' | 'queue' | null>(null);

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
		try {
			if (document.fullscreenElement || this.fullscreenCard() === card) {
				if (document.fullscreenElement) await document.exitFullscreen();
				this.galleryFullscreen.set(false);
				this.fullscreenCard.set(null);
			} else if (gallery?.requestFullscreen) {
				await gallery.requestFullscreen();
				this.galleryFullscreen.set(true);
				this.fullscreenCard.set(card ?? null);
			} else {
				this.galleryFullscreen.set(true);
				this.fullscreenCard.set(card ?? null);
			}
		} catch {
			this.galleryFullscreen.set(this.fullscreenCard() !== card);
			this.fullscreenCard.set(this.galleryFullscreen() ? card ?? null : null);
		}
	}

	syncFullscreen(): void {
		const target = document.fullscreenElement as HTMLElement | null;
		this.galleryFullscreen.set(target?.matches('.lab-page__signal-card') ?? false);
		this.fullscreenCard.set((target?.dataset['experiment'] as 'tune' | 'route' | 'queue' | undefined) ?? null);
	}
}
