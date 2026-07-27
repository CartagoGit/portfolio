import type { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: ':locale/work',
		loadComponent: () =>
			import('./page').then((component) => component.PageComponent),
		data: { page: 'work' },
	},
	{
		path: ':locale/lab',
		loadComponent: () =>
			import('./page').then((component) => component.PageComponent),
		data: { page: 'lab' },
	},
	{
		path: ':locale/approach',
		loadComponent: () =>
			import('./page').then((component) => component.PageComponent),
		data: { page: 'approach' },
	},
	{
		path: ':locale/knowledge',
		loadComponent: () =>
			import('./page').then((component) => component.PageComponent),
		data: { page: 'knowledge' },
	},
	{
		path: ':locale/docker',
		loadComponent: () =>
			import('./page').then((component) => component.PageComponent),
		data: { page: 'docker' },
	},
	{
		path: ':locale/demos',
		loadComponent: () =>
			import('./page').then((component) => component.PageComponent),
		data: { page: 'demos' },
	},
	{
		path: ':locale/contact',
		loadComponent: () =>
			import('./page').then((component) => component.PageComponent),
		data: { page: 'contact' },
	},
	{
		path: ':locale',
		loadComponent: () =>
			import('./page').then((component) => component.PageComponent),
		data: { page: 'home' },
	},
	{ path: '', pathMatch: 'full', redirectTo: 'en' },
	{ path: '**', redirectTo: 'en' },
];
