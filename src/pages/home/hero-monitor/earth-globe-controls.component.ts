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
	}

	selectTexture(style: IEarthTextureStyle, event: Event): void {
		event.stopPropagation();
		this.textureChange.emit(style);
	}

	close(event: MouseEvent): void {
		event.stopPropagation();
		this.dismiss.emit(event);
	}
}
