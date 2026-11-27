import { TestBed } from '@angular/core/testing';
import { ReflexGameComponent } from './reflex-game.component';

describe('ReflexGameComponent', () => {
	it('scores only the active target and completes a guarded round', async () => {
		await TestBed.configureTestingModule({ imports: [ReflexGameComponent] }).compileComponents();
		const component = TestBed.createComponent(ReflexGameComponent).componentInstance;
		component.start();
		component.hit((component.target() + 1) % component.cells.length);
		expect(component.misses()).toBe(1);
		for (let hit = 0; hit < component.targetCount; hit += 1) component.hit(component.target());
		expect(component.score()).toBe(component.targetCount);
		expect(component.phase()).toBe('result');
		component.hit(component.target());
		expect(component.score()).toBe(component.targetCount);
		component.reset();
		expect(component.phase()).toBe('ready');
		expect(component.score()).toBe(0);
		expect(component.target()).toBe(4);
	});
});
