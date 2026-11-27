import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';
import { LabFullscreenEvidenceComponent } from '../../../shared/ui/lab-fullscreen-evidence/lab-fullscreen-evidence.component';

interface IDataRow { id: string; score: number; latency: number; ready: boolean; }

@Component({
	selector: 'app-data-playground',
	imports: [LabFullscreenEvidenceComponent, TranslatePipe],
	templateUrl: './data-playground.component.html',
	styleUrl: './data-playground.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataPlaygroundComponent {
	readonly rows = [
		{ id: 'A-01', score: 94, latency: 38, ready: true },
		{ id: 'A-02', score: 78, latency: 72, ready: true },
		{ id: 'B-01', score: 62, latency: 91, ready: false },
		{ id: 'B-02', score: 88, latency: 44, ready: true },
		{ id: 'C-01', score: 71, latency: 63, ready: false },
		{ id: 'C-02', score: 97, latency: 31, ready: true },
	] as const satisfies readonly IDataRow[];
	readonly query = signal('');
	readonly descending = signal(true);
	readonly visibleRows = computed(() => {
		const query = this.query().trim().toLowerCase();
		return [...this.rows]
			.filter((row) => !query || row.id.toLowerCase().includes(query))
			.sort((left, right) => this.descending() ? right.score - left.score : left.score - right.score);
	});

	setQuery(event: Event): void { this.query.set((event.currentTarget as HTMLInputElement).value); }
}
