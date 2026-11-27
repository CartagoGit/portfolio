import { TestBed } from '@angular/core/testing';
import { RpgBattleGameComponent } from './rpg-battle-game.component';

describe('RpgBattleGameComponent', () => {
	it('advances through exactly three turn-based enemy waves', async () => {
		await TestBed.configureTestingModule({ imports: [RpgBattleGameComponent] }).compileComponents();
		const fixture = TestBed.createComponent(RpgBattleGameComponent);
		const component = fixture.componentInstance;
		component.start();
		component.enemyHp.set(1);
		component.act('attack');
		expect(component.wave()).toBe(2);
		component.enemyHp.set(1);
		component.act('attack');
		expect(component.wave()).toBe(3);
		component.enemyHp.set(1);
		component.act('attack');
		fixture.detectChanges();
		expect(component.phase()).toBe('won');
		expect(component.score()).toBeGreaterThan(1000);
		expect((fixture.nativeElement as HTMLElement).getAttribute('data-game-state')).toBe('won');
	});

	it('reduces enemy damage while guarding', async () => {
		await TestBed.configureTestingModule({ imports: [RpgBattleGameComponent] }).compileComponents();
		const component = TestBed.createComponent(RpgBattleGameComponent).componentInstance;
		component.start();
		component.act('guard');
		expect(component.lives()).toBeGreaterThan(90);
		expect(component.guarded()).toBe(false);
	});
});
