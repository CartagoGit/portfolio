import { TestBed } from '@angular/core/testing';
import { GuessGameComponent } from './guess-game.component';

describe('GuessGameComponent', () => {
	it('moves high, low and correct through explicit phases and narrows the range', async () => {
		await TestBed.configureTestingModule({ imports: [GuessGameComponent] }).compileComponents();
		const component = TestBed.createComponent(GuessGameComponent).componentInstance;
		component.secret.set(25);
		component.guessValue.set(10);
		component.submit();
		expect(component.state()).toBe('low');
		expect(component.lowerBound()).toBe(11);
		expect(component.phase()).toBe('running');
		component.guessValue.set(40);
		component.submit();
		expect(component.state()).toBe('high');
		expect(component.upperBound()).toBe(39);
		component.guessValue.set(25);
		component.submit();
		expect(component.state()).toBe('correct');
		expect(component.phase()).toBe('result');
		const attempts = component.attempts();
		component.submit();
		expect(component.attempts()).toBe(attempts);
	});
});
