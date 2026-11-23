import { TestBed } from '@angular/core/testing';
import { KnowledgePageComponent } from './knowledge.page';
import { TranslateService } from '../../lang/translate.service';

describe('KnowledgePageComponent', () => {
	it('renders every knowledge area with an example and related projects', async () => {
		await TestBed.configureTestingModule({
			imports: [KnowledgePageComponent],
		}).compileComponents();
		const fixture = TestBed.createComponent(KnowledgePageComponent);
		fixture.detectChanges();
		const element = fixture.nativeElement as HTMLElement;
		const cards = element.querySelectorAll<HTMLElement>(
			'.knowledge-page__grid article'
		);

		expect(fixture.componentInstance.areas).toHaveLength(6);
		expect(cards).toHaveLength(6);
		expect(element.querySelector('#main-content')).toBeNull();
		for (const card of cards) {
			expect(card.querySelector('.knowledge-page__icon')).toBeTruthy();
			expect(
				card.querySelector('.knowledge-page__example')?.textContent?.trim()
					.length
			).toBeGreaterThan(40);
			const links = card.querySelectorAll<HTMLAnchorElement>('nav a');
			expect(links.length).toBeGreaterThanOrEqual(2);
			for (const link of links)
				expect(link.href.startsWith('https://')).toBe(true);
		}
	});
	it('localizes practical knowledge examples', async () => {
		await TestBed.configureTestingModule({ imports: [KnowledgePageComponent] }).compileComponents();
		TestBed.inject(TranslateService).setLocale('de');
		const fixture = TestBed.createComponent(KnowledgePageComponent);
		fixture.detectChanges();
		const example = fixture.nativeElement.querySelector('.knowledge-page__example')?.textContent;
		expect(example).toContain('Angular-Portfolio');
		expect(example).not.toContain('print-safe');
		TestBed.inject(TranslateService).setLocale('en');
	});
});
