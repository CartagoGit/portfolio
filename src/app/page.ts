import {
	ChangeDetectionStrategy,
	Component,
	ViewEncapsulation,
} from '@angular/core';
import { ContactPageComponent } from '../pages/contact/contact.page';
import { DockerPageComponent } from '../pages/docker/docker.page';
import { DemosPageComponent } from '../pages/demos/demos.page';
import { ApproachPageComponent } from '../pages/approach/approach.page';
import { KnowledgePageComponent } from '../pages/knowledge/knowledge.page';
import { LabPageComponent } from '../pages/lab/lab.page';
import { WorkPageComponent } from '../pages/work/work.page';
import { HeroMonitorComponent } from '../pages/home/hero-monitor/hero-monitor.component';
import { HomeIntroComponent } from '../pages/home/home-intro/home-intro.component';
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
	// global stylesheet for the layout / palette chrome (the `.portfolio`
	// container and `.skip-link` anchor) declared in src/app/page.scss.
	// ViewEncapsulation.None keeps those rules reachable without
	// re-declaring them per component. Per-section rules live next to
	// each component (e.g. src/pages/approach/approach.page.scss owns
	// every `.approach-page*` selector).
	encapsulation: ViewEncapsulation.None,
})
export class PageComponent {
	readonly shell = new ShellFacade();
}
