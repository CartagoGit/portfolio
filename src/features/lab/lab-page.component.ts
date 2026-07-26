import {
	ChangeDetectionStrategy,
	Component,
	computed,
	output,
	signal,
} from '@angular/core';
import { PLAYGROUND_STEPS, TELEMETRY } from '../../domain/portfolio.data';
import type {
	IChartType,
	IPlaygroundStep,
	ITelemetryId,
} from '../../domain/portfolio.types';

@Component({
	selector: 'app-lab-page',
	templateUrl: './lab-page.component.html',
	styleUrl: './lab-page.component.scss',
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
	readonly playgroundOrder = signal<IPlaygroundStep[]>([
		'build',
		'discover',
		'verify',
		'model',
	]);
	readonly selectedTelemetry = computed(
		() =>
			this.telemetry.find(({ id }) => id === this.activeTelemetry()) ??
			this.telemetry[0]
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
	playgroundStep(step: IPlaygroundStep) {
		return (
			this.playgroundSteps.find(({ id }) => id === step) ??
			this.playgroundSteps[0]
		);
	}
	resetPlayground(): void {
		this.playgroundOrder.set(['build', 'discover', 'verify', 'model']);
		this.draggedStep.set(null);
	}
}
