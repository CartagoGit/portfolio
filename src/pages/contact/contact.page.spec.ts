import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { TranslateService } from '../../lang/translate.service';
import { ContactDeliveryService } from './contact-delivery.service';
import { ContactPageComponent } from './contact.page';
describe('ContactPageComponent', () => {
	afterEach(() => TestBed.inject(TranslateService).setLocale('en'));
	it('composes a portrait and real form with cuatro public profile channels', async () => {
		const delivery = {
			submit: vi.fn(() => of({ accepted: true as const })),
			fallbackHref: vi.fn(() => 'mailto:hello@example.test'),
		};
		await TestBed.configureTestingModule({
			imports: [ContactPageComponent],
			providers: [{ provide: ContactDeliveryService, useValue: delivery }],
		}).compileComponents();
		TestBed.inject(TranslateService).setLocale('es');
		const fixture = TestBed.createComponent(ContactPageComponent);
		fixture.detectChanges();
		const element = fixture.nativeElement as HTMLElement;
		expect(element.querySelector('app-contact-portrait')).not.toBeNull();
		expect(element.querySelector('app-contact-form')).not.toBeNull();
		expect(element.querySelectorAll('.contact-page__links a')).toHaveLength(4);
		expect(element.querySelectorAll('.contact-page__links svg, .contact-page__links img')).toHaveLength(4);
		expect(element.querySelector('.contact-page__links')?.getAttribute('aria-label'))
			.toBe('Canales de contacto');
		expect(element.textContent).not.toContain('pages.contact.');
	});
});
