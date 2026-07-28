import {
	ChangeDetectionStrategy,
	Component,
	computed,
	output,
	signal,
} from '@angular/core';
import {
	FALLBACK_PLAYGROUND_STEP,
	FALLBACK_TELEMETRY,
	PLAYGROUND_ORDER,
	PLAYGROUND_STEPS,
	TELEMETRY,
} from '../../domain/data';
import type {
	IChartType,
	IPlaygroundStep,
	IPlaygroundStepDefinition,
	ITelemetry,
	ITelemetryId,
} from '../../domain/types';
import { TranslatePipe } from '../../lang/translate.pipe';

@Component({
	selector: 'app-lab-page',
	imports: [TranslatePipe],
	templateUrl: './lab.page.html',
	styleUrl: './lab.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabPageComponent {
	readonly commandRequested = output<void>();
	readonly telemetry = TELEMETRY;
	readonly chartTypes: readonly IChartType[] = ['bars', 'line', 'area'];
	readonly playgroundSteps = PLAYGROUND_STEPS;
	readonly activeTelemetry = signal<ITelemetryId>('product');
	readonly chartType = signal<IChartType>('bars');
	readonly playgroundRuns = signal(0);
	readonly draggedStep = signal<IPlaygroundStep | null>(null);
	readonly playgroundOrder =
		signal<readonly IPlaygroundStep[]>(PLAYGROUND_ORDER);
	readonly selectedTelemetry = computed<ITelemetry>(
		() =>
			this.telemetry.find(({ id }) => id === this.activeTelemetry()) ??
			FALLBACK_TELEMETRY
	);
	readonly playgroundComplete = computed(() => {
		const order = this.playgroundOrder();
		return order.every(
			(step, index) => step === this.playgroundSteps[index]?.id
		);
	});
	readonly playgroundMessage = computed(() =>
		this.playgroundComplete()
			? 'Loop complete — the product workflow is in a deliberate order.'
			: 'Drag the steps into the order in which a product should be shipped.'
	);

	setTelemetry(metric: ITelemetryId): void {
		this.activeTelemetry.set(metric);
	}
	setChartType(type: IChartType): void {
		this.chartType.set(type);
	}
	startDrag(step: IPlaygroundStep): void {
		this.draggedStep.set(step);
	}
	dropStep(target: IPlaygroundStep): void {
		const dragged = this.draggedStep();
		if (!dragged || dragged === target) return;
		this.playgroundOrder.update((order) => {
			const next = [...order];
			next.splice(next.indexOf(dragged), 1);
			next.splice(next.indexOf(target), 0, dragged);
			return next;
		});
		this.draggedStep.set(null);
		if (this.playgroundComplete())
			this.playgroundRuns.update((runs) => runs + 1);
	}
	playgroundStep(step: IPlaygroundStep): IPlaygroundStepDefinition {
		return (
			this.playgroundSteps.find(({ id }) => id === step) ??
			FALLBACK_PLAYGROUND_STEP
		);
	}
	resetPlayground(): void {
		this.playgroundOrder.set(PLAYGROUND_ORDER);
		this.draggedStep.set(null);
	}
}
