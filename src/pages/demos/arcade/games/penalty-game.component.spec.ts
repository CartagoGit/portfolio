import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { PenaltyGameComponent } from './penalty-game.component';

describe('PenaltyGameComponent', () => {
	it('finishes a five-shot penalty after three or more goals', async () => {
		vi.spyOn(Math, 'random').mockReturnValue(.99);
		try {
			await TestBed.configureTestingModule({ imports: [PenaltyGameComponent] }).compileComponents();
			const component = TestBed.createComponent(PenaltyGameComponent).componentInstance;
			component.start();
			component.selectZone(0);
			for (let shot = 0; shot < 5; shot += 1) component.shoot();
			expect(component.shots()).toBe(5);
			expect(component.goals()).toBe(5);
			expect(component.phase()).toBe('won');
		} finally {
			vi.restoreAllMocks();
		}
	});

	it('records a save when the selected zone matches the keeper', async () => {
		vi.spyOn(Math, 'random').mockReturnValue(.4);
		try {
			await TestBed.configureTestingModule({ imports: [PenaltyGameComponent] }).compileComponents();
			const component = TestBed.createComponent(PenaltyGameComponent).componentInstance;
			component.start();
			component.shoot();
			expect(component.lastResult()).toBe('saved');
			expect(component.goals()).toBe(0);
			expect(component.lives()).toBe(4);
		} finally {
			vi.restoreAllMocks();
		}
	});

	it('does not shoot when Enter bubbles from a zone button', async () => {
		await TestBed.configureTestingModule({ imports: [PenaltyGameComponent] }).compileComponents();
		const fixture = TestBed.createComponent(PenaltyGameComponent);
		const component = fixture.componentInstance;
		component.start();
		fixture.detectChanges();
		const zone = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.penalty-game__zone');
		zone?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		fixture.detectChanges();
		expect(component.shots()).toBe(0);
	});
});
