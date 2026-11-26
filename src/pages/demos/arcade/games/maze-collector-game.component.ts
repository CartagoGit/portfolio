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

interface IMazePosition {
	readonly x: number;
	readonly y: number;
}

interface IMazeCell extends IMazePosition {
	readonly id: string;
	readonly wall: boolean;
}

interface IMazeEffect extends IMazePosition {
	readonly id: number;
	readonly kind: 'coin' | 'hit';
}

const MAZE_ROWS = [
	'#########',
	'#.......#',
	'#.###.#.#',
	'#...#.#.#',
	'###.#.#.#',
	'#.......#',
	'#########',
] as const;
const MAZE_CELLS: readonly IMazeCell[] = MAZE_ROWS.flatMap((row, y) =>
	[...row].map((cell, x) => ({ id: `${x}-${y}`, x, y, wall: cell === '#' })),
);
const PLAYER_START: IMazePosition = { x: 1, y: 1 };
const GUARDIAN_ROUTE: readonly IMazePosition[] = [
	{ x: 7, y: 5 }, { x: 6, y: 5 }, { x: 5, y: 5 }, { x: 5, y: 4 },
	{ x: 5, y: 3 }, { x: 5, y: 2 }, { x: 5, y: 1 }, { x: 6, y: 1 },
	{ x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 },
];
const INITIAL_CRYSTALS: readonly IMazePosition[] = [
	{ x: 7, y: 1 }, { x: 3, y: 3 }, { x: 5, y: 5 }, { x: 1, y: 5 },
];
const GAME_DURATION_MS = 60_000;
const PATROL_STEP_MS = 650;

@Component({
	selector: 'app-maze-collector-game',
	standalone: true,
	imports: [ArcadeControlPadComponent, ArcadeGameShellComponent, ArcadeTextPipe],
	templateUrl: './maze-collector-game.component.html',
	styleUrl: './maze-collector-game.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { '[attr.data-game-state]': 'phase()' },
})
export class MazeCollectorGameComponent implements OnDestroy {
	readonly cells = MAZE_CELLS;
	readonly controlDirections = ['up', 'down', 'left', 'right'] as const;
	readonly phase = signal<IArcadePhase>('ready');
	readonly score = signal(0);
	readonly lives = signal(3);
	readonly time = signal(Math.ceil(GAME_DURATION_MS / 1000));
	readonly statusKey = signal<IArcadeCopyKey>('ready');
	readonly player = signal<IMazePosition>(PLAYER_START);
	readonly guardian = signal<IMazePosition>(GUARDIAN_ROUTE[0] ?? PLAYER_START);
	readonly crystals = signal<readonly IMazePosition[]>(INITIAL_CRYSTALS);
	readonly effects = signal<readonly IMazeEffect[]>([]);

	private readonly _loop = new ArcadeRafLoop((deltaMs) => this.advance(deltaMs));
	private _elapsedMs = 0;
	private _patrolElapsedMs = 0;
	private _patrolIndex = 0;
	private _pointerStart: IMazePosition | null = null;
	private _nextEffectId = 1;

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
		this._patrolElapsedMs += elapsed;
		this.time.set(Math.max(0, Math.ceil((GAME_DURATION_MS - this._elapsedMs) / 1000)));

		if (this._patrolElapsedMs >= PATROL_STEP_MS) {
			const steps = Math.floor(this._patrolElapsedMs / PATROL_STEP_MS);
			this._patrolElapsedMs %= PATROL_STEP_MS;
			for (let step = 0; step < steps; step += 1) {
				this._patrolIndex = (this._patrolIndex + 1) % GUARDIAN_ROUTE.length;
				this.guardian.set(GUARDIAN_ROUTE[this._patrolIndex] ?? PLAYER_START);
				this._handleCollision();
				if (this.phase() !== 'running') return;
			}
		}

