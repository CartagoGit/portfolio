import {
	ChangeDetectionStrategy,
	Component,
	inject,
	ViewEncapsulation,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShellFacade } from '../core/platform/shell.facade';
import { FooterComponent } from '../shared/ui/footer/footer.component';
import { CommandPaletteComponent } from '../shared/ui/command-palette/command-palette.component';
import { HeaderComponent } from '../shared/ui/header/header.component';
import { TranslatePipe } from '../lang/translate.pipe';

@Component({
	selector: 'app-page-shell',
	imports: [
		RouterOutlet,
		FooterComponent,
		CommandPaletteComponent,
		HeaderComponent,
		TranslatePipe,
	],
	providers: [ShellFacade],
	templateUrl: './page.html',
	styleUrl: './page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class PageComponent {
	readonly shell = inject(ShellFacade);
}
