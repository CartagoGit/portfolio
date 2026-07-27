import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ILocale, IPageComponentId } from '../../../domain/types';

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
	readonly navigate = output<IPageComponentId>();

	routeFor(page: IPageComponentId): string[] {
		return page === 'home'
			? ['/', this.locale()]
			: ['/', this.locale(), page];
	}

	select(page: IPageComponentId): void {
		this.navigate.emit(page);
		this.close.emit();
	}
}
