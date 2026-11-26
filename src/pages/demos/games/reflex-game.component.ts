import {
	ChangeDetectionStrategy,
	Component,
	computed,
	signal,
} from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';
import { moveGridFocus } from './grid-navigation.helper';

type IReflexPhase = 'ready' | 'running' | 'result';
type IReflexFeedback = 'prompt' | 'correct' | 'wrong';
const REFLEX_TARGETS_PER_ROUND = 10;

@Component({
	selector: 'app-reflex-game',
	imports: [TranslatePipe],
	templateUrl: './reflex-game.component.html',
	styleUrl: './reflex-game.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReflexGameComponent {
	readonly cells = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;
	readonly targetCount = REFLEX_TARGETS_PER_ROUND;
	readonly phase = signal<IReflexPhase>('ready');
	readonly feedback = signal<IReflexFeedback>('prompt');
	readonly score = signal(0);
	readonly misses = signal(0);
	readonly round = signal(1);
	readonly target = signal(4);
	readonly focusedCell = signal(4);
	readonly phaseLabelKey = computed(() => {
		if (this.phase() === 'ready') return 'pages.demos.arcade.ready';
		if (this.phase() === 'running') return 'pages.demos.arcade.running';
		return 'pages.demos.arcade.won';
	});
	readonly feedbackKey = computed(() => {
		if (this.phase() === 'result') return 'pages.demos.tapDone';
		if (this.feedback() === 'correct') return 'pages.demos.colorCorrect';
		if (this.feedback() === 'wrong') return 'pages.demos.colorWrong';
		return 'pages.demos.gameDetail';
	});

	start(): void {
		if (this.phase() === 'running') return;
		if (this.phase() === 'result') this.round.update((round) => round + 1);
		this.score.set(0);
		this.misses.set(0);
		this.feedback.set('prompt');
		this.target.set((this.round() * 4) % this.cells.length);
		this.focusedCell.set(this.target());
		this.phase.set('running');
	}

	hit(index: number): void {
		if (this.phase() !== 'running') return;
		if (index !== this.target()) {
			this.misses.update((misses) => misses + 1);
			this.feedback.set('wrong');
			return;
		}
		const score = this.score() + 1;
		this.score.set(score);
		this.feedback.set('correct');
		if (score >= REFLEX_TARGETS_PER_ROUND) {
			this.phase.set('result');
			return;
		}
		this.target.set((index + 2 + score * 3 + this.round()) % this.cells.length);
	}

	reset(): void {
		this.phase.set('ready');
		this.feedback.set('prompt');
		this.score.set(0);
		this.misses.set(0);
		this.round.set(1);
		this.target.set(4);
		this.focusedCell.set(4);
	}

	onGridKeydown(event: KeyboardEvent, index: number): void {
		const result = moveGridFocus(event, { index, itemCount: this.cells.length, columns: 3 });
		if (result) this.focusedCell.set(result.index);
	}
}
