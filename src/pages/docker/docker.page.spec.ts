import { TestBed } from '@angular/core/testing';
import { TranslateService } from '../../lang/translate.service';
import { PUBLIC_LINKS } from '../../domain/data.constant';
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
		const dockerLink = PUBLIC_LINKS.find(({ label }) => label === 'Docker Hub');
		expect(fixture.componentInstance.dockerVisualSrc).toBe(dockerLink?.imageSrc);
		expect(marks).toHaveLength(6);
		for (const mark of marks)
			expect(new URL(mark.src).pathname).toBe(dockerLink?.imageSrc);
	});
	it('localizes image status and purpose', async () => {
		await TestBed.configureTestingModule({ imports: [DockerPageComponent] }).compileComponents();
		TestBed.inject(TranslateService).setLocale('fr');
		const fixture = TestBed.createComponent(DockerPageComponent);
		fixture.detectChanges();
		const card = fixture.nativeElement.querySelector('.docker-page__image') as HTMLElement;
		expect(card.querySelector('.docker-page__status-badges b')?.textContent).toContain('Maintenue');
		expect(card.querySelector('p')?.textContent).toContain('JavaScript reproductible');
		TestBed.inject(TranslateService).setLocale('en');
	});
});
