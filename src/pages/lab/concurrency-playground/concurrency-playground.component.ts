import {
	ChangeDetectionStrategy,
	Component,
	computed,
	type OnDestroy,
	signal,
} from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';

type ITaskStatus = 'idle' | 'running' | 'done';

interface IConcurrentTask {
	id: 'data' | 'assets' | 'checks';
	labelKey: string;
	duration: number;
}

const TASKS: readonly IConcurrentTask[] = [
	{ id: 'data', labelKey: 'pages.lab.concurrentData', duration: 600 },
	{ id: 'assets', labelKey: 'pages.lab.concurrentAssets', duration: 1100 },
	{ id: 'checks', labelKey: 'pages.lab.concurrentChecks', duration: 1600 },
] as const;

@Component({
	selector: 'app-concurrency-playground',
	imports: [TranslatePipe],
	templateUrl: './concurrency-playground.component.html',
	styleUrl: './concurrency-playground.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConcurrencyPlaygroundComponent implements OnDestroy {
	readonly tasks = TASKS;
	readonly statuses = signal<Record<string, ITaskStatus>>({
		data: 'idle', assets: 'idle', checks: 'idle',
	});
	readonly running = computed(() =>
		this.tasks.some(({ id }) => this.statuses()[id] === 'running'),
	);
	readonly complete = computed(() =>
		this.tasks.every(({ id }) => this.statuses()[id] === 'done'),
	);
	private readonly _timers = new Set<ReturnType<typeof setTimeout>>();

	run(): void {
		this.cancel();
		this.statuses.set({ data: 'running', assets: 'running', checks: 'running' });
		for (const task of TASKS) {
			const timer = setTimeout(() => {
				this.statuses.update((statuses) => ({ ...statuses, [task.id]: 'done' }));
				this._timers.delete(timer);
			}, task.duration);
			this._timers.add(timer);
		}
	}

	cancel(): void {
		for (const timer of this._timers) clearTimeout(timer);
		this._timers.clear();
		this.statuses.set({ data: 'idle', assets: 'idle', checks: 'idle' });
	}

	ngOnDestroy(): void {
		for (const timer of this._timers) clearTimeout(timer);
		this._timers.clear();
	}
}
