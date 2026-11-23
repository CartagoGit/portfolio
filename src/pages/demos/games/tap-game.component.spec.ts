import { TestBed } from '@angular/core/testing';
import { TapGameComponent } from './tap-game.component';

describe('TapGameComponent', () => {
	it('stops at the goal and resets to a new round', async () => {
		await TestBed.configureTestingModule({ imports: [TapGameComponent] }).compileComponents();
		const component = TestBed.createComponent(TapGameComponent).componentInstance;
		for (let index = 0; index < 20; index += 1) component.tap();
		expect(component.taps()).toBe(component.goal());
		component.reset();
		expect(component.taps()).toBe(0);
	});
});
