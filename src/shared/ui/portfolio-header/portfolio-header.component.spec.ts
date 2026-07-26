import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PortfolioHeaderComponent } from './portfolio-header.component';
describe('PortfolioHeaderComponent', () => {
	it('renders the active navigation state', async () => {
		await TestBed.configureTestingModule({
			imports: [PortfolioHeaderComponent, RouterTestingModule],
		}).compileComponents();
		const fixture = TestBed.createComponent(PortfolioHeaderComponent);
		fixture.componentRef.setInput('locale', 'en');
		fixture.componentRef.setInput('page', 'work');
		fixture.componentRef.setInput('copy', {
			navWork: 'Work',
			navLab: 'Lab',
			navAbout: 'About',
			availability: '',
			viewWork: '',
			contact: 'Contact',
			role: '',
			intro: '',
		});
		fixture.componentRef.setInput('languages', []);
		fixture.componentRef.setInput('menuOpen', false);
		fixture.componentRef.setInput('localeMenuOpen', false);
		fixture.componentRef.setInput('localeMenuClosing', false);
		fixture.componentRef.setInput('lightMode', false);
		fixture.componentRef.setInput('scrolled', false);
		fixture.detectChanges();
		expect(
			fixture.nativeElement.querySelector('.is-active')?.textContent
		).toContain('Work');
	});
});
