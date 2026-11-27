import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	type OnDestroy,
	signal,
} from '@angular/core';
import { FullscreenCoordinatorService } from '../../../core/platform/fullscreen-coordinator.service';
import { TranslatePipe } from '../../../lang/translate.pipe';
import { ArcadeTextPipe } from './arcade-text.pipe';
import type { IArcadeGameId, IArcadeTab } from './arcade.types';
import { LaneRushGameComponent } from './games/lane-rush-game.component';
import { MazeCollectorGameComponent } from './games/maze-collector-game.component';
import { PenaltyGameComponent } from './games/penalty-game.component';
import { RunnerGameComponent } from './games/runner-game.component';
import { RpgBattleGameComponent } from './games/rpg-battle-game.component';
import { ShooterGameComponent } from './games/shooter-game.component';

const ARCADE_TABS: readonly IArcadeTab[] = [
	{ id: 'runner', labelKey: 'runner' },
	{ id: 'shooter', labelKey: 'shooter' },
	{ id: 'lanes', labelKey: 'lanes' },
	{ id: 'penalty', labelKey: 'penalty' },
	{ id: 'rpg', labelKey: 'rpg' },
	{ id: 'maze', labelKey: 'maze' },
];

@Component({
	selector: 'app-arcade-games',
	imports: [
		ArcadeTextPipe,
		TranslatePipe,
		LaneRushGameComponent,
		MazeCollectorGameComponent,
		PenaltyGameComponent,
		RunnerGameComponent,
		RpgBattleGameComponent,
		ShooterGameComponent,
	],
	templateUrl: './arcade-games.component.html',
	styleUrl: './arcade-games.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { '(document:fullscreenchange)': 'syncFullscreen()' },
})
export class ArcadeGamesComponent implements OnDestroy {
	readonly tabs = ARCADE_TABS;
	readonly activeGame = signal<IArcadeGameId>('runner');
	readonly fullscreen = signal(false);
	private readonly _fullscreenCoordinator = inject(FullscreenCoordinatorService);
	private _fullscreenTarget?: HTMLElement;
	private readonly _fullscreenSync = effect(() => {
		const activeTarget = this._fullscreenCoordinator.active();
		if (this._fullscreenTarget)
			this.fullscreen.set(activeTarget === this._fullscreenTarget);
	});

	select(id: IArcadeGameId): void {
		this.activeGame.set(id);
	}

	onTabKeydown(event: KeyboardEvent, index: number): void {
		const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
		if (!delta && event.key !== 'Home' && event.key !== 'End') return;
		event.preventDefault();
		const nextIndex = event.key === 'Home'
			? 0
			: event.key === 'End'
				? this.tabs.length - 1
				: (index + delta + this.tabs.length) % this.tabs.length;
		const next = this.tabs[nextIndex];
		if (!next) return;
		const tabs = (event.currentTarget as HTMLElement)
			.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
		this.select(next.id);
		queueMicrotask(() => tabs?.[nextIndex]?.focus());
	}

	toggleFullscreen(event: MouseEvent): void {
		event.stopPropagation();
		const target = (event.currentTarget as Element | null)
			?.closest<HTMLElement>('.arcade-games');
		if (!target) return;
		this._fullscreenTarget = target;
		if (this._fullscreenCoordinator.active() === target)
			this._fullscreenCoordinator.deactivate(target);
		else
			this._fullscreenCoordinator.activate(target);
		this.fullscreen.set(this._fullscreenCoordinator.active() === target);
	}

	syncFullscreen(): void {
		if (this._fullscreenTarget)
			this.fullscreen.set(this._fullscreenCoordinator.active() === this._fullscreenTarget);
	}

	ngOnDestroy(): void {
		if (this._fullscreenTarget)
			this._fullscreenCoordinator.deactivate(this._fullscreenTarget);
		this._fullscreenSync.destroy();
	}
}
