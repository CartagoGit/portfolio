import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
	DEMOS,
	HERO_PANELS,
	PUBLIC_LINKS,
} from '../../domain/data';
import { demoVisual, type IDemoVisual } from '../../domain/demo-visuals';
import { workTechnologyVisual } from './work-visuals';
import { monitorDestinations } from '../../domain/monitor-destinations';
import type {
	IDemo,
	IHeroPanel,
	IMonitorDestination,
	IMonitorDestinationKind,
	IPublicLink,
} from '../../domain/types';
import { TranslatePipe } from '../../lang/translate.pipe';
import { TranslateService } from '../../lang/translate.service';
import { contentKey } from '../../lang/content-key';
import { WorkProjectVisualComponent } from './work-project-visual.component';

interface IWorkProject {
	panel: IHeroPanel;
	number: string;
	destinations: readonly IMonitorDestination[];
}

interface IWorkExperiment {
	demo: IDemo;
	visual: IDemoVisual;
}

@Component({
	selector: 'app-work-page',
	imports: [TranslatePipe, WorkProjectVisualComponent],
	templateUrl: './work.page.html',
	styleUrl: './work.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkPageComponent {
	private readonly _translate = inject(TranslateService);

	readonly projects: readonly IWorkProject[] = HERO_PANELS.map(
		(panel, index) => ({
			panel,
			number: String(index + 1).padStart(2, '0'),
			destinations: monitorDestinations({
				kind: 'project',
				label: panel.label,
				detail: panel.detail,
				href: panel.href,
				status: panel.status,
				stack: panel.stack,
				imageSrc: panel.iconAsset,
				color: panel.color,
				destinations: panel.destinations,
			}),
		})
	);

	readonly platformLinks: readonly IPublicLink[] = PUBLIC_LINKS.filter(
		({ group }) => group === 'platform'
	);

	readonly experiments: readonly IWorkExperiment[] = DEMOS
		.filter(({ title }) => title !== 'Print CV')
		.map((demo) => ({
			demo,
			visual: demoVisual(demo.title),
		}));

	destinationKindLabel(kind: IMonitorDestinationKind): string {
		const key: Record<IMonitorDestinationKind, string> = {
			website: 'pages.home.monitorWebsite',
			repository: 'pages.home.monitorRepository',
			documentation: 'pages.home.monitorDocumentation',
			package: 'pages.home.monitorPackage',
			release: 'pages.home.monitorRelease',
			profile: 'pages.home.monitorPublicProfile',
		};
		return this._translate.instant(key[kind]);
	}

	projectDetail(panel: IHeroPanel): string {
		return this._translate.instant(`content.projects.${panel.id}.detail`);
	}

	projectStatus(panel: IHeroPanel): string {
		return this._translate.instant(`content.projects.${panel.id}.status`);
	}

	platformDetail(link: IPublicLink): string {
		return this._translate.instant(
			`content.publicLinkDetails.${contentKey(link.label)}`,
		);
	}

	termLabel(value: string): string {
		return this._translate.instant(`content.terms.${contentKey(value)}`);
	}

	technologyVisual(label: string) {
		return workTechnologyVisual(label);
	}
}
