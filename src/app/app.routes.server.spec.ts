import { RenderMode } from '@angular/ssr';
import { serverRoutes } from './app.routes.server';

describe('localized server routes', () => {
	it('prerenders every product page in all four supported locales', async () => {
		const localized = serverRoutes.filter(
			(route) => route.renderMode === RenderMode.Prerender,
		);
		expect(localized).toHaveLength(8);
		for (const route of localized) {
			if (!('getPrerenderParams' in route) || !route.getPrerenderParams) continue;
			const params = await route.getPrerenderParams();
			expect(params).toEqual([
				{ locale: 'en' },
				{ locale: 'es' },
				{ locale: 'fr' },
				{ locale: 'de' },
			]);
		}
	});
});
