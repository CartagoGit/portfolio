import { TestBed } from '@angular/core/testing';
import { WorkPageComponent } from './work-page.component';

describe('WorkPageComponent', () => {
	it('renders the public pinned projects', async () => {
		await TestBed.configureTestingModule({
			imports: [WorkPageComponent],
		}).compileComponents();
		const fixture = TestBed.createComponent(WorkPageComponent);
		fixture.detectChanges();
		expect(fixture.nativeElement.textContent).toContain('MCP Vertex');
		expect(
			fixture.nativeElement.querySelectorAll('a[target="_blank"]').length
		).toBeGreaterThan(5);
	});
});
