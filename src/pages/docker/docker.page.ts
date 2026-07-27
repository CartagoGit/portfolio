import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-docker-page',
	templateUrl: './docker.page.html',
	styleUrl: './docker.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DockerPageComponent {}
