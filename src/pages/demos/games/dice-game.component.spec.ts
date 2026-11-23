import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { DiceGameComponent } from './dice-game.component';

describe('DiceGameComponent', () => {
	it('rolls a bounded face and keeps six recent rolls', async () => {
		vi.spyOn(Math, 'random').mockReturnValue(.99);
		await TestBed.configureTestingModule({ imports: [DiceGameComponent] }).compileComponents();
		const component = TestBed.createComponent(DiceGameComponent).componentInstance;
		for (let index = 0; index < 8; index += 1) component.roll();
		expect(component.value()).toBe(6);
		expect(component.rolls()).toHaveLength(6);
		vi.restoreAllMocks();
	});
});
