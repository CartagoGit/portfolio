import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { RpsGameComponent } from './rps-game.component';

describe('RpsGameComponent', () => {
	it('scores a win and keeps draws neutral', async () => {
		vi.spyOn(Math, 'random').mockReturnValue(.7);
		await TestBed.configureTestingModule({ imports: [RpsGameComponent] }).compileComponents();
		const component = TestBed.createComponent(RpsGameComponent).componentInstance;
		component.play('rock');
		expect(component.outcome()).toBe('win');
		expect(component.score()).toBe(1);
		vi.restoreAllMocks();
	});
});
