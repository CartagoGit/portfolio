import { RenderMode, type ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
	{
		path: ':locale',
		renderMode: RenderMode.Prerender,
		async getPrerenderParams() {
			return [
				{ locale: 'en' },
				{ locale: 'es' },
				{ locale: 'fr' },
				{ locale: 'de' },
			];
		},
	},
	{
		path: '**',
		renderMode: RenderMode.Server,
	},
];
