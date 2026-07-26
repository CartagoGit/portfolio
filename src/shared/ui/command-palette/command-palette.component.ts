import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ILocale, IPortfolioPageId } from '../../../domain/portfolio.types';

@Component({
	selector: 'app-command-palette',
	imports: [RouterLink],
	templateUrl: './command-palette.component.html',
	styleUrl: './command-palette.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPaletteComponent {
	readonly open = input.required<boolean>();
	readonly locale = input.required<ILocale>();
	readonly close = output<void>();
	readonly navigate = output<IPortfolioPageId>();

	protected _routeFor(page: IPortfolioPageId): string[] {
		return page === 'home'
			? ['/', this.locale()]
			: ['/', this.locale(), page];
	}

	protected _select(page: IPortfolioPageId): void {
		this.navigate.emit(page);
		this.close.emit();
	}
}
