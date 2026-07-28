import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '../../lang/translate.pipe';

@Component({
	selector: 'app-knowledge-page',
	imports: [TranslatePipe],
	templateUrl: './knowledge.page.html',
	styleUrl: './knowledge.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnowledgePageComponent {}
