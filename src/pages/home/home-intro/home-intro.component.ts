import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../lang/translate.pipe';
import type {
	ILocale,
	IPageComponentId,
	IPublicLink,
	ITechnology,
} from '../../../domain/types';
import { ProfileLinksComponent } from '../profile-links/profile-links.component';
import { TechnologyMarqueeComponent } from '../technology-marquee/technology-marquee.component';

@Component({
	selector: 'app-home-intro',
	imports: [
		RouterLink,
		ProfileLinksComponent,
		TechnologyMarqueeComponent,
		TranslatePipe,
	],
	templateUrl: './home-intro.component.html',
	styleUrl: './home-intro.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeIntroComponent {
	readonly locale = input.required<ILocale>();
	readonly technologies = input.required<readonly ITechnology[]>();
	readonly links = input.required<readonly IPublicLink[]>();
	readonly navigate = output<IPageComponentId>();
}
