import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { EarthGlobeComponent } from './earth-globe.component';
describe('EarthGlobeComponent', () => {
	it('renders a canvas', async () => {
		await TestBed.configureTestingModule({
			imports: [EarthGlobeComponent],
		}).compileComponents();
		const fixture = TestBed.createComponent(EarthGlobeComponent);
		fixture.componentRef.setInput('depth', 'behind');
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('canvas')).toBeTruthy();
	});
	it('pauses on context loss and resumes only when the foreground globe is visible', async () => {
		await TestBed.configureTestingModule({ imports: [EarthGlobeComponent] }).compileComponents();
		const fixture = TestBed.createComponent(EarthGlobeComponent);
		fixture.componentRef.setInput('depth', 'front');
		fixture.detectChanges();
		const component = fixture.componentInstance;
		const start = vi.spyOn(component, 'start');
		const event = new Event('webglcontextlost', { cancelable: true });
		component.onContextLost(event);
		expect(event.defaultPrevented).toBe(true);
		expect(component.active()).toBe(false);
		component.onContextRestored();
		expect(start).toHaveBeenCalled();
		expect(component.active()).toBe(false);
		expect(component.renderState()).toBe('loading');
		fixture.destroy();
	});
});
