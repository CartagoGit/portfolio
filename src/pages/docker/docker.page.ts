import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '../../lang/translate.pipe';

interface IDockerImage {
	name: string;
	status: string;
	purpose: string;
	command: string;
	technologies: readonly string[];
	hubHref: string;
	sourceHref: string;
}

const DOCKER_IMAGES: readonly IDockerImage[] = [
	{
		name: 'nodebun',
		status: 'Maintained · updated 2026',
		purpose: 'Reproducible JavaScript development image with Node.js, Bun, npm, fnm and a configured zsh shell.',
		command: 'docker pull cartagodocker/nodebun:latest',
		technologies: ['Node.js', 'Bun', 'npm', 'zsh'],
		hubHref: 'https://hub.docker.com/r/cartagodocker/nodebun',
		sourceHref: 'https://github.com/CartagoGit/DockerNodeBun',
	},
	{
		name: 'zsh',
		status: 'Maintained · updated 2026',
		purpose: 'Batteries-included zsh environment that can become the default shell for existing or newly created container users.',
		command: 'docker pull cartagodocker/zsh:latest',
		technologies: ['zsh', 'Linux', 'Shell'],
		hubHref: 'https://hub.docker.com/r/cartagodocker/zsh',
		sourceHref: 'https://github.com/CartagoGit/DockerZsh',
	},
	{
		name: 'ionic-cover',
		status: 'Ready toolchain',
		purpose: 'Complete Ionic and Capacitor workspace with Angular, Gradle and Android tooling ready for mobile builds.',
		command: 'docker pull cartagodocker/ionic-cover:latest',
		technologies: ['Ionic', 'Capacitor', 'Angular', 'Android'],
		hubHref: 'https://hub.docker.com/r/cartagodocker/ionic-cover',
		sourceHref: 'https://github.com/CartagoGit/DockerIonicCover',
	},
	{
		name: 'angular',
		status: 'Ready toolchain',
		purpose: 'Preconfigured Angular CLI development environment for clean installations and repeatable frontend tasks.',
		command: 'docker pull cartagodocker/angular:latest',
		technologies: ['Angular', 'TypeScript', 'Node.js'],
		hubHref: 'https://hub.docker.com/r/cartagodocker/angular',
		sourceHref: 'https://github.com/CartagoGit/DockerAngular',
	},
	{
		name: 'nestjs-cover',
		status: 'Ready toolchain',
		purpose: 'NestJS-oriented container for API work, with the development tooling separated from application code.',
		command: 'docker pull cartagodocker/nestjs-cover:latest',
		technologies: ['NestJS', 'TypeScript', 'Node.js'],
		hubHref: 'https://hub.docker.com/r/cartagodocker/nestjs-cover',
		sourceHref: 'https://github.com/CartagoGit/DockerNestJsCover',
	},
	{
		name: 'docker-graphql',
		status: 'Archived integration example',
		purpose: 'Container composition example for learning how GraphQL services and Docker networking fit together.',
		command: 'docker pull cartagodocker/docker-graphql:latest',
		technologies: ['GraphQL', 'Docker Compose', 'Node.js'],
		hubHref: 'https://hub.docker.com/r/cartagodocker/docker-graphql',
		sourceHref: 'https://github.com/CartagoGit/docker-graphql',
	},
];

@Component({
	selector: 'app-docker-page',
	imports: [TranslatePipe],
	templateUrl: './docker.page.html',
	styleUrl: './docker.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DockerPageComponent {
	readonly images = DOCKER_IMAGES;
}
