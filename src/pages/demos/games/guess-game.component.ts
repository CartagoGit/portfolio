import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';

type IGuessState = 'idle' | 'low' | 'high' | 'correct' | 'invalid' | 'exhausted';
type IGuessPhase = 'ready' | 'running' | 'result';
const GUESS_MAX_ATTEMPTS = 7;

@Component({
	selector: 'app-guess-game',
	imports: [TranslatePipe],
	templateUrl: './guess-game.component.html',
	styleUrl: './guess-game.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuessGameComponent {
	readonly secret = signal(1 + Math.floor(Math.random() * 50));
	readonly guessValue = signal<number | null>(null);
	readonly attempts = signal(0);
	readonly lowerBound = signal(1);
	readonly upperBound = signal(50);
	readonly phase = signal<IGuessPhase>('ready');
	readonly state = signal<IGuessState>('idle');
	readonly maxAttempts = GUESS_MAX_ATTEMPTS;
	readonly remaining = computed(() => Math.max(0, GUESS_MAX_ATTEMPTS - this.attempts()));
	readonly phaseLabelKey = computed(() => {
		if (this.phase() === 'ready') return 'pages.demos.arcade.ready';
		if (this.phase() === 'running') return 'pages.demos.arcade.running';
		return this.state() === 'correct' ? 'pages.demos.arcade.won' : 'pages.demos.arcade.lost';
	});
	readonly feedbackKey = computed(() => this.state() === 'exhausted'
		? 'pages.demos.arcade.lost'
		: `pages.demos.guess${this.state()[0]!.toUpperCase()}${this.state().slice(1)}`);

	setGuess(event: Event): void {
		const raw = (event.currentTarget as HTMLInputElement).value.trim();
		const value = raw === '' ? Number.NaN : Number(raw);
		this.guessValue.set(Number.isFinite(value) ? value : null);
	}

	submit(): void {
		if (this.phase() === 'result') return;
		const guess = this.guessValue();
		if (guess === null || !Number.isInteger(guess) || guess < 1 || guess > 50) {
			this.state.set('invalid');
			return;
		}
		this.attempts.update((attempts) => attempts + 1);
		this.phase.set('running');
		if (guess === this.secret()) {
			this.state.set('correct');
			this.phase.set('result');
			return;
		}
		if (guess < this.secret()) {
			this.state.set('low');
			this.lowerBound.update((bound) => Math.max(bound, guess + 1));
		} else {
			this.state.set('high');
			this.upperBound.update((bound) => Math.min(bound, guess - 1));
		}
		if (this.attempts() >= GUESS_MAX_ATTEMPTS) {
			this.state.set('exhausted');
			this.phase.set('result');
		}
	}

	reset(): void {
		this.secret.set(1 + Math.floor(Math.random() * 50));
		this.guessValue.set(null);
		this.attempts.set(0);
		this.lowerBound.set(1);
		this.upperBound.set(50);
		this.phase.set('ready');
		this.state.set('idle');
	}
}
