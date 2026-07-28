import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DEMOS } from '../../domain/data';
import { TranslatePipe } from '../../lang/translate.pipe';

@Component({
	selector: 'app-demos-page',
	imports: [TranslatePipe],
	templateUrl: './demos.page.html',
	styleUrl: './demos.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemosPageComponent {
	readonly demos = DEMOS;
	readonly score = signal(0);
	readonly target = signal(4);

	hit(index: number): void {
		if (index !== this.target()) return;
		const score = this.score() + 1;
		this.score.set(score);
		this.target.set((index + 2 + score * 3) % 9);
	}
}
