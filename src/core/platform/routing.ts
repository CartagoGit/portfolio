import type { ILocale, IPageComponentId } from '../../domain/types';

/**
 * Canonical page order used by the shell to reason about navigation
 * direction (forward vs. backward in the page-rise / route transitions).
 */
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

/// Returns the navigation direction between the active and target page so
/// the view transition can swap its enter animation accordingly.
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
