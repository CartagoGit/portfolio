import {
	ChangeDetectionStrategy,
	Component,
	output,
	signal,
} from '@angular/core';
import { TranslatePipe } from '../../lang/translate.pipe';
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
})
export class LabPageComponent {
	readonly commandRequested = output<void>();
	readonly signalStrength = signal(42);
	readonly packetPath = signal(0);
	readonly queue = signal<readonly string[]>(['A-01', 'B-02', 'C-03']);
	readonly galleryFullscreen = signal(false);

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
		const gallery = (event.currentTarget as Element | null)?.closest<HTMLElement>('.lab-page__signal-gallery');
		try {
			if (document.fullscreenElement) {
				await document.exitFullscreen();
				this.galleryFullscreen.set(false);
			} else if (gallery?.requestFullscreen) {
				await gallery.requestFullscreen();
				this.galleryFullscreen.set(true);
			} else this.galleryFullscreen.update((active) => !active);
		} catch {
			this.galleryFullscreen.update((active) => !active);
		}
	}
}
