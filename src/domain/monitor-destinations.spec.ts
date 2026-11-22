import { describe, expect, it } from 'vitest';
import { PUBLIC_LINKS, TECHNOLOGY_MARQUEE } from './data';
import { monitorDestinations, technologyDestinations } from './monitor-destinations';

describe('monitor destinations', () => {
	it('covers every technology exposed by the portfolio', () => {
		for (const technology of TECHNOLOGY_MARQUEE) {
			const destinations = technologyDestinations(technology.label);
			expect(destinations.length, technology.label).toBeGreaterThan(0);
			expect(
				destinations.every(({ href }) => href.startsWith('https://')),
				technology.label
			).toBe(true);
		}
	});

	it('covers every public project destination shown on home', () => {
		for (const project of PUBLIC_LINKS.filter(({ group }) => group === 'project')) {
			const destinations = monitorDestinations({
				kind: 'project',
				label: project.label,
				detail: project.detail ?? '',
				href: project.href,
				stack: [],
			});
			expect(destinations.length, project.label).toBeGreaterThan(0);
		}
	});
});
