import { TestBed } from '@angular/core/testing';
import type { IHeroPanelId } from '../../domain/types.interface';
import { WorkProjectVisualComponent } from './work-project-visual.component';

describe('WorkProjectVisualComponent', () => {
	it.each<IHeroPanelId>([
		'overview',
		'workflows',
		'quality',
		'mobile',
		'tooling',
		'delivery',
	])('renders the %s project visual', async (projectId) => {
		await TestBed.configureTestingModule({
			imports: [WorkProjectVisualComponent],
		}).compileComponents();
		const fixture = TestBed.createComponent(WorkProjectVisualComponent);
		fixture.componentRef.setInput('projectId', projectId);
		fixture.detectChanges();
		const element = fixture.nativeElement as HTMLElement;
		expect(element.dataset['project']).toBe(projectId);
		expect(element.querySelector('.work-project-visual > div')).toBeTruthy();
	});
});
