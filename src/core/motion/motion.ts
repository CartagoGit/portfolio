import type { IHeroPanelTransition } from '../../domain/types';

export const HERO_PANEL_TRANSITIONS: readonly IHeroPanelTransition[] = [
	'slide',
	'flip',
	'scan',
];

/** Selects a different entry transition without coupling UI state to randomness. */
export function nextHeroPanelTransition(
	current: IHeroPanelTransition,
	random: () => number = Math.random
): IHeroPanelTransition {
	const candidates = HERO_PANEL_TRANSITIONS.filter(
		(transition) => transition !== current
	);
	const index = Math.min(
		candidates.length - 1,
		Math.floor(random() * candidates.length)
	);
	// `candidates` is never empty here: we only filter out the single
	// `current` entry, and HERO_PANEL_TRANSITIONS has at least two members.
	return candidates[index]!;
}
