import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
	selector: 'app-demos-page',
	templateUrl: './demos-page.component.html',
	styleUrl: './demos-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemosPageComponent {
	protected readonly _score = signal(0);
	protected readonly _target = signal(4);
	protected readonly _demos = [
		[
			'01',
			'DeathBlitz',
			'Stateful product interaction and persistent progression.',
			'https://deathblitz.netlify.app/',
		],
		[
			'02',
			'Cartago Tetris',
			'Keyboard interaction, game loop and responsive board state.',
			'https://cartago-tetris.netlify.app/',
		],
		[
			'03',
			'Cartago Snake',
			'Real-time movement, collision handling and state updates.',
			'https://cartago-snake.netlify.app/',
		],
		[
			'04',
			'Minesweeper',
			'Grid interaction, timers and information hierarchy.',
			'https://cartago-minesweeper.netlify.app/',
		],
	] as const;

	protected _hit(index: number): void {
		if (index !== this._target()) return;
		const score = this._score() + 1;
		this._score.set(score);
		this._target.set((index + 2 + score * 3) % 9);
	}
}
