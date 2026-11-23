import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { TranslateService } from '../../../lang/translate.service';
import {
	ContactDeliveryError,
	ContactDeliveryService,
} from '../contact-delivery.service';
import { ContactFormComponent } from './contact-form.component';

async function createForm(delivery: Partial<ContactDeliveryService>) {
	await TestBed.configureTestingModule({
		imports: [ContactFormComponent],
		providers: [{ provide: ContactDeliveryService, useValue: delivery }],
	}).compileComponents();
	TestBed.inject(TranslateService).setLocale('es');
	const fixture = TestBed.createComponent(ContactFormComponent);
	fixture.detectChanges();
	return fixture;
}

describe('ContactFormComponent', () => {
	afterEach(() => TestBed.inject(TranslateService).setLocale('en'));

	it('blocks invalid data before the delivery boundary', async () => {
		const submit = vi.fn();
		const fixture = await createForm({ submit });
		fixture.componentInstance.form.setValue({ email: 'wrong', message: 'short' });
		fixture.componentInstance.submit();
		fixture.detectChanges();
		expect(submit).not.toHaveBeenCalled();
		expect(fixture.nativeElement.textContent).toContain('dirección de email válida');
		expect(fixture.nativeElement.textContent).toContain('20 y 2000');
	});

	it('reports success only after the delivery service accepts the message', async () => {
		const submit = vi.fn(() => of({ accepted: true as const }));
		const fixture = await createForm({ submit });
		fixture.componentInstance.form.setValue({
			email: 'person@example.test',
			message: 'A sufficiently detailed project brief.',
		});
		fixture.componentInstance.submit();
		fixture.detectChanges();
		expect(submit).toHaveBeenCalledTimes(1);
		expect(fixture.componentInstance.status()).toBe('success');
		expect(fixture.nativeElement.textContent).toContain('aceptó tu mensaje');
	});

	it('never claims success and exposes a mailto fallback after failure', async () => {
		const fallbackHref = vi.fn(() => 'mailto:hello@example.test?subject=Portfolio');
		const submit = vi.fn(() =>
			throwError(() => new ContactDeliveryError('network')),
		);
		const fixture = await createForm({ submit, fallbackHref });
		fixture.componentInstance.form.setValue({
			email: 'person@example.test',
			message: 'A sufficiently detailed project brief.',
		});
		fixture.componentInstance.submit();
		fixture.detectChanges();
		expect(fixture.componentInstance.status()).toBe('error');
		expect(fixture.nativeElement.textContent).toContain('No se envió nada');
		expect(fixture.nativeElement.querySelector('a')?.getAttribute('href')).toContain('mailto:');
	});
});
