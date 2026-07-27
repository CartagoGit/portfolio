import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeIntroComponent } from './home-intro.component';

describe('HomeIntroComponent', () => {
	it('renders the product introduction', async () => {
		await TestBed.configureTestingModule({
			imports: [HomeIntroComponent],
			providers: [provideRouter([])],
		}).compileComponents();
		const fixture = TestBed.createComponent(HomeIntroComponent);
		fixture.componentRef.setInput('locale', 'en');
		fixture.componentRef.setInput('technologies', []);
		fixture.componentRef.setInput('links', []);
		fixture.componentRef.setInput('copy', {
			navWork: 'Work',
			navLab: 'Lab',
			navAbout: 'About',
			availability: '',
			viewWork: 'Examples',
			contact: 'Contact',
			role: 'Role',
			intro: 'Intro',
		});
		fixture.detectChanges();
		expect(fixture.nativeElement.textContent).toContain('Mario Cabrero');
	});
});
