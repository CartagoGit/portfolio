import { describe, expect, it } from 'vitest';
import { HERO_PANELS, PUBLIC_LINKS, TECHNOLOGY_MARQUEE } from './data.constant';
import { monitorDestinations, technologyDestinations } from './monitor-destinations.helper';

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

	it('keeps technologies alphabetical and substantively described', () => {
		const labels = TECHNOLOGY_MARQUEE.map(({ label }) => label);
		const sorted = [...labels].sort((left, right) =>
			left.localeCompare(right, 'en', { sensitivity: 'base' })
		);
		expect(labels).toEqual(sorted);
		for (const technology of TECHNOLOGY_MARQUEE) {
			expect(technology.detail, technology.label).toBeTruthy();
			expect(technology.detail?.length, technology.label).toBeGreaterThan(60);
			expect(technology.detail, technology.label).not.toContain('part of the toolkit');
		}
	});

	it('uses the same curated project importance order in every home surface', () => {
		const expected = ['DelendAI', 'Tanit', 'QuickModel', 'Print CV', 'Steam Keys', 'Keyer'];
		expect(HERO_PANELS.map(({ label }) => label)).toEqual(expected);
		expect(
			PUBLIC_LINKS.filter(({ group }) => group === 'project').map(({ label }) =>
				label === 'API Source Tanit' ? 'Tanit' : label
			)
		).toEqual(expected);
	});

	it('never exposes duplicate, non-HTTPS or invented project destinations', () => {
		for (const project of PUBLIC_LINKS.filter(({ group }) => group === 'project')) {
			const destinations = monitorDestinations({
				kind: 'project',
				label: project.label,
				detail: project.detail ?? '',
				stack: [],
			});
			const hrefs = destinations.map(({ href }) => href);
			expect(hrefs.every((href) => href.startsWith('https://')), project.label).toBe(true);
			expect(new Set(hrefs).size, project.label).toBe(hrefs.length);
		}
		expect(monitorDestinations({
			kind: 'project', label: 'DelendAI', detail: '', stack: [],
		}).some(({ kind }) => kind === 'website')).toBe(false);
		expect(monitorDestinations({
			kind: 'project', label: 'Tanit', detail: '', stack: [],
		}).some(({ kind }) => kind === 'release')).toBe(false);
	});
});
