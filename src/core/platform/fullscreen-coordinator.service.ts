import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

interface IInertSnapshot {
	readonly element: HTMLElement;
	readonly inert: boolean;
}

/** Owns one isolated product surface and disables every unrelated branch. */
@Injectable({ providedIn: 'root' })
export class FullscreenCoordinatorService {
	private readonly _document = inject(DOCUMENT);
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _active = signal<HTMLElement | null>(null);
	private readonly _snapshots: IInertSnapshot[] = [];
	private _previousFocus?: HTMLElement;
	private _previousOverflow = '';
	private _listening = false;

	readonly active = this._active.asReadonly();

	activate(target: HTMLElement): void {
		if (!isPlatformBrowser(this._platformId)) return;
		if (this._active() === target) return;
		this.deactivate();
		this._previousFocus = this._document.activeElement instanceof HTMLElement
			? this._document.activeElement
			: undefined;
		this._previousOverflow = this._document.body.style.overflow;
		this._document.body.style.overflow = 'hidden';
		this._document.documentElement.classList.add('portfolio-fullscreen-mode');

		let branch: Element | null = target;
		while (branch?.parentElement && branch.parentElement !== this._document.body) {
			for (const sibling of Array.from(branch.parentElement.children)) {
				if (sibling === branch || !(sibling instanceof HTMLElement)) continue;
				this._snapshots.push({ element: sibling, inert: sibling.inert });
				sibling.inert = true;
				sibling.setAttribute('data-fullscreen-inert', '');
			}
			branch = branch.parentElement;
		}

		this._active.set(target);
		if (!this._listening) {
			this._document.addEventListener('keydown', this._onKeydown, true);
			this._listening = true;
		}
	}

	deactivate(target?: HTMLElement): void {
		if (target && this._active() !== target) return;
		for (const snapshot of this._snapshots.splice(0)) {
			snapshot.element.inert = snapshot.inert;
			snapshot.element.removeAttribute('data-fullscreen-inert');
		}
		this._active.set(null);
		this._document.documentElement.classList.remove('portfolio-fullscreen-mode');
		this._document.body.style.overflow = this._previousOverflow;
		if (this._listening) {
			this._document.removeEventListener('keydown', this._onKeydown, true);
			this._listening = false;
		}
		const focus = this._previousFocus;
		queueMicrotask(() => {
			if (focus && this._document.contains(focus)) focus.focus();
		});
		this._previousFocus = undefined;
	}

	private readonly _onKeydown = (event: KeyboardEvent): void => {
		if (event.key !== 'Escape') return;
		event.preventDefault();
		event.stopImmediatePropagation();
		this.deactivate();
	};
}
