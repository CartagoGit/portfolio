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
		component.onTabsKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
		fixture.detectChanges();
		expect(component.activeScene()).toBe('flow');
		expect(fixture.nativeElement.querySelector('.showcase__flow')).toBeTruthy();
	});

	it('resets direct-manipulation state without hiding the selected scene', async () => {
		await TestBed.configureTestingModule({ imports: [ShowcaseComponent] }).compileComponents();
		const fixture = TestBed.createComponent(ShowcaseComponent);
		fixture.detectChanges();
		const component = fixture.componentInstance;
		component.pointer.set({ x: 1, y: -1 });
		component.resetScene();

		expect(component.pointer()).toEqual({ x: 0, y: 0 });
		expect(component.activeScene()).toBe('depth');
		expect(component.signalRevision()).toBe(1);
	});

	it('changes every scene through the explicit interaction control', async () => {
		await TestBed.configureTestingModule({ imports: [ShowcaseComponent] }).compileComponents();
		const fixture = TestBed.createComponent(ShowcaseComponent);
		fixture.detectChanges();
		const component = fixture.componentInstance;
		component.selectScene('flow');
		component.interactScene();
		expect(component.flowVariant()).toBe(1);
		component.selectScene('signal');
		const before = component.signalBars();
		component.interactScene();
		expect(component.signalBars()).not.toEqual(before);
		component.selectScene('particles');
		component.interactScene();
		expect(component.particleSeed()).toBe(1);
	});
});
