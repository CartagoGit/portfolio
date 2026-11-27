import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TranslateService } from '../../lang/translate.service';
import { PortfolioSearchService } from './portfolio-search.service';

describe('PortfolioSearchService', () => {
	afterEach(() => TestBed.inject(TranslateService).setLocale('en'));

	it('finds route, project, technology and demo catalogue entries', () => {
		TestBed.inject(TranslateService).setLocale('en');
		const service = TestBed.inject(PortfolioSearchService);
		const kinds = new Set(service.search('Angular').map(({ kind }) => kind));
		expect(kinds.has('technology')).toBe(true);
		expect(service.search('Tetris').some(({ kind, label }) => kind === 'demo' && label === 'Tetris')).toBe(true);
		expect(service.search('DelendAI').some(({ kind, page }) => kind === 'project' && page === 'work')).toBe(true);
	});

	it('searches localized content and returns bounded useful snippets', () => {
		TestBed.inject(TranslateService).setLocale('es');
		const results = TestBed.inject(PortfolioSearchService).search('contenedor');
		expect(results.length).toBeGreaterThan(0);
		expect(results.length).toBeLessThanOrEqual(24);
		expect(results.every(({ detail }) => detail.length > 0)).toBe(true);
	});
});
