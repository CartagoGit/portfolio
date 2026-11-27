import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
	output,
} from '@angular/core';
import type {
	IEarthTextureCategory,
	IEarthTextureStyle,
	ILocale,
} from '../../../domain/types.interface';
import { TranslatePipe } from '../../../lang/translate.pipe';
import { nextRovingIndex } from './hero-monitor-motion.helper';
import {
	closeSphereLabel,
	EARTH_TEXTURE_CATEGORIES,
	EARTH_TEXTURE_OPTIONS,
	earthCategoryLabel,
	earthTextureLabel,
	earthTextureOriginLabel,
} from './earth-texture.catalog';

@Component({
	selector: 'app-earth-globe-controls',
	imports: [TranslatePipe],
	templateUrl: './earth-globe-controls.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EarthGlobeControlsComponent {
	readonly active = input(false);
	readonly locale = input.required<ILocale>();
	readonly category = input.required<IEarthTextureCategory>();
	readonly textureStyle = input.required<IEarthTextureStyle>();
	readonly categories = EARTH_TEXTURE_CATEGORIES;
	readonly options = computed(() =>
		EARTH_TEXTURE_OPTIONS.filter(({ category }) => category === this.category())
	);
	readonly categoryChange = output<IEarthTextureCategory>();
	readonly textureChange = output<IEarthTextureStyle>();
	readonly dismiss = output<MouseEvent>();

	categoryLabel(category: IEarthTextureCategory): string {
		return earthCategoryLabel(this.locale(), category);
	}

	textureLabel(style: IEarthTextureStyle): string {
		return earthTextureLabel(this.locale(), style);
	}

	originLabel(): string {
		return earthTextureOriginLabel(this.locale(), this.textureStyle());
	}

	closeLabel(): string {
		return closeSphereLabel(this.locale());
	}

	selectCategory(category: IEarthTextureCategory, event: Event): void {
		event.stopPropagation();
		this.categoryChange.emit(category);
		const target = event.currentTarget;
		const textureRail = target instanceof HTMLElement
			? target.closest('.hero-monitor__earth-controls')?.querySelector<HTMLElement>('.hero-monitor__earth-textures')
			: null;
		if (textureRail) {
			textureRail.scrollTop = 0;
			textureRail.scrollLeft = 0;
		}
	}

	selectTexture(style: IEarthTextureStyle, event: Event): void {
		event.stopPropagation();
		this.textureChange.emit(style);
	}

	navigateCategory(event: KeyboardEvent): void {
		const index = nextRovingIndex({
			key: event.key,
			current: this.categories.indexOf(this.category()),
			count: this.categories.length,
		});
		if (index === null) return;
		const next = this.categories[index];
		if (!next) return;
		this._moveFocus({ event, index, containerSelector: '[role="tablist"]' });
		this.categoryChange.emit(next);
		const textureRail = (event.currentTarget as HTMLElement | null)
			?.closest('.hero-monitor__earth-controls')
			?.querySelector<HTMLElement>('.hero-monitor__earth-textures');
		if (textureRail) {
			textureRail.scrollTop = 0;
			textureRail.scrollLeft = 0;
		}
	}

	navigateTexture(event: KeyboardEvent): void {
		const options = this.options();
		const current = options.findIndex(({ id }) => id === this.textureStyle());
		const index = nextRovingIndex({
			key: event.key,
			current: Math.max(0, current),
			count: options.length,
			columns: 1,
		});
		if (index === null) return;
		const next = options[index];
		if (!next) return;
		this._moveFocus({ event, index, containerSelector: '.hero-monitor__earth-textures' });
		this.textureChange.emit(next.id);
	}

	textureTabIndex(style: IEarthTextureStyle): 0 | -1 {
		const options = this.options();
		const active = options.some(({ id }) => id === this.textureStyle())
			? this.textureStyle()
			: options[0]?.id;
		return style === active ? 0 : -1;
	}

	close(event: MouseEvent): void {
		event.stopPropagation();
		this.dismiss.emit(event);
	}

	private _moveFocus(options: {
		readonly event: KeyboardEvent;
		readonly index: number;
		readonly containerSelector: string;
	}): void {
		const { event, index, containerSelector } = options;
		event.preventDefault();
		event.stopPropagation();
		const target = event.currentTarget as HTMLElement | null;
		const container = target?.closest(containerSelector);
		queueMicrotask(() => container?.querySelectorAll<HTMLButtonElement>('button')[index]?.focus());
	}
}
