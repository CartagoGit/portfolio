import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	type ElementRef,
	inject,
	input,
	type OnDestroy,
	output,
	PLATFORM_ID,
	signal,
	viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { routeFor } from '../../../core/platform/routing.helper';
import { TranslatePipe } from '../../../lang/translate.pipe';
import { TranslateService } from '../../../lang/translate.service';
import type { ILocale, IPageComponentId } from '../../../domain/types.interface';
import { type IPortfolioSearchResult, PortfolioSearchService } from '../../../core/search/portfolio-search.service';

@Component({
	selector: 'app-command-palette',
	imports: [RouterLink, TranslatePipe],
	templateUrl: './command-palette.component.html',
	styleUrl: './command-palette.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPaletteComponent implements OnDestroy {
	readonly open = input.required<boolean>();
	readonly locale = input.required<ILocale>();
	readonly close = output<void>();
	readonly navigate = output<IPageComponentId>();
	readonly query = signal('');
	private readonly _document = inject(DOCUMENT);
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _translate = inject(TranslateService);
	private readonly _searchService = inject(PortfolioSearchService);
	private readonly _dialog = viewChild<ElementRef<HTMLElement>>('dialog');
	private readonly _searchInput = viewChild<ElementRef<HTMLInputElement>>('search');
	private _previousFocus?: HTMLElement;
	private _previousBodyOverflow = '';
	private _wasOpen = false;

	readonly visibleCommands = computed(() => this._searchService.search(this.query()));
	readonly routeFor = (page: IPageComponentId): string[] =>
		routeFor(page, this.locale());

	select(result: IPortfolioSearchResult): void {
		this.navigate.emit(result.page);
		this.requestClose();
	}

	resultKindIcon(kind: IPortfolioSearchResult['kind']): string {
		const icons: Record<IPortfolioSearchResult['kind'], string> = {
			route: '→', project: '◆', technology: '⌘', demo: '✦', platform: '↗', content: '⌕',
		};
		return icons[kind];
	}

	resultKindLabel(kind: IPortfolioSearchResult['kind']): string {
		const keys: Record<IPortfolioSearchResult['kind'], string> = {
			route: 'chrome.commandPalette.searchKindRoute',
			project: 'chrome.commandPalette.searchKindProject',
			technology: 'chrome.commandPalette.searchKindTechnology',
			demo: 'chrome.commandPalette.searchKindDemo',
			platform: 'chrome.commandPalette.searchKindPlatform',
			content: 'chrome.commandPalette.searchKindContent',
		};
		return this._translate.instant(keys[kind]);
	}

	requestClose(): void {
		if (this.open()) this.close.emit();
	}

	updateQuery(event: Event): void {
		this.query.set((event.currentTarget as HTMLInputElement).value);
	}

	onKeydown(event: KeyboardEvent): void {
		if (!this.open()) return;
		if (event.key === 'Escape') {
			event.preventDefault();
			this.requestClose();
			return;
		}
		if (event.key !== 'Tab') return;
		const focusable = this._focusableElements();
		const first = focusable[0];
		const last = focusable.at(-1);
		if (!first || !last) return;
		const active = this._document.activeElement;
		if (event.shiftKey && (active === first || !focusable.includes(active as HTMLElement))) {
			event.preventDefault();
			last.focus();
			return;
		}
		if (!event.shiftKey && (active === last || !focusable.includes(active as HTMLElement))) {
			event.preventDefault();
			first.focus();
		}
	}

	ngOnDestroy(): void {
		if (this._wasOpen) this._leavePalette();
		this._openSync.destroy();
	}

	private _enterPalette(): void {
		this._wasOpen = true;
		const active = this._document.activeElement;
		this._previousFocus = active instanceof HTMLElement ? active : undefined;
		this._previousBodyOverflow = this._document.body.style.overflow;
		this._document.body.style.overflow = 'hidden';
		this._searchInput()?.nativeElement.focus();
	}

	private _leavePalette(): void {
		this._wasOpen = false;
		this.query.set('');
		this._document.body.style.overflow = this._previousBodyOverflow;
		const previous = this._previousFocus;
		if (previous && this._document.contains(previous)) previous.focus();
		this._previousFocus = undefined;
	}

	private _focusableElements(): HTMLElement[] {
		const dialog = this._dialog()?.nativeElement;
		if (!dialog) return [];
		return Array.from(
			dialog.querySelectorAll<HTMLElement>(
				'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
			)
		);
	}

	private readonly _openSync = effect(() => {
		const shouldOpen = this.open();
		if (!isPlatformBrowser(this._platformId)) return;
		queueMicrotask(() => {
			if (this.open() !== shouldOpen) return;
			if (shouldOpen && !this._wasOpen) this._enterPalette();
			else if (!shouldOpen && this._wasOpen) this._leavePalette();
		});
	});
}
