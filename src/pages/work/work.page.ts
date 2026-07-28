import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
} from '@angular/core';
import { TranslatePipe } from '../../lang/translate.pipe';
import { TranslateService } from '../../lang/translate.service';

@Component({
	selector: 'app-work-page',
	imports: [TranslatePipe],
	templateUrl: './work.page.html',
	styleUrl: './work.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkPageComponent {
	private readonly _translate = inject(TranslateService);
	readonly mcpBullets = computed(() =>
		this._translate.instant('pages.work.mcpBullets')
	);
	readonly quickmodelBullets = computed(() =>
		this._translate.instant('pages.work.quickmodelBullets')
	);
	readonly keyerBullets = computed(() =>
		this._translate.instant('pages.work.keyerBullets')
	);
}
