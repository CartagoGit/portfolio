import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import type {
	ILanguageOption,
	ILocale,
	IPortfolioCopy,
	IPortfolioPageId,
} from '../../../domain/portfolio.types';

@Component({
	selector: 'app-portfolio-header',
	imports: [RouterLink],
	templateUrl: './portfolio-header.component.html',
	styleUrl: './portfolio-header.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioHeaderComponent {
	readonly locale = input.required<ILocale>();
	readonly page = input.required<IPortfolioPageId>();
	readonly copy = input.required<IPortfolioCopy>();
	readonly languages = input.required<readonly ILanguageOption[]>();
	readonly menuOpen = input.required<boolean>();
	readonly localeMenuOpen = input.required<boolean>();
	readonly localeMenuClosing = input.required<boolean>();
	readonly lightMode = input.required<boolean>();
	readonly scrolled = input.required<boolean>();
	readonly navigate = output<IPortfolioPageId>();
	readonly menuToggle = output<void>();
	readonly localeToggle = output<void>();
	readonly localeSelect = output<ILocale>();
	readonly themeToggle = output<void>();

	protected _routeFor(page: IPortfolioPageId): string[] {
		return page === 'home'
			? ['/', this.locale()]
			: ['/', this.locale(), page];
	}
	protected _selectPage(page: IPortfolioPageId): void {
		this.navigate.emit(page);
	}
}
