import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	signal,
} from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';
import { TranslateService } from '../../../lang/translate.service';
import { LabFullscreenEvidenceComponent } from '../../../shared/ui/lab-fullscreen-evidence/lab-fullscreen-evidence.component';

type IWorkflowStepId = 'discover' | 'model' | 'build' | 'verify';

const WORKFLOW_ORDER: readonly IWorkflowStepId[] = ['discover', 'model', 'build', 'verify'];
const STEP_COPY: Readonly<Record<IWorkflowStepId, { label: string; hint: string }>> = {
	discover: { label: 'pages.lab.stepDiscoverLabel', hint: 'pages.lab.stepDiscoverHint' },
	model: { label: 'pages.lab.stepModelLabel', hint: 'pages.lab.stepModelHint' },
	build: { label: 'pages.lab.stepBuildLabel', hint: 'pages.lab.stepBuildHint' },
	verify: { label: 'pages.lab.stepVerifyLabel', hint: 'pages.lab.stepVerifyHint' },
};

@Component({
	selector: 'app-workflow-playground',
	imports: [LabFullscreenEvidenceComponent, TranslatePipe],
	templateUrl: './workflow-playground.component.html',
	styleUrl: './workflow-playground.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowPlaygroundComponent {
	private readonly _translate = inject(TranslateService);
	readonly order = signal<readonly IWorkflowStepId[]>(WORKFLOW_ORDER);
	readonly dragged = signal<IWorkflowStepId | null>(null);
	readonly runs = signal(0);
	readonly complete = computed(() =>
		this.order().every((step, index) => step === WORKFLOW_ORDER[index]),
	);
	readonly completedLabel = computed(() =>
		this._translate.instant(
			this.runs() === 1
				? 'pages.lab.completedCountSingular'
				: 'pages.lab.completedCount',
			{ count: this.runs() },
		),
	);

	copy(id: IWorkflowStepId) {
		return STEP_COPY[id];
	}

	startDrag(id: IWorkflowStepId): void {
		this.dragged.set(id);
	}

	dropOn(target: IWorkflowStepId): void {
		const dragged = this.dragged();
		if (!dragged || dragged === target) return;
		this._moveTo(dragged, this.order().indexOf(target));
		this.dragged.set(null);
	}

	move(id: IWorkflowStepId, delta: -1 | 1): void {
		const index = this.order().indexOf(id);
		const target = index + delta;
		if (target < 0 || target >= this.order().length) return;
		this._moveTo(id, target);
	}

	onKeydown(event: KeyboardEvent, id: IWorkflowStepId): void {
		const backwards = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
		const forwards = event.key === 'ArrowRight' || event.key === 'ArrowDown';
		if (!backwards && !forwards) return;
		event.preventDefault();
		this.move(id, backwards ? -1 : 1);
	}

	reset(): void {
		this.order.set(WORKFLOW_ORDER);
		this.dragged.set(null);
	}

	private _moveTo(id: IWorkflowStepId, targetIndex: number): void {
		const wasComplete = this.complete();
		this.order.update((order) => {
			const next = [...order];
			next.splice(next.indexOf(id), 1);
			next.splice(targetIndex, 0, id);
			return next;
		});
		if (!wasComplete && this.complete()) this.runs.update((runs) => runs + 1);
	}
}
