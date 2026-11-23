import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { contentKey } from '../../../lang/content-key';
import { TranslatePipe } from '../../../lang/translate.pipe';
import { TranslateService } from '../../../lang/translate.service';
import type { IMonitorPreview, ITechnology } from '../../../domain/types';

@Component({
	selector: 'app-technology-marquee',
	imports: [TranslatePipe],
	templateUrl: './technology-marquee.component.html',
	styleUrl: './technology-marquee.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnologyMarqueeComponent {
	private readonly _translate = inject(TranslateService);

	readonly technologies = input.required<readonly ITechnology[]>();
	readonly reverse = input(false);
	readonly tooltip = signal<ITechnology | null>(null);
	readonly tooltipX = signal(0);
	readonly tooltipY = signal(0);
	readonly preview = output<IMonitorPreview | null>();

	showTooltip(technology: ITechnology, event: Event): void {
		const target = event.currentTarget;
		if (!(target instanceof HTMLElement)) return;
		const rect = target.getBoundingClientRect();
		this.tooltipX.set(Math.min(window.innerWidth - 100, Math.max(100, rect.left + rect.width / 2)));
		this.tooltipY.set(Math.max(12, rect.top - 10));
		this.tooltip.set(technology);
		this.preview.emit({
			kind: 'technology',
			label: technology.label,
			detail: this._translate.instant(
				`content.technologies.${contentKey(technology.label)}`,
			),
			status: this._translate.instant('pages.home.monitorTechnologyStatus'),
			stack: [technology.label],
			iconPath: technology.iconPath,
			color: technology.color,
		});
	}

	hideTooltip(): void {
		this.tooltip.set(null);
		this.preview.emit(null);
	}
}
