import { TestBed } from '@angular/core/testing';
import { GuessGameComponent } from './guess-game.component';

describe('GuessGameComponent', () => {
	it('moves high, low and correct through explicit states', async () => {
		await TestBed.configureTestingModule({ imports: [GuessGameComponent] }).compileComponents();
		const component = TestBed.createComponent(GuessGameComponent).componentInstance;
		component.secret.set(25);
		component.guessValue.set(10); component.submit();
		expect(component.state()).toBe('low');
		component.guessValue.set(40); component.submit();
		expect(component.state()).toBe('high');
		component.guessValue.set(25); component.submit();
		expect(component.state()).toBe('correct');
	});
});
