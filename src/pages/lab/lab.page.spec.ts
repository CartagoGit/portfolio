import { TestBed } from '@angular/core/testing';
import { LabPageComponent } from './lab.page';

describe('LabPageComponent', () => {
	it('changes the selected telemetry metric', async () => {
		await TestBed.configureTestingModule({
			imports: [LabPageComponent],
		}).compileComponents();
		const fixture = TestBed.createComponent(LabPageComponent);
		fixture.detectChanges();
		fixture.componentInstance.setTelemetry('quality');
		expect(fixture.componentInstance.activeTelemetry()).toBe('quality');
	});
});
