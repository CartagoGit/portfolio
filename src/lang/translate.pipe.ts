import {
	ChangeDetectorRef,
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
	private readonly _cdr = inject(ChangeDetectorRef);

	transform(key: string, args?: Record<string, unknown>): string {
		const signal = this._service.t(key, args);
		// Mark the host for check on every read so the pure pipe
		// refreshes whenever the underlying signal changes.
		queueMicrotask(() => this._cdr.markForCheck());
		return signal();
	}
}
