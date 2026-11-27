import { TestBed } from '@angular/core/testing';
import { LaneRushGameComponent } from './lane-rush-game.component';

describe('LaneRushGameComponent', () => {
	it('changes lanes and collects crystals only in the active lane', async () => {
		await TestBed.configureTestingModule({ imports: [LaneRushGameComponent] }).compileComponents();
		const component = TestBed.createComponent(LaneRushGameComponent).componentInstance;
		component.start();
		component.moveLane(-1);
		component.entities.set([{ id: 30, lane: 0, y: 80, kind: 'crystal' }]);
		component.advance(16);
		expect(component.lane()).toBe(0);
		expect(component.score()).toBe(200);
		expect(component.entities()).toEqual([]);
	});

	it('removes a life when traffic reaches the player', async () => {
		await TestBed.configureTestingModule({ imports: [LaneRushGameComponent] }).compileComponents();
		const component = TestBed.createComponent(LaneRushGameComponent).componentInstance;
		component.start();
		component.entities.set([{ id: 31, lane: 1, y: 78, kind: 'traffic' }]);
		component.advance(16);
		expect(component.lives()).toBe(2);
		expect(component.statusKey()).toBe('hit');
	});
});
