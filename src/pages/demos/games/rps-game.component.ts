import {
	ChangeDetectionStrategy,
	Component,
	computed,
	type OnDestroy,
	signal,
} from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';
import { moveGridFocus } from './grid-navigation.helper';

type IChoice = 'rock' | 'paper' | 'scissors';
type IOutcome = 'idle' | 'win' | 'lose' | 'draw';
type IRpsPhase = 'ready' | 'running' | 'result';

@Component({
	selector: 'app-rps-game',
	imports: [TranslatePipe],
	templateUrl: './rps-game.component.html',
	styleUrl: './rps-game.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RpsGameComponent implements OnDestroy {
	readonly choices = [
		{ id: 'rock' as const, symbol: '●', labelKey: 'pages.demos.rpsRock' },
		{ id: 'paper' as const, symbol: '▰', labelKey: 'pages.demos.rpsPaper' },
		{ id: 'scissors' as const, symbol: '✂', labelKey: 'pages.demos.rpsScissors' },
	] as const;
	readonly userChoice = signal<IChoice | null>(null);
	readonly computerChoice = signal<IChoice | null>(null);
	readonly outcome = signal<IOutcome>('idle');
	readonly phase = signal<IRpsPhase>('ready');
	readonly score = signal(0);
	readonly round = signal(0);
	readonly losses = signal(0);
	readonly draws = signal(0);
	readonly focusedChoice = signal(0);
	readonly userSymbol = computed(() => this.symbolFor(this.userChoice()));
	readonly computerSymbol = computed(() => this.symbolFor(this.computerChoice()));
	readonly phaseLabelKey = computed(() => {
		if (this.phase() === 'ready') return 'pages.demos.arcade.ready';
		if (this.phase() === 'running') return 'pages.demos.arcade.running';
		return this.outcome() === 'lose' ? 'pages.demos.arcade.lost' : 'pages.demos.arcade.won';
	});
	private _timer?: ReturnType<typeof setTimeout>;

	play(choice: IChoice): void {
		if (this.phase() === 'running') return;
		clearTimeout(this._timer);
		this.userChoice.set(choice);
		this.computerChoice.set(null);
		this.outcome.set('idle');
		this.phase.set('running');
		this.round.update((round) => round + 1);
		this._timer = setTimeout(() => {
			const computer = this.choices[Math.floor(Math.random() * this.choices.length)]?.id ?? 'rock';
			this.computerChoice.set(computer);
			if (choice === computer) {
				this.outcome.set('draw');
				this.draws.update((draws) => draws + 1);
			} else {
				const win = (choice === 'rock' && computer === 'scissors')
					|| (choice === 'paper' && computer === 'rock')
					|| (choice === 'scissors' && computer === 'paper');
				this.outcome.set(win ? 'win' : 'lose');
				if (win) this.score.update((score) => score + 1);
				else this.losses.update((losses) => losses + 1);
			}
			this.phase.set('result');
		}, 260);
	}

	reset(): void {
		clearTimeout(this._timer);
		this.userChoice.set(null);
		this.computerChoice.set(null);
		this.outcome.set('idle');
		this.phase.set('ready');
		this.score.set(0);
		this.round.set(0);
		this.losses.set(0);
		this.draws.set(0);
		this.focusedChoice.set(0);
	}

	onChoiceKeydown(event: KeyboardEvent, index: number): void {
		const result = moveGridFocus(event, { index, itemCount: this.choices.length, columns: 3 });
		if (result) this.focusedChoice.set(result.index);
	}

	symbolFor(choice: IChoice | null): string {
		return this.choices.find(({ id }) => id === choice)?.symbol ?? '?';
	}

	ngOnDestroy(): void {
		clearTimeout(this._timer);
	}
}
