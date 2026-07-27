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
		home: 'Frontend product engineer',
		work: 'Proyectos destacados',
		lab: 'Laboratorio frontend',
		approach: 'Enfoque',
		knowledge: 'Conocimientos',
		docker: 'Docker',
		demos: 'Demos',
		contact: 'Contacto',
	},
} as const;

const PAGE_DESCRIPTIONS: Readonly<Record<ILocale, string>> = {
	en: 'Mario Cabrero Volarich’s portfolio: product frontend, Angular, TypeScript, mobile delivery and developer tooling.',
	es: 'Portfolio de Mario Cabrero Volarich: frontend de producto, Angular, TypeScript, móvil y tooling.',
} as const;

/// Builds the `<title>` string from the active page + locale.
export function buildTitle(locale: ILocale, page: IPageComponentId): string {
	return `Cartago · ${PAGE_TITLES[locale][page]}`;
}

/// Builds the meta description shown in the result page of every locale.
export function buildDescription(locale: ILocale): string {
	return PAGE_DESCRIPTIONS[locale];
}
