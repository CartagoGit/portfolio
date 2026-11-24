import { InjectionToken } from '@angular/core';

export interface IContactDeliveryConfig {
	endpoint: string;
	fallbackEmail: string;
	subject: string;
}

export const CONTACT_RECIPIENT = 'cv2mario@gmail.com';

export const DEFAULT_CONTACT_DELIVERY_CONFIG: IContactDeliveryConfig = {
	endpoint: `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_RECIPIENT)}`,
	fallbackEmail: CONTACT_RECIPIENT,
	subject: 'Portfolio contact · CartagoGit',
};

export const CONTACT_DELIVERY_CONFIG = new InjectionToken<IContactDeliveryConfig>(
	'CONTACT_DELIVERY_CONFIG',
);
