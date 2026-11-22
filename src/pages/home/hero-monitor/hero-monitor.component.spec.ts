import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { HeroMonitorComponent } from './hero-monitor.component';

describe('HeroMonitorComponent', () => {
	it('renders the interactive monitor', async () => {
		await TestBed.configureTestingModule({
			imports: [HeroMonitorComponent],
		}).compileComponents();
		const fixture = TestBed.createComponent(HeroMonitorComponent);
		fixture.componentRef.setInput('locale', 'es');
		fixture.componentRef.setInput('technologies', []);
		fixture.detectChanges();
		expect(
			fixture.nativeElement.querySelector('.hero-monitor__interface')
		).toBeTruthy();
		expect(
			fixture.nativeElement.querySelector('.hero-monitor__destinations')
		).toBeTruthy();
	});

	it('returns to its resting pose after an external preview loses hover', async () => {
		vi.useFakeTimers();
		try {
			await TestBed.configureTestingModule({
				imports: [HeroMonitorComponent],
			}).compileComponents();
			const fixture = TestBed.createComponent(HeroMonitorComponent);
			fixture.componentRef.setInput('locale', 'es');
			fixture.componentRef.setInput('technologies', []);
			fixture.detectChanges();
			const component = fixture.componentInstance;
			component.showPreview({
				kind: 'platform',
				label: 'GitHub',
				detail: 'Public profile',
				stack: [],
				href: 'https://github.com/CartagoGit',
			});
			vi.advanceTimersByTime(720);
			component.showPreview(null);
			vi.advanceTimersByTime(180);
			expect(component.monitorExpanded()).toBe(false);
			expect(component.activePreview()?.label).toBe('GitHub');
			fixture.destroy();
		} finally {
			vi.useRealTimers();
		}
	});
});
