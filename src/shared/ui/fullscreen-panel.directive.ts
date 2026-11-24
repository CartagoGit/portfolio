import {
	type AfterViewInit,
	Directive,
	ElementRef,
	inject,
	input,
	type OnDestroy,
	Renderer2,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
	selector: '[appFullscreenPanel]',
	standalone: true,
	host: { '[class.is-fallback-fullscreen]': '_fallback' },
})
export class FullscreenPanelDirective implements AfterViewInit, OnDestroy {
	readonly fullscreenLabel = input('Open interactive panel fullscreen');
	readonly fullscreenExitLabel = input('Restore interactive panel size');
	private readonly _element = inject(ElementRef<HTMLElement>);
	private readonly _renderer = inject(Renderer2);
	private readonly _document = inject(DOCUMENT);
	private _button?: HTMLButtonElement;
	private _removeClick?: () => void;
	private _removeFullscreenChange?: () => void;
	private _fallback = false;

	ngAfterViewInit(): void {
		const host = this._element.nativeElement;
		this._renderer.addClass(host, 'interactive-fullscreen-host');
		const button = this._document.createElement('button');
		button.type = 'button';
		button.className = 'interactive-fullscreen-control';
		button.setAttribute('aria-label', this.fullscreenLabel());
		button.setAttribute('aria-pressed', 'false');
		button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9V5h4M15 5h4v4M19 15v4h-4M9 19H5v-4" /></svg>';
		this._renderer.appendChild(host, button);
		this._button = button;
		this._removeClick = this._renderer.listen(button, 'click', (event: MouseEvent) => {
			void this._toggle(event);
		});
		this._removeFullscreenChange = this._renderer.listen(this._document, 'fullscreenchange', () => this._sync());
	}

	ngOnDestroy(): void {
		this._removeClick?.();
		this._removeFullscreenChange?.();
		this._button?.remove();
	}

	private async _toggle(event: MouseEvent): Promise<void> {
		event.stopPropagation();
		const host = this._element.nativeElement;
		try {
			if (this._document.fullscreenElement) await this._document.exitFullscreen();
			else if (host.requestFullscreen) await host.requestFullscreen();
			else {
				this._fallback = !this._fallback;
				this._updateButton(this._fallback);
			}
		} catch {
			this._fallback = !this._fallback;
			this._updateButton(this._fallback);
		}
	}

	private _sync(): void {
		const active = this._document.fullscreenElement === this._element.nativeElement;
		this._fallback = false;
		this._updateButton(active);
	}

	private _updateButton(active: boolean): void {
		if (!this._button) return;
		this._button.setAttribute('aria-pressed', String(active));
		this._button.setAttribute('aria-label', active ? this.fullscreenExitLabel() : this.fullscreenLabel());
	}
}
