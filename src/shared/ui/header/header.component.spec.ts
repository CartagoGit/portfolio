import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '../../../lang/translate.service';
import { HeaderComponent } from './header.component';
describe('HeaderComponent', () => {
	it('renders the active navigation state', async () => {
		await TestBed.configureTestingModule({
			imports: [HeaderComponent, RouterTestingModule],
		}).compileComponents();
		TestBed.inject(TranslateService).setLocale('en');
		const fixture = TestBed.createComponent(HeaderComponent);
		fixture.componentRef.setInput('locale', 'en');
		fixture.componentRef.setInput('page', 'work');
		fixture.componentRef.setInput('languages', [
			{
				id: 'en',
				label: 'English',
				detail: 'US + UK',
				flag: '/icons/flag-en.svg',
			},
		]);
		fixture.componentRef.setInput('menuOpen', false);
		fixture.componentRef.setInput('localeMenuOpen', false);
		fixture.componentRef.setInput('localeMenuClosing', false);
		fixture.componentRef.setInput('theme', 'dark');
		fixture.componentRef.setInput('themes', [
			{
				id: 'dark',
				label: 'Midnight',
				detail: 'Default',
				primary: '#32c8ff',
				accent: '#b9ef73',
				scheme: 'dark',
			},
		]);
		fixture.componentRef.setInput('themeMenuOpen', false);
		fixture.componentRef.setInput('themeMenuClosing', false);
		fixture.detectChanges();
		expect(
			fixture.nativeElement.querySelector('.is-active')?.textContent
		).toContain('Projects');
		expect(fixture.nativeElement.querySelector('.header__nav a')?.textContent).toContain('Home');
		const themeButton = fixture.nativeElement.querySelector(
			'.header__theme > button'
		);
		expect(themeButton?.textContent).toContain('Themes');
		expect(themeButton?.querySelector('.header__theme-current')).toBeTruthy();
	});
	it('filters the searchable global locale menu', async () => {
		await TestBed.configureTestingModule({
			imports: [HeaderComponent, RouterTestingModule],
		}).compileComponents();
		TestBed.inject(TranslateService).setLocale('en');
		const fixture = TestBed.createComponent(HeaderComponent);
		fixture.componentRef.setInput('locale', 'en');
		fixture.componentRef.setInput('page', 'home');
		fixture.componentRef.setInput('languages', [
			{ id: 'en', label: 'English', detail: 'Global English', flag: '🇺🇸' },
			{ id: 'pt-BR', label: 'Português', detail: 'Brasil', flag: '🇧🇷' },
			{ id: 'zh-TW', label: '中文', detail: '繁體 · 台灣', flag: '🇹🇼' },
		]);
		fixture.componentRef.setInput('menuOpen', false);
		fixture.componentRef.setInput('localeMenuOpen', true);
		fixture.componentRef.setInput('localeMenuClosing', false);
		fixture.componentRef.setInput('theme', 'dark');
		fixture.componentRef.setInput('themes', [{ id: 'dark', label: 'Dark', detail: 'Dark', primary: '#32c8ff', accent: '#b9ef73', scheme: 'dark' }]);
		fixture.componentRef.setInput('themeMenuOpen', false);
		fixture.componentRef.setInput('themeMenuClosing', false);
		fixture.detectChanges();

		fixture.componentInstance.languageQuery.set('繁體');
		fixture.detectChanges();
		const options = fixture.nativeElement.querySelectorAll('[role="option"]');
		expect(options).toHaveLength(1);
		expect(options[0]?.textContent).toContain('台灣');
	});
});
