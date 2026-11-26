import {
	ChangeDetectionStrategy,
	Component,
	input,
	type OnDestroy,
	output,
	signal,
} from '@angular/core';
import type { IArcadeCopyKey } from '../../../lang/arcade.translation';
import { ArcadeTextPipe } from './arcade-text.pipe';

export type IArcadeControlDirection = 'up' | 'down' | 'left' | 'right';
export type IArcadeControlTone = 'cyan' | 'danger' | 'lime';

@Component({
	selector: 'app-arcade-control-pad',
	standalone: true,
	imports: [ArcadeTextPipe],
	templateUrl: './arcade-control-pad.component.html',
	styleUrl: './arcade-control-pad.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArcadeControlPadComponent implements OnDestroy {
	readonly disabled = input(false);
	readonly directions = input<readonly IArcadeControlDirection[]>([
		'up',
		'down',
		'left',
		'right',
	]);
	readonly actionLabelKey = input<IArcadeCopyKey | null>(null);
	readonly actionHint = input('SPACE');
	readonly actionTone = input<IArcadeControlTone>('cyan');
	readonly keyboardHint = input('WASD / ARROWS');
	readonly touchHint = input('TOUCH');
	readonly padClass = input('');
	readonly actionClass = input('');
	readonly directionChange = output<IArcadeControlDirection>();
	readonly action = output<void>();
	readonly pressedDirection = signal<IArcadeControlDirection | null>(null);
	readonly actionIsPressed = signal(false);

	private _releaseTimer?: ReturnType<typeof setTimeout>;

	hasDirection(direction: IArcadeControlDirection): boolean {
		return this.directions().includes(direction);
	}

	pressDirection(direction: IArcadeControlDirection): void {
		if (this.disabled() || !this.hasDirection(direction)) return;
		this._pulseDirection(direction);
		this.directionChange.emit(direction);
	}

	pressAction(): void {
		if (this.disabled()) return;
		this._clearReleaseTimer();
		this.actionIsPressed.set(true);
		this._releaseTimer = setTimeout(() => {
			this.actionIsPressed.set(false);
			this._releaseTimer = undefined;
		}, 140);
		this.action.emit();
	}

	ngOnDestroy(): void {
		this._clearReleaseTimer();
	}

	private _pulseDirection(direction: IArcadeControlDirection): void {
		this._clearReleaseTimer();
		this.pressedDirection.set(direction);
		this._releaseTimer = setTimeout(() => {
			this.pressedDirection.set(null);
			this._releaseTimer = undefined;
		}, 140);
	}

	private _clearReleaseTimer(): void {
		if (this._releaseTimer !== undefined) clearTimeout(this._releaseTimer);
		this._releaseTimer = undefined;
		this.pressedDirection.set(null);
		this.actionIsPressed.set(false);
	}
}
