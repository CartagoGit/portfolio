import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { RpsGameComponent } from './rps-game.component';

describe('RpsGameComponent', () => {
	it('reveals a result once and updates round metrics safely', async () => {
		vi.useFakeTimers();
		vi.spyOn(Math, 'random').mockReturnValue(0.7);
		try {
			await TestBed.configureTestingModule({ imports: [RpsGameComponent] }).compileComponents();
			const component = TestBed.createComponent(RpsGameComponent).componentInstance;
			component.play('rock');
			component.play('paper');
			expect(component.phase()).toBe('running');
			expect(component.round()).toBe(1);
			vi.advanceTimersByTime(300);
			expect(component.outcome()).toBe('win');
			expect(component.score()).toBe(1);
			expect(component.phase()).toBe('result');
		} finally {
			vi.restoreAllMocks();
			vi.useRealTimers();
		}
	});
});
