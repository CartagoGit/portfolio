import { inject, Pipe, type PipeTransform } from '@angular/core';
import { TranslateService } from '../../../lang/translate.service';
import type { IArcadeCopyKey } from '../../../lang/arcade.translation';

@Pipe({ name: 'arcadeText', pure: false, standalone: true })
export class ArcadeTextPipe implements PipeTransform {
	private readonly _translate = inject(TranslateService);

	transform(key: IArcadeCopyKey, args?: Record<string, unknown>): string {
		return this._translate.t(`pages.demos.arcade.${key}`, args)();
	}
}
