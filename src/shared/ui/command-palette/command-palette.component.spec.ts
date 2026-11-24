import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { vi } from 'vitest';
import { TranslateService } from '../../../lang/translate.service';
import { CommandPaletteComponent } from './command-palette.component';

async function createPalette(open = false) {
	await TestBed.configureTestingModule({
		imports: [CommandPaletteComponent, RouterTestingModule],
	}).compileComponents();
	const fixture = TestBed.createComponent(CommandPaletteComponent);
	TestBed.inject(TranslateService).setLocale('en');
	fixture.componentRef.setInput('locale', 'en');
	fixture.componentRef.setInput('open', open);
	fixture.detectChanges();
	await fixture.whenStable();
	return fixture;
}

describe('CommandPaletteComponent', () => {
	it('stays mounted while hidden and becomes an accessible dialog when open', async () => {
		const fixture = await createPalette();
		const palette = fixture.nativeElement.querySelector(
			'.command-palette'
		) as HTMLElement;
		expect(palette.classList.contains('is-open')).toBe(false);
		expect(palette.hasAttribute('inert')).toBe(true);
		expect(palette.getAttribute('aria-hidden')).toBe('true');

		fixture.componentRef.setInput('open', true);
		fixture.detectChanges();
		await fixture.whenStable();
		expect(palette.classList.contains('is-open')).toBe(true);
		expect(palette.hasAttribute('inert')).toBe(false);
		expect(palette.getAttribute('aria-hidden')).toBeNull();
		fixture.destroy();
	});

	it('focuses search, locks page scroll and restores the previous control', async () => {
		const fixture = await createPalette();
		const trigger = document.createElement('button');
		document.body.append(trigger);
		trigger.focus();
		fixture.componentRef.setInput('open', true);
		fixture.detectChanges();
		await fixture.whenStable();
		const search = fixture.nativeElement.querySelector(
			'.command-palette__search input'
		);
		expect(document.activeElement).toBe(search);
		expect(document.body.style.overflow).toBe('hidden');

		fixture.componentRef.setInput('open', false);
		fixture.detectChanges();
		await fixture.whenStable();
		expect(document.activeElement).toBe(trigger);
		expect(document.body.style.overflow).toBe('');
		trigger.remove();
		fixture.destroy();
	});

	it('filters localized commands and uses a platform-neutral Enter hint', async () => {
		const fixture = await createPalette(true);
		const search = fixture.nativeElement.querySelector(
			'.command-palette__search input'
		) as HTMLInputElement;
		search.value = 'contact';
		search.dispatchEvent(new Event('input', { bubbles: true }));
		fixture.detectChanges();
		const links = fixture.nativeElement.querySelectorAll(
			'.command-palette__commands a'
		);
		expect(links).toHaveLength(1);
		expect(links[0]?.textContent).toContain('Start a conversation');
		expect(links[0]?.textContent).toContain('Enter');
		fixture.destroy();
	});

	it('closes from Escape and backdrop and traps Tab at the dialog edges', async () => {
		const fixture = await createPalette(true);
		const close = vi.fn();
		fixture.componentInstance.close.subscribe(close);
		const palette = fixture.nativeElement.querySelector(
			'.command-palette'
		) as HTMLElement;
		palette.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		palette.click();
		expect(close).toHaveBeenCalledTimes(2);

		const focusable = Array.from(
			palette.querySelectorAll<HTMLElement>(
				'button:not([disabled]), input:not([disabled]), a[href]'
			)
		);
		const first = focusable[0];
		const last = focusable.at(-1);
		first?.focus();
		palette.dispatchEvent(
			new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true })
		);
		expect(document.activeElement).toBe(last);
		last?.focus();
		palette.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
		expect(document.activeElement).toBe(first);
		fixture.destroy();
	});

	it('emits navigation and close when a command is selected', async () => {
		const fixture = await createPalette(true);
		const navigate = vi.fn();
		const close = vi.fn();
		fixture.componentInstance.navigate.subscribe(navigate);
		fixture.componentInstance.close.subscribe(close);
		fixture.componentInstance.select('work');
		expect(navigate).toHaveBeenCalledWith('work');
		expect(close).toHaveBeenCalledOnce();
		fixture.destroy();
	});
});
