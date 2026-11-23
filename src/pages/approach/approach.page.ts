import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	type ElementRef,
	inject,
	PLATFORM_ID,
	signal,
	viewChild,
} from '@angular/core';
import { CAPABILITIES, FALLBACK_CAPABILITY } from '../../domain/data';
import type { ICapability, ICapabilityId } from '../../domain/types';
import { TranslatePipe } from '../../lang/translate.pipe';
import { TranslateService } from '../../lang/translate.service';
import { contentKey } from '../../lang/content-key';

interface ICapabilityVisual {
	iconPath: string;
	example: string;
}

const CAPABILITY_VISUALS: Readonly<Record<ICapabilityId, ICapabilityVisual>> = {
	product: {
		iconPath: 'M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z',
		example: 'Dense workflows with clear next actions, role-aware forms and deliberate empty states.',
	},
	architecture: {
		iconPath: 'M12 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM5 15a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm14 0a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM10.5 8.5 6.2 15m7.3-6.5 4.3 6.5M8 18h8',
		example: 'Standalone Angular, explicit signals and typed boundaries keep monitor, renderer and shell independently testable.',
	},
	mobile: {
		iconPath: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm1 3v12h8V5H8Zm2 14h4v1h-4v-1Z',
		example: 'Responsive web journeys that can move to Android with Capacitor without shrinking the desktop interface.',
	},
	quality: {
		iconPath: 'M12 2 4 5v6c0 5.2 3.3 9.5 8 11 4.7-1.5 8-5.8 8-11V5l-8-3Zm-1.2 13.8-4-4 1.4-1.4 2.6 2.6 5.7-5.7 1.4 1.4-7.1 7.1Z',
		example: 'Unit gates, browser smoke, focus checks and production/SSR builds validate the same states users receive.',
	},
	systems: {
		iconPath: 'M3 3h8v8H3V3Zm10 0h8v8h-8V3ZM3 13h8v8H3v-8Zm10 0h8v8h-8v-8Zm-1-8h1v2h-1V5ZM5 12h2v1H5v-1Z',
		example: 'Tokens, card contracts and shared motion primitives keep monitor, Work and future routes coherent rather than cloned.',
	},
	tooling: {
		iconPath: 'M3 4h18v16H3V4Zm3 3 4 4-4 4v-3l1-1-1-1V7Zm7 8h5v2h-5v-2Z',
		example: 'DelendAI, QuickModel and Keyer turn repeated engineering work into typed, reviewable CLI and MCP workflows.',
	},
};

@Component({
	selector: 'app-approach-page',
	imports: [TranslatePipe],
	templateUrl: './approach.page.html',
	styleUrl: './approach.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproachPageComponent {
	private readonly _document = inject(DOCUMENT);
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _translate = inject(TranslateService);
	private readonly _detail = viewChild<ElementRef<HTMLElement>>('detail');

	readonly capabilities = computed<readonly ICapability[]>(() =>
		CAPABILITIES.map((capability) => ({
			...capability,
			eyebrow: this._translate.instant(
				`content.capabilities.${capability.id}.eyebrow`,
			),
			title: this._translate.instant(
				`content.capabilities.${capability.id}.title`,
			),
			detail: this._translate.instant(
				`content.capabilities.${capability.id}.detail`,
			),
			proof: this._translate.instant(
				`content.capabilities.${capability.id}.proof`,
			),
		})),
	);
	readonly activeCapability = signal<ICapabilityId>('product');
	readonly selectedCapability = computed<ICapability>(
		() =>
			this.capabilities().find(({ id }) => id === this.activeCapability()) ??
			FALLBACK_CAPABILITY
	);
	readonly selectedVisual = computed(
		() => CAPABILITY_VISUALS[this.activeCapability()]
	);
	readonly selectedIndex = computed(() =>
		this.capabilities().findIndex(({ id }) => id === this.activeCapability())
	);
	/** Pipe-separated list of experience bullets; rendered through split('|')
	 * in the template so the translation map stays a flat string. */
	readonly experienceBullets = computed(() =>
		this._translate.instant('pages.approach.experienceBullets')
	);

	capabilityExample(id: ICapabilityId): string {
		return this._translate.instant(`content.capabilities.${id}.example`);
	}

	termLabel(value: string): string {
		return this._translate.instant(`content.terms.${contentKey(value)}`);
	}

	selectCapability(id: ICapabilityId): void {
		if (id === this.activeCapability()) return;
		this.activeCapability.set(id);
		queueMicrotask(() => this._animateDetail());
	}

	onTabKeydown(event: KeyboardEvent, index: number): void {
		const delta =
			event.key === 'ArrowRight' || event.key === 'ArrowDown'
				? 1
				: event.key === 'ArrowLeft' || event.key === 'ArrowUp'
					? -1
					: 0;
		if (!delta && event.key !== 'Home' && event.key !== 'End') return;
		event.preventDefault();
		const targetIndex =
			event.key === 'Home'
				? 0
				: event.key === 'End'
					? this.capabilities().length - 1
					: (index + delta + this.capabilities().length) %
						this.capabilities().length;
		const target = this.capabilities()[targetIndex];
		if (!target) return;
		this.selectCapability(target.id);
		queueMicrotask(() => {
			const tab = this._document.querySelector<HTMLButtonElement>(
				`#capability-tab-${target.id}`
			);
			tab?.focus();
		});
	}

	private _animateDetail(): void {
		if (!isPlatformBrowser(this._platformId)) return;
		if (
			typeof window.matchMedia === 'function' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		)
			return;
		const element = this._detail()?.nativeElement;
		if (!element || typeof element.animate !== 'function') return;
		element.animate(
			[
				{ opacity: 0.45, transform: 'translateY(10px)' },
				{ opacity: 1, transform: 'translateY(0)' },
			],
			{ duration: 260, easing: 'cubic-bezier(.22, 1, .36, 1)' }
		);
	}
}
