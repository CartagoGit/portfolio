import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '../../../lang/translate.pipe';
import { LabFullscreenEvidenceComponent } from '../../../shared/ui/lab-fullscreen-evidence/lab-fullscreen-evidence.component';

@Component({
	selector: 'app-responsive-playground',
	imports: [LabFullscreenEvidenceComponent, TranslatePipe],
	templateUrl: './responsive-playground.component.html',
	styleUrl: './responsive-playground.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponsivePlaygroundComponent {
	readonly columns = signal(3);
	readonly compact = signal(false);
	readonly tiles = [1, 2, 3, 4, 5, 6] as const;

	setColumns(event: Event): void {
		this.columns.set(Number((event.currentTarget as HTMLInputElement).value));
	}

	setCompact(event: Event): void {
		this.compact.set((event.currentTarget as HTMLInputElement).checked);
	}
}
