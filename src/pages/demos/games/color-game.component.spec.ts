import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ColorGameComponent } from './color-game.component';

describe('ColorGameComponent', () => {
	it('scores only the matching swatch', async () => {
		vi.spyOn(Math, 'random').mockReturnValue(0);
		await TestBed.configureTestingModule({ imports: [ColorGameComponent] }).compileComponents();
		const component = TestBed.createComponent(ColorGameComponent).componentInstance;
		component.choose(1);
		expect(component.score()).toBe(0);
		component.choose(component.target());
		expect(component.score()).toBe(1);
		vi.restoreAllMocks();
	});
});
