import { TestBed } from '@angular/core/testing';
import { WorkPageComponent } from './work.page';
import { TranslateService } from '../../lang/translate.service';

describe('WorkPageComponent', () => {
	it('renders the public pinned projects as one evidence system', async () => {
		await TestBed.configureTestingModule({
			imports: [WorkPageComponent],
		}).compileComponents();
		const fixture = TestBed.createComponent(WorkPageComponent);
		fixture.detectChanges();
		const element = fixture.nativeElement as HTMLElement;
		const cards = element.querySelectorAll('.work-page__card');

		expect(fixture.componentInstance.projects).toHaveLength(6);
		expect(cards).toHaveLength(6);
		expect(
			[...cards].map((card) => card.querySelector('h3')?.textContent?.trim())
		).toEqual(['DelendAI', 'Tanit', 'QuickModel', 'Print CV', 'Steam Keys', 'Keyer']);
		for (const card of cards) {
			expect(card.querySelector('.work-page__status')?.textContent).toBeTruthy();
			expect(card.querySelector('.work-page__identity img, .work-page__identity svg')).toBeTruthy();
			expect(card.querySelector('app-work-project-visual .work-project-visual > div')).toBeTruthy();
			expect(card.querySelectorAll('.work-page__content li').length).toBeGreaterThan(1);
			expect(card.querySelectorAll('.work-page__content li svg').length).toBe(
				card.querySelectorAll('.work-page__content li').length
			);
			expect(card.querySelectorAll('.work-page__destinations a').length).toBeGreaterThan(1);
		}
		expect(new Set([...cards].map((card) => card.getAttribute('data-project'))).size).toBe(6);
		expect(fixture.componentInstance.experiments).toHaveLength(4);
		expect(element.querySelectorAll('.work-page__experiment-grid app-evidence-card')).toHaveLength(4);
		expect(element.querySelector('#main-content')).toBeNull();
	});
	it('localizes project and platform copy from the content catalogue', async () => {
		await TestBed.configureTestingModule({ imports: [WorkPageComponent] }).compileComponents();
		TestBed.inject(TranslateService).setLocale('es');
		const fixture = TestBed.createComponent(WorkPageComponent);
		fixture.detectChanges();
		const element = fixture.nativeElement as HTMLElement;
		expect(element.querySelector('.work-page__status')?.textContent).toContain('Código abierto');
		expect(element.querySelector('.work-page__content p')?.textContent).toContain('Servidor MCP');
		expect(element.querySelector('.work-page__directory-grid small')?.textContent).toContain('Perfil profesional');
		TestBed.inject(TranslateService).setLocale('en');
	});
});
