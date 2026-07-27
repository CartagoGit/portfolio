import {
	ChangeDetectionStrategy,
	Component,
	ViewEncapsulation,
} from '@angular/core';
import { ContactPageComponent } from '../features/contact/contact-page.component';
import { DockerPageComponent } from '../features/docker/docker-page.component';
import { DemosPageComponent } from '../features/demos/demos-page.component';
import { ApproachPageComponent } from '../features/approach/approach-page.component';
import { KnowledgePageComponent } from '../features/knowledge/knowledge-page.component';
import { LabPageComponent } from '../features/lab/lab-page.component';
import { WorkPageComponent } from '../features/work/work-page.component';
import { HeroMonitorComponent } from '../features/home/hero-monitor/hero-monitor.component';
import { HomeIntroComponent } from '../features/home/home-intro/home-intro.component';
import { ShellFacade } from '../core/platform/shell.facade';
import { FooterComponent } from '../shared/ui/footer/footer.component';
import { CommandPaletteComponent } from '../shared/ui/command-palette/command-palette.component';
import { HeaderComponent } from '../shared/ui/header/header.component';

@Component({
	selector: 'app-root',
	imports: [
		FooterComponent,
		CommandPaletteComponent,
		HeaderComponent,
		ContactPageComponent,
		DockerPageComponent,
		DemosPageComponent,
		ApproachPageComponent,
		KnowledgePageComponent,
		LabPageComponent,
		WorkPageComponent,
		HeroMonitorComponent,
		HomeIntroComponent,
	],
	templateUrl: './page.html',
	styleUrl: './page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	// The legacy shell sheet still contains composition primitives used by the
	// extracted monitor. Keep it global until every primitive has moved.
	encapsulation: ViewEncapsulation.None,
	host: {
		'(window:scroll)': 'onWindowScroll()',
	},
})
export class PageComponent {
	readonly shell = new ShellFacade();

	onWindowScroll(): void {
		this.shell.setScrolled(window.scrollY > 20);
	}
}
