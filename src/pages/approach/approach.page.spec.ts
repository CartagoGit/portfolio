import { TestBed } from '@angular/core/testing';
import { ApproachPageComponent } from './approach.page';

describe('ApproachPageComponent', () => {
	it('renders one complete visual per capability and stable selection', async () => {
		await TestBed.configureTestingModule({
			imports: [ApproachPageComponent],
		}).compileComponents();
		const fixture = TestBed.createComponent(ApproachPageComponent);
		fixture.detectChanges();
		const element = fixture.nativeElement as HTMLElement;
		const tabs = element.querySelectorAll<HTMLButtonElement>(
			'[role="tab"]'
		);

		expect(tabs).toHaveLength(6);
		expect(element.querySelectorAll('#main-content')).toHaveLength(0);
		tabs[1]?.click();
		fixture.detectChanges();
		const panel = element.querySelector<HTMLElement>('[role="tabpanel"]');
		expect(panel?.dataset['capability']).toBe('architecture');
		expect(panel?.getAttribute('aria-labelledby')).toBe('capability-tab-architecture');
		expect(panel?.querySelector('svg path')?.getAttribute('d')).toBeTruthy();
		expect(panel?.querySelector('.approach-page__example')?.textContent?.trim().length).toBeGreaterThan(40);
		expect(panel?.querySelector('footer')?.textContent?.trim().length).toBeGreaterThan(20);
	});

	it('supports tab keyboard navigation and roving tabindex', async () => {
		await TestBed.configureTestingModule({
			imports: [ApproachPageComponent],
		}).compileComponents();
		const fixture = TestBed.createComponent(ApproachPageComponent);
		fixture.detectChanges();
		const element = fixture.nativeElement as HTMLElement;
		const tabs = element.querySelectorAll<HTMLButtonElement>('[role="tab"]');
		const first = tabs[0];
		first?.focus();
		first?.dispatchEvent(
			new KeyboardEvent('keydown', { key: 'End', bubbles: true })
		);
		fixture.detectChanges();
		await fixture.whenStable();

		expect(fixture.componentInstance.activeCapability()).toBe('tooling');
		expect(tabs[5]?.getAttribute('tabindex')).toBe('0');
		expect(tabs[0]?.getAttribute('tabindex')).toBe('-1');
	});
});
