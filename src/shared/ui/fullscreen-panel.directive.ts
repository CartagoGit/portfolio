import {
	type AfterViewInit,
	Directive,
	effect,
	ElementRef,
	inject,
	input,
	type OnDestroy,
	Renderer2,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FullscreenCoordinatorService } from '../../core/platform/fullscreen-coordinator.service';

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
	private readonly _fullscreen = inject(FullscreenCoordinatorService);
	private _button?: HTMLButtonElement;
	private _removeClick?: () => void;
	private _removeFullscreenChange?: () => void;
	private _fallback = false;
	private readonly _stateSync = effect(() => {
		const active = this._fullscreen.active() === this._element.nativeElement;
		this._fallback = active;
		this._updateButton(active);
	});

	ngAfterViewInit(): void {
		const host = this._element.nativeElement;
		this._renderer.addClass(host, 'interactive-fullscreen-host');
		const existing = Array.from(host.children as unknown as Element[]).filter(
			(child): child is HTMLButtonElement =>
				child.nodeName === 'BUTTON' && child.getAttribute('data-fullscreen-control') === 'panel',
		);
		const button = existing.shift() ?? this._document.createElement('button');
		for (const duplicate of existing) duplicate.remove();
		button.type = 'button';
		button.className = 'interactive-fullscreen-control';
		button.setAttribute('data-fullscreen-control', 'panel');
		button.setAttribute('aria-label', this.fullscreenLabel());
		button.setAttribute('aria-pressed', 'false');
		button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9V5h4M15 5h4v4M19 15v4h-4M9 19H5v-4" /></svg>';
		if (!button.parentElement) this._renderer.appendChild(host, button);
		this._button = button;
		this._removeClick = this._renderer.listen(button, 'click', (event: MouseEvent) => {
			void this._toggle(event);
		});
		this._removeFullscreenChange = this._renderer.listen(this._document, 'fullscreenchange', () => this._sync());
	}

	ngOnDestroy(): void {
		this._removeClick?.();
		this._removeFullscreenChange?.();
		this._fullscreen.deactivate(this._element.nativeElement);
		this._button?.remove();
		this._stateSync.destroy();
	}

	private async _toggle(event: MouseEvent): Promise<void> {
		event.stopPropagation();
		const host = this._element.nativeElement;
		if (this._fullscreen.active() === host) this._fullscreen.deactivate(host);
		else this._fullscreen.activate(host);
	}

	private _sync(): void {
		this._fallback = this._fullscreen.active() === this._element.nativeElement;
		this._updateButton(this._fallback);
	}

	private _updateButton(active: boolean): void {
		if (!this._button) return;
		this._button.setAttribute('aria-pressed', String(active));
		this._button.setAttribute('aria-label', active ? this.fullscreenExitLabel() : this.fullscreenLabel());
	}
}
