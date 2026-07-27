import {
	ChangeDetectionStrategy,
	Component,
	computed,
	signal,
} from '@angular/core';
import { CAPABILITIES } from '../../domain/data';
import type { ICapability, ICapabilityId } from '../../domain/types';

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
	templateUrl: './approach.page.html',
	styleUrl: './approach.page.scss',
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
