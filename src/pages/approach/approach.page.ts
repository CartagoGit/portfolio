import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	signal,
} from '@angular/core';
import { CAPABILITIES, FALLBACK_CAPABILITY } from '../../domain/data';
import type { ICapability, ICapabilityId } from '../../domain/types';
import { TranslatePipe } from '../../lang/translate.pipe';
import { TranslateService } from '../../lang/translate.service';

@Component({
	selector: 'app-approach-page',
	imports: [TranslatePipe],
	templateUrl: './approach.page.html',
	styleUrl: './approach.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproachPageComponent {
	private readonly _translate = inject(TranslateService);
	readonly capabilities = CAPABILITIES;
	readonly activeCapability = signal<ICapabilityId>('product');
	readonly selectedCapability = computed<ICapability>(
		() =>
			this.capabilities.find(
				({ id }) => id === this.activeCapability()
			) ?? FALLBACK_CAPABILITY
	);
	/** Pipe-separated list of experience bullets; rendered through split('|')
	 * in the template so the translation map stays a flat string. */
	readonly experienceBullets = computed(() =>
		this._translate.instant('pages.approach.experienceBullets')
	);

	selectCapability(id: ICapabilityId): void {
		this.activeCapability.set(id);
	}
}
