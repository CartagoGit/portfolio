import { InjectionToken } from '@angular/core';

export interface IContactDeliveryConfig {
	endpoint: string;
	fallbackEmail: string;
	subject: string;
}

export const DEFAULT_CONTACT_DELIVERY_CONFIG: IContactDeliveryConfig = {
	endpoint: 'https://formsubmit.co/ajax/cv2mario@gmail.com',
	fallbackEmail: 'cv2mario@gmail.com',
	subject: 'Portfolio contact · CartagoGit',
};

export const CONTACT_DELIVERY_CONFIG = new InjectionToken<IContactDeliveryConfig>(
	'CONTACT_DELIVERY_CONFIG',
);
