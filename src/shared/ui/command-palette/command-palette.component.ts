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

interface ICommandDefinition {
	page: IPageComponentId;
	icon: string;
	labelKey: string;
}

const COMMANDS: readonly ICommandDefinition[] = [
	{
		page: 'work',
		icon: '↗',
		labelKey: 'chrome.commandPalette.cmdViewWork',
	},
	{
		page: 'lab',
		icon: '✦',
		labelKey: 'chrome.commandPalette.cmdLab',
	},
	{
		page: 'contact',
		icon: '→',
		labelKey: 'chrome.commandPalette.cmdContact',
	},
];

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
	private readonly _dialog = viewChild<ElementRef<HTMLElement>>('dialog');
	private readonly _search = viewChild<ElementRef<HTMLInputElement>>('search');
	private _previousFocus?: HTMLElement;
	private _previousBodyOverflow = '';
	private _wasOpen = false;

	readonly visibleCommands = computed(() => {
		this._translate.translations();
		const query = this.query().trim().toLocaleLowerCase(this.locale());
		if (!query) return COMMANDS;
		return COMMANDS.filter(({ page, labelKey }) => {
			const label = this._translate.instant(labelKey);
			return `${page} ${label}`.toLocaleLowerCase(this.locale()).includes(query);
		});
	});

	private readonly _openSync = effect(() => {
		const shouldOpen = this.open();
		if (!isPlatformBrowser(this._platformId)) return;
		queueMicrotask(() => {
			if (this.open() !== shouldOpen) return;
			if (shouldOpen && !this._wasOpen) this._enterPalette();
			else if (!shouldOpen && this._wasOpen) this._leavePalette();
		});
	});

	readonly routeFor = (page: IPageComponentId): string[] =>
		routeFor(page, this.locale());

	select(page: IPageComponentId): void {
		this.navigate.emit(page);
		this.requestClose();
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
		this._search()?.nativeElement.focus();
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
}
