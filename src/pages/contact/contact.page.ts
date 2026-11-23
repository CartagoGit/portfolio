import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '../../lang/translate.pipe';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { ContactPortraitComponent } from './contact-portrait/contact-portrait.component';

@Component({
	selector: 'app-contact-page',
	imports: [ContactFormComponent, ContactPortraitComponent, TranslatePipe],
	templateUrl: './contact.page.html',
	styleUrl: './contact.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageComponent {}
