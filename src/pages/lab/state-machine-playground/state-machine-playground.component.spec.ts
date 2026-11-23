import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { StateMachinePlaygroundComponent } from './state-machine-playground.component';

describe('StateMachinePlaygroundComponent', () => {
	it('drives success, error and reset states', async () => {
		vi.useFakeTimers();
		try {
			await TestBed.configureTestingModule({ imports: [StateMachinePlaygroundComponent] }).compileComponents();
			const fixture = TestBed.createComponent(StateMachinePlaygroundComponent);
			const component = fixture.componentInstance;
			component.run();
			vi.advanceTimersByTime(700);
			expect(component.state()).toBe('success');
			component.run(true);
			vi.advanceTimersByTime(700);
			expect(component.state()).toBe('error');
			component.reset();
			expect(component.state()).toBe('idle');
			fixture.destroy();
		} finally { vi.useRealTimers(); }
	});
});
