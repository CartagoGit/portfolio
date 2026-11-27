import { DeferBlockBehavior, DeferBlockState, TestBed } from '@angular/core/testing';
import type { ILocale } from '../../domain/types.interface';
import { TranslateService } from '../../lang/translate.service';
import { DemosPageComponent } from './demos.page';

async function createPage(locale: ILocale = 'en') {
	await TestBed.configureTestingModule({
		imports: [DemosPageComponent],
		deferBlockBehavior: DeferBlockBehavior.Manual,
	}).compileComponents();
	TestBed.inject(TranslateService).setLocale(locale);
	const fixture = TestBed.createComponent(DemosPageComponent);
	fixture.detectChanges();
	return fixture;
}

async function renderDeferredTree(fixture: Awaited<ReturnType<typeof createPage>>): Promise<void> {
	const renderBlocks = async (blocks: Awaited<ReturnType<typeof fixture.getDeferBlocks>>): Promise<void> => {
		for (const block of blocks) {
			await block.render(DeferBlockState.Complete);
			await renderBlocks(await block.getDeferBlocks());
		}
	};
	await renderBlocks(await fixture.getDeferBlocks());
	fixture.detectChanges();
}

describe('DemosPageComponent', () => {
	it('composes interactive games before five correctly marked demos', async () => {
		const fixture = await createPage();
		await renderDeferredTree(fixture);
		const element = fixture.nativeElement as HTMLElement;
		expect(element.querySelector('app-demos-showcase')).not.toBeNull();
		expect(element.querySelectorAll('app-demos-showcase [role="tab"]')).toHaveLength(6);
		const arcade = element.querySelector('app-arcade-games');
		const showcase = element.querySelector('app-demos-showcase');
		expect(arcade).not.toBeNull();
		expect(arcade?.querySelectorAll('[role="tab"]')).toHaveLength(6);
		expect(Boolean(arcade && showcase && (arcade.compareDocumentPosition(showcase) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
		expect(element.querySelectorAll('.demos-page__links app-evidence-card')).toHaveLength(5);
		for (const link of element.querySelectorAll<HTMLAnchorElement>('.demos-page__links app-evidence-card a')) {
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
