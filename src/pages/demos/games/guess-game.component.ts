import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';

type IGuessState = 'idle' | 'low' | 'high' | 'correct' | 'invalid';

@Component({ selector: 'app-guess-game', imports: [TranslatePipe], templateUrl: './guess-game.component.html', styleUrl: './guess-game.component.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class GuessGameComponent {
	readonly secret = signal(1 + Math.floor(Math.random() * 50));
	readonly guessValue = signal<number | null>(null);
	readonly attempts = signal(0);
	readonly state = signal<IGuessState>('idle');

	setGuess(event: Event): void { const value = Number((event.currentTarget as HTMLInputElement).value); this.guessValue.set(Number.isFinite(value) ? value : null); }
	submit(): void {
		const guess = this.guessValue();
		if (guess === null || guess < 1 || guess > 50) { this.state.set('invalid'); return; }
		this.attempts.update((attempts) => attempts + 1);
		this.state.set(guess === this.secret() ? 'correct' : guess < this.secret() ? 'low' : 'high');
	}
	reset(): void { this.secret.set(1 + Math.floor(Math.random() * 50)); this.guessValue.set(null); this.attempts.set(0); this.state.set('idle'); }
}
