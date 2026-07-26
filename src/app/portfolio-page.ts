import {
	ChangeDetectionStrategy,
	Component,
	HostListener,
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
import { PortfolioShellFacade } from '../core/platform/portfolio-shell.facade';
import { PortfolioFooterComponent } from '../shared/ui/portfolio-footer/portfolio-footer.component';
import { CommandPaletteComponent } from '../shared/ui/command-palette/command-palette.component';
import { PortfolioHeaderComponent } from '../shared/ui/portfolio-header/portfolio-header.component';

@Component({
	selector: 'app-portfolio-page',
	imports: [
		PortfolioFooterComponent,
		CommandPaletteComponent,
		PortfolioHeaderComponent,
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
	templateUrl: './portfolio-page.html',
	styleUrl: './portfolio-page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	// The legacy shell sheet still contains composition primitives used by the
	// extracted monitor. Keep it global until every primitive has moved.
	encapsulation: ViewEncapsulation.None,
})
export class PortfolioPage {
	protected readonly shell = new PortfolioShellFacade();

	@HostListener('window:scroll')
	protected onWindowScroll(): void {
		this.shell.setScrolled(window.scrollY > 20);
	}
}
