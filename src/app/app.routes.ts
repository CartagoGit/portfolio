import type { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: ':locale',
		loadComponent: () => import('./page.component').then((module) => module.PageComponent),
		children: [
			{ path: '', loadComponent: () => import('../pages/home/home.page').then((module) => module.HomePageComponent), data: { page: 'home' } },
			{ path: 'work', loadComponent: () => import('../pages/work/work.page').then((module) => module.WorkPageComponent), data: { page: 'work' } },
			{ path: 'lab', loadComponent: () => import('../pages/lab/lab.page').then((module) => module.LabPageComponent), data: { page: 'lab' } },
			{ path: 'approach', loadComponent: () => import('../pages/approach/approach.page').then((module) => module.ApproachPageComponent), data: { page: 'approach' } },
			{ path: 'knowledge', loadComponent: () => import('../pages/knowledge/knowledge.page').then((module) => module.KnowledgePageComponent), data: { page: 'knowledge' } },
			{ path: 'docker', loadComponent: () => import('../pages/docker/docker.page').then((module) => module.DockerPageComponent), data: { page: 'docker' } },
			{ path: 'demos', loadComponent: () => import('../pages/demos/demos.page').then((module) => module.DemosPageComponent), data: { page: 'demos' } },
			{ path: 'contact', loadComponent: () => import('../pages/contact/contact.page').then((module) => module.ContactPageComponent), data: { page: 'contact' } },
			{ path: '**', redirectTo: '' },
		],
	},
	{ path: '', pathMatch: 'full', redirectTo: 'en' },
	{ path: '**', redirectTo: 'en' },
];
