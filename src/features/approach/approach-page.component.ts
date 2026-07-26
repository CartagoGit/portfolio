import {
	ChangeDetectionStrategy,
	Component,
	computed,
	signal,
} from '@angular/core';
import { CAPABILITIES } from '../../domain/portfolio.data';
import type { ICapability, ICapabilityId } from '../../domain/portfolio.types';

const FALLBACK_CAPABILITY: ICapability = {
	id: 'product',
	eyebrow: '',
	title: '',
	detail: '',
	tools: [],
	proof: '',
};

@Component({
	selector: 'app-approach-page',
	templateUrl: './approach-page.component.html',
	styleUrl: './approach-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproachPageComponent {
	readonly capabilities = CAPABILITIES;
	readonly activeCapability = signal<ICapabilityId>('product');
	readonly selectedCapability = computed<ICapability>(
		() =>
			this.capabilities.find(
				({ id }) => id === this.activeCapability()
			) ?? FALLBACK_CAPABILITY
	);

	selectCapability(id: ICapabilityId): void {
		this.activeCapability.set(id);
	}
}
