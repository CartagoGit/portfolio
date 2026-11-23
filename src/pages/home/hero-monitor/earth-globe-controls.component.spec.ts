import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { EarthGlobeControlsComponent } from './earth-globe-controls.component';

describe('EarthGlobeControlsComponent', () => {
	it('renders the selected category and emits isolated changes', async () => {
		await TestBed.configureTestingModule({ imports: [EarthGlobeControlsComponent] }).compileComponents();
		const fixture = TestBed.createComponent(EarthGlobeControlsComponent);
		fixture.componentRef.setInput('locale', 'es');
		fixture.componentRef.setInput('active', true);
		fixture.componentRef.setInput('category', 'earth');
		fixture.componentRef.setInput('textureStyle', 'clouds');
		fixture.detectChanges();
		const component = fixture.componentInstance;
		const element = fixture.nativeElement as HTMLElement;
		expect(element.querySelectorAll('.hero-monitor__earth-textures button')).toHaveLength(6);

		const category = vi.fn();
		const texture = vi.fn();
		component.categoryChange.subscribe(category);
		component.textureChange.subscribe(texture);
		component.selectCategory('balls', new Event('click'));
		component.selectTexture('rugby', new Event('click'));
		expect(category).toHaveBeenCalledWith('balls');
		expect(texture).toHaveBeenCalledWith('rugby');
	});
});
