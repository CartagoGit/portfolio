import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
	selector: 'app-contact-page',
	templateUrl: './contact-page.component.html',
	styleUrl: './contact-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageComponent {
	protected readonly sent = signal(false);
	protected submit(event: SubmitEvent): void {
		event.preventDefault();
		this.sent.set(true);
	}
}
