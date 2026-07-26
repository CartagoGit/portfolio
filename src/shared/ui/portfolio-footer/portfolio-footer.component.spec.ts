import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PortfolioFooterComponent } from './portfolio-footer.component';

describe('PortfolioFooterComponent', () => {
	it('renders every supplied public link', async () => {
		await TestBed.configureTestingModule({
			imports: [PortfolioFooterComponent, RouterTestingModule],
		}).compileComponents();
		const fixture = TestBed.createComponent(PortfolioFooterComponent);
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
			fixture.nativeElement.querySelector('.portfolio-footer__link')
				?.textContent
		).toContain('GitHub');
	});
});
