import { TestBed } from '@angular/core/testing';
import { DemoGamesComponent } from './demo-games.component';
import { ReflexGameComponent } from './reflex-game.component';

describe('DemoGamesComponent', () => {
	it('uses roving tabs and preserves mounted games when focus moves', async () => {
		await TestBed.configureTestingModule({ imports: [DemoGamesComponent] }).compileComponents();
		const fixture = TestBed.createComponent(DemoGamesComponent);
		fixture.detectChanges();
		const element = fixture.nativeElement as HTMLElement;
		const tabs = element.querySelectorAll<HTMLButtonElement>('[role="tab"]');
		const reflex = fixture.debugElement.query((node) => node.componentInstance instanceof ReflexGameComponent)?.componentInstance as ReflexGameComponent;
		reflex.score.set(4);

		tabs[0]?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
		await fixture.whenStable();
		fixture.detectChanges();
		expect(fixture.componentInstance.activeGame()).toBe('reaction');
		expect(fixture.componentInstance.transitionAlternate()).toBe(true);
		expect(tabs[1]?.getAttribute('aria-selected')).toBe('true');
		expect(document.activeElement).toBe(tabs[1]);
		expect(reflex.score()).toBe(4);
		expect(element.querySelectorAll('.demo-games__panel')).toHaveLength(8);
	}, 10_000);
});
