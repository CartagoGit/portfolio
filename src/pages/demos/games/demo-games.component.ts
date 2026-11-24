import {
	ChangeDetectionStrategy,
	Component,
	signal,
} from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';
import { ColorGameComponent } from './color-game.component';
import { DiceGameComponent } from './dice-game.component';
import { GuessGameComponent } from './guess-game.component';
import { MemoryGameComponent } from './memory-game.component';
import { ReactionGameComponent } from './reaction-game.component';
import { ReflexGameComponent } from './reflex-game.component';
import { RpsGameComponent } from './rps-game.component';
import { TapGameComponent } from './tap-game.component';

type IDemoGameId =
	| 'reflex'
	| 'reaction'
	| 'memory'
	| 'dice'
	| 'rps'
	| 'color'
	| 'tap'
	| 'guess';

@Component({
	selector: 'app-demo-games',
	imports: [
		ColorGameComponent,
		DiceGameComponent,
		GuessGameComponent,
		MemoryGameComponent,
		ReactionGameComponent,
		ReflexGameComponent,
		RpsGameComponent,
		TapGameComponent,
		TranslatePipe,
	],
	templateUrl: './demo-games.component.html',
	styleUrl: './demo-games.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { '(document:fullscreenchange)': 'syncFullscreen()' },
})
export class DemoGamesComponent {
	readonly activeGame = signal<IDemoGameId>('reflex');
	readonly transitionAlternate = signal(false);
	readonly transitionDirection = signal(1);
	readonly fullscreen = signal(false);
	readonly games = [
		{ id: 'reflex' as const, labelKey: 'pages.demos.tabReflex' },
		{ id: 'reaction' as const, labelKey: 'pages.demos.tabReaction' },
		{ id: 'memory' as const, labelKey: 'pages.demos.tabMemory' },
		{ id: 'dice' as const, labelKey: 'pages.demos.tabDice' },
		{ id: 'rps' as const, labelKey: 'pages.demos.tabRps' },
		{ id: 'color' as const, labelKey: 'pages.demos.tabColor' },
		{ id: 'tap' as const, labelKey: 'pages.demos.tabTap' },
		{ id: 'guess' as const, labelKey: 'pages.demos.tabGuess' },
	] as const;

	select(id: IDemoGameId): void {
		if (id === this.activeGame()) return;
		const currentIndex = this.games.findIndex((game) => game.id === this.activeGame());
		const nextIndex = this.games.findIndex((game) => game.id === id);
		this.transitionDirection.set(nextIndex >= currentIndex ? 1 : -1);
		this.activeGame.set(id);
		this.transitionAlternate.update((alternate) => !alternate);
	}

	onTabKeydown(event: KeyboardEvent, index: number): void {
		const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
		if (!delta && event.key !== 'Home' && event.key !== 'End') return;
		event.preventDefault();
		const nextIndex =
			event.key === 'Home'
				? 0
				: event.key === 'End'
					? this.games.length - 1
					: (index + delta + this.games.length) % this.games.length;
		const game = this.games[nextIndex];
		if (!game) return;
		const tabs = (event.currentTarget as HTMLElement)
			.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
		this.select(game.id);
		queueMicrotask(() => tabs?.[nextIndex]?.focus());
	}

	async toggleFullscreen(event: MouseEvent): Promise<void> {
		event.stopPropagation();
		const stage = (event.currentTarget as Element | null)?.closest<HTMLElement>('.demo-games__stage');
		try {
			if (document.fullscreenElement) {
				await document.exitFullscreen();
				this.fullscreen.set(false);
			} else if (stage?.requestFullscreen) {
				await stage.requestFullscreen();
				this.fullscreen.set(true);
			} else this.fullscreen.update((active) => !active);
		} catch {
			this.fullscreen.update((active) => !active);
		}
	}

	syncFullscreen(): void {
		this.fullscreen.set(document.fullscreenElement?.matches('.demo-games__stage') ?? false);
	}
}
