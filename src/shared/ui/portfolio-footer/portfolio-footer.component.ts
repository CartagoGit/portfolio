import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ILocale, IPublicLink } from '../../../domain/portfolio.types';

@Component({
	selector: 'app-portfolio-footer',
	imports: [RouterLink],
	templateUrl: './portfolio-footer.component.html',
	styleUrl: './portfolio-footer.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioFooterComponent {
	readonly locale = input.required<ILocale>();
	readonly links = input.required<readonly IPublicLink[]>();
}
