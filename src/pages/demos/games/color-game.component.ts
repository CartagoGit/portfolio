import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';

@Component({ selector: 'app-color-game', imports: [TranslatePipe], templateUrl: './color-game.component.html', styleUrl: './color-game.component.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class ColorGameComponent {
	readonly colors = ['var(--cyan)', 'var(--lime)', 'var(--danger)', 'var(--blue)'] as const;
	readonly target = signal(0);
	readonly score = signal(0);
	readonly message = signal<'prompt' | 'correct' | 'wrong'>('prompt');

	choose(index: number): void {
		if (index === this.target()) {
			this.score.update((score) => score + 1);
			this.message.set('correct');
			this.target.set((this.target() + 1 + Math.floor(Math.random() * 3)) % this.colors.length);
			return;
		}
		this.message.set('wrong');
	}

	reset(): void {
		this.target.set(0);
		this.score.set(0);
		this.message.set('prompt');
	}
}
