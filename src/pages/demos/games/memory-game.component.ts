import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	type OnDestroy,
	signal,
} from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';
import { TranslateService } from '../../../lang/translate.service';
import { shuffleValues } from '../helpers/shuffle.helper';
import { moveGridFocus } from './grid-navigation.helper';

const MEMORY_VALUES = [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5] as const;
type IMemoryPhase = 'ready' | 'running' | 'result';
type IMemoryFeedback = 'prompt' | 'correct' | 'wrong';

@Component({
	selector: 'app-memory-game',
	imports: [TranslatePipe],
	templateUrl: './memory-game.component.html',
	styleUrl: './memory-game.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemoryGameComponent implements OnDestroy {
	private readonly _translate = inject(TranslateService);
	private _timer?: ReturnType<typeof setTimeout>;
	readonly values = signal(shuffleValues(MEMORY_VALUES));
	readonly open = signal<number[]>([]);
	readonly matched = signal<number[]>([]);
	readonly moves = signal(0);
	readonly best = signal<number | null>(null);
	readonly phase = signal<IMemoryPhase>('ready');
	readonly feedback = signal<IMemoryFeedback>('prompt');
	readonly focusedCard = signal(0);
	readonly phaseLabelKey = computed(() => {
		if (this.phase() === 'ready') return 'pages.demos.arcade.ready';
		if (this.phase() === 'running') return 'pages.demos.arcade.running';
		return 'pages.demos.arcade.won';
	});
	readonly feedbackKey = computed(() => {
		if (this.feedback() === 'correct') return 'pages.demos.colorCorrect';
		if (this.feedback() === 'wrong') return 'pages.demos.colorWrong';
		if (this.phase() === 'result') return 'pages.demos.tapDone';
		return 'pages.demos.memoryDetail';
	});

	openCard(index: number): void {
		const open = this.open();
		if (this.phase() === 'result' || open.length === 2 || open.includes(index) || this.matched().includes(index)) return;
		if (this.phase() === 'ready') this.phase.set('running');
		const next = [...open, index];
		this.open.set(next);
		if (next.length !== 2) return;
		this.moves.update((moves) => moves + 1);
		const [first, second] = next;
		if (first === undefined || second === undefined) return;
		const matches = this.values()[first] === this.values()[second];
		this.feedback.set(matches ? 'correct' : 'wrong');
		this._timer = setTimeout(() => {
			if (matches) {
				const matched = [...this.matched(), first, second];
				this.matched.set(matched);
				if (matched.length === this.values().length) {
					this.phase.set('result');
					this.best.update((best) => best === null ? this.moves() : Math.min(best, this.moves()));
				}
			}
			this.open.set([]);
		}, matches ? 280 : 650);
	}

	reset(): void {
		clearTimeout(this._timer);
		this.values.set(shuffleValues(MEMORY_VALUES));
		this.open.set([]);
		this.matched.set([]);
		this.moves.set(0);
		this.phase.set('ready');
		this.feedback.set('prompt');
		this.focusedCard.set(0);
	}

	label(index: number, value: number): string {
		if (this.matched().includes(index)) {
			return this._translate.instant('pages.demos.memoryMatchedAria', { value: value + 1 });
		}
		if (this.open().includes(index)) {
			return this._translate.instant('pages.demos.memoryOpenAria', { value: value + 1 });
		}
		return this._translate.instant('pages.demos.memoryHiddenAria', { index: index + 1 });
	}

	onGridKeydown(event: KeyboardEvent, index: number): void {
		const result = moveGridFocus(event, { index, itemCount: this.values().length, columns: 4 });
		if (result) this.focusedCard.set(result.index);
	}

	ngOnDestroy(): void {
		clearTimeout(this._timer);
	}
}
