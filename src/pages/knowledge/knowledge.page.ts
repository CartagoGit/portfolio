import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-knowledge-page',
	templateUrl: './knowledge.page.html',
	styleUrl: './knowledge.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnowledgePageComponent {}
