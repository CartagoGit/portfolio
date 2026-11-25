import { TestBed } from '@angular/core/testing';
import {
	LAB_FULLSCREEN_EVIDENCE_KINDS,
	LabFullscreenEvidenceComponent,
} from './lab-fullscreen-evidence.component';

describe('LabFullscreenEvidenceComponent', () => {
	it('renders a localized matrix with at least three samples for every kind', async () => {
		await TestBed.configureTestingModule({
			imports: [LabFullscreenEvidenceComponent],
		}).compileComponents();

		for (const kind of LAB_FULLSCREEN_EVIDENCE_KINDS) {
			const fixture = TestBed.createComponent(LabFullscreenEvidenceComponent);
			fixture.componentRef.setInput('kind', kind);
			fixture.detectChanges();
			const element = fixture.nativeElement as HTMLElement;
			expect(element.getAttribute('data-evidence-kind')).toBe(kind);
			expect(element.querySelectorAll('[data-evidence-sample]').length).toBeGreaterThanOrEqual(3);
			expect(element.textContent).not.toContain('pages.lab.');
			fixture.destroy();
		}
	});
});
