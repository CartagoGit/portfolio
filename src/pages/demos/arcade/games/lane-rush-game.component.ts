import {
	ChangeDetectionStrategy,
	Component,
	type OnDestroy,
	signal,
} from '@angular/core';
import type { IArcadeCopyKey } from '../../../../lang/arcade.translation';
import { ArcadeControlPadComponent, type IArcadeControlDirection } from '../arcade-control-pad.component';
import { ArcadeGameShellComponent } from '../arcade-game-shell.component';
import { ArcadeRafLoop } from '../arcade-raf-loop.helper';
import { ArcadeTextPipe } from '../arcade-text.pipe';
import type { IArcadePhase } from '../arcade.types';

type ILane = 0 | 1 | 2;
type ILaneEntityKind = 'traffic' | 'crystal';

interface ILaneEntity {
	readonly id: number;
	readonly lane: ILane;
	readonly y: number;
	readonly kind: ILaneEntityKind;
}

interface ILaneBurst {
	readonly id: number;
	readonly lane: ILane;
	readonly kind: 'coin' | 'hit';
}

const RUN_DURATION_MS = 30_000;
const SPAWN_INTERVAL_MS = 920;

@Component({
	selector: 'app-lane-rush-game',
	standalone: true,
	imports: [ArcadeControlPadComponent, ArcadeGameShellComponent, ArcadeTextPipe],
	templateUrl: './lane-rush-game.component.html',
	styleUrl: './lane-rush-game.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { '[attr.data-game-state]': 'phase()' },
})
export class LaneRushGameComponent implements OnDestroy {
	readonly lanes = [0, 1, 2] as const;
	readonly controlDirections = ['left', 'right'] as const;
	readonly phase = signal<IArcadePhase>('ready');
	readonly score = signal(0);
	readonly lives = signal(3);
	readonly time = signal(Math.ceil(RUN_DURATION_MS / 1000));
	readonly statusKey = signal<IArcadeCopyKey>('ready');
	readonly lane = signal<ILane>(1);
	readonly entities = signal<readonly ILaneEntity[]>(this._initialEntities());
	readonly bursts = signal<readonly ILaneBurst[]>([]);

	private readonly _loop = new ArcadeRafLoop((deltaMs) => this.advance(deltaMs));
	private _elapsedMs = 0;
	private _spawnElapsedMs = 0;
	private _spawnIndex = 0;
	private _nextEntityId = 2;
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

	moveLane(delta: -1 | 1): void {
		if (this.phase() !== 'running') return;
		this.lane.set(Math.min(2, Math.max(0, this.lane() + delta)) as ILane);
	}

	advance(deltaMs: number): void {
		if (this.phase() !== 'running') return;
		const elapsed = Math.max(0, deltaMs);
		const seconds = Math.min(50, elapsed) / 1000;
		this._elapsedMs += elapsed;
		this.time.set(Math.max(0, Math.ceil((RUN_DURATION_MS - this._elapsedMs) / 1000)));

		const speed = 31 + Math.min(13, this._elapsedMs / RUN_DURATION_MS * 13);
		let collisions = 0;
		let collected = 0;
		let passed = 0;
		const nextEntities: ILaneEntity[] = [];
		for (const entity of this.entities()) {
			const y = entity.y + speed * seconds;
			const touchesPlayer = entity.lane === this.lane() && y >= 72 && y <= 91;
			if (touchesPlayer) {
				if (entity.kind === 'traffic') collisions += 1;
				else collected += 1;
				continue;
			}
			if (y > 106) {
				if (entity.kind === 'traffic') passed += 1;
				continue;
			}
			nextEntities.push({ ...entity, y });
		}
		this.entities.set(nextEntities);

		if (collected > 0) {
			this.score.update((score) => score + collected * 200);
			this.statusKey.set('collectibles');
			this._spawnBurst('coin');
		} else if (collisions === 0) {
			this.statusKey.set('running');
		}
		if (passed > 0) this.score.update((score) => score + passed * 25);
		if (collisions > 0) {
			this._spawnBurst('hit');
			const nextLives = Math.max(0, this.lives() - collisions);
			this.lives.set(nextLives);
			this.statusKey.set('hit');
			if (nextLives === 0) {
				this._finish('lost');
				return;
			}
		}

		this._spawnElapsedMs += elapsed;
		if (this._spawnElapsedMs >= SPAWN_INTERVAL_MS) {
			this._spawnElapsedMs %= SPAWN_INTERVAL_MS;
			this.entities.update((entities) => [...entities, this._nextEntity()]);
		}

		if (this._elapsedMs >= RUN_DURATION_MS) {
			this.score.update((score) => score + 500 + this.lives() * 100);
			this._finish('won');
		}
	}

	onKeydown(event: KeyboardEvent): void {
		if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
			event.preventDefault();
			this.moveLane(-1);
			return;
		}
		if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
			event.preventDefault();
			this.moveLane(1);
		}
	}

	onPointerDown(event: PointerEvent): void {
		if (this.phase() !== 'running') return;
		const target = event.currentTarget;
		if (!(target instanceof HTMLElement)) return;
		const bounds = target.getBoundingClientRect();
		const lane = Math.min(2, Math.max(0, Math.floor(((event.clientX - bounds.left) / Math.max(1, bounds.width)) * 3))) as ILane;
		this.lane.set(lane);
	}

	onControlDirection(direction: IArcadeControlDirection): void {
		if (direction === 'left') this.moveLane(-1);
		if (direction === 'right') this.moveLane(1);
	}

	lanePosition(lane: ILane): number {
		return 16.6667 + lane * 33.3333;
	}

	ngOnDestroy(): void {
		this._loop.stop();
	}

	private _nextEntity(): ILaneEntity {
		const patterns: ReadonlyArray<readonly [ILane, ILaneEntityKind]> = [
			[2, 'traffic'], [0, 'crystal'], [1, 'traffic'], [2, 'crystal'], [0, 'traffic'], [1, 'crystal'],
		];
		const pattern = patterns[this._spawnIndex % patterns.length] ?? [1, 'traffic'];
		this._spawnIndex += 1;
		const entity: ILaneEntity = {
			id: this._nextEntityId,
			lane: pattern[0],
			kind: pattern[1],
			y: -12,
		};
		this._nextEntityId += 1;
		return entity;
	}

	private _finish(phase: 'won' | 'lost'): void {
		this._loop.stop();
		this.phase.set(phase);
		this.statusKey.set(phase);
	}

	private _resetState(): void {
		this.phase.set('ready');
		this.score.set(0);
		this.lives.set(3);
		this.time.set(Math.ceil(RUN_DURATION_MS / 1000));
		this.statusKey.set('ready');
		this.lane.set(1);
		this.entities.set(this._initialEntities());
		this.bursts.set([]);
		this._elapsedMs = 0;
		this._spawnElapsedMs = 0;
		this._spawnIndex = 0;
		this._nextEntityId = 2;
		this._nextBurstId = 1;
	}

	private _spawnBurst(kind: 'coin' | 'hit'): void {
		this.bursts.set([{ id: this._nextBurstId, lane: this.lane(), kind }]);
		this._nextBurstId += 1;
	}

	private _initialEntities(): readonly ILaneEntity[] {
		return [
			{ id: 0, lane: 2, y: 8, kind: 'traffic' },
			{ id: 1, lane: 0, y: -15, kind: 'crystal' },
		];
	}
}
