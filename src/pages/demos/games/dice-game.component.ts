import {
	ChangeDetectionStrategy,
	Component,
	computed,
	type OnDestroy,
	signal,
} from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';

type IDicePhase = 'ready' | 'running' | 'result';

@Component({
	selector: 'app-dice-game',
	imports: [TranslatePipe],
	templateUrl: './dice-game.component.html',
	styleUrl: './dice-game.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiceGameComponent implements OnDestroy {
	readonly value = signal(1);
	readonly rolls = signal<readonly number[]>([]);
	readonly phase = signal<IDicePhase>('ready');
	readonly round = signal(0);
	readonly total = signal(0);
	readonly faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'] as const;
	readonly average = computed(() => this.round() === 0 ? null : (this.total() / this.round()).toFixed(1));
	readonly phaseLabelKey = computed(() => {
		if (this.phase() === 'ready') return 'pages.demos.arcade.ready';
		if (this.phase() === 'running') return 'pages.demos.arcade.running';
		return 'pages.demos.arcade.goal';
	});
	private _timer?: ReturnType<typeof setTimeout>;

	roll(): void {
		if (this.phase() === 'running') return;
		clearTimeout(this._timer);
		this.phase.set('running');
		this._timer = setTimeout(() => {
			const next = Math.floor(Math.random() * 6) + 1;
			this.value.set(next);
			this.rolls.update((rolls) => [next, ...rolls].slice(0, 6));
			this.round.update((round) => round + 1);
			this.total.update((total) => total + next);
			this.phase.set('result');
		}, 320);
	}

	reset(): void {
		clearTimeout(this._timer);
		this.value.set(1);
		this.rolls.set([]);
		this.phase.set('ready');
		this.round.set(0);
		this.total.set(0);
	}

	ngOnDestroy(): void {
		clearTimeout(this._timer);
	}
}
