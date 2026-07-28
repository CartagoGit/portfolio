import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { routeFor } from '../../../core/platform/routing';
import type {
	ILanguageOption,
	ILocale,
	IPageComponentId,
	IPortfolioCopy,
} from '../../../domain/types';

@Component({
	selector: 'app-shell-header',
	imports: [RouterLink],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
	readonly locale = input.required<ILocale>();
	readonly page = input.required<IPageComponentId>();
	readonly copy = input.required<IPortfolioCopy>();
	readonly languages = input.required<readonly ILanguageOption[]>();
	readonly menuOpen = input.required<boolean>();
	readonly localeMenuOpen = input.required<boolean>();
	readonly localeMenuClosing = input.required<boolean>();
	readonly lightMode = input.required<boolean>();
	readonly navigate = output<IPageComponentId>();
	readonly menuToggle = output<void>();
	readonly localeToggle = output<void>();
	readonly localeSelect = output<ILocale>();
	readonly themeToggle = output<void>();

	readonly routeFor = (page: IPageComponentId): string[] =>
		routeFor(page, this.locale());
	selectPage(page: IPageComponentId): void {
		this.navigate.emit(page);
	}
}
