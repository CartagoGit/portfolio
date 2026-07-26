import { TestBed } from '@angular/core/testing';
import { DemosPageComponent } from './demos-page.component';
describe('DemosPageComponent', () => {
  it('emits the selected signal cell', async () => {
    await TestBed.configureTestingModule({ imports: [DemosPageComponent] }).compileComponents();
    const fixture = TestBed.createComponent(DemosPageComponent);
    fixture.componentRef.setInput('score', 0);
    fixture.componentRef.setInput('target', 1);
    const hit = vi.fn();
    fixture.componentInstance.hit.subscribe(hit);
    fixture.detectChanges();
    fixture.nativeElement.querySelectorAll('button')[1].click();
    expect(hit).toHaveBeenCalledWith(1);
  });
});
