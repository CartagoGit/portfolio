import {
	ChangeDetectionStrategy,
	Component,
	type OnDestroy,
	signal,
} from '@angular/core';
import { DEMOS } from '../../domain/data';
import { TranslatePipe } from '../../lang/translate.pipe';

type IDemoGameId = 'reflex' | 'reaction' | 'memory';
type IReactionPhase = 'idle' | 'waiting' | 'ready' | 'result' | 'early';

@Component({
	selector: 'app-demos-page',
	imports: [TranslatePipe],
	templateUrl: './demos.page.html',
	styleUrl: './demos.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemosPageComponent implements OnDestroy {
	readonly demos = DEMOS;
	readonly activeGame = signal<IDemoGameId>('reflex');
	readonly games = [
		{ id: 'reflex' as const, labelKey: 'pages.demos.tabReflex' },
		{ id: 'reaction' as const, labelKey: 'pages.demos.tabReaction' },
		{ id: 'memory' as const, labelKey: 'pages.demos.tabMemory' },
	] as const;

	readonly score = signal(0);
	readonly target = signal(4);
	readonly reactionPhase = signal<IReactionPhase>('idle');
	readonly reactionTime = signal<number | null>(null);
	readonly bestReaction = signal<number | null>(null);
	readonly memoryValues = signal(this._shuffle([0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5]));
	readonly memoryOpen = signal<number[]>([]);
	readonly memoryMatched = signal<number[]>([]);
	readonly memoryMoves = signal(0);
	private _reactionTimer?: ReturnType<typeof setTimeout>;
	private _reactionStartedAt = 0;
	private _memoryTimer?: ReturnType<typeof setTimeout>;

	selectGame(id: IDemoGameId): void {
		this.activeGame.set(id);
		if (id !== 'reaction') {
			clearTimeout(this._reactionTimer);
			this.reactionPhase.set('idle');
		}
	}

	hit(index: number): void {
		if (index !== this.target()) return;
		const score = this.score() + 1;
		this.score.set(score);
		this.target.set((index + 2 + score * 3) % 9);
	}

	startReaction(): void {
		clearTimeout(this._reactionTimer);
		this.reactionPhase.set('waiting');
		this.reactionTime.set(null);
		this._reactionTimer = setTimeout(() => {
			this._reactionStartedAt = performance.now();
			this.reactionPhase.set('ready');
		}, 900 + Math.random() * 1600);
	}

	pressReaction(): void {
		const phase = this.reactionPhase();
		if (phase === 'idle' || phase === 'result' || phase === 'early') {
			this.startReaction();
			return;
		}
		if (phase === 'waiting') {
			clearTimeout(this._reactionTimer);
			this.reactionPhase.set('early');
			return;
		}
		const time = Math.round(performance.now() - this._reactionStartedAt);
		this.reactionTime.set(time);
		this.bestReaction.update((best) => (best === null ? time : Math.min(best, time)));
		this.reactionPhase.set('result');
	}

	openMemory(index: number): void {
		const open = this.memoryOpen();
		if (open.length === 2 || open.includes(index) || this.memoryMatched().includes(index)) return;
		const next = [...open, index];
		this.memoryOpen.set(next);
		if (next.length !== 2) return;
		this.memoryMoves.update((moves) => moves + 1);
		const [first, second] = next;
		if (first === undefined || second === undefined) return;
		const matches = this.memoryValues()[first] === this.memoryValues()[second];
		this._memoryTimer = setTimeout(() => {
			if (matches) this.memoryMatched.update((matched) => [...matched, first, second]);
			this.memoryOpen.set([]);
		}, matches ? 280 : 650);
	}

	resetMemory(): void {
		clearTimeout(this._memoryTimer);
		this.memoryValues.set(this._shuffle([...this.memoryValues()]));
		this.memoryOpen.set([]);
		this.memoryMatched.set([]);
		this.memoryMoves.set(0);
	}

	ngOnDestroy(): void {
		clearTimeout(this._reactionTimer);
		clearTimeout(this._memoryTimer);
	}

	private _shuffle(values: number[]): number[] {
		return [...values].sort(() => Math.random() - 0.5);
	}
}
