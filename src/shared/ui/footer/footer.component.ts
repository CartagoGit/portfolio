import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ILocale, IPublicLink } from '../../../domain/types';

@Component({
	selector: 'app-shell-footer',
	imports: [RouterLink],
	templateUrl: './footer.component.html',
	styleUrl: './footer.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
	readonly locale = input.required<ILocale>();
	readonly links = input.required<readonly IPublicLink[]>();
}
