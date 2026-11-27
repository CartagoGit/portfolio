import { TestBed } from '@angular/core/testing';
import { TranslateService } from '../../../lang/translate.service';
import { ShowcaseComponent } from './showcase.component';

describe('ShowcaseComponent', () => {
	it('provides six keyboard-navigable premium scenes', async () => {
		await TestBed.configureTestingModule({ imports: [ShowcaseComponent] }).compileComponents();
		TestBed.inject(TranslateService).setLocale('es');
		const fixture = TestBed.createComponent(ShowcaseComponent);
		fixture.detectChanges();
		const component = fixture.componentInstance;
		const tabs = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('[role="tab"]');

		expect(tabs).toHaveLength(6);
		expect(fixture.nativeElement.querySelector('.showcase__cube')).toBeTruthy();
		tabs[0]?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
		fixture.detectChanges();
		expect(component.activeScene()).toBe('flow');
		expect(fixture.nativeElement.querySelector('.showcase__flow')).toBeTruthy();
	});

	it('preserves work between scenes and resets only the active scene', async () => {
		await TestBed.configureTestingModule({ imports: [ShowcaseComponent] }).compileComponents();
		const fixture = TestBed.createComponent(ShowcaseComponent);
		fixture.detectChanges();
		const component = fixture.componentInstance;
		component.pointer.set({ x: 1, y: -1 });
		component.selectScene('flow');
		component.interactScene();
		component.interactScene();
		component.selectScene('depth');
		expect(component.pointer()).toEqual({ x: 1, y: -1 });
		component.selectScene('flow');
		component.resetScene();

		expect(component.pointer()).toEqual({ x: 1, y: -1 });
		expect(component.flowVariant()).toBe(0);
		expect(component.activeScene()).toBe('flow');
	});

	it('renders and changes every distinct scene', async () => {
		await TestBed.configureTestingModule({ imports: [ShowcaseComponent] }).compileComponents();
		const fixture = TestBed.createComponent(ShowcaseComponent);
		fixture.detectChanges();
		const component = fixture.componentInstance;
		const scenes = ['depth', 'flow', 'signal', 'latency', 'particles', 'orbits'] as const;
		for (const scene of scenes) {
			component.selectScene(scene);
			component.interactScene();
			fixture.detectChanges();
			expect(fixture.nativeElement.querySelector(`.showcase__${scene}`)).toBeTruthy();
		}
		expect(component.sceneReadout()).not.toBe('');
	});
});
