import {
	ChangeDetectionStrategy,
	Component,
	output,
} from '@angular/core';
import { TranslatePipe } from '../../lang/translate.pipe';
import { AccessibilityPlaygroundComponent } from './accessibility-playground/accessibility-playground.component';
import { ConcurrencyPlaygroundComponent } from './concurrency-playground/concurrency-playground.component';
import { LabDashboardComponent } from './lab-dashboard/lab-dashboard.component';
import { MotionPlaygroundComponent } from './motion-playground/motion-playground.component';
import { WorkflowPlaygroundComponent } from './workflow-playground/workflow-playground.component';

@Component({
	selector: 'app-lab-page',
	imports: [
		AccessibilityPlaygroundComponent,
		ConcurrencyPlaygroundComponent,
		LabDashboardComponent,
		MotionPlaygroundComponent,
		TranslatePipe,
		WorkflowPlaygroundComponent,
	],
	templateUrl: './lab.page.html',
	styleUrl: './lab.page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabPageComponent {
	readonly commandRequested = output<void>();
}
