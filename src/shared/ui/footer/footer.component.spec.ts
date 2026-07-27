import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
	it('renders every supplied public link', async () => {
		await TestBed.configureTestingModule({
			imports: [FooterComponent, RouterTestingModule],
		}).compileComponents();
		const fixture = TestBed.createComponent(FooterComponent);
		fixture.componentRef.setInput('locale', 'en');
		fixture.componentRef.setInput('links', [
			{
				label: 'GitHub',
				href: 'https://github.com/CartagoGit',
				iconPath: 'M0 0',
			},
		]);
		fixture.detectChanges();
		expect(
			fixture.nativeElement.querySelector('.footer__link')?.textContent
		).toContain('GitHub');
	});
});
