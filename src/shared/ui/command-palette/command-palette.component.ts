import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { routeFor } from '../../../core/platform/routing';
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
		return routeFor(page, this.locale());
	}

	select(page: IPageComponentId): void {
		this.navigate.emit(page);
		this.close.emit();
	}
}
