import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ConcurrencyPlaygroundComponent } from './concurrency-playground.component';

describe('ConcurrencyPlaygroundComponent', () => {
	it('completes parallel tasks and supports cancellation', async () => {
		vi.useFakeTimers();
		try {
			await TestBed.configureTestingModule({ imports: [ConcurrencyPlaygroundComponent] }).compileComponents();
			const fixture = TestBed.createComponent(ConcurrencyPlaygroundComponent);
			const component = fixture.componentInstance;
			component.run();
			vi.advanceTimersByTime(1700);
			expect(component.complete()).toBe(true);
			component.run();
			component.cancel();
			expect(Object.values(component.statuses())).toEqual(['idle', 'idle', 'idle']);
			fixture.destroy();
		} finally {
			vi.useRealTimers();
		}
	});
});
