import { DEMOS } from './data.constant';
import { demoVisual } from './demo-visuals.constant';

describe('demo visuals', () => {
	it('uses canonical image artwork for every public demo', () => {
		for (const demo of DEMOS) {
			const visual = demoVisual(demo.title);
			expect(visual.imageSrc).toBeTruthy();
		}
	});
});