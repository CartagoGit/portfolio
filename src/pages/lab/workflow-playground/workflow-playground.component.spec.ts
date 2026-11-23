import { TestBed } from '@angular/core/testing';
import { WorkflowPlaygroundComponent } from './workflow-playground.component';

describe('WorkflowPlaygroundComponent', () => {
	async function createPlayground() {
		await TestBed.configureTestingModule({ imports: [WorkflowPlaygroundComponent] }).compileComponents();
		return TestBed.createComponent(WorkflowPlaygroundComponent).componentInstance;
	}

	it('supports keyboard-friendly ordering and counts a completed loop', async () => {
		const component = await createPlayground();
		component.move('discover', 1);
		expect(component.order()[0]).toBe('model');
		component.reset();
		expect(component.complete()).toBe(true);
		component.move('discover', 1);
		component.move('discover', -1);
		expect(component.complete()).toBe(true);
		expect(component.runs()).toBe(1);
	});
});
