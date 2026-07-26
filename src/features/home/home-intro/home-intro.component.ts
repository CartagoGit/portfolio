import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import type {
	ILocale,
	IPortfolioCopy,
	IPortfolioPageId,
	IPublicLink,
	ITechnology,
} from '../../../domain/portfolio.types';
import { ProfileLinksComponent } from '../profile-links/profile-links.component';
import { TechnologyMarqueeComponent } from '../technology-marquee/technology-marquee.component';

@Component({
	selector: 'app-home-intro',
	imports: [RouterLink, ProfileLinksComponent, TechnologyMarqueeComponent],
	templateUrl: './home-intro.component.html',
	styleUrl: './home-intro.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeIntroComponent {
	readonly copy = input.required<IPortfolioCopy>();
	readonly locale = input.required<ILocale>();
	readonly technologies = input.required<readonly ITechnology[]>();
	readonly links = input.required<readonly IPublicLink[]>();
	readonly navigate = output<IPortfolioPageId>();
}
