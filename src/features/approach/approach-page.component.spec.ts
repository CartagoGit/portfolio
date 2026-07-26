import { TestBed } from '@angular/core/testing';
import { ApproachPageComponent } from './approach-page.component';
describe('ApproachPageComponent', () => {
	it('emits capability selection', async () => {
		await TestBed.configureTestingModule({
			imports: [ApproachPageComponent],
		}).compileComponents();
		const capability = {
			id: 'product' as const,
			eyebrow: '01 / Product',
			title: 'Title',
			detail: 'Detail',
			tools: ['Angular'],
			proof: 'Proof',
		};
		const fixture = TestBed.createComponent(ApproachPageComponent);
		fixture.componentRef.setInput('capabilities', [capability]);
		fixture.componentRef.setInput('activeCapability', 'product');
		fixture.componentRef.setInput('selectedCapability', capability);
		const selected = vi.fn();
		fixture.componentInstance.selected.subscribe(selected);
		fixture.detectChanges();
		fixture.nativeElement.querySelector('button').click();
		expect(selected).toHaveBeenCalledWith('product');
	});
});
