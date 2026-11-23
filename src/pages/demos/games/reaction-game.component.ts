import {
	ChangeDetectionStrategy,
	Component,
	type OnDestroy,
	signal,
} from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';

type IReactionPhase = 'idle' | 'waiting' | 'ready' | 'result' | 'early';

@Component({
	selector: 'app-reaction-game',
	imports: [TranslatePipe],
	templateUrl: './reaction-game.component.html',
	styleUrl: './reaction-game.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactionGameComponent implements OnDestroy {
	readonly phase = signal<IReactionPhase>('idle');
	readonly time = signal<number | null>(null);
	readonly best = signal<number | null>(null);
	private _timer?: ReturnType<typeof setTimeout>;
	private _startedAt = 0;

	start(): void {
		clearTimeout(this._timer);
		this.phase.set('waiting');
		this.time.set(null);
		this._timer = setTimeout(() => {
			this._startedAt = performance.now();
			this.phase.set('ready');
		}, 900 + Math.random() * 1600);
	}

	reset(): void {
		clearTimeout(this._timer);
		this.phase.set('idle');
		this.time.set(null);
	}

	press(): void {
		const phase = this.phase();
		if (phase === 'idle' || phase === 'result' || phase === 'early') {
			this.start();
			return;
		}
		if (phase === 'waiting') {
			clearTimeout(this._timer);
			this.phase.set('early');
			return;
		}
		const elapsed = Math.round(performance.now() - this._startedAt);
		this.time.set(elapsed);
		this.best.update((best) => (best === null ? elapsed : Math.min(best, elapsed)));
		this.phase.set('result');
	}

	ngOnDestroy(): void {
		clearTimeout(this._timer);
	}
}
