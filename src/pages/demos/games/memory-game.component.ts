import {
	ChangeDetectionStrategy,
	Component,
	inject,
	type OnDestroy,
	signal,
} from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';
import { TranslateService } from '../../../lang/translate.service';
import { shuffleValues } from '../helpers/shuffle.helper';

const MEMORY_VALUES = [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5] as const;

@Component({
	selector: 'app-memory-game',
	imports: [TranslatePipe],
	templateUrl: './memory-game.component.html',
	styleUrl: './memory-game.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemoryGameComponent implements OnDestroy {
	private readonly _translate = inject(TranslateService);
	private _timer?: ReturnType<typeof setTimeout>;
	readonly values = signal(shuffleValues(MEMORY_VALUES));
	readonly open = signal<number[]>([]);
	readonly matched = signal<number[]>([]);
	readonly moves = signal(0);

	openCard(index: number): void {
		const open = this.open();
		if (open.length === 2 || open.includes(index) || this.matched().includes(index)) return;
		const next = [...open, index];
		this.open.set(next);
		if (next.length !== 2) return;
		this.moves.update((moves) => moves + 1);
		const [first, second] = next;
		if (first === undefined || second === undefined) return;
		const matches = this.values()[first] === this.values()[second];
		this._timer = setTimeout(() => {
			if (matches) this.matched.update((matched) => [...matched, first, second]);
			this.open.set([]);
		}, matches ? 280 : 650);
	}

	reset(): void {
		clearTimeout(this._timer);
		this.values.set(shuffleValues(MEMORY_VALUES));
		this.open.set([]);
		this.matched.set([]);
		this.moves.set(0);
	}

	label(index: number, value: number): string {
		if (this.matched().includes(index)) {
			return this._translate.instant('pages.demos.memoryMatchedAria', { value: value + 1 });
		}
		if (this.open().includes(index)) {
			return this._translate.instant('pages.demos.memoryOpenAria', { value: value + 1 });
		}
		return this._translate.instant('pages.demos.memoryHiddenAria', { index: index + 1 });
	}

	ngOnDestroy(): void {
		clearTimeout(this._timer);
	}
}
