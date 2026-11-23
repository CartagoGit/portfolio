import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { TranslateService } from '../../../lang/translate.service';
import { MemoryGameComponent } from './memory-game.component';

describe('MemoryGameComponent', () => {
	it('matches pairs and resets without mutating the two-copy deck', async () => {
		vi.useFakeTimers();
		try {
			await TestBed.configureTestingModule({ imports: [MemoryGameComponent] }).compileComponents();
			const fixture = TestBed.createComponent(MemoryGameComponent);
			const component = fixture.componentInstance;
			const values = component.values();
			const first = 0;
			const second = values.findIndex((value, index) => index > 0 && value === values[first]);
			component.openCard(first);
			component.openCard(second);
			vi.advanceTimersByTime(300);
			expect(component.matched()).toEqual([first, second]);
			expect(component.moves()).toBe(1);
			component.reset();
			expect(component.matched()).toEqual([]);
			expect(component.moves()).toBe(0);
			expect([...component.values()].sort((a, b) => a - b)).toEqual([
				0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5,
			]);
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
