import {
	inject,
	Pipe,
	type PipeTransform,
} from '@angular/core';
import { TranslateService } from './translate.service';

/**
 * Pure translation pipe.
 *
 * Mirrors the well-known `@ngx-translate/core` API:
 *   {{ 'chrome.header.navWork' | translate }}
 *   {{ 'hello' | translate:{ name: 'Cartago' } }}
 *
 * The pipe is `pure: false` so a locale change re-renders the
 * host component. Resolution goes through
 * `TranslateService.t(key, args)` which itself returns a
 * `computed<string>`, so any signal updated in the dependency
 * graph triggers re-evaluation.
 */
@Pipe({
	name: 'translate',
	pure: false,
	standalone: true,
})
export class TranslatePipe implements PipeTransform {
	private readonly _service = inject(TranslateService);

	transform(key: string, args?: Record<string, unknown>): string {
		// The signal is read while the template renders, so Angular tracks
		// it and refreshes the host when the locale changes. Scheduling
		// `markForCheck` from here would re-dirty the view on every pass
		// and never settle (NG0103, a hung SSR render).
		return this._service.t(key, args)();
	}
}
