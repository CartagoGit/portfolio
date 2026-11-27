import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'app-evidence-card',
	templateUrl: './evidence-card.component.html',
	styleUrl: './evidence-card.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvidenceCardComponent {
	readonly href = input.required<string>();
	readonly title = input.required<string>();
	readonly number = input.required<string>();
	readonly summary = input.required<string>();
	readonly openLabel = input.required<string>();
	readonly imageSrc = input<string>();
	readonly iconPath = input<string>();
	readonly visualIdentity = input.required<string>();
}
