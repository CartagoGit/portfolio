import { TestBed } from '@angular/core/testing';
import type { ILocale } from '../../domain/types.interface';
import { TranslateService } from '../../lang/translate.service';
import { DemosPageComponent } from './demos.page';

async function createPage(locale: ILocale = 'en') {
	await TestBed.configureTestingModule({
		imports: [DemosPageComponent],
	}).compileComponents();
	TestBed.inject(TranslateService).setLocale(locale);
	const fixture = TestBed.createComponent(DemosPageComponent);
	fixture.detectChanges();
	return fixture;
}

describe('DemosPageComponent', () => {
	it('composes interactive games before five correctly marked demos', async () => {
		const fixture = await createPage();
		const element = fixture.nativeElement as HTMLElement;
		expect(element.querySelector('app-demos-showcase')).not.toBeNull();
		expect(element.querySelectorAll('app-demos-showcase [role="tab"]')).toHaveLength(3);
		expect(element.querySelector('app-demo-games')).not.toBeNull();
		expect(element.querySelectorAll('.demo-games__tabs [role="tab"]')).toHaveLength(8);
		expect(element.querySelectorAll('.demos-page__links > a')).toHaveLength(5);
		for (const link of element.querySelectorAll<HTMLAnchorElement>('.demos-page__links > a')) {
			expect(link.href.startsWith('https://')).toBe(true);
		}
		for (const demo of fixture.componentInstance.demos) {
			expect(Boolean(demo.iconPath || demo.imageSrc), demo.title).toBe(true);
		}
	});

	it('localizes external summaries and accessible section labels', async () => {
		const fixture = await createPage('es');
		const element = fixture.nativeElement as HTMLElement;
		expect(element.querySelector('.demos-page__links')?.getAttribute('aria-label'))
			.toBe('Demos interactivas externas');
		expect(element.textContent).toContain('Interacción de producto con estado');
		expect(element.textContent).not.toContain('Stateful product interaction');
		expect(element.textContent).not.toContain('pages.demos.');
	});
});
