import {
	ChangeDetectionStrategy,
	Component,
	computed,
	signal,
} from '@angular/core';
import { CAPABILITIES } from '../../domain/portfolio.data';
import type { CapabilityId } from '../../domain/portfolio.types';

@Component({
	selector: 'app-approach-page',
	templateUrl: './approach-page.component.html',
	styleUrl: './approach-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproachPageComponent {
	protected readonly capabilities = CAPABILITIES;
	protected readonly activeCapability = signal<CapabilityId>('product');
	protected readonly selectedCapability = computed(
		() =>
			this.capabilities.find(
				({ id }) => id === this.activeCapability()
			) ?? this.capabilities[0]
	);

	protected selectCapability(id: CapabilityId): void {
		this.activeCapability.set(id);
	}
}
