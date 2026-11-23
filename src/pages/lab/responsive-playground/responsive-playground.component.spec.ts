import { TestBed } from '@angular/core/testing';
import { ResponsivePlaygroundComponent } from './responsive-playground.component';

describe('ResponsivePlaygroundComponent', () => {
	it('changes columns and compact density', async () => {
		await TestBed.configureTestingModule({ imports: [ResponsivePlaygroundComponent] }).compileComponents();
		const fixture = TestBed.createComponent(ResponsivePlaygroundComponent);
		fixture.detectChanges();
		fixture.componentInstance.columns.set(4);
		fixture.componentInstance.compact.set(true);
		fixture.detectChanges();
		expect(fixture.componentInstance.columns()).toBe(4);
		expect(fixture.nativeElement.querySelector('.responsive-playground__preview').classList.contains('is-compact')).toBe(true);
	});
});
