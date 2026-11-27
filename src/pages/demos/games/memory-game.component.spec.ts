import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { TranslateService } from '../../../lang/translate.service';
import { MemoryGameComponent } from './memory-game.component';

describe('MemoryGameComponent', () => {
	afterEach(() => TestBed.inject(TranslateService).setLocale('en'));

	it('matches pairs and completes an explicit round before reset', async () => {
		vi.useFakeTimers();
		try {
			await TestBed.configureTestingModule({ imports: [MemoryGameComponent] }).compileComponents();
			const fixture = TestBed.createComponent(MemoryGameComponent);
			const component = fixture.componentInstance;
			for (const first of [0, 1, 2, 3, 4, 5]) {
				const firstIndex = component.values().findIndex(
					(value, index) => value === first && !component.matched().includes(index)
				);
				const secondIndex = component.values().findIndex(
					(value, index) => index !== firstIndex && value === first && !component.matched().includes(index)
				);
				component.openCard(firstIndex);
				component.openCard(secondIndex);
				vi.advanceTimersByTime(300);
			}
			expect(component.matched()).toHaveLength(12);
			expect(component.moves()).toBe(6);
			expect(component.phase()).toBe('result');
			expect(component.best()).toBe(6);
			component.reset();
			expect(component.phase()).toBe('ready');
			expect(component.matched()).toEqual([]);
			expect([...component.values()].sort((a, b) => a - b)).toEqual([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
			fixture.destroy();
		} finally {
			vi.useRealTimers();
		}
	});

	it('localizes state-specific card labels', async () => {
		await TestBed.configureTestingModule({ imports: [MemoryGameComponent] }).compileComponents();
		TestBed.inject(TranslateService).setLocale('es');
		const component = TestBed.createComponent(MemoryGameComponent).componentInstance;
		expect(component.label(0, 2)).toBe('Carta oculta de memoria 1');
		component.open.set([0]);
		expect(component.label(0, 2)).toBe('Carta abierta 3');
	});
});
