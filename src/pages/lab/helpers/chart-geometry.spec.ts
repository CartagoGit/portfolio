import { areaPath, chartPoints, linePath, radarPoints } from './chart-geometry.helper';

describe('lab chart geometry', () => {
	it('normalizes bounded values without mutating the source', () => {
		const source = [0, 50, 120];
		expect(chartPoints(source, { width: 120, height: 100, padding: 10 })).toEqual([
			{ x: 10, y: 90 },
			{ x: 60, y: 50 },
			{ x: 110, y: 10 },
		]);
		expect(source).toEqual([0, 50, 120]);
	});

	it('builds line, area and radar paths from chart data', () => {
		const points = [{ x: 0, y: 40 }, { x: 20, y: 10 }];
		expect(linePath(points)).toBe('M 0 40 L 20 10');
		expect(areaPath(points, 60)).toBe('M 0 40 L 20 10 L 20 60 L 0 60 Z');
		expect(radarPoints([100, 50, 25]).split(' ')).toHaveLength(3);
	});
});
