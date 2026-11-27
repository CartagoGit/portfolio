import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ArcadeGameShellComponent } from './arcade-game-shell.component';

@Component({
	standalone: true,
	imports: [ArcadeGameShellComponent],
	template: `
		<app-arcade-game-shell
			[titleKey]="'runner'"
			[descriptionKey]="'runnerDetail'"
			[phase]="phase()"
			(startGame)="phase.set('running')"
			(resetGame)="phase.set('ready')">
			<div arcade-stage tabindex="0" data-stage></div>
		</app-arcade-game-shell>
	`,
})
class ArcadeShellHostComponent {
	readonly phase = signal<'ready' | 'running'>('ready');
}

describe('ArcadeGameShellComponent', () => {
	it('starts the game and moves focus into the playable stage', async () => {
		await TestBed.configureTestingModule({ imports: [ArcadeShellHostComponent] }).compileComponents();
		const fixture = TestBed.createComponent(ArcadeShellHostComponent);
		fixture.detectChanges();
		const element = fixture.nativeElement as HTMLElement;
		const start = element.querySelector<HTMLButtonElement>('[data-arcade-action="start"]');
		expect(start).not.toBeNull();
		start?.click();
		fixture.detectChanges();
		await fixture.whenStable();
		const stage = element.querySelector<HTMLElement>('[data-stage]');
		expect(fixture.componentInstance.phase()).toBe('running');
		expect(document.activeElement).toBe(stage);
	});
});
