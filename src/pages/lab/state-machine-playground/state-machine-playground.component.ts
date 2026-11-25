import { ChangeDetectionStrategy, Component, type OnDestroy, signal } from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';
import { LabFullscreenEvidenceComponent } from '../../../shared/ui/lab-fullscreen-evidence/lab-fullscreen-evidence.component';

type IFlowState = 'idle' | 'running' | 'success' | 'error';

@Component({
	selector: 'app-state-machine-playground',
	imports: [LabFullscreenEvidenceComponent, TranslatePipe],
	templateUrl: './state-machine-playground.component.html',
	styleUrl: './state-machine-playground.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateMachinePlaygroundComponent implements OnDestroy {
	readonly state = signal<IFlowState>('idle');
	readonly states: readonly IFlowState[] = ['idle', 'running', 'success', 'error'];
	private _timer?: ReturnType<typeof setTimeout>;

	run(fail = false): void {
		clearTimeout(this._timer);
		this.state.set('running');
		this._timer = setTimeout(() => this.state.set(fail ? 'error' : 'success'), 650);
	}

	reset(): void { clearTimeout(this._timer); this.state.set('idle'); }
	ngOnDestroy(): void { clearTimeout(this._timer); }
}
