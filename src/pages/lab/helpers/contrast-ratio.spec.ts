import { contrastRatio } from './contrast-ratio';

describe('contrastRatio', () => {
	it('measures the WCAG contrast endpoints', () => {
		expect(contrastRatio('#000000', '#ffffff')).toBe(21);
		expect(contrastRatio('#ffffff', '#ffffff')).toBe(1);
		expect(contrastRatio('#ffffff', '#000000')).toBe(21);
	});
});
