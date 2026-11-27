import { TestBed } from '@angular/core/testing';
import { RunnerGameComponent } from './runner-game.component';

describe('RunnerGameComponent', () => {
	it('jumps obstacles and loses a life on a grounded collision', async () => {
		await TestBed.configureTestingModule({ imports: [RunnerGameComponent] }).compileComponents();
		const fixture = TestBed.createComponent(RunnerGameComponent);
		const component = fixture.componentInstance;
		component.start();
		component.jump();
		component.advance(100);
		expect(component.playerY()).toBeGreaterThan(0);
		expect(component.lives()).toBe(3);
		component.playerY.set(0);
		component.obstacles.set([{ id: 9, x: 16, width: 6, passed: false }]);
		component.advance(16);
		expect(component.lives()).toBe(2);
		expect(component.statusKey()).toBe('hit');
	});

	it('exposes its phase on the host and awards cleared obstacles', async () => {
		await TestBed.configureTestingModule({ imports: [RunnerGameComponent] }).compileComponents();
		const fixture = TestBed.createComponent(RunnerGameComponent);
		fixture.detectChanges();
		const component = fixture.componentInstance;
		expect((fixture.nativeElement as HTMLElement).getAttribute('data-game-state')).toBe('ready');
		component.start();
		component.obstacles.set([{ id: 8, x: 5, width: 4, passed: false }]);
		component.advance(16);
		fixture.detectChanges();
		expect(component.score()).toBe(100);
		expect((fixture.nativeElement as HTMLElement).getAttribute('data-game-state')).toBe('running');
	});
});
