import { TestBed } from '@angular/core/testing';
import { TechnologyMarqueeComponent } from './technology-marquee.component';

describe('TechnologyMarqueeComponent', () => {
  it('renders supplied technologies twice for seamless motion', async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologyMarqueeComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(TechnologyMarqueeComponent);
    fixture.componentRef.setInput('technologies', [
      { label: 'Angular', iconPath: 'M0 0', color: '#fff' },
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.technology-marquee__token')).toHaveLength(2);
  });
});
