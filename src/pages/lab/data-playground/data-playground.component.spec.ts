import { TestBed } from '@angular/core/testing';
import { DataPlaygroundComponent } from './data-playground.component';

describe('DataPlaygroundComponent', () => {
	it('filters and reverses data order', async () => {
		await TestBed.configureTestingModule({ imports: [DataPlaygroundComponent] }).compileComponents();
		const fixture = TestBed.createComponent(DataPlaygroundComponent);
		fixture.detectChanges();
		const component = fixture.componentInstance;
		expect(component.visibleRows()[0]?.score).toBe(97);
		component.descending.set(false);
		expect(component.visibleRows()[0]?.score).toBe(62);
		component.query.set('C-02');
		expect(component.visibleRows().map(({ id }) => id)).toEqual(['C-02']);
	});
});
