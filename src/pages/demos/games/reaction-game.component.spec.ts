import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ReactionGameComponent } from './reaction-game.component';

describe('ReactionGameComponent', () => {
	it('supports early, ready and reset reaction phases', async () => {
		vi.useFakeTimers();
		try {
			await TestBed.configureTestingModule({ imports: [ReactionGameComponent] }).compileComponents();
			const fixture = TestBed.createComponent(ReactionGameComponent);
			const component = fixture.componentInstance;
			component.start();
			expect(component.phase()).toBe('waiting');
			component.press();
			expect(component.phase()).toBe('early');
			component.start();
			vi.advanceTimersByTime(3000);
			expect(component.phase()).toBe('ready');
			component.press();
			expect(component.phase()).toBe('result');
			component.reset();
			expect(component.phase()).toBe('idle');
			fixture.destroy();
		} finally {
			vi.useRealTimers();
		}
	});
});
