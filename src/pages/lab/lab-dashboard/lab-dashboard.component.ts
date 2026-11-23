import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	signal,
} from '@angular/core';
import type { IChartType, ITelemetryId } from '../../../domain/types';
import { TranslatePipe } from '../../../lang/translate.pipe';
import { TranslateService } from '../../../lang/translate.service';
import {
	areaPath,
	chartPoints,
	linePath,
	radarPoints,
} from '../helpers/chart-geometry';

interface ILabMetric {
	id: ITelemetryId;
	value: string;
	labelKey: string;
	titleKey: string;
	valueLabelKey: string;
	noteKey: string;
	bars: readonly number[];
	kpis: ReadonlyArray<readonly [string, string]>;
}

const PRODUCT_METRIC: ILabMetric = {
	id: 'product',
	value: '84%',
	labelKey: 'pages.lab.metricProductLabel',
	titleKey: 'pages.lab.metricProductTitle',
	valueLabelKey: 'pages.lab.metricProductValueLabel',
	noteKey: 'pages.lab.metricProductNote',
	bars: [35, 42, 59, 51, 68, 74, 69, 84],
	kpis: [['12', 'pages.lab.kpiProductFlows'], ['3×', 'pages.lab.kpiProductStates'], ['2s', 'pages.lab.kpiProductBudget']],
};

const METRICS: readonly ILabMetric[] = [
	PRODUCT_METRIC,
	{
		id: 'quality',
		value: '18/18',
		labelKey: 'pages.lab.metricQualityLabel',
		titleKey: 'pages.lab.metricQualityTitle',
		valueLabelKey: 'pages.lab.metricQualityValueLabel',
		noteKey: 'pages.lab.metricQualityNote',
		bars: [55, 58, 71, 67, 79, 85, 89, 94],
		kpis: [['0', 'pages.lab.kpiQualityIssues'], ['18', 'pages.lab.kpiQualityStates'], ['1.8s', 'pages.lab.kpiQualityBudget']],
	},
	{
		id: 'delivery',
		value: '2×',
		labelKey: 'pages.lab.metricDeliveryLabel',
		titleKey: 'pages.lab.metricDeliveryTitle',
		valueLabelKey: 'pages.lab.metricDeliveryValueLabel',
		noteKey: 'pages.lab.metricDeliveryNote',
		bars: [30, 38, 58, 55, 72, 69, 84, 91],
		kpis: [['7', 'pages.lab.kpiDeliveryChecks'], ['3', 'pages.lab.kpiDeliveryPaths'], ['99.9%', 'pages.lab.kpiDeliveryUptime']],
	},
] as const;

const CHART_TYPES: readonly IChartType[] = [
	'bars', 'line', 'area', 'dots', 'pulse', 'wave', 'grid',
	'stacked', 'scatter', 'radar', 'donut', 'heatmap', 'treemap', 'stream',
];

const CHART_LABEL_KEYS: Readonly<Record<IChartType, string>> = {
	bars: 'pages.lab.chartBars',
	line: 'pages.lab.chartLine',
	area: 'pages.lab.chartArea',
	dots: 'pages.lab.chartDots',
	pulse: 'pages.lab.chartPulse',
	wave: 'pages.lab.chartWave',
	grid: 'pages.lab.chartGrid',
	stacked: 'pages.lab.chartStacked',
	scatter: 'pages.lab.chartScatter',
	radar: 'pages.lab.chartRadar',
	donut: 'pages.lab.chartDonut',
	heatmap: 'pages.lab.chartHeatmap',
	treemap: 'pages.lab.chartTreemap',
	stream: 'pages.lab.chartStream',
};

@Component({
	selector: 'app-lab-dashboard',
	imports: [TranslatePipe],
	templateUrl: './lab-dashboard.component.html',
	styleUrl: './lab-dashboard.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabDashboardComponent {
	private readonly _translate = inject(TranslateService);
	readonly metrics = METRICS;
	readonly chartTypes = CHART_TYPES;
	readonly activeMetric = signal<ITelemetryId>('product');
	readonly chartType = signal<IChartType>('bars');
	readonly values = signal<readonly number[]>(PRODUCT_METRIC.bars);
	readonly selectedMetric = computed(
		() => METRICS.find(({ id }) => id === this.activeMetric()) ?? PRODUCT_METRIC,
	);
	readonly points = computed(() => chartPoints(this.values()));
	readonly line = computed(() => linePath(this.points()));
	readonly area = computed(() => areaPath(this.points()));
	readonly radar = computed(() => radarPoints(this.values()));
	readonly donutValue = computed(() => this.values().at(-1) ?? 0);

	selectMetric(id: ITelemetryId): void {
		const metric = METRICS.find((candidate) => candidate.id === id) ?? PRODUCT_METRIC;
		this.activeMetric.set(metric.id);
		this.values.set(metric.bars);
	}

	selectChart(type: IChartType): void {
		this.chartType.set(type);
	}

	refresh(): void {
		this.values.set(this.values().map(() => 35 + Math.round(Math.random() * 60)));
	}

	chartLabel(type: IChartType): string {
		return this._translate.instant(CHART_LABEL_KEYS[type]);
	}
}
