import { TestBed } from '@angular/core/testing';
import { ContactPortraitComponent } from './contact-portrait.component';

describe('ContactPortraitComponent', () => {
	it('renders an explicitly sized portrait with localized semantics', async () => {
		await TestBed.configureTestingModule({ imports: [ContactPortraitComponent] }).compileComponents();
		const fixture = TestBed.createComponent(ContactPortraitComponent);
		fixture.detectChanges();
		const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;
		expect(image.alt).toContain('Mario Cabrero Volarich');
		expect(image.width).toBe(900);
		expect(image.height).toBe(1125);
	});
});
