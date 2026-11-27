import {
	ChangeDetectionStrategy,
	Component,
	type OnDestroy,
	signal,
} from '@angular/core';
import type { IArcadeCopyKey } from '../../../../lang/arcade.translation';
import { ArcadeGameShellComponent } from '../arcade-game-shell.component';
import { ArcadeRafLoop } from '../arcade-raf-loop.helper';
import { ArcadeTextPipe } from '../arcade-text.pipe';
import type { IArcadePhase } from '../arcade.types';

type IPenaltyZone = 0 | 1 | 2;
type IPenaltyResult = 'goal' | 'saved' | null;

interface IPenaltyBurst {
	readonly id: number;
	readonly zone: IPenaltyZone;
	readonly result: Exclude<IPenaltyResult, null>;
}

const GAME_DURATION_MS = 20_000;
const SHOT_LIMIT = 5;

@Component({
	selector: 'app-penalty-game',
	standalone: true,
	imports: [ArcadeGameShellComponent, ArcadeTextPipe],
	templateUrl: './penalty-game.component.html',
	styleUrl: './penalty-game.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { '[attr.data-game-state]': 'phase()' },
})
export class PenaltyGameComponent implements OnDestroy {
	readonly zones = [0, 1, 2] as const;
	readonly shotSlots = [0, 1, 2, 3, 4] as const;
	readonly phase = signal<IArcadePhase>('ready');
	readonly score = signal(0);
	readonly lives = signal(SHOT_LIMIT);
	readonly time = signal(Math.ceil(GAME_DURATION_MS / 1000));
	readonly statusKey = signal<IArcadeCopyKey>('ready');
	readonly shots = signal(0);
	readonly goals = signal(0);
	readonly selectedZone = signal<IPenaltyZone>(1);
	readonly keeperZone = signal<IPenaltyZone>(1);
	readonly lastResult = signal<IPenaltyResult>(null);
	readonly shotBursts = signal<readonly IPenaltyBurst[]>([]);

	private readonly _loop = new ArcadeRafLoop((deltaMs) => this.advance(deltaMs));
	private _elapsedMs = 0;
	private _nextBurstId = 1;

	start(): void {
		this._loop.stop();
		this._resetState();
		this.phase.set('running');
		this.statusKey.set('running');
		this._loop.start();
	}

	reset(): void {
		this._loop.stop();
		this._resetState();
	}

	selectZone(zone: IPenaltyZone): void {
		if (this.phase() !== 'running') return;
		this.selectedZone.set(zone);
	}

	shiftZone(delta: -1 | 1): void {
		if (this.phase() !== 'running') return;
		this.selectedZone.set(Math.min(2, Math.max(0, this.selectedZone() + delta)) as IPenaltyZone);
	}

	shoot(): void {
		if (this.phase() !== 'running' || this.shots() >= SHOT_LIMIT) return;
		const keeper = Math.min(2, Math.floor(Math.random() * 3)) as IPenaltyZone;
		this.keeperZone.set(keeper);
		const result: Exclude<IPenaltyResult, null> = this.selectedZone() === keeper ? 'saved' : 'goal';
		this.lastResult.set(result);
		this.shotBursts.set([{ id: this._nextBurstId, zone: this.selectedZone(), result }]);
		this._nextBurstId += 1;
		this.statusKey.set(result);
		this.shots.update((shots) => shots + 1);
		this.lives.set(SHOT_LIMIT - this.shots());
		if (result === 'goal') {
			this.goals.update((goals) => goals + 1);
			this.score.update((score) => score + 100);
		}

		if (this.shots() >= SHOT_LIMIT) {
			const won = this.goals() >= 3;
			if (won) this.score.update((score) => score + 250);
			this._finish(won ? 'won' : 'lost');
		}
	}

	advance(deltaMs: number): void {
		if (this.phase() !== 'running') return;
		this._elapsedMs += Math.max(0, deltaMs);
		this.time.set(Math.max(0, Math.ceil((GAME_DURATION_MS - this._elapsedMs) / 1000)));
		if (this._elapsedMs >= GAME_DURATION_MS) this._finish('lost');
	}

	onKeydown(event: KeyboardEvent): void {
		if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
			event.preventDefault();
			this.shiftZone(-1);
			return;
		}
		if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
			event.preventDefault();
			this.shiftZone(1);
			return;
		}
		if (event.key === ' ' || event.key === 'Enter') {
			if ((event.target as Element | null)?.closest('button')) return;
			event.preventDefault();
			this.shoot();
		}
	}

	zonePosition(zone: IPenaltyZone): number {
		return 18 + zone * 32;
	}

	ngOnDestroy(): void {
		this._loop.stop();
	}

	private _finish(phase: 'won' | 'lost'): void {
		this._loop.stop();
		this.phase.set(phase);
		this.statusKey.set(phase);
	}

	private _resetState(): void {
		this.phase.set('ready');
		this.score.set(0);
		this.lives.set(SHOT_LIMIT);
		this.time.set(Math.ceil(GAME_DURATION_MS / 1000));
		this.statusKey.set('ready');
		this.shots.set(0);
		this.goals.set(0);
		this.selectedZone.set(1);
		this.keeperZone.set(1);
		this.lastResult.set(null);
		this.shotBursts.set([]);
		this._elapsedMs = 0;
		this._nextBurstId = 1;
	}
}
