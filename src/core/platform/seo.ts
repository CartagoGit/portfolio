import type { ILocale, IPageComponentId } from '../../domain/types';

const PAGE_TITLES: Readonly<
	Record<ILocale, Readonly<Record<IPageComponentId, string>>>
> = {
	en: {
		home: 'Frontend product engineer',
		work: 'Pinned projects',
		lab: 'Frontend lab',
		approach: 'Approach',
		knowledge: 'Knowledge',
		docker: 'Docker',
		demos: 'Demos',
		contact: 'Contact',
	},
	es: {
		home: 'Ingeniería frontend de producto',
		work: 'Proyectos destacados',
		lab: 'Laboratorio frontend',
		approach: 'Enfoque',
		knowledge: 'Conocimientos',
		docker: 'Docker',
		demos: 'Demos',
		contact: 'Contacto',
	},
	fr: {
		home: 'Ingénieur produit frontend',
		work: 'Projets épinglés',
		lab: 'Laboratoire frontend',
		approach: 'Approche',
		knowledge: 'Connaissances',
		docker: 'Docker',
		demos: 'Démos',
		contact: 'Contact',
	},
	de: {
		home: 'Frontend-Produktentwickler',
		work: 'Festgelegte Projekte',
		lab: 'Frontend Labor',
		approach: 'Ansatz',
		knowledge: 'Kenntnisse',
		docker: 'Docker',
		demos: 'Demos',
		contact: 'Kontakt',
	},
} as const;

const PAGE_DESCRIPTIONS: Readonly<Record<ILocale, string>> = {
	en: 'Mario Cabrero Volarich’s portfolio: product frontend, Angular, TypeScript, mobile delivery and developer tooling.',
	es: 'Portfolio de Mario Cabrero Volarich: ingeniería frontend de producto, Angular, TypeScript, móvil y herramientas.',
	fr: 'Portfolio de Mario Cabrero Volarich : ingénierie produit frontend, Angular, TypeScript, livraison mobile et outils de développement.',
	de: 'Portfolio von Mario Cabrero Volarich: Produkt-Frontend, Angular, TypeScript, mobile Bereitstellung und Entwickler-Tools.',
} as const;

/// Builds the `<title>` string from the active page + locale.
export function buildTitle(locale: ILocale, page: IPageComponentId): string {
	return `Cartago · ${PAGE_TITLES[locale][page]}`;
}

/// Builds the meta description shown in the result page of every locale.
export function buildDescription(locale: ILocale): string {
	return PAGE_DESCRIPTIONS[locale];
}
