import { TestBed } from '@angular/core/testing';
import { ShooterGameComponent } from './shooter-game.component';

describe('ShooterGameComponent', () => {
	it('scores a target hit and creates the next timed target', async () => {
		await TestBed.configureTestingModule({ imports: [ShooterGameComponent] }).compileComponents();
		const component = TestBed.createComponent(ShooterGameComponent).componentInstance;
		component.start();
		const firstTarget = component.target();
		component.aim.set({ x: firstTarget.x, y: firstTarget.y });
		component.fire();
		expect(component.hits()).toBe(1);
		expect(component.score()).toBeGreaterThan(100);
		expect(component.target().id).not.toBe(firstTarget.id);
	});

	it('expires targets, consumes lives and keeps the aim bounded', async () => {
		await TestBed.configureTestingModule({ imports: [ShooterGameComponent] }).compileComponents();
		const component = TestBed.createComponent(ShooterGameComponent).componentInstance;
		component.start();
		component.target.update((target) => ({ ...target, remainingMs: 5 }));
		component.advance(10);
		expect(component.lives()).toBe(2);
		component.aim.set({ x: 94, y: 90 });
		component.moveAim(20, 20);
		expect(component.aim()).toEqual({ x: 94, y: 90 });
	});
});
