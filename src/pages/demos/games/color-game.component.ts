import {
	ChangeDetectionStrategy,
	Component,
	computed,
	signal,
} from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';
import { moveGridFocus } from './grid-navigation.helper';

type IColorPhase = 'ready' | 'running' | 'result';
type IColorMessage = 'prompt' | 'correct' | 'wrong';
const COLOR_CHOICES_PER_ROUND = 5;

@Component({
	selector: 'app-color-game',
	imports: [TranslatePipe],
	templateUrl: './color-game.component.html',
	styleUrl: './color-game.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorGameComponent {
	readonly colors = ['var(--cyan)', 'var(--lime)', 'var(--danger)', 'var(--blue)'] as const;
	readonly choiceCount = COLOR_CHOICES_PER_ROUND;
	readonly target = signal(0);
	readonly score = signal(0);
	readonly round = signal(0);
	readonly best = signal(0);
	readonly phase = signal<IColorPhase>('ready');
	readonly message = signal<IColorMessage>('prompt');
	readonly focusedChoice = signal(0);
	readonly phaseLabelKey = computed(() => {
		if (this.phase() === 'ready') return 'pages.demos.arcade.ready';
		if (this.phase() === 'running') return 'pages.demos.arcade.running';
		return this.score() >= 3 ? 'pages.demos.arcade.won' : 'pages.demos.arcade.lost';
	});

	start(): void {
		if (this.phase() === 'running') return;
		this.score.set(0);
		this.round.set(0);
		this.message.set('prompt');
		this.target.set(Math.floor(Math.random() * this.colors.length));
		this.focusedChoice.set(this.target());
		this.phase.set('running');
	}

	choose(index: number): void {
		if (this.phase() !== 'running') return;
		const correct = index === this.target();
		this.round.update((round) => round + 1);
		if (correct) {
			this.score.update((score) => score + 1);
			this.message.set('correct');
			this.target.set((this.target() + 1 + Math.floor(Math.random() * 3)) % this.colors.length);
		} else {
			this.message.set('wrong');
		}
		if (this.round() >= COLOR_CHOICES_PER_ROUND) {
			this.best.update((best) => Math.max(best, this.score()));
			this.phase.set('result');
		}
	}

	reset(): void {
		this.target.set(0);
		this.score.set(0);
		this.round.set(0);
		this.phase.set('ready');
		this.message.set('prompt');
		this.focusedChoice.set(0);
	}

	onChoiceKeydown(event: KeyboardEvent, index: number): void {
		const result = moveGridFocus(event, { index, itemCount: this.colors.length, columns: 4 });
		if (result) this.focusedChoice.set(result.index);
	}
}
