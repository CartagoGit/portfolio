import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DEMOS } from '../../domain/data.constant';
import { demoVisual, type IDemoVisual } from '../../domain/demo-visuals.constant';
import type { IDemo } from '../../domain/types.interface';
import { TranslatePipe } from '../../lang/translate.pipe';
import { DemoGamesComponent } from './games/demo-games.component';
import { ShowcaseComponent } from './showcase/showcase.component';

interface IDemoCard extends IDemo, IDemoVisual {}

@Component({
	selector: 'app-demos-page',
	imports: [DemoGamesComponent, ShowcaseComponent, TranslatePipe],
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
