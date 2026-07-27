import { TestBed } from '@angular/core/testing';
import { ApproachPageComponent } from './approach.page';
describe('ApproachPageComponent', () => {
	it('keeps capability selection inside the feature', async () => {
		await TestBed.configureTestingModule({
			imports: [ApproachPageComponent],
		}).compileComponents();
		const fixture = TestBed.createComponent(ApproachPageComponent);
		fixture.detectChanges();
		fixture.nativeElement.querySelectorAll('button')[1].click();
		fixture.detectChanges();
		expect(fixture.nativeElement.textContent).toContain(
			'Explicitly reactive'
		);
	});
});
