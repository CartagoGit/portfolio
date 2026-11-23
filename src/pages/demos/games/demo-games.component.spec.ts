import { TestBed } from '@angular/core/testing';
import { DemoGamesComponent } from './demo-games.component';

describe('DemoGamesComponent', () => {
	it('uses roving tabs and moves focus with arrow keys', async () => {
		await TestBed.configureTestingModule({ imports: [DemoGamesComponent] }).compileComponents();
		const fixture = TestBed.createComponent(DemoGamesComponent);
		fixture.detectChanges();
		const element = fixture.nativeElement as HTMLElement;
		const tabs = element.querySelectorAll<HTMLButtonElement>('[role="tab"]');
		expect(tabs).toHaveLength(8);
		tabs[0]?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
		await fixture.whenStable();
		fixture.detectChanges();
		expect(fixture.componentInstance.activeGame()).toBe('reaction');
		expect(fixture.componentInstance.transitionAlternate()).toBe(true);
		expect(tabs[1]?.getAttribute('aria-selected')).toBe('true');
		expect(document.activeElement).toBe(tabs[1]);
	});
});
