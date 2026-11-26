import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { DiceGameComponent } from './dice-game.component';

describe('DiceGameComponent', () => {
	it('rolls a bounded face and keeps six recent results', async () => {
		vi.useFakeTimers();
		vi.spyOn(Math, 'random').mockReturnValue(0.99);
		try {
			await TestBed.configureTestingModule({ imports: [DiceGameComponent] }).compileComponents();
			const component = TestBed.createComponent(DiceGameComponent).componentInstance;
			for (let index = 0; index < 8; index += 1) {
				component.roll();
				expect(component.phase()).toBe('running');
				vi.advanceTimersByTime(400);
			}
			expect(component.value()).toBe(6);
			expect(component.rolls()).toHaveLength(6);
			expect(component.round()).toBe(8);
			expect(component.phase()).toBe('result');
			component.reset();
			expect(component.phase()).toBe('ready');
		} finally {
			vi.restoreAllMocks();
			vi.useRealTimers();
		}
	});
});
