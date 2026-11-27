import { TestBed } from '@angular/core/testing';
import { ProfileLinksComponent } from './profile-links.component';
import { TranslateService } from '../../../lang/translate.service';
import type { IMonitorPreview } from '../../../domain/types.interface';
describe('ProfileLinksComponent', () => {
	it('renders public links from the supplied domain data', async () => {
		await TestBed.configureTestingModule({
			imports: [ProfileLinksComponent],
		}).compileComponents();
		const fixture = TestBed.createComponent(ProfileLinksComponent);
		fixture.componentRef.setInput('links', [
			{
				label: 'GitHub',
				href: 'https://github.com/CartagoGit',
				iconPath: 'M0 0',
				group: 'platform',
			},
		]);
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('a')?.textContent).toContain(
			'GitHub'
		);
		const previews: unknown[] = [];
		fixture.componentInstance.preview.subscribe((preview) => previews.push(preview));
		fixture.componentInstance.clearPreview();
		expect(previews).toEqual([null]);
	});
	it('localizes preview detail and status', async () => {
		await TestBed.configureTestingModule({ imports: [ProfileLinksComponent] }).compileComponents();
		TestBed.inject(TranslateService).setLocale('de');
		const fixture = TestBed.createComponent(ProfileLinksComponent);
		const previews: IMonitorPreview[] = [];
		fixture.componentInstance.preview.subscribe((preview) => {
			if (preview) previews.push(preview);
		});
		fixture.componentInstance.showPreview({
			label: 'GitHub', href: 'https://github.com/CartagoGit', group: 'platform',
		});
		expect(previews[0]?.detail).toContain('Öffentliche Repositories');
		expect(previews[0]?.status).toContain('Veröffentlichungs');
		TestBed.inject(TranslateService).setLocale('en');
	});
});
