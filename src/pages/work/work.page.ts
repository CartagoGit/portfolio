import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
	HERO_PANELS,
	PUBLIC_LINKS,
} from '../../domain/data';
import { monitorDestinations } from '../../domain/monitor-destinations';
import type {
	IHeroPanel,
	IMonitorDestination,
	IMonitorDestinationKind,
	IPublicLink,
} from '../../domain/types';
import { TranslatePipe } from '../../lang/translate.pipe';
import { TranslateService } from '../../lang/translate.service';

interface IWorkProject {
	panel: IHeroPanel;
	number: string;
	destinations: readonly IMonitorDestination[];
}

@Component({
	selector: 'app-work-page',
	imports: [TranslatePipe],
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
}
