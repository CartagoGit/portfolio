import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from '@angular/core';

@Component({
	selector: 'app-demos-page',
	templateUrl: './demos-page.component.html',
	styleUrl: './demos-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemosPageComponent {
	readonly score = input.required<number>();
	readonly target = input.required<number>();
	readonly hit = output<number>();
	protected readonly demos = [
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
}
