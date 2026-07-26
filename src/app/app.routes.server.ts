import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: ':locale',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [{ locale: 'en' }, { locale: 'es' }];
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
