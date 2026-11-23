import * as catalog from './hero-monitor.catalog';

const {
	CHART_OPTIONS,
	CONSOLE_EFFECTS,
	DESTINATION_ICON_PATHS,
	EFFECT_OPTIONS,
	chartLabel,
} = catalog;

import { describe, expect, it } from 'vitest';

describe('hero monitor catalog', () => {
	it('owns fourteen localized chart choices', () => {
		expect(CHART_OPTIONS).toHaveLength(14);
		for (const locale of ['en', 'es', 'fr', 'de'] as const) {
			for (const chart of CHART_OPTIONS) expect(chartLabel(locale, chart.id)).toBeTruthy();
		}
	});

	it('covers every destination and console effect with stable metadata', () => {
		expect(Object.keys(DESTINATION_ICON_PATHS)).toEqual(['website', 'repository', 'documentation', 'package', 'release', 'profile']);
		expect(EFFECT_OPTIONS.map(({ id }) => id)).toEqual(['shake', 'glitch', 'float', 'spectrum']);
		expect(CONSOLE_EFFECTS).toHaveLength(7);
	});
});
