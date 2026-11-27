import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	input,
	output,
} from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';
import type { IMonitorPreview, IPublicLink } from '../../../domain/types.interface';
import { contentKey } from '../../../lang/content-key.helper';
import { TranslateService } from '../../../lang/translate.service';

@Component({
	selector: 'app-profile-links',
	imports: [TranslatePipe],
	templateUrl: './profile-links.component.html',
	styleUrl: './profile-links.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class.profile-links-host--compact]': 'compact()',
	},
})
export class ProfileLinksComponent {
	private readonly _translate = inject(TranslateService);

	readonly links = input.required<readonly IPublicLink[]>();
	readonly compact = input(false);
	readonly preview = output<IMonitorPreview | null>();
	readonly platformLinks = computed(() =>
		this.links().filter((link) => link.group === 'platform')
	);
	readonly projectLinks = computed(() =>
		this.links().filter((link) => link.group === 'project')
	);

	showPreview(link: IPublicLink): void {
		this.preview.emit({
			kind: link.group,
			label: link.label,
			detail: this._translate.instant(
				`content.publicLinkDetails.${contentKey(link.label)}`,
			),
			href: link.href,
			status: this._translate.instant(
				link.group === 'platform'
					? 'pages.home.monitorPlatformStatus'
					: 'pages.home.monitorProjectStatus',
			),
			stack: link.group === 'platform'
				? [this._translate.instant('pages.home.monitorPublicProfile')]
				: [this._translate.instant('pages.home.monitorOpenSource')],
			imageSrc: link.imageSrc,
			iconPath: link.iconPath,
			color: link.color,
		});
	}

	clearPreview(): void {
		this.preview.emit(null);
	}
}
