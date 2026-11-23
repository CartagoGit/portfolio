import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { vi } from 'vitest';
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
				group: 'platform',
				iconPath: 'M0 0',
			},
		]);
		fixture.detectChanges();
		expect(
			fixture.nativeElement.querySelector('.profile-links__badge')?.textContent
		).toContain('GitHub');
	});

	it('scrolls to top without changing the route', async () => {
		await TestBed.configureTestingModule({
			imports: [FooterComponent, RouterTestingModule],
		}).compileComponents();
		const fixture = TestBed.createComponent(FooterComponent);
		fixture.componentRef.setInput('locale', 'en');
		fixture.componentRef.setInput('links', []);
		fixture.detectChanges();
		const emitted = vi.fn();
		fixture.componentInstance.backToTop.subscribe(emitted);
		const button = fixture.nativeElement.querySelector(
			'.footer__top'
		) as HTMLButtonElement;
		expect(button.tagName).toBe('BUTTON');
		expect(button.getAttribute('href')).toBeNull();
		button.click();
		expect(emitted).toHaveBeenCalledOnce();
	});
});
