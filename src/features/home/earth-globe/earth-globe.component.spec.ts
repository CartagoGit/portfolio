import { TestBed } from '@angular/core/testing';
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
});
