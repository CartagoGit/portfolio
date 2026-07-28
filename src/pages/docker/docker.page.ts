import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '../../lang/translate.pipe';

@Component({
	selector: 'app-docker-page',
	imports: [TranslatePipe],
	templateUrl: './docker.page.html',
	styleUrl: './docker.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DockerPageComponent {}
