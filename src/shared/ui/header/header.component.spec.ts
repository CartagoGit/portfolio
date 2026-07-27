import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';
describe('HeaderComponent', () => {
	it('renders the active navigation state', async () => {
		await TestBed.configureTestingModule({
			imports: [HeaderComponent, RouterTestingModule],
		}).compileComponents();
		const fixture = TestBed.createComponent(HeaderComponent);
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
