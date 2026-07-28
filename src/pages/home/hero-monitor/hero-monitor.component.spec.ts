import { TestBed } from '@angular/core/testing';
import { HeroMonitorComponent } from './hero-monitor.component';

describe('HeroMonitorComponent', () => {
	it('renders the interactive monitor', async () => {
		await TestBed.configureTestingModule({
			imports: [HeroMonitorComponent],
		}).compileComponents();
		const fixture = TestBed.createComponent(HeroMonitorComponent);
		fixture.detectChanges();
		expect(
			fixture.nativeElement.querySelector('.hero-monitor__interface')
		).toBeTruthy();
	});
});
