import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-docker-page',
	templateUrl: './docker-page.component.html',
	styleUrl: './docker-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DockerPageComponent {}
