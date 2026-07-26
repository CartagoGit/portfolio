import { TestBed } from '@angular/core/testing';
import { ContactPageComponent } from './contact-page.component';
describe('ContactPageComponent', () => {
  it('reports a submitted form', async () => {
    await TestBed.configureTestingModule({ imports: [ContactPageComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ContactPageComponent);
    fixture.componentRef.setInput('sent', false);
    const submit = vi.fn();
    fixture.componentInstance.submitted.subscribe(submit);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    expect(submit).toHaveBeenCalled();
  });
});
