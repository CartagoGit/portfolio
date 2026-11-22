import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';
import type { ILocale, IPublicLink } from '../../../domain/types';
import { ProfileLinksComponent } from '../../../pages/home/profile-links/profile-links.component';

@Component({
	selector: 'app-shell-footer',
	imports: [TranslatePipe, ProfileLinksComponent],
	templateUrl: './footer.component.html',
	styleUrl: './footer.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
	readonly locale = input.required<ILocale>();
	readonly links = input.required<readonly IPublicLink[]>();
}
