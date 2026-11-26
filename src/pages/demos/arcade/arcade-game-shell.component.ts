import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from '@angular/core';
import type { IArcadeCopyKey } from '../../../lang/arcade.translation';
import { TranslatePipe } from '../../../lang/translate.pipe';
import type { IArcadePhase } from './arcade.types';
import { ArcadeTextPipe } from './arcade-text.pipe';

@Component({
	selector: 'app-arcade-game-shell',
	imports: [ArcadeTextPipe, TranslatePipe],
	templateUrl: './arcade-game-shell.component.html',
	styleUrl: './arcade-game-shell.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArcadeGameShellComponent {
	readonly titleKey = input.required<IArcadeCopyKey>();
	readonly descriptionKey = input.required<IArcadeCopyKey>();
	readonly score = input(0);
	readonly lives = input(0);
	readonly livesLabelKey = input<IArcadeCopyKey>('lives');
	readonly time = input(0);
	readonly phase = input<IArcadePhase>('ready');
	readonly statusKey = input<IArcadeCopyKey>('ready');
	readonly startGame = output<void>();
	readonly resetGame = output<void>();

	start(event: MouseEvent): void {
		this.startGame.emit();
		const shell = (event.currentTarget as Element | null)?.closest<HTMLElement>('.arcade-game-shell');
		queueMicrotask(() => shell?.querySelector<HTMLElement>('[arcade-stage]')?.focus({ preventScroll: true }));
	}
}
