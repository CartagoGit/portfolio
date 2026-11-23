import {
	ChangeDetectionStrategy,
	Component,
	signal,
} from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';
import { MemoryGameComponent } from './memory-game.component';
import { ReactionGameComponent } from './reaction-game.component';
import { ReflexGameComponent } from './reflex-game.component';

type IDemoGameId = 'reflex' | 'reaction' | 'memory';

@Component({
	selector: 'app-demo-games',
	imports: [
		MemoryGameComponent,
		ReactionGameComponent,
		ReflexGameComponent,
		TranslatePipe,
	],
	templateUrl: './demo-games.component.html',
	styleUrl: './demo-games.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoGamesComponent {
	readonly activeGame = signal<IDemoGameId>('reflex');
	readonly games = [
		{ id: 'reflex' as const, labelKey: 'pages.demos.tabReflex' },
		{ id: 'reaction' as const, labelKey: 'pages.demos.tabReaction' },
		{ id: 'memory' as const, labelKey: 'pages.demos.tabMemory' },
	] as const;

	select(id: IDemoGameId): void {
		this.activeGame.set(id);
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
}
