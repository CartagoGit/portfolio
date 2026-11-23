import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';

@Component({
	selector: 'app-contact-portrait',
	imports: [TranslatePipe],
	templateUrl: './contact-portrait.component.html',
	styleUrl: './contact-portrait.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPortraitComponent {}
