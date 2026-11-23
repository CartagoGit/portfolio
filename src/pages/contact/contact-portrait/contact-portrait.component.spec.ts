import { TestBed } from '@angular/core/testing';
import { ContactPortraitComponent } from './contact-portrait.component';

describe('ContactPortraitComponent', () => {
	it('renders an explicitly sized portrait with localized semantics', async () => {
		await TestBed.configureTestingModule({ imports: [ContactPortraitComponent] }).compileComponents();
		const fixture = TestBed.createComponent(ContactPortraitComponent);
		fixture.detectChanges();
		const element = fixture.nativeElement;
		const image = element.querySelector('img') as HTMLImageElement;
		expect(image.alt).toContain('Mario Cabrero Volarich');
		expect(image.width).toBe(900);
		expect(image.height).toBe(1125);
		expect(element.querySelectorAll('.contact-portrait__math')).toHaveLength(0);
		expect(element.querySelectorAll('.contact-portrait__aura span')).toHaveLength(8);
		expect(element.querySelectorAll('.contact-portrait__inner-aura path')).toHaveLength(4);
		expect(element.querySelector('.contact-portrait__frame .contact-portrait__inner-aura')).not.toBeNull();
		expect(element.querySelector('.contact-portrait__inner-aura text')).toBeNull();
		expect(element.querySelector('.contact-portrait figcaption')?.textContent).toContain('Mario Cabrero Volarich · Cartago · 2026');
	});
});
