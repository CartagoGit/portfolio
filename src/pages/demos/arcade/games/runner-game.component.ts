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

interface IRunnerObstacle {
	readonly id: number;
	readonly x: number;
	readonly width: number;
	readonly passed: boolean;
}

const RUN_DURATION_MS = 24_000;
const PLAYER_X = 16;
const JUMP_VELOCITY = 430;
const GRAVITY = 1_080;

@Component({
	selector: 'app-runner-game',
	standalone: true,
	imports: [ArcadeControlPadComponent, ArcadeGameShellComponent, ArcadeTextPipe],
	templateUrl: './runner-game.component.html',
	styleUrl: './runner-game.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { '[attr.data-game-state]': 'phase()' },
})
export class RunnerGameComponent implements OnDestroy {
	readonly controlDirections = ['up'] as const;
	readonly phase = signal<IArcadePhase>('ready');
	readonly score = signal(0);
	readonly lives = signal(3);
	readonly time = signal(Math.ceil(RUN_DURATION_MS / 1000));
	readonly statusKey = signal<IArcadeCopyKey>('ready');
	readonly playerY = signal(0);
	readonly hit = signal(false);
	readonly hitSequence = signal(0);
	readonly obstacles = signal<readonly IRunnerObstacle[]>(this._initialObstacles());

	private readonly _loop = new ArcadeRafLoop((deltaMs) => this.advance(deltaMs));
	private _elapsedMs = 0;
	private _spawnElapsedMs = 0;
	private _nextObstacleId = 1;
	private _jumpVelocity = 0;
	private _hitFlashMs = 0;

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

	jump(): void {
		if (this.phase() !== 'running' || this.playerY() > 0.5) return;
		this._jumpVelocity = JUMP_VELOCITY;
	}

	advance(deltaMs: number): void {
		if (this.phase() !== 'running') return;
		const elapsed = Math.max(0, deltaMs);
		const seconds = Math.min(50, elapsed) / 1000;
		this._elapsedMs += elapsed;
		this.time.set(Math.max(0, Math.ceil((RUN_DURATION_MS - this._elapsedMs) / 1000)));

		if (this._jumpVelocity !== 0 || this.playerY() > 0) {
			this._jumpVelocity -= GRAVITY * seconds;
			const nextY = Math.max(0, this.playerY() + this._jumpVelocity * seconds);
			this.playerY.set(nextY);
			if (nextY === 0) this._jumpVelocity = 0;
		}

		if (this._hitFlashMs > 0) {
			this._hitFlashMs = Math.max(0, this._hitFlashMs - elapsed);
			this.hit.set(this._hitFlashMs > 0);
		}

		const runProgress = Math.min(1, this._elapsedMs / RUN_DURATION_MS);
		const speed = 31 + runProgress * 9;
		let collisions = 0;
		let passed = 0;
		const nextObstacles: IRunnerObstacle[] = [];
		for (const obstacle of this.obstacles()) {
			const x = obstacle.x - speed * seconds;
			const overlapsPlayer = x < PLAYER_X + 3.2 && x + obstacle.width > PLAYER_X - 2.6;
			const collides = overlapsPlayer && !obstacle.passed && this.playerY() < 32;
			const hasPassed = !obstacle.passed && x + obstacle.width < PLAYER_X - 2.6 && !collides;
			if (collides) collisions += 1;
			if (hasPassed) passed += 1;
			if (!collides && x + obstacle.width > -6) {
				nextObstacles.push({ ...obstacle, x, passed: obstacle.passed || hasPassed });
			}
		}
		this.obstacles.set(nextObstacles);

		if (collisions > 0) {
			const nextLives = Math.max(0, this.lives() - collisions);
			this.lives.set(nextLives);
			this.hit.set(true);
			this.hitSequence.update((sequence) => sequence + 1);
			this._hitFlashMs = 180;
			this.statusKey.set('hit');
			if (nextLives === 0) {
				this._finish('lost');
				return;
			}
		} else if (this._hitFlashMs === 0) {
			this.statusKey.set('running');
		}
		if (passed > 0) this.score.update((score) => score + passed * 100);

		this._spawnElapsedMs += elapsed;
		const spawnInterval = 1_250 - runProgress * 280;
		if (this._spawnElapsedMs >= spawnInterval) {
			this._spawnElapsedMs %= spawnInterval;
			this.obstacles.update((obstacles) => [
				...obstacles,
				{
					id: this._nextObstacleId,
					x: 104,
					width: 5.5 + (this._nextObstacleId % 3) * 0.8,
					passed: false,
				},
			]);
			this._nextObstacleId += 1;
		}

		if (this._elapsedMs >= RUN_DURATION_MS) {
			this.score.update((score) => score + 500 + this.lives() * 100);
			this._finish('won');
		}
	}

	onKeydown(event: KeyboardEvent): void {
		if (!['ArrowUp', ' ', 'w', 'W'].includes(event.key)) return;
		event.preventDefault();
		this.jump();
	}

	onPointerDown(): void {
		this.jump();
	}

	onControlDirection(direction: IArcadeControlDirection): void {
		if (direction === 'up') this.jump();
	}

	ngOnDestroy(): void {
		this._loop.stop();
	}

	private _finish(phase: 'won' | 'lost'): void {
		this._loop.stop();
		this.phase.set(phase);
		this.statusKey.set(phase);
		this._jumpVelocity = 0;
	}

	private _resetState(): void {
		this.phase.set('ready');
		this.score.set(0);
		this.lives.set(3);
		this.time.set(Math.ceil(RUN_DURATION_MS / 1000));
		this.statusKey.set('ready');
		this.playerY.set(0);
		this.hit.set(false);
		this.hitSequence.set(0);
		this.obstacles.set(this._initialObstacles());
		this._elapsedMs = 0;
		this._spawnElapsedMs = 0;
		this._nextObstacleId = 1;
		this._jumpVelocity = 0;
		this._hitFlashMs = 0;
	}

	private _initialObstacles(): readonly IRunnerObstacle[] {
		return [{ id: 0, x: 78, width: 6.5, passed: false }];
	}
}
