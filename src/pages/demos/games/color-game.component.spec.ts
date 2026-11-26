import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ColorGameComponent } from './color-game.component';

describe('ColorGameComponent', () => {
	it('scores matching swatches and completes after five choices', async () => {
		vi.spyOn(Math, 'random').mockReturnValue(0);
		try {
			await TestBed.configureTestingModule({ imports: [ColorGameComponent] }).compileComponents();
			const component = TestBed.createComponent(ColorGameComponent).componentInstance;
			component.choose(0);
			expect(component.round()).toBe(0);
			component.start();
			component.choose(1);
			component.choose(component.target());
			for (let choice = 2; choice < 5; choice += 1) component.choose((component.target() + 1) % component.colors.length);
			expect(component.score()).toBe(1);
			expect(component.phase()).toBe('result');
			expect(component.round()).toBe(5);
			component.reset();
			expect(component.phase()).toBe('ready');
		} finally {
			vi.restoreAllMocks();
		}
	});
});
