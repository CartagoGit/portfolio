import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';

@Component({ selector: 'app-tap-game', imports: [TranslatePipe], templateUrl: './tap-game.component.html', styleUrl: './tap-game.component.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class TapGameComponent {
	readonly taps = signal(0);
	readonly goal = signal(12);

	tap(): void { if (this.taps() < this.goal()) this.taps.update((taps) => taps + 1); }
	reset(): void { this.goal.set(10 + Math.floor(Math.random() * 8)); this.taps.set(0); }
}
