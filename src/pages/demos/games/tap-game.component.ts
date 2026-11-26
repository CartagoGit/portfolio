import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';

type ITapPhase = 'ready' | 'running' | 'result';

@Component({
	selector: 'app-tap-game',
	imports: [TranslatePipe],
	templateUrl: './tap-game.component.html',
	styleUrl: './tap-game.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TapGameComponent {
	readonly phase = signal<ITapPhase>('ready');
	readonly taps = signal(0);
	readonly goal = signal(12);
	readonly round = signal(1);
	readonly completed = signal(0);
	readonly elapsed = signal<number | null>(null);
	readonly best = signal<number | null>(null);
	readonly progress = computed(() => Math.min(100, Math.round((this.taps() / this.goal()) * 100)));
	readonly phaseLabelKey = computed(() => {
		if (this.phase() === 'ready') return 'pages.demos.arcade.ready';
		if (this.phase() === 'running') return 'pages.demos.arcade.running';
		return 'pages.demos.arcade.won';
	});
	private _startedAt = 0;

	start(): void {
		if (this.phase() === 'running') return;
		if (this.phase() === 'result') {
			this.round.update((round) => round + 1);
			this.goal.set(10 + Math.floor(Math.random() * 8));
		}
		this.taps.set(0);
		this.elapsed.set(null);
		this._startedAt = performance.now();
		this.phase.set('running');
	}

	tap(): void {
		if (this.phase() === 'ready') {
			this.start();
			return;
		}
		if (this.phase() !== 'running' || this.taps() >= this.goal()) return;
		const taps = this.taps() + 1;
		this.taps.set(taps);
		if (taps !== this.goal()) return;
		const elapsed = Math.round(performance.now() - this._startedAt);
		this.elapsed.set(elapsed);
		this.best.update((best) => best === null ? elapsed : Math.min(best, elapsed));
		this.completed.update((completed) => completed + 1);
		this.phase.set('result');
	}

	reset(): void {
		this.goal.set(10 + Math.floor(Math.random() * 8));
		this.taps.set(0);
		this.phase.set('ready');
		this.round.set(1);
		this.elapsed.set(null);
	}
}
