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

interface IArcadePoint {
	readonly x: number;
	readonly y: number;
}

interface IShooterTarget extends IArcadePoint {
	readonly id: number;
	readonly remainingMs: number;
}

interface IShooterImpact extends IArcadePoint {
	readonly id: number;
	readonly hit: boolean;
}

const GAME_DURATION_MS = 28_000;
const TARGET_DURATION_MS = 1_450;
const TARGET_GOAL = 10;
const AIM_STEP = 6;

@Component({
	selector: 'app-shooter-game',
	standalone: true,
	imports: [ArcadeControlPadComponent, ArcadeGameShellComponent, ArcadeTextPipe],
	templateUrl: './shooter-game.component.html',
	styleUrl: './shooter-game.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { '[attr.data-game-state]': 'phase()' },
})
export class ShooterGameComponent implements OnDestroy {
	readonly controlDirections = ['up', 'down', 'left', 'right'] as const;
	readonly phase = signal<IArcadePhase>('ready');
	readonly score = signal(0);
	readonly lives = signal(3);
	readonly time = signal(Math.ceil(GAME_DURATION_MS / 1000));
	readonly statusKey = signal<IArcadeCopyKey>('ready');
	readonly hits = signal(0);
	readonly shots = signal(0);
	readonly aim = signal<IArcadePoint>({ x: 50, y: 50 });
	readonly target = signal<IShooterTarget>({ id: 0, x: 50, y: 38, remainingMs: TARGET_DURATION_MS });
	readonly impacts = signal<readonly IShooterImpact[]>([]);

	private readonly _loop = new ArcadeRafLoop((deltaMs) => this.advance(deltaMs));
	private _elapsedMs = 0;
	private _nextTargetId = 1;
	private _nextImpactId = 1;

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

	advance(deltaMs: number): void {
		if (this.phase() !== 'running') return;
		const elapsed = Math.max(0, deltaMs);
		this._elapsedMs += elapsed;
		this.time.set(Math.max(0, Math.ceil((GAME_DURATION_MS - this._elapsedMs) / 1000)));

		const target = this.target();
		const remainingMs = target.remainingMs - elapsed;
		if (remainingMs > 0) {
			this.target.set({ ...target, remainingMs });
		} else {
			const nextLives = Math.max(0, this.lives() - 1);
			this.lives.set(nextLives);
			if (nextLives === 0) {
				this._finish('lost');
				return;
			}
			this.target.set(this._createTarget());
			this.statusKey.set('running');
		}

		if (this._elapsedMs >= GAME_DURATION_MS) this._finish('lost');
	}

	fire(): void {
		this._fireAt(this.aim());
	}

	moveAim(xDelta: number, yDelta: number): void {
		if (this.phase() !== 'running') return;
		this.aim.update((aim) => ({
			x: Math.min(94, Math.max(6, aim.x + xDelta)),
			y: Math.min(90, Math.max(10, aim.y + yDelta)),
		}));
	}

	onKeydown(event: KeyboardEvent): void {
		if ([' ', 'Enter'].includes(event.key)) {
			event.preventDefault();
			this.fire();
			return;
		}
		const directions: Readonly<Record<string, readonly [number, number]>> = {
			ArrowLeft: [-AIM_STEP, 0],
			ArrowRight: [AIM_STEP, 0],
			ArrowUp: [0, -AIM_STEP],
			ArrowDown: [0, AIM_STEP],
			a: [-AIM_STEP, 0],
			d: [AIM_STEP, 0],
			w: [0, -AIM_STEP],
			s: [0, AIM_STEP],
		};
		const direction = directions[event.key];
		if (!direction) return;
		event.preventDefault();
		this.moveAim(direction[0], direction[1]);
	}

	onPointerDown(event: PointerEvent): void {
		if (this.phase() !== 'running') return;
		const target = event.currentTarget;
		if (!(target instanceof HTMLElement)) return;
		const bounds = target.getBoundingClientRect();
		const point = {
			x: Math.min(100, Math.max(0, ((event.clientX - bounds.left) / Math.max(1, bounds.width)) * 100)),
			y: Math.min(100, Math.max(0, ((event.clientY - bounds.top) / Math.max(1, bounds.height)) * 100)),
		};
		this.aim.set(point);
		this._fireAt(point);
	}

	onControlDirection(direction: IArcadeControlDirection): void {
		const moves: Readonly<Record<IArcadeControlDirection, readonly [number, number]>> = {
			up: [0, -AIM_STEP],
			down: [0, AIM_STEP],
			left: [-AIM_STEP, 0],
			right: [AIM_STEP, 0],
		};
		const move = moves[direction];
		this.moveAim(move[0], move[1]);
	}

	ngOnDestroy(): void {
		this._loop.stop();
	}

	private _fireAt(point: IArcadePoint): void {
		if (this.phase() !== 'running') return;
		this.shots.update((shots) => shots + 1);
		const target = this.target();
		const distance = Math.hypot(point.x - target.x, point.y - target.y);
		const hit = distance <= 10.5;
		this.impacts.set([{ id: this._nextImpactId, ...point, hit }]);
		this._nextImpactId += 1;
		if (!hit) {
			this.statusKey.set('running');
			return;
		}

		const nextHits = this.hits() + 1;
		this.hits.set(nextHits);
		this.score.update((score) => score + 100 + Math.round(target.remainingMs / 50));
		this.statusKey.set('hit');
		if (nextHits >= TARGET_GOAL) {
			this.score.update((score) => score + 500 + this.lives() * 100);
			this._finish('won');
			return;
		}
		this.target.set(this._createTarget());
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
		this.time.set(Math.ceil(GAME_DURATION_MS / 1000));
		this.statusKey.set('ready');
		this.hits.set(0);
		this.shots.set(0);
		this.aim.set({ x: 50, y: 50 });
		this.impacts.set([]);
		this._nextTargetId = 1;
		this._nextImpactId = 1;
		this._elapsedMs = 0;
		this.target.set(this._createTarget());
	}

	private _createTarget(): IShooterTarget {
		const id = this._nextTargetId;
		this._nextTargetId += 1;
		return {
			id,
			x: 14 + ((id * 29) % 72),
			y: 18 + ((id * 17) % 62),
			remainingMs: TARGET_DURATION_MS,
		};
	}
}
