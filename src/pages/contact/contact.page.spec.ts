import { TestBed } from '@angular/core/testing';
import { TranslateService } from '../../lang/translate.service';
import { ContactPageComponent } from './contact.page';
describe('ContactPageComponent', () => {
	it('shows feedback after submitting the form', async () => {
		await TestBed.configureTestingModule({
			imports: [ContactPageComponent],
		}).compileComponents();
		TestBed.inject(TranslateService).setLocale('en');
		const fixture = TestBed.createComponent(ContactPageComponent);
		fixture.detectChanges();
		fixture.nativeElement
			.querySelector('form')
			.dispatchEvent(new Event('submit'));
		fixture.detectChanges();
		expect(fixture.nativeElement.textContent).toContain('Thanks');
	});
});
