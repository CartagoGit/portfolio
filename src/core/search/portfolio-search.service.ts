import { inject, Injectable } from '@angular/core';
import { DEMOS, HERO_PANELS, PUBLIC_LINKS, TECHNOLOGY_MARQUEE } from '../../domain/data.constant';
import type { IPageComponentId } from '../../domain/types.interface';
import { contentKey } from '../../lang/content-key.helper';
import { TranslateService } from '../../lang/translate.service';

export type IPortfolioSearchKind = 'route' | 'project' | 'technology' | 'demo' | 'platform' | 'content';

export interface IPortfolioSearchResult {
	readonly id: string;
	readonly page: IPageComponentId;
	readonly kind: IPortfolioSearchKind;
	readonly label: string;
	readonly detail: string;
	readonly href?: string;
	readonly score: number;
}

interface ISearchEntry extends Omit<IPortfolioSearchResult, 'score'> {
	readonly keywords: string;
}

const ROUTES: ReadonlyArray<readonly [IPageComponentId, string, string]> = [
	['home', 'pages.home.titleLead', 'pages.home.subtitle'],
	['work', 'pages.work.titleLead', 'pages.work.subtitle'],
	['lab', 'pages.lab.titleLead', 'pages.lab.subtitle'],
	['approach', 'pages.approach.titleLead', 'pages.approach.subtitle'],
	['knowledge', 'pages.knowledge.titleLead', 'pages.knowledge.subtitle'],
	['docker', 'pages.docker.titleLead', 'pages.docker.subtitle'],
	['demos', 'pages.demos.titleLead', 'pages.demos.subtitle'],
	['contact', 'pages.contact.titleLead', 'pages.contact.subtitle'],
];

const PAGE_NAMES: Readonly<Record<string, IPageComponentId | undefined>> = {
	home: 'home', work: 'work', lab: 'lab', approach: 'approach',
	knowledge: 'knowledge', docker: 'docker', demos: 'demos', contact: 'contact',
};

const normalized = (value: string): string => value
	.normalize('NFD')
	.replace(/\p{Diacritic}/gu, '')
	.toLocaleLowerCase();

/** Searches route metadata, domain catalogues and every localized leaf. */
@Injectable({ providedIn: 'root' })
export class PortfolioSearchService {
	private readonly _translate = inject(TranslateService);

	search(query: string): readonly IPortfolioSearchResult[] {
		const needle = normalized(query.trim());
		if (needle.length < 2) return [];
		return this._entries()
			.map((entry) => ({
				...entry,
				score: this._score(entry, needle),
			}))
			.filter(({ score }) => score > 0)
			.sort((left, right) => right.score - left.score || left.label.localeCompare(right.label))
			.slice(0, 24)
			.map(({ keywords: _keywords, ...result }) => result);
	}

	private _entries(): readonly ISearchEntry[] {
		const staticEntries: ISearchEntry[] = ROUTES.map(([page, labelKey, detailKey]) => ({
			id: `route-${page}`,
			page,
			kind: 'route',
			label: this._translate.instant(labelKey),
			detail: this._translate.instant(detailKey),
			keywords: `${page} ${this._translate.instant(labelKey)} ${this._translate.instant(detailKey)}`,
		}));

		for (const panel of HERO_PANELS) staticEntries.push({
			id: `project-${panel.id}`,
			page: 'work',
			kind: 'project',
			label: panel.label,
			detail: this._translate.instant(`content.projects.${panel.id}.detail`),
			href: panel.href,
			keywords: `${panel.label} ${panel.stack.join(' ')} ${this._translate.instant(`content.projects.${panel.id}.detail`)}`,
		});
		for (const technology of TECHNOLOGY_MARQUEE) staticEntries.push({
			id: `technology-${contentKey(technology.label)}`,
			page: 'knowledge',
			kind: 'technology',
			label: technology.label,
			detail: this._translate.instantOr(
				`content.technologies.${contentKey(technology.label)}`,
				technology.detail ?? technology.label,
			),
			keywords: `${technology.label} ${technology.detail ?? ''}`,
		});
		for (const demo of DEMOS) staticEntries.push({
			id: `demo-${contentKey(demo.title)}`,
			page: 'demos',
			kind: 'demo',
			label: demo.title,
			detail: this._translate.instant(demo.summaryKey),
			href: demo.url,
			keywords: `${demo.title} ${this._translate.instant(demo.summaryKey)}`,
		});
		for (const link of PUBLIC_LINKS.filter(({ group }) => group === 'platform')) staticEntries.push({
			id: `platform-${contentKey(link.label)}`,
			page: 'contact',
			kind: 'platform',
			label: link.label,
			detail: link.detail ?? this._translate.instant('pages.contact.subtitle'),
			href: link.href,
			keywords: `${link.label} ${link.detail ?? ''}`,
		});

		const translated: ISearchEntry[] = [];
		this._flatten({ value: this._translate.translations(), path: '', output: translated });

		return this._deduplicate([...staticEntries, ...translated]);
	}

	private _flatten(context: { value: unknown; path: string; output: ISearchEntry[] }): void {
		const { value, path, output } = context;
		if (typeof value === 'string') {
			const page = this._pageFor(path);
			if (!page || path.startsWith('lang.')) return;
			output.push({
				id: `copy-${path}`,
				page,
				kind: 'content',
				label: this._translate.instant(`pages.${page}.titleLead`),
				detail: value,
				keywords: `${path} ${value}`,
			});
			return;
		}
		if (!value || typeof value !== 'object') return;
		for (const [key, child] of Object.entries(value))
			this._flatten({ value: child, path: path ? `${path}.${key}` : key, output });
	}

	private _pageFor(path: string): IPageComponentId | undefined {
		const parts = path.split('.');
		if (parts[0] === 'pages') return PAGE_NAMES[parts[1] ?? ''];
		if (parts[0] !== 'content') return undefined;
		if (parts[1] === 'projects') return 'work';
		if (parts[1] === 'technologies') return 'knowledge';
		if (parts[1] === 'capabilities') return 'approach';
		if (parts[1] === 'knowledgeExamples') return 'knowledge';
		if (parts[1] === 'dockerImages') return 'docker';
		if (parts[1] === 'publicLinkDetails') return 'work';
		return undefined;
	}

	private _score(entry: ISearchEntry, needle: string): number {
		const label = normalized(entry.label);
		const haystack = normalized(entry.keywords);
		if (label === needle) return 120;
		if (label.startsWith(needle)) return 100;
		if (label.includes(needle)) return 80;
		if (haystack.includes(needle)) return entry.kind === 'content' ? 30 : 55;
		return 0;
	}

	private _deduplicate(entries: readonly ISearchEntry[]): readonly ISearchEntry[] {
		const seen = new Set<string>();
		return entries.filter((entry) => {
			const key = `${entry.page}|${entry.label}|${entry.detail}`;
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});
	}
}
