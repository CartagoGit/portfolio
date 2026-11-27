import type {
	IChartType,
	IEarthTextureCategory,
	IEarthTextureOrigin,
	IEarthTextureStyle,
	ILocale,
} from '../domain/types.interface';
import type { ITranslationMap } from './types.interface';

export type ISecondaryLocale = Exclude<ILocale, 'en' | 'es' | 'fr' | 'de'>;

export type ITranslationOverlay<T = ITranslationMap> = T extends object
	? { readonly [K in keyof T]?: ITranslationOverlay<T[K]> }
	: T;

export interface IEarthLocalLabels {
	readonly categories: Readonly<Record<IEarthTextureCategory, string>>;
	readonly presets: Partial<Readonly<Record<IEarthTextureStyle, string>>>;
	readonly origins: Partial<Readonly<Record<IEarthTextureOrigin, string>>>;
	readonly closeSphere: string;
}

export interface ISecondaryLocalePack {
	readonly translation: ITranslationOverlay;
	readonly earth: IEarthLocalLabels;
}

export type ISecondaryChartLabels = Readonly<Record<IChartType, string>>;

export function mapTranslationOverlay(
	overlay: ITranslationOverlay,
	transform: (value: string) => string,
): ITranslationOverlay {
	const visit = (value: unknown): unknown => {
		if (typeof value === 'string') return transform(value);
		if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
		return Object.fromEntries(
			Object.entries(value).map(([key, child]) => [key, visit(child)]),
		);
	};
	return visit(overlay) as ITranslationOverlay;
}

export function mergeTranslationOverlay(
	base: ITranslationMap,
	overlay: ITranslationOverlay,
): ITranslationMap {
	const merge = (left: unknown, right: unknown): unknown => {
		if (!left || typeof left !== 'object' || Array.isArray(left)) return right;
		if (!right || typeof right !== 'object' || Array.isArray(right)) return right;
		const result: Record<string, unknown> = { ...left };
		for (const [key, value] of Object.entries(right)) {
			result[key] = merge(result[key], value);
		}
		return result;
	};
	return merge(base, overlay) as ITranslationMap;
}
