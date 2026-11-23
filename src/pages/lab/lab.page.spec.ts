import { TestBed } from '@angular/core/testing';
import { LabPageComponent } from './lab.page';

describe('LabPageComponent', () => {
	it('composes the chart lab and seven distinct interaction playgrounds', async () => {
		await TestBed.configureTestingModule({
			imports: [LabPageComponent],
		}).compileComponents();
		const fixture = TestBed.createComponent(LabPageComponent);
		fixture.detectChanges();
		const element = fixture.nativeElement as HTMLElement;
		expect(element.querySelector('app-lab-dashboard')).not.toBeNull();
		expect(element.querySelectorAll('.lab-page__experiment-grid > *')).toHaveLength(7);
		expect(element.querySelectorAll('app-workflow-playground')).toHaveLength(1);
		expect(element.querySelectorAll('app-motion-playground')).toHaveLength(1);
		expect(element.querySelectorAll('app-accessibility-playground')).toHaveLength(1);
		expect(element.querySelectorAll('app-concurrency-playground')).toHaveLength(1);
		expect(element.querySelectorAll('app-responsive-playground')).toHaveLength(1);
		expect(element.querySelectorAll('app-data-playground')).toHaveLength(1);
		expect(element.querySelectorAll('app-state-machine-playground')).toHaveLength(1);
	});
});
