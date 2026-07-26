import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-work-page',
	templateUrl: './work-page.component.html',
	styleUrl: './work-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkPageComponent {}
