import {
	ChangeDetectionStrategy,
	Component,
	computed,
	signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../lang/translate.pipe';
import { contrastRatio } from '../helpers/contrast-ratio';

@Component({
	selector: 'app-accessibility-playground',
	imports: [ReactiveFormsModule, TranslatePipe],
	templateUrl: './accessibility-playground.component.html',
	styleUrl: './accessibility-playground.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessibilityPlaygroundComponent {
	readonly highContrast = signal(false);
	readonly focusVisible = signal(true);
	readonly submitted = signal(false);
	readonly email = new FormControl('', {
		nonNullable: true,
		validators: [Validators.required, Validators.email],
	});
	readonly ratio = computed(() =>
		contrastRatio(
			this.highContrast() ? '#ffffff' : '#6f849b',
			'#07111e',
		).toFixed(2),
	);

	emailInvalid(): boolean {
		return this.email.touched && this.email.invalid;
	}

	toggleContrast(): void {
		this.highContrast.update((value) => !value);
	}

	toggleFocus(): void {
		this.focusVisible.update((value) => !value);
	}

	testForm(): void {
		this.email.markAsTouched();
		this.submitted.set(this.email.valid);
	}
}
