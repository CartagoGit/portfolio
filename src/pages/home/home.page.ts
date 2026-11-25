import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ShellFacade } from '../../core/platform/shell.facade';
import type { IMonitorPreview } from '../../domain/types.interface';
import { HeroMonitorComponent } from './hero-monitor/hero-monitor.component';
import { HomeIntroComponent } from './home-intro/home-intro.component';

@Component({
	selector: 'app-home-page',
	imports: [HeroMonitorComponent, HomeIntroComponent],
	templateUrl: './home.page.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
	readonly shell = inject(ShellFacade);
	readonly monitorPreview = signal<IMonitorPreview | null>(null);

	setMonitorPreview(preview: IMonitorPreview | null): void {
		this.monitorPreview.set(preview);
	}
}
