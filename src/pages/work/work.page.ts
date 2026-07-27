import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-work-page',
	templateUrl: './work.page.html',
	styleUrl: './work.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkPageComponent {}
