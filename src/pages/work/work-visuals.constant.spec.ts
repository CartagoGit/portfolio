import { describe, expect, it } from 'vitest';
import { TECHNOLOGY_MARQUEE } from '../../domain/data.constant';
import { workTechnologyVisual } from './work-visuals.constant';

describe('workTechnologyVisual', () => {
	it('reuses the canonical technology registry without per-template paths', () => {
		for (const technology of TECHNOLOGY_MARQUEE) {
			expect(workTechnologyVisual(technology.label)).toEqual({
				iconPath: technology.iconPath,
				color: technology.color,
			});
		}
	});

	it('owns generic and fallback visuals for non-marquee labels', () => {
		expect(workTechnologyVisual('Plugins').color).toBe('var(--cyan)');
		expect(workTechnologyVisual('Not registered').iconPath).not.toBe('');
	});
});
