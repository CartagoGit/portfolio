import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { IHeroPanelId } from '../../domain/types';

@Component({
	selector: 'app-work-project-visual',
	templateUrl: './work-project-visual.component.html',
	styleUrl: './work-project-visual.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { '[attr.data-project]': 'projectId()' },
})
export class WorkProjectVisualComponent {
	readonly projectId = input.required<IHeroPanelId>();
}
