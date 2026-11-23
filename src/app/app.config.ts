import {
	provideHttpClient,
	withFetch,
} from '@angular/common/http';
import {
	type ApplicationConfig,
	provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {
	CONTACT_DELIVERY_CONFIG,
	DEFAULT_CONTACT_DELIVERY_CONFIG,
} from '../pages/contact/contact-delivery.config';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(routes, withViewTransitions()),
		provideClientHydration(),
		provideHttpClient(withFetch()),
		{
			provide: CONTACT_DELIVERY_CONFIG,
			useValue: DEFAULT_CONTACT_DELIVERY_CONFIG,
		},
	],
};
