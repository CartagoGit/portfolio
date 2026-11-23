import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';

type IChoice = 'rock' | 'paper' | 'scissors';
type IOutcome = 'idle' | 'win' | 'lose' | 'draw';

@Component({ selector: 'app-rps-game', imports: [TranslatePipe], templateUrl: './rps-game.component.html', styleUrl: './rps-game.component.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class RpsGameComponent {
	readonly choices = [
		{ id: 'rock' as const, symbol: '●', labelKey: 'pages.demos.rpsRock' },
		{ id: 'paper' as const, symbol: '▰', labelKey: 'pages.demos.rpsPaper' },
		{ id: 'scissors' as const, symbol: '✂', labelKey: 'pages.demos.rpsScissors' },
	] as const;
	readonly userChoice = signal<IChoice>('rock');
	readonly computerChoice = signal<IChoice>('rock');
	readonly outcome = signal<IOutcome>('idle');
	readonly score = signal(0);

	play(choice: IChoice): void {
		const computer = this.choices[Math.floor(Math.random() * this.choices.length)]?.id ?? 'rock';
		this.userChoice.set(choice);
		this.computerChoice.set(computer);
		if (choice === computer) { this.outcome.set('draw'); return; }
		const win = (choice === 'rock' && computer === 'scissors') || (choice === 'paper' && computer === 'rock') || (choice === 'scissors' && computer === 'paper');
		this.outcome.set(win ? 'win' : 'lose');
		if (win) this.score.update((score) => score + 1);
	}
}
