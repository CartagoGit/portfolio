import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
	selector: 'app-contact-page',
	templateUrl: './contact-page.component.html',
	styleUrl: './contact-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageComponent {
	protected readonly _sent = signal(false);
	protected _submit(event: SubmitEvent): void {
		event.preventDefault();
		this._sent.set(true);
	}
}
