import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { IPublicLink } from '../../../domain/portfolio.types';

@Component({
	selector: 'app-profile-links',
	templateUrl: './profile-links.component.html',
	styleUrl: './profile-links.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileLinksComponent {
	readonly links = input.required<readonly IPublicLink[]>();
}
