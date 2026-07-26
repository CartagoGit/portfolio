import {
	ChangeDetectionStrategy,
	Component,
	computed,
	signal,
} from '@angular/core';
import { CAPABILITIES } from '../../domain/portfolio.data';
import type { ICapabilityId } from '../../domain/portfolio.types';

@Component({
	selector: 'app-approach-page',
	templateUrl: './approach-page.component.html',
	styleUrl: './approach-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproachPageComponent {
	protected readonly _capabilities = CAPABILITIES;
	protected readonly _activeCapability = signal<ICapabilityId>('product');
	protected readonly _selectedCapability = computed(
		() =>
			this._capabilities.find(
				({ id }) => id === this._activeCapability()
			) ?? this._capabilities[0]
	);

	protected _selectCapability(id: ICapabilityId): void {
		this._activeCapability.set(id);
	}
}
