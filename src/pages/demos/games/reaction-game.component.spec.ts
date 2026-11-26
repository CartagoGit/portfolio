import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ReactionGameComponent } from './reaction-game.component';

describe('ReactionGameComponent', () => {
	it('supports early, go, result and reset reaction phases', async () => {
		vi.useFakeTimers();
		try {
			await TestBed.configureTestingModule({ imports: [ReactionGameComponent] }).compileComponents();
			const fixture = TestBed.createComponent(ReactionGameComponent);
			const component = fixture.componentInstance;
			component.start();
			expect(component.phase()).toBe('running');
			expect(component.cue()).toBe('waiting');
			component.press();
			expect(component.phase()).toBe('result');
			expect(component.cue()).toBe('early');
			component.start();
			vi.advanceTimersByTime(3000);
			expect(component.cue()).toBe('go');
			component.press();
			expect(component.phase()).toBe('result');
			expect(component.cue()).toBe('complete');
			const best = component.best();
			component.reset();
			expect(component.phase()).toBe('ready');
			expect(component.best()).toBe(best);
			fixture.destroy();
		} finally {
			vi.useRealTimers();
		}
	});
});
