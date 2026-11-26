import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DEMOS } from '../../domain/data.constant';
import { demoVisual, type IDemoVisual } from '../../domain/demo-visuals.constant';
import type { IDemo } from '../../domain/types.interface';
import { TranslatePipe } from '../../lang/translate.pipe';
import { ArcadeGamesComponent } from './arcade/arcade-games.component';
import { DemoGamesComponent } from './games/demo-games.component';
import { ShowcaseComponent } from './showcase/showcase.component';
import { EvidenceCardComponent } from '../../shared/ui/evidence-card/evidence-card.component';

interface IDemoCard extends IDemo, IDemoVisual {}

@Component({
	selector: 'app-demos-page',
	imports: [ArcadeGamesComponent, DemoGamesComponent, ShowcaseComponent, TranslatePipe, EvidenceCardComponent],
	templateUrl: './demos.page.html',
	styleUrl: './demos.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemosPageComponent {
	readonly demos: readonly IDemoCard[] = DEMOS.map((demo) => ({
		...demo,
		...demoVisual(demo.title),
	}));
}
