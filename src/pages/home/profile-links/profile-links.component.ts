import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
	output,
} from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';
import type { IMonitorPreview, IPublicLink } from '../../../domain/types';

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
			detail: link.detail ?? `Open ${link.label} in a new tab.`,
			href: link.href,
			status: link.group === 'platform' ? 'Public platform' : 'Featured project',
			stack: link.group === 'platform' ? ['Public profile'] : ['Open source'],
			imageSrc: link.imageSrc,
			iconPath: link.iconPath,
			color: link.color,
		});
	}

	clearPreview(): void {
		this.preview.emit(null);
	}
}
