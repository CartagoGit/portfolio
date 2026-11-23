import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, type Observable, throwError, timeout } from 'rxjs';
import { CONTACT_DELIVERY_CONFIG } from './contact-delivery.config';

export interface IContactMessage {
	email: string;
	message: string;
}

export interface IContactDeliveryReceipt {
	accepted: true;
}

interface IContactDeliveryResponse {
	success?: boolean | string;
}

export class ContactDeliveryError extends Error {
	constructor(readonly kind: 'not-configured' | 'rejected' | 'network') {
		super(`Contact delivery failed: ${kind}`);
		this.name = 'ContactDeliveryError';
	}
}

@Injectable({ providedIn: 'root' })
export class ContactDeliveryService {
	private readonly _http = inject(HttpClient);
	private readonly _config = inject(CONTACT_DELIVERY_CONFIG);

	submit(message: IContactMessage): Observable<IContactDeliveryReceipt> {
		if (!this._config.endpoint) {
			return throwError(
				() => new ContactDeliveryError('not-configured'),
			);
		}
		return this._http
			.post<IContactDeliveryResponse>(
				this._config.endpoint,
				{
					email: message.email,
					message: message.message,
					_subject: this._config.subject,
					_template: 'table',
					_gotcha: '',
				},
				{ headers: { Accept: 'application/json' } },
			)
			.pipe(
				timeout({ first: 10_000 }),
				map((response) => {
					const accepted = response.success === true || response.success === 'true';
					if (!accepted) throw new ContactDeliveryError('rejected');
					return { accepted: true } as const;
				}),
				catchError((error: unknown) =>
					throwError(() =>
						error instanceof ContactDeliveryError
							? error
							: new ContactDeliveryError('network'),
					),
				),
			);
	}

	fallbackHref(message: IContactMessage): string {
		const subject = encodeURIComponent(this._config.subject);
		const body = encodeURIComponent(
			`Reply to: ${message.email}\n\n${message.message}`,
		);
		return `mailto:${this._config.fallbackEmail}?subject=${subject}&body=${body}`;
	}
}
