import { provideHttpClient } from '@angular/common/http';
import {
	HttpTestingController,
	provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
	CONTACT_DELIVERY_CONFIG,
	type IContactDeliveryConfig,
} from './contact-delivery.config';
import {
	ContactDeliveryError,
	ContactDeliveryService,
} from './contact-delivery.service';

const config: IContactDeliveryConfig = {
	endpoint: 'https://delivery.example.test/contact',
	fallbackEmail: 'hello@example.test',
	subject: 'Portfolio contact',
};

describe('ContactDeliveryService', () => {
	let http: HttpTestingController;
	let service: ContactDeliveryService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				provideHttpClient(),
				provideHttpClientTesting(),
				{ provide: CONTACT_DELIVERY_CONFIG, useValue: config },
			],
		});
		http = TestBed.inject(HttpTestingController);
		service = TestBed.inject(ContactDeliveryService);
	});

	afterEach(() => http.verify());

	it('posts a typed, honeypot-protected payload and accepts an explicit receipt', () => {
		let accepted = false;
		service
			.submit({ email: 'person@example.test', message: 'A useful project brief.' })
			.subscribe({ next: () => (accepted = true) });
		const request = http.expectOne(config.endpoint);
		expect(request.request.method).toBe('POST');
		expect(request.request.body).toEqual(
			expect.objectContaining({
				email: 'person@example.test',
				message: 'A useful project brief.',
				_subject: config.subject,
				_gotcha: '',
			}),
		);
		request.flush({ success: true });
		expect(accepted).toBe(true);
	});

	it('rejects a response that is not explicitly successful', () => {
		let failure: unknown;
		service
			.submit({ email: 'person@example.test', message: 'A useful project brief.' })
			.subscribe({ error: (error: unknown) => (failure = error) });
		http.expectOne(config.endpoint).flush({ success: false });
		expect(failure).toBeInstanceOf(ContactDeliveryError);
		expect((failure as ContactDeliveryError).kind).toBe('rejected');
	});

	it('builds an honest mail client fallback with encoded user content', () => {
		const href = service.fallbackHref({
			email: 'person@example.test',
			message: 'A & B',
		});
		expect(href).toContain(`mailto:${config.fallbackEmail}?`);
		expect(decodeURIComponent(href)).toContain('Reply to: person@example.test');
		expect(decodeURIComponent(href)).toContain('A & B');
	});
});
