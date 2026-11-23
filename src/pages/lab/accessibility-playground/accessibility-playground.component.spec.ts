import { TestBed } from '@angular/core/testing';
import { AccessibilityPlaygroundComponent } from './accessibility-playground.component';

describe('AccessibilityPlaygroundComponent', () => {
	it('exposes contrast state and validates the focusable form preview', async () => {
		await TestBed.configureTestingModule({ imports: [AccessibilityPlaygroundComponent] }).compileComponents();
		const component = TestBed.createComponent(AccessibilityPlaygroundComponent).componentInstance;
		const normalRatio = component.ratio();
		component.toggleContrast();
		expect(Number(component.ratio())).toBeGreaterThan(Number(normalRatio));
		component.testForm();
		expect(component.emailInvalid()).toBe(true);
		expect(component.submitted()).toBe(false);
		component.email.setValue('person@example.test');
		component.testForm();
		expect(component.submitted()).toBe(true);
	});
});
