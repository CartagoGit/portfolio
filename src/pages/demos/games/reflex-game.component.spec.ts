import { TestBed } from '@angular/core/testing';
import { ReflexGameComponent } from './reflex-game.component';

describe('ReflexGameComponent', () => {
	it('scores only the active target and resets the round', async () => {
		await TestBed.configureTestingModule({ imports: [ReflexGameComponent] }).compileComponents();
		const component = TestBed.createComponent(ReflexGameComponent).componentInstance;
		const target = component.target();
		component.hit((target + 1) % component.cells.length);
		expect(component.score()).toBe(0);
		component.hit(target);
		expect(component.score()).toBe(1);
		component.reset();
		expect(component.score()).toBe(0);
		expect(component.target()).toBe(4);
	});
});
