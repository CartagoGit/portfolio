import {
	ChangeDetectionStrategy,
	Component,
	signal,
} from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';

@Component({
	selector: 'app-reflex-game',
	imports: [TranslatePipe],
	templateUrl: './reflex-game.component.html',
	styleUrl: './reflex-game.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReflexGameComponent {
	readonly cells = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;
	readonly score = signal(0);
	readonly target = signal(4);

	hit(index: number): void {
		if (index !== this.target()) return;
		const score = this.score() + 1;
		this.score.set(score);
		this.target.set((index + 2 + score * 3) % this.cells.length);
	}

	reset(): void {
		this.score.set(0);
		this.target.set(4);
	}
}