		if (this._elapsedMs >= GAME_DURATION_MS) this._finish('lost');
	}

	move(xDelta: -1 | 0 | 1, yDelta: -1 | 0 | 1): void {
		if (this.phase() !== 'running' || (xDelta === 0 && yDelta === 0)) return;
		const player = this.player();
		const next = { x: player.x + xDelta, y: player.y + yDelta };
		if (this._isWall(next)) return;
		const collides = this._samePosition(next, this.guardian());
		this.player.set(next);
		this._handleCollision();
		if (collides || this.phase() !== 'running') return;

		const remaining = this.crystals().filter((crystal) => !this._samePosition(crystal, next));
		if (remaining.length !== this.crystals().length) {
			this.crystals.set(remaining);
			this.score.update((score) => score + 100);
			this.statusKey.set('collectibles');
			this._spawnEffect('coin', next);
			if (remaining.length === 0) {
				this.score.update((score) => score + 800 + this.lives() * 100);
				this._finish('won');
				return;
			}
		}
	}

	onKeydown(event: KeyboardEvent): void {
		const key = event.key.toLowerCase();
		const moves: Readonly<Record<string, readonly [-1 | 0 | 1, -1 | 0 | 1]>> = {
			arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0],
			arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1],
		};
		const move = moves[key];
		if (!move) return;
		event.preventDefault();
		this.move(move[0], move[1]);
	}

	onPointerDown(event: PointerEvent): void {
		if (this.phase() !== 'running') return;
		this._pointerStart = { x: event.clientX, y: event.clientY };
		(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
	}

	onPointerUp(event: PointerEvent): void {
		const start = this._pointerStart;
		this._pointerStart = null;
		if (!start) return;
		const deltaX = event.clientX - start.x;
		const deltaY = event.clientY - start.y;
		if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 18) return;
		if (Math.abs(deltaX) > Math.abs(deltaY)) this.move(deltaX < 0 ? -1 : 1, 0);
		else this.move(0, deltaY < 0 ? -1 : 1);
	}

	onControlDirection(direction: IArcadeControlDirection): void {
		const moves: Readonly<Record<IArcadeControlDirection, readonly [-1 | 0 | 1, -1 | 0 | 1]>> = {
			up: [0, -1],
			down: [0, 1],
			left: [-1, 0],
			right: [1, 0],
		};
		const move = moves[direction];
		this.move(move[0], move[1]);
	}

	isPlayer(cell: IMazeCell): boolean {
		return this._samePosition(cell, this.player());
	}

	isGuardian(cell: IMazeCell): boolean {
		return this._samePosition(cell, this.guardian());
	}

	hasCrystal(cell: IMazeCell): boolean {
		return this.crystals().some((crystal) => this._samePosition(cell, crystal));
	}

	effectAt(cell: IMazeCell): IMazeEffect | undefined {
		return this.effects().find((effect) => this._samePosition(cell, effect));
	}

	ngOnDestroy(): void {
		this._loop.stop();
		this._pointerStart = null;
	}

	private _handleCollision(): void {
		if (!this._samePosition(this.player(), this.guardian())) {
			if (this.statusKey() === 'hit') this.statusKey.set('running');
			return;
		}
		this._spawnEffect('hit', this.player());
		const nextLives = Math.max(0, this.lives() - 1);
		this.lives.set(nextLives);
		this.statusKey.set('hit');
		if (nextLives === 0) {
			this._finish('lost');
			return;
		}
		this.player.set(PLAYER_START);
		this.guardian.set(GUARDIAN_ROUTE[0] ?? PLAYER_START);
		this._patrolIndex = 0;
		this._patrolElapsedMs = 0;
	}

	private _isWall(position: IMazePosition): boolean {
		const row = MAZE_ROWS[position.y];
		return position.x < 0 || position.x > 8 || !row || row[position.x] === '#';
	}

	private _samePosition(left: IMazePosition, right: IMazePosition): boolean {
		return left.x === right.x && left.y === right.y;
	}

	private _finish(phase: 'won' | 'lost'): void {
		this._loop.stop();
		this.phase.set(phase);
		this.statusKey.set(phase);
		this._pointerStart = null;
	}

	private _resetState(): void {
		this.phase.set('ready');
		this.score.set(0);
		this.lives.set(3);
		this.time.set(Math.ceil(GAME_DURATION_MS / 1000));
		this.statusKey.set('ready');
		this.player.set(PLAYER_START);
		this.guardian.set(GUARDIAN_ROUTE[0] ?? PLAYER_START);
		this.crystals.set(INITIAL_CRYSTALS);
		this.effects.set([]);
		this._elapsedMs = 0;
		this._patrolElapsedMs = 0;
		this._patrolIndex = 0;
		this._pointerStart = null;
		this._nextEffectId = 1;
	}

	private _spawnEffect(kind: 'coin' | 'hit', position: IMazePosition): void {
		this.effects.set([{ id: this._nextEffectId, ...position, kind }]);
		this._nextEffectId += 1;
	}
}
