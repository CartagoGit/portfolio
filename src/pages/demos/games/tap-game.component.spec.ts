import { TestBed } from '@angular/core/testing';
import { TapGameComponent } from './tap-game.component';

describe('TapGameComponent', () => {
	it('starts, stops at the goal and replays with a new round', async () => {
		await TestBed.configureTestingModule({ imports: [TapGameComponent] }).compileComponents();
		const component = TestBed.createComponent(TapGameComponent).componentInstance;
		component.tap();
		expect(component.phase()).toBe('running');
		for (let index = 0; index < 20; index += 1) component.tap();
		expect(component.taps()).toBe(component.goal());
		expect(component.phase()).toBe('result');
		component.tap();
		expect(component.taps()).toBe(component.goal());
		component.start();
		expect(component.phase()).toBe('running');
		expect(component.round()).toBe(2);
		component.reset();
		expect(component.phase()).toBe('ready');
		expect(component.taps()).toBe(0);
	});
});
