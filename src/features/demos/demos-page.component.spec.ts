import { TestBed } from '@angular/core/testing';
import { DemosPageComponent } from './demos-page.component';
describe('DemosPageComponent', () => {
	it('moves the signal target after a successful hit', async () => {
		await TestBed.configureTestingModule({
			imports: [DemosPageComponent],
		}).compileComponents();
		const fixture = TestBed.createComponent(DemosPageComponent);
		fixture.detectChanges();
		fixture.nativeElement.querySelectorAll('button')[4].click();
		fixture.detectChanges();
		expect(fixture.nativeElement.textContent).toContain('1');
	});
});
