import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ':locale/work',
    loadComponent: () => import('./portfolio-page').then((component) => component.PortfolioPage),
    data: { page: 'work' },
  },
  {
    path: ':locale/lab',
    loadComponent: () => import('./portfolio-page').then((component) => component.PortfolioPage),
    data: { page: 'lab' },
  },
  {
    path: ':locale/approach',
    loadComponent: () => import('./portfolio-page').then((component) => component.PortfolioPage),
    data: { page: 'approach' },
  },
  {
    path: ':locale/knowledge',
    loadComponent: () => import('./portfolio-page').then((component) => component.PortfolioPage),
    data: { page: 'knowledge' },
  },
  {
    path: ':locale/docker',
    loadComponent: () => import('./portfolio-page').then((component) => component.PortfolioPage),
    data: { page: 'docker' },
  },
  {
    path: ':locale/demos',
    loadComponent: () => import('./portfolio-page').then((component) => component.PortfolioPage),
    data: { page: 'demos' },
  },
  {
    path: ':locale/contact',
    loadComponent: () => import('./portfolio-page').then((component) => component.PortfolioPage),
    data: { page: 'contact' },
  },
  {
    path: ':locale',
    loadComponent: () => import('./portfolio-page').then((component) => component.PortfolioPage),
    data: { page: 'home' },
  },
  { path: '', pathMatch: 'full', redirectTo: 'en' },
  { path: '**', redirectTo: 'en' },
];
