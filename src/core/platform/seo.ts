import type { ILocale, IPageComponentId } from '../../domain/types';

export const PAGE_ORDER: readonly IPageComponentId[] = [
	'home',
	'work',
	'lab',
	'approach',
	'knowledge',
	'docker',
	'demos',
	'contact',
] as const;

const PAGE_TITLES: Readonly<
	Record<ILocale, Readonly<Record<IPageComponentId, string>>>
> = {
	en: {
		home: 'Frontend product engineer',
		work: 'Pinned projects',
		lab: 'Frontend lab',
		approach: 'Approach',
		knowledge: 'Knowledge',
		docker: 'Docker',
		demos: 'Demos',
		contact: 'Contact',
	},
	es: {
		home: 'Frontend product engineer',
		work: 'Proyectos destacados',
		lab: 'Laboratorio frontend',
		approach: 'Enfoque',
		knowledge: 'Conocimientos',
		docker: 'Docker',
		demos: 'Demos',
		contact: 'Contacto',
	},
} as const;

const PAGE_DESCRIPTIONS: Readonly<Record<ILocale, string>> = {
	en: 'Mario Cabrero Volarich’s portfolio: product frontend, Angular, TypeScript, mobile delivery and developer tooling.',
	es: 'Portfolio de Mario Cabrero Volarich: frontend de producto, Angular, TypeScript, móvil y tooling.',
} as const;

/// Builds the `<title>` string from the active page + locale.
export function buildTitle(locale: ILocale, page: IPageComponentId): string {
	return `Cartago · ${PAGE_TITLES[locale][page]}`;
}

/// Builds the meta description shown in the result page of every locale.
export function buildDescription(locale: ILocale): string {
	return PAGE_DESCRIPTIONS[locale];
}

/// Returns the navigation direction between the active and target page so the
/// view transition can swap its enter animation accordingly.
export function transitionDirection(
	current: IPageComponentId,
	target: IPageComponentId
): 'forward' | 'backward' {
	return PAGE_ORDER.indexOf(target) >= PAGE_ORDER.indexOf(current)
		? 'forward'
		: 'backward';
}

/**
 * Builds the Angular router URL segments for a page + locale pair. Home
 * collapses to `['/', locale]` so the localized home URL never carries the
 * redundant `home` segment.
 */
export function routeFor(page: IPageComponentId, locale: ILocale): string[] {
	return page === 'home' ? ['/', locale] : ['/', locale, page];
}
