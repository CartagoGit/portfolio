import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import type {
	Locale,
	PortfolioCopy,
	PortfolioPageId,
	PublicLink,
	Technology,
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
	readonly copy = input.required<PortfolioCopy>();
	readonly locale = input.required<Locale>();
	readonly technologies = input.required<readonly Technology[]>();
	readonly links = input.required<readonly PublicLink[]>();
	readonly navigate = output<PortfolioPageId>();
}
