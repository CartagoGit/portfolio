import { TestBed } from '@angular/core/testing';
import { LabDashboardComponent } from './lab-dashboard.component';

describe('LabDashboardComponent', () => {
	async function createDashboard() {
		await TestBed.configureTestingModule({ imports: [LabDashboardComponent] }).compileComponents();
		return TestBed.createComponent(LabDashboardComponent);
	}

	it('offers fourteen real chart representations', async () => {
		const fixture = await createDashboard();
		fixture.detectChanges();
		const buttons = fixture.nativeElement.querySelectorAll('.lab-dashboard__chart-picker button');
		expect(buttons).toHaveLength(14);
		fixture.componentInstance.selectChart('radar');
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('.lab-dashboard__radar')).not.toBeNull();
	});

	it('changes metric data and refreshes the state-owned series', async () => {
		const fixture = await createDashboard();
		const component = fixture.componentInstance;
		component.selectMetric('quality');
		expect(component.activeMetric()).toBe('quality');
		expect(component.values()).toEqual([55, 58, 71, 67, 79, 85, 89, 94]);
		component.refresh();
		expect(component.values()).toHaveLength(8);
		expect(component.values().every((value) => value >= 35 && value <= 95)).toBe(true);
	});
});
