import { TestBed } from '@angular/core/testing';
import { ProfileLinksComponent } from './profile-links.component';
describe('ProfileLinksComponent', () => {
  it('renders public links from the supplied domain data', async () => {
    await TestBed.configureTestingModule({ imports: [ProfileLinksComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ProfileLinksComponent);
    fixture.componentRef.setInput('links', [
      { label: 'GitHub', href: 'https://github.com/CartagoGit', iconPath: 'M0 0' },
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a')?.textContent).toContain('GitHub');
  });
});
