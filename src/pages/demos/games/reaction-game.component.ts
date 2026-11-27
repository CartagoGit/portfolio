import {
	ChangeDetectionStrategy,
	Component,
	computed,
	type OnDestroy,
	signal,
} from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';

type IReactionPhase = 'ready' | 'running' | 'result';
type IReactionCue = 'idle' | 'waiting' | 'go' | 'early' | 'complete';

@Component({
	selector: 'app-reaction-game',
	imports: [TranslatePipe],
	templateUrl: './reaction-game.component.html',
	styleUrl: './reaction-game.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactionGameComponent implements OnDestroy {
	readonly phase = signal<IReactionPhase>('ready');
	readonly cue = signal<IReactionCue>('idle');
	readonly time = signal<number | null>(null);
	readonly best = signal<number | null>(null);
	readonly round = signal(1);
	readonly phaseLabelKey = computed(() => {
		if (this.phase() === 'ready') return 'pages.demos.arcade.ready';
		if (this.phase() === 'running') return 'pages.demos.arcade.running';
		return this.cue() === 'complete' ? 'pages.demos.arcade.won' : 'pages.demos.arcade.lost';
	});
	private _timer?: ReturnType<typeof setTimeout>;
	private _startedAt = 0;

	start(): void {
		if (this.phase() === 'running') return;
		clearTimeout(this._timer);
		if (this.phase() === 'result') this.round.update((round) => round + 1);
		this.phase.set('running');
		this.cue.set('waiting');
		this.time.set(null);
		this._timer = setTimeout(() => {
			this._startedAt = performance.now();
			this.cue.set('go');
		}, 900 + Math.random() * 1600);
	}

	reset(): void {
		clearTimeout(this._timer);
		this.phase.set('ready');
		this.cue.set('idle');
		this.time.set(null);
		this.round.set(1);
	}

	press(): void {
		if (this.phase() !== 'running') {
			this.start();
			return;
		}
		if (this.cue() === 'waiting') {
			clearTimeout(this._timer);
			this.cue.set('early');
			this.phase.set('result');
			return;
		}
		if (this.cue() !== 'go') return;
		const elapsed = Math.round(performance.now() - this._startedAt);
		this.time.set(elapsed);
		this.best.update((best) => (best === null ? elapsed : Math.min(best, elapsed)));
		this.cue.set('complete');
		this.phase.set('result');
	}

	ngOnDestroy(): void {
		clearTimeout(this._timer);
	}
}
