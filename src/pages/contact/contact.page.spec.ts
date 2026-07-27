import { TestBed } from '@angular/core/testing';
import { ContactPageComponent } from './contact.page';
describe('ContactPageComponent', () => {
	it('shows feedback after submitting the form', async () => {
		await TestBed.configureTestingModule({
			imports: [ContactPageComponent],
		}).compileComponents();
		const fixture = TestBed.createComponent(ContactPageComponent);
		fixture.detectChanges();
		fixture.nativeElement
			.querySelector('form')
			.dispatchEvent(new Event('submit'));
		fixture.detectChanges();
		expect(fixture.nativeElement.textContent).toContain('Thanks');
	});
});
