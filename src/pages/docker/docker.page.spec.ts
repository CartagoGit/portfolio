import { TestBed } from '@angular/core/testing';
import { TranslateService } from '../../lang/translate.service';
import { DockerPageComponent } from './docker.page';

describe('DockerPageComponent', () => {
	it('renders the verified public image catalogue', async () => {
		await TestBed.configureTestingModule({
			imports: [DockerPageComponent],
		}).compileComponents();
		const fixture = TestBed.createComponent(DockerPageComponent);
		fixture.detectChanges();
		const element = fixture.nativeElement as HTMLElement;
		const cards = element.querySelectorAll<HTMLElement>('.docker-page__image');

		expect(fixture.componentInstance.images).toHaveLength(6);
		expect(cards).toHaveLength(6);
		expect(element.querySelector('#main-content')).toBeNull();
		expect(
			fixture.componentInstance.images.map(({ name }) => name)
		).toEqual([
			'nodebun',
			'zsh',
			'ionic-cover',
			'angular',
			'nestjs-cover',
			'docker-graphql',
		]);
		for (const image of fixture.componentInstance.images) {
			expect(image.command).toContain(
				`docker pull cartagodocker/${image.name}:latest`
			);
			expect(image.hubHref.startsWith('https://hub.docker.com/')).toBe(true);
			expect(image.sourceHref.startsWith('https://github.com/')).toBe(true);
		}
		const marks = element.querySelectorAll<HTMLImageElement>('.docker-page__image header img');
		expect(new Set(Array.from(marks, ({ src }) => new URL(src).pathname))).toEqual(
			new Set(['/icons/projects/docker.svg'])
		);
	});
	it('localizes image status and purpose', async () => {
		await TestBed.configureTestingModule({ imports: [DockerPageComponent] }).compileComponents();
		TestBed.inject(TranslateService).setLocale('fr');
		const fixture = TestBed.createComponent(DockerPageComponent);
		fixture.detectChanges();
		const card = fixture.nativeElement.querySelector('.docker-page__image') as HTMLElement;
		expect(card.querySelector('header b')?.textContent).toContain('Maintenue');
		expect(card.querySelector('p')?.textContent).toContain('JavaScript reproductible');
		TestBed.inject(TranslateService).setLocale('en');
	});
});
