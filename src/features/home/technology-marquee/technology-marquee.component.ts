import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Technology } from '../../../domain/portfolio.types';

@Component({
	selector: 'app-technology-marquee',
	templateUrl: './technology-marquee.component.html',
	styleUrl: './technology-marquee.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnologyMarqueeComponent {
	readonly technologies = input.required<readonly Technology[]>();
}
