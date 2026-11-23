export interface IChartPoint {
	x: number;
	y: number;
}

export interface IChartGeometry {
	width?: number;
	height?: number;
	padding?: number;
	centerX?: number;
	centerY?: number;
	radius?: number;
}

export function chartPoints(
	values: readonly number[],
	geometry: IChartGeometry = {},
): readonly IChartPoint[] {
	const {
		width = 360,
		height = 170,
		padding = 12,
	} = geometry;
	if (values.length === 0) return [];
	const usableWidth = width - padding * 2;
	const usableHeight = height - padding * 2;
	return values.map((value, index) => ({
		x:
			padding +
			(index / Math.max(1, values.length - 1)) * usableWidth,
		y: padding + (1 - Math.min(100, Math.max(0, value)) / 100) * usableHeight,
	}));
}

export function linePath(points: readonly IChartPoint[]): string {
	return points
		.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
		.join(' ');
}

export function areaPath(
	points: readonly IChartPoint[],
	baseline = 170,
): string {
	if (points.length === 0) return '';
	const first = points[0];
	const last = points.at(-1);
	if (!first || !last) return '';
	return `${linePath(points)} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`;
}

export function radarPoints(
	values: readonly number[],
	geometry: IChartGeometry = {},
): string {
	const { centerX = 90, centerY = 90, radius = 68 } = geometry;
	if (values.length === 0) return '';
	return values
		.map((value, index) => {
			const angle = -Math.PI / 2 + (index / values.length) * Math.PI * 2;
			const length = radius * (Math.min(100, Math.max(0, value)) / 100);
			return `${centerX + Math.cos(angle) * length},${centerY + Math.sin(angle) * length}`;
		})
		.join(' ');
}
