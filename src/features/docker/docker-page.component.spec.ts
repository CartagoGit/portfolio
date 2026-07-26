import { TestBed } from '@angular/core/testing';
import { DockerPageComponent } from './docker-page.component';
describe('DockerPageComponent', () => {
	it('links to the public Docker Hub profile', async () => {
		await TestBed.configureTestingModule({
			imports: [DockerPageComponent],
		}).compileComponents();
		const fixture = TestBed.createComponent(DockerPageComponent);
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('a')?.href).toContain(
			'hub.docker.com'
		);
	});
});
