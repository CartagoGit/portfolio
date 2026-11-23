import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HERO_PANELS } from '../../domain/data';
import { TranslatePipe } from '../../lang/translate.pipe';
import type { IHeroPanelId } from '../../domain/types';

interface IRelatedProject {
	label: string;
	href: string;
}

interface IKnowledgeArea {
	id: 'frontend' | 'mobile' | 'quality' | 'tooling' | 'systems' | 'backend';
	labelKey: string;
	stackKey: string;
	detailKey: string;
	iconPath: string;
	exampleKey: string;
	projects: readonly IRelatedProject[];
}

function publicProject(id: IHeroPanelId): IRelatedProject {
	const panel = HERO_PANELS.find((entry) => entry.id === id);
	if (!panel?.href) throw new Error(`Knowledge area requires a public project: ${id}`);
	return { label: panel.label, href: panel.href };
}

const PORTFOLIO_PROJECT: IRelatedProject = {
	label: 'Portfolio',
	href: 'https://github.com/CartagoGit/portfolio',
};

const KNOWLEDGE_AREAS: readonly IKnowledgeArea[] = [
	{
		id: 'frontend',
		labelKey: 'pages.knowledge.tileFrontendLabel',
		stackKey: 'pages.knowledge.tileFrontendStack',
		detailKey: 'pages.knowledge.tileFrontendDetail',
		iconPath: 'M20 3 35 12v17L20 37 5 29V12L20 3Z M5 12l15 8 15-8M20 20v17',
		exampleKey: 'content.knowledgeExamples.frontend',
		projects: [publicProject('tooling'), PORTFOLIO_PROJECT],
	},
	{
		id: 'mobile',
		labelKey: 'pages.knowledge.tileMobileLabel',
		stackKey: 'pages.knowledge.tileMobileStack',
		detailKey: 'pages.knowledge.tileMobileDetail',
		iconPath: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm1 3v12h8V5H8Zm2 14h4v1h-4v-1Z',
		exampleKey: 'content.knowledgeExamples.mobile',
		projects: [publicProject('delivery'), PORTFOLIO_PROJECT],
	},
	{
		id: 'quality',
		labelKey: 'pages.knowledge.tileQualityLabel',
		stackKey: 'pages.knowledge.tileQualityStack',
		detailKey: 'pages.knowledge.tileQualityDetail',
		iconPath: 'M5 29 14 20l7 6 14-16M7 6h5v5H7V6Zm21 24h5v5h-5v-5Z',
		exampleKey: 'content.knowledgeExamples.quality',
		projects: [publicProject('quality'), publicProject('tooling')],
	},
	{
		id: 'tooling',
		labelKey: 'pages.knowledge.tileToolingLabel',
		stackKey: 'pages.knowledge.tileToolingStack',
		detailKey: 'pages.knowledge.tileToolingDetail',
		iconPath: 'M3 4h18v16H3V4Zm3 3 4 4-4 4v-3l1-1-1-1V7Zm7 8h5v2h-5v-2Z',
		exampleKey: 'content.knowledgeExamples.tooling',
		projects: [publicProject('overview'), publicProject('mobile')],
	},
	{
		id: 'systems',
		labelKey: 'pages.knowledge.tileSystemsLabel',
		stackKey: 'pages.knowledge.tileSystemsStack',
		detailKey: 'pages.knowledge.tileSystemsDetail',
		iconPath: 'M12 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM5 16a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm14 0a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM10.5 8.5 6.2 16m7.3-7.5 4.3 7.5M8 19h8',
		exampleKey: 'content.knowledgeExamples.systems',
		projects: [publicProject('overview'), publicProject('quality')],
	},
	{
		id: 'backend',
		labelKey: 'pages.knowledge.tileBackendLabel',
		stackKey: 'pages.knowledge.tileBackendStack',
		detailKey: 'pages.knowledge.tileBackendDetail',
		iconPath: 'M7 30 20 6l13 24H7Zm4-7 9-14 9 14H11Zm-6-9h6v6H5v-6Z',
		exampleKey: 'content.knowledgeExamples.backend',
		projects: [publicProject('workflows'), publicProject('mobile')],
	},
];

@Component({
	selector: 'app-knowledge-page',
	imports: [TranslatePipe],
	templateUrl: './knowledge.page.html',
	styleUrl: './knowledge.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnowledgePageComponent {
	readonly areas = KNOWLEDGE_AREAS;
}
