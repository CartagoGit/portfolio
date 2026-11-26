import { TestBed } from '@angular/core/testing';
import { MazeCollectorGameComponent } from './maze-collector-game.component';

describe('MazeCollectorGameComponent', () => {
	it('blocks walls and collects crystals while moving through the maze', async () => {
		await TestBed.configureTestingModule({ imports: [MazeCollectorGameComponent] }).compileComponents();
		const component = TestBed.createComponent(MazeCollectorGameComponent).componentInstance;
		component.start();
		component.move(-1, 0);
		expect(component.player()).toEqual({ x: 1, y: 1 });
		component.player.set({ x: 6, y: 1 });
		component.move(1, 0);
		expect(component.player()).toEqual({ x: 7, y: 1 });
		expect(component.crystals()).toHaveLength(3);
		expect(component.score()).toBe(100);
	});

	it('advances the guardian patrol and respawns after a collision', async () => {
		await TestBed.configureTestingModule({ imports: [MazeCollectorGameComponent] }).compileComponents();
		const component = TestBed.createComponent(MazeCollectorGameComponent).componentInstance;
		component.start();
		const initialGuardian = component.guardian();
		component.advance(650);
		expect(component.guardian()).not.toEqual(initialGuardian);
		component.player.set({ x: 6, y: 5 });
		component.guardian.set({ x: 5, y: 5 });
		component.move(-1, 0);
		expect(component.lives()).toBe(2);
		expect(component.player()).toEqual({ x: 1, y: 1 });
	});

	it('prioritizes guardian collision over collecting the final crystal', async () => {
		await TestBed.configureTestingModule({ imports: [MazeCollectorGameComponent] }).compileComponents();
		const component = TestBed.createComponent(MazeCollectorGameComponent).componentInstance;
		component.start();
		component.player.set({ x: 1, y: 1 });
		component.guardian.set({ x: 2, y: 1 });
		component.crystals.set([{ x: 2, y: 1 }]);
		component.move(1, 0);
		expect(component.lives()).toBe(2);
		expect(component.crystals()).toHaveLength(1);
		expect(component.phase()).toBe('running');
	});
});
