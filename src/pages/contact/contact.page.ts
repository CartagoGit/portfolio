import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
	selector: 'app-contact-page',
	templateUrl: './contact.page.html',
	styleUrl: './contact.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageComponent {
	readonly sent = signal(false);

	submit(event: SubmitEvent): void {
		event.preventDefault();
		this.sent.set(true);
	}
}
