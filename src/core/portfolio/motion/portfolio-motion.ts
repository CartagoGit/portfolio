import type { HeroPanelTransition } from '../../../domain/portfolio/portfolio.types';

export const HERO_PANEL_TRANSITIONS: readonly HeroPanelTransition[] = ['slide', 'flip', 'scan'];

/** Selects a different entry transition without coupling UI state to randomness. */
export function nextHeroPanelTransition(
  current: HeroPanelTransition,
  random: () => number = Math.random,
): HeroPanelTransition {
  const candidates = HERO_PANEL_TRANSITIONS.filter((transition) => transition !== current);
  return candidates[Math.min(candidates.length - 1, Math.floor(random() * candidates.length))];
}
