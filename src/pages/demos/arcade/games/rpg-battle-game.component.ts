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

type IRpgAction = 'attack' | 'guard' | 'spell' | 'heal';

interface IRpgBattleEffect {
	readonly id: number;
	readonly action: IRpgAction;
}

const MAX_PLAYER_HEALTH = 100;
const ENEMY_HEALTH = [48, 68, 92] as const;

@Component({
	selector: 'app-rpg-battle-game',
	standalone: true,
	imports: [ArcadeGameShellComponent, ArcadeTextPipe],
	templateUrl: './rpg-battle-game.component.html',
	styleUrl: './rpg-battle-game.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { '[attr.data-game-state]': 'phase()' },
})
export class RpgBattleGameComponent implements OnDestroy {
	readonly actions = ['attack', 'guard', 'spell', 'heal'] as const;
	readonly phase = signal<IArcadePhase>('ready');
	readonly score = signal(0);
	readonly lives = signal(MAX_PLAYER_HEALTH);
	readonly time = signal(0);
	readonly statusKey = signal<IArcadeCopyKey>('ready');
	readonly wave = signal(1);
	readonly enemyHp = signal<number>(ENEMY_HEALTH[0]);
	readonly enemyMaxHp = signal<number>(ENEMY_HEALTH[0]);
	readonly mana = signal(3);
	readonly healCharges = signal(2);
	readonly guarded = signal(false);
	readonly turn = signal(1);
	readonly battleEffects = signal<readonly IRpgBattleEffect[]>([]);

	private readonly _loop = new ArcadeRafLoop((deltaMs) => this.advance(deltaMs));
	private _elapsedMs = 0;
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
		this._elapsedMs += Math.max(0, deltaMs);
		this.time.set(Math.floor(this._elapsedMs / 1000));
	}

	act(action: IRpgAction): void {
		if (this.phase() !== 'running' || this.isActionDisabled(action)) return;

		this.battleEffects.set([{ id: this._nextEffectId, action }]);
		this._nextEffectId += 1;
		this.statusKey.set(action);
		switch (action) {
			case 'attack': {
				const damage = 14 + this.wave() * 2 + (this.turn() % 3) * 2;
				this.enemyHp.update((health) => Math.max(0, health - damage));
				break;
			}
			case 'guard':
				this.guarded.set(true);
				break;
			case 'spell':
				this.mana.update((mana) => mana - 1);
				this.enemyHp.update((health) => Math.max(0, health - (24 + this.wave() * 4)));
				break;
			case 'heal':
				this.healCharges.update((charges) => charges - 1);
				this.lives.update((health) => Math.min(MAX_PLAYER_HEALTH, health + 28));
				break;
		}

		if (this.enemyHp() === 0) {
			this._defeatEnemy();
			return;
		}
		this._enemyTurn();
	}

	isActionDisabled(action: IRpgAction): boolean {
		return this.phase() !== 'running'
			|| (action === 'spell' && this.mana() === 0)
			|| (action === 'heal' && (this.healCharges() === 0 || this.lives() >= MAX_PLAYER_HEALTH));
	}

	onKeydown(event: KeyboardEvent): void {
		const key = event.key.toLowerCase();
		const actions: Readonly<Record<string, IRpgAction>> = {
			'1': 'attack',
			a: 'attack',
			'2': 'guard',
			g: 'guard',
			'3': 'spell',
			s: 'spell',
			'4': 'heal',
			h: 'heal',
		};
		const action = actions[key];
		if (!action || this.isActionDisabled(action)) return;
		event.preventDefault();
		this.act(action);
	}

	ngOnDestroy(): void {
		this._loop.stop();
	}

	private _enemyTurn(): void {
		const baseDamage = 8 + this.wave() * 4 + (this.turn() % 2) * 2;
		const damage = this.guarded() ? Math.max(2, Math.ceil(baseDamage / 3)) : baseDamage;
		this.lives.update((health) => Math.max(0, health - damage));
		this.guarded.set(false);
		this.turn.update((turn) => turn + 1);
		if (this.lives() === 0) this._finish('lost');
	}

	private _defeatEnemy(): void {
		this.score.update((score) => score + this.wave() * 300 + 100);
		if (this.wave() === 3) {
			this.score.update((score) => score + 500);
			this._finish('won');
			return;
		}
		const nextWave = this.wave() + 1;
		const nextHealth = ENEMY_HEALTH[nextWave - 1] ?? ENEMY_HEALTH[2];
		this.wave.set(nextWave);
		this.enemyMaxHp.set(nextHealth);
		this.enemyHp.set(nextHealth);
		this.mana.update((mana) => Math.min(3, mana + 1));
		this.turn.set(1);
		this.guarded.set(false);
		this.statusKey.set('round');
	}

	private _finish(phase: 'won' | 'lost'): void {
		this._loop.stop();
		this.phase.set(phase);
		this.statusKey.set(phase);
	}

	private _resetState(): void {
		this.phase.set('ready');
		this.score.set(0);
		this.lives.set(MAX_PLAYER_HEALTH);
		this.time.set(0);
		this.statusKey.set('ready');
		this.wave.set(1);
		this.enemyHp.set(ENEMY_HEALTH[0]);
		this.enemyMaxHp.set(ENEMY_HEALTH[0]);
		this.mana.set(3);
		this.healCharges.set(2);
		this.guarded.set(false);
		this.turn.set(1);
		this.battleEffects.set([]);
		this._elapsedMs = 0;
		this._nextEffectId = 1;
	}
}
