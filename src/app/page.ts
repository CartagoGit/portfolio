import {
	ChangeDetectionStrategy,
	Component,
	ViewEncapsulation,
} from '@angular/core';
import { ContactPageComponent } from '../features/contact/contact.page';
import { DockerPageComponent } from '../features/docker/docker.page';
import { DemosPageComponent } from '../features/demos/demos.page';
import { ApproachPageComponent } from '../features/approach/approach.page';
import { KnowledgePageComponent } from '../features/knowledge/knowledge.page';
import { LabPageComponent } from '../features/lab/lab.page';
import { WorkPageComponent } from '../features/work/work.page';
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
	// Composition root: child components in the shell rely on a single
	// global stylesheet for the layout / section chrome under
	// src/styles/ and src/styles/composition/. ViewEncapsulation.None
	// keeps those rules reachable without re-declaring per component.
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
