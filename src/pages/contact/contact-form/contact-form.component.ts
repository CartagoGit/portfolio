import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../lang/translate.pipe';
import { ContactDeliveryService } from '../contact-delivery.service';

type IContactFormStatus = 'idle' | 'sending' | 'success' | 'error';

@Component({
	selector: 'app-contact-form',
	imports: [ReactiveFormsModule, TranslatePipe],
	templateUrl: './contact-form.component.html',
	styleUrl: './contact-form.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent {
	private readonly _delivery = inject(ContactDeliveryService);
	private readonly _destroyRef = inject(DestroyRef);
	readonly status = signal<IContactFormStatus>('idle');
	readonly fallbackHref = signal('');
	readonly form = new FormGroup({
		email: new FormControl('', {
			nonNullable: true,
			validators: [Validators.required, Validators.email],
		}),
		message: new FormControl('', {
			nonNullable: true,
			validators: [
				Validators.required,
				Validators.minLength(20),
				Validators.maxLength(2000),
			],
		}),
	});

	readonly emailInvalid = () =>
		this.form.controls.email.invalid && this.form.controls.email.touched;
	readonly messageInvalid = () =>
		this.form.controls.message.invalid && this.form.controls.message.touched;

	submit(): void {
		this.form.markAllAsTouched();
		if (this.form.invalid || this.status() === 'sending') return;
		const message = this.form.getRawValue();
		this.status.set('sending');
		this.fallbackHref.set('');
		this._delivery
			.submit(message)
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe({
				next: () => {
					this.status.set('success');
					this.form.reset();
				},
				error: () => {
					this.status.set('error');
					this.fallbackHref.set(this._delivery.fallbackHref(message));
				},
			});
	}
}
