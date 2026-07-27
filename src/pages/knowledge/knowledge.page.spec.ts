import { TestBed } from '@angular/core/testing';
import { KnowledgePageComponent } from './knowledge.page';

describe('KnowledgePageComponent', () => {
	it('renders the portfolio knowledge taxonomy', async () => {
		await TestBed.configureTestingModule({
			imports: [KnowledgePageComponent],
		}).compileComponents();
		const fixture = TestBed.createComponent(KnowledgePageComponent);
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelectorAll('article')).toHaveLength(
			6
		);
	});
});
