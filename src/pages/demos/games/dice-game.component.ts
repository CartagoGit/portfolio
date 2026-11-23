import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';

@Component({ selector: 'app-dice-game', imports: [TranslatePipe], templateUrl: './dice-game.component.html', styleUrl: './dice-game.component.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class DiceGameComponent {
	readonly value = signal(1);
	readonly rolls = signal<readonly number[]>([]);
	readonly faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'] as const;

	roll(): void {
		const next = Math.floor(Math.random() * 6) + 1;
		this.value.set(next);
		this.rolls.update((rolls) => [next, ...rolls].slice(0, 6));
	}
}
