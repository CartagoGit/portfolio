import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-knowledge-page',
	templateUrl: './knowledge-page.component.html',
	styleUrl: './knowledge-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnowledgePageComponent {}
