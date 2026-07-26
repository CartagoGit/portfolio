import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommandPaletteComponent } from './command-palette.component';

describe('CommandPaletteComponent', () => {
	it('only renders while open', async () => {
		await TestBed.configureTestingModule({
			imports: [CommandPaletteComponent, RouterTestingModule],
		}).compileComponents();
		const fixture = TestBed.createComponent(CommandPaletteComponent);
		fixture.componentRef.setInput('locale', 'en');
		fixture.componentRef.setInput('open', false);
		fixture.detectChanges();
		expect(
			fixture.nativeElement.querySelector('.command-palette')
		).toBeNull();
	});
});
