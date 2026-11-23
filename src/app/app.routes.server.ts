import { RenderMode, type ServerRoute } from '@angular/ssr';

const PRERENDER_LOCALES = ['en', 'es', 'fr', 'de'] as const;
const PRERENDER_PAGES = [
	'',
	'work',
	'lab',
	'approach',
	'knowledge',
	'docker',
	'demos',
	'contact',
] as const;

function localizedRoute(path: string): ServerRoute {
	return {
		path,
		renderMode: RenderMode.Prerender,
		async getPrerenderParams() {
			return PRERENDER_LOCALES.map((locale) => ({ locale }));
		},
	};
}

export const serverRoutes: ServerRoute[] = [
	...PRERENDER_PAGES.map((page) =>
		localizedRoute(page ? `:locale/${page}` : ':locale')
	),
	{
		path: '**',
		renderMode: RenderMode.Server,
	},
];
