import type { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: ':locale',
		loadComponent: () =>
			import('./page.component').then(({ PageComponent }) => PageComponent),
		children: [
			{
				path: '',
				loadComponent: () =>
					import('../pages/home/home.page').then(
						({ HomePageComponent }) => HomePageComponent
					),
				data: { page: 'home' },
			},
			{
				path: 'work',
				loadComponent: () =>
					import('../pages/work/work.page').then(
						({ WorkPageComponent }) => WorkPageComponent
					),
				data: { page: 'work' },
			},
			{
				path: 'lab',
				loadComponent: () =>
					import('../pages/lab/lab.page').then(
						({ LabPageComponent }) => LabPageComponent
					),
				data: { page: 'lab' },
			},
			{
				path: 'approach',
				loadComponent: () =>
					import('../pages/approach/approach.page').then(
						({ ApproachPageComponent }) => ApproachPageComponent
					),
				data: { page: 'approach' },
			},
			{
				path: 'knowledge',
				loadComponent: () =>
					import('../pages/knowledge/knowledge.page').then(
						({ KnowledgePageComponent }) => KnowledgePageComponent
					),
				data: { page: 'knowledge' },
			},
			{
				path: 'docker',
				loadComponent: () =>
					import('../pages/docker/docker.page').then(
						({ DockerPageComponent }) => DockerPageComponent
					),
				data: { page: 'docker' },
			},
			{
				path: 'demos',
				loadComponent: () =>
					import('../pages/demos/demos.page').then(
						({ DemosPageComponent }) => DemosPageComponent
					),
				data: { page: 'demos' },
			},
			{
				path: 'contact',
				loadComponent: () =>
					import('../pages/contact/contact.page').then(
						({ ContactPageComponent }) => ContactPageComponent
					),
				data: { page: 'contact' },
			},
			{ path: '**', redirectTo: '' },
		],
	},
	{ path: '', pathMatch: 'full', redirectTo: 'en' },
	{ path: '**', redirectTo: 'en' },
];
