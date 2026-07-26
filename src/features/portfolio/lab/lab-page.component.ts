import { ChangeDetectionStrategy, Component, computed, output, signal } from '@angular/core';
import { PLAYGROUND_STEPS, TELEMETRY } from '../../../domain/portfolio/portfolio.data';
import type {
  ChartType,
  PlaygroundStep,
  TelemetryId,
} from '../../../domain/portfolio/portfolio.types';

@Component({
  selector: 'app-lab-page',
  templateUrl: './lab-page.component.html',
  styleUrl: './lab-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabPageComponent {
  readonly commandRequested = output<void>();
  readonly telemetry = TELEMETRY;
  readonly chartTypes: readonly ChartType[] = ['bars', 'line', 'area'];
  readonly playgroundSteps = PLAYGROUND_STEPS;
  readonly activeTelemetry = signal<TelemetryId>('product');
  readonly chartType = signal<ChartType>('bars');
  readonly playgroundRuns = signal(0);
  readonly draggedStep = signal<PlaygroundStep | null>(null);
  readonly playgroundOrder = signal<PlaygroundStep[]>(['build', 'discover', 'verify', 'model']);
  readonly selectedTelemetry = computed(
    () => this.telemetry.find(({ id }) => id === this.activeTelemetry()) ?? this.telemetry[0],
  );
  readonly playgroundComplete = computed(() =>
    this.playgroundOrder().every((step, index) => step === this.playgroundSteps[index].id),
  );
  readonly playgroundMessage = computed(() =>
    this.playgroundComplete()
      ? 'Loop complete — the product workflow is in a deliberate order.'
      : 'Drag the steps into the order in which a product should be shipped.',
  );

  setTelemetry(metric: TelemetryId): void {
    this.activeTelemetry.set(metric);
  }
  setChartType(type: ChartType): void {
    this.chartType.set(type);
  }
  startDrag(step: PlaygroundStep): void {
    this.draggedStep.set(step);
  }
  dropStep(target: PlaygroundStep): void {
    const dragged = this.draggedStep();
    if (!dragged || dragged === target) return;
    this.playgroundOrder.update((order) => {
      const next = [...order];
      next.splice(next.indexOf(dragged), 1);
      next.splice(next.indexOf(target), 0, dragged);
      return next;
    });
    this.draggedStep.set(null);
    if (this.playgroundComplete()) this.playgroundRuns.update((runs) => runs + 1);
  }
  playgroundStep(step: PlaygroundStep) {
    return this.playgroundSteps.find(({ id }) => id === step) ?? this.playgroundSteps[0];
  }
  resetPlayground(): void {
    this.playgroundOrder.set(['build', 'discover', 'verify', 'model']);
    this.draggedStep.set(null);
  }
}
